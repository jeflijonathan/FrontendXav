import type { FilterParams } from "@common/types";
import type { DashboardSchoolInformationStoreStateType } from "../../store";

export const filterSchoolInformationMapper = (
    state: Partial<DashboardSchoolInformationStoreStateType>
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