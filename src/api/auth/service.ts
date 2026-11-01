import type { FetchCallback } from "@common/types";
import { API } from "../index";
import { setCookie, deleteCookie, getCookie } from "@utils/cookie";
import LocalStorage from "@utils/localStorage";
import type {
  EmployeeLoginRequestModel,
  StudentLoginRequestModel,
  SelectRoleRequestModel,
  AuthResponseModel,
  SelectRoleResponseModel,
  AuthUserModel,
  ProfileResponseModel,
  ProfileUpdateRequestModel,
} from "./model";

export default class AuthService {
  basePath = "/auth";
  service = new API();

  private saveTokensAndUser(data: AuthResponseModel) {
    if (data.access_token) {
      setCookie("access_token", data.access_token, { maxAge: data.expires_in || 3600 });
      LocalStorage().setItem("accessToken", data.access_token);
    }
    if (data.refresh_token) {
      setCookie("refresh_token", data.refresh_token, { maxAge: 7 * 24 * 3600 });
      LocalStorage().setItem("refreshToken", data.refresh_token);
    }
    if (data.user) {
      LocalStorage().setItem("user", data.user);
      if (data.user.active_role) {
        setCookie("active_role", data.user.active_role, { maxAge: 7 * 24 * 3600 });
        LocalStorage().setItem("active_role", data.user.active_role);
      }
    }
  }

  async loginEmployee(
    data: EmployeeLoginRequestModel,
    callback: FetchCallback<AuthResponseModel>
  ) {
    try {
      const res = await this.service.POST<AuthResponseModel>(
        `${this.basePath}/employee/login`,
        data
      );
      if (res.status === "SUCCESS" || res.status_code === 200) {
        this.saveTokensAndUser(res.data);
        callback.onSuccess(res.data);
      } else {
        callback.onError({ message: res.message, detail: res.details });
      }
    } catch (err: any) {
      callback.onError({ message: err?.message || "Gagal melakukan login pegawai" });
    }
    if (callback.onFullfilled) callback.onFullfilled();
  }

  async loginStudent(
    data: StudentLoginRequestModel,
    callback: FetchCallback<AuthResponseModel>
  ) {
    try {
      const res = await this.service.POST<AuthResponseModel>(
        `${this.basePath}/student/login`,
        data
      );
      if (res.status === "SUCCESS" || res.status_code === 200) {
        this.saveTokensAndUser(res.data);
        callback.onSuccess(res.data);
      } else {
        callback.onError({ message: res.message, detail: res.details });
      }
    } catch (err: any) {
      callback.onError({ message: err?.message || "Gagal melakukan login siswa" });
    }
    if (callback.onFullfilled) callback.onFullfilled();
  }

  async selectRole(
    data: SelectRoleRequestModel,
    callback: FetchCallback<SelectRoleResponseModel>
  ) {
    try {
      const res = await this.service.POST<SelectRoleResponseModel>(
        `${this.basePath}/select-role`,
        data
      );
      if (res.status === "SUCCESS" || res.status_code === 200) {
        if (res.data.access_token) {
          setCookie("access_token", res.data.access_token, { maxAge: 3600 });
          LocalStorage().setItem("accessToken", res.data.access_token);
        }
        if (res.data.active_role) {
          setCookie("active_role", res.data.active_role, { maxAge: 7 * 24 * 3600 });
          LocalStorage().setItem("active_role", res.data.active_role);
        }
        if (res.data.user) {
          LocalStorage().setItem("user", res.data.user);
        }
        callback.onSuccess(res.data);
      } else {
        callback.onError({ message: res.message, detail: res.details });
      }
    } catch (err: any) {
      callback.onError({ message: err?.message || "Gagal memilih role" });
    }
    if (callback.onFullfilled) callback.onFullfilled();
  }

  async logout(callback?: FetchCallback<any>) {
    try {
      const rf = getCookie("refresh_token") || LocalStorage().getItem<string>("refreshToken");
      await this.service.POST(`${this.basePath}/logout`, { refresh_token: rf });
    } catch {
      // Ignore network logout errors, proceed to clear client session
    } finally {
      deleteCookie("access_token");
      deleteCookie("refresh_token");
      deleteCookie("active_role");
      LocalStorage().removeItem("accessToken");
      LocalStorage().removeItem("refreshToken");
      LocalStorage().removeItem("user");
      LocalStorage().removeItem("active_role");
      if (callback?.onSuccess) callback.onSuccess({});
      if (callback?.onFullfilled) callback.onFullfilled();
    }
  }

  async getMe(callback: FetchCallback<AuthUserModel>) {
    try {
      const res = await this.service.GET<AuthUserModel>(`${this.basePath}/me`);
      if (res.status === "SUCCESS" || res.status_code === 200) {
        LocalStorage().setItem("user", res.data);
        callback.onSuccess(res.data);
      } else {
        callback.onError({ message: res.message, detail: res.details });
      }
    } catch (err: any) {
      callback.onError({ message: err?.message || "Gagal memuat profil pengguna" });
    }
    if (callback.onFullfilled) callback.onFullfilled();
  }

  async getProfile(callback: FetchCallback<ProfileResponseModel>) {
    try {
      const res = await this.service.GET<ProfileResponseModel>(`${this.basePath}/profile`);
      if (res.status === "SUCCESS" || res.status_code === 200) {
        callback.onSuccess(res.data);
      } else {
        callback.onError({ message: res.message, detail: res.details });
      }
    } catch (err: any) {
      callback.onError({ message: err?.message || "Gagal memuat data profil" });
    }
    if (callback.onFullfilled) callback.onFullfilled();
  }

  async updateProfile(
    data: ProfileUpdateRequestModel,
    callback: FetchCallback<ProfileResponseModel>
  ) {
    try {
      const res = await this.service.PATCH<ProfileResponseModel>(
        `${this.basePath}/profile`,
        data
      );
      if (res.status === "SUCCESS" || res.status_code === 200) {
        // Sinkronisasi data user dasar di local storage & auth state
        const storedUser = LocalStorage().getItem<AuthUserModel>("user");
        if (storedUser) {
          storedUser.profile_url = res.data.profile_url;
          LocalStorage().setItem("user", storedUser);
        }
        callback.onSuccess(res.data);
      } else {
        callback.onError({ message: res.message, detail: res.details });
      }
    } catch (err: any) {
      callback.onError({ message: err?.message || "Gagal memperbarui profil" });
    }
    if (callback.onFullfilled) callback.onFullfilled();
  }
}

