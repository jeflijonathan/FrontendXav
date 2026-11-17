/**
 * Model tabel pengajar.
 *
 * Satu guru boleh mengampu maksimal 4 mata pelajaran (`MAX_SUBJECTS`), dan tiap
 * mata pelajaran boleh dipakai di banyak kelas + periode (`classes`).
 */

export const MAX_SUBJECTS_PER_TEACHER = 4;

export interface TeachingClassRowModel {
    id_class_room: string | null;
    id_class: string | null;
    class_name: string | null;
    kelas: string | null;
    id_school_information: string | null;
    periode: string | null;
    status: boolean;
}

export interface TeachingSubjectRowModel {
    id_teacher_subject: string;
    id_subject: string;
    subject_name: string | null;
    code_subject: string | null;
    jp_amount: number;
    total_classes: number;
    classes: TeachingClassRowModel[];
}

export interface TeachingTeacherRowModel {
    id_teacher: string;
    niy: string | null;
    first_name: string;
    last_name: string | null;
    total_subjects: number;
    total_classes: number;
    total_jp?: number;
    subjects: TeachingSubjectRowModel[];
}

export interface TeachingPeriodModel {
    periode: string;
    id_school_information: string | null;
    status: boolean;
}

export interface CreateTeachingAssignmentRequest {
    id_teacher: string;
    id_subject: string;
    id_class: string;
    id_school_information: string;
    jp_amount: number;
    status: boolean;
}

export interface UpdateTeachingAssignmentRequest {
    id_teacher?: string;
    id_subject?: string;
    id_class?: string;
    id_school_information?: string;
    jp_amount?: number;
    status?: boolean;
}

/** Nilai awal form edit, dirakit dari baris guru + mapel + kelas. */
export interface TeachingAssignmentSeed {
    id_teacher: string;
    id_subject: string;
    id_class: string;
    id_school_information: string;
    jp_amount: number;
    status: boolean;
}
