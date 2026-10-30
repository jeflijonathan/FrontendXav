/**
 * useSubjectList — Framework Logic Hook
 *
 * Fetches Subject list and Category Subject dropdown options from API.
 * Provides headers, sortOptions, and status metadata.
 *
 * Layer: Framework Logic
 */
import { useSnackbar } from "notistack";
import SubjectService from "@api/subject/service";
import CategorySubjectService from "@api/categorysubject/service";
import useDashboardSubjectStore from "../../store";
import type { FilterParams, SortOptionType } from "@common/types";
import type { TableHeaderType } from "@components/Table/TableBody";
import type { SubjectResponseModel } from "@api/subject/model";
import type { CategorySubjectResponseModel } from "@api/categorysubject/model";

type ReturnHook = {
    statusData: Record<number, { label: string; color: "success" | "error" }>;
    tableData: SubjectResponseModel[];
    categories: CategorySubjectResponseModel[];
    headers: TableHeaderType[];
    sortOptions: SortOptionType[];
    fetchSubjectList: (filterParams?: FilterParams) => Promise<void>;
    fetchCategoryOptions: () => Promise<void>;
};

const useSubjectList = (): ReturnHook => {
    const { enqueueSnackbar } = useSnackbar();
    const { state, setState } = useDashboardSubjectStore();
    const service = new SubjectService();
    const categoryService = new CategorySubjectService();

    const fetchSubjectList = async (filterParams?: FilterParams) => {
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
                        err.message || "Gagal memuat daftar mata pelajaran",
                        { variant: "error" }
                    );
                    setState((prev) => ({ ...prev, isLoading: false }));
                },
            },
            filterParams
        );
    };

    const fetchCategoryOptions = async () => {
        await categoryService.getAll(
            {
                onSuccess: (res) => {
                    const list = res.data || [];
                    setState((prev) => ({
                        ...prev,
                        categories: list,
                    }));
                },
                onError: () => {},
            },
            { params: { page: 1, limit: 100 } }
        );
    };

    const headers: TableHeaderType[] = [
        { label: "ID", width: "180px" },
        { label: "Nama Mata Pelajaran", width: "240px" },
        { label: "Category", width: "200px" },
        { label: "Status", width: "120px" },
        { label: "Dibuat Pada", width: "170px" },
        { label: "Diperbarui Pada", width: "170px" },
        { label: "Dihapus Pada", width: "150px" },
    ];

    const sortOptions: SortOptionType[] = [
        { label: "Nama", value: "name" },
        { label: "Tanggal Dibuat", value: "created_at" },
        { label: "Tanggal Diperbarui", value: "updated_at" },
    ];

    const statusData: Record<number, { label: string; color: "success" | "error" }> = {
        1: { label: "Aktif", color: "success" },
        0: { label: "Non Aktif", color: "error" },
    };

    return {
        statusData,
        tableData: state.data,
        categories: state.categories,
        headers,
        sortOptions,
        fetchSubjectList,
        fetchCategoryOptions,
    };
};

export default useSubjectList;

