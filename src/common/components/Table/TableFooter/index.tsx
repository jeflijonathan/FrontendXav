import { TableFooter as MuiTableFooter, TableRow, TableCell } from "@mui/material";
import type { ReactNode } from "react";

interface TableFooterProps {
    children: ReactNode;
    colSpan?: number;
}

const TableFooter = ({ children, colSpan = 10 }: TableFooterProps) => {
    return (
        <MuiTableFooter>
            <TableRow>
                <TableCell colSpan={colSpan} sx={{ borderBottom: "none" }}>
                    {children}
                </TableCell>
            </TableRow>
        </MuiTableFooter>
    );
};

export default TableFooter;
