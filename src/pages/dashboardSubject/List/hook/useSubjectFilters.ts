import useDashboardSubjectStore from "../../store";

const useSubjectFilters = () => {
    const { state, setState } = useDashboardSubjectStore();

    const handleChangePage = (page: number) => {
        setState({ pagination: { ...state.pagination, page } });
    };

    const handleSearch = (value: string) => {
        setState({ search: { value }, pagination: { ...state.pagination, page: 1 } });
    };

    const handleSort = (sort: string) => {
        setState({ filters: { ...state.filters, sort } });
    };

    const handleOrder = (order_by: "asc" | "desc") => {
        setState({ filters: { ...state.filters, order_by } });
    };

    return { handleChangePage, handleSearch, handleSort, handleOrder };
};

export default useSubjectFilters;
