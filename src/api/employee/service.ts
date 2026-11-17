import type { DataWithPagination, FetchCallback, FilterParams } from "@common/types";
import type { EmployeeResponseModel, CreateEmployeeRequestModel, UpdateEmployeeRequestModel, AcademicTitleModel } from "./model";
import { API } from "../index";

export default class EmployeeService {
    basePath = "/employees/";
    service = new API();

    async getAll(
        callback: FetchCallback<DataWithPagination<EmployeeResponseModel[]>>,
        params?: FilterParams
    ) {
        const res = await this.service.GET<DataWithPagination<EmployeeResponseModel[]>>(this.basePath, params?.params);
        if (res.status == "SUCCESS") {
            callback.onSuccess({ data: res.data.data, pagination: res.data.pagination });
        } else {
            callback.onError({ message: res.message, detail: res.details });
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async getById(id: string, callback: FetchCallback<EmployeeResponseModel>) {
        const res = await this.service.GET<EmployeeResponseModel>(`${this.basePath}${id}`);

        if (res.status == "SUCCESS") {
            callback.onSuccess(res.data)
        } else {
            callback.onError({ message: res.message, detail: res.details })
        }

        if (callback.onFullfilled) callback.onFullfilled();
    }

    async create(data: CreateEmployeeRequestModel, callback: FetchCallback<EmployeeResponseModel>) {
        try {
            const res = await this.service.POST<EmployeeResponseModel>(this.basePath, data);

            if (res.status == "SUCCESS") {
                callback.onSuccess(res.data)
            } else {
                callback.onError({ message: res.message, detail: res.details })
            }
        } catch (err: any) {
            const message = err?.message || "Gagal membuat data karyawan";
            const detail = err?.response?.data?.detail;
            callback.onError({ message, detail: detail || message });
        }

        if (callback.onFullfilled) callback.onFullfilled();
    }

    async update(id: string, data: UpdateEmployeeRequestModel, callback: FetchCallback<EmployeeResponseModel>) {
        const res = await this.service.PATCH<EmployeeResponseModel>(`${this.basePath}${id}`, data);
        if (res.status == "SUCCESS") {
            callback.onSuccess(res.data)
        } else {
            callback.onError({ message: res.message, detail: res.details })
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async delete(id: string, callback: FetchCallback<any>) {
        const res = await this.service.DELETE(`${this.basePath}${id}`);
        if (res.status == "SUCCESS") {
            callback.onSuccess(res.data)
        } else {
            callback.onError({ message: res.message, detail: res.details })
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async getEmployeeRequest(
        callback: FetchCallback<DataWithPagination<EmployeeResponseModel[]>>,
        params?: FilterParams
    ) {
        return this.getAll(callback, params);
    }

    async getAcademicTitles(callback: FetchCallback<AcademicTitleModel[]>, type?: "depan" | "belakang") {
        const query = type ? `?type=${type}` : "";
        const res = await this.service.GET<AcademicTitleModel[]>(`${this.basePath}academic-titles${query}`);
        if (res.status == "SUCCESS") {
            callback.onSuccess(res.data);
        } else {
            callback.onError({ message: res.message, detail: res.details });
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async getMyProfile(callback: FetchCallback<EmployeeResponseModel>) {
        const res = await this.service.GET<EmployeeResponseModel>(`${this.basePath}me`);
        if (res.status == "SUCCESS") {
            callback.onSuccess(res.data);
        } else {
            callback.onError({ message: res.message, detail: res.details });
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async updateMyProfile(data: UpdateEmployeeRequestModel, callback: FetchCallback<EmployeeResponseModel>) {
        const res = await this.service.PATCH<EmployeeResponseModel>(`${this.basePath}me`, data);
        if (res.status == "SUCCESS") {
            callback.onSuccess(res.data);
        } else {
            callback.onError({ message: res.message, detail: res.details });
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }
}
