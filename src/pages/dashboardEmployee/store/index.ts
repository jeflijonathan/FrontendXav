import { create } from "zustand";
import type { CreateEmployeeRequestModel, EmployeeResponseModel } from "@api/employee/model";
import type { RoleModel } from "@api/role/model";

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

export type DashboardEmployeeStoreStateType = {
    data: EmployeeResponseModel[];
    createEmployeeReqDetails: CreateEmployeeRequestModel;
    updateEmployeeReqDetails: EmployeeResponseModel | null;
    profileFile: File | null;
    roleUser: RoleModel[];
    detailError: {
        create: { field?: string; message: string }[];
        update: { field?: string; message: string }[];
    };
    isLoading: boolean;
    isCreateLoading: boolean;
    isUpdateLoading: boolean;
    filters: FilterType;
    search: SearchType;
    pagination: PaginationType;
}

type StoreType = {
    state: DashboardEmployeeStoreStateType;
    setState: (fn: (p: DashboardEmployeeStoreStateType) => DashboardEmployeeStoreStateType) => void;
}

export const useDashboardEmployeeStore = create<StoreType>((set) => ({
    state: {
        data: [],
        createEmployeeReqDetails: {} as CreateEmployeeRequestModel,
        updateEmployeeReqDetails: null,
        detailError: {
            create: [] as { field?: string; message: string }[],
            update: [] as { field?: string; message: string }[],
        },
        profileFile: null,
        roleUser: [],
        isLoading: false,
        isCreateLoading: false,
        isUpdateLoading: false,
        filters: { page: 1, limit: 10, sort: "created_at", order_by: "desc", status: "" },
        search: { value: "" },
        pagination: { total_data: 0, total_pages: 1, page: 1, limit: 10 },
    },
    setState: (fn) => set((prev) => ({ state: fn(prev.state) })),
}));

export default useDashboardEmployeeStore;
