/**
 * useSubjectFilters — Framework Logic Hook
 *
 * Handles pagination page/limit and search/sort/filter changes.
 *
 * Layer: Framework Logic
 */
import useDashboardSubjectStore from "../../store";
import { calculateFase } from "../utils/subjectHelper";

const useSubjectFilters = () => {
    const { setState } = useDashboardSubjectStore();

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

    const handleFilterCategory = (id_category_subject: string) => {
        setState((prev) => ({
            ...prev,
            pagination: { ...prev.pagination, page: 1 },
            filters: {
                ...prev.filters,
                id_category_subject,
            },
        }));
    };

    const handleFilterMajor = (id_major: string) => {
        setState((prev) => ({
            ...prev,
            pagination: { ...prev.pagination, page: 1 },
            filters: {
                ...prev.filters,
                id_major,
            },
        }));
    };

    const handleFilterKelas = (kelas: string) => {
        const derivedFase = calculateFase(kelas);
        setState((prev) => ({
            ...prev,
            pagination: { ...prev.pagination, page: 1 },
            filters: {
                ...prev.filters,
                kelas,
                fase: derivedFase,
            },
        }));
    };

    const handleFilterFase = (fase: string) => {
        setState((prev) => ({
            ...prev,
            pagination: { ...prev.pagination, page: 1 },
            filters: {
                ...prev.filters,
                fase,
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
        handleFilterCategory,
        handleFilterMajor,
        handleFilterKelas,
        handleFilterFase,
        handleFilterStatus,
    };
};

export default useSubjectFilters;
