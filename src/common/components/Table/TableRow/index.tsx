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
}

const TableRow = ({ index, children, actions, header, maxVisible = 4 }: TableRowProps) => {
    const [open, setOpen] = useState(false);
    const childArray = React.Children.toArray(children);

    return (
        <>
            <MuiTableRow className="bg-transparent text-gray-100">
                {/* Tombol panah dropdown */}
                <TableCell sx={{ py: 1, width: "40px" }}>
                    {header && header.length > maxVisible && (
                        <IconButton size="small" onClick={() => setOpen(!open)} sx={{ color: "text.secondary" }}>
                            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </IconButton>
                    )}
                </TableCell>

                <TableCell sx={{ py: 1, fontSize: "1rem", width: "50px" }}>{index + 1}</TableCell>

                {childArray.map((child, idx) => {
                    const headerItem = header?.[idx];
                    const childElement = child as React.ReactElement<any>;

                    // Sembunyikan sel data utama jika indeksnya melebihi batas maxVisible
                    if (idx >= maxVisible) return null;

                    return React.cloneElement(childElement, {
                        key: idx,
                        className: headerItem?.className || childElement.props.className,
                    });
                })}

                {/* Actions */}
                {actions && (
                    <TableCell sx={{ fontSize: "1rem", minWidth: "100px", width: "auto", whiteSpace: "nowrap" }}>
                        {actions}
                    </TableCell>
                )}
            </MuiTableRow>

            {/* Kotak dropdown bawah untuk menampilkan kolom yang disembunyikan */}
            {header && header.length > maxVisible && (
                <MuiTableRow sx={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={100}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box sx={{ my: 1.5, mx: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
                                {header?.map((h, idx) => {
                                    // Hanya tampilkan di dropdown jika indeksnya di atas maxVisible
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