import type { DataWithPagination, FetchCallback, FilterParams } from "@common/types";
import type { TeacherSubjectResponseModel, CreateTeacherSubjectRequest, UpdateTeacherSubjectRequest } from "./model";
import { API } from "../index";

export default class TeacherSubjectService {
    basePath = "/teacher-subjects";
    service = new API();

    async getAll(
        callback: FetchCallback<DataWithPagination<TeacherSubjectResponseModel[]>>,
        params: FilterParams
    ) {
        try {
            const res = await this.service.GET<TeacherSubjectResponseModel[]>(this.basePath, params?.params);
            const dataList = Array.isArray(res?.data) ? res.data : [];
            callback.onSuccess({
                data: dataList,
                pagination: {
                    page: Number(params?.params?.page) || 1,
                    limit: Number(params?.params?.limit) || 10,
                    total_items: dataList.length,
                    total_pages: 1,
                },
            });
        } catch (err: any) {
            callback.onError(err.message || "Failed to fetch teacher subjects");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async create(data: CreateTeacherSubjectRequest, callback: FetchCallback<TeacherSubjectResponseModel>) {
        try {
            const res = await this.service.POST<TeacherSubjectResponseModel>(this.basePath, data);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err.message || "Failed to create teacher subject");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async update(id: string, data: UpdateTeacherSubjectRequest, callback: FetchCallback<TeacherSubjectResponseModel>) {
        try {
            const res = await this.service.PATCH<TeacherSubjectResponseModel>(`${this.basePath}/${id}`, data);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err.message || "Failed to update teacher subject");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async delete(id: string, callback: FetchCallback<any>) {
        try {
            const res = await this.service.DELETE(`${this.basePath}/${id}`);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err.message || "Failed to delete teacher subject");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }
}
