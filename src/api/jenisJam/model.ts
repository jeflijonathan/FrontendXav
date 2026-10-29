export interface JenisJamResponseModel {
    id_category_schendule_time: string;
    id?: string;
    name: string;
    status: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface CreateJenisJamRequestModel {
    name: string;
    status?: boolean;
}

export interface UpdateJenisJamRequestModel {
    name?: string;
    status?: boolean;
}
