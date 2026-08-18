export interface SubjectResponseModel {
    id: string;
    name: string;
    category_subject_id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface CreateSubjectRequestModel {
    name: string;
    category_subject_id?: string;
}

export interface UpdateSubjectRequestModel {
    name?: string;
    category_subject_id?: string;
}
