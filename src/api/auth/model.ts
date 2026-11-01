export interface AuthRoleModel {
  id: string;
  name: string;
}

export interface AuthUserModel {
  id: string;
  full_name: string;
  username: string;
  user_type: "employee" | "student" | "user";
  identifier: string; // NIY for employee, NIS for student
  roles: AuthRoleModel[];
  profile_url?: string | null;
  active_role?: string | null;
}

export interface EmployeeLoginRequestModel {
  niy: string;
  password: string;
}

export interface StudentLoginRequestModel {
  nis: string;
  password: string;
}

export interface SelectRoleRequestModel {
  role_name: string;
}

export interface AuthResponseModel {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: AuthUserModel;
}

export interface SelectRoleResponseModel {
  access_token: string;
  active_role: string;
  user: AuthUserModel;
}

export interface ProfileDetailModel {
  gender?: "L" | "P" | string | null;
  birth_place?: string | null;
  birth_date?: string | null;
  address?: string | null;
  RT?: string | null;
  RW?: string | null;
  zip_code?: string | null;
  phone_number?: string | null;
  description?: string | null;
}

export interface ProfileResponseModel {
  user_id: string;
  username: string;
  full_name: string;
  first_name: string;
  last_name?: string | null;
  user_type: "employee" | "student" | "user";
  identifier: string; // NIY or NIS
  nisn?: string | null;
  email?: string | null;
  profile_url?: string | null;
  status: boolean;
  roles: AuthRoleModel[];
  detail?: ProfileDetailModel | null;
}

export interface ProfileUpdateRequestModel {
  email?: string;
  password?: string;
  profile_url?: string | null;
  gender?: "L" | "P" | string | null;
  birth_place?: string | null;
  birth_date?: string | null;
  address?: string | null;
  RT?: string | null;
  RW?: string | null;
  zip_code?: string | null;
  phone_number?: string | null;
  description?: string | null;
}
