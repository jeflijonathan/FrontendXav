import { create } from "zustand";
import type { SchoolInformationResponseModel } from "@api/schoolinformation/model";
import type {
    DailyClassItem,
    DailyMeetingItem,
    DailyMonthlyLedgerResponse,
    DailyStudentSheetItem,
} from "@api/dailyAttendance/model";

export type DailyAttendanceTab = "input" | "cards" | "ledger";

export interface DashboardDailyAttendanceState {
    schoolInfos: SchoolInformationResponseModel[];
    selectedSchoolInfoId: string;
    isLoadingSchoolInfo: boolean;

    hasCalendar: boolean;
    periode: string;
    isPiketOrStaff: boolean;
    isPengurusKelas: boolean;

    classes: DailyClassItem[];
    selectedClassId: string;
    meetings: DailyMeetingItem[];
    isLoadingMeetings: boolean;

    semesterFilter: "ALL" | "GANJIL" | "GENAP";
    selectedMonthKey: string; // Format YYYY-MM
    activeTab: DailyAttendanceTab;
    selectedMeetingDate: string; // Format YYYY-MM-DD untuk tab Input Absensi Harian

    // Monthly ledger (Gambar 2)
    monthlyLedger: DailyMonthlyLedgerResponse | null;
    isLoadingLedger: boolean;

    // Inline / Edit sheet (Pengurus Kelas / Guru Piket)
    editingMeeting: DailyMeetingItem | null;
    isEditDialogOpen: boolean;
    sheetStudents: DailyStudentSheetItem[];
    sheetRecordedBy: string | null;
    sheetUpdatedBy: string | null;
    isLoadingSheet: boolean;
    isSaving: boolean;
}

interface StoreType {
    state: DashboardDailyAttendanceState;
    setState: (
        updater:
            | Partial<DashboardDailyAttendanceState>
            | ((prev: DashboardDailyAttendanceState) => DashboardDailyAttendanceState)
    ) => void;
    resetOnPeriodChange: (schoolInfoId: string) => void;
    resetOnClassChange: (classId: string) => void;
}

const now = new Date();
const defaultMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

const initialState: DashboardDailyAttendanceState = {
    schoolInfos: [],
    selectedSchoolInfoId: "",
    isLoadingSchoolInfo: true,
    hasCalendar: false,
    periode: "",
    isPiketOrStaff: false,
    isPengurusKelas: false,
    classes: [],
    selectedClassId: "",
    meetings: [],
    isLoadingMeetings: false,
    semesterFilter: "ALL",
    selectedMonthKey: defaultMonthKey,
    activeTab: "input",
    selectedMeetingDate: "",
    monthlyLedger: null,
    isLoadingLedger: false,
    editingMeeting: null,
    isEditDialogOpen: false,
    sheetStudents: [],
    sheetRecordedBy: null,
    sheetUpdatedBy: null,
    isLoadingSheet: false,
    isSaving: false,
};

export const useDashboardDailyAttendanceStore = create<StoreType>((set) => ({
    state: initialState,
    setState: (updater) =>
        set((store) => ({
            state:
                typeof updater === "function"
                    ? updater(store.state)
                    : { ...store.state, ...updater },
        })),
    resetOnPeriodChange: (schoolInfoId) =>
        set((store) => ({
            state: {
                ...store.state,
                selectedSchoolInfoId: schoolInfoId,
                selectedClassId: "",
                meetings: [],
                selectedMeetingDate: "",
                sheetStudents: [],
                monthlyLedger: null,
            },
        })),
    resetOnClassChange: (classId) =>
        set((store) => ({
            state: {
                ...store.state,
                selectedClassId: classId,
                sheetStudents: [],
                monthlyLedger: null,
            },
        })),
}));

export default useDashboardDailyAttendanceStore;
