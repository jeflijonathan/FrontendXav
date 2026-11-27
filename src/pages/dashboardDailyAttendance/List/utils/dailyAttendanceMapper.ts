import type {
    BatchSaveDailyAttendancePayload,
    DailyMeetingItem,
    DailyStudentSheetItem,
} from "@api/dailyAttendance/model";

const INDONESIAN_MONTHS = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
];

export interface MonthOption {
    key: string; // YYYY-MM
    year: number;
    month: number;
    label: string;
}

export function formatIndonesianShortDate(dateStr: string): string {
    if (!dateStr) return "-";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

export function extractMonthOptionsFromMeetings(meetings: DailyMeetingItem[]): MonthOption[] {
    const map = new Map<string, MonthOption>();
    for (const m of meetings) {
        if (!m.date || m.date.length < 7) continue;
        const key = m.date.slice(0, 7);
        if (!map.has(key)) {
            const [yStr, mStr] = key.split("-");
            const year = Number(yStr);
            const month = Number(mStr);
            const monthName = INDONESIAN_MONTHS[month - 1] || mStr;
            map.set(key, {
                key,
                year,
                month,
                label: `${monthName} ${year}`,
            });
        }
    }
    return Array.from(map.values()).sort((a, b) => a.key.localeCompare(b.key));
}

export function filterMeetingsBySemesterAndMonth(
    meetings: DailyMeetingItem[],
    semesterFilter: "ALL" | "GANJIL" | "GENAP",
    monthKey: string
): DailyMeetingItem[] {
    return meetings.filter((m) => {
        if (semesterFilter !== "ALL") {
            const sem = (m.semester || "").toLowerCase();
            if (!sem.includes(semesterFilter.toLowerCase())) return false;
        }
        if (monthKey && monthKey !== "ALL") {
            if (!m.date.startsWith(monthKey)) return false;
        }
        return true;
    });
}

export function computeDailySheetRecap(students: DailyStudentSheetItem[]) {
    const recap = { HADIR: 0, SAKIT: 0, IZIN: 0, ALPA: 0, TOTAL: students.length };
    for (const s of students) {
        if (s.status === "HADIR") recap.HADIR += 1;
        else if (s.status === "SAKIT") recap.SAKIT += 1;
        else if (s.status === "IZIN") recap.IZIN += 1;
        else if (s.status === "ALPA") recap.ALPA += 1;
    }
    return recap;
}

export function buildBatchDailyPayload(
    idSchoolInformation: string,
    idClass: string,
    meeting: DailyMeetingItem,
    students: DailyStudentSheetItem[]
): BatchSaveDailyAttendancePayload {
    return {
        id_school_information: idSchoolInformation,
        id_class: idClass,
        date: meeting.date,
        day: meeting.day,
        semester: meeting.semester,
        attendances: students.map((s) => ({
            id_student: s.id_student,
            status: s.status,
            notes: s.notes || "",
        })),
    };
}
