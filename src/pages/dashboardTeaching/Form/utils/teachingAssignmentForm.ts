import type { TeachingRowSeed } from "../../store";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export interface TeachingAssignmentFormValues {
    id_teacher: string;
    id_subject: string;
    id_subjects?: string[];
    id_class: string;
    id_school_information: string;
    jp_amount: number;
    jp_amounts?: Record<string, number>;
    status: boolean;
}

export const TeachingAssignmentDefaultValues: TeachingAssignmentFormValues = {
    id_teacher: "",
    id_subject: "",
    id_subjects: [],
    id_class: "",
    id_school_information: "",
    jp_amount: 0,
    jp_amounts: {},
    status: true,
};

export const TeachingAssignmentValidations = zodResolver(
    z
        .object({
            id_teacher: z.string().min(1, { message: "Guru wajib dipilih" }),
            id_subject: z.string().optional(),
            id_subjects: z.array(z.string()).max(4, { message: "Maksimal 4 mata pelajaran" }).optional(),
            id_class: z.string().optional(),
            id_school_information: z.string().min(1, { message: "Periode wajib dipilih" }),
            jp_amount: z
                .number({ message: "JP harus berupa angka" })
                .min(0, { message: "JP tidak boleh negatif" }),
            status: z.boolean(),
        })
        .refine(
            (data) => {
                const hasSingle = Boolean(data.id_subject && data.id_subject.trim().length > 0);
                const hasMulti = Boolean(data.id_subjects && data.id_subjects.length > 0);
                return hasSingle || hasMulti;
            },
            {
                message: "Mata pelajaran wajib dipilih (maksimal 4)",
                path: ["id_subject"],
            }
        )
);

export const buildTeachingAssignmentDefaults = (
    overrides?: Partial<TeachingAssignmentFormValues>
): TeachingAssignmentFormValues => ({
    ...TeachingAssignmentDefaultValues,
    ...overrides,
});

export const teachingAssignmentFromSeed = (
    seed: TeachingRowSeed
): TeachingAssignmentFormValues => ({
    id_teacher: seed.teacher.id_teacher,
    id_subject: seed.subject.id_subject,
    id_subjects: [seed.subject.id_subject],
    id_class: seed.placement.id_class || "",
    id_school_information: seed.placement.id_school_information || "",
    jp_amount: seed.subject.jp_amount ?? 0,
    status: seed.placement.status ?? true,
});
