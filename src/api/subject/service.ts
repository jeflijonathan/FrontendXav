import type { DataWithPagination, FetchCallback, FilterParams } from "@common/types";
import type {
    SubjectResponseModel,
    CreateSubjectRequestModel,
    UpdateSubjectRequestModel,
} from "./model";
import { API } from "../index";

export default class SubjectService {
    basePath = "/subjects";
    service = new API();

    async getAll(
        callback: FetchCallback<DataWithPagination<SubjectResponseModel[]>>,
        params?: FilterParams
    ) {
        const res = await this.service.GET<DataWithPagination<SubjectResponseModel[]>>(this.basePath, params?.params);

        if (res.status === "SUCCESS") {
            callback.onSuccess({
                data: res.data.data,
                pagination: res.data.pagination
            });
        } else {
            callback.onError({ message: res.message, detail: res.details });
        }

        if (callback.onFullfilled) callback.onFullfilled();
    }

    async getById(id: string, callback: FetchCallback<SubjectResponseModel>) {
        const res = await this.service.GET<SubjectResponseModel>(`${this.basePath}/${id}`);
        if (res.status === "SUCCESS" || res.status_code === 200) {
            callback.onSuccess(res.data);
        } else {
            callback.onError({ message: res.message, detail: res.details });
        }

        if (callback.onFullfilled) callback.onFullfilled();
    }

    async create(
        data: CreateSubjectRequestModel,
        callback: FetchCallback<SubjectResponseModel>
    ) {
        try {
            const res = await this.service.POST<SubjectResponseModel>(this.basePath, data);
            if (res.status === "SUCCESS" || res.status_code === 201 || res.status_code === 200) {
                callback.onSuccess(res.data);
            } else {
                callback.onError({ message: res.message, detail: res.details });
            }
        } catch (err: any) {
            callback.onError({ message: err?.message || "Gagal membuat mata pelajaran" });
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async update(
        id: string,
        data: UpdateSubjectRequestModel,
        callback: FetchCallback<SubjectResponseModel>
    ) {
        const res = await this.service.PATCH<SubjectResponseModel>(`${this.basePath}/${id}`, data);

        if (res.status === "SUCCESS" || res.status_code === 200) {
            callback.onSuccess(res.data);
        } else {
            callback.onError({ message: res.message, detail: res.details });
        }

        if (callback.onFullfilled) callback.onFullfilled();
    }

    async delete(id: string, callback: FetchCallback<any>) {

        const res = await this.service.DELETE(`${this.basePath}/${id}`);
        if (res.status === "SUCCESS" || res.status_code === 200) {
            callback.onSuccess(res.data);
        } else {
            callback.onError({ message: res.message, detail: res.details });
        }

        if (callback.onFullfilled) callback.onFullfilled();
    }

    // async getSubjectRequest(
    //     callback: FetchCallback<DataWithPagination<SubjectResponseModel[]>>,
    //     params: FilterParams
    // ) {
    //     return this.getAll(callback, params);
    // }

    // async createSubjectRequest(
    //     data: CreateSubjectRequestModel,
    //     callback: FetchCallback<SubjectResponseModel>
    // ) {
    //     return this.create(data, callback);
    // }

    // async updateSubjectRequest(
    //     id: string,
    //     data: UpdateSubjectRequestModel,
    //     callback: FetchCallback<SubjectResponseModel>
    // ) {
    //     return this.update(id, data, callback);
    // }

    // async deleteSubjectRequest(id: string, callback: FetchCallback<any>) {
    //     return this.delete(id, callback);
    // }
}
