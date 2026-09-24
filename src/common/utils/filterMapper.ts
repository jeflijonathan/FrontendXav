import type { FilterParams } from "@common/types";

export const filterMapper = (state: any): FilterParams => ({
    params: {
        page: state.page ?? 1,
        limit: state.limit ?? 10,
        sort: state.sort ?? "created_at",
        order_by: state.order_by ?? "asc",
        value: state.value ?? "",
    },
});
