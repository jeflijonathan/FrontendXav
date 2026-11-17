import { useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import JenisJamService from '@api/jenisJam/service';
import SchoolInformationService from '@api/schoolinformation/service';
import { RosterScheduleService } from '@api/schedule/service';
import { useRosterJamStore, createEmptySchedule } from '../store';

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
                            // Check local storage fallback
                            const localStored = prevSchedulesFromLocal(schoolInfoId);
                            if (localStored) {
                                setState((prev) => ({
                                    ...prev,
                                    schedules: localStored,
                                    isLoading: false,
                                }));
                            } else {
                                // Belum dibuat sama sekali -> KOSONG
                                setState((prev) => ({
                                    ...prev,
                                    schedules: createEmptySchedule(),
                                    isLoading: false,
                                }));
                            }
                        }
                    },
                    onError: () => {
                        // Fallback to local storage or empty
                        const localStored = prevSchedulesFromLocal(schoolInfoId);
                        setState((prev) => ({
                            ...prev,
                            schedules: localStored || createEmptySchedule(),
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

    const prevSchedulesFromLocal = (key: string) => {
        try {
            const raw = localStorage.getItem('smk_roster_period_schedules');
            if (raw) {
                const parsed = JSON.parse(raw);
                return parsed[key] || null;
            }
        } catch {
            // ignore
        }
        return null;
    };

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
        const currentPeriodKey = targetId || state.periode;

        setState((prev) => ({ ...prev, isSaving: true }));

        // 1. Simpan ke LocalStorage
        try {
            const updated = {
                ...state.periodSchedules,
                [currentPeriodKey]: state.schedules,
            };
            localStorage.setItem('smk_roster_period_schedules', JSON.stringify(updated));
        } catch {
            // ignore
        }

        // 2. Simpan ke Database Backend jika selectedSchoolInfoId tersedia
        if (targetId) {
            await rosterScheduleService.saveBySchoolInformation(
                targetId,
                { schedules: state.schedules, is_synced: true },
                {
                    onSuccess: () => {
                        setState((prev) => ({ ...prev, isSaving: false }));
                        enqueueSnackbar(
                            `Roster Jam Belajar periode ${state.periode} berhasil disimpan ke database!`,
                            { variant: 'success' }
                        );
                    },
                    onError: (err) => {
                        console.warn('Simpan ke backend gagal, tersimpan lokal:', err);
                        setState((prev) => ({ ...prev, isSaving: false }));
                        enqueueSnackbar(
                            `Roster Jam Belajar disimpan di penyimpanan lokal (offline)`,
                            { variant: 'info' }
                        );
                    },
                }
            );
        } else {
            setTimeout(() => {
                setState((prev) => ({ ...prev, isSaving: false }));
                enqueueSnackbar(`Roster Jam Belajar periode ${state.periode} berhasil disimpan!`, {
                    variant: 'success',
                });
            }, 300);
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
