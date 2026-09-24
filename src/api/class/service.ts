import type { DataWithPagination, FetchCallback, FilterParams } from "@common/types";
import type { ClassResponseModel, CreateClassRequest, UpdateClassRequest } from "./model";
import { API } from "../index";

export default class ClassService {
    basePath = "/classes";
    service = new API();

    async getAll(
        callback: FetchCallback<DataWithPagination<ClassResponseModel[]>>,
        params: FilterParams
    ) {
        try {
            const res = await this.service.GET<ClassResponseModel[]>(this.basePath, params?.params);
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
            callback.onError(err.message || "Failed to fetch classes");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async create(data: CreateClassRequest, callback: FetchCallback<ClassResponseModel>) {
        try {
            const res = await this.service.POST<ClassResponseModel>(this.basePath, data);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err.message || "Failed to create class");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async update(id: string, data: UpdateClassRequest, callback: FetchCallback<ClassResponseModel>) {
        try {
            const res = await this.service.PATCH<ClassResponseModel>(`${this.basePath}/${id}`, data);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err.message || "Failed to update class");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async delete(id: string, callback: FetchCallback<any>) {
        try {
            const res = await this.service.DELETE(`${this.basePath}/${id}`);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err.message || "Failed to delete class");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }
}
