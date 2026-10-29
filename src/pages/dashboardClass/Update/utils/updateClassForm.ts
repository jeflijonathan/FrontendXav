import type { UpdateClassRequestModel, ClassResponseModel } from "@api/class/model";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export const UpdateClassValidations = zodResolver(
    z.object({
        id_major: z.string().min(1, { message: "Jurusan wajib dipilih" }),
        id_class_guardian: z.string().nullable().optional(),
        id_school_information: z.string().nullable().optional(),
        kelas: z.string().min(1, { message: "Tingkat kelas wajib dipilih" }),
        name: z.string().optional().default(""),
        status: z.boolean().default(true),
    })
);

export const UpdateClassDetailsFormatter = (
    data?: Partial<ClassResponseModel> | null
): UpdateClassRequestModel => ({
    id_major: data?.id_major || "",
    id_class_guardian: data?.id_class_guardian || null,
    id_school_information: data?.id_school_information || null,
    kelas: data?.kelas || "10",
    name: data?.name || "",
    status: data?.status ?? true,
});
