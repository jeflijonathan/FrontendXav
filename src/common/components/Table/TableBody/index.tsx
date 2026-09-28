import {
    TableHead,
    TableBody as MuiTableBody,
    TableRow as MuiTableRow,
    TableCell,
    Typography,
} from "@mui/material";
import TableRow from "@components/Table/TableRow";
import React, { type ReactNode, isValidElement } from "react";
import SkeletonLoader from "@components/feedback/Skeleton";
import { useTableStore } from "@common/store/useTableStore";

export interface TableHeaderType {
    label: string;
    width?: string;
    className?: string;
}

interface TableBodyProps {
    header: TableHeaderType[];
    children: ReactNode;
    isLoading?: boolean;
    dataLength?: number;
    className?: string;
    skeletonRows?: number;
}

const TableBody = ({
    header,
    children,
    isLoading = false,
    dataLength = 0,
    className,
    skeletonRows = 5,
}: TableBodyProps) => {
    const isCompact = useTableStore((state) => state.isCompact);
    // Batas jumlah kolom utama yang tampil di tabel (jika compact tampil 3 agar muat di layar kecil)
    const maxVisibleCols = isCompact ? 3 : header.length;

    const renderTableLoading = () => {
        return Array.from(new Array(skeletonRows)).map((_, rowIndex) => (
            <TableRow key={`skeleton-row-${rowIndex}`} index={rowIndex} header={header} maxVisible={maxVisibleCols}>
                {header.map((_, colIndex) => (
                    <TableCell key={`skeleton-cell-${colIndex}`}>
                        <SkeletonLoader isLoading={isLoading} variant="text" height={24}>
                            <div />
                        </SkeletonLoader>
                    </TableCell>
                ))}
            </TableRow>
        ));
    };

    const TableEmpty = () => {
        return (
            <TableRow index={0} header={header} maxVisible={maxVisibleCols}>
                <TableCell colSpan={header.length} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No data available</Typography>
                </TableCell>
            </TableRow>
        );
    };

    const processedChildren = React.Children.map(children, (child) => {
        if (isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, { header, maxVisible: maxVisibleCols });
        }
        return child;
    });

    const getCurrentState = () => {
        if (isLoading) return renderTableLoading();
        if (dataLength === 0) return TableEmpty();
        return processedChildren;
    };

    return (
        <>
            <TableHead>
                <MuiTableRow>
                    {/* Tombol panah dropdown selalu ada di setiap baris */}
                    <TableCell sx={{ width: "40px", borderBottom: "1px solid rgba(148, 163, 184, 0.2)" }} />
                    <TableCell sx={{ width: "50px", borderBottom: "1px solid rgba(148, 163, 184, 0.2)" }}>No</TableCell>

                    {header.map((h, i) => {
                        // Jika kolom melebihi batas maxVisibleCols, jangan render di header utama
                        if (i >= maxVisibleCols) return null;

                        return (
                            <TableCell
                                key={i}
                                className={h.className || ""}
                                sx={{
                                    fontWeight: "bold",
                                    fontSize: "0.875rem",
                                    color: "#94a3b8",
                                    borderBottom: "1px solid rgba(148, 163, 184, 0.2)",
                                    ...(h.width ? { width: h.width } : {}),
                                }}
                            >
                                {h.label}
                            </TableCell>
                        );
                    })}

                    <TableCell
                        sx={{
                            fontWeight: "bold",
                            fontSize: "0.875rem",
                            color: "#94a3b8",
                            minWidth: "100px",
                            width: "auto",
                            whiteSpace: "nowrap",
                            borderBottom: "1px solid rgba(148, 163, 184, 0.2)",
                        }}
                    >
                        Actions
                    </TableCell>
                </MuiTableRow>
            </TableHead>
            <MuiTableBody className={className}>
                {getCurrentState()}
            </MuiTableBody>
        </>
    );
};

export default TableBody;