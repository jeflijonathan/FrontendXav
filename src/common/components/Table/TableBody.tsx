import {
    TableHead,
    TableBody as MuiTableBody,
    TableRow,
    TableCell,
    CircularProgress,
    Box,
    Typography,
} from "@mui/material";
import type { ReactNode } from "react";

export interface TableHeader {
    label: string;
    width?: string;
    className?: string;
}

interface TableBodyProps {
    header: TableHeader[];
    children: ReactNode;
    isLoading?: boolean;
    dataLength?: number;
    disableAction?: boolean;
    className?: string;
}

const TableBody = ({
    header,
    children,
    isLoading = false,
    dataLength = 0,
    className,
}: TableBodyProps) => {
    return (
        <>
            <TableHead>
                <TableRow>
                    {header.map((h, i) => (
                        <TableCell
                            key={i}
                            sx={{
                                fontWeight: "bold",
                                fontSize: "0.875rem",
                                color: "#94a3b8",
                                borderBottom: "1px solid rgba(148, 163, 184, 0.2)",
                            }}
                        >
                            {h.label}
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <MuiTableBody className={className}>
                {isLoading ? (
                    <TableRow>
                        <TableCell colSpan={header.length} align="center" sx={{ py: 4 }}>
                            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2 }}>
                                <CircularProgress size={24} />
                                <Typography color="text.secondary">Loading...</Typography>
                            </Box>
                        </TableCell>
                    </TableRow>
                ) : dataLength === 0 ? (
                    <TableRow>
                        <TableCell colSpan={header.length} align="center" sx={{ py: 4 }}>
                            <Typography color="text.secondary">No data available</Typography>
                        </TableCell>
                    </TableRow>
                ) : (
                    children
                )}
            </MuiTableBody>
        </>
    );
};

export default TableBody;
