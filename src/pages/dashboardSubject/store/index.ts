/**
 * DashboardSubject Store
 *
 * Layer: Framework Logic (Zustand state store)
 */
import { create } from "zustand";
import type {
    SubjectResponseModel,
    CreateSubjectRequestModel,
} from "@api/subject/model";
import type { CategorySubjectResponseModel } from "@api/categorysubject/model";
import type { MajorResponseModel } from "@api/major/model";

export type FilterType = {
    page: number;
    limit: number;
    sort: string;
    order_by: "asc" | "desc" | string;
    status: string;
    id_category_subject: string;
    id_major: string;
    kelas: string;
    fase: string;
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

export type DashboardSubjectStoreStateType = {
    data: SubjectResponseModel[];
    categories: CategorySubjectResponseModel[];
    majors: MajorResponseModel[];
    createSubjectReqDetails: CreateSubjectRequestModel;
    updateSubjectReqDetails: SubjectResponseModel | null;
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
    state: DashboardSubjectStoreStateType;
    setState: (
        fn: (p: DashboardSubjectStoreStateType) => DashboardSubjectStoreStateType
    ) => void;
};

export const useDashboardSubjectStore = create<StoreType>((set) => ({
    state: {
        data: [],
        categories: [],
        majors: [],
        createSubjectReqDetails: {
            name: "",
            id_category_subject: "",
            id_major: "",
            kelas: "10",
            fase: "E",
            status: true,
        },
        updateSubjectReqDetails: null,
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
            id_category_subject: "",
            id_major: "",
            kelas: "",
            fase: "",
        },
        search: { value: "" },
        pagination: { total_data: 0, total_pages: 1, page: 1, limit: 10 },
    },
    setState: (fn) => set((prev) => ({ state: fn(prev.state) })),
}));

export default useDashboardSubjectStore;
