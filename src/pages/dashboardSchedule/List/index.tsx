import { useEffect, useState } from "react";
import { BaseTable, TableBody, TablePagination, TableFooter, TableToolbar, ResponsiveTableRow } from "@components/Table";
import { Button, Chip } from "@mui/material";
import useScheduleList from "./hook/useScheduleList";
import useScheduleFilters from "./hook/useScheduleFilters";
import useDashboardScheduleStore from "../store";
import CreateScheduleFormCardDialog from "../Create/CreateScheduleFormCardDialog";
import UpdateScheduleFormCardDialog from "../Update/UpdateScheduleFormCardDialog";
import useDeleteSchedule from "../Delete/hook/useDeleteSchedule";

const sortOptions = [
    { label: "Created At", value: "created_at" },
];

const ScheduleTable = () => {
    const { state } = useDashboardScheduleStore();
    const { tableData, tableHeader, fetchList } = useScheduleList();
    const { handleChangePage, handleSearch, handleSort, handleOrder } = useScheduleFilters();
    const { handleDelete } = useDeleteSchedule();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [updateId, setUpdateId] = useState<string | null>(null);

    const refresh = () => fetchList();

    useEffect(() => {
        refresh();
    }, [state.pagination.page, state.search.value, state.filters.sort, state.filters.order_by]);

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-primary-txt">Jadwal Pelajaran (Schedule) Management</h1>
                <Button variant="contained" color="primary" onClick={() => setIsCreateOpen(true)}>
                    Create Schedule
                </Button>
            </div>
            
            <TableToolbar
                search={state.search.value}
                onSearchChange={handleSearch}
                sortBy={state.filters.sort}
                onSortByChange={handleSort}
                sortDir={state.filters.order_by as "asc" | "desc"}
                onSortDirChange={handleOrder}
                sortOptions={sortOptions}
            />

            <BaseTable>
                <TableBody
                    header={tableHeader}
                    isLoading={state.isLoading}
                    dataLength={tableData.length}
                    disableAction
                    className="bg-transparent"
                >
                    {tableData.map((row, index) => {
                        const columns = [
                            { label: "Class", content: row.class?.name || row.id_class },
                            { 
                                label: "Duty Teacher", 
                                content: row.duty_teacher 
                                    ? `${row.duty_teacher.first_name} ${row.duty_teacher.last_name}` 
                                    : row.id_duty_teacher 
                            },
                            { label: "Category Subject", content: row.category_subject?.name || row.id_category_subject },
                            { 
                                label: "Time Slot", 
                                content: row.schendule_time 
                                    ? `${row.schendule_time.hari}: ${row.schendule_time.jam_awal}-${row.schendule_time.jam_akhir}` 
                                    : row.id_schendule_time 
                            },
                            {
                                label: "Status",
                                content: (
                                    <Chip
                                        label={row.status}
                                        color={row.status === "active" ? "success" : "default"}
                                        size="small"
                                    />
                                ),
                            },
                            { label: "Created At", content: new Date(row.created_at).toLocaleDateString(), hideOnMobile: true },
                        ];

                        const actions = (
                            <div className="flex gap-2">
                                <Button size="small" variant="outlined" color="warning" onClick={() => setUpdateId(row.id)}>Edit</Button>
                                <Button size="small" variant="outlined" color="error" onClick={() => handleDelete(row.id, refresh)}>Delete</Button>
                            </div>
                        );

                        return (
                            <ResponsiveTableRow
                                key={row.id}
                                index={index}
                                columns={columns}
                                actions={actions}
                            />
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

            <CreateScheduleFormCardDialog 
                isOpen={isCreateOpen} 
                onClose={() => { setIsCreateOpen(false); refresh(); }} 
            />

            {updateId && (
                <UpdateScheduleFormCardDialog 
                    id={updateId} 
                    isOpen={true} 
                    onClose={() => { setUpdateId(null); refresh(); }} 
                />
            )}
        </>
    );
};

export default ScheduleTable;
