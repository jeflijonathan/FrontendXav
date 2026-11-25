import { useCallback } from 'react';
import attendanceService from '@api/attendance/service';
import { snackbar } from '@utils/snackbar';
import useDashboardAttendanceStore from '../../store';
import { buildBatchAttendancePayload } from '../utils/attendancePayloadMapper';

export function useCreateAttendance(onRefreshAfterSave: () => Promise<void>) {
    const { state, setState } = useDashboardAttendanceStore();

    const handleMarkAllHadir = useCallback(() => {
        setState((prev) => ({
            ...prev,
            students: prev.students.map((s) => ({ ...s, status: 'HADIR' })),
        }));
        snackbar.info('Semua siswa ditandai Hadir.');
    }, [setState]);

    const handleMarkAllAlpa = useCallback(() => {
        setState((prev) => ({
            ...prev,
            students: prev.students.map((s) => ({ ...s, status: 'ALPA' })),
        }));
        snackbar.info('Semua siswa ditandai Alpa.');
    }, [setState]);

    const handleSaveBatch = useCallback(async () => {
        const { selectedSchoolInfoId, selectedClassId, selectedMeeting, students } = state;
        if (!selectedSchoolInfoId || !selectedClassId || !selectedMeeting || students.length === 0) {
            snackbar.warning('Tidak ada data siswa atau pertemuan yang dipilih untuk disimpan.');
            return;
        }

        setState({ isSaving: true });
        try {
            const payload = buildBatchAttendancePayload(
                selectedSchoolInfoId,
                selectedClassId,
                selectedMeeting,
                students
            );
            await attendanceService.saveBatchAttendance(payload);
            snackbar.success(
                `Presensi Pertemuan ${selectedMeeting.pertemuan_ke} (${selectedMeeting.subject_name}) berhasil disimpan.`
            );
            await onRefreshAfterSave();
        } catch (err: any) {
            console.error('Error saving attendance:', err);
            snackbar.error(err?.message || 'Gagal menyimpan catatan presensi siswa.');
        } finally {
            setState({ isSaving: false });
        }
    }, [state, setState, onRefreshAfterSave]);

    return {
        handleMarkAllHadir,
        handleMarkAllAlpa,
        handleSaveBatch,
    };
}

export default useCreateAttendance;
