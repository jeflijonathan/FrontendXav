export type DailyAttendanceStatus = 'HADIR' | 'SAKIT' | 'IZIN' | 'ALPA';

export interface DailyClassItem {
    id_class: string;
    name: string;
}

export interface DailyAbsentStudentItem {
    id_student: string;
    name: string;
    status: 'SAKIT' | 'IZIN' | 'ALPA';
    notes: string;
}

export interface DailyMeetingItem {
    pertemuan_ke: number;
    date: string;
    day: string;
    semester: string;
    is_recorded: boolean;
    recorded_count: number;
    total_students: number;
    hadir_count: number;
    sakit_count: number;
    izin_count: number;
    alpa_count: number;
    is_nihil: boolean;
    absent_students: DailyAbsentStudentItem[];
    last_updated_by?: string | null;
}

export interface DailyMeetingsResponse {
    has_calendar: boolean;
    periode: string;
    is_piket_or_staff: boolean;
    is_pengurus_kelas: boolean;
    classes: DailyClassItem[];
    selected_class_id?: string | null;
    meetings: DailyMeetingItem[];
}

export interface DailyStudentSheetItem {
    id_student: string;
    nis: string;
    nisn?: string | null;
    name: string;
    gender?: string | null;
    profile_url?: string | null;
    status: DailyAttendanceStatus;
    notes?: string;
    attendance_id?: string | null;
}

export interface DailySheetResponse {
    is_holiday: boolean;
    holiday_reason?: string | null;
    date: string;
    day: string;
    is_recorded?: boolean;
    recorded_by_name?: string | null;
    updated_by_name?: string | null;
    students: DailyStudentSheetItem[];
    recap: {
        HADIR: number;
        SAKIT: number;
        IZIN: number;
        ALPA: number;
        TOTAL: number;
    };
}

export interface BatchSaveDailyAttendancePayload {
    id_school_information: string;
    id_class: string;
    date: string;
    day: string;
    semester?: string;
    attendances: Array<{
        id_student: string;
        status: DailyAttendanceStatus;
        notes?: string;
    }>;
}

export interface DailyLedgerRow {
    no: number;
    id_student: string;
    nis: string;
    name: string;
    gender: string;
    days: Record<string, DailyAttendanceStatus | null>;
    sakit: number;
    izin: number;
    alpa: number;
    total_absent: number;
    ket: string;
}

export interface DailyMonthlyLedgerResponse {
    year: number;
    month: number;
    days_in_month: number;
    effective_days: number[];
    rows: DailyLedgerRow[];
}
