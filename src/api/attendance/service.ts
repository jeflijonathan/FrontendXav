import { API } from "../index";
import type {
    AttendanceApprovalCheckResponse,
    AcademicYearMeetingsResponse,
    AttendanceSessionOptionsResponse,
    TeachingSlot,
    AttendanceSheetResponse,
    BatchSaveAttendancePayload,
    AttendanceSettingsModel,
    ScanAttendancePayload,
    ScanAttendanceResponse,
    StudentAttendanceMatrixResponse,
    AttendanceSessionStatusResponse,
    AttendanceSessionAgendaPayload,
} from "./model";

export class AttendanceService {
    basePath = "/attendance";
    service = new API();

    async checkScheduleApproval(idSchoolInformation: string): Promise<AttendanceApprovalCheckResponse> {
        try {
            const res = await this.service.GET<AttendanceApprovalCheckResponse>(
                `${this.basePath}/check-approval`,
                { id_school_information: idSchoolInformation }
            );
            return res.data;
        } catch (err: any) {
            return {
                is_approved: false,
                message: err?.message || "Gagal memeriksa status pengesahan jadwal",
            };
        }
    }

    async getAcademicYearMeetings(
        idSchoolInformation: string,
        idClass?: string
    ): Promise<AcademicYearMeetingsResponse> {
        try {
            const params: Record<string, string> = {
                id_school_information: idSchoolInformation,
            };
            if (idClass) params.id_class = idClass;

            const res = await this.service.GET<AcademicYearMeetingsResponse>(
                `${this.basePath}/meetings`,
                params
            );
            return res.data;
        } catch (err: any) {
            console.error("Error fetching academic year meetings:", err);
            return {
                is_approved: false,
                message: err?.message || "Gagal memuat daftar pertemuan tahun ajaran",
                is_admin_view: false,
                has_calendar: false,
                classes: [],
                meetings: [],
            };
        }
    }

    async getSessionOptions(
        idSchoolInformation: string,
        date: string,
        idClass?: string
    ): Promise<AttendanceSessionOptionsResponse> {
        try {
            const params: Record<string, string> = {
                id_school_information: idSchoolInformation,
                date,
            };
            if (idClass) params.id_class = idClass;

            const res = await this.service.GET<AttendanceSessionOptionsResponse>(
                `${this.basePath}/session-options`,
                params
            );
            return res.data;
        } catch (err: any) {
            console.error("Error fetching session options:", err);
            return {
                is_approved: false,
                message: err?.message || "Gagal memuat opsi sesi presensi",
                is_holiday: false,
                day_name: "",
                is_admin_view: false,
                classes: [],
                slots: [],
                class_weekly_slots: [],
            };
        }
    }

    async getTeachingSlots(
        idSchoolInformation: string,
        day?: string,
        className?: string
    ): Promise<TeachingSlot[]> {
        try {
            const params: Record<string, string> = { id_school_information: idSchoolInformation };
            if (day) params.day = day;
            if (className) params.class_name = className;

            const res = await this.service.GET<TeachingSlot[]>(
                `${this.basePath}/teaching-slots`,
                params
            );
            return Array.isArray(res.data) ? res.data : [];
        } catch (err: any) {
            console.error("Error fetching teaching slots:", err);
            return [];
        }
    }

    async getAttendanceSheet(
        idSchoolInformation: string,
        idClass: string,
        date: string,
        jp?: string,
        subjectName?: string
    ): Promise<AttendanceSheetResponse> {
        try {
            const params: Record<string, string> = {
                id_school_information: idSchoolInformation,
                id_class: idClass,
                date,
            };
            if (jp !== undefined && jp !== "") params.jp = String(jp);
            if (subjectName) params.subject_name = subjectName;

            const res = await this.service.GET<AttendanceSheetResponse>(
                `${this.basePath}/sheet`,
                params
            );
            return res.data;
        } catch (err: any) {
            console.error("Error fetching attendance sheet:", err);
            return {
                is_schedule_approved: false,
                message: err?.message || "Gagal memuat lembar presensi",
                students: [],
                recap: { HADIR: 0, IZIN: 0, SAKIT: 0, ALPA: 0, TOTAL: 0 },
            };
        }
    }

    async saveBatchAttendance(payload: BatchSaveAttendancePayload): Promise<{ saved_count: number }> {
        const res = await this.service.POST<{ saved_count: number }>(
            `${this.basePath}/batch`,
            payload
        );
        return res.data;
    }

    async getRecap(
        idSchoolInformation: string,
        idClass?: string,
        dateStart?: string,
        dateEnd?: string
    ): Promise<{ HADIR: number; IZIN: number; SAKIT: number; ALPA: number; TOTAL: number }> {
        try {
            const params: Record<string, string> = { id_school_information: idSchoolInformation };
            if (idClass) params.id_class = idClass;
            if (dateStart) params.date_start = dateStart;
            if (dateEnd) params.date_end = dateEnd;

            const res = await this.service.GET<any>(`${this.basePath}/recap`, params);
            return res.data || { HADIR: 0, IZIN: 0, SAKIT: 0, ALPA: 0, TOTAL: 0 };
        } catch (err: any) {
            console.error("Error fetching recap:", err);
            return { HADIR: 0, IZIN: 0, SAKIT: 0, ALPA: 0, TOTAL: 0 };
        }
    }

    async getSettings(): Promise<AttendanceSettingsModel> {
        try {
            const res = await this.service.GET<AttendanceSettingsModel>(`${this.basePath}/settings`);
            return res.data;
        } catch {
            return {
                use_face_verification: true,
                use_geolocation: true,
                school_latitude: null,
                school_longitude: null,
                max_radius_meters: 200,
            };
        }
    }

    async updateSettings(payload: AttendanceSettingsModel): Promise<AttendanceSettingsModel> {
        const res = await this.service.PUT<AttendanceSettingsModel>(`${this.basePath}/settings`, payload);
        return res.data;
    }

    async scanAttendance(payload: ScanAttendancePayload): Promise<ScanAttendanceResponse> {
        const res = await this.service.POST<ScanAttendanceResponse>(`${this.basePath}/scan`, payload);
        return res.data;
    }

    // Alias untuk kompatibilitas StudentAttendanceScanView
    async scan(payload: ScanAttendancePayload): Promise<{ data: ScanAttendanceResponse }> {
        const res = await this.service.POST<ScanAttendanceResponse>(`${this.basePath}/scan`, payload);
        return res;
    }

    async getStudentMatrix(idSchoolInformation: string): Promise<StudentAttendanceMatrixResponse> {
        const res = await this.service.GET<StudentAttendanceMatrixResponse>(
            `${this.basePath}/student-matrix`,
            { id_school_information: idSchoolInformation }
        );
        return res.data;
    }

    async getSessionStatus(params: {
        id_school_information: string;
        id_class: string;
        date: string;
        jp?: string;
        subject_name?: string;
    }): Promise<AttendanceSessionStatusResponse> {
        const res = await this.service.GET<AttendanceSessionStatusResponse>(
            `${this.basePath}/session-status`,
            params
        );
        return res.data;
    }

    async updateSessionStatus(payload: {
        id_school_information: string;
        id_class: string;
        date: string;
        jp?: string;
        subject_name?: string;
        action: 'OPEN' | 'CLOSE';
    }): Promise<AttendanceSessionStatusResponse> {
        const res = await this.service.POST<AttendanceSessionStatusResponse>(
            `${this.basePath}/session-status`,
            payload
        );
        return res.data;
    }

    async updateSessionAgenda(
        payload: AttendanceSessionAgendaPayload
    ): Promise<AttendanceSessionStatusResponse> {
        const res = await this.service.PUT<AttendanceSessionStatusResponse>(
            `${this.basePath}/session-agenda`,
            payload
        );
        return res.data;
    }
}

export const attendanceService = new AttendanceService();
export default attendanceService;
