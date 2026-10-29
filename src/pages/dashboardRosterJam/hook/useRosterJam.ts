import { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import JenisJamService from '@api/jenisJam/service';
import { useRosterJamStore } from '../store';

export const useRosterJam = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { state, setState } = useRosterJamStore();
    const service = new JenisJamService();

    const fetchJenisJam = async () => {
        setState((prev) => ({ ...prev, isLoading: true }));
        await service.getAll({
            onSuccess: (data) => {
                setState((prev) => ({
                    ...prev,
                    jenisJamList: data,
                    isLoading: false,
                }));
            },
            onError: (err) => {
                // If backend is not currently running or empty, don't crash the UI
                console.warn('Failed to load jenis jam from API:', err.message);
                setState((prev) => ({ ...prev, isLoading: false }));
            },
        });
    };

    useEffect(() => {
        fetchJenisJam();
    }, []);

    const handleSaveAll = async () => {
        setState((prev) => ({ ...prev, isSaving: true }));
        // Simulate save
        setTimeout(() => {
            setState((prev) => ({ ...prev, isSaving: false }));
            enqueueSnackbar('Perubahan Roster Jam Belajar berhasil disimpan!', {
                variant: 'success',
            });
        }, 600);
    };

    const handleExport = () => {
        // Export format logic (e.g. JSON or CSV representation)
        const exportData = {
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
        handleSaveAll,
        handleExport,
    };
};
