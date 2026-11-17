import type { StudentResponseModel } from "@api/student/model";
import type { EmployeeResponseModel } from "@api/employee/model";
import { create } from "zustand";

export interface DashboardProfileStateType {
    studentProfileData: StudentResponseModel | null;
    employeeProfileData: EmployeeResponseModel | null;
    error: string[];
    isLoading: boolean;
}

export type StoreType = {
    state: DashboardProfileStateType;
    setState: (
        fn: (
            prev: DashboardProfileStateType
        ) => DashboardProfileStateType
    ) => void;
};

const defaultState: DashboardProfileStateType = {
    studentProfileData: null,
    employeeProfileData: null,
    error: [],
    isLoading: false,
};

export const useDashboardProfileStore = create<StoreType>((set) => ({
    state: defaultState,
    setState: (fn) => set((prev) => ({ state: fn(prev.state) })),
}));

export default useDashboardProfileStore;
