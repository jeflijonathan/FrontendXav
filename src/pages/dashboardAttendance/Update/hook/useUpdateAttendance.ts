import { useCallback } from 'react';
import type { AttendanceStatus } from '@api/attendance/model';
import useDashboardAttendanceStore from '../../store';

export function useUpdateAttendance() {
    const { setState } = useDashboardAttendanceStore();

    const handleStatusChange = useCallback(
        (studentId: string, newStatus: AttendanceStatus) => {
            setState((prev) => ({
                ...prev,
                students: prev.students.map((s) =>
                    s.id_student === studentId ? { ...s, status: newStatus } : s
                ),
            }));
        },
        [setState]
    );

    const handleNotesChange = useCallback(
        (studentId: string, notes: string) => {
            setState((prev) => ({
                ...prev,
                students: prev.students.map((s) =>
                    s.id_student === studentId ? { ...s, notes } : s
                ),
            }));
        },
        [setState]
    );

    return {
        handleStatusChange,
        handleNotesChange,
    };
}

export default useUpdateAttendance;
