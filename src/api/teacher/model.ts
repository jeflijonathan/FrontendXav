export interface TeacherResponseModel {
    id: string;
    user_id: string;
    niy: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string | null;
    gender: "L" | "P";
    birth_date?: string | null;
    address?: string | null;
    profile_url?: string | null;
    status: boolean;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
}

export interface CreateTeacherRequest {
    niy: string;
    first_name: string;
    last_name: string;
    email: string;
    password?: string;
    phone_number?: string;
    gender: "L" | "P";
    birth_date?: string;
    address?: string;
    status?: boolean;
}

export interface UpdateTeacherRequest {
    niy?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone_number?: string | null;
    gender?: "L" | "P";
    birth_date?: string | null;
    address?: string;
    status?: boolean;
}
