/**
 * ClassTable — Representation Logic
 *
 * Pure UI component. Renders the class list table with filters, pagination,
 * and action dialogs. All state management is delegated to useClassTable (Framework Logic).
 * All data transformations are delegated to classTableHelper (Business Logic).
 *
 * Layer: Representation Logic (JSX, styling, conditional rendering)
 */
import {
    TableCell,
    Chip,
    IconButton,
    type IconButtonProps,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
} from "@mui/material";
import { Edit, Visibility, CalendarMonth, Groups } from "@mui/icons-material";
import { BaseTable, TableHeader } from "@components/Table";
import TableBody from "@components/Table/TableBody";
import TableRow from "@components/Table/TableRow";
import TableFooter from "@components/Table/TableFooter";
import TablePagination from "@components/Table/TablePagination";

import useClassTable from "./hook/useClassTable";
import {
    resolveClassRow,
    resolveStatusChip,
    formatClassDate,
} from "./utils/classTableHelper";
import type { ClassResponseModel } from "@api/class/model";
import type { SchoolInformationResponseModel } from "@api/schoolinformation/model";
import type { MajorResponseModel } from "@api/major/model";

import DetailClassCardDialog from "../Detail/DetailClassCardDialog";
import UpdateClassCardDialog from "../Update/UpdateClassCardDialog";
import ManageClassStudentsDialog from "../ManageStudents/ManageClassStudentsDialog";

// ─── Filter constants ─────────────────────────────────────────────────────────

const KELAS_FILTER_OPTIONS = [
    { label: "Semua Tingkat", value: "" },
    { label: "Kelas 10", value: "10" },
    { label: "Kelas 11", value: "11" },
    { label: "Kelas 12", value: "12" },
];

const STATUS_FILTER_OPTIONS = [
    { label: "Semua Status", value: "" },
    { label: "Aktif", value: "true" },
    { label: "Non Aktif", value: "false" },
];

// ─── Component ────────────────────────────────────────────────────────────────

const ClassTable = () => {
    const {
        state,
        tableData,
        statusData,
        classHeaders,
        sortOptions,
        handleChangePage,
        handleSearch,
        handleSort,
        handleOrder,
        handleFilterPeriode,
        handleFilterKelas,
        handleFilterMajor,
        handleFilterStatus,
        handleFilterLimit,
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
    } = useClassTable();

    // Action buttons config per row
    const ListActions: Array<{
        label: string;
        icon: React.ReactNode;
        color: IconButtonProps["color"];
        onClick: (item: ClassResponseModel) => void;
    }> = [
        {
            label: "Detail",
            icon: <Visibility fontSize="small" />,
            color: "info",
            onClick: openDetailDialog,
        },
        {
            label: "Kelola Siswa",
            icon: <Groups fontSize="small" />,
            color: "primary",
            onClick: openManageStudentsDialog,
        },
        {
            label: "Edit",
            icon: <Edit fontSize="small" />,
            color: "primary",
            onClick: openUpdateDialog,
        },
    ];

    const renderActions = (item: ClassResponseModel) => (
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
            {/* Filter Bar: Periode, Tingkat, Jurusan, Status */}
            <div className="bg-theme-secondary/40 border border-light-dark p-3.5 rounded-xl flex flex-wrap items-center gap-3">
                {/* Filter Periode */}
                <FormControl size="small" sx={{ minWidth: 200, flex: { xs: "1 1 100%", sm: "0 0 auto" } }}>
                    <InputLabel id="filter-periode-label">Periode</InputLabel>
                    <Select
                        labelId="filter-periode-label"
                        label="Periode"
                        value={state.filters.id_school_information}
                        onChange={(e) => handleFilterPeriode(e.target.value)}
                        sx={{ borderRadius: "8px", fontWeight: 600 }}
                        startAdornment={
                            <CalendarMonth sx={{ color: "primary.main", mr: 1, fontSize: 20 }} />
                        }
                    >
                        <MenuItem value="">
                            <em>Semua Periode</em>
                        </MenuItem>
                        {state.schoolInformations.map((si: SchoolInformationResponseModel) => (
                            <MenuItem key={si.id_school_information} value={si.id_school_information}>
                                {si.periode || "Periode"} {si.status ? "(Aktif)" : ""}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Filter Tingkat */}
                <FormControl size="small" sx={{ minWidth: 140, flex: { xs: "1 1 auto", sm: "0 0 auto" } }}>
                    <InputLabel id="filter-tingkat-label">Tingkat</InputLabel>
                    <Select
                        labelId="filter-tingkat-label"
                        label="Tingkat"
                        value={state.filters.kelas}
                        onChange={(e) => handleFilterKelas(e.target.value)}
                        sx={{ borderRadius: "8px" }}
                    >
                        {KELAS_FILTER_OPTIONS.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Filter Jurusan */}
                <FormControl size="small" sx={{ minWidth: 160, flex: { xs: "1 1 auto", sm: "0 0 auto" } }}>
                    <InputLabel id="filter-major-label">Jurusan</InputLabel>
                    <Select
                        labelId="filter-major-label"
                        label="Jurusan"
                        value={state.filters.id_major}
                        onChange={(e) => handleFilterMajor(e.target.value)}
                        sx={{ borderRadius: "8px" }}
                    >
                        <MenuItem value="">Semua Jurusan</MenuItem>
                        {state.majors.map((m: MajorResponseModel) => (
                            <MenuItem key={m.id_major} value={m.id_major}>
                                {m.name}
                            </MenuItem>
                        ))}
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

            {/* Data Table */}
            <BaseTable breakpoint={1200}>
                <TableBody
                    header={classHeaders}
                    isLoading={state.isLoading}
                    dataLength={tableData.length}
                    skeletonRows={5}
                >
                    {tableData.map((row, index) => {
                        // Business logic resolved via pure helper
                        const { major, guardian, period } = resolveClassRow(
                            row,
                            state.majors,
                            state.employees,
                            state.schoolInformations
                        );
                        const statusChip = resolveStatusChip(row.status, statusData);

                        return (
                            <TableRow
                                key={row.id_class || row.id || index}
                                index={index}
                                header={classHeaders}
                                actions={renderActions(row)}
                            >
                                {/* Tingkat */}
                                <TableCell sx={{ py: 1 }}>
                                    <Chip
                                        label={row.kelas ? `Kelas ${row.kelas}` : "-"}
                                        size="small"
                                        variant="outlined"
                                        color="primary"
                                        sx={{ fontWeight: 600 }}
                                    />
                                </TableCell>

                                {/* Nama Kelas */}
                                <TableCell sx={{ py: 1, fontWeight: 600 }}>
                                    {row.name || "-"}
                                </TableCell>

                                {/* Jurusan */}
                                <TableCell sx={{ py: 1 }}>
                                    {major?.name ? (
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                            {major.name}
                                        </Typography>
                                    ) : (
                                        row.id_major || "-"
                                    )}
                                </TableCell>

                                {/* Wali Kelas */}
                                <TableCell sx={{ py: 1 }}>
                                    {guardian ? (
                                        <div>
                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                {guardian.first_name} {guardian.last_name || ""}
                                            </Typography>
                                            {guardian.niy && (
                                                <Typography variant="caption" color="text.secondary">
                                                    NIY: {guardian.niy}
                                                </Typography>
                                            )}
                                        </div>
                                    ) : (
                                        <Typography variant="caption" color="text.disabled">
                                            Belum ditentukan
                                        </Typography>
                                    )}
                                </TableCell>

                                {/* Periode */}
                                <TableCell sx={{ py: 1 }}>
                                    {period?.periode ? (
                                        <Typography variant="body2" color="text.secondary">
                                            {period.periode}
                                        </Typography>
                                    ) : (
                                        <Typography variant="caption" color="text.disabled">
                                            -
                                        </Typography>
                                    )}
                                </TableCell>

                                {/* Status */}
                                <TableCell sx={{ py: 1 }}>
                                    <Chip
                                        label={statusChip.label}
                                        color={statusChip.color}
                                        size="small"
                                    />
                                </TableCell>

                                {/* Dibuat Pada */}
                                <TableCell sx={{ py: 1 }}>
                                    {formatClassDate(row.created_at)}
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
                        onChange={handleChangePage}
                    />
                </TableFooter>
            </BaseTable>

            {/* Update Dialog */}
            {updateId && isDialogOpen.update && (
                <UpdateClassCardDialog
                    id={updateId}
                    isOpen={isDialogOpen.update}
                    onClose={closeUpdateDialog}
                />
            )}

            {/* Detail Dialog */}
            {detailId && isDialogOpen.detail && (
                <DetailClassCardDialog
                    id={detailId}
                    isOpen={isDialogOpen.detail}
                    onClose={closeDetailDialog}
                />
            )}

            {/* Manage Students Dialog */}
            {manageStudentsClass && isManageStudentsOpen && (
                <ManageClassStudentsDialog
                    classItem={manageStudentsClass}
                    isOpen={isManageStudentsOpen}
                    onClose={closeManageStudentsDialog}
                    onClassUpdated={refresh}
                />
            )}
        </div>
    );
};

export default ClassTable;
