import { useEffect, useState } from "react";
import { BaseTable, TableBody, TablePagination, TableFooter, TableToolbar, ResponsiveTableRow } from "@components/Table";
import { Button, Chip } from "@mui/material";
import useTeacherSubjectList from "./hook/useTeacherSubjectList";
import useTeacherSubjectFilters from "./hook/useTeacherSubjectFilters";
import useDashboardTeacherSubjectStore from "../store";
import CreateTeacherSubjectFormCardDialog from "../Create/CreateTeacherSubjectFormCardDialog";
import UpdateTeacherSubjectFormCardDialog from "../Update/UpdateTeacherSubjectFormCardDialog";
import useDeleteTeacherSubject from "../Delete/hook/useDeleteTeacherSubject";

const sortOptions = [
    { label: "Created At", value: "created_at" },
];

const TeacherSubjectTable = () => {
    const { state } = useDashboardTeacherSubjectStore();
    const { tableData, tableHeader, fetchList } = useTeacherSubjectList();
    const { handleChangePage, handleSearch, handleSort, handleOrder } = useTeacherSubjectFilters();
    const { handleDelete } = useDeleteTeacherSubject();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [updateId, setUpdateId] = useState<string | null>(null);

    const refresh = () => fetchList();

    useEffect(() => {
        refresh();
    }, [state.pagination.page, state.search.value, state.filters.sort, state.filters.order_by]);

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-primary-txt">Teacher Subject (Guru Pengampu) Management</h1>
                <Button variant="contained" color="primary" onClick={() => setIsCreateOpen(true)}>
                    Create Teacher Subject
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
                            { 
                                label: "Teacher", 
                                content: row.teacher 
                                    ? `${row.teacher.first_name} ${row.teacher.last_name}` 
                                    : row.id_teacher 
                            },
                            { label: "Subject", content: row.subject?.name || row.id_subject },
                            { label: "Category", content: row.category_subject?.name || row.id_category_subject },
                            { label: "JP Amount", content: `${row.jp_amount} JP` },
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

            <CreateTeacherSubjectFormCardDialog 
                isOpen={isCreateOpen} 
                onClose={() => { setIsCreateOpen(false); refresh(); }} 
            />

            {updateId && (
                <UpdateTeacherSubjectFormCardDialog 
                    id={updateId} 
                    isOpen={true} 
                    onClose={() => { setUpdateId(null); refresh(); }} 
                />
            )}
        </>
    );
};

export default TeacherSubjectTable;
