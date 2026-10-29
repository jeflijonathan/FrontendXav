import { useEffect, useState } from "react";
import { BaseTable, TableHeader } from "@components/Table";
import TableBody from "@components/Table/TableBody";
import TableRow from "@components/Table/TableRow";
import TableFooter from "@components/Table/TableFooter";
import TablePagination from "@components/Table/TablePagination";
import { TableCell, Chip, IconButton, type IconButtonProps } from "@mui/material";
import { Edit, Visibility, Delete } from "@mui/icons-material";
import useStudentList from "./hook/useStudentList";
import useStudentFilters from "./hook/useStudentFilters";
import useDashboardStudentStore from "../store";
import { filterStudentMapper } from "./utils/FilterStudentMapper";
import type { StudentResponseModel } from "@api/student/model";
import DetailStudentCardDialog from "../Detail/DetailStudentCardDialog";
import StudentService from "@api/student/service";
import UpdateStudentCardDialog from "../Update/UpdateStudentCardDialog";

const StudentTable = () => {
    const { state } = useDashboardStudentStore();
    const { tableData, fetchStudentList, statusData, studentHeaders, sortOptions } = useStudentList();
    const { handleChangePage, handleSearch, handleSort, handleOrder } = useStudentFilters();

    const [updateId, setUpdateId] = useState<string | null>(null);
    const [detailId, setDetailId] = useState<string | null>(null);
    const [isDialogOpen, setDialogOpen] = useState({ update: false, detail: false });

    const refresh = () => fetchStudentList(filterStudentMapper(state));

    useEffect(function loadStudentData() {
        refresh();
    }, [state.pagination.page, state.search.value, state.filters.sort, state.filters.order_by]);

    const ListActions: Array<{
        label: string;
        icon: React.ReactNode;
        color: IconButtonProps["color"];
        onClick: (item: StudentResponseModel) => void;
    }> = [
        {
            label: "Detail",
            icon: <Visibility fontSize="small" />,
            color: "info",
            onClick: (item) => {
                setDetailId(item.id);
                setDialogOpen((prev) => ({ ...prev, detail: true }));
            },
        },
        {
            label: "Edit",
            icon: <Edit fontSize="small" />,
            color: "primary",
            onClick: (item) => {
                setUpdateId(item.id);
                setDialogOpen((prev) => ({ ...prev, update: true }));
            },
        },
        {
            label: "Delete",
            icon: <Delete fontSize="small" />,
            color: "error",
            onClick: (item) => {
                if (!window.confirm(`Yakin ingin menghapus ${item.first_name} ${item.last_name}?`)) return;
                const service = new StudentService();
                service.delete(item.id, {
                    onSuccess: () => refresh(),
                    onError: (err) => console.error(err),
                });
            },
        },
    ];

    const renderActions = (item: StudentResponseModel) => (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
            {ListActions.map((action, index) => (
                <IconButton key={index} size="small" color={action.color} onClick={() => action.onClick(item)} title={action.label}>
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
                <TableBody header={studentHeaders} isLoading={state.isLoading} dataLength={tableData.length} skeletonRows={3}>
                    {tableData.map((row, index) => (
                        <TableRow key={row.id} index={index} header={studentHeaders} actions={renderActions(row)}>
                            <TableCell sx={{ py: 1 }}>{row.nis}</TableCell>
                            <TableCell sx={{ py: 1 }}>{row.nisn}</TableCell>
                            <TableCell sx={{ py: 1 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    {row.profile_url ? (
                                        <img
                                            src={`${import.meta.env.VITE_BACKEND_URL}/api/upload/${row.profile_url}`}
                                            alt="profile"
                                            style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover" }}
                                        />
                                    ) : (
                                        <div style={{ width: 34, height: 34, borderRadius: "50%", backgroundColor: "#eee", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8125rem", fontWeight: 600 }}>
                                            {row.first_name?.[0]?.toUpperCase() || "-"}
                                        </div>
                                    )}
                                    <span>{`${row.first_name} ${row.last_name}`}</span>
                                </div>
                            </TableCell>
                            <TableCell sx={{ py: 1 }}>
                                <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                                    {row.roles && row.roles.length > 0 ? (
                                        row.roles.map((r) => (
                                            <Chip
                                                key={r.id}
                                                label={r.name === "siswa" ? "Siswa" : r.name === "pengurus_kelas" ? "Pengurus Kelas" : r.name}
                                                color={r.name === "pengurus_kelas" ? "primary" : "default"}
                                                size="small"
                                                variant={r.name === "pengurus_kelas" ? "filled" : "outlined"}
                                            />
                                        ))
                                    ) : (
                                        <Chip label="Siswa" size="small" variant="outlined" />
                                    )}
                                </div>
                            </TableCell>
                            <TableCell sx={{ py: 1 }}>{row.phone_number || "-"}</TableCell>
                            <TableCell sx={{ py: 1 }}>{row.gender === "L" ? "Laki-laki" : "Perempuan"}</TableCell>
                            <TableCell sx={{ py: 1 }}>
                                <Chip label={statusData[Number(row.status)]?.label ?? "Aktif"} color={statusData[Number(row.status)]?.color ?? "success"} size="small" />
                            </TableCell>
                            <TableCell sx={{ py: 1 }}>{row.created_at ? new Date(row.created_at).toLocaleDateString() : "-"}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TablePagination currentPage={state.pagination.page} totalPage={state.pagination.total_pages} onChange={handleChangePage} />
                </TableFooter>
            </BaseTable>

            {updateId && isDialogOpen.update && (
                <UpdateStudentCardDialog id={updateId} isOpen={isDialogOpen.update}
                    onClose={() => { setUpdateId(null); setDialogOpen((prev) => ({ ...prev, update: false })); }} />
            )}

            {detailId && isDialogOpen.detail && (
                <DetailStudentCardDialog id={detailId} isOpen={isDialogOpen.detail}
                    onClose={() => { setDetailId(null); setDialogOpen((prev) => ({ ...prev, detail: false })); }} />
            )}
        </>
    );
};

export default StudentTable;
