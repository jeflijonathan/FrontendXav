import type { StudentAttendanceSheetItem } from '@api/attendance/model';

export interface AttendanceRecap {
    HADIR: number;
    IZIN: number;
    SAKIT: number;
    ALPA: number;
    TOTAL: number;
}

export function computeAttendanceRecap(students: StudentAttendanceSheetItem[]): AttendanceRecap {
    const recap: AttendanceRecap = {
        HADIR: 0,
        IZIN: 0,
        SAKIT: 0,
        ALPA: 0,
        TOTAL: students.length,
    };
    students.forEach((s) => {
        if (s.status in recap) {
            recap[s.status as keyof AttendanceRecap]++;
        }
    });
    return recap;
}

export function formatAttendanceDate(dateStr: string): string {
    try {
        const d = new Date(`${dateStr}T00:00:00`);
        return d.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    } catch {
        return dateStr;
    }
}
