/**
 * CategorySubjectTable — Representation Logic
 *
 * Renders Category Subject list table with:
 * - Search bar, Sort & Order options
 * - Columns: id, name, status, created_at, updated_at, deleted_at, and actions
 * - Footer with limit selector aligned with pagination and total data count
 * - Action buttons: Detail, Edit, Delete (with BaseDialog confirmation)
 *
 * Layer: Representation Logic
 */
import {
    TableCell,
    Chip,
    IconButton,
    type IconButtonProps,
    Typography,
    Tooltip,
} from "@mui/material";
import { Edit, Visibility, Delete } from "@mui/icons-material";
import { BaseTable, TableHeader } from "@components/Table";
import TableBody from "@components/Table/TableBody";
import TableRow from "@components/Table/TableRow";
import TableFooter from "@components/Table/TableFooter";
import TablePagination from "@components/Table/TablePagination";

import useCategorySubjectTable from "./hook/useCategorySubjectTable";
import {
    formatCategoryDate,
    resolveCategoryStatusChip,
    resolveCategoryId,
} from "./utils/categorySubjectHelper";
import type { CategorySubjectResponseModel } from "@api/categorysubject/model";

import DetailCategorySubjectCardDialog from "../Detail/DetailCategorySubjectCardDialog";
import UpdateCategorySubjectCardDialog from "../Update/UpdateCategorySubjectCardDialog";

const CategorySubjectTable = () => {
    const {
        state,
        tableData,
        headers,
        sortOptions,
        statusData,
        handleChangePage,
        handleFilterLimit,
        handleSearch,
        handleSort,
        handleOrder,
        updateId,
        detailId,
        isDialogOpen,
        openDetailDialog,
        closeDetailDialog,
        openUpdateDialog,
        closeUpdateDialog,
    } = useCategorySubjectTable();

    const ListActions: Array<{
        label: string;
        icon: React.ReactNode;
        color: IconButtonProps["color"];
        onClick: (item: CategorySubjectResponseModel) => void;
    }> = [
            {
                label: "Detail",
                icon: <Visibility fontSize="small" />,
                color: "info",
                onClick: openDetailDialog,
            },
            {
                label: "Edit",
                icon: <Edit fontSize="small" />,
                color: "primary",
                onClick: openUpdateDialog,
            },
        ];

    const renderActions = (item: CategorySubjectResponseModel) => (
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
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
        <div className="flex flex-col gap-4">
            <TableHeader
                search={state.search.value}
                onSearchChange={handleSearch}
                sortBy={state.filters.sort}
                onSortByChange={handleSort}
                sortOptions={sortOptions}
                sortDir={(state.filters.order_by as "asc" | "desc") || "desc"}
                onSortDirChange={handleOrder}
            />

            <BaseTable breakpoint={1200}>
                <TableBody
                    header={headers}
                    isLoading={state.isLoading}
                    dataLength={tableData.length}
                    skeletonRows={5}
                >
                    {tableData.map((row, index) => {
                        const id = resolveCategoryId(row);
                        const statusChip = resolveCategoryStatusChip(row.status);

                        return (
                            <TableRow
                                key={id || index}
                                index={index}
                                header={headers}
                                actions={renderActions(row)}
                            >
                                {/* ID */}
                                <TableCell sx={{ py: 1 }}>
                                    <Tooltip title={id} arrow>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontFamily: "monospace",
                                                fontSize: "0.8rem",
                                                maxWidth: 180,
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {id}
                                        </Typography>
                                    </Tooltip>
                                </TableCell>

                                {/* Nama Kategori */}
                                <TableCell sx={{ py: 1, fontWeight: 600 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        {row.name || "-"}
                                    </Typography>
                                </TableCell>

                                {/* Status */}
                                <TableCell sx={{ py: 1 }}>
                                    <Chip
                                        label={statusData[Number(row.status)]?.label || statusChip.label}
                                        color={statusData[Number(row.status)]?.color || statusChip.color}
                                        size="small"
                                    />
                                </TableCell>

                                {/* Dibuat Pada (created_at) */}
                                <TableCell sx={{ py: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        {formatCategoryDate(row.created_at)}
                                    </Typography>
                                </TableCell>

                                <TableCell sx={{ py: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        {formatCategoryDate(row.updated_at)}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
                <TableFooter>
                    <TablePagination
                        currentPage={state.pagination.page}
                        totalPage={state.pagination.total_pages}
                        totalData={state.pagination.total_data}
                        limit={state.pagination.limit}
                        onLimitChange={handleFilterLimit}
                        limitOptions={[5, 10, 25, 50, 100]}
                        onChange={handleChangePage}
                    />
                </TableFooter>
            </BaseTable>

            {/* Detail Dialog */}
            {detailId && isDialogOpen.detail && (
                <DetailCategorySubjectCardDialog
                    id={detailId}
                    isOpen={isDialogOpen.detail}
                    onClose={closeDetailDialog}
                />
            )}

            {/* Update Dialog */}
            {updateId && isDialogOpen.update && (
                <UpdateCategorySubjectCardDialog
                    id={updateId}
                    isOpen={isDialogOpen.update}
                    onClose={closeUpdateDialog}
                />
            )}
        </div>
    );
};

export default CategorySubjectTable;

