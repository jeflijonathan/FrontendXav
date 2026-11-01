import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
} from "axios";
import LocalStorage from "@utils/localStorage";
import { getCookie, setCookie, deleteCookie } from "@utils/cookie";
import { catchError } from "@utils/catchError";

type Headers = Record<string, string>;

export interface ApiResponse<T = any> {
  status: string;
  status_code: number;
  message: string;
  data: T;
  details?: string[];
}

export class API {
  protected api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        "X-Tunnel-Skip-AntiPhishing-Page": "true",
      },
    } as AxiosRequestConfig);

    this.api.interceptors.request.use(
      (config) => {
        const token =
          getCookie("access_token") ||
          LocalStorage().getItem<string>("accessToken");
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (
          error.response?.status === 401 &&
          originalRequest &&
          !originalRequest._retry &&
          !originalRequest.url?.includes("/auth/")
        ) {
          originalRequest._retry = true;
          const refreshToken =
            getCookie("refresh_token") ||
            LocalStorage().getItem<string>("refreshToken");
          if (refreshToken) {
            try {
              const refreshRes = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/auth/refresh`,
                { refresh_token: refreshToken },
                { withCredentials: true }
              );
              if (refreshRes.data?.data?.access_token) {
                const newAccessToken = refreshRes.data.data.access_token;
                setCookie("access_token", newAccessToken, { maxAge: 3600 });
                LocalStorage().setItem("accessToken", newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return this.api(originalRequest);
              }
            } catch {
              deleteCookie("access_token");
              deleteCookie("refresh_token");
              deleteCookie("active_role");
              LocalStorage().removeItem("accessToken");
              LocalStorage().removeItem("refreshToken");
              LocalStorage().removeItem("user");
              LocalStorage().removeItem("active_role");
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private getHeaders(customHeaders?: Headers): Headers {
    const headers: Headers = {
      "Content-Type": "application/json",
      ...customHeaders,
    };
    const token =
      getCookie("access_token") ||
      LocalStorage().getItem<string>("accessToken");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  }

  async GET<T = any, U = ApiResponse<T>>(path: string, params?: any): Promise<U> {
    const headers = this.getHeaders();
    const res = this.api.get(path, { params, headers });
    return await catchError<U>(res);
  }

  async POST<T = any, U = ApiResponse<T>>(path: string, data?: any): Promise<U> {
    const headers = this.getHeaders();
    const res = this.api.post(path, data, { headers });
    return await catchError<U>(res);
  }

  async POSTFORMDATA<T = any, U = ApiResponse<T>>(path: string, data: FormData): Promise<U> {
    const headers = this.getHeaders();
    // Override the instance's application/json content type to let Axios handle FormData
    headers["Content-Type"] = "multipart/form-data";
    const res = this.api.post(path, data, { headers });
    return await catchError<U>(res);
  }

  async PUT<T = any, U = ApiResponse<T>>(path: string, data?: any): Promise<U> {
    const headers = this.getHeaders();
    const res = this.api.put(path, data, { headers });
    return await catchError<U>(res);
  }

  async PATCH<T = any, U = ApiResponse<T>>(path: string, data?: any): Promise<U> {
    const headers = this.getHeaders();
    const res = this.api.patch(path, data, { headers });
    return await catchError<U>(res);
  }

  async DELETE<T = any, U = ApiResponse<T>>(path: string): Promise<U> {
    const headers = this.getHeaders();
    const res = this.api.delete(path, { headers });
    return await catchError<U>(res);
  }

  async DOWNLOADBLOB(path: string, params?: any, callback?: any) {
    const headers = this.getHeaders();
    try {
      const response = await this.api.get(path, {
        params,
        headers,
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });

      const
        url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const contentDisposition = response.headers["content-disposition"];
      let fileName = "file.xlsx";
      if (contentDisposition) {
        const matches = /filename="?([^"]+)"?/.exec(contentDisposition);
        if (matches && matches[1]) {
          fileName = matches[1];
        }
      }

      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      if (callback && callback.onSuccess) {
        callback.onSuccess(true);
      }
      return {
        status: "success",
        status_code: 200,
        message: "Download Success",
        data: true,
      };
    } catch (error: any) {
      console.error("Download error", error);
      let message = "Download failed";

      if (error.response && error.response.data instanceof Blob) {
        try {
          const text = await error.response.data.text();
          const json = JSON.parse(text);
          message = json.message || message;
        } catch (e) { }
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }

      if (callback && callback.onError) callback.onError(message);
      throw error;
    }
  }
}