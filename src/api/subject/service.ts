import type { DataWithPagination, FetchCallback, FilterParams } from "@types";
import type { SubjectResponseModel, CreateSubjectRequestModel, UpdateSubjectRequestModel } from "./model";
import { API } from "../index";

export default class SubjectService {
    basePath = "/subjects";
    service = new API();

    async getSubjectRequest(
        callback: FetchCallback<DataWithPagination<SubjectResponseModel[]>>,
        params: FilterParams
    ) {
        try {
            const res = await this.service.GET<SubjectResponseModel[]>(this.basePath, params?.params);
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
            callback.onError(err.message || "Failed to fetch subjects");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async createSubjectRequest(
        data: CreateSubjectRequestModel,
        callback: FetchCallback<SubjectResponseModel>
    ) {
        try {
            const res = await this.service.POST<SubjectResponseModel>(this.basePath, data);
          
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err.message || "Failed to create subject");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async updateSubjectRequest(
        id: string,
        data: UpdateSubjectRequestModel,
        callback: FetchCallback<SubjectResponseModel>
    ) {
        try {
            const res = await this.service.PATCH<SubjectResponseModel>(`${this.basePath}/${id}`, data);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err.message || "Failed to update subject");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async deleteSubjectRequest(
        id: string,
        callback: FetchCallback<any>
    ) {
        try {
            const res = await this.service.DELETE(`${this.basePath}/${id}`);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err.message || "Failed to delete subject");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }
}
