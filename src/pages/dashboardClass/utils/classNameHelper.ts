import type { ClassResponseModel } from "@api/class/model";

/**
 * Membuat singkatan dari nama jurusan.
 * Mengambil huruf depan setiap kata yang bermakna,
 * skip kata-kata umum seperti "dan", "atau", "untuk", "di", "ke", dll.
 *
 * Contoh:
 *   "Teknik Komputer Jaringan dan Telekomunikasi" → "TKJT"
 *   "Rekayasa Perangkat Lunak" → "RPL"
 *   "Akuntansi dan Keuangan Lembaga" → "AKL"
 */
const SKIP_WORDS = new Set([
    "dan", "atau", "untuk", "di", "ke", "dari", "yang",
    "dengan", "pada", "oleh", "serta", "dll", "dsb",
    "the", "and", "or", "of", "in", "to", "for",
]);

export const abbreviateMajor = (name: string): string => {
    if (!name) return "";
    return name
        .split(/\s+/)
        .filter((word) => word.length > 0 && !SKIP_WORDS.has(word.toLowerCase()))
        .map((word) => word.charAt(0).toUpperCase())
        .join("");
};

/**
 * Membuat nama kelas otomatis dari tingkat + singkatan jurusan.
 * Aturan penamaan:
 * - Jika kelas dengan tingkat & jurusan tsb belum ada: "10 TKJT" (tanpa suffix)
 * - Jika sudah ada: "10 TKJT (1)", "10 TKJT (2)", dst.
 *
 * Contoh:
 *   Pertama kali dibuat → "10 TKJT"
 *   Kedua kali dibuat  → "10 TKJT (1)"
 *   Ketiga kali dibuat → "10 TKJT (2)"
 */
export const generateClassName = (
    kelas: string,
    majorName: string,
    existingClasses?: ClassResponseModel[],
    majorId?: string,
    excludeClassId?: string,
): string => {
    const abbr = abbreviateMajor(majorName);
    if (!abbr) return kelas;

    const baseName = `${kelas} ${abbr}`;

    if (!existingClasses || !majorId) {
        return baseName;
    }

    // Filter kelas yang memiliki tingkat & jurusan yang sama dalam periode yang sama
    const sameGroup = existingClasses.filter(
        (c) => c.kelas === kelas && c.id_major === majorId && c.id_class !== excludeClassId
    );

    if (sameGroup.length === 0) {
        return baseName;
    }

    const existingNames = new Set(sameGroup.map((c) => c.name?.trim()));

    // Jika baseName belum ada (dan belum ada data lama dengan spasi 1 seperti "10 TKJT 1"), gunakan baseName
    if (!existingNames.has(baseName) && !existingNames.has(`${baseName} 1`)) {
        return baseName;
    }

    // Jika sudah ada, cari urutan berikutnya: "10 TKJT (1)", "10 TKJT (2)", dst.
    let index = 1;
    while (existingNames.has(`${baseName} (${index})`)) {
        index++;
    }

    return `${baseName} (${index})`;
};
