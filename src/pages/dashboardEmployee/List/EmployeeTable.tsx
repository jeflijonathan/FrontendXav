import { useEffect, useRef, useState } from "react";
import { BaseTable, TableHeader } from "@components/Table";
import TableBody from "@components/Table/TableBody";
import TableRow from "@components/Table/TableRow";
import TableFooter from "@components/Table/TableFooter";
import TablePagination from "@components/Table/TablePagination";
import { TableCell, Chip, IconButton, type IconButtonProps } from "@mui/material";
import { Edit, Visibility, Delete } from "@mui/icons-material";
import useEmployeeList from "./hook/useEmployeeList";
import useEmployeeFilters from "./hook/useEmployeeFilters";
import useDashboardEmployeeStore from "../store";
import { filterEmployeeMapper } from "./utils/FilterEmployeeMapper";
import type { EmployeeResponseModel } from "@api/employee/model";
import DetailEmployeeCardDialog from "../Detail/DetailEmployeeCardDialog";
import EmployeeService from "@api/employee/service";
import UpdateEmployeeCardDialog from "../Update/UpdateEmployeeCardDialog";

const EmployeeTable = () => {
    const { state, setState } = useDashboardEmployeeStore();
    const { tableData, fetchEmployeeList, statusData, employeeHeaders, sortOptions } = useEmployeeList();
    const { handleChangePage, handleSearch, handleSort, handleOrder } = useEmployeeFilters();

    const [updateId, setUpdateId] = useState<string | null>(null);
    const [detailId, setDetailId] = useState<string | null>(null);
    const [isDialogOpen, setDialogOpen] = useState({ update: false, detail: false });

    const refresh = () => {
        const latestState = useDashboardEmployeeStore.getState().state;
        return fetchEmployeeList(filterEmployeeMapper(latestState));
    };

    // Debounce search to avoid firing too many requests while typing
    const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(function loadEmployeeData() {
        if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
        searchDebounceRef.current = setTimeout(() => {
            refresh();
        }, 400);
        return () => {
            if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
        };
    }, [state.pagination.page, state.search.value, state.filters.sort, state.filters.order_by]);

    const ListActions: Array<{
        label: string;
        icon: React.ReactNode;
        color: IconButtonProps["color"];
        onClick: (item: EmployeeResponseModel) => void;
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
                    setState((prev) => ({
                        ...prev,
                        updateEmployeeReqDetails: item,
                        profileFile: null,
                    }));
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
                    const service = new EmployeeService();
                    service.delete(item.id, {
                        onSuccess: () => refresh(),
                        onError: (err) => console.error(err),
                    });
                },
            },
        ];

    const renderActions = (item: EmployeeResponseModel) => (
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
                <TableBody header={employeeHeaders} isLoading={state.isLoading} dataLength={tableData.length} skeletonRows={3}>
                    {tableData.map((row, index) => (
                        <TableRow key={row.id} index={index} header={employeeHeaders} actions={renderActions(row)}>
                            <TableCell sx={{ py: 1 }}>{row.niy}</TableCell>
                            <TableCell sx={{ py: 1 }}>
                                {row.profile_url ? (
                                    <img 
                                        src={`${import.meta.env.VITE_BACKEND_URL}/api/upload/${row.profile_url}`} 
                                        alt="profile" 
                                        style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} 
                                    />
                                ) : (
                                    <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>-</div>
                                )}
                            </TableCell>
                            <TableCell sx={{ py: 1 }}>{`${row.first_name} ${row.last_name || ''}`}</TableCell>
                            <TableCell sx={{ py: 1 }}>
                                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                    {row.user?.roles?.length ? row.user.roles.map(r => (
                                        <Chip key={r.id} label={r.name} size="small" variant="outlined" color="primary" />
                                    )) : "-"}
                                </div>
                            </TableCell>
                            <TableCell sx={{ py: 1 }}>{row.email}</TableCell>
                            <TableCell sx={{ py: 1 }}>{row.detail?.phone_number || "-"}</TableCell>
                            <TableCell sx={{ py: 1 }}>{row.detail?.gender === "L" ? "Laki-laki" : row.detail?.gender === "P" ? "Perempuan" : "-"}</TableCell>
                            <TableCell sx={{ py: 1 }}>
                                <Chip label={statusData[Number(row.status)].label} color={statusData[Number(row.status)].color} size="small" />
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
                <UpdateEmployeeCardDialog id={updateId} isOpen={isDialogOpen.update}
                    onClose={() => { setUpdateId(null); setDialogOpen((prev) => ({ ...prev, update: false })); setState(prev => ({ ...prev, updateEmployeeReqDetails: null, profileFile: null })); }} />
            )}

            {detailId && isDialogOpen.detail && (
                <DetailEmployeeCardDialog id={detailId} isOpen={isDialogOpen.detail}
                    onClose={() => { setDetailId(null); setDialogOpen((prev) => ({ ...prev, detail: false })); }} />
            )}
        </>
    );
};

export default EmployeeTable;
