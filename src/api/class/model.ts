export interface StudentInClassModel {
    id: string;
    nis: string;
    nisn: string;
    first_name: string;
    last_name?: string | null;
    gender?: "L" | "P" | string | null;
    email?: string | null;
    phone_number?: string | null;
    profile_url?: string | null;
    status?: boolean;
    current_class?: {
        id_class: string;
        name: string;
        kelas?: string;
        periode?: string | null;
    } | null;
}

export interface AddStudentsToClassRequest {
    student_ids: string[];
    force_transfer?: boolean;
}

export interface ClassGuardianSimpleModel {
    id: string;
    first_name: string;
    last_name?: string | null;
    niy?: string | null;
}

export interface ClassResponseModel {
    id_class: string;
    id?: string;
    id_major: string;
    id_class_guardian: string | null;
    id_school_information?: string | null;
    kelas?: string | null;
    name: string;
    status: boolean;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
    major?: { id_major: string; name: string };
    class_guardian?: ClassGuardianSimpleModel | null;
    school_information?: { id_school_information: string; name_school: string; periode?: string };
    students?: StudentInClassModel[];
    total_students?: number;
}

export interface CreateClassRequestModel {
    id_major: string;
    id_class_guardian?: string | null;
    id_school_information?: string | null;
    kelas: string;
    name: string;
    status?: boolean;
}

export interface UpdateClassRequestModel {
    id_major?: string;
    id_class_guardian?: string | null;
    id_school_information?: string | null;
    kelas?: string;
    name?: string;
    status?: boolean;
}

// Backward-compatibility aliases
export type CreateClassRequest = CreateClassRequestModel;
export type UpdateClassRequest = UpdateClassRequestModel;
