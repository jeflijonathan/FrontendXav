import { useDashboardTeachingStore } from "../../store";

const useTeachingFilters = () => {
    const { setState } = useDashboardTeachingStore();

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
            pagination: { ...prev.pagination, page: 1 },
            filters: { ...prev.filters, page: 1 },
        }));
    };

    const handleSort = (sort: string) => {
        setState((prev) => ({
            ...prev,
            filters: { ...prev.filters, sort, page: 1 },
            pagination: { ...prev.pagination, page: 1 },
        }));
    };

    const handleOrder = (order_by: "asc" | "desc") => {
        setState((prev) => ({
            ...prev,
            filters: { ...prev.filters, order_by, page: 1 },
            pagination: { ...prev.pagination, page: 1 },
        }));
    };

    const handleFilterPeriode = (periode: string) => {
        setState((prev) => ({
            ...prev,
            filters: { ...prev.filters, periode, page: 1 },
            pagination: { ...prev.pagination, page: 1 },
        }));
    };

    const handleFilterLimit = (limit: number) => {
        setState((prev) => ({
            ...prev,
            filters: { ...prev.filters, limit, page: 1 },
            pagination: { ...prev.pagination, limit, page: 1 },
        }));
    };

    return {
        handleChangePage,
        handleSearch,
        handleSort,
        handleOrder,
        handleFilterPeriode,
        handleFilterLimit,
    };
};

export default useTeachingFilters;
