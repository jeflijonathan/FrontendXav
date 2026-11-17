import type { FilterParams } from "@common/types";
import type { DashboardEffectiveHoursStateType } from "../store";

export const filterAllocationMapper = (
  state: DashboardEffectiveHoursStateType
): FilterParams => {
  const params: Record<string, any> = {
    page: state.pagination.page,
    limit: state.pagination.limit,
  };

  if (state.search.value) {
    params.search = state.search.value;
  }

  if (state.filters.fase && state.filters.fase !== "all") {
    params.fase = state.filters.fase;
  }

  if (state.filters.rombel && state.filters.rombel !== "all") {
    params.rombel = state.filters.rombel;
  }

  if (state.filters.sort) {
    params.sort = state.filters.sort;
    params.order_by = state.filters.order_by;
  }

  return { params };
};

export default filterAllocationMapper;

