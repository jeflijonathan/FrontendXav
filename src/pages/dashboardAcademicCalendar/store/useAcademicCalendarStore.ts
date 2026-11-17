import { create } from "zustand";
import type { AcademicCalendarModel, DayCellModel, DayCellType } from "@api/academicCalendar/model";
import AcademicCalendarService from "@api/academicCalendar/service";
import SchoolInformationService from "@api/schoolinformation/service";
import type { SchoolInformationResponseModel } from "@api/schoolinformation/model";
import { getDefaultAcademicCalendar } from "../utils/defaultCalendar";

interface EditingCellPayload {
  semesterId: string;
  monthIndex: number;
  monthName?: string;
  year?: number;
  monthNumber?: number;
  day: number;
  dayName?: string;
  cell: DayCellModel;
}

export interface AcademicCalendarCategoryInput {
  code: string;
  label: string;
  note?: string;
  color?: string;
  is_effective?: boolean;
  type?: DayCellType;
}

interface AcademicCalendarState {
  calendarData: AcademicCalendarModel;
  selectedSemester: "all" | "ganjil" | "genap";
  viewMode: "grid" | "matrix";
  selectedAcademicYear: string;
  isScanModalOpen: boolean;
  editingCell: EditingCellPayload | null;
  isLoading: boolean;
  isSaving: boolean;
  isScanning: boolean;
  scanResultNote: string | null;
  scanErrorMessage: string | null;
  schoolInformations: SchoolInformationResponseModel[];
  selectedSchoolInfoId: string;

  // Actions
  initCalendar: () => Promise<void>;
  fetchSchoolInformations: () => Promise<void>;
  setSelectedSchoolInfoId: (id: string) => void;
  setSelectedSemester: (sem: "all" | "ganjil" | "genap") => void;
  setViewMode: (mode: "grid" | "matrix") => void;
  setSelectedAcademicYear: (year: string) => Promise<boolean>;
  setIsScanModalOpen: (open: boolean) => void;
  setEditingCell: (cell: EditingCellPayload | null) => void;
  updateCell: (
    semesterId: string,
    monthIndex: number,
    day: number,
    updatedCell: Partial<DayCellModel>
  ) => Promise<void>;
  loadDefaults: () => Promise<void>;
  deleteCalendarData: (academicYear?: string) => Promise<boolean>;
  clearHolidaysOnly: () => Promise<boolean>;
  addCategory: (category: AcademicCalendarCategoryInput) => Promise<void>;
  deleteCategory: (code: string) => Promise<void>;
  scanPdfFile: (file: File, idSchoolInformation?: string) => Promise<boolean>;
  saveCalendar: () => Promise<boolean>;
  setCalendarData: (data: AcademicCalendarModel) => void;
  clearScanError: () => void;
}

const service = new AcademicCalendarService();
const schoolService = new SchoolInformationService();

const cleanPeriod = (str?: string | null) => {
  if (!str) return "";
  return str.replace(/[^0-9]/g, "");
};

export const applyWorkDaysToCalendar = (
  calendarData: AcademicCalendarModel,
  workDays: number = 5
): AcademicCalendarModel => {
  const daysPerWeek = workDays === 6 ? 6 : 5;
  const is5DayWeek = daysPerWeek === 5;

  const updatedSemesters = (calendarData.semesters || []).map((sem) => {
    const updatedMonths = (sem.months || []).map((m) => {
      const newCells: Record<string, DayCellModel> = {};
      let effectiveDays = 0;

      Object.entries(m.cells || {}).forEach(([dayKey, cell]) => {
        if (!cell || !cell.valid) {
          newCells[dayKey] = { ...cell };
          return;
        }

        const d = new Date(m.year, m.month_number - 1, cell.day);
        const weekday = d.getDay(); // 0 = Minggu, 6 = Sabtu

        const cellType = cell.type || "";
        const cellLabel = (cell.label || "").trim();
        const cellNote = (cell.note || "").toLowerCase();

        // Cek apakah tanggal ini adalah hari besar / libur khusus / kegiatan terjadwal
        const isSpecialHoliday =
          (cellType.startsWith("holiday_") && cellType !== "weekend_saturday") ||
          [
            "nasional",
            "hari raya",
            "kemerdekaan",
            "maulid",
            "isra",
            "imlek",
            "nyepi",
            "idul",
            "jumat agung",
            "buruh",
            "paskah",
            "kenaikan",
            "waisak",
            "pancasila",
            "tahun baru",
            "nataru",
            "libur akhir",
            "libur semester",
            "libur tp",
          ].some((k) => cellNote.includes(k));

        const isCustomEvent =
          !isSpecialHoliday &&
          cellLabel !== "S" &&
          cellLabel !== "M" &&
          cellLabel !== "" &&
          cellType !== "weekend_saturday" &&
          cellType !== "weekend_sunday";

        if (weekday === 0) {
          // Minggu: selalu libur akhir pekan (M merah)
          if (!isSpecialHoliday && !isCustomEvent) {
            newCells[dayKey] = {
              day: cell.day,
              valid: true,
              label: "M",
              type: "weekend_sunday",
              bg_color: "#fca5a5",
              text_color: "#991b1b",
              is_effective: false,
              note: cell.note || "Libur Akhir Pekan (Minggu)",
            };
          } else {
            newCells[dayKey] = { ...cell };
          }
        } else if (weekday === 6) {
          // Sabtu: sesuaikan dengan sistem 5 hari (1-5) atau 6 hari (1-6)
          if (!isSpecialHoliday && !isCustomEvent) {
            if (is5DayWeek) {
              // 5 Hari Kerja (1-5): Sabtu adalah LIBUR
              newCells[dayKey] = {
                day: cell.day,
                valid: true,
                label: "S",
                type: "weekend_saturday",
                bg_color: "#fef08a",
                text_color: "#854d0e",
                is_effective: false,
                note: "Libur Akhir Pekan (Sabtu)",
              };
            } else {
              // 6 Hari Kerja (1-6): Sabtu adalah HARI EFEKTIF BELAJAR
              newCells[dayKey] = {
                day: cell.day,
                valid: true,
                label: "",
                type: "effective_day",
                bg_color: "",
                text_color: "",
                is_effective: true,
                note: "Hari Efektif Belajar",
              };
            }
          } else {
            newCells[dayKey] = { ...cell };
          }
        } else {
          // Senin - Jumat: hari efektif belajar biasa (atau event jika ada)
          newCells[dayKey] = { ...cell };
        }

        if (newCells[dayKey].is_effective) {
          effectiveDays++;
        }
      });

      const effectiveWeeks = Math.max(0, Math.round(effectiveDays / daysPerWeek));

      return {
        ...m,
        cells: newCells,
        effective_days: effectiveDays,
        effective_weeks: effectiveWeeks,
      };
    });

    const totalDays = updatedMonths.reduce((acc, m) => acc + m.effective_days, 0);
    const totalWeeks = updatedMonths.reduce((acc, m) => acc + m.effective_weeks, 0);

    return {
      ...sem,
      months: updatedMonths,
      total_effective_days: totalDays,
      total_effective_weeks: totalWeeks,
    };
  });

  const yearlyDays = updatedSemesters.reduce((acc, s) => acc + s.total_effective_days, 0);
  const yearlyWeeks = updatedSemesters.reduce((acc, s) => acc + s.total_effective_weeks, 0);

  const cleanedLegends = (calendarData.legends || []).filter(
    (l) => l && l.code && l.code.toUpperCase() !== "S" && l.code.toUpperCase() !== "M"
  );

  return {
    ...calendarData,
    work_days: workDays,
    semesters: updatedSemesters,
    legends: cleanedLegends,
    summary: {
      ...calendarData.summary,
      total_effective_days_yearly: yearlyDays,
      total_effective_weeks_yearly: yearlyWeeks,
      five_day_work_week: is5DayWeek,
      work_days: workDays,
    },
  };
};

const getWorkDays = (
  calendarData: AcademicCalendarModel,
  schoolInformations: SchoolInformationResponseModel[],
  selectedSchoolInfoId?: string
): number => {
  const matching = schoolInformations.find(
    (s) =>
      s.id_school_information === selectedSchoolInfoId ||
      s.id_school_information === calendarData.id_school_information ||
      cleanPeriod(s.periode) === cleanPeriod(calendarData.academic_year)
  );
  if (matching?.work_days) return matching.work_days;
  const activeSchool = schoolInformations.find((s) => s.status);
  if (activeSchool?.work_days) return activeSchool.work_days;
  if (calendarData.work_days) return calendarData.work_days;
  if (calendarData.summary?.work_days) return calendarData.summary.work_days;
  return calendarData.summary?.five_day_work_week === false ? 6 : 5;
};

const getEmptyAcademicCalendar = (academicYear: string): AcademicCalendarModel => {
  return {
    academic_year: academicYear,
    title: `KALENDER AKADEMIK SMK XAVERIUS PALEMBANG TAHUN PELAJARAN ${academicYear}`,
    institution: "Yayasan Xaverius Palembang - SMK Xaverius Palembang",
    semesters: [
      {
        id: "ganjil",
        name: "Semester Ganjil",
        academic_year: academicYear,
        total_effective_weeks: 0,
        total_effective_days: 0,
        months: [],
      },
      {
        id: "genap",
        name: "Semester Genap",
        academic_year: academicYear,
        total_effective_weeks: 0,
        total_effective_days: 0,
        months: [],
      },
    ],
    legends: [],
    summary: {
      total_effective_weeks_yearly: 0,
      total_effective_days_yearly: 0,
      five_day_work_week: true,
    },
  };
};

export const useAcademicCalendarStore = create<AcademicCalendarState>((set, get) => {
  return {
    calendarData: getDefaultAcademicCalendar(),
    selectedSemester: "all",
    viewMode: "grid",
    selectedAcademicYear: "2026/2027",
    isScanModalOpen: false,
    editingCell: null,
    isLoading: true,
    isSaving: false,
    isScanning: false,
    scanResultNote: null,
    scanErrorMessage: null,
    schoolInformations: [],
    selectedSchoolInfoId: "",

    setViewMode: (mode: "grid" | "matrix") => set({ viewMode: mode }),

    fetchSchoolInformations: async () => {
      try {
        await schoolService.getAll(
          {
            onSuccess: (res) => {
              const list = res.data || [];
              set({ schoolInformations: list });
              const activeSchool = list.find((s) => s.status) || list[0];
              if (activeSchool && !get().selectedSchoolInfoId) {
                set({ selectedSchoolInfoId: activeSchool.id_school_information });
              }
            },
            onError: () => {},
          },
          { params: { limit: 100 } }
        );
      } catch {
        // Ignore if error
      }
    },

    initCalendar: async () => {
      set({ isLoading: true });
      await get().fetchSchoolInformations();

      try {
        const schools = get().schoolInformations;
        const targetYear = get().selectedAcademicYear || "2026/2027";
        const data = await service.getCalendar(targetYear);

        if (
          data &&
          Array.isArray(data.semesters) &&
          data.semesters.some((s) => s.months?.length > 0)
        ) {
          const workDays = getWorkDays(data, schools, data.id_school_information);
          const synchronized = applyWorkDaysToCalendar(data, workDays);
          set({
            calendarData: synchronized,
            selectedAcademicYear: synchronized.academic_year || targetYear,
            selectedSchoolInfoId: synchronized.id_school_information || get().selectedSchoolInfoId,
          });
        } else {
          // Jika belum ada di database backend, buat kalender default dan simpan langsung ke database backend!
          const defaults = getDefaultAcademicCalendar();
          const activeSchool = schools.find((s) => s.status) || schools[0];
          if (activeSchool) {
            defaults.id_school_information = activeSchool.id_school_information;
            if (activeSchool.periode) defaults.academic_year = activeSchool.periode;
            defaults.school_name = activeSchool.name_school;
            defaults.title = `KALENDER AKADEMIK ${activeSchool.name_school.toUpperCase()} TAHUN PELAJARAN ${activeSchool.periode || defaults.academic_year}`;
          }
          const workDays = getWorkDays(defaults, schools, defaults.id_school_information);
          const synchronized = applyWorkDaysToCalendar(defaults, workDays);

          // Simpan ke database backend
          const saved = await service.saveCalendar(synchronized);
          set({
            calendarData: saved || synchronized,
            selectedAcademicYear: (saved || synchronized).academic_year,
            selectedSchoolInfoId: (saved || synchronized).id_school_information || "",
          });
        }
      } catch (err) {
        console.error("Gagal inisialisasi kalender dari backend database:", err);
      } finally {
        set({ isLoading: false });
      }
    },

    setSelectedSchoolInfoId: (id) => set({ selectedSchoolInfoId: id }),
    setSelectedSemester: (sem) => set({ selectedSemester: sem }),

    setSelectedAcademicYear: async (year) => {
      set({ selectedAcademicYear: year, isLoading: true });
      const schools = get().schoolInformations;
      try {
        const data = await service.getCalendar(year);
        if (
          data &&
          Array.isArray(data.semesters) &&
          data.semesters.some((s) => s.months?.length > 0)
        ) {
          const workDays = getWorkDays(data, schools, data.id_school_information);
          const synchronized = applyWorkDaysToCalendar(data, workDays);
          set({
            calendarData: synchronized,
            selectedAcademicYear: year,
            isLoading: false,
          });
          if (data.id_school_information) {
            set({ selectedSchoolInfoId: data.id_school_information });
          }
          return true;
        } else {
          // Buat template kalender untuk periode tersebut dan simpan ke database backend
          const defaults = getDefaultAcademicCalendar();
          defaults.academic_year = year;
          const matchingSchool = schools.find((s) => cleanPeriod(s.periode) === cleanPeriod(year));
          if (matchingSchool) {
            defaults.id_school_information = matchingSchool.id_school_information;
            defaults.school_name = matchingSchool.name_school;
          }
          const workDays = getWorkDays(defaults, schools, defaults.id_school_information);
          const synchronized = applyWorkDaysToCalendar(defaults, workDays);

          const saved = await service.saveCalendar(synchronized);
          set({
            calendarData: saved || synchronized,
            selectedAcademicYear: year,
            isLoading: false,
          });
          return true;
        }
      } catch {
        set({ isLoading: false });
        return false;
      }
    },

    setIsScanModalOpen: (open) => {
      if (open) {
        get().fetchSchoolInformations();
      }
      set({ isScanModalOpen: open, scanErrorMessage: null, scanResultNote: null });
    },

    setEditingCell: (cell) => set({ editingCell: cell }),
    clearScanError: () => set({ scanErrorMessage: null }),

    setCalendarData: (data) => {
      set({ calendarData: data });
    },

    loadDefaults: async () => {
      set({ isLoading: true });
      const defaults = getDefaultAcademicCalendar();
      const currentSchool = get().schoolInformations.find(
        (s) => s.id_school_information === get().selectedSchoolInfoId
      );
      if (currentSchool) {
        defaults.id_school_information = currentSchool.id_school_information;
        if (currentSchool.periode) defaults.academic_year = currentSchool.periode;
      }
      const schools = get().schoolInformations;
      const workDays = getWorkDays(defaults, schools, defaults.id_school_information);
      const synchronized = applyWorkDaysToCalendar(defaults, workDays);

      try {
        const saved = await service.saveCalendar(synchronized);
        set({ calendarData: saved || synchronized, isLoading: false });
      } catch {
        set({ calendarData: synchronized, isLoading: false });
      }
    },

    deleteCalendarData: async (academicYear?: string) => {
      const year = academicYear || get().selectedAcademicYear || "current";
      set({ isLoading: true });

      let backendSuccess = false;
      try {
        const res: any = await service.deleteCalendar(year);
        backendSuccess = Boolean(res && (res.status === "SUCCESS" || res.status_code === 200));
      } catch {
        backendSuccess = false;
      }

      const emptyCalendar = getEmptyAcademicCalendar(year === "current" ? "2026/2027" : year);
      set({
        calendarData: emptyCalendar,
        selectedAcademicYear: emptyCalendar.academic_year,
        isLoading: false,
      });

      return backendSuccess;
    },

    clearHolidaysOnly: async () => {
      set({ isLoading: true });
      const current = get().calendarData;

      try {
        const updated = await service.clearHolidays(current);
        if (updated) {
          const schools = get().schoolInformations;
          const workDays = getWorkDays(updated, schools, updated.id_school_information);
          const synchronized = applyWorkDaysToCalendar(updated, workDays);
          set({ calendarData: synchronized, isLoading: false });
          return true;
        }
      } catch (e) {
        console.error("Gagal sinkron clear holidays ke backend database:", e);
      }

      set({ isLoading: false });
      return false;
    },

    addCategory: async (category: AcademicCalendarCategoryInput) => {
      const rawCode = (category.code || category.label || "").toString().trim();
      if (!rawCode || rawCode.toUpperCase() === "S" || rawCode.toUpperCase() === "M") {
        return;
      }

      const current = get().calendarData;
      const academicYear = current.academic_year || get().selectedAcademicYear || "2026/2027";

      try {
        const updated = await service.addCategory({
          academic_year: academicYear,
          category: {
            code: rawCode,
            label: (category.label || rawCode).toString().trim(),
            color: category.color || "#fed7aa",
            is_effective: category.is_effective,
          },
        });

        if (updated) {
          set({ calendarData: updated });
          return;
        }
      } catch (err) {
        console.error("Gagal simpan kategori ke database backend:", err);
      }

      // Fallback update in-memory
      const legends = (current.legends || []).filter(
        (l) => l && l.code && l.code.trim().toUpperCase() !== "S" && l.code.trim().toUpperCase() !== "M"
      );
      const normalized = {
        code: rawCode,
        label: (category.label || rawCode).toString().trim(),
        date_range: "",
        color: category.color || "#fed7aa",
      };
      const existingIdx = legends.findIndex(
        (l) => l && l.code && l.code.toLowerCase() === rawCode.toLowerCase()
      );
      if (existingIdx >= 0) {
        legends[existingIdx] = { ...legends[existingIdx], ...normalized };
      } else {
        legends.push(normalized);
      }
      set({ calendarData: { ...current, legends } });
    },

    deleteCategory: async (code: string) => {
      const current = get().calendarData;
      const academicYear = current.academic_year || get().selectedAcademicYear || "2026/2027";

      try {
        const updated = await service.deleteCategory(code, academicYear);
        if (updated) {
          set({ calendarData: updated });
          return;
        }
      } catch (err) {
        console.error("Gagal hapus kategori dari backend:", err);
      }

      const legends = (current.legends || []).filter(
        (l) => l && l.code && l.code.trim().toLowerCase() !== code.trim().toLowerCase()
      );
      set({ calendarData: { ...current, legends } });
    },

    updateCell: async (semesterId, monthIndex, day, updated) => {
      const current = get().calendarData;
      const academicYear = current.academic_year || get().selectedAcademicYear || "2026/2027";
      const key = String(day);

      // 1. Optimistic UI update agar responsif seketika di layar
      const updatedSemesters = current.semesters.map((sem) => {
        if (sem.id !== semesterId) return sem;

        const updatedMonths = sem.months.map((m, mIdx) => {
          if (mIdx !== monthIndex) return m;

          const currentCell = m.cells[key] || {
            day,
            valid: true,
            type: "effective_day",
            is_effective: true,
          };

          const newCell: DayCellModel = {
            ...currentCell,
            ...updated,
          };

          const newCells = {
            ...m.cells,
            [key]: newCell,
          };

          let effectiveDays = 0;
          Object.values(newCells).forEach((c) => {
            if (c.valid && c.is_effective) {
              effectiveDays++;
            }
          });

          const workDays = getWorkDays(current, get().schoolInformations, get().selectedSchoolInfoId);
          const effectiveWeeks = Math.max(0, Math.round(effectiveDays / workDays));

          return {
            ...m,
            cells: newCells,
            effective_days: effectiveDays,
            effective_weeks: effectiveWeeks,
          };
        });

        const totalDays = updatedMonths.reduce((acc, m) => acc + m.effective_days, 0);
        const totalWeeks = updatedMonths.reduce((acc, m) => acc + m.effective_weeks, 0);

        return {
          ...sem,
          months: updatedMonths,
          total_effective_days: totalDays,
          total_effective_weeks: totalWeeks,
        };
      });

      const yearlyDays = updatedSemesters.reduce((acc, s) => acc + s.total_effective_days, 0);
      const yearlyWeeks = updatedSemesters.reduce((acc, s) => acc + s.total_effective_weeks, 0);
      const workDays = getWorkDays(current, get().schoolInformations, get().selectedSchoolInfoId);

      const optimisticCalendar: AcademicCalendarModel = {
        ...current,
        work_days: workDays,
        semesters: updatedSemesters,
        summary: {
          ...current.summary,
          total_effective_days_yearly: yearlyDays,
          total_effective_weeks_yearly: yearlyWeeks,
          five_day_work_week: workDays === 5,
          work_days: workDays,
        },
      };

      set({ calendarData: optimisticCalendar });

      // 2. Persist perubahan sel langsung ke database backend via API
      try {
        const backendResult = await service.updateCell({
          academic_year: academicYear,
          semester_id: semesterId,
          month_index: monthIndex,
          day,
          cell: updated,
        });

        if (backendResult) {
          set({ calendarData: backendResult });
        }
      } catch (err) {
        console.error("Gagal sinkronisasi update tanggal ke database backend:", err);
      }
    },

    scanPdfFile: async (file: File, idSchoolInformation?: string) => {
      set({ isScanning: true, scanResultNote: null, scanErrorMessage: null });
      const targetSchoolId = idSchoolInformation || get().selectedSchoolInfoId;
      const schools = get().schoolInformations;

      const yearMatch = file.name.match(/20\d{2}[_\-\/ ]*20\d{2}/);
      const detectedPeriod = yearMatch ? yearMatch[0].replace(/[_ ]/g, "/") : "2026/2027";

      let targetSchool = schools.find((s) => s.id_school_information === targetSchoolId);
      if (!targetSchool && schools.length > 0) {
        targetSchool = schools.find(
          (s) => s.periode && cleanPeriod(s.periode) === cleanPeriod(detectedPeriod)
        );
      }

      const schoolForSelectedPeriod = schools.find(
        (s) => s.periode && cleanPeriod(s.periode) === cleanPeriod(get().selectedAcademicYear)
      );
      if (schoolForSelectedPeriod) {
        targetSchool = schoolForSelectedPeriod;
      }

      if (schools.length > 0 && !targetSchool) {
        set({
          isScanning: false,
          scanErrorMessage: `belum terdaftar periode pembelajaran untuk ${detectedPeriod}. Silakan daftarkan periode tersebut terlebih dahulu di menu Informasi Sekolah.`,
        });
        return false;
      }

      try {
        const data = await service.scanPdf(file, targetSchool?.id_school_information);
        if (data) {
          const workDays = getWorkDays(data, schools, targetSchool?.id_school_information);
          const synchronized = applyWorkDaysToCalendar(data, workDays);
          set({
            calendarData: synchronized,
            isScanning: false,
            scanResultNote: `Berhasil memindai ${file.name}. Periode pembelajaran ${data.academic_year} terverifikasi dari Informasi Sekolah dan tersimpan di database.`,
            scanErrorMessage: null,
            selectedAcademicYear: data.academic_year || get().selectedAcademicYear,
          });
          return true;
        }
      } catch (err: any) {
        const errMsg = err?.message || "";
        set({
          isScanning: false,
          scanErrorMessage: errMsg,
        });
        return false;
      }

      set({ isScanning: false });
      return false;
    },

    saveCalendar: async () => {
      set({ isSaving: true });
      try {
        const current = get().calendarData;
        const cleaned = {
          ...current,
          legends: (current.legends || []).filter(
            (l) => l && l.code && l.code.trim().toUpperCase() !== "S" && l.code.trim().toUpperCase() !== "M"
          ),
        };
        const saved = await service.saveCalendar(cleaned);
        if (saved) {
          set({ calendarData: saved, isSaving: false });
          return true;
        }
        set({ isSaving: false });
        return true;
      } catch (err) {
        console.error("Gagal menyimpan kalender ke backend database:", err);
        set({ isSaving: false });
        return false;
      }
    },
  };
});

export default useAcademicCalendarStore;
