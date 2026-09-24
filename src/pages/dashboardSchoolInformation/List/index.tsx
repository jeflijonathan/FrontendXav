import { useEffect, useState } from "react";
import { BaseTable, TableBody, TablePagination, TableFooter, TableToolbar, ResponsiveTableRow } from "@components/Table";
import { Button, Chip } from "@mui/material";
import useSchoolInfoList from "./hook/useSchoolInfoList";
import useSchoolInfoFilters from "./hook/useSchoolInfoFilters";
import useDashboardSchoolInformationStore from "../store";
import CreateSchoolInfoFormCardDialog from "../Create/CreateSchoolInfoFormCardDialog";
import UpdateSchoolInfoFormCardDialog from "../Update/UpdateSchoolInfoFormCardDialog";
import useDeleteSchoolInfo from "../Delete/hook/useDeleteSchoolInfo";

const sortOptions = [
    { label: "School Name", value: "name_school" },
    { label: "Created At", value: "created_at" },
];

const SchoolInformationTable = () => {
    const { state } = useDashboardSchoolInformationStore();
    const { tableData, tableHeader, fetchList } = useSchoolInfoList();
    const { handleChangePage, handleSearch, handleSort, handleOrder } = useSchoolInfoFilters();
    const { handleDelete } = useDeleteSchoolInfo();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [updateId, setUpdateId] = useState<string | null>(null);

    const refresh = () => fetchList();

    useEffect(() => {
        refresh();
    }, [state.pagination.page, state.search.value, state.filters.sort, state.filters.order_by]);

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-primary-txt">School Information (Informasi Sekolah)</h1>
                <Button variant="contained" color="primary" onClick={() => setIsCreateOpen(true)}>
                    Create School Info
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
                            { label: "School Name", content: row.name_school },
                            { label: "Periode", content: row.periode },
                            { label: "NPSN", content: row.NPSN, hideOnMobile: true },
                            { 
                                label: "Headmaster", 
                                content: row.headmaster 
                                    ? `${row.headmaster.first_name} ${row.headmaster.last_name}` 
                                    : row.id_headmaster 
                            },
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

            <CreateSchoolInfoFormCardDialog 
                isOpen={isCreateOpen} 
                onClose={() => { setIsCreateOpen(false); refresh(); }} 
            />

            {updateId && (
                <UpdateSchoolInfoFormCardDialog 
                    id={updateId} 
                    isOpen={true} 
                    onClose={() => { setUpdateId(null); refresh(); }} 
                />
            )}
        </>
    );
};

export default SchoolInformationTable;
