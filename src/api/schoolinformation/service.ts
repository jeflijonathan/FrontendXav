import type { DataWithPagination, FetchCallback, FilterParams } from "@common/types";
import { type SchoolInformationResponseModel, type CreateSchoolInformationRequest, type UpdateSchoolInformationRequest } from "./model";
import { API } from "../index";

export default class SchoolInformationService {
    basePath = "/school-informations";
    service = new API();

    async getAll(
        callback: FetchCallback<DataWithPagination<SchoolInformationResponseModel[]>>,
        params: FilterParams
    ) {
        try {
            const res = await this.service.GET<DataWithPagination<SchoolInformationResponseModel[]>>(this.basePath, params?.params);

            callback.onSuccess({
                data: dataList,
                pagination: {
                    page: Number(params?.params?.page) || 1,
                    limit: Number(params?.params?.limit) || 10,
                    total_data: res.pagination.,
                    total_pages: 1,
                },
            });
        } catch (err: any) {
            callback.onError(err.message || "Failed to fetch school information");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async create(data: CreateSchoolInformationRequest, callback: FetchCallback<SchoolInformationResponseModel>) {
        try {
            const res = await this.service.POST<SchoolInformationResponseModel>(this.basePath, data);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err.message || "Failed to create school information");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async update(id: string, data: UpdateSchoolInformationRequest, callback: FetchCallback<SchoolInformationResponseModel>) {
        try {
            const res = await this.service.PATCH<SchoolInformationResponseModel>(`${this.basePath}/${id}`, data);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err.message || "Failed to update school information");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async delete(id: string, callback: FetchCallback<any>) {
        try {
            const res = await this.service.DELETE(`${this.basePath}/${id}`);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err.message || "Failed to delete school information");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }
}
