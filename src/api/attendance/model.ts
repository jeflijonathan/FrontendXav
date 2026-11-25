export type AttendanceStatus = 'HADIR' | 'IZIN' | 'SAKIT' | 'ALPA';

export interface StudentAttendanceItem {
    id_student: string;
    status: AttendanceStatus;
    notes?: string;
}

export interface StudentAttendanceSheetItem {
    id_student: string;
    nis: string;
    nisn: string;
    name: string;
    gender: string;
    profile_url?: string;
    status: AttendanceStatus;
    notes?: string;
    attendance_id?: string | null;
}

export interface AttendanceApprovalCheckResponse {
    is_approved: boolean;
    approval_data?: {
        isApproved?: boolean;
        googleDriveUrl?: string;
        approvedBy?: string;
        headmasterNiy?: string;
        approvedAt?: string;
        notes?: string;
    } | null;
    message: string;
}

export interface TeachingSlot {
    day: string;
    jp: number | string;
    time_range: string;
    class_name: string;
    id_class?: string;
    teacher_code: number;
    teacher_id?: string;
    teacher_name: string;
    subject_name: string;
    notes?: string;
    is_recorded?: boolean;
    recorded_count?: number;
}

export interface AccessibleClassItem {
    id_class: string;
    name: string;
    subjects: string[];
    days: string[];
}

export interface AcademicYearMeetingItem extends TeachingSlot {
    pertemuan_ke: number;
    date: string;
    semester: string;
}

export interface AcademicYearMeetingsResponse {
    is_approved: boolean;
    approval_data?: AttendanceApprovalCheckResponse['approval_data'];
    message: string;
    is_admin_view: boolean;
    teacher_name?: string | null;
    has_calendar: boolean;
    classes: AccessibleClassItem[];
    selected_class_id?: string | null;
    meetings: AcademicYearMeetingItem[];
}

export interface AttendanceSessionOptionsResponse {
    is_approved: boolean;
    approval_data?: AttendanceApprovalCheckResponse['approval_data'];
    message: string;
    is_holiday: boolean;
    holiday_reason?: string;
    day_name: string;
    is_admin_view: boolean;
    teacher_name?: string | null;
    classes: AccessibleClassItem[];
    selected_class_id?: string | null;
    slots: TeachingSlot[];
    class_weekly_slots: TeachingSlot[];
}

export interface AttendanceSheetResponse {
    is_schedule_approved: boolean;
    is_holiday?: boolean;
    holiday_reason?: string;
    is_authorized?: boolean;
    message: string;
    approval_data?: any;
    date?: string;
    id_class?: string;
    jp?: string;
    subject_name?: string;
    students: StudentAttendanceSheetItem[];
    recap: {
        HADIR: number;
        IZIN: number;
        SAKIT: number;
        ALPA: number;
        TOTAL: number;
    };
}

export interface BatchSaveAttendancePayload {
    id_school_information: string;
    id_class: string;
    id_teacher?: string;
    teacher_name?: string;
    subject_name?: string;
    date: string;
    day: string;
    jp?: string;
    time_range?: string;
    teaching_agenda?: string | null;
    attendances: StudentAttendanceItem[];
}

export interface AttendanceSettingsModel {
    id_setting?: string;
    user_id?: string;
    use_face_verification: boolean;
    use_geolocation: boolean;
    school_latitude?: number | null;
    school_longitude?: number | null;
    max_radius_meters: number;
}

export interface ScanAttendancePayload {
    id_school_information: string;
    id_class: string;
    id_teacher?: string;
    teacher_name?: string;
    subject_name?: string;
    date: string;
    day: string;
    jp?: string;
    time_range?: string;
    barcode_value: string;
    session_token?: string | null;
    face_image_base64?: string | null;
    liveness_image_base64?: string | null;
    liveness_challenge?: string | null;
    latitude?: number | null;
    longitude?: number | null;
}

export type AttendanceSessionOpenStatus = 'BELUM_DIBUKA' | 'DIBUKA' | 'DITUTUP';

export interface AttendanceSessionStatusResponse {
    status: AttendanceSessionOpenStatus;
    session_token?: string | null;
    teaching_agenda?: string | null;
}

export interface AttendanceSessionAgendaPayload {
    id_school_information: string;
    id_class: string;
    date: string;
    jp?: string;
    subject_name?: string;
    teaching_agenda: string;
}

export interface ScanAttendanceResponse {
    id_student: string;
    name: string;
    nis: string;
    nisn: string;
    status: AttendanceStatus;
    face_verified: boolean;
    face_distance?: number | null;
    geo_verified: boolean;
    distance_meters?: number | null;
    notes: string;
}

// ─── Student Attendance Matrix Types ───────────────────────────────────────────

export interface StudentMeetingAttendance {
    pertemuan_ke: number;
    date: string;
    day: string;
    semester: string;
    jp: string | number | null;
    time_range: string | null;
    status: 'HADIR' | 'SAKIT' | 'IZIN' | 'ALPA' | null;
    points: number | null;
    notes: string | null;
    is_future: boolean;
}

export interface StudentSubjectAttendance {
    subject_name: string;
    class_name: string;
    teacher_name: string;
    jp: string | null;
    time_range: string | null;
    meetings: StudentMeetingAttendance[];
    total_points: number;
    completed_meetings: number;
    hadir_count: number;
    sakit_count: number;
    izin_count: number;
    alpa_count: number;
    percentage: number;
    is_below_threshold: boolean;
}

export interface StudentAttendanceMatrixResponse {
    student: {
        id: string;
        name: string;
        nis: string;
        nisn: string | null;
        profile_url: string | null;
        class_id: string;
        class_name: string;
    };
    overall: {
        average_percentage: number;
        total_points: number;
        total_completed: number;
        subjects_below_75: number;
        total_subjects: number;
        threshold: number;
    };
    point_rules: {
        HADIR: number;
        SAKIT: number;
        IZIN: number;
        ALPA: number;
        formula: string;
    };
    max_meetings: number;
    subjects: StudentSubjectAttendance[];
}
