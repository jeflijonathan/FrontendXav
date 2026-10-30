/**
 * useSubjectTable — Framework Logic Hook
 *
 * Manages state orchestration, debounced fetching, refresh,
 * and dialog open/close states for SubjectTable.
 *
 * Layer: Framework Logic
 */
import { useCallback, useEffect, useRef, useState } from "react";
import useDashboardSubjectStore, {
    type DashboardSubjectStoreStateType,
} from "../../store";
import useSubjectList from "./useSubjectList";
import useSubjectFilters from "./useSubjectFilters";
import { filterSubjectMapper } from "../utils/FilterSubjectMapper";
import type { SubjectResponseModel } from "@api/subject/model";

export interface DialogState {
    update: boolean;
    detail: boolean;
    delete: boolean;
}

export interface SubjectTableHookReturn {
    state: DashboardSubjectStoreStateType;
    setState: (
        fn: (p: DashboardSubjectStoreStateType) => DashboardSubjectStoreStateType
    ) => void;
    tableData: SubjectResponseModel[];
    categories: ReturnType<typeof useSubjectList>["categories"];
    majors: ReturnType<typeof useSubjectList>["majors"];
    headers: ReturnType<typeof useSubjectList>["headers"];
    sortOptions: ReturnType<typeof useSubjectList>["sortOptions"];
    statusData: ReturnType<typeof useSubjectList>["statusData"];

    // Filter handlers
    handleChangePage: (page: number) => void;
    handleFilterLimit: (limit: number) => void;
    handleSearch: (value: string) => void;
    handleSort: (sort: string) => void;
    handleOrder: (order_by: "asc" | "desc") => void;
    handleFilterCategory: (id_category_subject: string) => void;
    handleFilterMajor: (id_major: string) => void;
    handleFilterKelas: (kelas: string) => void;
    handleFilterFase: (fase: string) => void;
    handleFilterStatus: (status: string) => void;

    // Dialog state
    updateId: string | null;
    detailId: string | null;
    deleteTarget: SubjectResponseModel | null;
    isDialogOpen: DialogState;

    // Handlers
    openDetailDialog: (item: SubjectResponseModel) => void;
    closeDetailDialog: () => void;
    openUpdateDialog: (item: SubjectResponseModel) => void;
    closeUpdateDialog: () => void;
    openDeleteDialog: (item: SubjectResponseModel) => void;
    closeDeleteDialog: () => void;

    refresh: () => Promise<void>;
}

const useSubjectTable = (): SubjectTableHookReturn => {
    const { state, setState } = useDashboardSubjectStore();
    const {
        tableData,
        categories,
        majors,
        fetchSubjectList,
        fetchDropdownOptions,
        headers,
        sortOptions,
        statusData,
    } = useSubjectList();
    const filterHandlers = useSubjectFilters();

    const [updateId, setUpdateId] = useState<string | null>(null);
    const [detailId, setDetailId] = useState<string | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<SubjectResponseModel | null>(null);
    const [isDialogOpen, setDialogOpen] = useState<DialogState>({
        update: false,
        detail: false,
        delete: false,
    });

    // Fetch dropdown options on initial mount for FK resolution & filtering
    useEffect(() => {
        fetchDropdownOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const refresh = useCallback(async () => {
        const latestState = useDashboardSubjectStore.getState().state;
        await fetchSubjectList(filterSubjectMapper(latestState));
    }, [fetchSubjectList]);

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
        state.filters.id_category_subject,
        state.filters.id_major,
        state.filters.kelas,
        state.filters.fase,
    ]);

    const openDetailDialog = useCallback((item: SubjectResponseModel) => {
        setDetailId(item.id || item.id_subject || "");
        setDialogOpen((prev) => ({ ...prev, detail: true }));
    }, []);

    const closeDetailDialog = useCallback(() => {
        setDetailId(null);
        setDialogOpen((prev) => ({ ...prev, detail: false }));
    }, []);

    const openUpdateDialog = useCallback(
        (item: SubjectResponseModel) => {
            setState((prev) => ({ ...prev, updateSubjectReqDetails: item }));
            setUpdateId(item.id || item.id_subject || "");
            setDialogOpen((prev) => ({ ...prev, update: true }));
        },
        [setState]
    );

    const closeUpdateDialog = useCallback(() => {
        setUpdateId(null);
        setDialogOpen((prev) => ({ ...prev, update: false }));
        setState((prev) => ({ ...prev, updateSubjectReqDetails: null }));
    }, [setState]);

    const openDeleteDialog = useCallback((item: SubjectResponseModel) => {
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
        categories,
        majors,
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

export default useSubjectTable;
