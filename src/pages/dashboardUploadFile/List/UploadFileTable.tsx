import React from "react";
import { BaseTable, TableHeader } from "@components/Table";
import TableBody from "@components/Table/TableBody";
import TableRow from "@components/Table/TableRow";
import TableFooter from "@components/Table/TableFooter";
import TablePagination from "@components/Table/TablePagination";
import {
    TableCell,
    IconButton,
    Checkbox,
    Box,
    Typography,
    Button,
    type IconButtonProps,
} from "@mui/material";
import { Visibility, Download, Delete, DeleteOutlined } from "@mui/icons-material";
import useUploadFileList from "./hook/useUploadFileList";
import useUploadFileFilters from "./hook/useUploadFileFilters";
import useDashboardUploadFileStore from "../store";
import type { UploadFileResponseModel } from "@api/uploadFile/model";
import DetailUploadFileCardDialog from "../Detail/DetailUploadFileCardDialog";
import { BaseDialog, DialogHeader, DialogBody, DialogFooter } from "@components/Dialog";
import { formatFileSize } from "./utils/formatFileSize";

/**
 * UploadFileTable (Framework / Presentation Component)
 * Bertanggung jawab hanya untuk rendering UI, layout, dan interaksi visual.
 * Seluruh business logic (API, selection, deletion, debounce) dihandle oleh hook useUploadFileList.
 */
const UploadFileTable: React.FC = () => {
    const { state } = useDashboardUploadFileStore();
    const { handleChangePage, handleSearch, handleSort, handleOrder } = useUploadFileFilters();

    const {
        tableData,
        uploadFileHeaders,
        sortOptions,
        isLoading,
        pagination,
        // Selection
        selectedIds,
        isAllSelected,
        isIndeterminate,
        handleSelectAll,
        handleToggleSelect,
        clearSelection,
        // Single delete
        deleteTarget,
        isSingleDeleteOpen,
        handleOpenSingleDelete,
        handleCloseSingleDelete,
        handleConfirmSingleDelete,
        // Bulk delete
        isBulkDeleteOpen,
        handleOpenBulkDelete,
        handleCloseBulkDelete,
        handleConfirmBulkDelete,
        // Detail
        detailId,
        isDetailOpen,
        handleOpenDetail,
        handleCloseDetail,
        // Download
        handleDownloadFile,
        // Status
        isDeleting,
    } = useUploadFileList();

    const listActions: Array<{
        label: string;
        icon: React.ReactNode;
        color: IconButtonProps["color"];
        onClick: (item: UploadFileResponseModel) => void;
    }> = [
        {
            label: "Detail",
            icon: <Visibility fontSize="small" />,
            color: "info",
            onClick: (item) => handleOpenDetail(item.id),
        },
        {
            label: "Download",
            icon: <Download fontSize="small" />,
            color: "primary",
            onClick: (item) => handleDownloadFile(item.id),
        },
        {
            label: "Delete",
            icon: <DeleteOutlined fontSize="small" />,
            color: "error",
            onClick: (item) => handleOpenSingleDelete(item),
        },
    ];

    const renderActions = (item: UploadFileResponseModel) => (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
            {listActions.map((action, index) => (
                <IconButton
                    key={index}
                    size="small"
                    color={action.color}
                    onClick={() => action.onClick(item)}
                    title={action.label}
                >
                    {action.icon}
                </IconButton>
            ))}
        </div>
    );

    return (
        <>
            {/* Header: Pencarian, Sorting, & Filter */}
            <TableHeader
                search={state.search.value}
                onSearchChange={handleSearch}
                sortBy={state.filters.sort}
                onSortByChange={handleSort}
                sortOptions={sortOptions}
                sortDir={(state.filters.order_by as "asc" | "desc") || "desc"}
                onSortDirChange={handleOrder}
            />

            {/* Banner Aksi Massal saat ada file yang dipilih */}
            {selectedIds.length > 0 && (
                <Box
                    sx={{
                        mb: 2,
                        p: 1.5,
                        px: 2,
                        bgcolor: "rgba(239, 68, 68, 0.08)",
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 1.5,
                    }}
                >
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "error.main" }}>
                        {selectedIds.length} file dipilih untuk dihapus
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                            size="small"
                            variant="outlined"
                            color="inherit"
                            onClick={clearSelection}
                            disabled={isDeleting}
                        >
                            Batal Pilih
                        </Button>
                        <Button
                            size="small"
                            variant="contained"
                            color="error"
                            startIcon={<Delete />}
                            onClick={handleOpenBulkDelete}
                            disabled={isDeleting}
                        >
                            Hapus Terpilih ({selectedIds.length})
                        </Button>
                    </Box>
                </Box>
            )}

            {/* Data Table */}
            <BaseTable breakpoint={1200}>
                <TableBody
                    header={uploadFileHeaders}
                    isLoading={isLoading}
                    dataLength={tableData.length}
                    skeletonRows={3}
                    selectAction={
                        <Checkbox
                            size="small"
                            checked={isAllSelected}
                            indeterminate={isIndeterminate}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                            color="error"
                            disabled={tableData.length === 0 || isLoading}
                        />
                    }
                >
                    {tableData.map((row, index) => (
                        <TableRow
                            key={row.id}
                            index={index}
                            header={uploadFileHeaders}
                            actions={renderActions(row)}
                            selectAction={
                                <Checkbox
                                    size="small"
                                    checked={selectedIds.includes(row.id)}
                                    onChange={() => handleToggleSelect(row.id)}
                                    color="error"
                                />
                            }
                        >
                            <TableCell sx={{ py: 1 }}>{row.original_name || row.filename || "-"}</TableCell>
                            <TableCell sx={{ py: 1 }}>{row.mime_type || row.content_type || "-"}</TableCell>
                            <TableCell sx={{ py: 1 }}>{formatFileSize(row.file_size)}</TableCell>
                            <TableCell sx={{ py: 1 }}>
                                {(row.created_at || row.upload_date)
                                    ? new Date(row.created_at || row.upload_date!).toLocaleDateString()
                                    : "-"}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TablePagination
                        currentPage={pagination.page}
                        totalPage={pagination.total_pages}
                        onChange={handleChangePage}
                    />
                </TableFooter>
            </BaseTable>

            {/* Dialog Detail File */}
            {detailId && isDetailOpen && (
                <DetailUploadFileCardDialog
                    id={detailId}
                    isOpen={isDetailOpen}
                    onClose={handleCloseDetail}
                />
            )}

            {/* Dialog Konfirmasi Single Delete */}
            <BaseDialog isOpen={isSingleDeleteOpen} onClose={handleCloseSingleDelete}>
                <DialogHeader title="Konfirmasi Hapus File" onClose={handleCloseSingleDelete} />
                <DialogBody>
                    <Typography variant="body1" color="text.secondary">
                        Apakah Anda yakin ingin menghapus file <strong>{deleteTarget?.original_name || deleteTarget?.filename}</strong>? Tindakan ini tidak dapat dibatalkan.
                    </Typography>
                </DialogBody>
                <DialogFooter>
                    <Button onClick={handleCloseSingleDelete} disabled={isDeleting} color="inherit">
                        Batal
                    </Button>
                    <Button
                        onClick={handleConfirmSingleDelete}
                        disabled={isDeleting}
                        variant="contained"
                        color="error"
                    >
                        {isDeleting ? "Menghapus..." : "Hapus File"}
                    </Button>
                </DialogFooter>
            </BaseDialog>

            {/* Dialog Konfirmasi Bulk Delete */}
            <BaseDialog isOpen={isBulkDeleteOpen} onClose={handleCloseBulkDelete}>
                <DialogHeader title="Konfirmasi Hapus Banyak File" onClose={handleCloseBulkDelete} />
                <DialogBody>
                    <Typography variant="body1" color="text.secondary">
                        Apakah Anda yakin ingin menghapus <strong>{selectedIds.length}</strong> file yang dipilih? File akan dihapus permanen dari sistem.
                    </Typography>
                </DialogBody>
                <DialogFooter>
                    <Button onClick={handleCloseBulkDelete} disabled={isDeleting} color="inherit">
                        Batal
                    </Button>
                    <Button
                        onClick={handleConfirmBulkDelete}
                        disabled={isDeleting}
                        variant="contained"
                        color="error"
                    >
                        {isDeleting ? "Menghapus..." : `Hapus ${selectedIds.length} File`}
                    </Button>
                </DialogFooter>
            </BaseDialog>
        </>
    );
};

export default UploadFileTable;
