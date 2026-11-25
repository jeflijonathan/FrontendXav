import { useCallback, useEffect } from 'react';
import SchoolInformationService from '@api/schoolinformation/service';
import type { SchoolInformationResponseModel } from '@api/schoolinformation/model';
import attendanceService from '@api/attendance/service';
import { snackbar } from '@utils/snackbar';
import useDashboardAttendanceStore from '../../store';

export function useAttendanceList() {
    const { state, setState } = useDashboardAttendanceStore();
    const { selectedSchoolInfoId, selectedClassId, selectedSubject, isApproved, selectedMeeting } = state;

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
                        selectedSchoolInfoId: prev.selectedSchoolInfoId || active?.id_school_information || '',
                    }));
                },
                onError: () => {},
            });
        } catch (err) {
            console.error('Error fetching school information:', err);
        } finally {
            setState({ isLoadingSchoolInfo: false });
        }
    }, [setState]);

    const fetchMeetings = useCallback(async () => {
        if (!selectedSchoolInfoId) return;
        setState({ isLoadingMeetings: true });
        try {
            const res = await attendanceService.getAcademicYearMeetings(
                selectedSchoolInfoId,
                selectedClassId || undefined
            );

            setState((prev) => {
                const nextClassId =
                    res.selected_class_id && res.selected_class_id !== prev.selectedClassId
                        ? res.selected_class_id
                        : !res.classes || res.classes.length === 0
                        ? ''
                        : prev.selectedClassId;

                if (!res.is_approved) {
                    return {
                        ...prev,
                        isApproved: false,
                        approvalData: res.approval_data || null,
                        hasCalendar: Boolean(res.has_calendar),
                        isAdminView: Boolean(res.is_admin_view),
                        teacherDisplayName: res.teacher_name || null,
                        classes: res.classes || [],
                        selectedClassId: nextClassId,
                        meetings: [],
                        selectedMeeting: null,
                        students: [],
                    };
                }

                const list = res.meetings || [];
                let nextMeeting = prev.selectedMeeting;
                if (!prev.selectedSubject) {
                    nextMeeting = null;
                } else {
                    const subList = list.filter((m) => m.subject_name === prev.selectedSubject);
                    if (prev.selectedMeeting) {
                        const same = subList.find(
                            (m) =>
                                m.date === prev.selectedMeeting?.date &&
                                String(m.jp) === String(prev.selectedMeeting?.jp) &&
                                m.subject_name === prev.selectedMeeting?.subject_name
                        );
                        nextMeeting = same || null;
                    }
                    if (!nextMeeting && subList.length > 0) {
                        const today = new Date();
                        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                        nextMeeting = subList.find((m) => m.date >= todayStr) || subList[0];
                    }
                }

                return {
                    ...prev,
                    isApproved: true,
                    approvalData: res.approval_data || null,
                    hasCalendar: Boolean(res.has_calendar),
                    isAdminView: Boolean(res.is_admin_view),
                    teacherDisplayName: res.teacher_name || null,
                    classes: res.classes || [],
                    selectedClassId: nextClassId,
                    meetings: list,
                    selectedMeeting: nextMeeting,
                };
            });
        } catch (err) {
            console.error('Error fetching academic year meetings:', err);
            setState({
                isApproved: false,
                meetings: [],
                selectedMeeting: null,
                students: [],
            });
        } finally {
            setState({ isLoadingMeetings: false });
        }
    }, [selectedSchoolInfoId, selectedClassId, setState]);

    const loadAttendanceSheet = useCallback(async (silent = false) => {
        if (!selectedSchoolInfoId || !selectedClassId || !selectedSubject || !isApproved || !selectedMeeting) {
            setState({ students: [] });
            return;
        }

        if (!silent) {
            setState({ isLoadingSheet: true });
        }
        try {
            const res = await attendanceService.getAttendanceSheet(
                selectedSchoolInfoId,
                selectedClassId,
                selectedMeeting.date,
                String(selectedMeeting.jp),
                selectedMeeting.subject_name
            );

            if (!res.is_schedule_approved || res.is_holiday) {
                setState({
                    students: [],
                    sessionOpenStatus: 'BELUM_DIBUKA',
                    sessionToken: null,
                });
            } else if (res.is_authorized === false) {
                snackbar.error(res.message || 'Anda tidak memiliki akses untuk sesi ini.');
                setState({
                    students: [],
                    sessionOpenStatus: 'BELUM_DIBUKA',
                    sessionToken: null,
                });
            } else {
                let nextStatus: 'BELUM_DIBUKA' | 'DIBUKA' | 'DITUTUP' = 'BELUM_DIBUKA';
                let nextToken: string | null = null;
                try {
                    const sessionRes = await attendanceService.getSessionStatus({
                        id_school_information: selectedSchoolInfoId,
                        id_class: selectedClassId,
                        date: selectedMeeting.date,
                        jp: String(selectedMeeting.jp),
                        subject_name: selectedMeeting.subject_name,
                    });
                    nextStatus = sessionRes.status || 'BELUM_DIBUKA';
                    nextToken = sessionRes.session_token || null;
                } catch {
                    // keep default BELUM_DIBUKA
                }
                setState({
                    students: res.students || [],
                    sessionOpenStatus: nextStatus,
                    sessionToken: nextToken,
                });
            }
        } catch (err) {
            console.error('Error loading attendance sheet:', err);
            if (!silent) {
                setState({ students: [] });
            }
        } finally {
            if (!silent) {
                setState({ isLoadingSheet: false });
            }
        }
    }, [selectedSchoolInfoId, selectedClassId, selectedSubject, isApproved, selectedMeeting, setState]);

    useEffect(() => {
        fetchSchoolInfos();
    }, [fetchSchoolInfos]);

    useEffect(() => {
        fetchMeetings();
    }, [fetchMeetings]);

    useEffect(() => {
        loadAttendanceSheet();
    }, [loadAttendanceSheet]);

    return {
        fetchSchoolInfos,
        fetchMeetings,
        loadAttendanceSheet,
    };
}

export default useAttendanceList;
