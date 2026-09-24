export interface TeacherSubjectResponseModel {
    id_teacher_subject: string;
    id_category_subject: string;
    id_subject: string;
    id_teacher: string;
    jp_amount: number;
    status: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateTeacherSubjectRequest {
    id_category_subject: string;
    id_subject: string;
    id_teacher: string;
    jp_amount?: number;
    status?: boolean;
}

export interface UpdateTeacherSubjectRequest {
    id_category_subject?: string;
    id_subject?: string;
    id_teacher?: string;
    jp_amount?: number;
    status?: boolean;
}
