import { create } from "zustand";
import { type SchoolInformationResponseModel } from "@api/schoolinformation/model";
interface FilterType { page: number; limit: number; search: string; sort: string; order_by: string; }
interface PaginationType { total_data: number; total_pages: number; page: number; limit: number; }

interface State {
    data: SchoolInformationResponseModel[];
    isLoading: boolean;
    filters: FilterType;
    search: { value: string };
    pagination: PaginationType;
}

const useStore = create<{ state: State; setState: (fn: (p: State) => State) => void }>((set) => ({
    state: {
        data: [],
        isLoading: false,
        filters: { page: 1, limit: 10, search: "", sort: "created_at", order_by: "desc" },
        search: { value: "" },
        pagination: { total_data: 0, total_pages: 1, page: 1, limit: 10 },
    },
    setState: (fn) => set((prev) => ({ state: fn(prev.state) })),
}));

export default useStore;
