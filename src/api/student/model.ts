export interface RoleStudentModel {
    id: string;
    name: string;
}

export interface ParentResponseModel {
    id: string;
    name: string;
    nik?: string | null;
    email?: string | null;
    phone_number?: string | null;
    occupation?: string | null;
    income?: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface StudentResponseModel {
    id: string;
    user_id: string;
    nis: string;
    nisn: string;
    email?: string | null;
    first_name: string;
    last_name: string;
    gender: "L" | "P";
    birth_place?: string | null;
    birth_date?: string | null;
    address?: string | null;
    rt?: string | null;
    rw?: string | null;
    zip_code?: string | null;
    phone_number?: string | null;
    profile_url?: string | null;
    status: boolean;
    user?: {
        id: string;
        username: string;
        full_name?: string;
        roles?: RoleStudentModel[];
    };
    roles?: RoleStudentModel[];
    role_ids?: string[];
    parents?: ParentResponseModel[];
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
}

export interface CreateStudentRequestModel {
    nis: string;
    nisn: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone_number?: string;
    gender: "L" | "P";
    birth_place?: string;
    birth_date?: string;
    address?: string;
    rt?: string;
    rw?: string;
    zip_code?: string;
    status?: boolean;
    role_ids?: string[];
    profile_url?: string;

    // Data Orang Tua (Ayah / Wali)
    parent_name?: string;
    parent_nik?: string;
    parent_phone_number?: string;
    parent_email?: string;
    parent_occupation?: string;
    parent_income?: string;

    // Data Ibu (Opsional)
    mother_name?: string;
    mother_nik?: string;
    mother_phone_number?: string;
    mother_email?: string;
    mother_occupation?: string;
    mother_income?: string;
}

export interface UpdateStudentRequestModel {
    nis?: string;
    nisn?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    password?: string;
    phone_number?: string | null;
    gender?: "L" | "P";
    birth_place?: string | null;
    birth_date?: string | null;
    address?: string;
    rt?: string;
    rw?: string;
    zip_code?: string;
    status?: boolean;
    role_ids?: string[];
    profile_url?: string;

    // Data Orang Tua
    parent_name?: string;
    parent_nik?: string;
    parent_phone_number?: string;
    parent_email?: string;
    parent_occupation?: string;
    parent_income?: string;

    mother_name?: string;
    mother_nik?: string;
    mother_phone_number?: string;
    mother_email?: string;
    mother_occupation?: string;
    mother_income?: string;
}
