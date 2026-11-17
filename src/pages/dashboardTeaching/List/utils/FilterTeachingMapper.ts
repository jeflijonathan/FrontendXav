import type { FilterParams } from "@common/types";
import type { DashboardTeachingStoreStateType } from "../../store";

/**
 * Ubah state filter menjadi query params endpoint `/teaching-staff`.
 * Filter periode dikirim sebagai string `periode` (mis. "2025/2026").
 */
export const filterTeachingMapper = (
    state: Partial<DashboardTeachingStoreStateType>
): FilterParams => {
    const params: Record<string, string | number | boolean> = {
        page: state.pagination?.page ?? state.filters?.page ?? 1,
        limit: state.pagination?.limit ?? state.filters?.limit ?? 10,
    };

    if (state.filters?.sort) params.sort = state.filters.sort;
    if (state.filters?.order_by) params.order_by = state.filters.order_by;
    if (state.filters?.periode) params.periode = state.filters.periode;
    if (state.search?.value) params.value = state.search.value;

    return { params };
};
