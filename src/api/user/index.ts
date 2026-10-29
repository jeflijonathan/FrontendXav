import type { DataWithPagination, FetchCallback, FilterParams } from "@common/types";
import { 
    type UserResponseModel, 
    type CreateUserRequest, 
    type UpdateUserRequest 
} from "./model";
import { API } from "../index";

export default class UserService {
    basePath = "/users";
    service = new API();

    async fetchUserProfile(idUser: string, callback: FetchCallback<UserResponseModel>) {
        try {
            const res = await this.service.GET<UserResponseModel>(`${this.basePath}/me/${idUser}`);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err.message || "Failed to fetch user profile");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async fetchUser(
        callback: FetchCallback<DataWithPagination<UserResponseModel[]>>,
        params?: FilterParams
    ) {
        try {
            const res = await this.service.GET<DataWithPagination<UserResponseModel[]>>(this.basePath, params?.params);
            callback.onSuccess({
                data: res.data.data,
                pagination: res.data.pagination
            });
        } catch (err: any) {
            callback.onError(err.message || "Failed to fetch users");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async fetchUserById(idUser: string, callback: FetchCallback<UserResponseModel>) {
        try {
            const res = await this.service.GET<UserResponseModel>(`${this.basePath}/${idUser}`);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err.message || "Failed to fetch user");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async createUser(data: CreateUserRequest, callback: FetchCallback<UserResponseModel>) {
        try {
            const res = await this.service.POST<UserResponseModel>(this.basePath, data);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err.message || "Failed to create user");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async updateUser(idUser: string, data: UpdateUserRequest, callback: FetchCallback<UserResponseModel>) {
        try {
            const res = await this.service.PUT<UserResponseModel>(`${this.basePath}/${idUser}`, data);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err.message || "Failed to update user");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async deleteUser(idUser: string, callback: FetchCallback<any>) {
        try {
            const res = await this.service.DELETE(`${this.basePath}/${idUser}`);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err.message || "Failed to delete user");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }
}