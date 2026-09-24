// ── CategoryScheduleTime ────────────────────
export interface CategoryScheduleTimeResponseModel {
    id_category_schendule_time: string;
    name: string;
    status: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateCategoryScheduleTimeRequest {
    name: string;
    status?: boolean;
}

export interface UpdateCategoryScheduleTimeRequest {
    name?: string;
    status?: boolean;
}

// ── ScheduleTime ────────────────────────────
export interface ScheduleTimeResponseModel {
    id_schendule_time: string;
    hari: string;
    jam_awal: string;
    jam_akhir: string;
    id_category_schendule_time: string;
    created_at: string;
    updated_at: string;
}

export interface CreateScheduleTimeRequest {
    hari: string;
    jam_awal: string;
    jam_akhir: string;
    id_category_schendule_time: string;
}

export interface UpdateScheduleTimeRequest {
    hari?: string;
    jam_awal?: string;
    jam_akhir?: string;
    id_category_schendule_time?: string;
}

// ── Schedule ────────────────────────────────
export interface ScheduleResponseModel {
    id_schendule: string;
    id_category_subject: string;
    id_duty_teacher: string | null;
    id_class: string;
    id_schendule_time: string;
    status: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateScheduleRequest {
    id_category_subject: string;
    id_duty_teacher?: string | null;
    id_class: string;
    id_schendule_time: string;
    status?: boolean;
}

export interface UpdateScheduleRequest {
    id_category_subject?: string;
    id_duty_teacher?: string | null;
    id_class?: string;
    id_schendule_time?: string;
    status?: boolean;
}
