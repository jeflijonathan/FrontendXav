import { Table, TableContainer, Paper } from "@mui/material";
import type { ReactNode } from "react";

interface BaseTableProps {
    children: ReactNode;
}

const BaseTable = ({ children }: BaseTableProps) => {
    return (
        <TableContainer
            component={Paper}
            sx={{
                backgroundColor: "transparent",
                boxShadow: "none",
                borderRadius: "12px",
                overflow: "hidden",
            }}
        >
            <Table sx={{ minWidth: 650 }}>
                {children}
            </Table>
        </TableContainer>
    );
};

export default BaseTable;
