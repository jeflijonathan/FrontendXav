import EmployeeService from "@api/employee/service";
import useDashboardEmployeeStore from "../../store";
import { filterMapper } from "../utils/filterMapper";
import type { TableHeader } from "@components/Table/TableBody";

const useEmployeeList = () => {
    const service = new EmployeeService();
    const { state, setState } = useDashboardEmployeeStore();

    const tableHeader: TableHeader[] = [
        { label: "NO", width: "w-10" },
        { label: "Name", width: "w-40" },
        { label: "Email", width: "w-40", className: "hidden md:table-cell" },
        { label: "Gender", width: "w-20", className: "hidden md:table-cell" },
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

        await service.getEmployeeRequest(
            {
                onSuccess: (response) => {
                    setState({ data: response.data, pagination: response.pagination, isLoading: false });
                },
                onError: (err) => {
                    console.error(err);
                    setState({ isLoading: false });
                },
            },
            filterParams
        );
    };

    return { fetchList, tableData, tableHeader };
};

export default useEmployeeList;
