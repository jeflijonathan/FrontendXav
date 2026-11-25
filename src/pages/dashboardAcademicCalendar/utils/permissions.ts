import useAuthStore from "@common/store/useAuthStore";

/**
 * Hook izin akses kalender akademik.
 * Membatasi akses edit hanya untuk role "kurikulum".
 * Role lainnya (guru, siswa, tata_usaha, kepala_sekolah, dll.) hanya memiliki akses lihat (read-only).
 */
export const useCalendarPermissions = () => {
  const { user, activeRole } = useAuthStore();
  const roleLower = (activeRole || "").toLowerCase().trim();

  const isKurikulum =
    roleLower === "kurikulum" ||
    (!activeRole && (user?.roles?.some((r) => r.name.toLowerCase().trim() === "kurikulum") ?? false));

  return {
    isKurikulum,
    canEdit: isKurikulum,
    roleName: activeRole || user?.roles?.[0]?.name || "Pengguna",
  };
};
