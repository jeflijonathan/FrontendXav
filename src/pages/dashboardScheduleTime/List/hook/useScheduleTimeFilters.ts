import useDashboardScheduleTimeStore from "../../store";

const useScheduleTimeFilters = () => {
    const { setState } = useDashboardScheduleTimeStore();

    const handleChangePage = (page: number) => {
        setState((prev) => ({
            ...prev,
            pagination: { ...prev.pagination, page },
            filters: { ...prev.filters, page },
        }));
    };

    const handleSearch = (value: string) => {
        setState((prev) => ({
            ...prev,
            search: { value },
            filters: { ...prev.filters, search: value, page: 1 },
            pagination: { ...prev.pagination, page: 1 },
        }));
    };

    const handleSort = (sort: string) => {
        setState((prev) => ({
            ...prev,
            filters: { ...prev.filters, sort },
        }));
    };

    const handleOrder = (order_by: "asc" | "desc") => {
        setState((prev) => ({
            ...prev,
            filters: { ...prev.filters, order_by },
        }));
    };

    return {
        handleChangePage,
        handleSearch,
        handleSort,
        handleOrder,
    };
};

export default useScheduleTimeFilters;
