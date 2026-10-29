import type { DataWithPagination, FetchCallback, FilterParams } from "@common/types";
import type { MajorResponseModel, CreateMajorRequestModel, UpdateMajorRequestModel } from "./model";
import { API } from "../index";

export default class MajorService {
    basePath = "/majors";
    service = new API();

    async getAll(
        callback: FetchCallback<DataWithPagination<MajorResponseModel[]>>,
        params?: FilterParams
    ) {
        try {
            const res = await this.service.GET<any>(this.basePath, params?.params);
            if (res.status === "SUCCESS" || res.status_code === 200) {
                const rawList: MajorResponseModel[] = Array.isArray(res.data)
                    ? res.data
                    : Array.isArray(res.data?.data)
                    ? res.data.data
                    : [];

                let filtered = [...rawList];

                // Client-side search and filtering if backend returned a plain list without pagination
                const isBackendPaginated = Boolean(res.data?.pagination);
                if (!isBackendPaginated) {
                    const searchValue = (params?.params?.value as string) || (params?.params?.search as string);
                    if (searchValue) {
                        const q = searchValue.toLowerCase();
                        filtered = filtered.filter((item) =>
                            item.name?.toLowerCase().includes(q) || item.id_major?.toLowerCase().includes(q)
                        );
                    }

                    if (params?.params?.status !== undefined && params?.params?.status !== "") {
                        const statusBool = params?.params?.status === "true" || params?.params?.status === true;
                        filtered = filtered.filter((item) => item.status === statusBool);
                    }

                    const sortField = (params?.params?.sort as keyof MajorResponseModel) || "created_at";
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
                    ? (res.data?.pagination?.total_data ?? filtered.length)
                    : filtered.length;
                const total_pages = isBackendPaginated
                    ? (res.data?.pagination?.total_pages ?? Math.max(1, Math.ceil(total_data / limit)))
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
            callback.onError({ message: err?.message || "Failed to fetch majors" });
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async getById(id: string, callback: FetchCallback<MajorResponseModel>) {
        try {
            const res = await this.service.GET<MajorResponseModel>(`${this.basePath}/${id}`);
            if (res.status === "SUCCESS" || res.status_code === 200) {
                callback.onSuccess(res.data);
            } else {
                callback.onError({ message: res.message, detail: res.details });
            }
        } catch (err: any) {
            callback.onError({ message: err?.message || "Failed to fetch major details" });
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async create(data: CreateMajorRequestModel, callback: FetchCallback<MajorResponseModel>) {
        try {
            const res = await this.service.POST<MajorResponseModel>(this.basePath, data);
            if (res.status === "SUCCESS" || res.status_code === 201 || res.status_code === 200) {
                callback.onSuccess(res.data);
            } else {
                callback.onError({ message: res.message, detail: res.details });
            }
        } catch (err: any) {
            callback.onError({ message: err?.message || "Failed to create major" });
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async update(id: string, data: UpdateMajorRequestModel, callback: FetchCallback<MajorResponseModel>) {
        try {
            const res = await this.service.PATCH<MajorResponseModel>(`${this.basePath}/${id}`, data);
            if (res.status === "SUCCESS" || res.status_code === 200) {
                callback.onSuccess(res.data);
            } else {
                callback.onError({ message: res.message, detail: res.details });
            }
        } catch (err: any) {
            callback.onError({ message: err?.message || "Failed to update major" });
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
            callback.onError({ message: err?.message || "Failed to delete major" });
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }
}
