export interface MajorResponseModel {
    id_major: string;
    id?: string;
    name: string;
    status: boolean;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
}

export interface CreateMajorRequestModel {
    name: string;
    status?: boolean;
}

export interface UpdateMajorRequestModel {
    name?: string;
    status?: boolean;
}

// Backward-compatibility aliases
export type CreateMajorRequest = CreateMajorRequestModel;
export type UpdateMajorRequest = UpdateMajorRequestModel;
