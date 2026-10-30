import type { DataWithPagination, FetchCallback, FilterParams } from "@common/types";
import type {
    SubjectResponseModel,
    CreateSubjectRequestModel,
    UpdateSubjectRequestModel,
} from "./model";
import { API } from "../index";

export default class SubjectService {
    basePath = "/subjects";
    service = new API();

    async getAll(
        callback: FetchCallback<DataWithPagination<SubjectResponseModel[]>>,
        params?: FilterParams
    ) {
        try {
            const res = await this.service.GET<any>(this.basePath, params?.params);
            if (res.status === "SUCCESS" || res.status_code === 200) {
                const rawList: SubjectResponseModel[] = Array.isArray(res.data)
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
                                item.id_subject?.toLowerCase().includes(q) ||
                                item.code_subject?.toLowerCase().includes(q)
                        );
                    }

                    // Filter by category if passed
                    const categoryFilter = params?.params?.id_category_subject;
                    if (categoryFilter) {
                        filtered = filtered.filter(
                            (item) =>
                                item.id_category_subject === categoryFilter ||
                                item.category_subject_id === categoryFilter
                        );
                    }

                    // Filter by status if passed
                    if (params?.params?.status !== undefined && params?.params?.status !== "") {
                        const statusBool =
                            params?.params?.status === "true" || params?.params?.status === true;
                        filtered = filtered.filter((item) => Boolean(item.status) === statusBool);
                    }

                    const sortField =
                        (params?.params?.sort as keyof SubjectResponseModel) || "created_at";
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
            callback.onError({ message: err?.message || "Gagal memuat mata pelajaran" });
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async getById(id: string, callback: FetchCallback<SubjectResponseModel>) {
        try {
            const res = await this.service.GET<SubjectResponseModel>(`${this.basePath}/${id}`);
            if (res.status === "SUCCESS" || res.status_code === 200) {
                callback.onSuccess(res.data);
            } else {
                callback.onError({ message: res.message, detail: res.details });
            }
        } catch (err: any) {
            callback.onError({ message: err?.message || "Gagal memuat detail mata pelajaran" });
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async create(
        data: CreateSubjectRequestModel,
        callback: FetchCallback<SubjectResponseModel>
    ) {
        try {
            const res = await this.service.POST<SubjectResponseModel>(this.basePath, data);
            if (res.status === "SUCCESS" || res.status_code === 201 || res.status_code === 200) {
                callback.onSuccess(res.data);
            } else {
                callback.onError({ message: res.message, detail: res.details });
            }
        } catch (err: any) {
            callback.onError({ message: err?.message || "Gagal membuat mata pelajaran" });
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async update(
        id: string,
        data: UpdateSubjectRequestModel,
        callback: FetchCallback<SubjectResponseModel>
    ) {
        try {
            const res = await this.service.PATCH<SubjectResponseModel>(`${this.basePath}/${id}`, data);
            if (res.status === "SUCCESS" || res.status_code === 200) {
                callback.onSuccess(res.data);
            } else {
                callback.onError({ message: res.message, detail: res.details });
            }
        } catch (err: any) {
            callback.onError({ message: err?.message || "Gagal memperbarui mata pelajaran" });
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
            callback.onError({ message: err?.message || "Gagal menghapus mata pelajaran" });
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    // ─── Backward compatibility aliases ───────────────────────────────────────

    async getSubjectRequest(
        callback: FetchCallback<DataWithPagination<SubjectResponseModel[]>>,
        params: FilterParams
    ) {
        return this.getAll(callback, params);
    }

    async createSubjectRequest(
        data: CreateSubjectRequestModel,
        callback: FetchCallback<SubjectResponseModel>
    ) {
        return this.create(data, callback);
    }

    async updateSubjectRequest(
        id: string,
        data: UpdateSubjectRequestModel,
        callback: FetchCallback<SubjectResponseModel>
    ) {
        return this.update(id, data, callback);
    }

    async deleteSubjectRequest(id: string, callback: FetchCallback<any>) {
        return this.delete(id, callback);
    }
}
