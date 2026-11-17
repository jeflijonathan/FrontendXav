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
        const res = await this.service.GET<DataWithPagination<StudentResponseModel[]>>(this.basePath, params?.params);
        if (res.status === "SUCCESS") {
            callback.onSuccess({
                data: res.data.data,
                pagination: res.data.pagination,
            });
        } else {
            callback.onError({ message: res.message || "Failed to fetch students", detail: [] });
        }

        if (callback.onFullfilled) callback.onFullfilled();
    }

    async getById(id: string, callback: FetchCallback<StudentResponseModel>) {
        const res = await this.service.GET<StudentResponseModel>(`${this.basePath}${id}`);
        if (res.status === "SUCCESS") {
            callback.onSuccess(res.data);
        } else {
            callback.onError({ message: res.message || "Failed to fetch students", detail: [] });
        }

        if (callback.onFullfilled) callback.onFullfilled();
    }

    async create(data: CreateStudentRequestModel, callback: FetchCallback<StudentResponseModel>) {
        const res = await this.service.POST<StudentResponseModel>(this.basePath, data);
        if (res.status === "SUCCESS") {
            callback.onSuccess(res.data);
        } else {
            callback.onError({ message: res.message || "Failed to Create students", detail: [] });
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async update(id: string, data: UpdateStudentRequestModel, callback: FetchCallback<StudentResponseModel>) {
        const res = await this.service.PUT<StudentResponseModel>(`${this.basePath}${id}`, data);
        if (res.status === "SUCCESS") {
            callback.onSuccess(res.data);
        } else {
            callback.onError({ detail: res.details, message: res.message || "Failed to update student" });
        }

        if (callback.onFullfilled) callback.onFullfilled();
    }

    async delete(id: string, callback: FetchCallback<any>) {

        const res = await this.service.DELETE<StudentResponseModel>(`${this.basePath}${id}`);

        if (res.status === "SUCCESS") {
            callback.onSuccess(res.data);
        } else {
            callback.onError({ message: res.message || "Failed to delete student", detail: res.details });
        }

        if (callback.onFullfilled) callback.onFullfilled();
    }

    async getMyProfile(callback: FetchCallback<StudentResponseModel>) {
        const res = await this.service.GET<StudentResponseModel>(`${this.basePath}me`);
        if (res.status === "SUCCESS") {
            callback.onSuccess(res.data);
        } else {
            callback.onError({ message: res.message || "Gagal memuat profil siswa", detail: res.details || [] });
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async updateMyProfile(data: UpdateStudentRequestModel, callback: FetchCallback<StudentResponseModel>) {
        const res = await this.service.PUT<StudentResponseModel>(`${this.basePath}me`, data);
        if (res.status === "SUCCESS") {
            callback.onSuccess(res.data);
        } else {
            callback.onError({ message: res.message || "Gagal memperbarui profil siswa", detail: res.details || [] });
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }
}
