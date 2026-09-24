import type { DataWithPagination, FetchCallback, FilterParams } from "@common/types";
import type { CategorySubjectResponseModel, CreateCategorySubjectRequestModel, UpdateCategorySubjectRequestModel } from "./model";
import { API } from "../index";

export default class CategorySubjectService {
    basePath = "/category-subjects";
    service = new API();

    async getCategorySubjectRequest(
        callback: FetchCallback<DataWithPagination<CategorySubjectResponseModel[]>>,
        params: FilterParams
    ) {
        try {
            const res = await this.service.GET<CategorySubjectResponseModel[]>(this.basePath, params?.params);
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
            callback.onError(err.message || "Failed to fetch categories");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async getCategorySubjectOptionsRequest(
        callback: FetchCallback<{ id: string, name: string }[]>
    ) {
        try {
            const res = await this.service.GET<CategorySubjectResponseModel[]>(this.basePath);
            const dataList = Array.isArray(res?.data) ? res.data : [];
            const options = dataList.map(item => ({ id: item.id, name: item.name }));
            callback.onSuccess(options);
        } catch (err: any) {
            callback.onError(err.message || "Failed to fetch options");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async getCategorySubjectByIdRequest(
        id: string,
        callback: FetchCallback<CategorySubjectResponseModel>
    ) {
        try {
            const res = await this.service.GET<CategorySubjectResponseModel>(`${this.basePath}/${id}`);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err.message || "Failed to fetch category details");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async createCategorySubjectRequest(
        data: CreateCategorySubjectRequestModel,
        callback: FetchCallback<CategorySubjectResponseModel>
    ) {
        try {
            const res = await this.service.POST<CategorySubjectResponseModel>(this.basePath, data);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err.message || "Failed to create category");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async updateCategorySubjectRequest(
        id: string,
        data: UpdateCategorySubjectRequestModel,
        callback: FetchCallback<CategorySubjectResponseModel>
    ) {
        try {
            const res = await this.service.PATCH<CategorySubjectResponseModel>(`${this.basePath}/${id}`, data);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err.message || "Failed to update category");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async deleteCategorySubjectRequest(
        id: string,
        callback: FetchCallback<any>
    ) {
        try {
            const res = await this.service.DELETE(`${this.basePath}/${id}`);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err.message || "Failed to delete category");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }
}
