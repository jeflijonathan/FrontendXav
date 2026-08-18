import { useEffect, useState } from "react";
import { BaseTable, TableBody, TablePagination, TableRow, TableFooter } from "@components/Table";
import { TableCell, Button, IconButton, Tooltip } from "@mui/material";
import { Visibility, Edit } from "@mui/icons-material";
import useCategorySubjectList from "./hook/useCategorySubjectList";
import useCategorySubjectFilters from "./hook/useCategorySubjectFilters";
import useDashboardCategorySubjectStore from "../store";
import CreateCategorySubjectFormCardDialog from "../Create/CreateCategorySubjectFormCardDialog";
import UpdateCategorySubjectFormCardDialog from "../Update/UpdateCategorySubjectFormCardDialog";
import DetailCategorySubjectDialog from "../Detail/DetailCategorySubjectDialog";

const CategorySubjectTable = () => {
    const { state } = useDashboardCategorySubjectStore();
    const { tableData, tableHeader, fetchList } = useCategorySubjectList();
    const { handleChangePage } = useCategorySubjectFilters();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [updateId, setUpdateId] = useState<string | null>(null);
    const [detailId, setDetailId] = useState<string | null>(null);

    const refresh = () => fetchList();

    useEffect(() => { refresh(); }, [state.pagination.page]);

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-primary-txt">Category Subject Management</h1>
                <Button variant="contained" color="primary" onClick={() => setIsCreateOpen(true)}>
                    Create Category
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
                            <TableCell sx={{ fontSize: "1rem" }}>{row.name}</TableCell>
                            <TableCell sx={{ fontSize: "1rem" }}>
                                {row.status ? (
                                    <span className="px-2 py-1 bg-green-500/20 text-green-500 rounded-md text-xs font-medium">Aktif</span>
                                ) : (
                                    <span className="px-2 py-1 bg-red-500/20 text-red-500 rounded-md text-xs font-medium">Tidak Aktif</span>
                                )}
                            </TableCell>
                            <TableCell sx={{ fontSize: "1rem" }}>{row.created_at}</TableCell>
                            <TableCell sx={{ fontSize: "1rem" }}>
                                <div className="flex gap-2 items-center">
                                    <Tooltip title="View Details">
                                        <IconButton 
                                            size="small" 
                                            color="info" 
                                            onClick={() => setDetailId(row.id)}
                                            sx={{
                                                backgroundColor: "rgba(2, 136, 209, 0.1)",
                                                "&:hover": {
                                                    backgroundColor: "rgba(2, 136, 209, 0.2)"
                                                }
                                            }}
                                        >
                                            <Visibility fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Edit Category">
                                        <IconButton 
                                            size="small" 
                                            color="warning" 
                                            onClick={() => setUpdateId(row.id)}
                                            sx={{
                                                backgroundColor: "rgba(237, 108, 2, 0.1)",
                                                "&:hover": {
                                                    backgroundColor: "rgba(237, 108, 2, 0.2)"
                                                }
                                            }}
                                        >
                                            <Edit fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
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

            <CreateCategorySubjectFormCardDialog isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSuccess={refresh} />
            {updateId && <UpdateCategorySubjectFormCardDialog id={updateId} isOpen={true} onClose={() => setUpdateId(null)} onSuccess={refresh} />}
            {detailId && <DetailCategorySubjectDialog id={detailId} isOpen={true} onClose={() => setDetailId(null)} />}
        </>
    );
};
export default CategorySubjectTable;
