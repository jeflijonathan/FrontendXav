import { useCallback, useEffect, useRef, useState } from "react";
import type { TeachingTeacherRowModel } from "@api/teaching/model";
import useDashboardTeachingStore, {
    type DashboardTeachingStoreStateType,
} from "../../store";
import type { TeachingAssignmentPreset, TeachingRowSeed } from "../../store";
import useTeachingList from "./useTeachingList";
import useTeachingFilters from "./useTeachingFilters";
import useDeleteTeachingAssignment from "../../Delete/hook/useDeleteTeachingAssignment";
import { filterTeachingMapper } from "../utils/FilterTeachingMapper";

export interface TeachingTableHookReturn {
    state: DashboardTeachingStoreStateType;
    tableData: ReturnType<typeof useTeachingList>["state"]["data"];
    teachingHeaders: ReturnType<typeof useTeachingList>["teachingHeaders"];
    sortOptions: ReturnType<typeof useTeachingList>["sortOptions"];

    handleChangePage: ReturnType<typeof useTeachingFilters>["handleChangePage"];
    handleSearch: ReturnType<typeof useTeachingFilters>["handleSearch"];
    handleSort: ReturnType<typeof useTeachingFilters>["handleSort"];
    handleOrder: ReturnType<typeof useTeachingFilters>["handleOrder"];
    handleFilterPeriode: ReturnType<typeof useTeachingFilters>["handleFilterPeriode"];
    handleFilterLimit: ReturnType<typeof useTeachingFilters>["handleFilterLimit"];

    isCreateOpen: boolean;
    createPreset?: TeachingAssignmentPreset;
    updateSeed: TeachingRowSeed | null;
    selectedTeacher: TeachingTeacherRowModel | null;
    openCreateDialog: (preset?: TeachingAssignmentPreset) => void;
    closeCreateDialog: () => void;
    openUpdateDialog: (seed: TeachingRowSeed) => void;
    closeUpdateDialog: () => void;
    openManageDialog: (teacher: TeachingTeacherRowModel) => void;
    closeManageDialog: () => void;

    handleDelete: ReturnType<typeof useDeleteTeachingAssignment>["handleDelete"];
    refresh: () => Promise<void>;
}

const useTeachingTable = (): TeachingTableHookReturn => {
    const { state } = useDashboardTeachingStore();
    const { teachingHeaders, sortOptions, fetchTeachingList, fetchDropdownOptions } =
        useTeachingList();
    const tableData = state.data;
    const filterHandlers = useTeachingFilters();
    const { handleDelete } = useDeleteTeachingAssignment();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [createPreset, setCreatePreset] = useState<
        TeachingAssignmentPreset | undefined
    >();
    const [updateSeed, setUpdateSeed] = useState<TeachingRowSeed | null>(null);
    const [selectedTeacher, setSelectedTeacher] =
        useState<TeachingTeacherRowModel | null>(null);

    useEffect(() => {
        fetchDropdownOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const refresh = useCallback(async () => {
        const latestState = useDashboardTeachingStore.getState().state;
        await fetchTeachingList(filterTeachingMapper(latestState));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(
        function loadTeachingData() {
            if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
            searchDebounceRef.current = setTimeout(() => {
                refresh();
            }, 300);
            return () => {
                if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
            };
        },
        [
            state.pagination.page,
            state.pagination.limit,
            state.search.value,
            state.filters.sort,
            state.filters.order_by,
            state.filters.periode,
            refresh,
        ]
    );

    const openCreateDialog = useCallback((preset?: TeachingAssignmentPreset) => {
        setCreatePreset(preset);
        setIsCreateOpen(true);
    }, []);

    const closeCreateDialog = useCallback(() => {
        setIsCreateOpen(false);
        setCreatePreset(undefined);
    }, []);

    const openUpdateDialog = useCallback((seed: TeachingRowSeed) => {
        setUpdateSeed(seed);
    }, []);

    const closeUpdateDialog = useCallback(() => {
        setUpdateSeed(null);
    }, []);

    const openManageDialog = useCallback((teacher: TeachingTeacherRowModel) => {
        setSelectedTeacher(teacher);
    }, []);

    const closeManageDialog = useCallback(() => {
        setSelectedTeacher(null);
    }, []);

    const activeTeacher = selectedTeacher
        ? tableData.find((t) => t.id_teacher === selectedTeacher.id_teacher) || selectedTeacher
        : null;

    return {
        state,
        tableData,
        teachingHeaders,
        sortOptions,
        ...filterHandlers,
        isCreateOpen,
        createPreset,
        updateSeed,
        selectedTeacher: activeTeacher,
        openCreateDialog,
        closeCreateDialog,
        openUpdateDialog,
        closeUpdateDialog,
        openManageDialog,
        closeManageDialog,
        handleDelete,
        refresh,
    };
};

export default useTeachingTable;
