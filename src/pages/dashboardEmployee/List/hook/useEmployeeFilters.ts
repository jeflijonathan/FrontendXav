import { filterEmployeeMapper } from "../utils/FilterEmployeeMapper";
import useDashboardEmployeeStore from "../../store";
import useEmployeeList from "./useEmployeeList";
import type { FilterType } from "../../store";

const useEmployeeFilters = () => {
    const { setState, state } = useDashboardEmployeeStore();
    const { fetchEmployeeList } = useEmployeeList();

    const handleChangePage = async (page: number) => {
        const newFilters: FilterType = { ...state.filters, page };
        setState((prev) => ({
            ...prev,
            pagination: { ...prev.pagination, page },
            filters: newFilters,
        }));
        return await fetchEmployeeList(
            filterEmployeeMapper({ ...state, filters: newFilters, pagination: { ...state.pagination, page } })
        );
    };

    // handleSearch hanya update state; EmployeeTable.useEffect akan trigger fetch
    // karena dia memantau state.search.value sebagai dependency
    const handleSearch = (value: string) => {
        setState((prev) => ({
            ...prev,
            search: { value },
            filters: { ...prev.filters, page: 1 },
            pagination: { ...prev.pagination, page: 1 },
        }));
    };

    const handleSort = async (sort: string) => {
        const newFilters: FilterType = { ...state.filters, sort };
        setState((prev) => ({ ...prev, filters: newFilters }));
        return await fetchEmployeeList(
            filterEmployeeMapper({ ...state, filters: newFilters })
        );
    };

    const handleOrder = async (order_by: "asc" | "desc") => {
        const newFilters: FilterType = { ...state.filters, order_by };
        setState((prev) => ({ ...prev, filters: newFilters }));
        return await fetchEmployeeList(
            filterEmployeeMapper({ ...state, filters: newFilters })
        );
    };

    return { handleChangePage, handleSearch, handleSort, handleOrder };
};

export default useEmployeeFilters;
