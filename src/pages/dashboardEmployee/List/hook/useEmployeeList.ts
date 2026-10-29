import useDashboardEmployeeStore from "../../store";
import EmployeeService from "@api/employee/service";
import { useSnackbar } from "notistack";
import type { FilterParams, SortOptionType } from "@common/types";
import type { TableHeaderType } from "@components/Table/TableBody";
import type { EmployeeResponseModel } from "@api/employee/model";

type ReturnHook = {
    statusData: Record<number, { label: string; color: "success" | "error" }>;
    tableData: EmployeeResponseModel[];
    employeeHeaders: TableHeaderType[];
    sortOptions: SortOptionType[];
    fetchEmployeeList: (filterParams?: FilterParams) => Promise<void>;
}

const useEmployeeList = (): ReturnHook => {
    const { enqueueSnackbar } = useSnackbar();
    const { state, setState } = useDashboardEmployeeStore();
    const service = new EmployeeService();

    const fetchEmployeeList = async (filterParams?: FilterParams) => {
        setState((prev) => ({ ...prev, isLoading: true }));
        return await service.getAll({
            onSuccess: (res: any) => {
                setState((prev) => ({
                    ...prev,
                    data: res.data || [],
                    pagination: res.pagination,
                    isLoading: false,
                }));
            },
            onError: (err: any) => {
                enqueueSnackbar(err.message || "Failed to fetch employees", { variant: "error" });
                setState((prev) => ({ ...prev, isLoading: false }));
            },
        }, filterParams);
    };

    const employeeHeaders: TableHeaderType[] = [
        { label: "NIY", width: "120px" },
        { label: "Photo", width: "80px" },
        { label: "Name", width: "200px" },
        { label: "Roles", width: "180px" },
        { label: "Email", width: "200px" },
        { label: "Phone", width: "150px" },
        { label: "Gender", width: "100px" },
        { label: "Status", width: "100px" },
        { label: "Created At", width: "150px" },
    ];

    const sortOptions: SortOptionType[] = [
        { label: "Name", value: "first_name" },
        { label: "NIY", value: "niy" },
        { label: "Created At", value: "created_at" },
    ];

    const statusData: Record<number, { label: string; color: "success" | "error" }> = {
        1: { label: "Aktif", color: "success" },
        0: { label: "Non Aktif", color: "error" },
    };

    return {
        statusData,
        tableData: state.data,
        employeeHeaders,
        sortOptions,
        fetchEmployeeList,
    };
};

export default useEmployeeList;
