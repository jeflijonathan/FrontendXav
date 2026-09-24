import { useEffect, useState } from "react";
import { BaseTable, TableBody, TablePagination, TableFooter, TableToolbar, ResponsiveTableRow } from "@components/Table";
import { Button, Chip } from "@mui/material";
import useCategoryScheduleTimeList from "./hook/useCategoryScheduleTimeList";
import useCategoryScheduleTimeFilters from "./hook/useCategoryScheduleTimeFilters";
import useDashboardCategoryScheduleTimeStore from "../store";
import CreateCategoryScheduleTimeFormCardDialog from "../Create/CreateCategoryScheduleTimeFormCardDialog";
import UpdateCategoryScheduleTimeFormCardDialog from "../Update/UpdateCategoryScheduleTimeFormCardDialog";
import useDeleteCategoryScheduleTime from "../Delete/hook/useDeleteCategoryScheduleTime";

const sortOptions = [
    { label: "Category Name", value: "name" },
    { label: "Created At", value: "created_at" },
];

const CategoryScheduleTimeTable = () => {
    const { state } = useDashboardCategoryScheduleTimeStore();
    const { tableData, tableHeader, fetchList } = useCategoryScheduleTimeList();
    const { handleChangePage, handleSearch, handleSort, handleOrder } = useCategoryScheduleTimeFilters();
    const { handleDelete } = useDeleteCategoryScheduleTime();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [updateId, setUpdateId] = useState<string | null>(null);

    const refresh = () => fetchList();

    useEffect(() => {
        refresh();
    }, [state.pagination.page, state.search.value, state.filters.sort, state.filters.order_by]);

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-primary-txt">Category Schedule Time (Kategori Waktu Jam)</h1>
                <Button variant="contained" color="primary" onClick={() => setIsCreateOpen(true)}>
                    Create Category
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
                            { label: "Category Name", content: row.name },
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

            <CreateCategoryScheduleTimeFormCardDialog 
                isOpen={isCreateOpen} 
                onClose={() => { setIsCreateOpen(false); refresh(); }} 
            />

            {updateId && (
                <UpdateCategoryScheduleTimeFormCardDialog 
                    id={updateId} 
                    isOpen={true} 
                    onClose={() => { setUpdateId(null); refresh(); }} 
                />
            )}
        </>
    );
};

export default CategoryScheduleTimeTable;
