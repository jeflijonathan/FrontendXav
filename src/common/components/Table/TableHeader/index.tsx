import { Box, TextField, MenuItem, IconButton, Tooltip, debounce } from "@mui/material";
import { Search, Sort, ArrowUpward, ArrowDownward, HandymanOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";
import useDebouncer from "@utils/useDebouncer";

export interface SortOption {
    label: string;
    value: string;
}

interface TableToolbarProps {
    search: string;
    onSearchChange: (val: string) => void;
    sortBy: string;
    onSortByChange: (val: string) => void;
    sortOptions: SortOption[];
    sortDir: "asc" | "desc";
    onSortDirChange: (val: "asc" | "desc") => void;
}

const TableToolbar = ({
    search,
    onSearchChange,
    sortBy,
    onSortByChange,
    sortOptions,
    sortDir,
    onSortDirChange
}: TableToolbarProps) => {
    return (
        <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center", flexWrap: "wrap" }}>
            <TextField
                size="small"
                placeholder="Search..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                slotProps={{
                    input: {
                        startAdornment: <Search sx={{ color: "text.secondary", mr: 1, fontSize: 20 }} />
                    }
                }}
                sx={{ flexGrow: 1, minWidth: "200px" }}
            />
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <TextField
                    select
                    size="small"
                    value={sortBy}
                    onChange={(e) => onSortByChange(e.target.value)}
                    sx={{ minWidth: "150px" }}
                    slotProps={{
                        input: {
                            startAdornment: <Sort sx={{ color: "text.secondary", mr: 1, fontSize: 20 }} />
                        }
                    }}
                >
                    <MenuItem value=""><em>Default Sort</em></MenuItem>
                    {sortOptions.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                    ))}
                </TextField>

                <Tooltip title={sortDir === "asc" ? "Ascending" : "Descending"}>
                    <IconButton
                        onClick={() => onSortDirChange(sortDir === "asc" ? "desc" : "asc")}
                        size="small"
                        sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1, p: "7px" }}
                    >
                        {sortDir === "asc" ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />}
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );
};

export default TableToolbar;
