import type { DataWithPagination, FetchCallback, FilterParams } from "@common/types";
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
            const res = await this.service.GET<DataWithPagination<EmployeeResponseModel[]>>(this.basePath, params?.params);

            callback.onSuccess({
                data: res.data.data,
                pagination: res.data.pagination,
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
}
