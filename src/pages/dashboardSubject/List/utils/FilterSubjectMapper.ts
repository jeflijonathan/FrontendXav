/**
 * FilterSubjectMapper — Business Logic
 *
 * Maps store state into FilterParams for API request.
 *
 * Layer: Business Logic
 */
import type { FilterParams } from "@common/types";
import type { DashboardSubjectStoreStateType } from "../../store";

export const filterSubjectMapper = (
    state: DashboardSubjectStoreStateType
): FilterParams => {
    return {
        params: {
            page: state.pagination.page,
            limit: state.pagination.limit,
            sort: state.filters.sort,
            order_by: state.filters.order_by,
            value: state.search.value || undefined,
            search: state.search.value || undefined,
            status: state.filters.status !== "" ? state.filters.status : undefined,
            id_category_subject:
                state.filters.id_category_subject !== ""
                    ? state.filters.id_category_subject
                    : undefined,
            id_major:
                state.filters.id_major !== "" ? state.filters.id_major : undefined,
            kelas: state.filters.kelas !== "" ? state.filters.kelas : undefined,
            fase: state.filters.fase !== "" ? state.filters.fase : undefined,
        },
    };
};

export default filterSubjectMapper;
