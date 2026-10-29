/**
 * useClassTable — Framework Logic Hook
 *
 * Manages all React lifecycle, state, and side-effects for the ClassTable component.
 * Responsible for: dialog open/close states, debounced fetch trigger, refresh logic.
 *
 * Layer: Framework Logic (React hooks, useEffect, useState, useRef)
 * No JSX / No raw business logic — delegates to useClassList & useClassFilters.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import useDashboardClassStore, { type DashboardClassStoreStateType } from "../../store";
import useClassList from "./useClassList";
import useClassFilters from "./useClassFilters";
import { filterClassMapper } from "../utils/FilterClassMapper";
import type { ClassResponseModel } from "@api/class/model";

export interface ClassTableDialogState {
    update: boolean;
    detail: boolean;
}

export interface ClassTableHookReturn {
    // Store state & filters
    state: DashboardClassStoreStateType;
    setState: (fn: (p: DashboardClassStoreStateType) => DashboardClassStoreStateType) => void;

    // Class list data & meta
    tableData: ClassResponseModel[];
    fetchClassList: ReturnType<typeof useClassList>["fetchClassList"];
    statusData: ReturnType<typeof useClassList>["statusData"];
    classHeaders: ReturnType<typeof useClassList>["classHeaders"];
    sortOptions: ReturnType<typeof useClassList>["sortOptions"];

    // Filter handlers
    handleChangePage: ReturnType<typeof useClassFilters>["handleChangePage"];
    handleSearch: ReturnType<typeof useClassFilters>["handleSearch"];
    handleSort: ReturnType<typeof useClassFilters>["handleSort"];
    handleOrder: ReturnType<typeof useClassFilters>["handleOrder"];
    handleFilterPeriode: ReturnType<typeof useClassFilters>["handleFilterPeriode"];
    handleFilterKelas: ReturnType<typeof useClassFilters>["handleFilterKelas"];
    handleFilterMajor: ReturnType<typeof useClassFilters>["handleFilterMajor"];
    handleFilterStatus: ReturnType<typeof useClassFilters>["handleFilterStatus"];
    handleFilterLimit: ReturnType<typeof useClassFilters>["handleFilterLimit"];

    // Dialog state
    updateId: string | null;
    detailId: string | null;
    isDialogOpen: ClassTableDialogState;
    manageStudentsClass: ClassResponseModel | null;
    isManageStudentsOpen: boolean;

    // Dialog handlers
    openDetailDialog: (item: ClassResponseModel) => void;
    closeDetailDialog: () => void;
    openUpdateDialog: (item: ClassResponseModel) => void;
    closeUpdateDialog: () => void;
    openManageStudentsDialog: (item: ClassResponseModel) => void;
    closeManageStudentsDialog: () => void;

    // Refresh
    refresh: () => Promise<void>;
}

const useClassTable = (): ClassTableHookReturn => {
    const store = useDashboardClassStore();
    const { state, setState } = store;
    const { tableData, fetchClassList, fetchDropdownOptions, statusData, classHeaders, sortOptions } = useClassList();
    const filterHandlers = useClassFilters();

    // Dialog state
    const [updateId, setUpdateId] = useState<string | null>(null);
    const [detailId, setDetailId] = useState<string | null>(null);
    const [isDialogOpen, setDialogOpen] = useState<ClassTableDialogState>({ update: false, detail: false });
    const [manageStudentsClass, setManageStudentsClass] = useState<ClassResponseModel | null>(null);
    const [isManageStudentsOpen, setIsManageStudentsOpen] = useState(false);

    // Initial fetch of dropdown options (majors, employees, schoolInformations)
    useEffect(() => {
        fetchDropdownOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Refresh function using latest store state (not stale closure)
    const refresh = useCallback(async () => {
        const latestState = useDashboardClassStore.getState().state;
        await fetchClassList(filterClassMapper(latestState));
    }, [fetchClassList]);

    // Debounced fetch when filters/pagination change
    const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(function loadClassData() {
        if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
        searchDebounceRef.current = setTimeout(() => {
            refresh();
        }, 300);
        return () => {
            if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
        };
    }, [
        state.pagination.page,
        state.pagination.limit,
        state.search.value,
        state.filters.sort,
        state.filters.order_by,
        state.filters.id_school_information,
        state.filters.kelas,
        state.filters.id_major,
        state.filters.status,
    ]);

    // Dialog handlers
    const openDetailDialog = useCallback((item: ClassResponseModel) => {
        setDetailId(item.id_class || item.id || "");
        setDialogOpen((prev) => ({ ...prev, detail: true }));
    }, []);

    const closeDetailDialog = useCallback(() => {
        setDetailId(null);
        setDialogOpen((prev) => ({ ...prev, detail: false }));
    }, []);

    const openUpdateDialog = useCallback((item: ClassResponseModel) => {
        setState((prev) => ({ ...prev, updateClassReqDetails: item }));
        setUpdateId(item.id_class || item.id || "");
        setDialogOpen((prev) => ({ ...prev, update: true }));
    }, [setState]);

    const closeUpdateDialog = useCallback(() => {
        setUpdateId(null);
        setDialogOpen((prev) => ({ ...prev, update: false }));
        setState((prev) => ({ ...prev, updateClassReqDetails: null }));
    }, [setState]);

    const openManageStudentsDialog = useCallback((item: ClassResponseModel) => {
        setManageStudentsClass(item);
        setIsManageStudentsOpen(true);
    }, []);

    const closeManageStudentsDialog = useCallback(() => {
        setIsManageStudentsOpen(false);
        setManageStudentsClass(null);
    }, []);

    return {
        state,
        setState,
        tableData,
        fetchClassList,
        statusData,
        classHeaders,
        sortOptions,
        ...filterHandlers,
        updateId,
        detailId,
        isDialogOpen,
        manageStudentsClass,
        isManageStudentsOpen,
        openDetailDialog,
        closeDetailDialog,
        openUpdateDialog,
        closeUpdateDialog,
        openManageStudentsDialog,
        closeManageStudentsDialog,
        refresh,
    };
};

export default useClassTable;
