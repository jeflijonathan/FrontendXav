import type { FilterParams } from "@common/types";
import type { DashboardEmployeeStoreStateType } from "../../store";

export const filterEmployeeMapper = (
    state: Partial<DashboardEmployeeStoreStateType>
): FilterParams => {
    return {
        params: {
            sort: state.filters?.sort,
            order_by: state.filters?.order_by,
            status: state.filters?.status,
            page: state.pagination?.page ?? state.filters?.page,
            limit: state.pagination?.limit ?? state.filters?.limit,
            value: state.search?.value,
        },
    };
};
