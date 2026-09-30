import { create } from "zustand";
import { type CreateSchoolInformationRequest, type SchoolInformationResponseModel } from "@api/schoolinformation/model";
import type { EmployeeResponseModel } from "@api/employee/model";

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

export type DashboardSchoolInformationStoreStateType = {
    data: SchoolInformationResponseModel[];
    createSchoolInfoReqDetails: CreateSchoolInformationRequest;
    updateSchoolInfoReqDetails: SchoolInformationResponseModel | null;
    employees: EmployeeResponseModel[];
    filterEmployee: FilterType;
    isLoading: boolean;
    isCreateLoading: boolean;
    isUpdateLoading: boolean;
    filters: FilterType;
    search: SearchType;
    pagination: PaginationType;
}

type StoreType = {
    state: DashboardSchoolInformationStoreStateType;
    setState: (fn: (p: DashboardSchoolInformationStoreStateType) => DashboardSchoolInformationStoreStateType) => void;
}

export const useDashboardSchoolInformationStore = create<StoreType>((set) => ({
    state: {
        data: [],
        createSchoolInfoReqDetails: {} as CreateSchoolInformationRequest,
        updateSchoolInfoReqDetails: null,
        employees: [],
        filterEmployee: { page: 1, limit: 15, sort: "created_at", order_by: "desc", status: "" },
        isLoading: false,
        isCreateLoading: false,
        isUpdateLoading: false,
        filters: { page: 1, limit: 10, sort: "created_at", order_by: "desc", status: "" },
        search: { value: "" },
        pagination: { total_data: 0, total_pages: 1, page: 1, limit: 10 },
    },
    setState: (fn) => set((prev) => ({ state: fn(prev.state) })),
}));

export default useDashboardSchoolInformationStore;