import useDashboardStudentStore from "../../store";
import StudentService from "@api/student/service";
import { useSnackbar } from "notistack";
import type { FilterParams, SortOptionType } from "@common/types";
import type { TableHeaderType } from "@components/Table/TableBody";
import type { StudentResponseModel } from "@api/student/model";

type ReturnHook = {
    statusData: Record<number, { label: string; color: "success" | "error" }>;
    tableData: StudentResponseModel[];
    studentHeaders: TableHeaderType[];
    sortOptions: SortOptionType[];
    fetchStudentList: (filterParams?: FilterParams) => Promise<void>;
}

const useStudentList = (): ReturnHook => {
    const { enqueueSnackbar } = useSnackbar();
    const { state, setState } = useDashboardStudentStore();
    const service = new StudentService();

    const fetchStudentList = async (filterParams?: FilterParams) => {
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
                enqueueSnackbar(err.message || "Failed to fetch students", { variant: "error" });
                setState((prev) => ({ ...prev, isLoading: false }));
            },
        }, filterParams);
    };

    const studentHeaders: TableHeaderType[] = [
        { label: "NIS", width: "120px" },
        { label: "NISN", width: "120px" },
        { label: "Name", width: "180px" },
        { label: "Role", width: "160px" },
        { label: "Phone", width: "150px" },
        { label: "Gender", width: "100px" },
        { label: "Status", width: "100px" },
        { label: "Created At", width: "140px" },
    ];

    const sortOptions: SortOptionType[] = [
        { label: "Name", value: "first_name" },
        { label: "NIS", value: "nis" },
        { label: "Created At", value: "created_at" },
    ];

    const statusData: Record<number, { label: string; color: "success" | "error" }> = {
        1: { label: "Aktif", color: "success" },
        0: { label: "Non Aktif", color: "error" },
    };

    return {
        statusData,
        tableData: state.data,
        studentHeaders,
        sortOptions,
        fetchStudentList,
    };
};

export default useStudentList;
