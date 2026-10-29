import type { DataWithPagination, FetchCallback, FilterParams } from "@common/types";
import type { StudentResponseModel, CreateStudentRequestModel, UpdateStudentRequestModel } from "./model";
import { API } from "../index";

export default class StudentService {
    basePath = "/students/";
    service = new API();

    async getAll(
        callback: FetchCallback<DataWithPagination<StudentResponseModel[]>>,
        params?: FilterParams
    ) {
        try {
            const res = await this.service.GET<any>(this.basePath, params?.params);
            if (res.status === "SUCCESS" || res.status_code === 200) {
                const list: StudentResponseModel[] = Array.isArray(res.data)
                    ? res.data
                    : Array.isArray(res.data?.data)
                    ? res.data.data
                    : [];
                const pagination = res.data?.pagination || {
                    page: 1,
                    limit: list.length || 10,
                    total_data: list.length,
                    total_pages: 1,
                };
                callback.onSuccess({
                    data: list,
                    pagination: pagination,
                });
            } else {
                callback.onError(res.message || "Failed to fetch students");
            }
        } catch (err: any) {
            callback.onError(err.message || "Failed to fetch students");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async getById(id: string, callback: FetchCallback<StudentResponseModel>) {
        try {
            const res = await this.service.GET<any>(`${this.basePath}${id}`);
            if (res.status === "SUCCESS" || res.status_code === 200) {
                callback.onSuccess(res.data);
            } else {
                callback.onError(res.message || "Failed to fetch student");
            }
        } catch (err: any) {
            callback.onError(err.message || "Failed to fetch student");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async create(data: CreateStudentRequestModel, callback: FetchCallback<StudentResponseModel>) {
        try {
            const res = await this.service.POST<any>(this.basePath, data);
            if (res.status === "SUCCESS" || res.status_code === 200 || res.status_code === 201) {
                callback.onSuccess(res.data);
            } else {
                callback.onError(res.message || "Failed to create student");
            }
        } catch (err: any) {
            callback.onError(err.message || "Failed to create student");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async update(id: string, data: UpdateStudentRequestModel, callback: FetchCallback<StudentResponseModel>) {
        try {
            const res = await this.service.PUT<any>(`${this.basePath}${id}`, data);
            if (res.status === "SUCCESS" || res.status_code === 200) {
                callback.onSuccess(res.data);
            } else {
                callback.onError(res.message || "Failed to update student");
            }
        } catch (err: any) {
            callback.onError(err.message || "Failed to update student");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async delete(id: string, callback: FetchCallback<any>) {
        try {
            const res = await this.service.DELETE<any>(`${this.basePath}${id}`);
            if (res.status === "SUCCESS" || res.status_code === 200) {
                callback.onSuccess(res.data);
            } else {
                callback.onError(res.message || "Failed to delete student");
            }
        } catch (err: any) {
            callback.onError(err.message || "Failed to delete student");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }
}
