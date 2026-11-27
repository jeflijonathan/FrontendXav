import { useCallback } from "react";
import dailyAttendanceService from "@api/dailyAttendance/service";
import type {
    DailyAttendanceStatus,
    DailyMeetingItem,
} from "@api/dailyAttendance/model";
import { snackbar } from "@utils/snackbar";
import useDashboardDailyAttendanceStore from "../../store";
import { buildBatchDailyPayload } from "../../List/utils/dailyAttendanceMapper";

export function useSaveDailyAttendance(onSuccessRefresh: () => Promise<void>) {
    const { state, setState } = useDashboardDailyAttendanceStore();

    const openEditDialog = useCallback(
        async (meeting: DailyMeetingItem) => {
            const { selectedSchoolInfoId, selectedClassId } =
                useDashboardDailyAttendanceStore.getState().state;
            if (!selectedSchoolInfoId || !selectedClassId) return;

            setState({
                editingMeeting: meeting,
                isEditDialogOpen: true,
                isLoadingSheet: true,
                sheetStudents: [],
                sheetRecordedBy: null,
                sheetUpdatedBy: null,
            });

            try {
                const res = await dailyAttendanceService.getDailySheet(
                    selectedSchoolInfoId,
                    selectedClassId,
                    meeting.date
                );
                if (res.is_holiday) {
                    snackbar.warning(`Hari Libur: ${res.holiday_reason || "-"}`);
                }
                setState({
                    sheetStudents: res.students || [],
                    sheetRecordedBy: res.recorded_by_name || null,
                    sheetUpdatedBy: res.updated_by_name || null,
                });
            } catch (err: any) {
                snackbar.error(err?.message || "Gagal memuat daftar siswa kelas.");
                setState({ isEditDialogOpen: false, editingMeeting: null });
            } finally {
                setState({ isLoadingSheet: false });
            }
        },
        [setState]
    );

    const closeEditDialog = useCallback(() => {
        setState({
            isEditDialogOpen: false,
            editingMeeting: null,
            sheetStudents: [],
        });
    }, [setState]);

    const handleStudentStatusChange = useCallback(
        (idStudent: string, status: DailyAttendanceStatus) => {
            setState((prev) => ({
                ...prev,
                sheetStudents: prev.sheetStudents.map((s) =>
                    s.id_student === idStudent ? { ...s, status } : s
                ),
            }));
        },
        [setState]
    );

    const handleStudentNotesChange = useCallback(
        (idStudent: string, notes: string) => {
            setState((prev) => ({
                ...prev,
                sheetStudents: prev.sheetStudents.map((s) =>
                    s.id_student === idStudent ? { ...s, notes } : s
                ),
            }));
        },
        [setState]
    );

    const handleMarkAllHadir = useCallback(() => {
        setState((prev) => ({
            ...prev,
            sheetStudents: prev.sheetStudents.map((s) => ({ ...s, status: "HADIR" })),
        }));
        snackbar.info("Semua siswa ditandai Hadir (Nihil).");
    }, [setState]);

    const handleSaveDaily = useCallback(
        async (overrideMeeting?: DailyMeetingItem | null) => {
            const {
                selectedSchoolInfoId,
                selectedClassId,
                editingMeeting,
                selectedMeetingDate,
                meetings,
                sheetStudents,
            } = useDashboardDailyAttendanceStore.getState().state;

            const targetMeeting =
                overrideMeeting ||
                editingMeeting ||
                meetings.find((m) => m.date === selectedMeetingDate) ||
                null;

            if (
                !selectedSchoolInfoId ||
                !selectedClassId ||
                !targetMeeting ||
                sheetStudents.length === 0
            ) {
                return;
            }

            setState({ isSaving: true });
            try {
                const payload = buildBatchDailyPayload(
                    selectedSchoolInfoId,
                    selectedClassId,
                    targetMeeting,
                    sheetStudents
                );
                await dailyAttendanceService.saveBatch(payload);
                snackbar.success(
                    `Buku induk kehadiran ${targetMeeting.day}, ${targetMeeting.date} berhasil disimpan.`
                );
                setState({ isEditDialogOpen: false, editingMeeting: null });
                await onSuccessRefresh();
            } catch (err: any) {
                snackbar.error(err?.message || "Gagal menyimpan buku induk kehadiran.");
            } finally {
                setState({ isSaving: false });
            }
        },
        [setState, onSuccessRefresh]
    );

    return {
        openEditDialog,
        closeEditDialog,
        handleStudentStatusChange,
        handleStudentNotesChange,
        handleMarkAllHadir,
        handleSaveDaily,
    };
}

export default useSaveDailyAttendance;
