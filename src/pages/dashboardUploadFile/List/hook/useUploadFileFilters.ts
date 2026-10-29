import { filterUploadFileMapper } from "../utils/FilterUploadFileMapper";
import useDashboardUploadFileStore from "../../store";
import useUploadFileList from "./useUploadFileList";
import type { FilterType } from "../../store";

const useUploadFileFilters = () => {
    const { setState, state } = useDashboardUploadFileStore();
    const { fetchUploadFileList } = useUploadFileList();

    const handleChangePage = async (page: number) => {
        const newFilters: FilterType = { ...state.filters, page };
        setState((prev) => ({
            ...prev,
            pagination: { ...prev.pagination, page },
            filters: newFilters,
        }));
        return await fetchUploadFileList(
            filterUploadFileMapper({ ...state, filters: newFilters, pagination: { ...state.pagination, page } })
        );
    };

    // handleSearch hanya update state; UploadFileTable.useEffect akan trigger fetch
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
        return await fetchUploadFileList(
            filterUploadFileMapper({ ...state, filters: newFilters })
        );
    };

    const handleOrder = async (order_by: "asc" | "desc") => {
        const newFilters: FilterType = { ...state.filters, order_by };
        setState((prev) => ({ ...prev, filters: newFilters }));
        return await fetchUploadFileList(
            filterUploadFileMapper({ ...state, filters: newFilters })
        );
    };

    return { handleChangePage, handleSearch, handleSort, handleOrder };
};

export default useUploadFileFilters;
