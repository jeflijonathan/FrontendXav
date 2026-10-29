import type { DataWithPagination, FetchCallback, FilterParams } from "@common/types";
import type {
    CategorySubjectResponseModel,
    CreateCategorySubjectRequestModel,
    UpdateCategorySubjectRequestModel,
} from "./model";
import { API } from "../index";

export default class CategorySubjectService {
    basePath = "/category-subjects";
    service = new API();

    /**
     * Standard getAll matching MajorService / ClassService pattern.
     * Supports both backend-paginated and client-side fallback.
     */
    async getAll(
        callback: FetchCallback<DataWithPagination<CategorySubjectResponseModel[]>>,
        params?: FilterParams
    ) {
        try {
            const res = await this.service.GET<any>(this.basePath, params?.params);
            if (res.status === "SUCCESS" || res.status_code === 200) {
                const rawList: CategorySubjectResponseModel[] = Array.isArray(res.data)
                    ? res.data
                    : Array.isArray(res.data?.data)
                    ? res.data.data
                    : [];

                let filtered = [...rawList];

                // Client-side search and filtering if backend returned plain list without pagination
                const isBackendPaginated = Boolean(res.data?.pagination);
                if (!isBackendPaginated) {
                    const searchValue =
                        (params?.params?.value as string) || (params?.params?.search as string);
                    if (searchValue) {
                        const q = searchValue.toLowerCase();
                        filtered = filtered.filter(
                            (item) =>
                                item.name?.toLowerCase().includes(q) ||
                                item.id?.toLowerCase().includes(q) ||
                                item.id_category_subject?.toLowerCase().includes(q)
                        );
                    }

                    if (params?.params?.status !== undefined && params?.params?.status !== "") {
                        const statusBool =
                            params?.params?.status === "true" || params?.params?.status === true;
                        filtered = filtered.filter((item) => item.status === statusBool);
                    }

                    const sortField =
                        (params?.params?.sort as keyof CategorySubjectResponseModel) || "created_at";
                    const orderBy = params?.params?.order_by === "asc" ? "asc" : "desc";
                    filtered.sort((a, b) => {
                        const valA = a[sortField] ?? "";
                        const valB = b[sortField] ?? "";
                        if (valA < valB) return orderBy === "asc" ? -1 : 1;
                        if (valA > valB) return orderBy === "asc" ? 1 : -1;
                        return 0;
                    });
                }

                const page = Number(params?.params?.page) || 1;
                const limit = Number(params?.params?.limit) || 10;
                const total_data = isBackendPaginated
                    ? res.data?.pagination?.total_data ?? filtered.length
                    : filtered.length;
                const total_pages = isBackendPaginated
                    ? res.data?.pagination?.total_pages ?? Math.max(1, Math.ceil(total_data / limit))
                    : Math.max(1, Math.ceil(total_data / limit));

                const pagedData = isBackendPaginated
                    ? filtered
                    : filtered.slice((page - 1) * limit, page * limit);

                callback.onSuccess({
                    data: pagedData,
                    pagination: {
                        page,
                        limit,
                        total_data,
                        total_pages,
                    },
                });
            } else {
                callback.onError({ message: res.message, detail: res.details });
            }
        } catch (err: any) {
            callback.onError({ message: err?.message || "Gagal memuat kategori mata pelajaran" });
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async getById(id: string, callback: FetchCallback<CategorySubjectResponseModel>) {
        try {
            const res = await this.service.GET<CategorySubjectResponseModel>(`${this.basePath}/${id}`);
            if (res.status === "SUCCESS" || res.status_code === 200) {
                callback.onSuccess(res.data);
            } else {
                callback.onError({ message: res.message, detail: res.details });
            }
        } catch (err: any) {
            callback.onError({ message: err?.message || "Gagal memuat detail kategori" });
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async create(
        data: CreateCategorySubjectRequestModel,
        callback: FetchCallback<CategorySubjectResponseModel>
    ) {
        try {
            const res = await this.service.POST<CategorySubjectResponseModel>(this.basePath, data);
            if (res.status === "SUCCESS" || res.status_code === 201 || res.status_code === 200) {
                callback.onSuccess(res.data);
            } else {
                callback.onError({ message: res.message, detail: res.details });
            }
        } catch (err: any) {
            callback.onError({ message: err?.message || "Gagal membuat kategori" });
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async update(
        id: string,
        data: UpdateCategorySubjectRequestModel,
        callback: FetchCallback<CategorySubjectResponseModel>
    ) {
        try {
            const res = await this.service.PATCH<CategorySubjectResponseModel>(`${this.basePath}/${id}`, data);
            if (res.status === "SUCCESS" || res.status_code === 200) {
                callback.onSuccess(res.data);
            } else {
                callback.onError({ message: res.message, detail: res.details });
            }
        } catch (err: any) {
            callback.onError({ message: err?.message || "Gagal memperbarui kategori" });
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async delete(id: string, callback: FetchCallback<any>) {
        try {
            const res = await this.service.DELETE(`${this.basePath}/${id}`);
            if (res.status === "SUCCESS" || res.status_code === 200) {
                callback.onSuccess(res.data);
            } else {
                callback.onError({ message: res.message, detail: res.details });
            }
        } catch (err: any) {
            callback.onError({ message: err?.message || "Gagal menghapus kategori" });
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    // ─── Backward compatibility aliases ───────────────────────────────────────

    async getCategorySubjectRequest(
        callback: FetchCallback<DataWithPagination<CategorySubjectResponseModel[]>>,
        params: FilterParams
    ) {
        return this.getAll(callback, params);
    }

    async getCategorySubjectOptionsRequest(
        callback: FetchCallback<{ id: string; name: string }[]>
    ) {
        try {
            const res = await this.service.GET<CategorySubjectResponseModel[]>(this.basePath);
            const dataList = Array.isArray(res?.data)
                ? res.data
                : Array.isArray((res?.data as any)?.data)
                ? (res.data as any).data
                : [];
            const options = dataList.map((item: any) => ({
                id: item.id || item.id_category_subject,
                name: item.name,
            }));
            callback.onSuccess(options);
        } catch (err: any) {
            callback.onError({ message: err?.message || "Gagal memuat opsi kategori" });
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async getCategorySubjectByIdRequest(
        id: string,
        callback: FetchCallback<CategorySubjectResponseModel>
    ) {
        return this.getById(id, callback);
    }

    async createCategorySubjectRequest(
        data: CreateCategorySubjectRequestModel,
        callback: FetchCallback<CategorySubjectResponseModel>
    ) {
        return this.create(data, callback);
    }

    async updateCategorySubjectRequest(
        id: string,
        data: UpdateCategorySubjectRequestModel,
        callback: FetchCallback<CategorySubjectResponseModel>
    ) {
        return this.update(id, data, callback);
    }

    async deleteCategorySubjectRequest(id: string, callback: FetchCallback<any>) {
        return this.delete(id, callback);
    }
}
