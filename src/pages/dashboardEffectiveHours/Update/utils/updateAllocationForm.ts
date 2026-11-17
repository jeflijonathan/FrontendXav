import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { EffectiveWeekResponseModel } from "@api/effectiveweek/model";

export interface UpdateAllocationFormData {
  id_subject: string;
  kelas: string;
  id_major?: string;
  id_majors: string[];
  Alokasi_Intrakurikuler: number;
  Alokasi_Kokurikuler: number;
}

export const UpdateAllocationValidationSchema = zodResolver(
  z.object({
    id_subject: z.string().min(1, { message: "Mata pelajaran wajib dipilih" }),
    kelas: z.string().min(1, { message: "Kelas wajib dipilih" }),
    id_majors: z
      .array(z.string().min(1))
      .min(1, { message: "Minimal 1 jurusan harus dipilih" }),
    Alokasi_Intrakurikuler: z
      .number({ message: "Alokasi Intrakurikuler harus berupa angka" })
      .min(0, { message: "Minimal 0 JP" }),
    Alokasi_Kokurikuler: z
      .number({ message: "Alokasi Kokurikuler harus berupa angka" })
      .min(0, { message: "Minimal 0 JP" }),
  })
);

/**
 * Parse kelas from rombel string or kelas field.
 * e.g. "Kelas X-A" → "X", "Kelas XI" → "XI", "X" → "X"
 */
const parseKelasFromRombel = (rombel?: string | null, kelas?: string | null): string => {
  if (kelas) {
    const upper = kelas.toUpperCase().trim();
    if (upper === "X" || upper === "10") return "X";
    if (upper === "XI" || upper === "11") return "XI";
    if (upper === "XII" || upper === "12") return "XII";
    return upper;
  }
  if (rombel) {
    const upper = rombel.toUpperCase().trim();
    if (upper.includes("XII")) return "XII";
    if (upper.includes("XI")) return "XI";
    if (upper.includes("X")) return "X";
  }
  return "X";
};

export const updateAllocationDetailsFormatter = (
  data: EffectiveWeekResponseModel | null
): UpdateAllocationFormData => {
  const initialMajors =
    data?.id_majors && data.id_majors.length > 0
      ? data.id_majors
      : data?.id_major
      ? [data.id_major]
      : [];
  return {
    id_subject: data?.id_subject || "",
    kelas: parseKelasFromRombel(data?.rombel, data?.kelas),
    id_major: data?.id_major || "",
    id_majors: initialMajors,
    Alokasi_Intrakurikuler: Number(data?.Alokasi_Intrakurikuler || 0),
    Alokasi_Kokurikuler: Number(data?.Alokasi_Kokurikuler || 0),
  };
};
