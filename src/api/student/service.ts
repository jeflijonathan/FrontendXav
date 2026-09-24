import type { DataWithPagination, FetchCallback, FilterParams } from "@common/types";
import type { StudentResponseModel, CreateStudentRequestModel, UpdateStudentRequestModel } from "./model";
import { API } from "../index";

export default class StudentService {
    basePath = "/students";
    service = new API();

    async getStudentRequest(
        callback: FetchCallback<DataWithPagination<StudentResponseModel[]>>,
        params: FilterParams
    ) {
        try {
            const res = await this.service.GET<StudentResponseModel[]>(this.basePath, params?.params);
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
            callback.onError(err.message || "Failed to fetch students");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async createStudentRequest(
        data: CreateStudentRequestModel,
        callback: FetchCallback<StudentResponseModel>
    ) {
        try {
            const res = await this.service.POST<StudentResponseModel>(this.basePath, data);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err.message || "Failed to create student");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async updateStudentRequest(
        id: string,
        data: UpdateStudentRequestModel,
        callback: FetchCallback<StudentResponseModel>
    ) {
        try {
            const res = await this.service.PUT<StudentResponseModel>(`${this.basePath}/${id}`, data);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err.message || "Failed to update student");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async deleteStudentRequest(
        id: string,
        callback: FetchCallback<any>
    ) {
        try {
            const res = await this.service.DELETE(`${this.basePath}/${id}`);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err.message || "Failed to delete student");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }
}
