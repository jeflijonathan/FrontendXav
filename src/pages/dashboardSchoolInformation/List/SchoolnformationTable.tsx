import { useEffect, useState } from "react";
import { BaseTable, TableHeader } from "@components/Table";
import TableBody from "@components/Table/TableBody";
import TableRow from "@components/Table/TableRow";
import TableFooter from "@components/Table/TableFooter";
import TablePagination from "@components/Table/TablePagination";
import { TableCell, Chip, IconButton, type IconButtonProps } from "@mui/material";
import useSchoolInfoList from "./hook/useSchoolInfoList";
import useSchoolInfoFilters from "./hook/useSchoolInfoFilters";
import useDashboardSchoolInformationStore from "../store";
import { filterSchoolInformationMapper } from "@pages/dashboardSchoolInformation/List/utils/FilterSchoolInformationMapper";
import { Edit, Visibility } from "@mui/icons-material";
import { listTableMapper, type SchoolInformationMappedTable } from "./utils/ListTableMapper";
import UpdateSchoolInfoCardDialog from "../Update/UpdateSchoolInfoCardDialog";

const SchoolInformationTable = () => {
    const { state } = useDashboardSchoolInformationStore();
    const { tableData, fetchSchoolInfoList, statusData, schoolInfoHeaders, sortOptions } = useSchoolInfoList();
    const { handleChangePage, handleSearch, handleSort, handleOrder } = useSchoolInfoFilters();
    const [updateId, setUpdateId] = useState<string | null>(null);
    const dataMapper = listTableMapper(state.data);
    const refresh = () => fetchSchoolInfoList(filterSchoolInformationMapper(state));

    useEffect(function loadSchoolInformationData() {
        refresh();
    }, [state.pagination.page, state.search.value, state.filters.sort, state.filters.order_by]);

    const ListActions: Array<{
        label: string;
        icon: React.ReactNode;
        color: IconButtonProps["color"];
        onClick: (item: any) => void;
    }> = [
            {
                label: "Read",
                icon: <Visibility fontSize="small" />,
                color: "info",
                onClick: (item) => console.log("Read", item.id),
            },
            {
                label: "Edit",
                icon: <Edit fontSize="small" />,
                color: "primary",
                onClick: (item) => console.log("Edit", item.id),
            },
        ];

    const renderActions = (item: SchoolInformationMappedTable) => (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
            {ListActions.map((action, index) => (
                <IconButton
                    key={index}
                    size="small"
                    color={action.color}
                    onClick={() => action.onClick(item)}
                    title={action.label}
                >
                    {action.icon}
                </IconButton>
            ))}
        </div>
    );

    return (
        <>
            <TableHeader
                search={state.search.value}
                onSearchChange={handleSearch}
                sortBy={state.filters.sort}
                onSortByChange={handleSort}
                sortOptions={sortOptions}
                sortDir={(state.filters.order_by as "asc" | "desc") || "asc"}
                onSortDirChange={handleOrder}
            />

            <BaseTable breakpoint={1200}>
                <TableBody
                    header={schoolInfoHeaders}
                    isLoading={state.isLoading}
                    dataLength={tableData.length}
                    skeletonRows={3}
                >
                    {dataMapper.map((row, index) => {

                        return (
                            <TableRow
                                key={row.id}
                                index={index}
                                header={schoolInfoHeaders}
                                actions={renderActions(row)}
                            >
                                <TableCell sx={{ py: 1 }}>{row.periode}</TableCell>
                                <TableCell sx={{ py: 1 }}>{row.name_school}</TableCell>
                                <TableCell sx={{ py: 1 }}>{row.NPSN}</TableCell>
                                <TableCell sx={{ py: 1 }}>{row.headmaster.name}</TableCell>
                                <TableCell sx={{ py: 1 }}>
                                    <Chip
                                        label={statusData[Number(row.status)].label}
                                        color={statusData[Number(row.status)].color}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell sx={{ py: 1 }}>
                                    {new Date(row.created_at).toLocaleDateString()}
                                </TableCell>
                                <TableCell sx={{ py: 1 }}>
                                    {new Date(row.updated_at).toLocaleDateString()}
                                </TableCell>
                                <TableCell sx={{ py: 1 }}>
                                    test
                                </TableCell>
                                <TableCell sx={{ py: 1 }}>
                                    test1lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
                                </TableCell>
                                <TableCell sx={{ py: 1 }}>
                                    test1lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
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

            {updateId && (
                <UpdateSchoolInfoCardDialog
                    id={updateId}
                    isOpen={true}
                    onClose={() => { setUpdateId(null); fetchSchoolInfoList(filterSchoolInformationMapper(state)); }}
                />
            )}
        </>
    );
};

export default SchoolInformationTable;