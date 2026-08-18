export interface EmployeeResponseModel {
    id: string;
    user_id: string;
    first_name: string;
    last_name: string;
    niy: string;
    gender: string;
    email: string;
    phone_number: string;
    address: string;
    status: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateEmployeeRequestModel {
    user: any;
    profile: any;
}

export interface UpdateEmployeeRequestModel {
    user?: any;
    profile?: any;
}
