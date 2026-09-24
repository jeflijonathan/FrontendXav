import { useEffect, useState } from "react";
import { BaseTable, TableBody, TablePagination, TableFooter, TableToolbar, ResponsiveTableRow } from "@components/Table";
import { Button } from "@mui/material";
import useEffectiveWeekList from "./hook/useEffectiveWeekList";
import useEffectiveWeekFilters from "./hook/useEffectiveWeekFilters";
import useDashboardEffectiveWeekStore from "../store";
import CreateEffectiveWeekFormCardDialog from "../Create/CreateEffectiveWeekFormCardDialog";
import UpdateEffectiveWeekFormCardDialog from "../Update/UpdateEffectiveWeekFormCardDialog";
import useDeleteEffectiveWeek from "../Delete/hook/useDeleteEffectiveWeek";

const sortOptions = [
    { label: "Created At", value: "created_at" },
];

const EffectiveWeekTable = () => {
    const { state } = useDashboardEffectiveWeekStore();
    const { tableData, tableHeader, fetchList } = useEffectiveWeekList();
    const { handleChangePage, handleSearch, handleSort, handleOrder } = useEffectiveWeekFilters();
    const { handleDelete } = useDeleteEffectiveWeek();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [updateId, setUpdateId] = useState<string | null>(null);

    const refresh = () => fetchList();

    useEffect(() => {
        refresh();
    }, [state.pagination.page, state.search.value, state.filters.sort, state.filters.order_by]);

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-primary-txt">Effective Week (Minggu Efektif) Management</h1>
                <Button variant="contained" color="primary" onClick={() => setIsCreateOpen(true)}>
                    Create Effective Week
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
                            { label: "Subject", content: row.subject?.name || row.id_subject },
                            { label: "Alokasi Intrakurikuler", content: `${row.Alokasi_Intrakurikuler} Jam` },
                            { label: "Alokasi Kokurikuler", content: `${row.Alokasi_Kokurikuler} Jam` },
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

            <CreateEffectiveWeekFormCardDialog 
                isOpen={isCreateOpen} 
                onClose={() => { setIsCreateOpen(false); refresh(); }} 
            />

            {updateId && (
                <UpdateEffectiveWeekFormCardDialog 
                    id={updateId} 
                    isOpen={true} 
                    onClose={() => { setUpdateId(null); refresh(); }} 
                />
            )}
        </>
    );
};

export default EffectiveWeekTable;
