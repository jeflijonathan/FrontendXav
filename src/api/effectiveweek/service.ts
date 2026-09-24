import type { DataWithPagination, FetchCallback, FilterParams } from "@common/types";
import type { EffectiveWeekResponseModel, CreateEffectiveWeekRequest, UpdateEffectiveWeekRequest } from "./model";
import { API } from "../index";

export default class EffectiveWeekService {
    basePath = "/effective-weeks";
    service = new API();

    async getAll(
        callback: FetchCallback<DataWithPagination<EffectiveWeekResponseModel[]>>,
        params: FilterParams
    ) {
        try {
            const res = await this.service.GET<EffectiveWeekResponseModel[]>(this.basePath, params?.params);
            const dataList = Array.isArray(res?.data) ? res.data : [];
            callback.onSuccess({
                data: dataList,
                pagination: {
                    page: Number(params?.params?.page) || 1,
                    limit: Number(params?.params?.limit) || 10,
                    total_data: dataList.length,
                    total_pages: 1,
                },
            });
        } catch (err: any) {
            callback.onError(err.message || "Failed to fetch effective weeks");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async create(data: CreateEffectiveWeekRequest, callback: FetchCallback<EffectiveWeekResponseModel>) {
        try {
            const res = await this.service.POST<EffectiveWeekResponseModel>(this.basePath, data);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err.message || "Failed to create effective week");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async update(id: string, data: UpdateEffectiveWeekRequest, callback: FetchCallback<EffectiveWeekResponseModel>) {
        try {
            const res = await this.service.PATCH<EffectiveWeekResponseModel>(`${this.basePath}/${id}`, data);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err.message || "Failed to update effective week");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async delete(id: string, callback: FetchCallback<any>) {
        try {
            const res = await this.service.DELETE(`${this.basePath}/${id}`);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err.message || "Failed to delete effective week");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }
}
