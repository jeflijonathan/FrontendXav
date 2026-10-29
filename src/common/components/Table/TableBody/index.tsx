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
    selectAction?: ReactNode;
}

const TableBody = ({
    header,
    children,
    isLoading = false,
    dataLength = 0,
    className,
    skeletonRows = 5,
    maxDesktopCols = 12,
    selectAction,
}: TableBodyProps) => {
    const containerWidth = useTableStore((state) => state.containerWidth);

    let dynamicMaxVisible = 0;
    let availableWidth = containerWidth - 250;

    for (let i = 0; i < header.length; i++) {
        const w = parseInt(header[i].width || "100", 10);
        if (availableWidth >= w) {
            availableWidth -= w;
            dynamicMaxVisible++;
        } else {
            break;
        }
    }

    dynamicMaxVisible = Math.max(1, Math.min(dynamicMaxVisible, maxDesktopCols || header.length));

    const maxVisibleCols = dynamicMaxVisible;

    // Tentukan apakah ada kolom yang disembunyikan dan perlu tombol expand
    const hasExpandableCols = header.length > maxVisibleCols;

    const renderTableLoading = () => {
        return Array.from(new Array(skeletonRows)).map((_, rowIndex) => (
            <MuiTableRow key={`skeleton-row-${rowIndex}`}>
                {/* Kolom Expand hanya muncul jika ada kolom yang disembunyikan */}
                {hasExpandableCols && (
                    <TableCell sx={{ width: "40px", borderBottom: "1px solid rgba(148, 163, 184, 0.2)" }}>
                        <SkeletonLoader isLoading={!isLoading} variant="circular" width="20px" height="20px">
                            <div style={{ width: "20px", height: "20px", backgroundColor: "#e2e8f0", borderRadius: "50%" }} />
                        </SkeletonLoader>
                    </TableCell>
                )}

                {selectAction !== undefined && (
                    <TableCell sx={{ width: "48px", px: 1, py: 1, borderBottom: "1px solid rgba(148, 163, 184, 0.2)" }}>
                        <SkeletonLoader isLoading={!isLoading} variant="rectangular" width="20px" height="20px">
                            <div style={{ width: "20px", height: "20px", backgroundColor: "#e2e8f0", borderRadius: "4px" }} />
                        </SkeletonLoader>
                    </TableCell>
                )}

                <TableCell sx={{ width: "50px", borderBottom: "1px solid rgba(148, 163, 184, 0.2)" }}>
                    <SkeletonLoader isLoading={!isLoading} variant="text" width="100%" height={20}>
                        <div style={{ width: "24px", height: "20px", backgroundColor: "#e2e8f0", borderRadius: "4px" }} />
                    </SkeletonLoader>
                </TableCell>

                {header.map((h, colIndex) => {
                    if (colIndex >= maxVisibleCols) return null;
                    return (
                        <TableCell
                            key={`skeleton-cell-${colIndex}`}
                            sx={{
                                borderBottom: "1px solid rgba(148, 163, 184, 0.2)",
                                ...(h.width ? { width: h.width } : {})
                            }}
                        >
                            <SkeletonLoader isLoading={!isLoading} variant="text" width="100%" height={24}>
                                <div style={{ width: "85%", height: "24px", backgroundColor: "#e2e8f0", borderRadius: "4px" }} />
                            </SkeletonLoader>
                        </TableCell>
                    );
                })}

                <TableCell sx={{ borderBottom: "1px solid rgba(148, 163, 184, 0.2)", minWidth: "100px" }}>
                    <SkeletonLoader isLoading={!isLoading} variant="text" width="100%" height={24}>
                        <div style={{ width: "70px", height: "24px", backgroundColor: "#e2e8f0", borderRadius: "4px" }} />
                    </SkeletonLoader>
                </TableCell>
            </MuiTableRow>
        ));
    };

    const TableEmpty = () => {
        // Sesuaikan colSpan berdasarkan ada tidaknya kolom expand dan select
        const colSpanCount = header.length + (hasExpandableCols ? 3 : 2) + (selectAction !== undefined ? 1 : 0);
        return (
            <MuiTableRow>
                <TableCell colSpan={colSpanCount} align="center" sx={{ py: 4, borderBottom: "1px solid rgba(148, 163, 184, 0.2)" }}>
                    <Typography color="text.secondary">No data available</Typography>
                </TableCell>
            </MuiTableRow>
        );
    };

    const processedChildren = React.Children.map(children, (child) => {
        if (isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
                header,
                maxVisible: maxVisibleCols,
                hasExpandableCols
            });
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
                    {/* Tampilkan header Expand hanya jika ada kolom yang disembunyikan */}
                    {hasExpandableCols && (
                        <TableCell sx={{
                            fontWeight: "bold",
                            fontSize: "0.875rem",
                            color: "#94a3b8", width: "40px", borderBottom: "1px solid rgba(148, 163, 184, 0.2)"
                        }}>Expand</TableCell>
                    )}

                    {selectAction !== undefined && (
                        <TableCell sx={{
                            width: "48px",
                            px: 1,
                            py: 0.5,
                            borderBottom: "1px solid rgba(148, 163, 184, 0.2)",
                        }}>
                            {selectAction}
                        </TableCell>
                    )}

                    <TableCell sx={{
                        fontWeight: "bold",
                        fontSize: "0.875rem",
                        color: "#94a3b8", width: "50px", borderBottom: "1px solid rgba(148, 163, 184, 0.2)"
                    }}>No</TableCell>

                    {header.map((h, i) => {
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