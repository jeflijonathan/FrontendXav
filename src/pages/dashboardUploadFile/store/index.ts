import { create } from "zustand";
import type { UploadFileResponseModel } from "@api/uploadFile/model";

export type FilterType = {
    page: number;
    limit: number;
    sort: string;
    order_by: string;
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

export type DashboardUploadFileStoreStateType = {
    data: UploadFileResponseModel[];
    uploadFile: File | null;
    isLoading: boolean;
    isUploadLoading: boolean;
    filters: FilterType;
    search: SearchType;
    pagination: PaginationType;
}

type StoreType = {
    state: DashboardUploadFileStoreStateType;
    setState: (fn: (p: DashboardUploadFileStoreStateType) => DashboardUploadFileStoreStateType) => void;
}

export const useDashboardUploadFileStore = create<StoreType>((set) => ({
    state: {
        data: [],
        uploadFile: null,
        isLoading: false,
        isUploadLoading: false,
        filters: { page: 1, limit: 10, sort: "created_at", order_by: "desc" },
        search: { value: "" },
        pagination: { total_data: 0, total_pages: 1, page: 1, limit: 10 },
    },
    setState: (fn) => set((prev) => ({ state: fn(prev.state) })),
}));

export default useDashboardUploadFileStore;
