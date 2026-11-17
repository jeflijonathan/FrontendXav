export type DayCellType =
  | "effective_day"
  | "weekend_saturday"
  | "weekend_sunday"
  | "first_day"
  | "holiday_national"
  | "holiday_tp"
  | "holiday_nataru"
  | "holiday_sem"
  | "holiday_cuti"
  | "holiday_event"
  | "holiday_paskah"
  | "event_mpls"
  | "event_misa"
  | "event_lomba"
  | "event_rapat"
  | "event_rmd"
  | "event_xavos"
  | "event_uskup"
  | "event_praktek"
  | "event_ukk"
  | "event_tka"
  | "event_psp"
  | "event_muhasabah"
  | "event_sas"
  | "event_susulan"
  | "event_nilai"
  | "event_inilai"
  | "event_legger"
  | "event_cetak"
  | "event_raport"
  | "event_yxp"
  | "event_church"
  | "disabled";

export interface DayCellModel {
  day: number;
  valid: boolean;
  label?: string;
  type: DayCellType;
  bg_color?: string;
  text_color?: string;
  is_effective: boolean;
  note?: string;
}

export interface MonthModel {
  name: string; // e.g. "Juli 2026"
  month_number: number; // 1 - 12
  year: number;
  effective_weeks: number;
  effective_days: number;
  cells: Record<string, DayCellModel>;
}

export interface SemesterModel {
  id: "ganjil" | "genap" | string;
  name: string; // "Semester Ganjil" | "Semester Genap"
  academic_year: string; // "2026/2027"
  total_effective_weeks: number;
  total_effective_days: number;
  months: MonthModel[];
}

export interface LegendModel {
  code: string;
  label: string;
  date_range: string;
  color?: string;
}

export interface AcademicCalendarSummary {
  total_effective_weeks_yearly: number;
  total_effective_days_yearly: number;
  five_day_work_week: boolean;
  work_days?: number;
}

export interface AcademicCalendarModel {
  id_school_information?: string;
  school_name?: string;
  academic_year: string;
  title: string;
  institution: string;
  work_days?: number;
  semesters: SemesterModel[];
  legends: LegendModel[];
  summary: AcademicCalendarSummary;
  scan_metadata?: {
    filename: string;
    total_pages: number;
    extracted_length: number;
    status: string;
    message: string;
  };
}

