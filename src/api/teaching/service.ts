import type { DataWithPagination, FetchCallback, FilterParams } from "@common/types";
import type {
    CreateTeachingAssignmentRequest,
    TeachingClassRowModel,
    TeachingPeriodModel,
    TeachingTeacherRowModel,
    UpdateTeachingAssignmentRequest,
} from "./model";
import { API } from "../index";

const errorMessage = (err: unknown, fallback: string): string =>
    err instanceof Error && err.message ? err.message : fallback;

export default class TeachingService {
    basePath = "/teaching-staff";
    service = new API();

    async getAll(
        callback: FetchCallback<DataWithPagination<TeachingTeacherRowModel[]>>,
        params?: FilterParams
    ) {
        try {
            const res = await this.service.GET<DataWithPagination<TeachingTeacherRowModel[]>>(
                `${this.basePath}/`,
                params?.params
            );
            callback.onSuccess({
                data: res.data?.data ?? [],
                pagination: res.data?.pagination ?? {
                    page: 1,
                    limit: 10,
                    total_data: 0,
                    total_pages: 1,
                },
            });
        } catch (err: unknown) {
            callback.onError({ message: errorMessage(err, "Gagal memuat data pengajar") });
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async getPeriods(callback: FetchCallback<TeachingPeriodModel[]>) {
        try {
            const res = await this.service.GET<TeachingPeriodModel[]>(`${this.basePath}/periods`);
            callback.onSuccess(Array.isArray(res.data) ? res.data : []);
        } catch (err: unknown) {
            callback.onError({ message: errorMessage(err, "Gagal memuat daftar periode") });
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async create(
        data: CreateTeachingAssignmentRequest,
        callback: FetchCallback<TeachingClassRowModel>
    ) {
        try {
            const res = await this.service.POST<TeachingClassRowModel>(`${this.basePath}/`, data);
            callback.onSuccess(res.data);
        } catch (err: unknown) {
            callback.onError({ message: errorMessage(err, "Gagal menyimpan penugasan") });
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async update(
        id: string,
        data: UpdateTeachingAssignmentRequest,
        callback: FetchCallback<TeachingClassRowModel>
    ) {
        try {
            const res = await this.service.PATCH<TeachingClassRowModel>(
                `${this.basePath}/${id}`,
                data
            );
            callback.onSuccess(res.data);
        } catch (err: unknown) {
            callback.onError({ message: errorMessage(err, "Gagal memperbarui penugasan") });
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async delete(id: string, callback: FetchCallback<{ id_class_room: string }>) {
        try {
            const res = await this.service.DELETE<{ id_class_room: string }>(
                `${this.basePath}/${id}`
            );
            callback.onSuccess(res.data);
        } catch (err: unknown) {
            callback.onError({ message: errorMessage(err, "Gagal menghapus penugasan") });
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }
}
