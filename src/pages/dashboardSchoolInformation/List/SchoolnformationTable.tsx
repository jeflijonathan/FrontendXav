import { useEffect, useState } from "react";
import { BaseTable } from "@components/Table";
import TableBody from "@components/Table/TableBody";
import TableRow from "@components/Table/TableRow";
import TableFooter from "@components/Table/TableFooter";
import TablePagination from "@components/Table/TablePagination";
import TableToolbar from "./TableToolbar"; // Sesuaikan path import TableToolbar Anda
import { TableCell, Button, Chip } from "@mui/material";
import type { TableHeaderType } from "@components/Table/TableBody";
import useSchoolInfoList from "./hook/useSchoolInfoList";
import useSchoolInfoFilters from "./hook/useSchoolInfoFilters";
import useDashboardSchoolInformationStore from "../store";
import CreateSchoolInfoFormCardDialog from "../Create/CreateSchoolInfoFormCardDialog";
import UpdateSchoolInfoFormCardDialog from "../Update/UpdateSchoolInfoFormCardDialog";
import useDeleteSchoolInfo from "../Delete/hook/useDeleteSchoolInfo";

const schoolInfoHeaders: TableHeaderType[] = [
    { label: "School Name", width: "200px" },
    { label: "Periode", width: "120px" },
    { label: "NPSN", width: "150px" },
    { label: "Headmaster", width: "180px" },
    { label: "Status", width: "120px" },
    { label: "Created At", width: "150px" },
];

const sortOptions = [
    { label: "School Name", value: "name_school" },
    { label: "Created At", value: "created_at" },
];

const SchoolInformationTable = () => {
    const { state } = useDashboardSchoolInformationStore();
    const { tableData, fetchList } = useSchoolInfoList();
    const { handleChangePage, handleSearch, handleSort, handleOrder } = useSchoolInfoFilters();
    const { handleDelete } = useDeleteSchoolInfo();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [updateId, setUpdateId] = useState<string | null>(null);

    const refresh = () => fetchList();

    useEffect(() => {
        refresh();
    }, [state.pagination.page, state.search.value, state.filters.sort, state.filters.order_by]);

    const renderActions = (row: any) => (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
            <Button size="small" variant="outlined" color="warning" onClick={() => setUpdateId(row.id)}>
                Edit
            </Button>
            <Button size="small" variant="outlined" color="error" onClick={() => handleDelete(row.id, refresh)}>
                Delete
            </Button>
        </div>
    );

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-primary-txt">School Information (Informasi Sekolah)</h1>
                <Button variant="contained" color="primary" onClick={() => setIsCreateOpen(true)}>
                    Create School Info
                </Button>
            </div>

            {/* Integrasi TableToolbar */}
            <TableToolbar
                search={state.search.value}
                onSearchChange={handleSearch}
                sortBy={state.filters.sort}
                onSortByChange={handleSort}
                sortOptions={sortOptions}
                sortDir={(state.filters.order_by as "asc" | "desc") || "asc"}
                onSortDirChange={handleOrder}
            />

            <BaseTable>
                <TableBody
                    header={schoolInfoHeaders}
                    isLoading={state.isLoading}
                    dataLength={tableData.length}
                    skeletonRows={3}
                >
                    {tableData.map((row, index) => {
                        const headmasterName = row.headmaster
                            ? `${row.headmaster.first_name} ${row.headmaster.last_name}`
                            : row.id_headmaster;

                        return (
                            <TableRow
                                key={row.id}
                                index={index}
                                header={schoolInfoHeaders}
                                actions={renderActions(row)}
                            >
                                <TableCell sx={{ py: 1 }}>{row.name_school}</TableCell>
                                <TableCell sx={{ py: 1 }}>{row.periode}</TableCell>
                                <TableCell sx={{ py: 1 }}>{row.NPSN}</TableCell>
                                <TableCell sx={{ py: 1 }}>{headmasterName}</TableCell>
                                <TableCell sx={{ py: 1 }}>
                                    <Chip
                                        label={row.status}
                                        color={row.status === "active" ? "success" : "default"}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell sx={{ py: 1 }}>
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