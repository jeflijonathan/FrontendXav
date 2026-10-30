import { useSnackbar } from "notistack";
import CategorySubjectService from "@api/categorysubject/service";
import useDashboardCategorySubjectStore from "../../store";
import type { FilterParams, SortOptionType } from "@common/types";
import type { TableHeaderType } from "@components/Table/TableBody";
import type { CategorySubjectResponseModel } from "@api/categorysubject/model";

type ReturnHook = {
    statusData: Record<number, { label: string; color: "success" | "error" }>;
    tableData: CategorySubjectResponseModel[];
    headers: TableHeaderType[];
    sortOptions: SortOptionType[];
    fetchCategorySubjectList: (filterParams?: FilterParams) => Promise<void>;
};

const useCategorySubjectList = (): ReturnHook => {
    const { enqueueSnackbar } = useSnackbar();
    const { state, setState } = useDashboardCategorySubjectStore();
    const service = new CategorySubjectService();

    const fetchCategorySubjectList = async (filterParams?: FilterParams) => {
        setState((prev) => ({ ...prev, isLoading: true }));
        await service.getAll(
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
                    enqueueSnackbar(
                        err.message || "Gagal memuat kategori mata pelajaran",
                        { variant: "error" }
                    );
                    setState((prev) => ({ ...prev, isLoading: false }));
                },
            },
            filterParams
        );
    };

    const headers: TableHeaderType[] = [
        { label: "ID", width: "220px" },
        { label: "Name Category", width: "240px" },
        { label: "Status", width: "120px" },
        { label: "Created At", width: "170px" },
        { label: "Updated At", width: "170px" },
    ];

    const sortOptions: SortOptionType[] = [
        { label: "Name", value: "name" },
        { label: "Created At", value: "created_at" },
        { label: "Updated At", value: "updated_at" },
    ];

    const statusData: Record<number, { label: string; color: "success" | "error" }> = {
        1: { label: "Active", color: "success" },
        0: { label: "No Active", color: "error" },
    };

    return {
        statusData,
        tableData: state.data,
        headers,
        sortOptions,
        fetchCategorySubjectList,
    };
};

export default useCategorySubjectList;

