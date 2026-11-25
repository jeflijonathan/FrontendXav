import { useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import JenisJamService from '@api/jenisJam/service';
import SchoolInformationService from '@api/schoolinformation/service';
import { RosterScheduleService } from '@api/schedule/service';
import { useRosterJamStore, createEmptySchedule } from '../store';
import { snackbar } from '@utils/snackbar';

export const useRosterJam = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { state, setState, setSchoolInfoList, selectPeriod } = useRosterJamStore();
    const jenisJamService = new JenisJamService();
    const schoolInfoService = new SchoolInformationService();
    const rosterScheduleService = new RosterScheduleService();

    // 1. Fetch jenis jam list from API
    const fetchJenisJam = async () => {
        await jenisJamService.getAll({
            onSuccess: (data) => {
                setState((prev) => ({
                    ...prev,
                    jenisJamList: data,
                }));
            },
            onError: (err) => {
                console.warn('Failed to load jenis jam from API:', err.message);
            },
        });
    };

    // 2. Fetch school informations to get active period, work_days, lesson_duration
    const fetchSchoolInformations = useCallback(async () => {
        setState((prev) => ({ ...prev, isLoading: true }));
        try {
            await schoolInfoService.getAll({
                onSuccess: (res) => {
                    const list = res?.data || [];
                    if (list.length > 0) {
                        setSchoolInfoList(list);
                    }
                    setState((prev) => ({ ...prev, isLoading: false }));
                },
                onError: (err) => {
                    console.warn('Failed to load school information:', err.message);
                    setState((prev) => ({ ...prev, isLoading: false }));
                },
            });
        } catch {
            setState((prev) => ({ ...prev, isLoading: false }));
        }
    }, [setState, setSchoolInfoList]);

    // 3. Fetch Roster from Backend for current selectedSchoolInfoId
    const fetchRosterForSelectedSchool = useCallback(
        async (schoolInfoId: string) => {
            if (!schoolInfoId) return;

            setState((prev) => ({ ...prev, isLoading: true }));
            try {
                await rosterScheduleService.getBySchoolInformation(schoolInfoId, {
                    onSuccess: (data) => {
                        if (data && data.schedules && Object.keys(data.schedules).length > 0) {
                            setState((prev) => ({
                                ...prev,
                                schedules: data.schedules,
                                isSynced: data.is_synced ?? true,
                                periodSchedules: {
                                    ...prev.periodSchedules,
                                    [schoolInfoId]: data.schedules,
                                },
                                isLoading: false,
                            }));
                        } else {
                            // Belum dibuat sama sekali di database -> Mulai dengan jadwal kosong
                            setState((prev) => ({
                                ...prev,
                                schedules: createEmptySchedule(),
                                isLoading: false,
                            }));
                        }
                    },
                    onError: () => {
                        setState((prev) => ({
                            ...prev,
                            schedules: createEmptySchedule(),
                            isLoading: false,
                        }));
                    },
                });
            } catch {
                setState((prev) => ({ ...prev, isLoading: false }));
            }
        },
        [setState]
    );

    useEffect(() => {
        fetchJenisJam();
        fetchSchoolInformations();
    }, []);

    // When selectedSchoolInfoId changes, fetch roster from backend
    useEffect(() => {
        if (state.selectedSchoolInfoId) {
            fetchRosterForSelectedSchool(state.selectedSchoolInfoId);
        }
    }, [state.selectedSchoolInfoId]);

    const handleSaveAll = async () => {
        const targetId = state.selectedSchoolInfoId;

        setState((prev) => ({ ...prev, isSaving: true }));

        if (targetId) {
            await rosterScheduleService.saveBySchoolInformation(
                targetId,
                { schedules: state.schedules, is_synced: true },
                {
                    onSuccess: () => {
                        setState((prev) => ({ ...prev, isSaving: false }));
                        snackbar.success(
                            `Roster Jam Belajar periode ${state.periode} berhasil disimpan ke database!`
                        );
                    },
                    onError: (err) => {
                        console.error('Simpan ke backend gagal:', err);
                        setState((prev) => ({ ...prev, isSaving: false }));
                        snackbar.error(
                            `Gagal menyimpan Roster Jam Belajar ke database`,
                        );
                    },
                }
            );
        } else {
            setState((prev) => ({ ...prev, isSaving: false }));
            snackbar.error(
                "Pilih informasi sekolah / periode terlebih dahulu untuk menyimpan Roster ke database."
            );
        }
    };

    const handleExport = () => {
        const exportData = {
            id_school_information: state.selectedSchoolInfoId,
            periode: state.periode,
            hariKerja: state.hariKerja,
            jpDuration: state.jpDuration,
            schedules: state.schedules,
            exportedAt: new Date().toISOString(),
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `roster-jam-${state.periode.replace(/\s+/g, '-').replace(/[\/\(\)]/g, '_')}.json`;
        a.click();
        URL.revokeObjectURL(url);

        enqueueSnackbar('Format Roster Jam berhasil diexport!', {
            variant: 'info',
        });
    };

    return {
        state,
        fetchJenisJam,
        fetchSchoolInformations,
        handleSaveAll,
        handleExport,
        selectPeriod,
    };
};
