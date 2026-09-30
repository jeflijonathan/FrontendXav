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
    maxDesktopCols?: number;
}

const TableBody = ({
    header,
    children,
    isLoading = false,
    dataLength = 0,
    className,
    skeletonRows = 5,
    maxDesktopCols = 12,
}: TableBodyProps) => {
    const isCompact = useTableStore((state) => state.isCompact);
    const containerWidth = useTableStore((state) => state.containerWidth);

    // Hitung berapa kolom yang muat secara dinamis berdasarkan lebar layar (dikurangi Actions, No, dan padding)
    let dynamicMaxVisible = 0;
    let availableWidth = containerWidth - 250; // Buffer 250px untuk No, Actions, dan panah

    for (let i = 0; i < header.length; i++) {
        // Ambil angka dari width (contoh: "150px" -> 150), default 100
        const w = parseInt(header[i].width || "100", 10);
        if (availableWidth >= w) {
            availableWidth -= w;
            dynamicMaxVisible++;
        } else {
            break;
        }
    }
    // Pastikan tidak melebihi maxDesktopCols jika diset, dan minimal 1 (selalu tampilkan setidaknya kolom utama)
    dynamicMaxVisible = Math.max(1, Math.min(dynamicMaxVisible, maxDesktopCols || header.length));

    const maxVisibleCols = dynamicMaxVisible;

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