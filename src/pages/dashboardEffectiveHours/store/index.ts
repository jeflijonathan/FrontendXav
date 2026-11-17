import { create } from "zustand";
import type { PaginationType } from "@common/types";
import type { EffectiveWeekResponseModel } from "@api/effectiveweek/model";
import type { SchoolInformationResponseModel } from "@api/schoolinformation/model";
import type { MajorResponseModel } from "@api/major/model";
import { NATIONAL_REGULATION } from "../utils/allocationBusinessLogic";

export interface FilterStateType {
  fase: "all" | "E" | "F";
  kelas: string; // "all" | "X" | "XI" | "XII"
  major: string; // "all" | id_major
  category: string; // "all" | nama kategori e.g. "KEJURUAN" | "UMUM"
  sort: string;
  order_by: "asc" | "desc";
}

export interface DashboardEffectiveHoursStateType {
  /** Jumlah minggu efektif kalender sekolah (default: 45) */
  effectiveWeeks: number;
  /** Tahun ajaran aktif */
  academicYear: string;
  /** Data Informasi Sekolah aktif */
  schoolInfo: SchoolInformationResponseModel | null;
  /** Daftar seluruh Informasi Sekolah (berbagai periode) */
  schoolInfoList: SchoolInformationResponseModel[];
  /** ID School Information / Periode yang sedang dipilih */
  selectedSchoolInfoId: string;
  /** Durasi jam pelajaran (JP) dalam menit: 45 atau 35 (dari informasi sekolah) */
  lessonDuration: number;
  /** Sistem hari kerja (5 atau 6 hari) dari informasi sekolah */
  workDays: number;
  /** Data alokasi beban mengajar */
  data: EffectiveWeekResponseModel[];
  /** Hasil perhitungan Minggu Efektif (ME) dari Kalender Akademik */
  academicCalendarME: number | null;
  /** Rincian semester & hari efektif dari Kalender Akademik */
  academicCalendarDetails: {
    ganjilWeeks: number;
    genapWeeks: number;
    totalDays: number;
    title?: string;
  } | null;
  /** Loading status kalender akademik */
  isCalendarLoading: boolean;
  /** Daftar opsi kelas / rombel */
  classesList: Array<{ id: string; name: string; fase: string }>;
  /** Daftar opsi mata pelajaran */
  subjectsList: Array<{ id: string; name: string; code: string; fase: string; majorName?: string }>;
  /** Daftar jurusan (majors) */
  majorsList: MajorResponseModel[];
  /** Nama rombel aktif terpilih */
  activeRombelName: string;
  /** State pencarian */
  search: { value: string };
  /** State filter & pengurutan */
  filters: FilterStateType;
  /** State pagination */
  pagination: PaginationType;
  /** Loading states */
  isLoading: boolean;
  isCreateLoading: boolean;
  isUpdateLoading: boolean;
  isDeleteLoading: boolean;
  isUpdatingSchoolInfo: boolean;
  /** Details untuk update / edit */
  updateDetails: EffectiveWeekResponseModel | null;
}

export type StoreType = {
  state: DashboardEffectiveHoursStateType;
  setState: (
    fn: (
      prev: DashboardEffectiveHoursStateType
    ) => DashboardEffectiveHoursStateType
  ) => void;
};

const defaultState: DashboardEffectiveHoursStateType = {
  effectiveWeeks: NATIONAL_REGULATION.DEFAULT_EFFECTIVE_WEEKS,
  academicYear: "2026/2027",
  schoolInfo: null,
  schoolInfoList: [],
  selectedSchoolInfoId: "",
  lessonDuration: 45,
  workDays: 5,
  data: [],
  academicCalendarME: null,
  academicCalendarDetails: null,
  isCalendarLoading: false,
  classesList: [
    { id: "x", name: "Kelas X (Fase E)", fase: "E" },
    { id: "xi", name: "Kelas XI (Fase F)", fase: "F" },
    { id: "xii", name: "Kelas XII (Fase F)", fase: "F" },
  ],
  subjectsList: [],
  majorsList: [],
  activeRombelName: "Kelas X",
  search: { value: "" },
  filters: {
    fase: "all",
    kelas: "all",
    major: "all",
    category: "all",
    sort: "code_subject",
    order_by: "asc",
  },
  pagination: {
    page: 1,
    limit: 10,
    total_data: 0,
    total_pages: 1,
  },
  isLoading: false,
  isCreateLoading: false,
  isUpdateLoading: false,
  isDeleteLoading: false,
  isUpdatingSchoolInfo: false,
  updateDetails: null,
};

export const useDashboardEffectiveHoursStore = create<StoreType>((set) => ({
  state: defaultState,
  setState: (fn) => set((prev) => ({ state: fn(prev.state) })),
}));

export default useDashboardEffectiveHoursStore;

