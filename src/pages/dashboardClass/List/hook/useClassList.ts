/**
 * useClassList — Framework Logic Hook
 *
 * Manages API calls to fetch class list and dropdown options (majors, employees, periods).
 * Responsible for updating Zustand store state on API success/error.
 *
 * Layer: Framework Logic (API calls, store updates, side effects)
 */
import { useDashboardClassStore } from "../../store";
import ClassService from "@api/class/service";
import MajorService from "@api/major/service";
import EmployeeService from "@api/employee/service";
import SchoolInformationService from "@api/schoolinformation/service";
import { useSnackbar } from "notistack";
import type { FilterParams, SortOptionType } from "@common/types";
import type { TableHeaderType } from "@components/Table/TableBody";
import type { ClassResponseModel } from "@api/class/model";
import type { MajorResponseModel } from "@api/major/model";
import type { EmployeeResponseModel } from "@api/employee/model";
import type { SchoolInformationResponseModel } from "@api/schoolinformation/model";

// API response shapes — services use a generic wrapper, handle both flat array and nested data
interface PaginatedApiResponse<T> {
    data?: T[] | { data?: T[] };
}

type ReturnHook = {
    statusData: Record<number, { label: string; color: "success" | "error" }>;
    tableData: ClassResponseModel[];
    classHeaders: TableHeaderType[];
    sortOptions: SortOptionType[];
    fetchClassList: (filterParams?: FilterParams) => Promise<void>;
    fetchDropdownOptions: () => Promise<void>;
};

const useClassList = (): ReturnHook => {
    const { enqueueSnackbar } = useSnackbar();
    const { state, setState } = useDashboardClassStore();
    const service = new ClassService();
    const majorService = new MajorService();
    const employeeService = new EmployeeService();
    const schoolInfoService = new SchoolInformationService();

    /** Normalize nested or flat API array response */
    function extractList<T>(res: PaginatedApiResponse<T>): T[] {
        if (Array.isArray(res?.data)) return res.data as T[];
        if (Array.isArray((res?.data as { data?: T[] })?.data)) {
            return (res.data as { data: T[] }).data;
        }
        return [];
    }

    const fetchClassList = async (filterParams?: FilterParams) => {
        setState((prev) => ({ ...prev, isLoading: true }));
        return await service.getAll(
            {
                onSuccess: (res) => {
                    setState((prev) => ({
                        ...prev,
                        data: res.data || [],
                        pagination: res.pagination,
                        isLoading: false,
                    }));
                },
                onError: (err) => {
                    enqueueSnackbar(err.message || "Gagal memuat data kelas", { variant: "error" });
                    setState((prev) => ({ ...prev, isLoading: false }));
                },
            },
            filterParams
        );
    };

    const fetchDropdownOptions = async () => {
        // Fetch School Information (Periode)
        schoolInfoService.getAll(
            {
                onSuccess: (res: PaginatedApiResponse<SchoolInformationResponseModel>) => {
                    const list = extractList<SchoolInformationResponseModel>(res);
                    setState((prev) => {
                        const activeItem = list.find((item) => item.status) || list[0];
                        const defaultId =
                            prev.filters.id_school_information ||
                            activeItem?.id_school_information ||
                            "";
                        return {
                            ...prev,
                            schoolInformations: list,
                            filters: {
                                ...prev.filters,
                                id_school_information: defaultId,
                            },
                        };
                    });
                },
                onError: () => {},
            },
            { params: { page: 1, limit: 100 } }
        );

        // Fetch Majors
        majorService.getAll(
            {
                onSuccess: (res: PaginatedApiResponse<MajorResponseModel>) => {
                    const list = extractList<MajorResponseModel>(res);
                    setState((prev) => ({ ...prev, majors: list }));
                },
                onError: () => {},
            },
            { params: { page: 1, limit: 100 } }
        );

        // Fetch Employees (Wali Kelas)
        employeeService.getEmployeeRequest(
            {
                onSuccess: (res: PaginatedApiResponse<EmployeeResponseModel>) => {
                    const list = extractList<EmployeeResponseModel>(res);
                    setState((prev) => ({ ...prev, employees: list }));
                },
                onError: () => {},
            },
            { params: { page: 1, limit: 100 } }
        );
    };

    const classHeaders: TableHeaderType[] = [
        { label: "Tingkat", width: "100px" },
        { label: "Nama Kelas", width: "200px" },
        { label: "Jurusan", width: "220px" },
        { label: "Wali Kelas", width: "220px" },
        { label: "Periode", width: "160px" },
        { label: "Status", width: "120px" },
        { label: "Dibuat Pada", width: "160px" },
    ];

    const sortOptions: SortOptionType[] = [
        { label: "Nama Kelas", value: "name" },
        { label: "Tingkat", value: "kelas" },
        { label: "Tanggal Dibuat", value: "created_at" },
    ];

    const statusData: Record<number, { label: string; color: "success" | "error" }> = {
        1: { label: "Aktif", color: "success" },
        0: { label: "Non Aktif", color: "error" },
    };

    return {
        statusData,
        tableData: state.data,
        classHeaders,
        sortOptions,
        fetchClassList,
        fetchDropdownOptions,
    };
};

export default useClassList;
