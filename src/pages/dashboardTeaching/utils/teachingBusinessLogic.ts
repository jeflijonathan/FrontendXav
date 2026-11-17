import type {
    TeachingClassRowModel,
    TeachingSubjectRowModel,
    TeachingTeacherRowModel,
} from "@api/teaching/model";

/**
 * Business Logic untuk Alokasi Beban Mengajar & Penugasan Guru (JTM).
 * Lapisan ini murni berisi aturan bisnis tanpa dependensi framework / React / UI library.
 */

export const MAX_SUBJECTS_PER_TEACHER = 4;

/**
 * Hitung total JP mengajar seorang guru dari seluruh mata pelajaran yang diampu.
 */
export const calculateTeacherTotalJp = (
    subjects: TeachingSubjectRowModel[] = []
): number => {
    const total = subjects.reduce((sum, subj) => sum + (Number(subj.jp_amount) || 0), 0);
    return Math.round(total * 10) / 10;
};

/**
 * Format angka JP ke format tampilan (e.g. 3 -> "3 JP", 1.5 -> "1,5 JP").
 */
export const formatJpLabel = (jp: number | undefined | null): string => {
    if (jp === undefined || jp === null || isNaN(jp)) return "0 JP";
    const formatted = jp.toString().replace(".", ",");
    return `${formatted} JP`;
};

/**
 * Format nama lengkap guru dengan fallback jika kosong.
 */
export const formatTeacherFullName = (
    teacher: Pick<TeachingTeacherRowModel, "first_name" | "last_name">
): string => {
    const full = `${teacher.first_name || ""} ${teacher.last_name || ""}`.trim();
    return full || "-";
};

/**
 * Format nama mata pelajaran beserta kodenya.
 */
export const formatSubjectDisplay = (
    subject: Pick<TeachingSubjectRowModel, "subject_name" | "code_subject">
): { name: string; code: string } => {
    return {
        name: subject.subject_name || "Mata Pelajaran",
        code: subject.code_subject ? `Kode: ${subject.code_subject}` : "",
    };
};

/**
 * Format label kelas (e.g. "Kelas 10 TKJT" atau nama spesifik).
 */
export const formatClassLabel = (
    placement: Pick<TeachingClassRowModel, "class_name" | "kelas">
): string => {
    return placement.class_name || (placement.kelas ? `Kelas ${placement.kelas}` : "-");
};

/**
 * Cek apakah guru sudah mencapai batas maksimum pengampuan mata pelajaran.
 */
export const isMaxSubjectReached = (
    currentCount: number,
    max: number = MAX_SUBJECTS_PER_TEACHER
): boolean => {
    return currentCount >= max;
};

/**
 * Ambil JP mingguan suatu mata pelajaran dari data alokasi minggu efektif (36 minggu pembagi standar).
 */
export const getSubjectJpFromEffectiveWeeks = (
    effectiveWeeks: Array<{
        id_subject: string;
        id_school_information?: string | null;
        Alokasi_Intrakurikuler?: number;
        Alokasi_Kokurikuler?: number;
    }> = [],
    subjectId: string,
    periodId?: string
): number => {
    if (!subjectId) return 0;
    const match =
        effectiveWeeks.find(
            (ew) =>
                ew.id_subject === subjectId &&
                (!periodId || ew.id_school_information === periodId)
        ) || effectiveWeeks.find((ew) => ew.id_subject === subjectId);

    if (!match) return 0;
    const totalYearly =
        (match.Alokasi_Intrakurikuler || 0) + (match.Alokasi_Kokurikuler || 0);
    if (!totalYearly) return 0;
    const weekly = totalYearly / 36;
    return Math.round(weekly * 10) / 10;
};

/**
 * Ambil semua record alokasi minggu efektif untuk suatu mata pelajaran (bisa lebih dari satu kelas).
 * Mengembalikan array record lengkap supaya caller bisa menampilkan kelas-kelas terdaftar.
 */
export const getSubjectAllocations = (
    effectiveWeeks: Array<{
        id_subject: string;
        id_school_information?: string | null;
        id_class?: string | null;
        Alokasi_Intrakurikuler?: number;
        Alokasi_Kokurikuler?: number;
        kelas?: string | null;
        subject_name?: string;
        rombel?: string;
    }> = [],
    subjectId: string,
    periodId?: string
): Array<{
    id_subject: string;
    id_school_information?: string | null;
    id_class?: string | null;
    Alokasi_Intrakurikuler?: number;
    Alokasi_Kokurikuler?: number;
    kelas?: string | null;
    subject_name?: string;
    rombel?: string;
}> => {
    if (!subjectId) return [];
    return effectiveWeeks.filter(
        (ew) =>
            ew.id_subject === subjectId &&
            (!periodId || ew.id_school_information === periodId)
    );
};

/**
 * Hitung total JP dari daftar mata pelajaran yang dipilih berdasarkan alokasi minggu efektif.
 */
export const calculateSelectedSubjectsTotalJp = (
    effectiveWeeks: Array<{
        id_subject: string;
        id_school_information?: string | null;
        Alokasi_Intrakurikuler?: number;
        Alokasi_Kokurikuler?: number;
    }> = [],
    subjectIds: string[] = [],
    periodId?: string,
    customJpMap?: Record<string, number>
): { details: Array<{ id_subject: string; jp: number }>; totalJp: number } => {
    let total = 0;
    const details = subjectIds.map((id) => {
        const jp =
            customJpMap && customJpMap[id] !== undefined
                ? customJpMap[id]
                : getSubjectJpFromEffectiveWeeks(effectiveWeeks, id, periodId);
        total += jp;
        return { id_subject: id, jp };
    });
    return {
        details,
        totalJp: Math.round(total * 10) / 10,
    };
};

