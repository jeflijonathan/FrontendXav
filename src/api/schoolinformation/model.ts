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
}

export interface CreateSchoolInformationRequest {
    name_school: string;
    periode?: string | null;
    NPSN?: string | null;
    id_headmaster?: string | null;
    alamat?: string | null;
    status?: boolean;
}

export interface UpdateSchoolInformationRequest {
    name_school?: string;
    periode?: string | null;
    NPSN?: string | null;
    id_headmaster?: string | null;
    alamat?: string | null;
    status?: boolean;
}
