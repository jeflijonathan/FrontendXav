import { useEffect, useState } from "react";
import { BaseTable, TableBody, TablePagination, TableFooter, TableToolbar, ResponsiveTableRow } from "@components/Table";
import { Button, Chip } from "@mui/material";
import useMajorList from "./hook/useMajorList";
import useMajorFilters from "./hook/useMajorFilters";
import useDashboardMajorStore from "../store";
import CreateMajorFormCardDialog from "../Create/CreateMajorFormCardDialog";
import UpdateMajorFormCardDialog from "../Update/UpdateMajorFormCardDialog";
import useDeleteMajor from "../Delete/hook/useDeleteMajor";

const sortOptions = [
    { label: "Name", value: "name" },
    { label: "Created At", value: "created_at" },
];

const MajorTable = () => {
    const { state } = useDashboardMajorStore();
    const { tableData, tableHeader, fetchList } = useMajorList();
    const { handleChangePage, handleSearch, handleSort, handleOrder } = useMajorFilters();
    const { handleDelete } = useDeleteMajor();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [updateId, setUpdateId] = useState<string | null>(null);

    const refresh = () => fetchList();

    useEffect(() => {
        refresh();
    }, [state.pagination.page, state.search.value, state.filters.sort, state.filters.order_by]);

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-primary-txt">Major (Jurusan) Management</h1>
                <Button variant="contained" color="primary" onClick={() => setIsCreateOpen(true)}>
                    Create Major
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
                            { label: "Major Name", content: row.name },
                            {
                                label: "Status",
                                content: (
                                    <Chip
                                        label={row.status ? "Active" : "Inactive"}
                                        color={row.status ? "success" : "default"}
                                        size="small"
                                    />
                                ),
                            },
                            { label: "Created At", content: new Date(row.created_at).toLocaleDateString(), hideOnMobile: true },
                        ];

                        const actions = (
                            <div className="flex gap-2">
                                <Button size="small" variant="outlined" color="warning" onClick={() => setUpdateId(row.id_major)}>Edit</Button>
                                <Button size="small" variant="outlined" color="error" onClick={() => handleDelete(row.id_major, refresh)}>Delete</Button>
                            </div>
                        );

                        return (
                            <ResponsiveTableRow
                                key={row.id_major}
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

            <CreateMajorFormCardDialog
                isOpen={isCreateOpen}
                onClose={() => { setIsCreateOpen(false); refresh(); }}
            />

            {updateId && (
                <UpdateMajorFormCardDialog
                    id={updateId}
                    isOpen={true}
                    onClose={() => { setUpdateId(null); refresh(); }}
                />
            )}
        </>
    );
};

export default MajorTable;
