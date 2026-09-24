import StudentService from "@api/student/service";
import useDashboardStudentStore from "../../store";
import { filterMapper } from "../utils/filterMapper";
import type { TableHeader } from "@components/Table/TableBody";

const useStudentList = () => {
    const service = new StudentService();
    const { state, setState } = useDashboardStudentStore();

    const tableHeader: TableHeader[] = [
        { label: "NO", width: "w-10" },
        { label: "Name", width: "w-40" },
        { label: "NIS", width: "w-32", className: "hidden md:table-cell" },
        { label: "Gender", width: "w-20", className: "hidden lg:table-cell" },
        { label: "Created At", width: "w-40", className: "hidden lg:table-cell" },
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

        await service.getStudentRequest(
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

export default useStudentList;
