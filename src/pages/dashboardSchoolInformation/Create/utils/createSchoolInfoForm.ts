import type { CreateSchoolInformationRequest, SchoolInformationResponseModel } from "@api/schoolinformation/model";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export const CreateSchoolInformationReqDefaultValues: CreateSchoolInformationRequest = {
    name_school: "",
    periode: "",
    NPSN: "",
    id_headmaster: "",
    alamat: "",
    status: true,
    work_days: 5,
    lesson_duration: 45,
};

export const CreateSchoolInfoValidations = zodResolver(
    z.object({
        name_school: z.string().min(1, { message: "Nama sekolah wajib diisi" }),
        periode: z.string().min(1, { message: "Tahun ajaran wajib diisi" }).refine((val) => {
            const [start, end] = val.split("/");
            if (!start || !end) return false;
            return parseInt(end) > parseInt(start);
        }, { message: "Tahun selesai harus lebih besar dari tahun mulai" }),
        NPSN: z.string().min(1, { message: "NPSN wajib diisi" }),
        id_headmaster: z.string().min(1, { message: "Kepala sekolah wajib dipilih" }),
        alamat: z.string().min(1, { message: "Alamat wajib diisi" }),
        status: z.preprocess((val) => {
            if (typeof val === "string") {
                return val === "true";
            }
            return Boolean(val);
        }, z.boolean({ message: "Status wajib diisi" })),
        work_days: z.preprocess((val) => {
            if (typeof val === "string") return parseInt(val, 10);
            if (typeof val === "number" && !isNaN(val)) return val;
            return 5;
        }, z.number().int().refine((v) => v === 5 || v === 6, { message: "Hari kerja harus 5 atau 6 hari" }).default(5)),
        lesson_duration: z.preprocess((val) => {
            if (typeof val === "string") return parseInt(val, 10);
            if (typeof val === "number" && !isNaN(val)) return val;
            return 45;
        }, z.number().int().refine((v) => v === 35 || v === 45, { message: "Durasi jam pelajaran harus 35 atau 45 menit" }).default(45)),
    })
);

export const CreateSchoolInfoDetailsFormatter = (
    data: CreateSchoolInformationRequest
): CreateSchoolInformationRequest => {
    return {
        name_school: data?.name_school || "",
        periode: data?.periode || "",
        NPSN: data?.NPSN || "",
        id_headmaster: data?.id_headmaster || "",
        alamat: data?.alamat || "",
        status: data?.status ?? true,
        work_days: data?.work_days ?? 5,
        lesson_duration: data?.lesson_duration ?? 45,
    };
};