import type { DataWithPagination, FetchCallback, FilterParams } from "@types";
import type { EmployeeResponseModel, CreateEmployeeRequestModel, UpdateEmployeeRequestModel } from "./model";
import { API } from "../index";

export default class EmployeeService {
    basePath = "/employees";
    service = new API();

    async getEmployeeRequest(
        callback: FetchCallback<DataWithPagination<EmployeeResponseModel[]>>,
        params: FilterParams
    ) {
        try {
            const res = await this.service.GET<EmployeeResponseModel[]>(this.basePath, params?.params);
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
            callback.onError(err.message || "Failed to fetch employees");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async createEmployeeRequest(
        data: CreateEmployeeRequestModel,
        callback: FetchCallback<EmployeeResponseModel>
    ) {
        try {
            const res = await this.service.POST<EmployeeResponseModel>(this.basePath, data);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err.message || "Failed to create employee");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async updateEmployeeRequest(
        id: string,
        data: UpdateEmployeeRequestModel,
        callback: FetchCallback<EmployeeResponseModel>
    ) {
        try {
            const res = await this.service.PATCH<EmployeeResponseModel>(`${this.basePath}/${id}`, data);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err.message || "Failed to update employee");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async deleteEmployeeRequest(
        id: string,
        callback: FetchCallback<any>
    ) {
        try {
            const res = await this.service.DELETE(`${this.basePath}/${id}`);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err.message || "Failed to delete employee");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }
}
