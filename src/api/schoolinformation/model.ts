export interface HeadmasterModel {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  niy: string;
  profile_url: string | null;
  status: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface SchoolInformationResponseModel {
  id_school_information: string;
  name_school: string;
  periode: string | null;
  NPSN: string | null;
  id_headmaster: string | null;
  alamat: string | null;
  status: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  headmaster: HeadmasterModel | null;
}

export interface PaginationModel {
  total_data: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface SchoolApiResponseModel {
  status: string;
  status_code: number;
  message: string;
  data: {
    data: SchoolInformationResponseModel[];
    pagination: PaginationModel;
  };
}
export interface CreateSchoolInformationRequest {
  name_school: string;
  periode: string;
  NPSN: string;
  id_headmaster: string;
  alamat: string;
  status: boolean;
}

export interface UpdateSchoolInformationRequest {
  name_school?: string;
  periode?: string | null;
  NPSN?: string | null;
  id_headmaster?: string | null;
  alamat?: string;
  status?: boolean;
}

export type EmployeeOptionsModel = {
  name: string;
  value: string;
}
