import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export interface CreateAllocationFormData {
  id_subject: string;
  kelas: string;
  id_majors: string[];
  Alokasi_Intrakurikuler: number;
  Alokasi_Kokurikuler: number;
}

export const CreateAllocationDefaultValues: CreateAllocationFormData = {
  id_subject: "",
  kelas: "X",
  id_majors: [],
  Alokasi_Intrakurikuler: 0,
  Alokasi_Kokurikuler: 0,
};

export const CreateAllocationValidationSchema = zodResolver(
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

