export interface CategorySubjectResponseModel {
    id: string;
    id_category_subject?: string;
    name: string;
    status: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface CreateCategorySubjectRequestModel {
    name: string;
    status: boolean;
}

export interface UpdateCategorySubjectRequestModel {
    name?: string;
    status?: boolean;
}

// Backward-compatibility aliases
export type CreateCategorySubjectRequest = CreateCategorySubjectRequestModel;
export type UpdateCategorySubjectRequest = UpdateCategorySubjectRequestModel;
