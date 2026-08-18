import CategorySubjectService from "@api/categorysubject/service";
import useDashboardCategorySubjectStore from "../../store";
import { filterMapper } from "../utils/filterMapper";
import type { TableHeader } from "@components/Table/TableBody";

const useCategorySubjectList = () => {
    const service = new CategorySubjectService();
    const { state, setState } = useDashboardCategorySubjectStore();

    const tableHeader: TableHeader[] = [
        { label: "NO", width: "w-10" },
        { label: "Name", width: "w-40" },
        { label: "Status", width: "w-20" },
        { label: "Created At", width: "w-40" },
        { label: "Action", width: "w-20" },
    ];

    const tableData = state.data;

    const fetchList = async (params?: any) => {
        setState({ isLoading: true });
        const filterParams = filterMapper({ ...state.filters, ...state.pagination, ...state.search, ...params });

        await service.getCategorySubjectRequest({
            onSuccess: (response) => setState({ data: response.data, pagination: response.pagination, isLoading: false }),
            onError: (err) => { console.error(err); setState({ isLoading: false }); },
        }, filterParams);
    };

    return { fetchList, tableData, tableHeader };
};
export default useCategorySubjectList;
