import { useEffect, useState } from "react";
import { BaseTable, TableBody, TablePagination, TableFooter, TableRow } from "@components/Table";
import TableToolbar from "./TableToolbar"; // Pastikan path import TableToolbar sudah benar
import { Button, Chip, TableCell } from "@mui/material";
import useClassroomList from "./hook/useClassroomList";
import useClassroomFilters from "./hook/useClassroomFilters";
import useDashboardClassroomStore from "../store";
import CreateClassroomFormCardDialog from "../Create/CreateClassroomFormCardDialog";
import UpdateClassroomFormCardDialog from "../Update/UpdateClassroomFormCardDialog";
import useDeleteClassroom from "../Delete/hook/useDeleteClassroom";

const sortOptions = [
    { label: "Created At", value: "created_at" },
];

const ClassroomTable = () => {
    const { state } = useDashboardClassroomStore();
    const { tableData, tableHeader, fetchList } = useClassroomList();
    const { handleChangePage, handleSearch, handleSort, handleOrder } = useClassroomFilters();
    const { handleDelete } = useDeleteClassroom();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [updateId, setUpdateId] = useState<string | null>(null);

    const refresh = () => fetchList();

    useEffect(() => {
        refresh();
    }, [state.pagination.page, state.search.value, state.filters.sort, state.filters.order_by]);

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-primary-txt">Classroom (Pembagian Kelas) Management</h1>
                <Button variant="contained" color="primary" onClick={() => setIsCreateOpen(true)}>
                    Create Classroom
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
                        const actions = (
                            <div className="flex gap-2">
                                <Button size="small" variant="outlined" color="warning" onClick={() => setUpdateId(row.id_class_room)}>Edit</Button>
                                <Button size="small" variant="outlined" color="error" onClick={() => handleDelete(row.id_class_room, refresh)}>Delete</Button>
                            </div>
                        );

                        return (
                            <TableRow
                                key={row.id_class_room}
                                index={index}
                                actions={actions}
                            >
                                <TableCell sx={{ py: 1 }}>
                                    {row.class?.name || row.id_class}
                                </TableCell>
                                <TableCell sx={{ py: 1 }}>
                                    {row.teacher_subject
                                        ? `${row.teacher_subject.teacher?.first_name || ''} ${row.teacher_subject.teacher?.last_name || ''} (${row.teacher_subject.subject?.name || ''})`
                                        : row.id_teacher_subject}
                                </TableCell>
                                <TableCell sx={{ py: 1 }}>
                                    {row.school_information
                                        ? `${row.school_information.name_school} (${row.school_information.periode})`
                                        : row.id_school_information}
                                </TableCell>
                                <TableCell sx={{ py: 1 }}>
                                    <Chip
                                        label={row.status}
                                        color={row.status === "active" ? "success" : "default"}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell sx={{ py: 1 }} className="hidden md:table-cell">
                                    {new Date(row.created_at).toLocaleDateString()}
                                </TableCell>
                            </TableRow>
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

            <CreateClassroomFormCardDialog
                isOpen={isCreateOpen}
                onClose={() => { setIsCreateOpen(false); refresh(); }}
            />

            {updateId && (
                <UpdateClassroomFormCardDialog
                    id={updateId}
                    isOpen={true}
                    onClose={() => { setUpdateId(null); refresh(); }}
                />
            )}
        </>
    );
};

export default ClassroomTable;