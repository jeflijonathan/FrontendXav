/**
 * updateSubjectForm — Business Logic
 *
 * Yup validation schema and data formatters for updating a Subject.
 *
 * Layer: Business Logic
 */
import * as yup from "yup";
import type {
    SubjectResponseModel,
    UpdateSubjectRequestModel,
} from "@api/subject/model";
import { calculateFase } from "../../List/utils/subjectHelper";

export const UpdateSubjectSchema = yup.object().shape({
    name: yup
        .string()
        .required("Subject name is required")
        .min(2, "Subject name must be at least 2 characters")
        .max(255, "Subject name must be at most 255 characters"),
    id_category_subject: yup
        .string()
        .required("Category is required"),
    kelas: yup
        .string()
        .required("Grade is required"),
    fase: yup.string().optional(),
    id_major: yup
        .string()
        .required("Major is required"),
    code_subject: yup.string().optional().nullable(),
    status: yup.boolean().required(),
});

export const formatSubjectForUpdate = (
    data: SubjectResponseModel | null
): UpdateSubjectRequestModel => {
    const rawKelas = data?.kelas || "10";
    return {
        name: data?.name || "",
        id_category_subject:
            data?.id_category_subject || data?.category_subject_id || "",
        category_subject_id:
            data?.category_subject_id || data?.id_category_subject || "",
        id_major: data?.id_major || null,
        kelas: rawKelas,
        fase: data?.fase || calculateFase(rawKelas),
        code_subject: data?.code_subject || "",
        status: data?.status ?? true,
    };
};
