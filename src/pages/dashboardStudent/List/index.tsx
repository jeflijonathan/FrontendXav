import { useEffect, useState } from "react";
import { BaseTable, TableBody, TablePagination, TableFooter, TableToolbar, ResponsiveTableRow } from "@components/Table";
import { Button } from "@mui/material";
import useStudentList from "./hook/useStudentList";
import useStudentFilters from "./hook/useStudentFilters";
import useDashboardStudentStore from "../store";
import CreateStudentFormCardDialog from "../Create/CreateStudentFormCardDialog";
import UpdateStudentFormCardDialog from "../Update/UpdateStudentFormCardDialog";
import useDeleteStudent from "../Delete/hook/useDeleteStudent";

const sortOptions = [
    { label: "Name", value: "name" },
    { label: "NIS", value: "nis" },
    { label: "Created At", value: "created_at" },
];

const StudentTable = () => {
    const { state } = useDashboardStudentStore();
    const { tableData, tableHeader, fetchList } = useStudentList();
    const { handleChangePage, handleSearch, handleSort, handleOrder } = useStudentFilters();
    const { handleDelete } = useDeleteStudent();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [updateId, setUpdateId] = useState<string | null>(null);

    const refresh = () => fetchList();

    useEffect(() => {
        refresh();
    }, [state.pagination.page, state.search.value, state.filters.sort, state.filters.order_by]);

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-primary-txt">Student Management</h1>
                <Button variant="contained" color="primary" onClick={() => setIsCreateOpen(true)}>
                    Create Student
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
                            { label: "Name", content: `${row.first_name} ${row.last_name}` },
                            { label: "NIS", content: row.nis, hideOnMobile: true },
                            { label: "Gender", content: row.gender === "L" ? "Laki-laki" : "Perempuan", hideOnMobile: true },
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

            <CreateStudentFormCardDialog 
                isOpen={isCreateOpen} 
                onClose={() => { setIsCreateOpen(false); refresh(); }} 
            />

            {updateId && (
                <UpdateStudentFormCardDialog 
                    id={updateId} 
                    isOpen={true} 
                    onClose={() => { setUpdateId(null); refresh(); }} 
                />
            )}
        </>
    );
};

export default StudentTable;
