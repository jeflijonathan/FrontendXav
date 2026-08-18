import React, { useState } from "react";
import { TableRow, TableCell, IconButton, Collapse, Box, Typography } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

export interface ResponsiveColumn {
    label: string;
    content: React.ReactNode;
    hideOnMobile?: boolean;
}

interface ResponsiveTableRowProps {
    index: number;
    columns: ResponsiveColumn[];
    actions?: React.ReactNode;
}

const ResponsiveTableRow = ({ index, columns, actions }: ResponsiveTableRowProps) => {
    const [open, setOpen] = useState(false);
    const hasHiddenColumns = columns.some((col) => col.hideOnMobile);

    return (
        <>
            <TableRow className="bg-transparent text-gray-100">
                {/* Expand Toggle Column (Only visible on small screens if there are hidden columns) */}
                {hasHiddenColumns && (
                    <TableCell sx={{ py: 1, width: "50px" }} className="md:hidden">
                        <IconButton
                            size="small"
                            onClick={() => setOpen(!open)}
                            sx={{ color: "text.secondary" }}
                        >
                            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </IconButton>
                    </TableCell>
                )}

                <TableCell sx={{ py: 1, fontSize: "1rem", width: "50px" }}>{index + 1}</TableCell>

                {columns.map((col, i) => (
                    <TableCell
                        key={i}
                        sx={{ fontSize: "1rem" }}
                        className={col.hideOnMobile ? "hidden md:table-cell" : ""}
                    >
                        {col.content}
                    </TableCell>
                ))}

                {actions && (
                    <TableCell sx={{ fontSize: "1rem", width: "150px" }}>
                        {actions}
                    </TableCell>
                )}
            </TableRow>

            {/* Collapsed Row Details (Only rendered if there are hidden columns, and only shown on mobile via CSS) */}
            {hasHiddenColumns && (
                <TableRow className="md:hidden">
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={columns.length + (actions ? 3 : 2)}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 2 }}>
                                {columns
                                    .filter((col) => col.hideOnMobile)
                                    .map((col, i) => (
                                        <Box key={i} sx={{ mb: 1 }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: "bold" }}>
                                                {col.label}
                                            </Typography>
                                            <Typography variant="body2">{col.content}</Typography>
                                        </Box>
                                    ))}
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            )}
        </>
    );
};

export default ResponsiveTableRow;
