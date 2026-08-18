export interface StudentResponseModel {
    id: string;
    user_id: string;
    nis: string;
    nisn: string;
    first_name: string;
    last_name: string;
    gender: string;
    created_at: string;
    updated_at: string;
}

export interface CreateStudentRequestModel {
    user: any;
    profile: any;
}

export interface UpdateStudentRequestModel {
    user?: any;
    profile?: any;
}
