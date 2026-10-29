import { useEffect, useState } from "react";
import { BaseTable, TableHeader } from "@components/Table";
import TableBody from "@components/Table/TableBody";
import TableRow from "@components/Table/TableRow";
import TableFooter from "@components/Table/TableFooter";
import TablePagination from "@components/Table/TablePagination";
import { TableCell, Chip, IconButton, type IconButtonProps } from "@mui/material";
import useAnnouncementList from "./hooks/useAnnouncementList";
import useAnnouncementFilter from "./hooks/useAnnouncementFilter";
import useDashboardAnnouncementStore from "../store";
import { Edit, Visibility } from "@mui/icons-material";
import listTableAnnouncementMapper, { type AnnouncementTableItem } from "./utils/listTableMapper";
import DetailAnnouncementCardDialog from "../Detail/DetailAnnouncementCardDialog";
import UpdateAnnouncementCardDialog from "../Update/UpdateAnnouncementCardDialog";

const AnnouncementTable = () => {
    const { state } = useDashboardAnnouncementStore();
    const { fetchAnnouncementList, statusData, sortOptions, tableHeader } = useAnnouncementList();
    const { handleChangePage, handleSearch, handleSort, handleOrder } = useAnnouncementFilter();

    const [updateId, setUpdateId] = useState<string | null>(null);
    const [detailId, setDetailId] = useState<string | null>(null);
    const dataMapper = listTableAnnouncementMapper(state.data);

    const refresh = () => fetchAnnouncementList();

    const [isDialogOpen, setDialogOpen] = useState({
        update: false,
        detail: false,
    });

    useEffect(function loadAnnouncementData() {
        refresh();
    }, [state.pagination.page, state.search.value, state.filters.sort, state.filters.order_by]);

    const ListActions: Array<{
        label: string;
        icon: React.ReactNode;
        color: IconButtonProps["color"];
        onClick: (item: any) => void;
    }> = [
            {
                label: "Read",
                icon: <Visibility fontSize="small" />,
                color: "info",
                onClick: (item) => {
                    setDetailId(item.id);
                    setDialogOpen(prev => ({ ...prev, detail: true }));
                },
            },
            {
                label: "Edit",
                icon: <Edit fontSize="small" />,
                color: "primary",
                onClick: (item) => {
                    setUpdateId(item.id);
                    setDialogOpen(prev => ({ ...prev, update: !prev.update }));
                },
            },
        ];

    const renderActions = (item: AnnouncementTableItem) => (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
            {ListActions.map((action, index) => (
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
            <TableHeader

                search={state.search.value}
                onSearchChange={handleSearch}
                sortBy={state.filters.sort}
                onSortByChange={handleSort}
                sortOptions={sortOptions}
                sortDir={(state.filters.order_by as "asc" | "desc") || "asc"}
                onSortDirChange={handleOrder}
            />

            <BaseTable breakpoint={1200}>
                <TableBody
                    header={tableHeader}
                    isLoading={state.isLoading}
                    dataLength={state.pagination.total_data}
                    skeletonRows={3}
                >
                    {dataMapper.map((row, index) => {
                        const currentStatus = statusData[Number(row.status)] || { label: "Unknown", color: "default" };

                        return (
                            <TableRow
                                key={row.id}
                                index={index}
                                header={tableHeader}
                                actions={renderActions(row)}
                            >
                                <TableCell sx={{ py: 1 }}>{row.title}</TableCell>
                                <TableCell sx={{ py: 1 }}>
                                    {row.description && row.description.length > 50 ? `${row.description.substring(0, 50)}...` : row.description || "-"}
                                </TableCell>
                                <TableCell sx={{ py: 1 }}>
                                    <Chip
                                        label={currentStatus.label}
                                        color={currentStatus.color}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell sx={{ py: 1 }}>
                                    {new Date(row.created_at).toLocaleDateString()}
                                </TableCell>
                                <TableCell sx={{ py: 1 }}>
                                    {new Date(row.updated_at).toLocaleDateString()}
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
                <UpdateAnnouncementCardDialog
                    isOpen={isDialogOpen.update}
                    announcementId={updateId}
                    onClose={() => {
                        setUpdateId(null);
                        setDialogOpen((prev) => ({ ...prev, update: false }));
                    }}
                />
            )}

            {detailId && isDialogOpen.detail && (
                <DetailAnnouncementCardDialog
                    isOpen={isDialogOpen.detail}
                    announcementId={detailId}
                    onClose={() => {
                        setDetailId(null);
                        setDialogOpen((prev) => ({ ...prev, detail: false }));
                    }}
                />
            )}
        </>
    );
};

export default AnnouncementTable;