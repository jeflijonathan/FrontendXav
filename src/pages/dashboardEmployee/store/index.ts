import type { EmployeeResponseModel } from "@api/employee/model";
import type { PaginationType } from "@common/types";
import { create } from "zustand";

export type StateType = {
    isLoading: boolean;
    data: EmployeeResponseModel[];
    pagination: PaginationType;
    filters: { sort: string; order_by: string; };
    search: { value: string; };
};

const initialState: StateType = {
    isLoading: false,
    data: [],
    filters: { order_by: "asc", sort: "created_at" },
    pagination: { page: 1, limit: 10, total_items: 0, total_pages: 1 },
    search: { value: "" },
};

export type CreateStateType = {
    state: StateType;
    setState: (updater: Partial<StateType> | ((prev: StateType) => Partial<StateType>)) => void;
};

const useDashboardEmployeeStore = create<CreateStateType>((set) => ({
    state: initialState,
    setState: (updater) => {
        set((prev) => ({
            state: { ...prev.state, ...(typeof updater === "function" ? updater(prev.state) : updater) }
        }));
    },
}));

export default useDashboardEmployeeStore;
