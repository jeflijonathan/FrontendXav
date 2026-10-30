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
        .required("Kategori mata pelajaran wajib dipilih"),
    status: yup.boolean().required(),
});

export const defaultCreateSubjectValues: CreateSubjectRequestModel = {
    name: "",
    id_category_subject: "",
    status: true,
};

