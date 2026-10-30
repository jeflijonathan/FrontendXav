/**
 * useSubjectList — Framework Logic Hook
 *
 * Fetches Subject list, Category Subject dropdown options, and Majors from API.
 * Provides headers, sortOptions, and status metadata in English.
 *
 * Layer: Framework Logic
 */
import { useSnackbar } from "notistack";
import SubjectService from "@api/subject/service";
import CategorySubjectService from "@api/categorysubject/service";
import MajorService from "@api/major/service";
import useDashboardSubjectStore from "../../store";
import type { FilterParams, SortOptionType } from "@common/types";
import type { TableHeaderType } from "@components/Table/TableBody";
import type { SubjectResponseModel } from "@api/subject/model";
import type { CategorySubjectResponseModel } from "@api/categorysubject/model";
import type { MajorResponseModel } from "@api/major/model";

type ReturnHook = {
    statusData: Record<number, { label: string; color: "success" | "error" }>;
    tableData: SubjectResponseModel[];
    categories: CategorySubjectResponseModel[];
    majors: MajorResponseModel[];
    headers: TableHeaderType[];
    sortOptions: SortOptionType[];
    fetchSubjectList: (filterParams?: FilterParams) => Promise<void>;
    fetchDropdownOptions: () => Promise<void>;
};

const useSubjectList = (): ReturnHook => {
    const { enqueueSnackbar } = useSnackbar();
    const { state, setState } = useDashboardSubjectStore();
    const service = new SubjectService();
    const categoryService = new CategorySubjectService();
    const majorService = new MajorService();

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
                        err.message || "Failed to load subjects",
                        { variant: "error" }
                    );
                    setState((prev) => ({ ...prev, isLoading: false }));
                },
            },
            filterParams
        );
    };

    const fetchDropdownOptions = async () => {
        // Fetch Categories
        categoryService.getAll(
            {
                onSuccess: (res) => {
                    setState((prev) => ({
                        ...prev,
                        categories: res.data || [],
                    }));
                },
                onError: () => {},
            },
            { params: { page: 1, limit: 100 } }
        );

        // Fetch Majors
        majorService.getAll(
            {
                onSuccess: (res) => {
                    setState((prev) => ({
                        ...prev,
                        majors: res.data || [],
                    }));
                },
                onError: () => {},
            },
            { params: { page: 1, limit: 100 } }
        );
    };

    const headers: TableHeaderType[] = [
        { label: "ID", width: "160px" },
        { label: "Subject Name", width: "220px" },
        { label: "Grade", width: "110px" },
        { label: "Phase", width: "100px" },
        { label: "Major", width: "180px" },
        { label: "Category", width: "160px" },
        { label: "Status", width: "110px" },
        { label: "Created At", width: "160px" },
        { label: "Updated At", width: "160px" },
        { label: "Deleted At", width: "140px" },
    ];

    const sortOptions: SortOptionType[] = [
        { label: "Name", value: "name" },
        { label: "Grade", value: "kelas" },
        { label: "Phase", value: "fase" },
        { label: "Created At", value: "created_at" },
        { label: "Updated At", value: "updated_at" },
    ];

    const statusData: Record<number, { label: string; color: "success" | "error" }> = {
        1: { label: "Active", color: "success" },
        0: { label: "Inactive", color: "error" },
    };

    return {
        statusData,
        tableData: state.data,
        categories: state.categories,
        majors: state.majors,
        headers,
        sortOptions,
        fetchSubjectList,
        fetchDropdownOptions,
    };
};

export default useSubjectList;
