import { Box, IconButton, Typography } from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";

interface TablePaginationProps {
    currentPage: number;
    totalPage: number;
    onChange: (page: number) => void;
}

const TablePagination = ({ currentPage, totalPage, onChange }: TablePaginationProps) => {
    return (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 1, py: 1, px: 2 }}>
            <Typography variant="body2" color="text.secondary">
                Page {currentPage} of {totalPage}
            </Typography>
            <IconButton
                size="small"
                disabled={currentPage <= 1}
                onClick={() => onChange(currentPage - 1)}
            >
                <KeyboardArrowLeft />
            </IconButton>
            <IconButton
                size="small"
                disabled={currentPage >= totalPage}
                onClick={() => onChange(currentPage + 1)}
            >
                <KeyboardArrowRight />
            </IconButton>
        </Box>
    );
};

export default TablePagination;
