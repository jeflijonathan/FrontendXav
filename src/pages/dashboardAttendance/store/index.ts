import { create } from 'zustand';
import type { SchoolInformationResponseModel } from '@api/schoolinformation/model';
import type {
    AcademicYearMeetingItem,
    AccessibleClassItem,
    AttendanceApprovalCheckResponse,
    AttendanceSettingsModel,
    StudentAttendanceSheetItem,
} from '@api/attendance/model';

export interface AttendanceState {
    // School info / TA
    schoolInfos: SchoolInformationResponseModel[];
    selectedSchoolInfoId: string;
    isLoadingSchoolInfo: boolean;

    // Schedule approval & accessible classes/meetings
    isApproved: boolean;
    approvalData: AttendanceApprovalCheckResponse['approval_data'];
    hasCalendar: boolean;
    isAdminView: boolean;
    teacherDisplayName: string | null;
    isLoadingMeetings: boolean;

    // Selection
    classes: AccessibleClassItem[];
    selectedClassId: string;
    selectedSubject: string;
    meetings: AcademicYearMeetingItem[];
    selectedMeeting: AcademicYearMeetingItem | null;

    // Sheet
    students: StudentAttendanceSheetItem[];
    isLoadingSheet: boolean;
    isSaving: boolean;

    // Settings & Scan / Barcode dialogs
    settings: AttendanceSettingsModel;
    isLoadingSettings: boolean;
    isSettingsDialogOpen: boolean;
    isScanDialogOpen: boolean;
    isBarcodeDialogOpen: boolean;
}

interface AttendanceStore {
    state: AttendanceState;
    setState: (updater: Partial<AttendanceState> | ((prev: AttendanceState) => AttendanceState)) => void;
    resetSelectionOnPeriodChange: (newId: string) => void;
    resetSelectionOnClassChange: (newClassId: string) => void;
}

const initialState: AttendanceState = {
    schoolInfos: [],
    selectedSchoolInfoId: '',
    isLoadingSchoolInfo: true,
    isApproved: false,
    approvalData: null,
    hasCalendar: false,
    isAdminView: false,
    teacherDisplayName: null,
    isLoadingMeetings: false,
    classes: [],
    selectedClassId: '',
    selectedSubject: '',
    meetings: [],
    selectedMeeting: null,
    students: [],
    isLoadingSheet: false,
    isSaving: false,
    settings: {
        use_face_verification: true,
        use_geolocation: true,
        school_latitude: null,
        school_longitude: null,
        max_radius_meters: 200,
    },
    isLoadingSettings: false,
    isSettingsDialogOpen: false,
    isScanDialogOpen: false,
    isBarcodeDialogOpen: false,
};

export const useDashboardAttendanceStore = create<AttendanceStore>((set) => ({
    state: initialState,
    setState: (updater) =>
        set((store) => ({
            state: typeof updater === 'function' ? updater(store.state) : { ...store.state, ...updater },
        })),
    resetSelectionOnPeriodChange: (newId) =>
        set((store) => ({
            state: {
                ...store.state,
                selectedSchoolInfoId: newId,
                selectedClassId: '',
                selectedSubject: '',
                selectedMeeting: null,
                students: [],
            },
        })),
    resetSelectionOnClassChange: (newClassId) =>
        set((store) => ({
            state: {
                ...store.state,
                selectedClassId: newClassId,
                selectedSubject: '',
                selectedMeeting: null,
                students: [],
            },
        })),
}));

export default useDashboardAttendanceStore;
