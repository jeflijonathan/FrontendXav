import type { FilterParams } from "@common/types";
import type { DashboardUploadFileStoreStateType } from "../../store";

export const filterUploadFileMapper = (
    state: Partial<DashboardUploadFileStoreStateType>
): FilterParams => {
    return {
        params: {
            sort: state.filters?.sort,
            order_by: state.filters?.order_by,
            page: state.pagination?.page ?? state.filters?.page,
            limit: state.pagination?.limit ?? state.filters?.limit,
            value: state.search?.value,
        },
    };
};
