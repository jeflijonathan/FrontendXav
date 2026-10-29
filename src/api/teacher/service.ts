import type { DataWithPagination, FetchCallback, FilterParams } from "@common/types";
import { type TeacherResponseModel, type CreateTeacherRequest, type UpdateTeacherRequest } from "./model";
import { API } from "../index";

export default class TeacherService {
    basePath = "/teachers";
    service = new API();

    async getAll(
        callback: FetchCallback<DataWithPagination<TeacherResponseModel[]>>,
        params?: FilterParams
    ) {
        try {
            const res = await this.service.GET<DataWithPagination<TeacherResponseModel[]>>(this.basePath, params?.params);
            callback.onSuccess({
                data: res.data.data,
                pagination: res.data.pagination
            });
        } catch (err: any) {
            callback.onError(err.message || "Failed to fetch teachers");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async getById(id: string, callback: FetchCallback<TeacherResponseModel>) {
        try {
            const res = await this.service.GET<TeacherResponseModel>(`${this.basePath}/${id}`);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err.message || "Failed to fetch teacher");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async create(data: CreateTeacherRequest, callback: FetchCallback<TeacherResponseModel>) {
        try {
            const res = await this.service.POST<TeacherResponseModel>(this.basePath, data);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err.message || "Failed to create teacher");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async update(id: string, data: UpdateTeacherRequest, callback: FetchCallback<TeacherResponseModel>) {
        try {
            const res = await this.service.PUT<TeacherResponseModel>(`${this.basePath}/${id}`, data);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err.message || "Failed to update teacher");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async delete(id: string, callback: FetchCallback<any>) {
        try {
            const res = await this.service.DELETE(`${this.basePath}/${id}`);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err.message || "Failed to delete teacher");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }
}
