import { useCallback, useEffect } from "react";
import SchoolInformationService from "@api/schoolinformation/service";
import type { SchoolInformationResponseModel } from "@api/schoolinformation/model";
import dailyAttendanceService from "@api/dailyAttendance/service";
import { snackbar } from "@utils/snackbar";
import useDashboardDailyAttendanceStore from "../../store";
import { extractMonthOptionsFromMeetings } from "../utils/dailyAttendanceMapper";

export function useDailyAttendanceList() {
    const { state, setState } = useDashboardDailyAttendanceStore();
    const {
        selectedSchoolInfoId,
        selectedClassId,
        selectedMonthKey,
        selectedMeetingDate,
        activeTab,
    } = state;

    const fetchSchoolInfos = useCallback(async () => {
        setState({ isLoadingSchoolInfo: true });
        const schoolService = new SchoolInformationService();
        try {
            await schoolService.getAll({
                onSuccess: (res: any) => {
                    const dataList: SchoolInformationResponseModel[] = Array.isArray(res?.data)
                        ? res.data
                        : Array.isArray(res)
                        ? res
                        : [];
                    const active = dataList.find((s) => s.status === true) || dataList[0];
                    setState((prev) => ({
                        ...prev,
                        schoolInfos: dataList,
                        selectedSchoolInfoId:
                            prev.selectedSchoolInfoId || active?.id_school_information || "",
                    }));
                },
                onError: () => {},
            });
        } catch (err) {
            console.error("Gagal memuat tahun pelajaran:", err);
        } finally {
            setState({ isLoadingSchoolInfo: false });
        }
    }, [setState]);

    const fetchDailyMeetings = useCallback(async () => {
        if (!selectedSchoolInfoId) return;
        setState({ isLoadingMeetings: true });
        try {
            const res = await dailyAttendanceService.getMeetings(
                selectedSchoolInfoId,
                selectedClassId || undefined
            );
            const months = extractMonthOptionsFromMeetings(res.meetings || []);
            const now = new Date();
            const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
                now.getDate()
            ).padStart(2, "0")}`;
            const todayKey = todayStr.slice(0, 7);

            setState((prev) => {
                const nextClassId = res.selected_class_id || prev.selectedClassId || "";
                const hasCurrentMonth = months.some((m) => m.key === prev.selectedMonthKey);
                const hasTodayMonth = months.some((m) => m.key === todayKey);
                const nextMonthKey = hasCurrentMonth
                    ? prev.selectedMonthKey
                    : hasTodayMonth
                    ? todayKey
                    : months[0]?.key || prev.selectedMonthKey;

                const allMeetings = res.meetings || [];
                const hasSelectedDate = allMeetings.some(
                    (m) => m.date === prev.selectedMeetingDate
                );
                const hasTodayMeeting = allMeetings.some((m) => m.date === todayStr);
                const firstInMonth = allMeetings.find((m) =>
                    m.date.startsWith(nextMonthKey)
                );
                const nextMeetingDate = hasSelectedDate
                    ? prev.selectedMeetingDate
                    : hasTodayMeeting
                    ? todayStr
                    : firstInMonth?.date || allMeetings[0]?.date || "";

                return {
                    ...prev,
                    hasCalendar: Boolean(res.has_calendar),
                    periode: res.periode || "",
                    isPiketOrStaff: Boolean(res.is_piket_or_staff),
                    isPengurusKelas: Boolean(res.is_pengurus_kelas),
                    classes: res.classes || [],
                    selectedClassId: nextClassId,
                    meetings: allMeetings,
                    selectedMonthKey: nextMonthKey,
                    selectedMeetingDate: nextMeetingDate,
                };
            });
        } catch (err: any) {
            console.error("Gagal memuat daftar pertemuan harian:", err);
            snackbar.error(err?.message || "Gagal memuat daftar pertemuan buku induk.");
        } finally {
            setState({ isLoadingMeetings: false });
        }
    }, [selectedSchoolInfoId, selectedClassId, setState]);

    const fetchMonthlyLedger = useCallback(async () => {
        if (!selectedSchoolInfoId || !selectedClassId || !selectedMonthKey) return;
        const [yStr, mStr] = selectedMonthKey.split("-");
        const year = Number(yStr);
        const month = Number(mStr);
        if (!year || !month) return;

        setState({ isLoadingLedger: true });
        try {
            const ledger = await dailyAttendanceService.getMonthlyLedger(
                selectedSchoolInfoId,
                selectedClassId,
                year,
                month
            );
            setState({ monthlyLedger: ledger });
        } catch (err: any) {
            console.error("Gagal memuat buku induk bulanan:", err);
        } finally {
            setState({ isLoadingLedger: false });
        }
    }, [selectedSchoolInfoId, selectedClassId, selectedMonthKey, setState]);

    const fetchDailySheet = useCallback(async () => {
        if (
            activeTab !== "input" ||
            !selectedSchoolInfoId ||
            !selectedClassId ||
            !selectedMeetingDate
        ) {
            return;
        }
        setState({ isLoadingSheet: true });
        try {
            const res = await dailyAttendanceService.getDailySheet(
                selectedSchoolInfoId,
                selectedClassId,
                selectedMeetingDate
            );
            setState({
                sheetStudents: res.students || [],
                sheetRecordedBy: res.recorded_by_name || null,
                sheetUpdatedBy: res.updated_by_name || null,
            });
        } catch (err: any) {
            console.error("Gagal memuat lembar harian siswa:", err);
            snackbar.error(err?.message || "Gagal memuat daftar siswa kelas.");
        } finally {
            setState({ isLoadingSheet: false });
        }
    }, [activeTab, selectedSchoolInfoId, selectedClassId, selectedMeetingDate, setState]);

    useEffect(() => {
        fetchSchoolInfos();
    }, [fetchSchoolInfos]);

    useEffect(() => {
        fetchDailyMeetings();
    }, [fetchDailyMeetings]);

    useEffect(() => {
        fetchMonthlyLedger();
    }, [fetchMonthlyLedger]);

    useEffect(() => {
        fetchDailySheet();
    }, [fetchDailySheet]);

    return {
        fetchSchoolInfos,
        fetchDailyMeetings,
        fetchMonthlyLedger,
        fetchDailySheet,
    };
}

export default useDailyAttendanceList;
