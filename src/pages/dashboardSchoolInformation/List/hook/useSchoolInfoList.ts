import useDashboardSchoolInformationStore from "../../store";
import SchoolInformationService from "@api/schoolinformation/service";
import type { FilterParams, SortOptionType } from "@common/types";
import type { TableHeaderType } from "@components/Table/TableBody";
import type { SchoolInformationResponseModel } from "@api/schoolinformation/model";
import EmployeeService from "@api/employee/service";
import { snackbar } from "@utils/snackbar";


type ReturnHook = {
    statusData: Record<number, { label: string, color: "success" | "error" }>;
    tableData: SchoolInformationResponseModel[];
    schoolInfoHeaders: TableHeaderType[];
    sortOptions: SortOptionType[];
    fetchSchoolInfoList: (FilterParms?: FilterParams) => Promise<void>;
    fetchEmployeeOptions: (FilterParams?: FilterParams) => Promise<void>;
}

const useSchoolInfoList = (): ReturnHook => {
    const { state, setState } = useDashboardSchoolInformationStore();
    const service = new SchoolInformationService();
    const employeeService = new EmployeeService();

    const fetchSchoolInfoList = async (FilterParms?: FilterParams) => {
        setState((prev) => ({ ...prev, isLoading: true }));
        return await service.getAll({
            onSuccess: (res: any) => {
                setState((prev) => ({
                    ...prev,
                    data: res.data || [],
                    pagination: res.pagination,
                }));
            }, onError: (err: any) => {
                snackbar.error(err.message || "Failed to fetch school informations")
            }, onFullfilled: () => {
                setState((prev) => ({ ...prev, isLoading: false }))
            }
        }, FilterParms);
    };

    const fetchEmployeeOptions = async (FilterParams?: FilterParams) => {
        return await employeeService.getEmployeeRequest({
            onSuccess: (res: any) => {
                setState((prev) => ({
                    ...prev,
                    employees: res.data || [],
                }));
            }, onError: (err: any) => {
                snackbar.error(err.message || "Failed to fetch employees")
            }
        }, FilterParams);
    };


    const schoolInfoHeaders: TableHeaderType[] = [
        { label: "Periode", width: "120px" },
        { label: "School Name", width: "200px" },
        { label: "NPSN", width: "150px" },
        { label: "Headmaster", width: "180px" },
        { label: "Status", width: "120px" },
        { label: "Created At", width: "150px" },
        { label: "Updated At", width: "150px" },
        { label: "Alamat Sekolah", width: "200px" },
    ];

    const sortOptions: SortOptionType[] = [
        { label: "School Name", value: "name_school" },
        { label: "Created At", value: "created_at" },
    ];

    const statusData: Record<number, { label: string, color: "success" | "error" }> = {
        1: {
            label: "Aktif",
            color: "success"
        },
        0: {
            label: "Non Aktif",
            color: "error"
        },
    }

    return {
        statusData,
        tableData: state.data,
        schoolInfoHeaders,
        sortOptions,
        fetchSchoolInfoList,
        fetchEmployeeOptions
    };
};

export default useSchoolInfoList;
