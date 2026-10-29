import type { StudentInClassModel } from "@api/class/model";

/**
 * Business Logic: Memformat nama lengkap siswa (first_name + last_name)
 */
export const formatStudentFullName = (
    student?: { first_name?: string | null; last_name?: string | null } | null
): string => {
    if (!student) return "-";
    const first = student.first_name || "";
    const last = student.last_name || "";
    return `${first} ${last}`.trim() || "-";
};

/**
 * Business Logic: Menghasilkan konfigurasi chip jenis kelamin
 */
export const getGenderChipConfig = (
    gender?: string | null
): { label: string; color: "default" | "info" | "secondary" } => {
    if (!gender) return { label: "-", color: "default" };
    const upper = gender.toUpperCase();
    if (upper === "L" || upper === "LAKI-LAKI" || upper === "MALE") {
        return { label: "Laki-laki", color: "info" };
    }
    if (upper === "P" || upper === "PEREMPUAN" || upper === "FEMALE") {
        return { label: "Perempuan", color: "secondary" };
    }
    return { label: gender, color: "default" };
};

/**
 * Business Logic: Membentuk URL foto profil siswa
 */
export const getStudentPhotoUrl = (backendUrl: string, profileUrl?: string | null): string | null => {
    if (!profileUrl) return null;
    return `${backendUrl}/api/upload/${profileUrl}`;
};

/**
 * Business Logic: Filter daftar siswa terdaftar berdasarkan kata kunci (Nama, NIS, NISN)
 */
export const filterEnrolledStudents = (
    students: StudentInClassModel[],
    query: string
): StudentInClassModel[] => {
    if (!query.trim()) return students;
    const q = query.toLowerCase();
    return students.filter(
        (s) =>
            s.first_name.toLowerCase().includes(q) ||
            (s.last_name && s.last_name.toLowerCase().includes(q)) ||
            (s.nis && s.nis.toLowerCase().includes(q)) ||
            (s.nisn && s.nisn.toLowerCase().includes(q))
    );
};

/**
 * Business Logic: Filter daftar siswa yang tersedia untuk ditambahkan berdasarkan kata kunci (Nama, NIS, NISN, Kelas)
 */
export const filterAvailableStudents = (
    students: StudentInClassModel[],
    query: string
): StudentInClassModel[] => {
    if (!query.trim()) return students;
    const q = query.toLowerCase();
    return students.filter(
        (s) =>
            s.first_name.toLowerCase().includes(q) ||
            (s.last_name && s.last_name.toLowerCase().includes(q)) ||
            (s.nis && s.nis.toLowerCase().includes(q)) ||
            (s.nisn && s.nisn.toLowerCase().includes(q)) ||
            (s.current_class?.name && s.current_class.name.toLowerCase().includes(q))
    );
};

/**
 * Business Logic: Mendeteksi konflik siswa yang sudah terdaftar di kelas lain pada periode yang sama
 */
export const detectTransferConflicts = (
    selectedIds: string[],
    availableStudents: StudentInClassModel[]
): StudentInClassModel[] => {
    return availableStudents.filter(
        (s) => selectedIds.includes(s.id) && Boolean(s.current_class)
    );
};

/**
 * Business Logic: Toggle seleksi satu siswa
 */
export const toggleStudentSelection = (currentSelected: string[], id: string): string[] => {
    return currentSelected.includes(id)
        ? currentSelected.filter((item) => item !== id)
        : [...currentSelected, id];
};

/**
 * Business Logic: Toggle pilih semua siswa yang sedang tampil
 */
export const toggleSelectAllStudents = (
    currentSelected: string[],
    visibleIds: string[]
): string[] => {
    const isAllSelected = visibleIds.length > 0 && visibleIds.every((id) => currentSelected.includes(id));
    if (isAllSelected) {
        return currentSelected.filter((id) => !visibleIds.includes(id));
    }
    return Array.from(new Set([...currentSelected, ...visibleIds]));
};
