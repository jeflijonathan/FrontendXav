/**
 * DashboardCategorySubject Store
 *
 * Layer: Framework Logic (Zustand state store)
 */
import { create } from "zustand";
import type {
    CategorySubjectResponseModel,
    CreateCategorySubjectRequestModel,
} from "@api/categorysubject/model";

export type FilterType = {
    page: number;
    limit: number;
    sort: string;
    order_by: "asc" | "desc" | string;
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

export type DashboardCategorySubjectStoreStateType = {
    data: CategorySubjectResponseModel[];
    createCategorySubjectReqDetails: CreateCategorySubjectRequestModel;
    updateCategorySubjectReqDetails: CategorySubjectResponseModel | null;
    isLoading: boolean;
    isCreateLoading: boolean;
    isUpdateLoading: boolean;
    isDetailLoading: boolean;
    isDeleteLoading: boolean;
    filters: FilterType;
    search: SearchType;
    pagination: PaginationType;
};

type StoreType = {
    state: DashboardCategorySubjectStoreStateType;
    setState: (
        fn: (p: DashboardCategorySubjectStoreStateType) => DashboardCategorySubjectStoreStateType
    ) => void;
};

export const useDashboardCategorySubjectStore = create<StoreType>((set) => ({
    state: {
        data: [],
        createCategorySubjectReqDetails: {
            name: "",
            status: true,
        },
        updateCategorySubjectReqDetails: null,
        isLoading: false,
        isCreateLoading: false,
        isUpdateLoading: false,
        isDetailLoading: false,
        isDeleteLoading: false,
        filters: {
            page: 1,
            limit: 10,
            sort: "created_at",
            order_by: "desc",
            status: "",
        },
        search: { value: "" },
        pagination: { total_data: 0, total_pages: 1, page: 1, limit: 10 },
    },
    setState: (fn) => set((prev) => ({ state: fn(prev.state) })),
}));

export default useDashboardCategorySubjectStore;

