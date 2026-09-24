import SubjectService from "@api/subject/service";
import useDashboardSubjectStore from "../../store";
import { filterMapper } from "../utils/filterMapper";
import type { TableHeader } from "@components/Table/TableBody";

const useSubjectList = () => {
    const service = new SubjectService();
    const { state, setState } = useDashboardSubjectStore();

    const tableHeader: TableHeader[] = [
        { label: "NO", width: "w-10" },
        { label: "ID", width: "w-40" },
        { label: "Created At", width: "w-40" },
        { label: "Action", width: "w-20" },
    ];

    const tableData = state.data;

    const fetchList = async (params?: any) => {
        setState({ isLoading: true });
        const filterParams = filterMapper({
            ...state.filters,
            ...state.pagination,
            ...state.search,
            ...params,
        });

        await service.getSubjectRequest(
            {
                onSuccess: (response) => {
                    setState({ data: response.data, pagination: response.pagination, isLoading: false });
                },
                onError: (err: any) => {
                    console.error(err);
                    setState({ isLoading: false });
                },
            },
            filterParams
        );
    };

    return { fetchList, tableData, tableHeader };
};

export default useSubjectList;
