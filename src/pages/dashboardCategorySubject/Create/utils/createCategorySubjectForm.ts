/**
 * createCategorySubjectForm — Business Logic
 *
 * Yup validation schema and form defaults for creating a Category Subject.
 *
 * Layer: Business Logic
 */
import * as yup from "yup";
import type { CreateCategorySubjectRequestModel } from "@api/categorysubject/model";

export const CreateCategorySubjectSchema = yup.object().shape({
    name: yup
        .string()
        .required("Nama kategori mata pelajaran wajib diisi")
        .min(2, "Nama kategori minimal 2 karakter")
        .max(255, "Nama kategori maksimal 255 karakter"),
    status: yup.boolean().required(),
});

export const defaultCreateCategorySubjectValues: CreateCategorySubjectRequestModel = {
    name: "",
    status: true,
};

