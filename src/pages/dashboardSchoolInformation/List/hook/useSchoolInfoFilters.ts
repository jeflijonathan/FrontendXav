import { filterSchoolInformationMapper } from "../utils/FilterSchoolInformationMapper";
import useDashboardSchoolInformationStore from "../../store";
import useSchoolInfoList from "./useSchoolInfoList";
import useDebouncer from "@utils/useDebouncer";

const useSchoolInfoFilters = () => {
    const { setState, state } = useDashboardSchoolInformationStore();
    const { fetchSchoolInfoList } = useSchoolInfoList();

    const handleChangePage = async (page: number) => {
        setState((prev) => ({
            ...prev,
            pagination: { ...prev.pagination, page },
            filters: { ...prev.filters, page },
        }));

        return await fetchSchoolInfoList(filterSchoolInformationMapper(state))
    };

    const handleSearch = async (value: string) => {
        const debouncedSearch = useDebouncer(value, 500);

        setState((prev) => ({
            ...prev,
            search: { value },
            filters: { ...prev.filters, search: debouncedSearch, page: 1 },
            pagination: { ...prev.pagination, page: 1 },
        }));

        return await fetchSchoolInfoList(filterSchoolInformationMapper(state))
    };

    const handleSort = async (sort: string) => {
        setState((prev) => ({
            ...prev,
            filters: { ...prev.filters, sort },
        }));

        return await fetchSchoolInfoList(filterSchoolInformationMapper(state))
    };

    const handleOrder = async (order_by: "asc" | "desc") => {
        setState((prev) => ({
            ...prev,
            filters: { ...prev.filters, order_by },
        }));

        return await fetchSchoolInfoList(filterSchoolInformationMapper(state))
    };

    return {
        handleChangePage,
        handleSearch,
        handleSort,
        handleOrder,
    };
};

export default useSchoolInfoFilters;
