import { useDashboardMajorStore } from "../../store";

const useMajorFilters = () => {
    const { setState } = useDashboardMajorStore();

    const handleChangePage = async (page: number) => {
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

    const handleSort = async (sort: string) => {
        setState((prev) => ({
            ...prev,
            filters: { ...prev.filters, sort, page: 1 },
            pagination: { ...prev.pagination, page: 1 },
        }));
    };

    const handleOrder = async (order_by: "asc" | "desc") => {
        setState((prev) => ({
            ...prev,
            filters: { ...prev.filters, order_by, page: 1 },
            pagination: { ...prev.pagination, page: 1 },
        }));
    };

    const handleFilterStatus = async (status: string) => {
        setState((prev) => ({
            ...prev,
            filters: { ...prev.filters, status, page: 1 },
            pagination: { ...prev.pagination, page: 1 },
        }));
    };

    return {
        handleChangePage,
        handleSearch,
        handleSort,
        handleOrder,
        handleFilterStatus,
    };
};

export default useMajorFilters;
