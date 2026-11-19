import type { DataWithPagination, FetchCallback, FilterParams } from "@common/types";
import type {
    CategoryScheduleTimeResponseModel, CreateCategoryScheduleTimeRequest, UpdateCategoryScheduleTimeRequest,
    ScheduleTimeResponseModel, CreateScheduleTimeRequest, UpdateScheduleTimeRequest,
    ScheduleResponseModel, CreateScheduleRequest, UpdateScheduleRequest,
    TeacherScheduleRequestResponseModel, CreateTeacherScheduleRequestPayload,
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

// ── RosterSchedule Service (per id_school_information) ─────────────────────
export class RosterScheduleService {
    basePath = "/roster-schedules";
    service = new API();

    async getBySchoolInformation(
        idSchoolInformation: string,
        callback: FetchCallback<any>
    ) {
        try {
            const res = await this.service.GET<any>(`${this.basePath}/${idSchoolInformation}`);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err.message || "Failed to fetch roster schedule");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async saveBySchoolInformation(
        idSchoolInformation: string,
        data: { schedules: any; is_synced?: boolean },
        callback: FetchCallback<any>
    ) {
        try {
            const res = await this.service.POST<any>(`${this.basePath}/${idSchoolInformation}`, data);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err.message || "Failed to save roster schedule");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }
}

// ── MatrixSchedule Service (Matriks Jadwal Pelajaran Lampiran 3) ──────────────
export interface MatrixSchedulePayload {
    matrix_data: any;
    teachers_data?: any;
    guru_piket_data?: any;
    classes_data?: any;
    approval_data?: any;
    is_synced?: boolean;
}

export class MatrixScheduleService {
    basePath = "/matrix-schedules";
    service = new API();

    async getBySchoolInformation(
        idSchoolInformation: string,
        callback: FetchCallback<any>
    ) {
        try {
            const res = await this.service.GET<any>(`${this.basePath}/${idSchoolInformation}`);
            if (res.status === "SUCCESS") {
                callback.onSuccess(res.data);
            } else {
                callback.onError({ message: res.message || "Gagal memuat jadwal matriks", detail: res.details });
            }
        } catch (err: any) {
            callback.onError({ message: err?.message || "Gagal memuat jadwal matriks" });
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async saveBySchoolInformation(
        idSchoolInformation: string,
        data: MatrixSchedulePayload,
        callback: FetchCallback<any>
    ) {
        try {
            const res = await this.service.POST<any>(`${this.basePath}/${idSchoolInformation}`, data);
            if (res.status === "SUCCESS") {
                callback.onSuccess(res.data);
            } else {
                callback.onError({ message: res.message || "Gagal menyimpan jadwal matriks", detail: res.details });
            }
        } catch (err: any) {
            callback.onError({ message: err?.message || "Gagal menyimpan jadwal matriks" });
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }
}

// ── TeacherScheduleRequest Service ───────────────────────────
export class TeacherScheduleRequestService {
    basePath = "/schedule-requests";
    service = new API();

    async getAll(
        callback: FetchCallback<TeacherScheduleRequestResponseModel[]>,
        idSchoolInformation?: string
    ) {
        try {
            const queryParams = idSchoolInformation ? { id_school_information: idSchoolInformation } : undefined;
            const res = await this.service.GET<TeacherScheduleRequestResponseModel[]>(this.basePath, queryParams);
            const dataList = Array.isArray(res?.data) ? res.data : [];
            callback.onSuccess(dataList);
        } catch (err: any) {
            callback.onError(err?.message || "Gagal mengambil daftar request jadwal");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async create(
        data: CreateTeacherScheduleRequestPayload,
        callback: FetchCallback<TeacherScheduleRequestResponseModel>
    ) {
        try {
            const res = await this.service.POST<TeacherScheduleRequestResponseModel>(this.basePath, data);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err?.message || "Gagal membuat request jadwal");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async update(
        id: string,
        data: Partial<CreateTeacherScheduleRequestPayload>,
        callback: FetchCallback<TeacherScheduleRequestResponseModel>
    ) {
        try {
            const res = await this.service.PATCH<TeacherScheduleRequestResponseModel>(`${this.basePath}/${id}`, data);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err?.message || "Gagal memperbarui request jadwal");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async delete(id: string, callback: FetchCallback<any>) {
        try {
            const res = await this.service.DELETE(`${this.basePath}/${id}`);
            callback.onSuccess(res.data);
        } catch (err: any) {
            callback.onError(err?.message || "Gagal menghapus request jadwal");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }
}

// ── Category Extra Service ───────────────────────────
export interface CategoryExtraResponseModel {
    id_category_extra: string;
    id?: string;
    name: string;
    description?: string;
    status: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface CategoryExtraCreateRequest {
    name: string;
    description?: string;
    status?: boolean;
}

export interface CategoryExtraUpdateRequest {
    name?: string;
    description?: string;
    status?: boolean;
}

export class CategoryExtraService {
    basePath = "/category-extras";
    service = new API();

    async getAll(callback: FetchCallback<CategoryExtraResponseModel[]>) {
        try {
            const res = await this.service.GET<CategoryExtraResponseModel[]>(this.basePath);
            const dataList = Array.isArray(res?.data) ? res.data : [];
            callback.onSuccess(dataList);
        } catch (err: any) {
            callback.onError(err?.message || "Gagal mengambil daftar kategori ekstra");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async create(data: CategoryExtraCreateRequest, callback: FetchCallback<CategoryExtraResponseModel>) {
        try {
            const res = await this.service.POST<CategoryExtraResponseModel>(this.basePath, data);
            if (res?.data) {
                callback.onSuccess(res.data);
            } else {
                callback.onError({ message: "Gagal menambahkan kategori ekstra" } as any);
            }
        } catch (err: any) {
            callback.onError({ message: err?.message || "Gagal menambahkan kategori ekstra" } as any);
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async update(id: string, data: CategoryExtraUpdateRequest, callback: FetchCallback<CategoryExtraResponseModel>) {
        try {
            const res = await this.service.PUT<CategoryExtraResponseModel>(`${this.basePath}/${id}`, data);
            if (res?.data) {
                callback.onSuccess(res.data);
            } else {
                callback.onError({ message: "Gagal memperbarui kategori ekstra" } as any);
            }
        } catch (err: any) {
            callback.onError({ message: err?.message || "Gagal memperbarui kategori ekstra" } as any);
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async delete(id: string, callback: FetchCallback<any>) {
        try {
            const res = await this.service.DELETE<any>(`${this.basePath}/${id}`);
            callback.onSuccess(res?.data || { success: true });
        } catch (err: any) {
            callback.onError(err?.message || "Gagal menghapus kategori ekstra");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }
}

export interface ScheduleClassExtraItem {
    id_schedule_class_extra?: string;
    id_school_information: string;
    row_id: string;
    day: string;
    jp?: string;
    time_range?: string;
    class_name: string;
    id_class?: string;
    extra_name: string;
    id_category_extra?: string;
    status?: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface ScheduleClassExtraBatchRequest {
    id_school_information: string;
    items: ScheduleClassExtraItem[];
}

export class ScheduleClassExtraService {
    basePath = "/schedule-class-extras";
    service = new API();

    async getBySchoolInformation(
        idSchoolInformation: string,
        callback: FetchCallback<ScheduleClassExtraItem[]>
    ) {
        try {
            const res = await this.service.GET<ScheduleClassExtraItem[]>(
                `${this.basePath}/${idSchoolInformation}`
            );
            const dataList = Array.isArray(res?.data) ? res.data : [];
            callback.onSuccess(dataList);
        } catch (err: any) {
            callback.onError(err?.message || "Gagal mengambil data ekstra jadwal");
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async batchSave(
        payload: ScheduleClassExtraBatchRequest,
        callback?: FetchCallback<ScheduleClassExtraItem[]>
    ) {
        try {
            const res = await this.service.POST<ScheduleClassExtraItem[]>(
                `${this.basePath}/batch`,
                payload
            );
            if (callback?.onSuccess) {
                callback.onSuccess(Array.isArray(res?.data) ? res.data : []);
            }
        } catch (err: any) {
            if (callback?.onError) {
                callback.onError(err?.message || "Gagal menyimpan data ekstra ke tabel khusus");
            }
        }
        if (callback?.onFullfilled) callback.onFullfilled();
    }
}

export const scheduleClassExtraService = new ScheduleClassExtraService();




