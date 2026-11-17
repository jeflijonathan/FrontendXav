import { useMemo, useCallback } from "react";
import useDashboardEffectiveHoursStore from "../../store";
import EffectiveWeekService from "@api/effectiveweek/service";
import SubjectService from "@api/subject/service";
import SchoolInformationService from "@api/schoolinformation/service";
import AcademicCalendarService from "@api/academicCalendar/service";
import MajorService from "@api/major/service";
import type { TableHeaderType } from "@components/Table/TableBody";
import type { SortOptionType } from "@common/types";
import { snackbar } from "@utils/snackbar";
import { listAllocationTableMapper } from "../utils/ListTableMapper";
import {
  calculateAllocationSummary,
  type ComputedAllocationItem,
  type AllocationSummaryStats,
} from "../../utils/allocationBusinessLogic";

export interface ReturnAllocationListHook {
  computedData: ComputedAllocationItem[];
  filteredData: ComputedAllocationItem[];
  summaryStats: AllocationSummaryStats;
  tableHeaders: TableHeaderType[];
  sortOptions: SortOptionType[];
  categoryOptions: string[];
  majorOptions: Array<{ id: string; name: string }>;
  schoolInfoList: any[];
  selectedSchoolInfoId: string;
  isLoading: boolean;
  effectiveWeeks: number;
  academicCalendarME: number | null;
  academicCalendarDetails: {
    ganjilWeeks: number;
    genapWeeks: number;
    totalDays: number;
    title?: string;
  } | null;
  isCalendarLoading: boolean;
  lessonDuration: number;
  workDays: number;
  activeFase: string;
  activeKelas: string;
  activeMajor: string;
  activeCategory: string;
  isUpdatingSchoolInfo: boolean;
  fetchAllocationList: (schoolInfoId?: string) => Promise<void>;
  fetchSubjectOptions: () => Promise<void>;
  fetchSchoolInfo: () => Promise<void>;
  fetchAcademicCalendar: (period: string) => Promise<void>;
  fetchMajors: () => Promise<void>;
  handleSelectSchoolInfo: (id: string) => void;
  updateLessonDuration: (newDuration: number) => Promise<void>;
  exportSKDocument: () => void;
}

export const useAllocationList = (): ReturnAllocationListHook => {
  const { state, setState } = useDashboardEffectiveHoursStore();
  const service = useMemo(() => new EffectiveWeekService(), []);
  const subjectService = useMemo(() => new SubjectService(), []);
  const schoolService = useMemo(() => new SchoolInformationService(), []);
  const calendarService = useMemo(() => new AcademicCalendarService(), []);
  const majorService = useMemo(() => new MajorService(), []);

  const fetchAcademicCalendar = useCallback(
    async (period: string) => {
      if (!period) return;
      setState((prev) => ({ ...prev, isCalendarLoading: true }));
      try {
        const cal = await calendarService.getCalendar(period);
        if (cal) {
          const ganjil = cal.semesters?.find((s: any) => s.id === "ganjil");
          const genap = cal.semesters?.find((s: any) => s.id === "genap");
          const ganjilWeeks = ganjil?.total_effective_weeks || 0;
          const genapWeeks = genap?.total_effective_weeks || 0;
          const totalDays =
            (ganjil?.total_effective_days || 0) + (genap?.total_effective_days || 0);
          const totalME =
            ganjilWeeks + genapWeeks || cal.summary?.total_effective_weeks_yearly || 44;

          setState((prev) => ({
            ...prev,
            effectiveWeeks: totalME,
            academicCalendarME: totalME,
            academicCalendarDetails: {
              ganjilWeeks,
              genapWeeks,
              totalDays,
              title: cal.title,
            },
            isCalendarLoading: false,
          }));
          return;
        }
      } catch {
        // offline fallback
      }
      setState((prev) => ({ ...prev, isCalendarLoading: false }));
    },
    [calendarService, setState]
  );

  const fetchAllocationList = useCallback(
    async (schoolInfoId?: string) => {
      const targetId = schoolInfoId || state.selectedSchoolInfoId;
      setState((prev) => ({ ...prev, isLoading: true }));
      await service.getAll(
        {
          onSuccess: (res: any) => {
            const list = Array.isArray(res.data) ? res.data : [];
            setState((prev) => ({
              ...prev,
              data: list,
              pagination: {
                ...prev.pagination,
                total_data: list.length,
              },
            }));
          },
          onError: (err: any) => {
            snackbar.error(err.message || "Gagal memuat data alokasi minggu efektif");
          },
          onFullfilled: () => {
            setState((prev) => ({ ...prev, isLoading: false }));
          },
        },
        { params: targetId ? { id_school_information: targetId } : {} }
      );
    },
    [service, state.selectedSchoolInfoId, setState]
  );

  const fetchSchoolInfo = useCallback(async () => {
    try {
      await schoolService.getAll(
        {
          onSuccess: (res: any) => {
            const list = Array.isArray(res?.data) ? res.data : [];
            const active = list.find((s: any) => s.status) || list[0];
            const currentId = state.selectedSchoolInfoId;
            const selected = currentId
              ? list.find((s: any) => s.id_school_information === currentId) || active
              : active;

            if (selected) {
              setState((prev) => ({
                ...prev,
                schoolInfoList: list,
                schoolInfo: selected,
                selectedSchoolInfoId: selected.id_school_information,
                academicYear: selected.periode || prev.academicYear,
                lessonDuration: selected.lesson_duration ?? 45,
                workDays: selected.work_days ?? 5,
              }));
              fetchAllocationList(selected.id_school_information);
              if (selected.periode) {
                fetchAcademicCalendar(selected.periode);
              }
            }
          },
          onError: () => { },
        },
        { params: { limit: 50 } }
      );
    } catch {
      // offline fallback
    }
  }, [schoolService, state.selectedSchoolInfoId, setState, fetchAllocationList, fetchAcademicCalendar]);

  const handleSelectSchoolInfo = useCallback(
    (id: string) => {
      const selected = state.schoolInfoList.find(
        (s: any) => s.id_school_information === id
      );
      if (!selected) return;

      setState((prev) => ({
        ...prev,
        schoolInfo: selected,
        selectedSchoolInfoId: selected.id_school_information,
        academicYear: selected.periode || prev.academicYear,
        lessonDuration: selected.lesson_duration ?? 45,
        workDays: selected.work_days ?? 5,
      }));

      fetchAllocationList(id);
      if (selected.periode) {
        fetchAcademicCalendar(selected.periode);
      }
      snackbar.info(`Beralih ke alokasi Tahun Ajaran ${selected.periode}`);
    },
    [state.schoolInfoList, setState, fetchAllocationList, fetchAcademicCalendar]
  );

  const updateLessonDuration = useCallback(
    async (newDuration: number) => {
      const currentSchool = state.schoolInfo;
      // Langsung optimistik update di UI
      setState((prev) => ({
        ...prev,
        lessonDuration: newDuration,
        isUpdatingSchoolInfo: true,
      }));

      if (!currentSchool) {
        setState((prev) => ({ ...prev, isUpdatingSchoolInfo: false }));
        snackbar.success(`Durasi jam pelajaran disetel ke ${newDuration} Menit / JP`);
        return;
      }

      await schoolService.update(
        currentSchool.id_school_information,
        { lesson_duration: newDuration },
        {
          onSuccess: (res) => {
            setState((prev) => ({
              ...prev,
              schoolInfo: res,
              lessonDuration: res.lesson_duration ?? newDuration,
              isUpdatingSchoolInfo: false,
            }));
            snackbar.success(
              `Durasi JP berhasil diperbarui menjadi ${newDuration} Menit (Tersimpan ke Informasi Sekolah)`
            );
          },
          onError: (err) => {
            setState((prev) => ({ ...prev, isUpdatingSchoolInfo: false }));
            snackbar.error(
              err.message || "Gagal memperbarui durasi JP ke Informasi Sekolah"
            );
          },
          onFullfilled: () => {
            setState((prev) => ({ ...prev, isUpdatingSchoolInfo: false }));
          },
        }
      );
    },
    [schoolService, state.schoolInfo, setState]
  );

  const fetchSubjectOptions = useCallback(async () => {
    await subjectService.getAll(
      {
        onSuccess: (res: any) => {
          const list = Array.isArray(res.data) ? res.data : [];
          setState((prev) => ({
            ...prev,
            subjectsList: list.map((s: any) => ({
              id: s.id_subject || s.id,
              name: s.name,
              code: s.code_subject || "",
              fase: s.fase || "E",
              majorName: s.major?.name || "",
            })),
          }));
        },
        onError: () => { },
      },
      { params: { limit: 100 } }
    );
  }, [subjectService, setState]);

  const fetchMajors = useCallback(async () => {
    await majorService.getAll(
      {
        onSuccess: (res: any) => {
          const list = Array.isArray(res.data) ? res.data : [];
          setState((prev) => ({
            ...prev,
            majorsList: list,
          }));
        },
        onError: () => { },
      },
      { params: { limit: 50 } }
    );
  }, [majorService, setState]);

  const computedData = useMemo(() => {
    return listAllocationTableMapper(state.data, state.effectiveWeeks, state.subjectsList);
  }, [state.data, state.effectiveWeeks, state.subjectsList]);


  const filteredData = useMemo(() => {
    const query = state.search.value.trim().toLowerCase();
    const faseFilter = state.filters.fase;
    const kelasFilter = state.filters.kelas;
    const majorFilter = state.filters.major;
    const categoryFilter = state.filters.category;

    return computedData.filter((item) => {
      if (faseFilter !== "all" && item.fase !== faseFilter) return false;
      if (kelasFilter !== "all") {
        const itemKelas = (item.kelas || "").toUpperCase().trim();
        if (itemKelas !== kelasFilter.toUpperCase()) return false;
      }
      if (majorFilter !== "all") {
        if (majorFilter === "general") {
          const itemMajor = (item.major_name || "").toLowerCase();
          if (!itemMajor.includes("general") && !itemMajor.includes("umum") && !itemMajor.includes("all")) {
            return false;
          }
        } else {
          const filterMajor = state.majorsList.find(
            (m) => m.id_major === majorFilter || m.id === majorFilter
          );
          const targetName = (filterMajor?.name || majorFilter).toLowerCase();
          const itemMajor = (item.major_name || "").toLowerCase();
          if (!itemMajor.includes(targetName)) return false;
        }
      }
      if (categoryFilter !== "all") {
        const itemCat = (item.category_name || "").toLowerCase();
        if (!itemCat.includes(categoryFilter.toLowerCase())) return false;
      }
      if (query) {
        const matchName = item.subject_name.toLowerCase().includes(query);
        const matchCode = item.code_subject.toLowerCase().includes(query);
        const matchKelas = (item.kelas || "").toLowerCase().includes(query);
        const matchCat = (item.category_name || "").toLowerCase().includes(query);
        const matchMajor = (item.major_name || "").toLowerCase().includes(query);
        return matchName || matchCode || matchKelas || matchCat || matchMajor;
      }

      return true;
    });
  }, [computedData, state.search.value, state.filters.fase, state.filters.kelas, state.filters.major, state.filters.category, state.majorsList]);

  const categoryOptions = useMemo(() => {
    return ["KEJURUAN", "UMUM"];
  }, []);

  const majorOptions = useMemo(() => {
    return state.majorsList.map((m) => ({
      id: m.id_major || m.id || "",
      name: m.name,
    }));
  }, [state.majorsList]);

  // 3. Ringkasan statistik & kepatuhan kurikulum
  const summaryStats = useMemo(() => {
    return calculateAllocationSummary(filteredData, state.effectiveWeeks);
  }, [filteredData, state.effectiveWeeks]);

  // 4. Header tabel sesuai template BaseTable & proporsional mengisi ruang
  const tableHeaders: TableHeaderType[] = useMemo(
    () => [
      { label: "MATA PELAJARAN & KODE", width: "220px" },
      { label: "KELAS", width: "90px" },
      { label: "JURUSAN", width: "120px" },
      { label: "JP INTRA/THN", width: "110px" },
      { label: "JP KOKU/THN", width: "110px" },
      { label: "TARGET MINIMAL", width: "120px" },
      { label: "INTRA / MGG", width: "100px" },
      { label: "KOKU / MGG", width: "100px" },
      { label: "TOTAL / MGG", width: "110px" },
      { label: `JP RIIL (${state.effectiveWeeks} ME)`, width: "120px" },
      { label: "ANALISIS ALOKASI (ATP)", width: "160px" },
      { label: "Created At", width: "160px" },
      { label: "Updated At", width: "160px" },
    ],
    [state.effectiveWeeks]
  );

  const sortOptions: SortOptionType[] = useMemo(
    () => [
      { label: "Kode Mapel", value: "code_subject" },
      { label: "Nama Mapel", value: "name" },
      { label: "Total Beban Mingguan", value: "total_per_week" },
      { label: "Selisih Alokasi Cadangan", value: "diff_cadangan" },
    ],
    []
  );

  // 5. Fungsi Ekspor SK & Dokumen Alokasi
  const exportSKDocument = useCallback(() => {
    try {
      const headers = [
        "No",
        "Mata Pelajaran",
        "Kode Mapel",
        "Fase",
        "Rombel",
        "JP Intra / Thn",
        "JP Koku / Thn",
        "Target Minimal (Thn)",
        "Intra / Mgg",
        "Koku / Mgg",
        "Total / Mgg",
        `JP Riil Kalender (${state.effectiveWeeks} ME)`,
        "Analisis Alokasi & Cadangan (ATP)",
      ];

      const rows = filteredData.map((d, idx) => [
        idx + 1,
        `"${d.subject_name.replace(/"/g, '""')}"`,
        `"${d.code_subject}"`,
        `"${d.fase}"`,
        `"${d.rombel || "-"}"`,
        d.jp_intra_year,
        d.jp_koku_year,
        d.total_year,
        d.intra_per_week.toFixed(1).replace(".", ","),
        d.koku_per_week.toFixed(1).replace(".", ","),
        d.total_per_week.toFixed(1).replace(".", ","),
        d.real_projected,
        `"${d.diff_cadangan >= 0 ? "+" : ""}${d.diff_cadangan} JP (${d.evaluation.label})"`,
      ]);

      // Tambahkan baris total
      rows.push([
        "",
        `"TOTAL ALOKASI (T.A. ${state.academicYear})"`,
        "",
        "",
        "",
        summaryStats.totalIntraYear,
        summaryStats.totalKokuYear,
        summaryStats.totalOverallYear,
        summaryStats.totalIntraWeekly.toFixed(1).replace(".", ","),
        summaryStats.totalKokuWeekly.toFixed(1).replace(".", ","),
        summaryStats.totalWeekly.toFixed(1).replace(".", ","),
        summaryStats.totalRealProjected,
        `"${summaryStats.totalDiffCadangan >= 0 ? "+" : ""}${summaryStats.totalDiffCadangan} JP (${summaryStats.globalEvaluation.label})"`,
      ]);

      const csvContent =
        "data:text/csv;charset=utf-8,\uFEFF" +
        [headers.join(";"), ...rows.map((e) => e.join(";"))].join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        `SK_Alokasi_Jam_Pelajaran_SMK_Xaverius_${state.academicYear.replace(/[\/\\ ]/g, "_")}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      snackbar.success("Dokumen SK Alokasi Jam Pelajaran berhasil diekspor (CSV)");
    } catch {
      snackbar.error("Gagal mengekspor dokumen SK");
    }
  }, [filteredData, state.academicYear, state.effectiveWeeks, summaryStats]);

  return {
    computedData,
    filteredData,
    summaryStats,
    tableHeaders,
    sortOptions,
    categoryOptions,
    majorOptions,
    schoolInfoList: state.schoolInfoList,
    selectedSchoolInfoId: state.selectedSchoolInfoId,
    isLoading: state.isLoading,
    effectiveWeeks: state.effectiveWeeks,
    academicCalendarME: state.academicCalendarME,
    academicCalendarDetails: state.academicCalendarDetails,
    isCalendarLoading: state.isCalendarLoading,
    lessonDuration: state.lessonDuration,
    workDays: state.workDays,
    isUpdatingSchoolInfo: state.isUpdatingSchoolInfo,
    activeFase: state.filters.fase,
    activeKelas: state.filters.kelas,
    activeMajor: state.filters.major,
    activeCategory: state.filters.category,
    fetchAllocationList,
    fetchSubjectOptions,
    fetchSchoolInfo,
    fetchAcademicCalendar,
    fetchMajors,
    handleSelectSchoolInfo,
    updateLessonDuration,
    exportSKDocument,
  };
};

export default useAllocationList;

