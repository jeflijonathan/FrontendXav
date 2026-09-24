import type { DataWithPagination, FetchCallback, FilterParams } from "@common/types";
import type { MajorResponseModel, CreateMajorRequest, UpdateMajorRequest } from "./model";
import { API } from "../index";

export default class MajorService {
    basePath = "/majors";
    service = new API();

    async getAll(
        callback: FetchCallback<DataWithPagination<MajorResponseModel[]>>,
        params: FilterParams
    ) {
        try {
            const res = await this.service.GET<MajorResponseModel[]>(this.basePath, params?.params);
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
            callback.onError(err.message || "Failed to fetch majors");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async create(data: CreateMajorRequest, callback: FetchCallback<MajorResponseModel>) {
        try {
            const res = await this.service.POST<MajorResponseModel>(this.basePath, data);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err.message || "Failed to create major");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async update(id: string, data: UpdateMajorRequest, callback: FetchCallback<MajorResponseModel>) {
        try {
            const res = await this.service.PATCH<MajorResponseModel>(`${this.basePath}/${id}`, data);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err.message || "Failed to update major");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async delete(id: string, callback: FetchCallback<any>) {
        try {
            const res = await this.service.DELETE(`${this.basePath}/${id}`);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err.message || "Failed to delete major");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }
}
