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
  work_days: number; // 5 = Senin-Jumat, 6 = Senin-Sabtu
  lesson_duration: number; // Durasi jam pelajaran: 45 atau 35 menit
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
  work_days: number; // 5 atau 6
  lesson_duration: number; // 45 atau 35 menit
}

export interface UpdateSchoolInformationRequest {
  name_school?: string;
  periode?: string | null;
  NPSN?: string | null;
  id_headmaster?: string | null;
  alamat?: string;
  status?: boolean;
  work_days?: number; // 5 atau 6
  lesson_duration?: number; // 45 atau 35 menit
}

export type EmployeeOptionsModel = {
  name: string;
  value: string;
}
