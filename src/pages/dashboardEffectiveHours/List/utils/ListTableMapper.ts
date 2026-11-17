import type { EffectiveWeekResponseModel } from "@api/effectiveweek/model";
import {
  computeAllocationItem,
  type ComputedAllocationItem,
  type RawAllocationItem,
} from "../../utils/allocationBusinessLogic";

/**
 * Normalisasi kelas menjadi "X", "XI", atau "XII"
 */
export function normalizeKelas(rawKelas?: string | null, rombel?: string | null): string {
  const str = `${rawKelas || ""} ${rombel || ""}`.toUpperCase().trim();
  if (str.includes("XII") || str.includes("12")) return "XII";
  if (str.includes("XI") || str.includes("11")) return "XI";
  if (str.includes("X") || str.includes("10")) return "X";
  return rawKelas ? String(rawKelas).toUpperCase().trim() : "X";
}

export function listAllocationTableMapper(
  rawList: EffectiveWeekResponseModel[],
  effectiveWeeks: number,
  subjectsList?: Array<{ id: string; name: string; code: string; fase: string; majorName?: string }>
): ComputedAllocationItem[] {
  return rawList.map((item) => {
    // Normalisasi kategori: hanya UMUM atau KEJURUAN
    const rawCat = (
      item.subject?.category?.name ||
      item.category_name ||
      ""
    ).trim().toUpperCase();

    let cat = "UMUM";
    if (rawCat.includes("KEJURUAN") || rawCat.includes("PRODUKTIF") || rawCat.includes("JURUSAN")) {
      cat = "KEJURUAN";
    } else {
      cat = "UMUM";
    }

    const matchedSubject = subjectsList?.find(
      (s) => s.id === item.id_subject || (s as any).id_subject === item.id_subject
    );

    const majorName =
      (item as any).major_name ||
      (item.subject as any)?.major?.name ||
      matchedSubject?.majorName ||
      "General (All Majors)";

    const idMajor =
      (item as any).id_major ||
      (item.subject as any)?.major?.id ||
      (item.subject as any)?.major?.id_major ||
      "";

    const idMajors = Array.isArray((item as any).id_majors)
      ? (item as any).id_majors
      : idMajor
      ? [idMajor]
      : [];

    const majorNames = Array.isArray((item as any).major_names)
      ? (item as any).major_names
      : majorName && !majorName.toLowerCase().includes("general")
      ? [majorName]
      : [];

    const normalizedKelas = normalizeKelas(item.kelas || item.subject?.kelas, item.rombel);

    const raw: RawAllocationItem = {
      id: item.id_effective_week || item.id,
      id_subject: item.id_subject,
      id_class: item.id_class,
      id_major: idMajor,
      id_majors: idMajors,
      major_name: majorName,
      major_names: majorNames,
      subject_name: item.subject_name || item.subject?.name || "Mata Pelajaran",
      code_subject: item.code_subject || item.subject?.code_subject || "-",
      rombel: `Kelas ${normalizedKelas}`,
      kelas: normalizedKelas,
      fase: (item.fase || item.subject?.fase || (normalizedKelas === "X" ? "E" : "F")) as "E" | "F",
      category_name: cat,
      jp_intra_year: Number(item.Alokasi_Intrakurikuler || 0),
      jp_koku_year: Number(item.Alokasi_Kokurikuler || 0),
      created_at: item.created_at || (item as any).CreatedAt || "",
      updated_at: item.updated_at || (item as any).UpdatedAt || "",
    };

    return computeAllocationItem(raw, effectiveWeeks);
  });
}

export default listAllocationTableMapper;
