import { create } from "zustand";
import type { CreateMajorRequestModel, MajorResponseModel } from "@api/major/model";

export type FilterType = {
    page: number;
    limit: number;
    sort: string;
    order_by: string;
    status: string;
};

export type SearchType = {
    value: string;
};

export type PaginationType = {
    total_data: number;
    total_pages: number;
    page: number;
    limit: number;
};

export type DashboardMajorStoreStateType = {
    data: MajorResponseModel[];
    createMajorReqDetails: CreateMajorRequestModel;
    updateMajorReqDetails: MajorResponseModel | null;
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
};

type StoreType = {
    state: DashboardMajorStoreStateType;
    setState: (fn: (p: DashboardMajorStoreStateType) => DashboardMajorStoreStateType) => void;
};

export const useDashboardMajorStore = create<StoreType>((set) => ({
    state: {
        data: [],
        createMajorReqDetails: {
            name: "",
            status: true,
        },
        updateMajorReqDetails: null,
        detailError: {
            create: [],
            update: [],
        },
        isLoading: false,
        isCreateLoading: false,
        isUpdateLoading: false,
        filters: { page: 1, limit: 10, sort: "created_at", order_by: "desc", status: "" },
        search: { value: "" },
        pagination: { total_data: 0, total_pages: 1, page: 1, limit: 10 },
    },
    setState: (fn) => set((prev) => ({ state: fn(prev.state) })),
}));

export default useDashboardMajorStore;
