export interface MajorResponseModel {
    id_major: string;
    name: string;
    status: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateMajorRequest {
    name: string;
    status?: boolean;
}

export interface UpdateMajorRequest {
    name?: string;
    status?: boolean;
}
