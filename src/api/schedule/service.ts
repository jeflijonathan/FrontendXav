import type { DataWithPagination, FetchCallback, FilterParams } from "@common/types";
import type {
    CategoryScheduleTimeResponseModel, CreateCategoryScheduleTimeRequest, UpdateCategoryScheduleTimeRequest,
    ScheduleTimeResponseModel, CreateScheduleTimeRequest, UpdateScheduleTimeRequest,
    ScheduleResponseModel, CreateScheduleRequest, UpdateScheduleRequest,
} from "./model";
import { API } from "../index";

// ── CategoryScheduleTime Service ─────────────────────
export class CategoryScheduleTimeService {
    basePath = "/category-schedule-times";
    service = new API();

    async getAll(
        callback: FetchCallback<DataWithPagination<CategoryScheduleTimeResponseModel[]>>,
        params: FilterParams
    ) {
        try {
            const res = await this.service.GET<CategoryScheduleTimeResponseModel[]>(this.basePath, params?.params);
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
            callback.onError(err.message || "Failed to fetch category schedule times");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async create(data: CreateCategoryScheduleTimeRequest, callback: FetchCallback<CategoryScheduleTimeResponseModel>) {
        try {
            const res = await this.service.POST<CategoryScheduleTimeResponseModel>(this.basePath, data);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err.message || "Failed to create category schedule time");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async update(id: string, data: UpdateCategoryScheduleTimeRequest, callback: FetchCallback<CategoryScheduleTimeResponseModel>) {
        try {
            const res = await this.service.PATCH<CategoryScheduleTimeResponseModel>(`${this.basePath}/${id}`, data);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err.message || "Failed to update category schedule time");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async delete(id: string, callback: FetchCallback<any>) {
        try {
            const res = await this.service.DELETE(`${this.basePath}/${id}`);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err.message || "Failed to delete category schedule time");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }
}

// ── ScheduleTime Service ─────────────────────────────
export class ScheduleTimeService {
    basePath = "/schedule-times";
    service = new API();

    async getAll(
        callback: FetchCallback<DataWithPagination<ScheduleTimeResponseModel[]>>,
        params: FilterParams
    ) {
        try {
            const res = await this.service.GET<ScheduleTimeResponseModel[]>(this.basePath, params?.params);
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
            callback.onError(err.message || "Failed to fetch schedule times");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async create(data: CreateScheduleTimeRequest, callback: FetchCallback<ScheduleTimeResponseModel>) {
        try {
            const res = await this.service.POST<ScheduleTimeResponseModel>(this.basePath, data);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err.message || "Failed to create schedule time");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async update(id: string, data: UpdateScheduleTimeRequest, callback: FetchCallback<ScheduleTimeResponseModel>) {
        try {
            const res = await this.service.PATCH<ScheduleTimeResponseModel>(`${this.basePath}/${id}`, data);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err.message || "Failed to update schedule time");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async delete(id: string, callback: FetchCallback<any>) {
        try {
            const res = await this.service.DELETE(`${this.basePath}/${id}`);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err.message || "Failed to delete schedule time");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }
}

// ── Schedule Service ─────────────────────────────────
export class ScheduleService {
    basePath = "/schedules";
    service = new API();

    async getAll(
        callback: FetchCallback<DataWithPagination<ScheduleResponseModel[]>>,
        params: FilterParams
    ) {
        try {
            const res = await this.service.GET<ScheduleResponseModel[]>(this.basePath, params?.params);
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
            callback.onError(err.message || "Failed to fetch schedules");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async create(data: CreateScheduleRequest, callback: FetchCallback<ScheduleResponseModel>) {
        try {
            const res = await this.service.POST<ScheduleResponseModel>(this.basePath, data);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err.message || "Failed to create schedule");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async update(id: string, data: UpdateScheduleRequest, callback: FetchCallback<ScheduleResponseModel>) {
        try {
            const res = await this.service.PATCH<ScheduleResponseModel>(`${this.basePath}/${id}`, data);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err.message || "Failed to update schedule");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async delete(id: string, callback: FetchCallback<any>) {
        try {
            const res = await this.service.DELETE(`${this.basePath}/${id}`);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err.message || "Failed to delete schedule");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }
}
