export type UserLoginModel = {
    email: string;
    password: string;
}

export type UserLoginResponseModel = {
    id: string;
    name: string;
    email: string;
    role: string;
    access_token: string;
    refresh_token: string;
}

export type UserResponseModel = {
    id: string;
    full_name: string;
    username: string;
    email: string;
    phone_number?: string;
    description?: string;
    status: boolean;
    created_at: string;
    updated_at: string;
    student_profile?: any;
    employee_profile?: any;
}

export type CreateUserRequest = {
    full_name: string;
    username: string;
    email: string;
    password?: string;
    phone_number?: string;
    description?: string;
    status?: boolean;
}

export type UpdateUserRequest = Partial<CreateUserRequest>;
