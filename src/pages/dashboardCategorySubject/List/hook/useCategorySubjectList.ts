/**
 * useCategorySubjectList — Framework Logic Hook
 *
 * Fetches Category Subject data from API and manages store updates.
 * Provides headers, sortOptions, and status metadata.
 *
 * Layer: Framework Logic
 */
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
        { label: "Nama Kategori", width: "240px" },
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
        headers,
        sortOptions,
        fetchCategorySubjectList,
    };
};

export default useCategorySubjectList;

