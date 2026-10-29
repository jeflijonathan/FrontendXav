/**
 * updateCategorySubjectForm — Business Logic
 *
 * Yup validation schema and data formatters for updating a Category Subject.
 *
 * Layer: Business Logic
 */
import * as yup from "yup";
import type {
    CategorySubjectResponseModel,
    UpdateCategorySubjectRequestModel,
} from "@api/categorysubject/model";

export const UpdateCategorySubjectSchema = yup.object().shape({
    name: yup
        .string()
        .required("Nama kategori mata pelajaran wajib diisi")
        .min(2, "Nama kategori minimal 2 karakter")
        .max(255, "Nama kategori maksimal 255 karakter"),
    status: yup.boolean().required(),
});

export const formatCategorySubjectForUpdate = (
    data: CategorySubjectResponseModel | null
): UpdateCategorySubjectRequestModel => {
    return {
        name: data?.name || "",
        status: data?.status ?? true,
    };
};

