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

// ── TeacherScheduleRequest ──────────────────
export interface TeacherScheduleRequestSlot {
    day: string;
    jam: string;
    timeRange: string;
    jpStart?: number;
    jpEnd?: number;
}

export interface TeacherScheduleRequestResponseModel {
    id_schedule_request: string;
    id?: string;
    id_school_information?: string | null;
    teacher_code: number;
    teacher_name: string;
    subject_name: string;
    preferred_slots: TeacherScheduleRequestSlot[];
    status: 'VALID' | 'CONFLICT' | 'PENDING' | string;
    status_text: string;
    conflict_reason?: string | null;
    notes?: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface CreateTeacherScheduleRequestPayload {
    id_school_information?: string | null;
    teacher_code: number;
    teacher_name: string;
    subject_name: string;
    preferred_slots: TeacherScheduleRequestSlot[];
    status?: string;
    status_text?: string;
    conflict_reason?: string | null;
    notes?: string | null;
}

