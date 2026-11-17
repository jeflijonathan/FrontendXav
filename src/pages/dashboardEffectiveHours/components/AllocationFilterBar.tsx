import React from "react";
import {
  Box,
  TextField,
  InputAdornment,
  Button,
  ButtonGroup,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Chip,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import CategoryIcon from "@mui/icons-material/Category";
import SchoolIcon from "@mui/icons-material/School";
import useDashboardEffectiveHoursStore from "../store";
import { useAllocationFilters } from "../List/hook/useAllocationFilters";
import { useAllocationList } from "../List/hook/useAllocationList";

interface Props {
  onRefresh: () => void;
}

const categoryColors: Record<string, { active: string; border: string; text: string }> = {
  default:    { active: "#6366f1", border: "#c7d2fe", text: "#4338ca" },
  kejuruan:  { active: "#d97706", border: "#fde68a", text: "#92400e" },
  umum:      { active: "#2563eb", border: "#bfdbfe", text: "#1d4ed8" },
  "muatan nasional":    { active: "#16a34a", border: "#bbf7d0", text: "#166534" },
  "muatan kewilayahan": { active: "#9333ea", border: "#e9d5ff", text: "#7e22ce" },
};

const getCatColor = (cat: string) => {
  const key = Object.keys(categoryColors).find(
    (k) => k !== "default" && cat.toLowerCase().includes(k)
  );
  return categoryColors[key || "default"];
};

export const AllocationFilterBar: React.FC<Props> = ({ onRefresh }) => {
  const { state } = useDashboardEffectiveHoursStore();
  const {
    handleSearch,
    handleFaseChange,
    handleMajorChange,
    handleCategoryChange,
  } = useAllocationFilters();
  const { categoryOptions, activeCategory, majorOptions } = useAllocationList();

  const currentFase = state.filters.fase;
  const currentMajor = state.filters.major || "all";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        p: 1.5,
        borderRadius: 2.5,
        bgcolor: "background.paper",
        border: 1,
        borderColor: "divider",
        boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
      }}
    >
      {/* ROW 1: Search + Controls */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
        }}
      >
        {/* Search Bar */}
        <Box sx={{ flex: 1, minWidth: 200 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Cari mata pelajaran, kode, jurusan, kategori..."
            value={state.search.value}
            onChange={(e) => handleSearch(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 2,
                  bgcolor: (theme) => (theme.palette.mode === "dark" ? "grey.900" : "#f8fafc"),
                },
              },
            }}
          />
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1.25 }}>
          {/* Filter Fase */}
          <ButtonGroup size="small" variant="outlined">
            {(["all", "E", "F"] as const).map((fase) => (
              <Button
                key={fase}
                variant={currentFase === fase ? "contained" : "outlined"}
                onClick={() => handleFaseChange(fase)}
                sx={{ fontWeight: 600, textTransform: "none", px: 1.5, fontSize: "0.78rem" }}
              >
                {fase === "all" ? "Semua Fase" : fase === "E" ? "Fase E (X)" : "Fase F (XI/XII)"}
              </Button>
            ))}
          </ButtonGroup>

          {/* Dropdown Jurusan */}
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <Select
              value={currentMajor}
              onChange={(e) => handleMajorChange(e.target.value)}
              displayEmpty
              startAdornment={
                <SchoolIcon sx={{ color: "primary.main", mr: 1, fontSize: 18 }} />
              }
              sx={{
                borderRadius: 2,
                fontSize: "0.82rem",
                fontWeight: 600,
                bgcolor: (theme) => (theme.palette.mode === "dark" ? "grey.900" : "#f8fafc"),
              }}
            >
              <MenuItem value="all">Semua Jurusan</MenuItem>
              <MenuItem value="general">General (All Majors)</MenuItem>
              {majorOptions.map((m) => (
                <MenuItem key={m.id} value={m.id} sx={{ fontSize: "0.82rem" }}>
                  {m.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Refresh */}
          <Tooltip title="Muat ulang data">
            <IconButton
              size="small"
              onClick={onRefresh}
              sx={{
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
                p: 0.8,
                bgcolor: (theme) => (theme.palette.mode === "dark" ? "grey.900" : "#f8fafc"),
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* ROW 2: Filter Kategori (hanya tampil jika ada >1 kategori) */}
      {categoryOptions.length > 0 && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mr: 0.5 }}>
            <CategoryIcon sx={{ fontSize: 15, color: "text.secondary" }} />
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, color: "text.secondary", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: 0.5 }}
            >
              Kategori:
            </Typography>
          </Box>

          {/* Chip: Semua */}
          <Chip
            label="Semua"
            size="small"
            onClick={() => handleCategoryChange("all")}
            variant={activeCategory === "all" ? "filled" : "outlined"}
            sx={{
              fontWeight: 700,
              fontSize: "0.73rem",
              height: 26,
              borderRadius: 2,
              cursor: "pointer",
              bgcolor: activeCategory === "all" ? "text.secondary" : "transparent",
              color: activeCategory === "all" ? "background.paper" : "text.secondary",
              borderColor: "divider",
              "&:hover": { opacity: 0.85 },
            }}
          />

          {/* Chip per kategori */}
          {categoryOptions.map((cat) => {
            const col = getCatColor(cat);
            const isActive = activeCategory === cat;
            return (
              <Chip
                key={cat}
                label={cat}
                size="small"
                onClick={() => handleCategoryChange(isActive ? "all" : cat)}
                variant={isActive ? "filled" : "outlined"}
                sx={{
                  fontWeight: 700,
                  fontSize: "0.73rem",
                  height: 26,
                  borderRadius: 2,
                  cursor: "pointer",
                  bgcolor: isActive ? col.active : "transparent",
                  color: isActive ? "#fff" : col.text,
                  borderColor: col.border,
                  "&:hover": { opacity: 0.85 },
                }}
              />
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default AllocationFilterBar;
