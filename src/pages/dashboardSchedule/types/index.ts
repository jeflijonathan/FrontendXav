export type DayName = 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';

export type ScheduleViewMode = 'matrix' | 'per_class';

export type ActivityCategory =
    | 'UPACARA'
    | 'SENAM'
    | 'LITERASI'
    | 'ISTIRAHAT'
    | 'EKSTRA_WAJIB'
    | 'EKSTRA_PILIHAN'
    | 'EKSTRA_PILIHAN_XI'
    | 'EKSTRA_PILIHAN_X_XI'
    | 'EKSTRA_PILIHAN_XII'
    | 'PRAMUKA'
    | 'P1_P5'
    | 'FUTSAL'
    | 'BASKET'
    | 'BADMINTON'
    | 'PADUAN_SUARA'
    | 'MUSIK_BAND'
    | 'TARI'
    | 'ENGLISH_CLUB'
    | 'ROBOTIKA'
    | 'JURNALISTIK'
    | 'PMR'
    | 'ROHANI'
    | 'KBM';

export interface PreferredScheduleSlot {
    day: DayName;
    jam: string; // e.g. "Jam ke 5-6 (10:20 - 11:40)"
    timeRange: string; // e.g. "10:20 - 11:40"
    jpStart?: number;
    jpEnd?: number;
}

export interface TeacherScheduleRequest {
    id: string;
    id_schedule_request?: string;
    id_school_information?: string | null;
    teacherCode: number;
    teacherName: string;
    subjectName: string;
    preferredSlots: PreferredScheduleSlot[];
    status: 'VALID' | 'CONFLICT' | 'PENDING' | string;
    statusText: string; // "✓ Tersedia & Bebas Bentrok" atau "⚠️ Terdeteksi Bentrok"
    conflictReason?: string | null;
    notes?: string | null;
    createdAt?: string;
}


export interface TeacherSubjectOption {
    idSubject?: string;
    subjectName: string;
    subjectCode: string;
    category: 'KEJURUAN' | 'UMUM';
    targetJp?: number;
}

export interface TeacherCodeEntry {
    code: number;
    teacherId: string;
    name: string;
    niy?: string;
    subjectName: string;
    subjectCode: string;
    subjects?: TeacherSubjectOption[];
    category: 'KEJURUAN' | 'UMUM';
    /** Rekomendasi pedagogik penempatan JP (misal: "JP 6-8 (Blok Praktik Siang)", "JP 1-3 (Pagi)") */
    recommendedJp: string;
    recommendedJpRange?: [number, number];
    totalJpAssigned: number;
    targetJp: number;
    color?: string;
}

export interface ClassColumn {
    id: string;
    name: string; // e.g. "X AKL", "X MPLB", "X TJKT", "X DKV", "XI AKL", "XI MP", "XI TJKT", "XI DKV", "XII AK", "XII MP", "XII TKJ", "XII DKV"
    grade: 'X' | 'XI' | 'XII';
    major: string;
}

export interface ScheduleCell {
    teacherCode: number | null;
    teacherName?: string;
    subjectName?: string;
    subjectCode?: string;
    category?: 'KEJURUAN' | 'UMUM';
    notes?: string;
    isLocked?: boolean;
}

export interface SpecialActivityRow {
    isSpecial: true;
    activityType: ActivityCategory;
    title: string;
    fullSpan: boolean; // true = colSpan across all class columns
    subtitle?: string;
    colorScheme: {
        bg: string;
        text: string;
        border: string;
    };
}

export interface ScheduleRow {
    id: string;
    day: DayName;
    jp: number | string; // 0 for Upacara/Senam/Literasi; 1..10 for KBM; '-' for Istirahat/Ekstra
    timeRange: string; // "07.00 - 07.45", "07.45 - 08.20", etc.
    durasiMenit: number;
    specialActivity?: SpecialActivityRow | null;
    classCells: Record<string, ScheduleCell>; // Keyed by ClassColumn.name
}

export interface ScheduleConflict {
    day: DayName;
    jp: number | string;
    timeRange: string;
    teacherCode: number;
    teacherName: string;
    conflictedClasses: string[]; // classes where this teacher is assigned at the same slot
}

export interface GuruPiketEntry {
    name: string;
    role?: string;
}

export interface JpRecommendationRule {
    subjectName: string;
    category: 'KEJURUAN' | 'UMUM';
    recommendedJpText: string;
    recommendedRange: [number, number];
    reason: string;
    type: 'PRODUKTIF_BLOK' | 'TEORI_EKSAK_PAGI' | 'BAHASA_SOSIAL' | 'PEMBIASAAN_P5';
}

export type DragSourceType =
    | 'TEACHER_ITEM'
    | 'SPECIAL_ACTIVITY'
    | 'SCHEDULE_CELL';

export interface DragPayload {
    type: DragSourceType;
    teacherCode?: number;
    teacherName?: string;
    subjectName?: string;
    activityType?: ActivityCategory;
    activityTitle?: string;
    fromRowId?: string;
    fromClassName?: string;
}

