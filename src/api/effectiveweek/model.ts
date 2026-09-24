export interface EffectiveWeekResponseModel {
    id_effective_week: string;
    id_subject: string;
    Alokasi_Intrakurikuler: number;
    Alokasi_Kokurikuler: number;
    created_at: string;
    updated_at: string;
}

export interface CreateEffectiveWeekRequest {
    id_subject: string;
    Alokasi_Intrakurikuler?: number;
    Alokasi_Kokurikuler?: number;
}

export interface UpdateEffectiveWeekRequest {
    id_subject?: string;
    Alokasi_Intrakurikuler?: number;
    Alokasi_Kokurikuler?: number;
}
