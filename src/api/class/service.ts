import type { DataWithPagination, FetchCallback, FilterParams } from "@common/types";
import type {
    ClassResponseModel,
    CreateClassRequestModel,
    UpdateClassRequestModel,
    StudentInClassModel,
    AddStudentsToClassRequest,
} from "./model";
import { API } from "../index";

export default class ClassService {
    basePath = "/classes";
    service = new API();

    async getAll(
        callback: FetchCallback<DataWithPagination<ClassResponseModel[]>>,
        params?: FilterParams
    ) {
        try {
            const res = await this.service.GET<any>(this.basePath, params?.params);
            if (res.status === "SUCCESS" || res.status_code === 200) {
                const rawList: ClassResponseModel[] = Array.isArray(res.data)
                    ? res.data
                    : Array.isArray(res.data?.data)
                        ? res.data.data
                        : [];

                let filtered = [...rawList];

                // Client-side filtering if backend returns array
                const isBackendPaginated = Boolean(res.data?.pagination);
                if (!isBackendPaginated) {
                    // Filter by school information / periode
                    const schoolInfoId = params?.params?.id_school_information as string;
                    if (schoolInfoId) {
                        filtered = filtered.filter((item) => item.id_school_information === schoolInfoId);
                    }

                    // Filter by major
                    const majorId = params?.params?.id_major as string;
                    if (majorId) {
                        filtered = filtered.filter((item) => item.id_major === majorId);
                    }

                    // Filter by kelas (e.g. "10", "11", "12")
                    const kelasFilter = params?.params?.kelas as string;
                    if (kelasFilter) {
                        filtered = filtered.filter((item) => item.kelas === kelasFilter);
                    }

                    // Filter by status
                    if (params?.params?.status !== undefined && params?.params?.status !== "") {
                        const statusBool = params?.params?.status === "true" || params?.params?.status === true;
                        filtered = filtered.filter((item) => item.status === statusBool);
                    }

                    // Search by name, kelas, or IDs
                    const searchValue = (params?.params?.value as string) || (params?.params?.search as string);
                    if (searchValue) {
                        const q = searchValue.toLowerCase();
                        filtered = filtered.filter((item) =>
                            item.name?.toLowerCase().includes(q) ||
                            item.kelas?.toLowerCase().includes(q) ||
                            item.id_class?.toLowerCase().includes(q)
                        );
                    }

                    // Sort
                    const sortField = (params?.params?.sort as keyof ClassResponseModel) || "created_at";
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
            callback.onError({ message: err?.message || "Failed to fetch classes" });
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async getById(id: string, callback: FetchCallback<ClassResponseModel>) {
        try {
            const res = await this.service.GET<ClassResponseModel>(`${this.basePath}/${id}`);
            if (res.status === "SUCCESS" || res.status_code === 200) {
                callback.onSuccess(res.data);
            } else {
                callback.onError({ message: res.message, detail: res.details });
            }
        } catch (err: any) {
            callback.onError({ message: err?.message || "Failed to fetch class details" });
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async create(data: CreateClassRequestModel, callback: FetchCallback<ClassResponseModel>) {
        try {
            const res = await this.service.POST<ClassResponseModel>(this.basePath, data);
            if (res.status === "SUCCESS" || res.status_code === 201 || res.status_code === 200) {
                callback.onSuccess(res.data);
            } else {
                callback.onError({ message: res.message, detail: res.details });
            }
        } catch (err: any) {
            const errorMsg =
                err?.response?.data?.message ||
                (typeof err?.response?.data?.detail === "string" ? err.response.data.detail : "") ||
                err?.message ||
                "Gagal menambahkan kelas";
            const errorDetail = err?.response?.data?.details || err?.response?.data?.detail;
            callback.onError({ message: errorMsg, detail: errorDetail });
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async update(id: string, data: UpdateClassRequestModel, callback: FetchCallback<ClassResponseModel>) {
        try {
            const res = await this.service.PATCH<ClassResponseModel>(`${this.basePath}/${id}`, data);
            if (res.status === "SUCCESS" || res.status_code === 200) {
                callback.onSuccess(res.data);
            } else {
                callback.onError({ message: res.message, detail: res.details });
            }
        } catch (err: any) {
            const errorMsg =
                err?.response?.data?.message ||
                (typeof err?.response?.data?.detail === "string" ? err.response.data.detail : "") ||
                err?.message ||
                "Gagal memperbarui kelas";
            const errorDetail = err?.response?.data?.details || err?.response?.data?.detail;
            callback.onError({ message: errorMsg, detail: errorDetail });
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
            callback.onError({ message: err?.message || "Failed to delete class" });
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async getClassStudents(id_class: string, callback: FetchCallback<StudentInClassModel[]>) {
        const res = await this.service.GET<StudentInClassModel[]>(`${this.basePath}/${id_class}/students`);

        if (res.status === "SUCCESS" || res.status_code === 200) {
            callback.onSuccess(Array.isArray(res.data) ? res.data : []);
        } else {
            callback.onError({ message: res.message });
        }

        if (callback.onFullfilled) callback.onFullfilled();
    }

    async getAvailableStudents(id_class: string, callback: FetchCallback<StudentInClassModel[]>) {
        try {
            const res = await this.service.GET<any>(`${this.basePath}/${id_class}/available-students`);
            if (res.status === "SUCCESS" || res.status_code === 200) {
                callback.onSuccess(Array.isArray(res.data) ? res.data : []);
            } else {
                callback.onError({ message: res.message });
            }
        } catch (err: any) {
            callback.onError({ message: err?.message || "Failed to fetch available students" });
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async addStudentsToClass(
        id_class: string,
        student_ids: string[],
        force_transfer: boolean = false,
        callback: Partial<FetchCallback<any>> = {}
    ) {
        try {
            const payload: AddStudentsToClassRequest = { student_ids, force_transfer };
            const res = await this.service.POST<any>(`${this.basePath}/${id_class}/students`, payload);
            if (res.status === "SUCCESS" || res.status_code === 200) {
                if (callback.onSuccess) callback.onSuccess(res.data);
            } else {
                const anyRes = res as any;
                const errorMsg =
                    res?.message ||
                    (typeof anyRes?.detail === "string" ? anyRes.detail : "") ||
                    "Gagal menambahkan siswa ke kelas";
                if (callback.onError) callback.onError({ message: errorMsg, detail: anyRes?.detail });
            }
        } catch (err: any) {
            const errorMsg =
                err?.response?.data?.message ||
                (typeof err?.response?.data?.detail === "string" ? err.response.data.detail : "") ||
                err?.message ||
                "Gagal menambahkan siswa ke kelas";
            const errorDetail = err?.response?.data?.detail || err?.response?.data?.details;
            if (callback.onError) callback.onError({ message: errorMsg, detail: errorDetail });
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async removeStudentFromClass(id_class: string, student_id: string, callback: FetchCallback<any>) {
        try {
            const res = await this.service.DELETE(`${this.basePath}/${id_class}/students/${student_id}`);
            if (res.status === "SUCCESS" || res.status_code === 200) {
                callback.onSuccess(res.data);
            } else {
                callback.onError({ message: res.message });
            }
        } catch (err: any) {
            callback.onError({ message: err?.message || "Failed to remove student from class" });
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }
}
