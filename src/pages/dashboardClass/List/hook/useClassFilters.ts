import { useDashboardClassStore } from "../../store";

const useClassFilters = () => {
    const { setState } = useDashboardClassStore();

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

    const handleFilterPeriode = async (id_school_information: string) => {
        setState((prev) => ({
            ...prev,
            filters: { ...prev.filters, id_school_information, page: 1 },
            pagination: { ...prev.pagination, page: 1 },
        }));
    };

    const handleFilterKelas = async (kelas: string) => {
        setState((prev) => ({
            ...prev,
            filters: { ...prev.filters, kelas, page: 1 },
            pagination: { ...prev.pagination, page: 1 },
        }));
    };

    const handleFilterMajor = async (id_major: string) => {
        setState((prev) => ({
            ...prev,
            filters: { ...prev.filters, id_major, page: 1 },
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

    const handleFilterLimit = async (limit: number) => {
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
        handleFilterKelas,
        handleFilterMajor,
        handleFilterStatus,
        handleFilterLimit,
    };
};

export default useClassFilters;
