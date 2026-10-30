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

export const defaultCreateSubjectValues: CreateSubjectRequestModel = {
    name: "",
    id_category_subject: "",
    id_major: "",
    kelas: "10",
    fase: "E",
    code_subject: "",
    status: true,
};
