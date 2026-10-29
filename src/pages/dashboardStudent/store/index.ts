import { create } from "zustand";
import type { CreateStudentRequestModel, StudentResponseModel, RoleStudentModel } from "@api/student/model";

export type FilterType = {
    page: number;
    limit: number;
    sort: string;
    order_by: string;
    status: string;
}

export type SearchType = {
    value: string;
}

export type PaginationType = {
    total_data: number;
    total_pages: number;
    page: number;
    limit: number;
}

export type DashboardStudentStoreStateType = {
    data: StudentResponseModel[];
    roleStudent: RoleStudentModel[];
    createStudentReqDetails: CreateStudentRequestModel;
    updateStudentReqDetails: StudentResponseModel | null;
    profileFile: File | null;
    isLoading: boolean;
    isCreateLoading: boolean;
    isUpdateLoading: boolean;
    filters: FilterType;
    search: SearchType;
    pagination: PaginationType;
}

type StoreType = {
    state: DashboardStudentStoreStateType;
    setState: (fn: (p: DashboardStudentStoreStateType) => DashboardStudentStoreStateType) => void;
}

export const useDashboardStudentStore = create<StoreType>((set) => ({
    state: {
        data: [],
        roleStudent: [],
        createStudentReqDetails: {} as CreateStudentRequestModel,
        updateStudentReqDetails: null,
        profileFile: null,
        isLoading: false,
        isCreateLoading: false,
        isUpdateLoading: false,
        filters: { page: 1, limit: 10, sort: "created_at", order_by: "desc", status: "" },
        search: { value: "" },
        pagination: { total_data: 0, total_pages: 1, page: 1, limit: 10 },
    },
    setState: (fn) => set((prev) => ({ state: fn(prev.state) })),
}));

export default useDashboardStudentStore;
