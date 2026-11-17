import { create } from "zustand";
import type {
    TeachingClassRowModel,
    TeachingPeriodModel,
    TeachingSubjectRowModel,
    TeachingTeacherRowModel,
} from "@api/teaching/model";
import type { EmployeeResponseModel } from "@api/employee/model";
import type { SubjectResponseModel } from "@api/subject/model";
import type { ClassResponseModel } from "@api/class/model";
import type { SchoolInformationResponseModel } from "@api/schoolinformation/model";
import type { EffectiveWeekResponseModel } from "@api/effectiveweek/model";

export type TeachingFilterType = {
    page: number;
    limit: number;
    sort: string;
    order_by: "asc" | "desc";
    periode: string;
};

export type TeachingSearchType = {
    value: string;
};

export type TeachingPaginationType = {
    total_data: number;
    total_pages: number;
    page: number;
    limit: number;
};

/** Satu baris penugasan: guru + mapel + kelas + periode. */
export type TeachingRowSeed = {
    teacher: TeachingTeacherRowModel;
    subject: TeachingSubjectRowModel;
    placement: TeachingClassRowModel;
};

/** Nilai awal saat membuka form tambah dari baris tabel. */
export type TeachingAssignmentPreset = {
    id_teacher?: string;
    id_subject?: string;
    id_school_information?: string;
};

export type DashboardTeachingStoreStateType = {
    data: TeachingTeacherRowModel[];
    periods: TeachingPeriodModel[];
    employees: EmployeeResponseModel[];
    subjects: SubjectResponseModel[];
    classes: ClassResponseModel[];
    schoolInformations: SchoolInformationResponseModel[];
    effectiveWeeks: EffectiveWeekResponseModel[];
    isLoading: boolean;
    isSubmitting: boolean;
    filters: TeachingFilterType;
    search: TeachingSearchType;
    pagination: TeachingPaginationType;
};

type StoreType = {
    state: DashboardTeachingStoreStateType;
    setState: (
        fn: (prev: DashboardTeachingStoreStateType) => DashboardTeachingStoreStateType
    ) => void;
};

export const useDashboardTeachingStore = create<StoreType>((set) => ({
    state: {
        data: [],
        periods: [],
        employees: [],
        subjects: [],
        classes: [],
        schoolInformations: [],
        effectiveWeeks: [],
        isLoading: false,
        isSubmitting: false,
        filters: {
            page: 1,
            limit: 10,
            sort: "",
            order_by: "asc",
            periode: "",
        },
        search: { value: "" },
        pagination: { total_data: 0, total_pages: 1, page: 1, limit: 10 },
    },
    setState: (fn) => set((prev) => ({ state: fn(prev.state) })),
}));

export default useDashboardTeachingStore;
