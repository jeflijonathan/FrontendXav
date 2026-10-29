import { useEffect, useRef, useState, useMemo } from "react";
import useDashboardUploadFileStore from "../../store";
import UploadFileService from "@api/uploadFile";
import { useSnackbar } from "notistack";
import type { FilterParams, SortOptionType } from "@common/types";
import type { TableHeaderType } from "@components/Table/TableBody";
import type { UploadFileResponseModel } from "@api/uploadFile/model";
import { filterUploadFileMapper } from "../utils/FilterUploadFileMapper";

export type UseUploadFileListReturn = {
    // Data & Config
    tableData: UploadFileResponseModel[];
    uploadFileHeaders: TableHeaderType[];
    sortOptions: SortOptionType[];
    isLoading: boolean;
    pagination: {
        page: number;
        total_pages: number;
        total_data: number;
    };
    fetchUploadFileList: (filterParams?: FilterParams) => Promise<void>;
    refresh: () => Promise<void>;

    // Selection Business Logic
    selectedIds: string[];
    isAllSelected: boolean;
    isIndeterminate: boolean;
    handleSelectAll: (checked: boolean) => void;
    handleToggleSelect: (id: string) => void;
    clearSelection: () => void;

    // Single Delete Business Logic
    deleteTarget: UploadFileResponseModel | null;
    isSingleDeleteOpen: boolean;
    handleOpenSingleDelete: (item: UploadFileResponseModel) => void;
    handleCloseSingleDelete: () => void;
    handleConfirmSingleDelete: () => Promise<void>;

    // Bulk Delete Business Logic
    isBulkDeleteOpen: boolean;
    handleOpenBulkDelete: () => void;
    handleCloseBulkDelete: () => void;
    handleConfirmBulkDelete: () => Promise<void>;

    // Detail Dialog Business Logic
    detailId: string | null;
    isDetailOpen: boolean;
    handleOpenDetail: (id: string) => void;
    handleCloseDetail: () => void;

    // Download Handler
    handleDownloadFile: (id: string) => void;

    // Status
    isDeleting: boolean;
};

const useUploadFileList = (): UseUploadFileListReturn => {
    const { enqueueSnackbar } = useSnackbar();
    const { state, setState } = useDashboardUploadFileStore();
    const service = useMemo(() => new UploadFileService(), []);

    // Selection states
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Detail dialog states
    const [detailId, setDetailId] = useState<string | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    // Delete states
    const [deleteTarget, setDeleteTarget] = useState<UploadFileResponseModel | null>(null);
    const [isSingleDeleteOpen, setIsSingleDeleteOpen] = useState(false);
    const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // 1. Fetch & Data Loading Business Logic
    const fetchUploadFileList = async (filterParams?: FilterParams) => {
        setState((prev) => ({ ...prev, isLoading: true }));
        return await service.getAllFile({
            onSuccess: (res: any) => {
                setState((prev) => ({
                    ...prev,
                    data: res.data || res || [],
                    pagination: res.pagination || prev.pagination,
                    isLoading: false,
                }));
            },
            onError: (err: any) => {
                enqueueSnackbar(err?.message || "Failed to fetch files", { variant: "error" });
                setState((prev) => ({ ...prev, isLoading: false }));
            },
        }, filterParams);
    };

    const refresh = async () => {
        const latestState = useDashboardUploadFileStore.getState().state;
        return await fetchUploadFileList(filterUploadFileMapper(latestState));
    };

    // Auto-fetch data on search / filter / pagination change with debounce
    useEffect(() => {
        if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
        searchDebounceRef.current = setTimeout(() => {
            refresh();
        }, 400);

        return () => {
            if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
        };
    }, [state.pagination.page, state.search.value, state.filters.sort, state.filters.order_by]);

    // 2. Selection Business Logic
    const isAllSelected = state.data.length > 0 && state.data.every((item) => selectedIds.includes(item.id));
    const isIndeterminate = selectedIds.length > 0 && !isAllSelected;

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const allIds = Array.from(new Set([...selectedIds, ...state.data.map((item) => item.id)]));
            setSelectedIds(allIds);
        } else {
            const currentTableIds = new Set(state.data.map((item) => item.id));
            setSelectedIds((prev) => prev.filter((id) => !currentTableIds.has(id)));
        }
    };

    const handleToggleSelect = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const clearSelection = () => setSelectedIds([]);

    // 3. Single Delete Business Logic
    const handleOpenSingleDelete = (item: UploadFileResponseModel) => {
        setDeleteTarget(item);
        setIsSingleDeleteOpen(true);
    };

    const handleCloseSingleDelete = () => {
        if (isDeleting) return;
        setDeleteTarget(null);
        setIsSingleDeleteOpen(false);
    };

    const handleConfirmSingleDelete = async () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        await service.deleteFile(deleteTarget.id, {
            onSuccess: () => {
                enqueueSnackbar("File berhasil dihapus", { variant: "success" });
                setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget.id));
                setIsSingleDeleteOpen(false);
                setDeleteTarget(null);
                refresh();
            },
            onError: (err: any) => {
                enqueueSnackbar(err?.message || "Gagal menghapus file", { variant: "error" });
            },
            onFullfilled: () => {
                setIsDeleting(false);
            },
        });
    };

    // 4. Bulk Delete Business Logic
    const handleOpenBulkDelete = () => {
        if (selectedIds.length > 0) setIsBulkDeleteOpen(true);
    };

    const handleCloseBulkDelete = () => {
        if (isDeleting) return;
        setIsBulkDeleteOpen(false);
    };

    const handleConfirmBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        setIsDeleting(true);
        await service.bulkDeleteFiles(selectedIds, {
            onSuccess: (data) => {
                enqueueSnackbar(`${data?.deleted_count ?? selectedIds.length} file berhasil dihapus`, { variant: "success" });
                setSelectedIds([]);
                setIsBulkDeleteOpen(false);
                refresh();
            },
            onError: (err: any) => {
                enqueueSnackbar(err?.message || "Gagal menghapus file terpilih", { variant: "error" });
            },
            onFullfilled: () => {
                setIsDeleting(false);
            },
        });
    };

    // 5. Detail Dialog Business Logic
    const handleOpenDetail = (id: string) => {
        setDetailId(id);
        setIsDetailOpen(true);
    };

    const handleCloseDetail = () => {
        setDetailId(null);
        setIsDetailOpen(false);
    };

    // 6. Download Business Logic
    const handleDownloadFile = (id: string) => {
        const downloadUrl = `${import.meta.env.VITE_BACKEND_URL}/api/upload/${id}`;
        window.open(downloadUrl, "_blank");
    };

    // Static Table Configuration
    const uploadFileHeaders: TableHeaderType[] = [
        { label: "File Name" },
        { label: "MIME Type", width: "160px" },
        { label: "File Size", width: "130px" },
        { label: "Uploaded At", width: "180px" },
    ];

    const sortOptions: SortOptionType[] = [
        { label: "Uploaded At", value: "created_at" },
        { label: "File Name", value: "original_name" },
        { label: "File Size", value: "file_size" },
        { label: "MIME Type", value: "mime_type" },
    ];

    return {
        tableData: state.data,
        uploadFileHeaders,
        sortOptions,
        isLoading: state.isLoading,
        pagination: state.pagination,
        fetchUploadFileList,
        refresh,
        selectedIds,
        isAllSelected,
        isIndeterminate,
        handleSelectAll,
        handleToggleSelect,
        clearSelection,
        deleteTarget,
        isSingleDeleteOpen,
        handleOpenSingleDelete,
        handleCloseSingleDelete,
        handleConfirmSingleDelete,
        isBulkDeleteOpen,
        handleOpenBulkDelete,
        handleCloseBulkDelete,
        handleConfirmBulkDelete,
        detailId,
        isDetailOpen,
        handleOpenDetail,
        handleCloseDetail,
        handleDownloadFile,
        isDeleting,
    };
};

export default useUploadFileList;
