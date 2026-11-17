export interface EffectiveWeekSubjectModel {
    id: string;
    id_subject?: string;
    name: string;
    code_subject?: string | null;
    kelas?: string | null;
    fase?: string | null;
    category?: { id: string; name: string } | null;
}

export interface EffectiveWeekResponseModel {
    id_effective_week: string;
    id: string;
    id_subject: string;
    id_school_information?: string | null;
    id_class?: string | null;
    id_major?: string | null;
    id_majors?: string[] | null;
    major_name?: string;
    major_names?: string[];
    Alokasi_Intrakurikuler: number;
    Alokasi_Kokurikuler: number;
    category_name?: string;
    subject_name?: string;
    code_subject?: string;
    rombel?: string;
    kelas?: string;
    fase?: string;
    created_at: string;
    updated_at: string;
    subject?: EffectiveWeekSubjectModel | null;
}

export interface CreateEffectiveWeekRequest {
    id_subject: string;
    id_school_information?: string | null;
    id_class?: string | null;
    id_major?: string | null;
    id_majors?: string[] | null;
    Alokasi_Intrakurikuler?: number;
    Alokasi_Kokurikuler?: number;
    rombel?: string;
}

export interface UpdateEffectiveWeekRequest {
    id_subject?: string;
    id_school_information?: string | null;
    id_class?: string | null;
    id_major?: string | null;
    id_majors?: string[] | null;
    Alokasi_Intrakurikuler?: number;
    Alokasi_Kokurikuler?: number;
    rombel?: string;
}
