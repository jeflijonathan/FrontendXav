import type { RoleModel } from "@api/role/model";


export interface EmployeeResponseModel {
    id: string;
    user_id: string;
    niy: string;
    first_name: string;
    last_name: string;
    email: string;
    profile_url?: string | null;
    status: boolean;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
    user?: {
        id: string;
        username: string;
        full_name: string;
        roles?: RoleModel[];
        [key: string]: any;
    };
    detail?: {
        gender?: "L" | "P";
        phone_number?: string | null;
        address?: string | null;
        birth_date?: string | null;
        birth_place?: string | null;
        RT?: string | null;
        RW?: string | null;
        zip_code?: string | null;
        description?: string | null;
    };
}

export interface CreateEmployeeRequestModel {
    user: {
        full_name: string;
        username: string;
        password: string;
    };
    profile: {
        first_name: string;
        last_name: string;
        niy: string;
        email: string;
        profile_url?: string;
        status?: boolean;
    };
    detail: {
        gender: "L" | "P";
        birth_place?: string;
        birth_date?: string;
        address?: string;
        RT?: string;
        RW?: string;
        zip_code?: string;
        phone_number?: string;
        description?: string;
    };
    role_ids?: string[];
}

export interface UpdateEmployeeRequestModel {
    niy?: string;
    username?: string;
    email?: string;
    password?: string;
    first_name?: string;
    last_name?: string;
    profile_url?: string | null;
    status?: boolean;
    detail?: {
        gender?: "L" | "P";
        birth_place?: string | null;
        birth_date?: string | null;
        address?: string | null;
        RT?: string | null;
        RW?: string | null;
        zip_code?: string | null;
        phone_number?: string | null;
        description?: string | null;
    };
    role_ids?: string[];
}
