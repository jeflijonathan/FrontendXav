export interface SubjectCategorySimpleModel {
    id: string;
    id_category_subject?: string;
    name: string;
}

export interface SubjectResponseModel {
    id: string;
    id_subject?: string;
    name: string;
    id_category_subject: string;
    category_subject_id?: string;
    id_major?: string | null;
    code_subject?: string | null;
    status: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    category?: SubjectCategorySimpleModel | null;
}

export interface CreateSubjectRequestModel {
    name: string;
    id_category_subject: string;
    category_subject_id?: string;
    id_major?: string | null;
    code_subject?: string | null;
    status?: boolean;
}

export interface UpdateSubjectRequestModel {
    name?: string;
    id_category_subject?: string;
    category_subject_id?: string;
    id_major?: string | null;
    code_subject?: string | null;
    status?: boolean;
}

// Backward-compatibility aliases
export type CreateSubjectRequest = CreateSubjectRequestModel;
export type UpdateSubjectRequest = UpdateSubjectRequestModel;
