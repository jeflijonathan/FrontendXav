import useAuthStore from '@common/store/useAuthStore';

const SCHEDULE_MANAGER_ROLES = ['kurikulum', 'kepala_sekolah', 'admin', 'superadmin'];
const KEPALA_SEKOLAH_ROLES = ['kepala_sekolah', 'admin', 'superadmin'];

/**
 * Hook izin akses halaman Jadwal Pelajaran & Jadwal Piket.
 * - Kurikulum & Kepala Sekolah: akses penuh (edit jadwal, generate, guru piket, cetak).
 * - Kepala Sekolah: wewenang mengesahkan dokumen jadwal yang sudah dicetak & ditandatangani.
 * - Pengguna lainnya (guru, siswa, TU, guru piket, dll.): hanya dapat melihat jadwal pembelajaran & jadwal piket,
 *   serta mendownload jadwal hanya jika sudah disahkan oleh Kepala Sekolah.
 */
export const useSchedulePermissions = () => {
    const { user, activeRole } = useAuthStore();
    const roleLower = (activeRole || '').toLowerCase().trim();

    const hasRole = (allowed: string[]) =>
        allowed.includes(roleLower) ||
        (!activeRole &&
            (user?.roles?.some((r) => allowed.includes((r.name || '').toLowerCase().trim())) ??
                false));

    const canEditSchedule = hasRole(SCHEDULE_MANAGER_ROLES);
    const isKepalaSekolah = hasRole(KEPALA_SEKOLAH_ROLES);

    return {
        canEditSchedule,
        isKepalaSekolah,
        roleName: activeRole || user?.roles?.[0]?.name || 'Pengguna',
    };
};

export default useSchedulePermissions;
