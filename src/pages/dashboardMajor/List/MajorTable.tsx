import { useEffect, useRef, useState } from "react";
import { BaseTable, TableHeader } from "@components/Table";
import TableBody from "@components/Table/TableBody";
import TableRow from "@components/Table/TableRow";
import TableFooter from "@components/Table/TableFooter";
import TablePagination from "@components/Table/TablePagination";
import { TableCell, Chip, IconButton, type IconButtonProps, Tooltip } from "@mui/material";
import { Edit, Visibility, Delete } from "@mui/icons-material";
import useMajorList from "./hook/useMajorList";
import useMajorFilters from "./hook/useMajorFilters";
import { useDashboardMajorStore } from "../store";
import { filterMajorMapper } from "./utils/FilterMajorMapper";
import type { MajorResponseModel } from "@api/major/model";
import MajorService from "@api/major/service";
import { snackbar } from "@utils/snackbar";
import UpdateMajorCardDialog from "../Update/UpdateMajorCardDialog";
import DetailMajorCardDialog from "../Detail/DetailMajorCardDialog";

const MajorTable = () => {
    const { state, setState } = useDashboardMajorStore();
    const { tableData, majorHeaders, sortOptions, statusData, fetchMajorList } = useMajorList();
    const { handleChangePage, handleSearch, handleSort, handleOrder } = useMajorFilters();

    const [updateId, setUpdateId] = useState<string | null>(null);
    const [detailId, setDetailId] = useState<string | null>(null);
    const [isDialogOpen, setDialogOpen] = useState({ update: false, detail: false });

    const refresh = () => {
        const latestState = useDashboardMajorStore.getState().state;
        return fetchMajorList(filterMajorMapper(latestState));
    };

    // Debounce search to prevent excessive API requests
    const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(function loadMajorData() {
        if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
        searchDebounceRef.current = setTimeout(() => {
            refresh();
        }, 400);
        return () => {
            if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
        };
    }, [
        state.pagination.page,
        state.pagination.limit,
        state.search.value,
        state.filters.sort,
        state.filters.order_by,
        state.filters.status,
    ]);

    const ListActions: Array<{
        label: string;
        icon: React.ReactNode;
        color: IconButtonProps["color"];
        onClick: (item: MajorResponseModel) => void;
    }> = [
        {
            label: "Detail",
            icon: <Visibility fontSize="small" />,
            color: "info",
            onClick: (item) => {
                setDetailId(item.id_major);
                setDialogOpen((prev) => ({ ...prev, detail: true }));
            },
        },
        {
            label: "Edit",
            icon: <Edit fontSize="small" />,
            color: "primary",
            onClick: (item) => {
                setState((prev) => ({
                    ...prev,
                    updateMajorReqDetails: item,
                }));
                setUpdateId(item.id_major);
                setDialogOpen((prev) => ({ ...prev, update: true }));
            },
        },
        {
            label: "Delete",
            icon: <Delete fontSize="small" />,
            color: "error",
            onClick: (item) => {
                if (!window.confirm(`Yakin ingin menghapus jurusan "${item.name}"?`)) return;
                const service = new MajorService();
                service.delete(item.id_major, {
                    onSuccess: () => {
                        snackbar.success("Jurusan berhasil dihapus");
                        refresh();
                    },
                    onError: (err) => {
                        snackbar.error(err.message || "Gagal menghapus jurusan");
                    },
                });
            },
        },
    ];

    const renderActions = (item: MajorResponseModel) => (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
            {ListActions.map((action, index) => (
                <Tooltip key={index} title={action.label}>
                    <IconButton
                        size="small"
                        color={action.color}
                        onClick={() => action.onClick(item)}
                    >
                        {action.icon}
                    </IconButton>
                </Tooltip>
            ))}
        </div>
    );

    return (
        <>
            <TableHeader
                search={state.search.value}
                onSearchChange={handleSearch}
                sortBy={state.filters.sort}
                onSortByChange={handleSort}
                sortOptions={sortOptions}
                sortDir={(state.filters.order_by as "asc" | "desc") || "desc"}
                onSortDirChange={handleOrder}
            />

            <BaseTable breakpoint={1024}>
                <TableBody
                    header={majorHeaders}
                    isLoading={state.isLoading}
                    dataLength={tableData.length}
                    skeletonRows={5}
                >
                    {tableData.map((row, index) => {
                        const statusConfig = statusData[row.status ? 1 : 0] || {
                            label: row.status ? "Aktif" : "Non Aktif",
                            color: row.status ? "success" : "error",
                        };

                        const formattedCreatedAt = row.created_at
                            ? new Date(row.created_at).toLocaleDateString("id-ID", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                            })
                            : "-";

                        const formattedUpdatedAt = row.updated_at
                            ? new Date(row.updated_at).toLocaleDateString("id-ID", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                            })
                            : "-";

                        return (
                            <TableRow
                                key={row.id_major}
                                index={index}
                                header={majorHeaders}
                                actions={renderActions(row)}
                            >
                                <TableCell sx={{ py: 1.5, fontFamily: "monospace", fontSize: "0.825rem" }}>
                                    <Tooltip title={row.id_major}>
                                        <span>
                                            {row.id_major ? `${row.id_major.substring(0, 8)}...` : "-"}
                                        </span>
                                    </Tooltip>
                                </TableCell>
                                <TableCell sx={{ py: 1.5, fontWeight: 600 }}>
                                    {row.name}
                                </TableCell>
                                <TableCell sx={{ py: 1.5 }}>
                                    <Chip
                                        label={statusConfig.label}
                                        color={statusConfig.color}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell sx={{ py: 1.5 }}>
                                    {formattedCreatedAt}
                                </TableCell>
                                <TableCell sx={{ py: 1.5 }}>
                                    {formattedUpdatedAt}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
                <TableFooter>
                    <TablePagination
                        currentPage={state.pagination.page}
                        totalPage={state.pagination.total_pages}
                        onChange={handleChangePage}
                    />
                </TableFooter>
            </BaseTable>

            {updateId && isDialogOpen.update && (
                <UpdateMajorCardDialog
                    id={updateId}
                    isOpen={isDialogOpen.update}
                    onClose={() => {
                        setUpdateId(null);
                        setDialogOpen((prev) => ({ ...prev, update: false }));
                        setState((prev) => ({ ...prev, updateMajorReqDetails: null }));
                    }}
                />
            )}

            {detailId && isDialogOpen.detail && (
                <DetailMajorCardDialog
                    id={detailId}
                    isOpen={isDialogOpen.detail}
                    onClose={() => {
                        setDetailId(null);
                        setDialogOpen((prev) => ({ ...prev, detail: false }));
                    }}
                />
            )}
        </>
    );
};

export default MajorTable;
