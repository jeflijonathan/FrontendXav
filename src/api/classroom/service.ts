import type { DataWithPagination, FetchCallback, FilterParams } from "@common/types";
import type { ClassroomResponseModel, CreateClassroomRequest, UpdateClassroomRequest } from "./model";
import { API } from "../index";

export default class ClassroomService {
    basePath = "/classrooms";
    service = new API();

    async getAll(
        callback: FetchCallback<DataWithPagination<ClassroomResponseModel[]>>,
        params: FilterParams
    ) {
        try {
            const res = await this.service.GET<ClassroomResponseModel[]>(this.basePath, params?.params);
            const dataList = Array.isArray(res?.data) ? res.data : [];
            callback.onSuccess({
                data: dataList,
                pagination: {
                    page: Number(params?.params?.page) || 1,
                    limit: Number(params?.params?.limit) || 10,
                    total_data: res.pagination?.total_data || 0,
                    total_pages: res.pagination?.total_pages || 1,
                },
            });
        } catch (err: any) {
            callback.onError(err.message || "Failed to fetch classrooms");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async create(data: CreateClassroomRequest, callback: FetchCallback<ClassroomResponseModel>) {
        try {
            const res = await this.service.POST<ClassroomResponseModel>(this.basePath, data);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err.message || "Failed to create classroom");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async update(id: string, data: UpdateClassroomRequest, callback: FetchCallback<ClassroomResponseModel>) {
        try {
            const res = await this.service.PATCH<ClassroomResponseModel>(`${this.basePath}/${id}`, data);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err.message || "Failed to update classroom");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async delete(id: string, callback: FetchCallback<any>) {
        try {
            const res = await this.service.DELETE(`${this.basePath}/${id}`);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err.message || "Failed to delete classroom");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }
}
