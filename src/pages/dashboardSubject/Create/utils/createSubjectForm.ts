/**
 * createSubjectForm — Business Logic
 *
 * Yup validation schema and form defaults for creating a Subject.
 *
 * Layer: Business Logic
 */
import * as yup from "yup";
import type { CreateSubjectRequestModel } from "@api/subject/model";

export const CreateSubjectSchema = yup.object().shape({
    name: yup
        .string()
        .required("Nama mata pelajaran wajib diisi")
        .min(2, "Nama mata pelajaran minimal 2 karakter")
        .max(255, "Nama mata pelajaran maksimal 255 karakter"),
    id_category_subject: yup
        .string()
        .required("Category wajib dipilih"),
    kelas: yup
        .string()
        .required("Tingkat kelas wajib dipilih"),
    fase: yup.string().optional(),
    id_major: yup.string().optional().nullable(),
    code_subject: yup.string().optional().nullable(),
    status: yup.boolean().required(),
});

export const defaultCreateSubjectValues: CreateSubjectRequestModel = {
    name: "",
    id_category_subject: "",
    id_major: "",
    kelas: "10",
    fase: "E",
    code_subject: "",
    status: true,
};
