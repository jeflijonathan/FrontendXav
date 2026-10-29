import { create } from "zustand";
import type { AnnouncementCreateModel, AnnouncementResponseModel } from "@api/announcement/model";

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

export type DashboardAnnouncementStoreStateType = {
    data: AnnouncementResponseModel[];
    createAnnouncementReqDetails: AnnouncementCreateModel;
    updateAnnouncementReqDetails: AnnouncementResponseModel | null;
    isLoading: boolean;
    isCreateLoading: boolean;
    isUpdateLoading: boolean;
    filters: FilterType;
    search: SearchType;
    pagination: PaginationType;
}

type StoreType = {
    state: DashboardAnnouncementStoreStateType;
    setState: (fn: (p: DashboardAnnouncementStoreStateType) => DashboardAnnouncementStoreStateType) => void;
}

export const useDashboardAnnouncementStore = create<StoreType>((set) => ({
    state: {
        data: [],
        createAnnouncementReqDetails: {} as AnnouncementCreateModel,
        updateAnnouncementReqDetails: null,
        isLoading: false,
        isCreateLoading: false,
        isUpdateLoading: false,
        filters: { page: 1, limit: 10, sort: "created_at", order_by: "desc", status: "" },
        search: { value: "" },
        pagination: { total_data: 0, total_pages: 1, page: 1, limit: 10 },
    },
    setState: (fn) => set((prev) => ({ state: fn(prev.state) })),
}));

export default useDashboardAnnouncementStore;