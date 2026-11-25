import { useCallback, useEffect, useState } from 'react';
import attendanceService from '@api/attendance/service';
import type { AttendanceSettingsModel } from '@api/attendance/model';
import { snackbar } from '@utils/snackbar';
import useDashboardAttendanceStore from '../../store';
import { getBrowserPosition } from '../../Scan/utils/scanMediaHelper';
import { validateAttendanceSettings } from '../utils/settingsValidation';

export function useAttendanceSettings() {
    const { state, setState } = useDashboardAttendanceStore();
    const [draft, setDraft] = useState<AttendanceSettingsModel>(state.settings);
    const [isSavingSettings, setIsSavingSettings] = useState<boolean>(false);
    const [isGettingLocation, setIsGettingLocation] = useState<boolean>(false);

    const fetchSettings = useCallback(async () => {
        setState({ isLoadingSettings: true });
        try {
            const data = await attendanceService.getSettings();
            setState({ settings: data });
            setDraft(data);
        } finally {
            setState({ isLoadingSettings: false });
        }
    }, [setState]);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    useEffect(() => {
        if (state.isSettingsDialogOpen) {
            setDraft(state.settings);
        }
    }, [state.isSettingsDialogOpen, state.settings]);

    const handleUseCurrentLocation = useCallback(async () => {
        setIsGettingLocation(true);
        try {
            const pos = await getBrowserPosition();
            setDraft((prev) => ({
                ...prev,
                school_latitude: Number(pos.latitude.toFixed(6)),
                school_longitude: Number(pos.longitude.toFixed(6)),
            }));
            snackbar.success('Koordinat GPS saat ini berhasil diisi sebagai titik sekolah.');
        } catch (err: any) {
            snackbar.error(err?.message || 'Gagal mengambil koordinat GPS.');
        } finally {
            setIsGettingLocation(false);
        }
    }, []);

    const handleSaveSettings = useCallback(async () => {
        const errMsg = validateAttendanceSettings(draft);
        if (errMsg) {
            snackbar.warning(errMsg);
            return;
        }
        setIsSavingSettings(true);
        try {
            const saved = await attendanceService.updateSettings(draft);
            setState({ settings: saved, isSettingsDialogOpen: false });
            snackbar.success('Pengaturan verifikasi presensi berhasil disimpan.');
        } catch (err: any) {
            snackbar.error(err?.message || 'Gagal menyimpan pengaturan presensi.');
        } finally {
            setIsSavingSettings(false);
        }
    }, [draft, setState]);

    const openSettings = useCallback(() => setState({ isSettingsDialogOpen: true }), [setState]);
    const closeSettings = useCallback(() => setState({ isSettingsDialogOpen: false }), [setState]);

    return {
        settings: state.settings,
        draft,
        setDraft,
        isOpen: state.isSettingsDialogOpen,
        isSavingSettings,
        isGettingLocation,
        openSettings,
        closeSettings,
        handleUseCurrentLocation,
        handleSaveSettings,
    };
}

export default useAttendanceSettings;
