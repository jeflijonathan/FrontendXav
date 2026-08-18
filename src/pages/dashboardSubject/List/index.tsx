import { useEffect, useState } from "react";
import { BaseTable, TableBody, TablePagination, TableRow, TableFooter } from "@components/Table";
import { TableCell, Button } from "@mui/material";
import useSubjectList from "./hook/useSubjectList";
import useSubjectFilters from "./hook/useSubjectFilters";
import useDashboardSubjectStore from "../store";
import CreateSubjectFormCardDialog from "../Create/CreateSubjectFormCardDialog";
import UpdateSubjectFormCardDialog from "../Update/UpdateSubjectFormCardDialog";
import useDeleteSubject from "../Delete/hook/useDeleteSubject";

const SubjectTable = () => {
    const { state } = useDashboardSubjectStore();
    const { tableData, tableHeader, fetchList } = useSubjectList();
    const { handleChangePage } = useSubjectFilters();
    const { handleDelete } = useDeleteSubject();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [updateId, setUpdateId] = useState<string | null>(null);

    const refresh = () => fetchList();

    useEffect(() => {
        refresh();
    }, [state.pagination.page]);

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-primary-txt">Subject Management</h1>
                <Button variant="contained" color="primary" onClick={() => setIsCreateOpen(true)}>
                    Create Subject
                </Button>
            </div>
            
            <BaseTable>
                <TableBody
                    header={tableHeader}
                    isLoading={state.isLoading}
                    dataLength={tableData.length}
                    disableAction
                    className="bg-transparent"
                >
                    {tableData.map((row, index) => (
                        <TableRow key={row.id} className="bg-transparent text-gray-100">
                            <TableCell sx={{ py: 1, fontSize: "1rem" }}>{index + 1}</TableCell>
                            <TableCell sx={{ fontSize: "1rem" }}>{row.id}</TableCell>
                            <TableCell sx={{ fontSize: "1rem" }}>{row.created_at}</TableCell>
                            <TableCell sx={{ fontSize: "1rem" }}>
                                <div className="flex gap-2">
                                    <Button size="small" variant="outlined" color="warning" onClick={() => setUpdateId(row.id)}>Edit</Button>
                                    <Button size="small" variant="outlined" color="error" onClick={() => handleDelete(row.id, refresh)}>Delete</Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TablePagination
                        currentPage={state.pagination.page}
                        totalPage={state.pagination.total_pages}
                        onChange={handleChangePage}
                    />
                </TableFooter>
            </BaseTable>

            <CreateSubjectFormCardDialog 
                isOpen={isCreateOpen} 
                onClose={() => { setIsCreateOpen(false); refresh(); }} 
            />

            {updateId && (
                <UpdateSubjectFormCardDialog 
                    id={updateId} 
                    isOpen={true} 
                    onClose={() => { setUpdateId(null); refresh(); }} 
                />
            )}
        </>
    );
};

export default SubjectTable;
