import type { CreateClassRequestModel } from "@api/class/model";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export const CreateClassDefaultValues: CreateClassRequestModel = {
    id_major: "",
    id_class_guardian: null,
    id_school_information: null,
    kelas: "10",
    name: "",
    status: true,
};

export const CreateClassValidations = zodResolver(
    z.object({
        id_major: z.string().min(1, { message: "Jurusan wajib dipilih" }),
        id_class_guardian: z.string().nullable().optional(),
        id_school_information: z.string().nullable().optional(),
        kelas: z.string().min(1, { message: "Tingkat kelas wajib dipilih (10, 11, atau 12)" }),
        name: z.string().optional().default(""),
        status: z.boolean().default(true),
    })
);

export const CreateClassDetailsFormatter = (
    data?: Partial<CreateClassRequestModel>,
    defaultSchoolInfoId?: string
): CreateClassRequestModel => ({
    id_major: data?.id_major || "",
    id_class_guardian: data?.id_class_guardian || null,
    id_school_information: data?.id_school_information || defaultSchoolInfoId || null,
    kelas: data?.kelas || "10",
    name: data?.name || "",
    status: data?.status ?? true,
});
