import React, { useState, useEffect, useMemo, useRef } from "react";
import {
    TableCell,
    Chip,
    IconButton,
    Typography,
    Tooltip,
    type IconButtonProps,
} from "@mui/material";
import { Edit, Visibility, Delete } from "@mui/icons-material";
import { BaseTable, TableHeader } from "@components/Table";
import TableBody, { type TableHeaderType } from "@components/Table/TableBody";
import TableRow from "@components/Table/TableRow";
import TableFooter from "@components/Table/TableFooter";
import TablePagination from "@components/Table/TablePagination";
import {
    CategoryExtraService,
    type CategoryExtraResponseModel,
} from "@api/schedule/service";
import { snackbar } from "@utils/snackbar";
import DetailCategoryExtraDialog from "../Detail/DetailCategoryExtraDialog";
import UpdateCategoryExtraDialog from "../Update/UpdateCategoryExtraDialog";

interface Props {
    refreshTrigger?: number;
    onDataChanged?: () => void;
}

export const CategoryExtraTable: React.FC<Props> = ({
    refreshTrigger = 0,
    onDataChanged,
}) => {
    const [rawData, setRawData] = useState<CategoryExtraResponseModel[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Filters, Search, and Pagination State
    const [search, setSearch] = useState<string>("");
    const [debouncedSearch, setDebouncedSearch] = useState<string>("");
    const [sortBy, setSortBy] = useState<string>("name");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);

    // Dialog state
    const [detailItem, setDetailItem] = useState<CategoryExtraResponseModel | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
    const [updateItem, setUpdateItem] = useState<CategoryExtraResponseModel | null>(null);
    const [isUpdateOpen, setIsUpdateOpen] = useState<boolean>(false);

    const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleSearchChange = (val: string) => {
        setSearch(val);
        if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
        searchTimerRef.current = setTimeout(() => {
            setDebouncedSearch(val);
            setPage(1);
        }, 350);
    };

    const fetchCategories = () => {
        setIsLoading(true);
        const service = new CategoryExtraService();
        service.getAll({
            onSuccess: (data) => {
                setRawData(data);
                setIsLoading(false);
            },
            onError: (err: any) => {
                snackbar.error(String(err) || "Gagal memuat kategori ekstra");
                setIsLoading(false);
            },
            onFullfilled: () => {
                setIsLoading(false);
            },
        });
    };

    useEffect(() => {
        fetchCategories();
    }, [refreshTrigger]);

    // Sorting and Filtering
    const processedData = useMemo(() => {
        let result = [...rawData];

        // Search filter (name, description, id)
        if (debouncedSearch.trim()) {
            const q = debouncedSearch.toLowerCase().trim();
            result = result.filter((item) => {
                const name = (item.name || "").toLowerCase();
                const desc = (item.description || "").toLowerCase();
                const id = (item.id_category_extra || item.id || "").toLowerCase();
                return name.includes(q) || desc.includes(q) || id.includes(q);
            });
        }

        // Sorting
        result.sort((a, b) => {
            let valA: string | number = "";
            let valB: string | number = "";

            if (sortBy === "name") {
                valA = a.name.toLowerCase();
                valB = b.name.toLowerCase();
            } else if (sortBy === "status") {
                valA = a.status ? 1 : 0;
                valB = b.status ? 1 : 0;
            } else if (sortBy === "created_at") {
                valA = a.created_at || "";
                valB = b.created_at || "";
            } else if (sortBy === "id") {
                valA = a.id_category_extra || a.id || "";
                valB = b.id_category_extra || b.id || "";
            }

            if (valA < valB) return sortDir === "asc" ? -1 : 1;
            if (valA > valB) return sortDir === "asc" ? 1 : -1;
            return 0;
        });

        return result;
    }, [rawData, debouncedSearch, sortBy, sortDir]);

    // Pagination slice
    const totalData = processedData.length;
    const paginatedData = useMemo(() => {
        const start = (page - 1) * limit;
        return processedData.slice(start, start + limit);
    }, [processedData, page, limit]);

    const sortOptions = [
        { label: "Nama Kategori", value: "name" },
        { label: "Status", value: "status" },
        { label: "Waktu Pembuatan", value: "created_at" },
        { label: "ID Kategori", value: "id" },
    ];

    const headers: TableHeaderType[] = [
        { label: "ID Kategori", width: "160px" },
        { label: "Nama Kategori Ekstrakurikuler", width: "220px" },
        { label: "Deskripsi", width: "220px" },
        { label: "Status", width: "120px" },
        { label: "Dibuat Pada", width: "150px" },
        { label: "Diperbarui Pada", width: "150px" },
    ];

    const formatDate = (dateStr?: string | null) => {
        if (!dateStr) return "-";
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const handleDelete = (item: CategoryExtraResponseModel) => {
        const id = item.id_category_extra || item.id;
        if (!id) return;

        if (window.confirm(`Hapus kategori ekstrakurikuler "${item.name}"?`)) {
            const service = new CategoryExtraService();
            service.delete(id, {
                onSuccess: () => {
                    snackbar.success(`Kategori "${item.name}" berhasil dihapus`);
                    fetchCategories();
                    if (onDataChanged) onDataChanged();
                },
                onError: (err: any) => {
                    snackbar.error(String(err) || "Gagal menghapus kategori");
                },
            });
        }
    };

    const ListActions: Array<{
        label: string;
        icon: React.ReactNode;
        color: IconButtonProps["color"];
        onClick: (item: CategoryExtraResponseModel) => void;
    }> = [
        {
            label: "Detail",
            icon: <Visibility fontSize="small" />,
            color: "info",
            onClick: (item) => {
                setDetailItem(item);
                setIsDetailOpen(true);
            },
        },
        {
            label: "Edit",
            icon: <Edit fontSize="small" />,
            color: "primary",
            onClick: (item) => {
                setUpdateItem(item);
                setIsUpdateOpen(true);
            },
        },
        {
            label: "Hapus",
            icon: <Delete fontSize="small" />,
            color: "error",
            onClick: handleDelete,
        },
    ];

    const renderActions = (item: CategoryExtraResponseModel) => (
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
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
        <div className="flex flex-col gap-4">
            <TableHeader
                search={search}
                onSearchChange={handleSearchChange}
                sortBy={sortBy}
                onSortByChange={(val) => setSortBy(val)}
                sortOptions={sortOptions}
                sortDir={sortDir}
                onSortDirChange={(dir) => setSortDir(dir)}
            />

            <BaseTable breakpoint={1200}>
                <TableBody
                    header={headers}
                    isLoading={isLoading}
                    dataLength={paginatedData.length}
                    skeletonRows={5}
                >
                    {paginatedData.map((row, index) => {
                        const id = row.id_category_extra || row.id || "-";

                        return (
                            <TableRow
                                key={id || index}
                                index={index}
                                header={headers}
                                actions={renderActions(row)}
                            >
                                {/* ID Kategori (String / UUID) */}
                                <TableCell sx={{ py: 1 }}>
                                    <Tooltip title={id} arrow>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontFamily: "monospace",
                                                fontSize: "0.8rem",
                                                maxWidth: 160,
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                                color: "text.secondary",
                                            }}
                                        >
                                            {id}
                                        </Typography>
                                    </Tooltip>
                                </TableCell>

                                {/* Nama Kategori Ekstra */}
                                <TableCell sx={{ py: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary" }}>
                                        {row.name}
                                    </Typography>
                                </TableCell>

                                {/* Deskripsi */}
                                <TableCell sx={{ py: 1 }}>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            maxWidth: 220,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {row.description || "-"}
                                    </Typography>
                                </TableCell>

                                {/* Status Active / Non-Active */}
                                <TableCell sx={{ py: 1 }}>
                                    <Chip
                                        label={row.status ? "Aktif" : "Non Aktif"}
                                        color={row.status ? "success" : "error"}
                                        size="small"
                                        sx={{
                                            fontWeight: 700,
                                            fontSize: "11px",
                                            height: 22,
                                        }}
                                    />
                                </TableCell>

                                {/* Created At */}
                                <TableCell sx={{ py: 1, whiteSpace: "nowrap" }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem" }}>
                                        {formatDate(row.created_at)}
                                    </Typography>
                                </TableCell>

                                {/* Updated At */}
                                <TableCell sx={{ py: 1, whiteSpace: "nowrap" }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem" }}>
                                        {formatDate(row.updated_at)}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </BaseTable>

            <TableFooter>
                <TablePagination
                    currentPage={page}
                    totalPage={Math.ceil(totalData / limit) || 1}
                    totalData={totalData}
                    limit={limit}
                    onLimitChange={(newLimit: number) => {
                        setLimit(newLimit);
                        setPage(1);
                    }}
                    limitOptions={[5, 10, 25, 50, 100]}
                    onChange={(newPage: number) => setPage(newPage)}
                />
            </TableFooter>

            {/* Dialog Detail */}
            <DetailCategoryExtraDialog
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                data={detailItem}
            />

            {/* Dialog Edit / Update */}
            <UpdateCategoryExtraDialog
                isOpen={isUpdateOpen}
                onClose={() => setIsUpdateOpen(false)}
                data={updateItem}
                onSuccess={() => {
                    fetchCategories();
                    if (onDataChanged) onDataChanged();
                }}
            />
        </div>
    );
};

export default CategoryExtraTable;
