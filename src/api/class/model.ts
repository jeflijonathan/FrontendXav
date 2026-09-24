export interface ClassResponseModel {
    id_class: string;
    id_major: string;
    id_class_guardian: string | null;
    name: string;
    status: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateClassRequest {
    id_major: string;
    id_class_guardian?: string | null;
    name: string;
    status?: boolean;
}

export interface UpdateClassRequest {
    id_major?: string;
    id_class_guardian?: string | null;
    name?: string;
    status?: boolean;
}
