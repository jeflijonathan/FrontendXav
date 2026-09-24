import { useEffect, useState } from "react";
import { BaseTable, TableBody, TablePagination, TableFooter, TableToolbar, ResponsiveTableRow } from "@components/Table";
import { Button, Chip } from "@mui/material";
import useClassList from "./hook/useClassList";
import useClassFilters from "./hook/useClassFilters";
import useDashboardClassStore from "../store";
import CreateClassFormCardDialog from "../Create/CreateClassFormCardDialog";
import UpdateClassFormCardDialog from "../Update/UpdateClassFormCardDialog";
import useDeleteClass from "../Delete/hook/useDeleteClass";

const sortOptions = [
    { label: "Name", value: "name" },
    { label: "Created At", value: "created_at" },
];

const ClassTable = () => {
    const { state } = useDashboardClassStore();
    const { tableData, tableHeader, fetchList } = useClassList();
    const { handleChangePage, handleSearch, handleSort, handleOrder } = useClassFilters();
    const { handleDelete } = useDeleteClass();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [updateId, setUpdateId] = useState<string | null>(null);

    const refresh = () => fetchList();

    useEffect(() => {
        refresh();
    }, [state.pagination.page, state.search.value, state.filters.sort, state.filters.order_by]);

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-primary-txt">Class (Kelas) Management</h1>
                <Button variant="contained" color="primary" onClick={() => setIsCreateOpen(true)}>
                    Create Class
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
                <TableBody header={tableHeader} isLoading={state.isLoading} dataLength={tableData.length} disableAction className="bg-transparent">
                    {tableData.map((row, index) => {
                        const columns = [
                            { label: "Class Name", content: row.name },
                            { label: "Major ID", content: row.id_major },
                            { label: "Class Guardian", content: row.id_class_guardian || "—" },
                            { label: "Status", content: <Chip label={row.status ? "Active" : "Inactive"} color={row.status ? "success" : "default"} size="small" /> },
                            { label: "Created At", content: new Date(row.created_at).toLocaleDateString(), hideOnMobile: true },
                        ];

                        const actions = (
                            <div className="flex gap-2">
                                <Button size="small" variant="outlined" color="warning" onClick={() => setUpdateId(row.id_class)}>Edit</Button>
                                <Button size="small" variant="outlined" color="error" onClick={() => handleDelete(row.id_class, refresh)}>Delete</Button>
                            </div>
                        );

                        return <ResponsiveTableRow key={row.id_class} index={index} columns={columns} actions={actions} />;
                    })}
                </TableBody>
                <TableFooter>
                    <TablePagination currentPage={state.pagination.page} totalPage={state.pagination.total_pages} onChange={handleChangePage} />
                </TableFooter>
            </BaseTable>

            <CreateClassFormCardDialog isOpen={isCreateOpen} onClose={() => { setIsCreateOpen(false); refresh(); }} />
            {updateId && <UpdateClassFormCardDialog id={updateId} isOpen={true} onClose={() => { setUpdateId(null); refresh(); }} />}
        </>
    );
};

export default ClassTable;
