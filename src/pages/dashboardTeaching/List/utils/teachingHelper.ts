import type {
    TeachingClassRowModel,
    TeachingPeriodModel,
    TeachingSubjectRowModel,
    TeachingTeacherRowModel,
} from "@api/teaching/model";
import {
    calculateTeacherTotalJp,
    formatClassLabel,
    formatJpLabel,
    formatTeacherFullName,
    isMaxSubjectReached,
} from "../../utils/teachingBusinessLogic";

export {
    calculateTeacherTotalJp,
    formatClassLabel,
    formatJpLabel,
    formatTeacherFullName,
    isMaxSubjectReached,
};

export const teacherFullName = (teacher: TeachingTeacherRowModel): string =>
    formatTeacherFullName(teacher);

export const subjectLabel = (subject: TeachingSubjectRowModel): string =>
    subject.subject_name || "-";

export const subjectCodeLabel = (subject: TeachingSubjectRowModel): string =>
    subject.code_subject ? `Kode: ${subject.code_subject}` : "";

export const classLabel = (placement: TeachingClassRowModel): string =>
    formatClassLabel(placement);

export const periodLabel = (placement: TeachingClassRowModel): string =>
    placement.periode || "-";

export const periodOptionLabel = (period: TeachingPeriodModel): string =>
    `${period.periode}${period.status ? " (Aktif)" : ""}`;

/** Label periode yang dipakai untuk preset saat tambah kelas dari tabel. */
export const resolveFilterPeriodId = (
    periode: string,
    schoolInformations: Array<{ id_school_information: string; periode: string | null }>
): string => {
    if (!periode) return "";
    return (
        schoolInformations.find((item) => item.periode === periode)?.id_school_information || ""
    );
};
