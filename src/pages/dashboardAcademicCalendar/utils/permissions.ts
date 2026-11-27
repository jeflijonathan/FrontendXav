import useAuthStore from "@common/store/useAuthStore";

const CALENDAR_MANAGER_ROLES = ["kurikulum", "kepala_sekolah", "admin", "superadmin"];

/**
 * Hook izin akses kalender akademik.
 * Membatasi akses edit hanya untuk role "kurikulum" dan "kepala_sekolah".
 * Role lainnya (guru, siswa, tata_usaha, wali_kelas, dll.) hanya memiliki akses lihat (read-only).
 */
export const useCalendarPermissions = () => {
  const { user, activeRole } = useAuthStore();
  const roleLower = (activeRole || "").toLowerCase().trim();

  const canEdit =
    CALENDAR_MANAGER_ROLES.includes(roleLower) ||
    (!activeRole &&
      (user?.roles?.some((r) =>
        CALENDAR_MANAGER_ROLES.includes((r.name || "").toLowerCase().trim())
      ) ??
        false));

  return {
    isKurikulum: canEdit,
    canEdit,
    roleName: activeRole || user?.roles?.[0]?.name || "Pengguna",
  };
};
