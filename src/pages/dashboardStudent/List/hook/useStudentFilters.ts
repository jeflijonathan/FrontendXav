import { filterStudentMapper } from "../utils/FilterStudentMapper";
import useDashboardStudentStore from "../../store";
import useStudentList from "./useStudentList";
import useDebouncer from "@utils/useDebouncer";

const useStudentFilters = () => {
    const { setState, state } = useDashboardStudentStore();
    const { fetchStudentList } = useStudentList();

    const handleChangePage = async (page: number) => {
        setState((prev) => ({
            ...prev,
            pagination: { ...prev.pagination, page },
            filters: { ...prev.filters, page },
        }));
        return await fetchStudentList(filterStudentMapper(state));
    };

    const handleSearch = async (value: string) => {
        const debouncedSearch = useDebouncer(value, 500);
        setState((prev) => ({
            ...prev,
            search: { value },
            filters: { ...prev.filters, search: debouncedSearch, page: 1 },
            pagination: { ...prev.pagination, page: 1 },
        }));
        return await fetchStudentList(filterStudentMapper(state));
    };

    const handleSort = async (sort: string) => {
        setState((prev) => ({ ...prev, filters: { ...prev.filters, sort } }));
        return await fetchStudentList(filterStudentMapper(state));
    };

    const handleOrder = async (order_by: "asc" | "desc") => {
        setState((prev) => ({ ...prev, filters: { ...prev.filters, order_by } }));
        return await fetchStudentList(filterStudentMapper(state));
    };

    return { handleChangePage, handleSearch, handleSort, handleOrder };
};

export default useStudentFilters;
