import { create } from "zustand";
import type { ClassResponseModel, CreateClassRequestModel, StudentInClassModel } from "@api/class/model";
import type { MajorResponseModel } from "@api/major/model";
import type { EmployeeResponseModel } from "@api/employee/model";
import type { SchoolInformationResponseModel } from "@api/schoolinformation/model";

export type FilterType = {
    page: number;
    limit: number;
    sort: string;
    order_by: string;
    status: string;
    id_school_information: string;
    kelas: string;
    id_major: string;
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

export type DashboardClassStoreStateType = {
    data: ClassResponseModel[];
    createClassReqDetails: CreateClassRequestModel;
    updateClassReqDetails: ClassResponseModel | null;
    majors: MajorResponseModel[];
    employees: EmployeeResponseModel[];
    schoolInformations: SchoolInformationResponseModel[];
    detailError: {
        create: { field?: string; message: string }[];
        update: { field?: string; message: string }[];
    };
    isLoading: boolean;
    isCreateLoading: boolean;
    isUpdateLoading: boolean;
    isDetailLoading: boolean;

    manageStudent: {
        data: StudentInClassModel[];
        List: boolean,
        add: boolean,
        remove: boolean,
    },

    filters: FilterType;
    search: SearchType;
    pagination: PaginationType;
};

type StoreType = {
    state: DashboardClassStoreStateType;
    setState: (fn: (p: DashboardClassStoreStateType) => DashboardClassStoreStateType) => void;
};

export const useDashboardClassStore = create<StoreType>((set) => ({
    state: {
        data: [],
        createClassReqDetails: {
            id_major: "",
            id_class_guardian: "",
            id_school_information: "",
            kelas: "10",
            name: "",
            status: true,
        },
        updateClassReqDetails: null,
        majors: [],
        employees: [],
        schoolInformations: [],
        detailError: {
            create: [],
            update: [],
        },

        isLoading: false,
        isCreateLoading: false,
        isUpdateLoading: false,
        isDetailLoading: false,

        manageStudent: {
            data: [],
            List: false,
            add: false,
            remove: false,
        },
        filters: {
            page: 1,
            limit: 10,
            sort: "created_at",
            order_by: "desc",
            status: "",
            id_school_information: "",
            kelas: "",
            id_major: "",
        },
        search: { value: "" },
        pagination: { total_data: 0, total_pages: 1, page: 1, limit: 10 },
    },
    setState: (fn) => set((prev) => ({ state: fn(prev.state) })),
}));

export default useDashboardClassStore;
