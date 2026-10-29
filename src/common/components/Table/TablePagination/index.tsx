import { Box, IconButton, MenuItem, Select, Typography } from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";

interface TablePaginationProps {
    currentPage: number;
    totalPage: number;
    onChange: (page: number) => void;
    limit?: number;
    onLimitChange?: (limit: number) => void;
    limitOptions?: number[];
    totalData?: number;
}

const TablePagination = ({
    currentPage,
    totalPage,
    onChange,
    limit,
    onLimitChange,
    limitOptions = [5, 10, 25, 50, 100],
    totalData,
}: TablePaginationProps) => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 2,
                py: 1,
                px: 2,
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {totalData !== undefined && (
                    <Typography variant="body2" color="text.secondary">
                        Total {totalData} data
                    </Typography>
                )}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, ml: "auto" }}>
                {onLimitChange && limit !== undefined && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            Baris per halaman:
                        </Typography>
                        <Select
                            size="small"
                            value={limit}
                            onChange={(e) => onLimitChange(Number(e.target.value))}
                            sx={{
                                height: 32,
                                fontSize: "0.875rem",
                                borderRadius: "6px",
                                "& .MuiSelect-select": { py: "4px", px: "8px" },
                            }}
                        >
                            {limitOptions.map((opt) => (
                                <MenuItem key={opt} value={opt}>
                                    {opt}
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>
                )}

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        Page {currentPage} of {Math.max(1, totalPage)}
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
            </Box>
        </Box>
    );
};

export default TablePagination;
