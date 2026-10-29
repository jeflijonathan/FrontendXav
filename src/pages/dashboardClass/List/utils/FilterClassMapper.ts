import type { FilterParams } from "@common/types";
import type { DashboardClassStoreStateType } from "../../store";

export const filterClassMapper = (state: Partial<DashboardClassStoreStateType>): FilterParams => {
    const params: Record<string, any> = {
        page: state.pagination?.page ?? state.filters?.page ?? 1,
        limit: state.pagination?.limit ?? state.filters?.limit ?? 10,
    };

    if (state.filters?.sort) params.sort = state.filters.sort;
    if (state.filters?.order_by) params.order_by = state.filters.order_by;
    if (state.filters?.status !== undefined && state.filters?.status !== "") {
        params.status = state.filters.status;
    }
    if (state.filters?.id_school_information) {
        params.id_school_information = state.filters.id_school_information;
    }
    if (state.filters?.kelas) params.kelas = state.filters.kelas;
    if (state.filters?.id_major) params.id_major = state.filters.id_major;
    if (state.search?.value) params.value = state.search.value;

    return { params };
};
