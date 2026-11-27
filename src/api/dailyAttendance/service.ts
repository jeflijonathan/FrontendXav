import { API } from "../index";
import type {
    BatchSaveDailyAttendancePayload,
    DailyMeetingsResponse,
    DailyMonthlyLedgerResponse,
    DailySheetResponse,
} from "./model";

export class DailyAttendanceService {
    basePath = "/daily-attendance";
    service = new API();

    async getMeetings(
        idSchoolInformation: string,
        idClass?: string
    ): Promise<DailyMeetingsResponse> {
        const params: Record<string, string> = { id_school_information: idSchoolInformation };
        if (idClass) params.id_class = idClass;
        const res = await this.service.GET<DailyMeetingsResponse>(
            `${this.basePath}/meetings`,
            params
        );
        return res.data;
    }

    async getDailySheet(
        idSchoolInformation: string,
        idClass: string,
        date: string
    ): Promise<DailySheetResponse> {
        const res = await this.service.GET<DailySheetResponse>(
            `${this.basePath}/sheet`,
            {
                id_school_information: idSchoolInformation,
                id_class: idClass,
                date,
            }
        );
        return res.data;
    }

    async saveBatch(
        payload: BatchSaveDailyAttendancePayload
    ): Promise<{ saved_count: number; date: string; updated_by_name: string }> {
        const res = await this.service.POST<{
            saved_count: number;
            date: string;
            updated_by_name: string;
        }>(`${this.basePath}/batch`, payload);
        return res.data;
    }

    async getMonthlyLedger(
        idSchoolInformation: string,
        idClass: string,
        year: number,
        month: number
    ): Promise<DailyMonthlyLedgerResponse> {
        const res = await this.service.GET<DailyMonthlyLedgerResponse>(
            `${this.basePath}/monthly-ledger`,
            {
                id_school_information: idSchoolInformation,
                id_class: idClass,
                year: String(year),
                month: String(month),
            }
        );
        return res.data;
    }
}

export const dailyAttendanceService = new DailyAttendanceService();
export default dailyAttendanceService;
