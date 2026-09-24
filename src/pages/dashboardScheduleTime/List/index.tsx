import { useEffect, useState } from "react";
import { BaseTable, TableBody, TablePagination, TableFooter, TableToolbar, ResponsiveTableRow } from "@components/Table";
import { Button } from "@mui/material";
import useScheduleTimeList from "./hook/useScheduleTimeList";
import useScheduleTimeFilters from "./hook/useScheduleTimeFilters";
import useDashboardScheduleTimeStore from "../store";
import CreateScheduleTimeFormCardDialog from "../Create/CreateScheduleTimeFormCardDialog";
import UpdateScheduleTimeFormCardDialog from "../Update/UpdateScheduleTimeFormCardDialog";
import useDeleteScheduleTime from "../Delete/hook/useDeleteScheduleTime";

const sortOptions = [
    { label: "Day (Hari)", value: "hari" },
    { label: "Created At", value: "created_at" },
];

const ScheduleTimeTable = () => {
    const { state } = useDashboardScheduleTimeStore();
    const { tableData, tableHeader, fetchList } = useScheduleTimeList();
    const { handleChangePage, handleSearch, handleSort, handleOrder } = useScheduleTimeFilters();
    const { handleDelete } = useDeleteScheduleTime();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [updateId, setUpdateId] = useState<string | null>(null);

    const refresh = () => fetchList();

    useEffect(() => {
        refresh();
    }, [state.pagination.page, state.search.value, state.filters.sort, state.filters.order_by]);

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-primary-txt">Schedule Time (Waktu Jam Pelajaran) Slot</h1>
                <Button variant="contained" color="primary" onClick={() => setIsCreateOpen(true)}>
                    Create Time Slot
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
                            { label: "Day", content: row.hari },
                            { label: "Start Time", content: row.jam_awal },
                            { label: "End Time", content: row.jam_akhir },
                            { label: "Category", content: row.category_schendule_time?.name || row.id_category_schendule_time },
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

            <CreateScheduleTimeFormCardDialog 
                isOpen={isCreateOpen} 
                onClose={() => { setIsCreateOpen(false); refresh(); }} 
            />

            {updateId && (
                <UpdateScheduleTimeFormCardDialog 
                    id={updateId} 
                    isOpen={true} 
                    onClose={() => { setUpdateId(null); refresh(); }} 
                />
            )}
        </>
    );
};

export default ScheduleTimeTable;
