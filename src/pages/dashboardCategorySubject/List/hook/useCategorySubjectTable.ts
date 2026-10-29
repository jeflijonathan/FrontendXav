/**
 * useCategorySubjectTable — Framework Logic Hook
 *
 * Manages state orchestration, debounced fetching, refresh,
 * and dialog open/close states for CategorySubjectTable.
 *
 * Layer: Framework Logic
 */
import { useCallback, useEffect, useRef, useState } from "react";
import useDashboardCategorySubjectStore, {
    type DashboardCategorySubjectStoreStateType,
} from "../../store";
import useCategorySubjectList from "./useCategorySubjectList";
import useCategorySubjectFilters from "./useCategorySubjectFilters";
import { filterCategorySubjectMapper } from "../utils/FilterCategorySubjectMapper";
import type { CategorySubjectResponseModel } from "@api/categorysubject/model";

export interface DialogState {
    update: boolean;
    detail: boolean;
    delete: boolean;
}

export interface CategorySubjectTableHookReturn {
    state: DashboardCategorySubjectStoreStateType;
    setState: (
        fn: (p: DashboardCategorySubjectStoreStateType) => DashboardCategorySubjectStoreStateType
    ) => void;
    tableData: CategorySubjectResponseModel[];
    headers: ReturnType<typeof useCategorySubjectList>["headers"];
    sortOptions: ReturnType<typeof useCategorySubjectList>["sortOptions"];
    statusData: ReturnType<typeof useCategorySubjectList>["statusData"];

    // Filter handlers
    handleChangePage: (page: number) => void;
    handleFilterLimit: (limit: number) => void;
    handleSearch: (value: string) => void;
    handleSort: (sort: string) => void;
    handleOrder: (order_by: "asc" | "desc") => void;
    handleFilterStatus: (status: string) => void;

    // Dialog state
    updateId: string | null;
    detailId: string | null;
    deleteTarget: CategorySubjectResponseModel | null;
    isDialogOpen: DialogState;

    // Handlers
    openDetailDialog: (item: CategorySubjectResponseModel) => void;
    closeDetailDialog: () => void;
    openUpdateDialog: (item: CategorySubjectResponseModel) => void;
    closeUpdateDialog: () => void;
    openDeleteDialog: (item: CategorySubjectResponseModel) => void;
    closeDeleteDialog: () => void;

    refresh: () => Promise<void>;
}

const useCategorySubjectTable = (): CategorySubjectTableHookReturn => {
    const { state, setState } = useDashboardCategorySubjectStore();
    const { tableData, fetchCategorySubjectList, headers, sortOptions, statusData } =
        useCategorySubjectList();
    const filterHandlers = useCategorySubjectFilters();

    const [updateId, setUpdateId] = useState<string | null>(null);
    const [detailId, setDetailId] = useState<string | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<CategorySubjectResponseModel | null>(null);
    const [isDialogOpen, setDialogOpen] = useState<DialogState>({
        update: false,
        detail: false,
        delete: false,
    });

    const refresh = useCallback(async () => {
        const latestState = useDashboardCategorySubjectStore.getState().state;
        await fetchCategorySubjectList(filterCategorySubjectMapper(latestState));
    }, [fetchCategorySubjectList]);

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(function loadData() {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            refresh();
        }, 300);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [
        state.pagination.page,
        state.pagination.limit,
        state.search.value,
        state.filters.sort,
        state.filters.order_by,
        state.filters.status,
    ]);

    const openDetailDialog = useCallback((item: CategorySubjectResponseModel) => {
        setDetailId(item.id || item.id_category_subject || "");
        setDialogOpen((prev) => ({ ...prev, detail: true }));
    }, []);

    const closeDetailDialog = useCallback(() => {
        setDetailId(null);
        setDialogOpen((prev) => ({ ...prev, detail: false }));
    }, []);

    const openUpdateDialog = useCallback(
        (item: CategorySubjectResponseModel) => {
            setState((prev) => ({ ...prev, updateCategorySubjectReqDetails: item }));
            setUpdateId(item.id || item.id_category_subject || "");
            setDialogOpen((prev) => ({ ...prev, update: true }));
        },
        [setState]
    );

    const closeUpdateDialog = useCallback(() => {
        setUpdateId(null);
        setDialogOpen((prev) => ({ ...prev, update: false }));
        setState((prev) => ({ ...prev, updateCategorySubjectReqDetails: null }));
    }, [setState]);

    const openDeleteDialog = useCallback((item: CategorySubjectResponseModel) => {
        setDeleteTarget(item);
        setDialogOpen((prev) => ({ ...prev, delete: true }));
    }, []);

    const closeDeleteDialog = useCallback(() => {
        setDeleteTarget(null);
        setDialogOpen((prev) => ({ ...prev, delete: false }));
    }, []);

    return {
        state,
        setState,
        tableData,
        headers,
        sortOptions,
        statusData,
        ...filterHandlers,
        updateId,
        detailId,
        deleteTarget,
        isDialogOpen,
        openDetailDialog,
        closeDetailDialog,
        openUpdateDialog,
        closeUpdateDialog,
        openDeleteDialog,
        closeDeleteDialog,
        refresh,
    };
};

export default useCategorySubjectTable;

