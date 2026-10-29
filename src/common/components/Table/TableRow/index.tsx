import React, { useState } from "react";
import { TableRow as MuiTableRow, TableCell, IconButton, Collapse, Box, Typography } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import type { TableHeaderType } from "../TableBody";

interface TableRowProps {
    index: number;
    children: React.ReactNode;
    actions?: React.ReactNode;
    header?: TableHeaderType[];
    maxVisible?: number;
    isLoading?: boolean;
    hasExpandableCols?: boolean; // <-- Tambahan props untuk mengecek ketersediaan expand
    selectAction?: React.ReactNode;
}

const TableRow = ({
    index,
    children,
    actions,
    header,
    maxVisible = 4,
    isLoading = false,
    hasExpandableCols = false,
    selectAction,
}: TableRowProps) => {
    const [open, setOpen] = useState(false);
    const childArray = React.Children.toArray(children);

    return (
        <>
            <MuiTableRow className="bg-transparent text-gray-100">
                {/* Tombol expand hanya dirender jika hasExpandableCols bernilai true */}
                {hasExpandableCols && (
                    <TableCell sx={{ py: 1, width: "40px" }}>
                        {!isLoading && header && header.length > maxVisible && (
                            <IconButton size="small" onClick={() => setOpen(!open)} sx={{ color: "text.secondary" }}>
                                {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                            </IconButton>
                        )}
                    </TableCell>
                )}

                {selectAction !== undefined && (
                    <TableCell sx={{ py: 0.5, px: 1, width: "48px" }}>
                        {!isLoading ? selectAction : null}
                    </TableCell>
                )}

                <TableCell sx={{ py: 1, fontSize: "1rem", width: "50px" }}>
                    {!isLoading ? index + 1 : null}
                </TableCell>

                {childArray.map((child, idx) => {
                    const headerItem = header?.[idx];
                    const childElement = child as React.ReactElement<any>;

                    if (!isLoading && idx >= maxVisible) return null;

                    return React.cloneElement(childElement, {
                        key: idx,
                        className: headerItem?.className || childElement.props.className,
                    });
                })}

                {actions && !isLoading && (
                    <TableCell sx={{ fontSize: "1rem", minWidth: "100px", width: "auto", whiteSpace: "nowrap" }}>
                        {actions}
                    </TableCell>
                )}
            </MuiTableRow>

            {/* Baris dropdown collapse detail hanya akan dirender jika ada kolom yang disembunyikan */}
            {hasExpandableCols && !isLoading && header && header.length > maxVisible && (
                <MuiTableRow sx={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={100}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box sx={{ my: 1.5, mx: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
                                {header?.map((h, idx) => {
                                    if (idx < maxVisible) return null;

                                    const childContent = (childArray[idx] as React.ReactElement<any>)?.props?.children;

                                    return (
                                        <Box
                                            key={idx}
                                            sx={{
                                                display: "flex",
                                                alignItems: "flex-start",
                                                justifyContent: "flex-start",
                                                gap: 2,
                                                py: 0.5,
                                                borderBottom: "1px solid rgba(148, 163, 184, 0.15)",
                                            }}
                                        >
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: "text.secondary", minWidth: "100px" }}>
                                                {h.label} :
                                            </Typography>
                                            <Box sx={{ color: "text.primary", fontSize: "0.875rem", flex: 1, wordBreak: "break-word" }}>
                                                {childContent ?? "-"}
                                            </Box>
                                        </Box>
                                    );
                                })}
                            </Box>
                        </Collapse>
                    </TableCell>
                </MuiTableRow>
            )}
        </>
    );
};

export default TableRow;