export interface CategorySubjectResponseModel {
    id: string;
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
