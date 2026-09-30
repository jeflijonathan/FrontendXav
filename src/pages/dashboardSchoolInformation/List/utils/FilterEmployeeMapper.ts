import type { FilterParams } from "@common/types";
import type { DashboardSchoolInformationStoreStateType } from "../../store";

export const filterEmployeeMapper = (
    state: Partial<DashboardSchoolInformationStoreStateType>
): FilterParams => {
    return {
        params: {
            sort: state.filterEmployee?.sort,
            order_by: state.filterEmployee?.order_by,
            status: state.filterEmployee?.status,
            page: state.pagination?.page ?? state.filterEmployee?.page,
            limit: state.pagination?.limit ?? state.filterEmployee?.limit,
            value: state.search?.value,
        },
    };
};