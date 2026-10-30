import useDashboardCategorySubjectStore from "../../store";

const useCategorySubjectFilters = () => {
    const { setState } = useDashboardCategorySubjectStore();

    const handleChangePage = (page: number) => {
        setState((prev) => ({
            ...prev,
            pagination: {
                ...prev.pagination,
                page,
            },
        }));
    };

    const handleFilterLimit = (limit: number) => {
        setState((prev) => ({
            ...prev,
            pagination: {
                ...prev.pagination,
                page: 1,
                limit,
            },
            filters: {
                ...prev.filters,
                limit,
            },
        }));
    };

    const handleSearch = (value: string) => {
        setState((prev) => ({
            ...prev,
            pagination: { ...prev.pagination, page: 1 },
            search: { value },
        }));
    };

    const handleSort = (sort: string) => {
        setState((prev) => ({
            ...prev,
            pagination: { ...prev.pagination, page: 1 },
            filters: {
                ...prev.filters,
                sort,
            },
        }));
    };

    const handleOrder = (order_by: "asc" | "desc") => {
        setState((prev) => ({
            ...prev,
            pagination: { ...prev.pagination, page: 1 },
            filters: {
                ...prev.filters,
                order_by,
            },
        }));
    };

    const handleFilterStatus = (status: string) => {
        setState((prev) => ({
            ...prev,
            pagination: { ...prev.pagination, page: 1 },
            filters: {
                ...prev.filters,
                status,
            },
        }));
    };

    return {
        handleChangePage,
        handleFilterLimit,
        handleSearch,
        handleSort,
        handleOrder,
        handleFilterStatus,
    };
};

export default useCategorySubjectFilters;

