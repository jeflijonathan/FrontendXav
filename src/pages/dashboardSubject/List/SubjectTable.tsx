/**
 * SubjectTable — Representation Logic
 *
 * Renders Subject list table with:
 * - Search bar, Filter Grade (10, 11, 12), Filter Major, Filter Category, Filter Status, Sort & Order
 * - Columns: ID, Subject Name, Grade (10/11/12), Phase (E/F), Major, Category, Status, Created At, Updated At, Deleted At, Actions
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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { Edit, Visibility, Delete, Category, School } from "@mui/icons-material";
import { BaseTable, TableHeader } from "@components/Table";
import TableBody from "@components/Table/TableBody";
import TableRow from "@components/Table/TableRow";
import TableFooter from "@components/Table/TableFooter";
import TablePagination from "@components/Table/TablePagination";

import useSubjectTable from "./hook/useSubjectTable";
import {
    formatSubjectDate,
    resolveSubjectStatusChip,
    resolveSubjectId,
    resolveSubjectCategory,
    resolveSubjectMajor,
    getFaseChipConfig,
} from "./utils/subjectHelper";
import type { SubjectResponseModel } from "@api/subject/model";

import DetailSubjectCardDialog from "../Detail/DetailSubjectCardDialog";
import UpdateSubjectCardDialog from "../Update/UpdateSubjectCardDialog";
import DeleteSubjectConfirmDialog from "../Delete/DeleteSubjectConfirmDialog";

const KELAS_FILTER_OPTIONS = [
    { label: "All Grades", value: "" },
    { label: "Grade 10", value: "10" },
    { label: "Grade 11", value: "11" },
    { label: "Grade 12", value: "12" },
];

const STATUS_FILTER_OPTIONS = [
    { label: "All Status", value: "" },
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
];

const SubjectTable = () => {
    const {
        state,
        tableData,
        categories,
        majors,
        headers,
        sortOptions,
        statusData,
        detailId,
        updateId,
        deleteTarget,
        isDialogOpen,
        handleSearch,
        handleSort,
        handleOrder,
        handleFilterCategory,
        handleFilterMajor,
        handleFilterKelas,
        handleFilterStatus,
        handleFilterLimit,
        handleChangePage,
        openDetailDialog,
        closeDetailDialog,
        openUpdateDialog,
        closeUpdateDialog,
        openDeleteDialog,
        closeDeleteDialog,
        refresh,
    } = useSubjectTable();

    interface ActionItem {
        label: string;
        icon: React.ReactNode;
        color: IconButtonProps["color"];
        onClick: (item: SubjectResponseModel) => void;
    }

    const ListActions: ActionItem[] = [
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
        {
            label: "Delete",
            icon: <Delete fontSize="small" />,
            color: "error",
            onClick: openDeleteDialog,
        },
    ];

    const renderActions = (item: SubjectResponseModel) => (
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
            {/* Filter Bar: Grade, Major, Category & Status */}
            <div className="bg-theme-secondary/40 border border-light-dark p-3.5 rounded-xl flex flex-wrap items-center gap-3">
                {/* Filter Grade (10, 11, 12) */}
                <FormControl size="small" sx={{ minWidth: 140, flex: { xs: "1 1 auto", sm: "0 0 auto" } }}>
                    <InputLabel id="filter-tingkat-label">Grade</InputLabel>
                    <Select
                        labelId="filter-tingkat-label"
                        label="Grade"
                        value={state.filters.kelas}
                        onChange={(e) => handleFilterKelas(e.target.value)}
                        sx={{ borderRadius: "8px", fontWeight: 600 }}
                    >
                        {KELAS_FILTER_OPTIONS.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Filter Major */}
                <FormControl size="small" sx={{ minWidth: 180, flex: { xs: "1 1 auto", sm: "0 0 auto" } }}>
                    <InputLabel id="filter-major-label">Major</InputLabel>
                    <Select
                        labelId="filter-major-label"
                        label="Major"
                        value={state.filters.id_major}
                        onChange={(e) => handleFilterMajor(e.target.value)}
                        sx={{ borderRadius: "8px" }}
                        startAdornment={
                            <School sx={{ color: "primary.main", mr: 1, fontSize: 20 }} />
                        }
                    >
                        <MenuItem value="">
                            <em>All Majors</em>
                        </MenuItem>
                        {majors.map((m) => {
                            const mId = m.id_major || m.id || "";
                            return (
                                <MenuItem key={mId} value={mId}>
                                    {m.name}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>

                {/* Filter Category */}
                <FormControl size="small" sx={{ minWidth: 180, flex: { xs: "1 1 auto", sm: "0 0 auto" } }}>
                    <InputLabel id="filter-category-label">Category</InputLabel>
                    <Select
                        labelId="filter-category-label"
                        label="Category"
                        value={state.filters.id_category_subject}
                        onChange={(e) => handleFilterCategory(e.target.value)}
                        sx={{ borderRadius: "8px", fontWeight: 600 }}
                        startAdornment={
                            <Category sx={{ color: "primary.main", mr: 1, fontSize: 20 }} />
                        }
                    >
                        <MenuItem value="">
                            <em>All Categories</em>
                        </MenuItem>
                        {categories.map((cat) => {
                            const catId = cat.id || cat.id_category_subject || "";
                            return (
                                <MenuItem key={catId} value={catId}>
                                    {cat.name}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>

                {/* Filter Status */}
                <FormControl size="small" sx={{ minWidth: 130, flex: { xs: "1 1 auto", sm: "0 0 auto" } }}>
                    <InputLabel id="filter-status-label">Status</InputLabel>
                    <Select
                        labelId="filter-status-label"
                        label="Status"
                        value={state.filters.status}
                        onChange={(e) => handleFilterStatus(e.target.value)}
                        sx={{ borderRadius: "8px" }}
                    >
                        {STATUS_FILTER_OPTIONS.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>

            {/* Table Header: Search, Sort, Order */}
            <TableHeader
                search={state.search.value}
                onSearchChange={handleSearch}
                sortBy={state.filters.sort}
                onSortByChange={handleSort}
                sortOptions={sortOptions}
                sortDir={(state.filters.order_by as "asc" | "desc") || "desc"}
                onSortDirChange={handleOrder}
            />

            {/* Base Table */}
            <BaseTable breakpoint={1200}>
                <TableBody
                    header={headers}
                    isLoading={state.isLoading}
                    dataLength={tableData.length}
                    skeletonRows={5}
                >
                    {tableData.map((row, index) => {
                        const id = resolveSubjectId(row);
                        const statusChip = resolveSubjectStatusChip(row.status);
                        const category = resolveSubjectCategory(row, categories);
                        const major = resolveSubjectMajor(row, majors);
                        const faseChip = getFaseChipConfig(row.fase, row.kelas);

                        return (
                            <TableRow
                                key={id || index}
                                index={index}
                                header={headers}
                                actions={renderActions(row)}
                            >
                                {/* ID (varchar) */}
                                <TableCell sx={{ py: 1 }}>
                                    <Tooltip title={id} arrow>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontFamily: "monospace",
                                                fontSize: "0.8rem",
                                                maxWidth: 140,
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {id}
                                        </Typography>
                                    </Tooltip>
                                </TableCell>

                                {/* Subject Name */}
                                <TableCell sx={{ py: 1, fontWeight: 600 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        {row.name || "-"}
                                    </Typography>
                                    {row.code_subject && (
                                        <Typography variant="caption" color="text.secondary">
                                            Code: {row.code_subject}
                                        </Typography>
                                    )}
                                </TableCell>

                                {/* Grade (10, 11, 12) */}
                                <TableCell sx={{ py: 1 }}>
                                    <Chip
                                        label={row.kelas ? `kelas ${row.kelas}` : "-"}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                        sx={{ fontWeight: 600 }}
                                    />
                                </TableCell>

                                {/* Phase (E for Grade 10, F for Grade 11-12) */}
                                <TableCell sx={{ py: 1 }}>
                                    <Tooltip
                                        title={
                                            row.kelas === "10"
                                                ? "Fase E (designated for Grade 10)"
                                                : "Fase F (designated for Grade 11-12)"
                                        }
                                        arrow
                                    >
                                        <Chip
                                            label={faseChip.label}
                                            size="small"
                                            color={faseChip.color}
                                            sx={{ fontWeight: 600 }}
                                        />
                                    </Tooltip>
                                </TableCell>

                                {/* Major */}
                                <TableCell sx={{ py: 1 }}>
                                    {major?.name ? (
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                            {major.name}
                                        </Typography>
                                    ) : (
                                        <Typography variant="caption" color="text.secondary">
                                            General (All Majors)
                                        </Typography>
                                    )}
                                </TableCell>

                                {/* Category */}
                                <TableCell sx={{ py: 1 }}>
                                    {category?.name ? (
                                        <Chip
                                            label={category.name}
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                            sx={{ fontWeight: 600 }}
                                        />
                                    ) : (
                                        <Typography variant="body2" color="text.disabled">
                                            -
                                        </Typography>
                                    )}
                                </TableCell>

                                {/* Status */}
                                <TableCell sx={{ py: 1 }}>
                                    <Chip
                                        label={statusData[Number(row.status)]?.label || statusChip.label}
                                        color={statusData[Number(row.status)]?.color || statusChip.color}
                                        size="small"
                                    />
                                </TableCell>

                                {/* Created At (created_at) */}
                                <TableCell sx={{ py: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        {formatSubjectDate(row.created_at)}
                                    </Typography>
                                </TableCell>

                                {/* Updated At (updated_at) */}
                                <TableCell sx={{ py: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        {formatSubjectDate(row.updated_at)}
                                    </Typography>
                                </TableCell>

                                {/* Deleted At (deleted_at) */}
                                <TableCell sx={{ py: 1 }}>
                                    {row.deleted_at ? (
                                        <Typography variant="body2" color="error.main">
                                            {formatSubjectDate(row.deleted_at)}
                                        </Typography>
                                    ) : (
                                        <Typography variant="caption" color="text.disabled">
                                            -
                                        </Typography>
                                    )}
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
                <DetailSubjectCardDialog
                    id={detailId}
                    isOpen={isDialogOpen.detail}
                    onClose={closeDetailDialog}
                />
            )}

            {/* Update Dialog */}
            {updateId && isDialogOpen.update && (
                <UpdateSubjectCardDialog
                    id={updateId}
                    isOpen={isDialogOpen.update}
                    onClose={closeUpdateDialog}
                />
            )}

            {/* Delete Confirmation Dialog */}
            {deleteTarget && isDialogOpen.delete && (
                <DeleteSubjectConfirmDialog
                    target={deleteTarget}
                    isOpen={isDialogOpen.delete}
                    onClose={closeDeleteDialog}
                    onDeleted={refresh}
                />
            )}
        </div>
    );
};

export default SubjectTable;
