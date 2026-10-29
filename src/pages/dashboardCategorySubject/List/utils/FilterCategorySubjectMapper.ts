/**
 * FilterCategorySubjectMapper — Business Logic
 *
 * Maps store state into FilterParams for API request.
 *
 * Layer: Business Logic
 */
import type { FilterParams } from "@common/types";
import type { DashboardCategorySubjectStoreStateType } from "../../store";

export const filterCategorySubjectMapper = (
    state: DashboardCategorySubjectStoreStateType
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
        },
    };
};

export default filterCategorySubjectMapper;

