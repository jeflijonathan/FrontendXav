import { Paper, Table, TableContainer } from "@mui/material";
import { type ReactNode, useEffect, useRef } from "react";
import { useTableStore } from "@common/store/useTableStore";

interface BaseTableProps {
    children: ReactNode;
    breakpoint?: number;
}

const BaseTable = ({ children, breakpoint = 768 }: BaseTableProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const setIsCompact = useTableStore((state) => state.setIsCompact);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const currentWidth = entry.contentRect.width;
                setIsCompact(currentWidth < breakpoint);
            }
        });

        observer.observe(container);
        return () => observer.disconnect();
    }, [breakpoint, setIsCompact]);

    return (
        <TableContainer
            ref={containerRef}
            component={Paper}
            sx={{
                backgroundColor: "transparent",
                boxShadow: "none",
                borderRadius: "12px",
                overflowX: "auto",
                width: "100%",
            }}
        >
            <Table sx={{ width: "100%", minWidth: "100%" }}>
                {children}
            </Table>
        </TableContainer>
    );
};

export default BaseTable;