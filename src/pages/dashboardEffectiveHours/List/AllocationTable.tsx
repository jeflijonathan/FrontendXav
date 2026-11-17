import React, { useState } from "react";
import {
  TableCell,
  TableRow as MuiTableRow,
  Chip,
  IconButton,
  Box,
  Typography,
  Tooltip,
  TextField,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import { BaseTable } from "@components/Table";
import TableBody from "@components/Table/TableBody";
import TableRow from "@components/Table/TableRow";
import TableFooter from "@components/Table/TableFooter";
import TablePagination from "@components/Table/TablePagination";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import TranslateIcon from "@mui/icons-material/Translate";
import CalculateIcon from "@mui/icons-material/Calculate";
import PublicIcon from "@mui/icons-material/Public";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import VerifiedIcon from "@mui/icons-material/Verified";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import { useAllocationList } from "./hook/useAllocationList";
import { useAllocationFilters } from "./hook/useAllocationFilters";
import useDashboardEffectiveHoursStore from "../store";
import type { ComputedAllocationItem } from "../utils/allocationBusinessLogic";
import {
  calculateIntraWeekly,
  calculateKokuWeekly,
  calculateTotalWeekly,
  calculateRealProjected,
  evaluateAllocationDifference,
} from "../utils/allocationBusinessLogic";
import { useDeleteAllocation } from "../Delete/hook/useDeleteAllocation";
import EffectiveWeekService from "@api/effectiveweek/service";
import { snackbar } from "@utils/snackbar";

// ─── Major Abbreviation Helper ────────────────────────────────────────────────
const MAJOR_ABBREVIATIONS: Record<string, string> = {
  "strategi manajemen pendidikan": "SMP",
  "akuntansi dan keuangan lembaga": "AKL",
  "desain komunikasi visual": "DKV",
  "teknik komputer jaringan dan telekomunikasi": "TKJT",
  "teknik jaringan komputer dan telekomunikasi": "TJKT",
  "rekayasa perangkat lunak": "RPL",
  "manajemen perkantoran": "MP",
  "bisnis daring dan pemasaran": "BDP",
  "teknik komputer dan jaringan": "TKJ",
  "general (all majors)": "UMUM",
  "semua jurusan": "UMUM",
};

export const abbreviateMajor = (fullName?: string | null): string => {
  if (!fullName) return "-";
  const trimmed = fullName.trim();
  const lower = trimmed.toLowerCase();

  if (MAJOR_ABBREVIATIONS[lower]) {
    return MAJOR_ABBREVIATIONS[lower];
  }

  if (trimmed.length <= 5 && !trimmed.includes(" ")) {
    return trimmed.toUpperCase();
  }

  const stopWords = new Set(["dan", "atau", "di", "ke", "dari", "pada", "untuk", "&", "of", "and", "the"]);
  const words = trimmed
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0 && !stopWords.has(w.toLowerCase()));

  if (words.length > 1) {
    return words.map((w) => w[0].toUpperCase()).join("");
  }

  return trimmed.slice(0, 4).toUpperCase();
};

export const formatAllocationDate = (dateStr?: string | null): string => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ─── Subject Icon Helper ───────────────────────────────────────────────────────
const getSubjectIcon = (name: string, code: string) => {
  const lower = (name + " " + code).toLowerCase();
  if (lower.includes("agama") || lower.includes("pak"))
    return <AutoStoriesIcon sx={{ fontSize: 18, color: "#2563eb" }} />;
  if (lower.includes("pancasila") || lower.includes("pp"))
    return <AccountBalanceIcon sx={{ fontSize: 18, color: "#0891b2" }} />;
  if (lower.includes("indonesia") || lower.includes("ind"))
    return <TranslateIcon sx={{ fontSize: 18, color: "#7c3aed" }} />;
  if (lower.includes("matematika") || lower.includes("mat"))
    return <CalculateIcon sx={{ fontSize: 18, color: "#2563eb" }} />;
  if (lower.includes("inggris") || lower.includes("ing"))
    return <PublicIcon sx={{ fontSize: 18, color: "#0d9488" }} />;
  if (
    lower.includes("kejuruan") ||
    lower.includes("tkj") ||
    lower.includes("rpl") ||
    lower.includes("tki") ||
    lower.includes("dasar") ||
    lower.includes("pemograman")
  )
    return <WorkIcon sx={{ fontSize: 18, color: "#d97706" }} />;
  return <SchoolIcon sx={{ fontSize: 18, color: "#4f46e5" }} />;
};

// ─── Category Grouping Helper: Hanya KEJURUAN dan UMUM ────────────────────────
const groupByCategory = (
  items: ComputedAllocationItem[]
): Array<{ category: "KEJURUAN" | "UMUM"; items: ComputedAllocationItem[] }> => {
  const kejuruanItems: ComputedAllocationItem[] = [];
  const umumItems: ComputedAllocationItem[] = [];

  for (const item of items) {
    const cat = (item.category_name || "").toUpperCase();
    if (cat.includes("KEJURUAN")) {
      kejuruanItems.push(item);
    } else {
      umumItems.push(item);
    }
  }

  const result: Array<{ category: "KEJURUAN" | "UMUM"; items: ComputedAllocationItem[] }> = [];
  if (kejuruanItems.length > 0) {
    result.push({ category: "KEJURUAN", items: kejuruanItems });
  }
  if (umumItems.length > 0) {
    result.push({ category: "UMUM", items: umumItems });
  }
  return result;
};

// ─── Category Header Row Component ─────────────────────────────────────────────
interface CategoryHeaderRowProps {
  category: "KEJURUAN" | "UMUM";
  count: number;
  isOpen: boolean;
  onToggle: () => void;
}

const CategoryHeaderRow: React.FC<CategoryHeaderRowProps> = ({
  category,
  count,
  isOpen,
  onToggle,
}) => {
  const isKejuruan = category === "KEJURUAN";

  return (
    <MuiTableRow
      onClick={onToggle}
      sx={{
        cursor: "pointer",
        userSelect: "none",
        bgcolor: isKejuruan
          ? (theme) => (theme.palette.mode === "dark" ? "rgba(217, 119, 6, 0.12)" : "#fffbeb")
          : (theme) => (theme.palette.mode === "dark" ? "rgba(37, 99, 235, 0.12)" : "#eff6ff"),
        borderTop: "2px solid",
        borderTopColor: isKejuruan ? "#fde68a" : "#bfdbfe",
        borderBottom: "1px solid",
        borderBottomColor: isKejuruan ? "#fde68a" : "#bfdbfe",
        "&:hover": {
          bgcolor: isKejuruan
            ? (theme) => (theme.palette.mode === "dark" ? "rgba(217, 119, 6, 0.2)" : "#fef3c7")
            : (theme) => (theme.palette.mode === "dark" ? "rgba(37, 99, 235, 0.2)" : "#dbeafe"),
        },
      }}
    >
      <TableCell
        colSpan={100}
        sx={{
          py: 1,
          px: 2,
          borderBottom: "none",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              sx={{
                p: 0.35,
                color: isKejuruan ? "#b45309" : "#1d4ed8",
                bgcolor: isKejuruan ? "rgba(217, 119, 6, 0.15)" : "rgba(37, 99, 235, 0.15)",
                "&:hover": {
                  bgcolor: isKejuruan ? "rgba(217, 119, 6, 0.25)" : "rgba(37, 99, 235, 0.25)",
                },
              }}
            >
              {isOpen ? (
                <KeyboardArrowUpIcon sx={{ fontSize: 18 }} />
              ) : (
                <KeyboardArrowDownIcon sx={{ fontSize: 18 }} />
              )}
            </IconButton>

            {/* Pill Chip Sesuai Tampilan Tabel Mata Pelajaran */}
            <Chip
              label={category}
              size="small"
              variant="outlined"
              color={isKejuruan ? "warning" : "primary"}
              sx={{
                fontWeight: 800,
                fontSize: "0.75rem",
                letterSpacing: 0.5,
                borderRadius: "16px",
                px: 0.5,
                height: 24,
                borderColor: isKejuruan ? "#f59e0b" : "#3b82f6",
                color: isKejuruan ? "#b45309" : "#1d4ed8",
                bgcolor: isKejuruan ? "#fffbeb" : "#eff6ff",
              }}
            />

            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: "text.secondary",
                fontSize: "0.75rem",
              }}
            >
              ({count} Mata Pelajaran)
            </Typography>
          </Box>

          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              color: isKejuruan ? "#b45309" : "#1d4ed8",
              fontSize: "0.72rem",
            }}
          >
            {isOpen ? "Sembunyikan Daftar ▲" : "Tampilkan Daftar ▼"}
          </Typography>
        </Box>
      </TableCell>
    </MuiTableRow>
  );
};

// ─── Main AllocationTable Component ───────────────────────────────────────────
export const AllocationTable: React.FC = () => {
  const { filteredData, summaryStats, tableHeaders, isLoading, fetchAllocationList } =
    useAllocationList();
  const { handleChangePage } = useAllocationFilters();
  const { state } = useDashboardEffectiveHoursStore();
  const { handleDelete } = useDeleteAllocation();

  // ─── State Inline Editing Langsung di Baris Tabel ───
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ intra: number; koku: number; id_majors: string[] }>({
    intra: 0,
    koku: 0,
    id_majors: [],
  });
  const [isSavingInline, setIsSavingInline] = useState(false);

  // Expand / Collapse state per kategori (default terbuka)
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (cat: string) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  // Aktifkan mode inline edit
  const handleStartInlineEdit = (item: ComputedAllocationItem) => {
    setEditingRowId(item.id);
    const initialMajors =
      item.id_majors && item.id_majors.length > 0
        ? item.id_majors
        : item.id_major
        ? [item.id_major]
        : [];
    setEditValues({
      intra: item.jp_intra_year,
      koku: item.jp_koku_year,
      id_majors: initialMajors,
    });
  };

  // Batalkan inline edit
  const handleCancelInlineEdit = () => {
    setEditingRowId(null);
  };

  // Simpan inline edit langsung ke API backend
  const handleSaveInlineEdit = async (item: ComputedAllocationItem) => {
    if (!editValues.id_majors || editValues.id_majors.length === 0) {
      snackbar.error("Minimal 1 jurusan harus dipilih");
      return;
    }

    setIsSavingInline(true);
    const service = new EffectiveWeekService();

    await service.update(
      item.id,
      {
        id_majors: editValues.id_majors,
        id_major: editValues.id_majors.length > 0 ? editValues.id_majors[0] : null,
        Alokasi_Intrakurikuler: Number(editValues.intra || 0),
        Alokasi_Kokurikuler: Number(editValues.koku || 0),
      },
      {
        onSuccess: () => {
          setIsSavingInline(false);
          setEditingRowId(null);
          snackbar.success(
            `Alokasi ${item.subject_name} berhasil diperbarui`
          );
          fetchAllocationList();
        },
        onError: (err: any) => {
          setIsSavingInline(false);
          snackbar.error(err.message || "Gagal menyimpan perubahan alokasi");
        },
      }
    );
  };

  const handleDeleteItem = (item: ComputedAllocationItem) => {
    if (confirm(`Yakin ingin menghapus alokasi untuk "${item.subject_name}"?`)) {
      handleDelete(item.id, () => fetchAllocationList());
    }
  };

  const grouped = groupByCategory(filteredData);
  let globalIndex = 0;

  return (
    <>
      {/* ───── BANNER RUJUKAN KALENDER AKADEMIK & ANALISIS WAKTU ───── */}
      <Box
        sx={{
          p: 2,
          mb: 2.5,
          borderRadius: 3,
          border: 1,
          borderColor: (theme) =>
            theme.palette.mode === "dark" ? "rgba(59, 130, 246, 0.25)" : "#bfdbfe",
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "rgba(30, 58, 138, 0.15)" : "#eff6ff",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
          gap: 2,
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2.5,
              bgcolor: "primary.main",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <CalendarMonthIcon sx={{ fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "text.primary" }}>
              Analisis Waktu Berbasis Kalender Akademik T.A. {state.academicYear}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
              {state.academicCalendarDetails ? (
                <>
                  Ditemukan <strong>{state.effectiveWeeks} Minggu Efektif (ME)</strong>: Semester Ganjil{" "}
                  <strong>{state.academicCalendarDetails.ganjilWeeks} ME</strong> • Semester Genap{" "}
                  <strong>{state.academicCalendarDetails.genapWeeks} ME</strong> ({state.academicCalendarDetails.totalDays} Hari Belajar Riil)
                </>
              ) : (
                `Hasil sinkronisasi kalender operasional sekolah: ${state.effectiveWeeks} Minggu Efektif (ME)`
              )}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          <Chip
            size="small"
            color="primary"
            variant="filled"
            label={`ME Kalender: ${state.effectiveWeeks} Minggu`}
            sx={{ fontWeight: 800, fontSize: "0.75rem", borderRadius: 1.5 }}
          />
          <Chip
            size="small"
            color={summaryStats.totalDiffCadangan >= 0 ? "success" : "error"}
            variant="filled"
            label={`Alokasi Cadangan: ${summaryStats.totalDiffCadangan >= 0 ? "+" : ""}${summaryStats.totalDiffCadangan} JP`}
            sx={{ fontWeight: 800, fontSize: "0.75rem", borderRadius: 1.5 }}
          />
        </Box>
      </Box>

      <BaseTable breakpoint={1300}>
        <TableBody
          header={tableHeaders}
          isLoading={isLoading}
          dataLength={filteredData.length}
          skeletonRows={5}
          maxDesktopCols={11}
        >
          {grouped.flatMap(({ category, items }) => {
            const isOpen = !collapsedCategories.has(category);

            const headerRow = (
              <CategoryHeaderRow
                key={`cat-header-${category}`}
                category={category}
                count={items.length}
                isOpen={isOpen}
                onToggle={() => toggleCategory(category)}
              />
            );

            if (!isOpen) {
              return [headerRow];
            }

            const dataRows = items.map((row) => {
              const idx = globalIndex++;
              const isEditing = editingRowId === row.id;

              // Nilai kalkulasi dinamis (live preview jika sedang diedit langsung di baris)
              const currentIntraYear = isEditing ? editValues.intra : row.jp_intra_year;
              const currentKokuYear = isEditing ? editValues.koku : row.jp_koku_year;

              const liveIntraWeekly = isEditing
                ? calculateIntraWeekly(currentIntraYear)
                : row.intra_per_week;
              const liveKokuWeekly = isEditing
                ? calculateKokuWeekly(currentKokuYear)
                : row.koku_per_week;
              const liveTotalWeekly = isEditing
                ? calculateTotalWeekly(liveIntraWeekly, liveKokuWeekly)
                : row.total_per_week;
              const liveTotalYear = currentIntraYear + currentKokuYear;
              const liveRealProjected = isEditing
                ? calculateRealProjected(liveTotalWeekly, state.effectiveWeeks)
                : row.real_projected;
              const liveEvaluation = isEditing
                ? evaluateAllocationDifference(liveRealProjected, liveTotalYear)
                : row.evaluation;
              const liveDiff = liveEvaluation.diff;

              const actions = isEditing ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <Tooltip title="Simpan Perubahan (Enter)">
                    <span>
                      <IconButton
                        size="small"
                        color="primary"
                        disabled={isSavingInline}
                        onClick={() => handleSaveInlineEdit(row)}
                        sx={{
                          bgcolor: "primary.main",
                          color: "#fff",
                          width: 28,
                          height: 28,
                          boxShadow: "0 1px 4px rgba(37,99,235,0.3)",
                          "&:hover": { bgcolor: "primary.dark" },
                        }}
                      >
                        {isSavingInline ? (
                          <CircularProgress size={14} color="inherit" />
                        ) : (
                          <CheckIcon sx={{ fontSize: 16 }} />
                        )}
                      </IconButton>
                    </span>
                  </Tooltip>

                  <Tooltip title="Batal (Esc)">
                    <IconButton
                      size="small"
                      color="inherit"
                      disabled={isSavingInline}
                      onClick={handleCancelInlineEdit}
                      sx={{
                        border: 1,
                        borderColor: "divider",
                        width: 28,
                        height: 28,
                        "&:hover": { bgcolor: "action.hover" },
                      }}
                    >
                      <CloseIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              ) : (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Tooltip title="Edit Langsung di Tabel">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleStartInlineEdit(row)}
                      sx={{
                        borderRadius: 1.5,
                        p: 0.6,
                        "&:hover": { bgcolor: "primary.50" },
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Hapus">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteItem(row)}
                      sx={{
                        borderRadius: 1.5,
                        p: 0.6,
                        "&:hover": { bgcolor: "error.50" },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              );

              return (
                <TableRow
                  key={row.id}
                  index={idx}
                  header={tableHeaders}
                  actions={actions}
                >
                  {/* 1. MATA PELAJARAN & KODE */}
                  <TableCell sx={{ py: 1.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: 2,
                          bgcolor: (theme) =>
                            theme.palette.mode === "dark" ? "grey.800" : "#f1f5f9",
                          border: 1,
                          borderColor: "divider",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {getSubjectIcon(row.subject_name, row.code_subject)}
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 700, color: "text.primary", lineHeight: 1.3 }}
                        >
                          {row.subject_name}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary", fontWeight: 500, fontSize: "0.72rem" }}
                        >
                          {row.code_subject} • Fase {row.fase || "E"}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  {/* 2. KELAS */}
                  <TableCell sx={{ py: 1.5 }}>
                    <Chip
                      label={`Kelas ${row.kelas || "X"}`}
                      size="small"
                      variant="outlined"
                      sx={{
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark" ? "grey.900" : "#eff6ff",
                        borderColor: "#bfdbfe",
                        color: "#1d4ed8",
                        borderRadius: 1.5,
                      }}
                    />
                  </TableCell>

                  {/* 3. JURUSAN (Multi-Select Chips / Multi-Select Autocomplete saat Edit) */}
                  <TableCell
                    sx={{
                      py: isEditing ? 0.75 : 1.5,
                      minWidth: 260,
                      maxWidth: 380,
                    }}
                  >
                    {isEditing ? (
                      <Autocomplete
                        multiple
                        size="small"
                        options={state.majorsList}
                        getOptionLabel={(option) => option.name}
                        value={state.majorsList.filter((m) =>
                          editValues.id_majors.includes(m.id_major || m.id || "")
                        )}
                        isOptionEqualToValue={(option, val) =>
                          (option.id_major || option.id) === (val.id_major || val.id)
                        }
                        onChange={(_, newValues) => {
                          const ids = newValues.map((v) => v.id_major || v.id || "");
                          setEditValues((prev) => ({
                            ...prev,
                            id_majors: ids,
                          }));
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={
                              editValues.id_majors.length === 0
                                ? "Pilih jurusan (kosong = Semua Jurusan)..."
                                : ""
                            }
                            size="small"
                            sx={{
                              bgcolor: (theme) =>
                                theme.palette.mode === "dark" ? "grey.900" : "#fff",
                              borderRadius: 1.5,
                              "& .MuiInputBase-root": {
                                fontSize: "0.75rem",
                                py: 0.5,
                              },
                            }}
                          />
                        )}
                      />
                    ) : (
                      <Box
                        onClick={() => handleStartInlineEdit(row)}
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 0.6,
                          alignItems: "center",
                          cursor: "pointer",
                          p: 0.5,
                          borderRadius: 1.5,
                          "&:hover": { bgcolor: "action.hover" },
                        }}
                      >
                        {row.major_names && row.major_names.length > 0 ? (
                          row.major_names.map((name, i) => (
                            <Tooltip key={i} title={name} arrow placement="top">
                              <Chip
                                label={abbreviateMajor(name)}
                                size="small"
                                variant="filled"
                                color="warning"
                                sx={{
                                  fontWeight: 800,
                                  fontSize: "0.72rem",
                                  borderRadius: "16px",
                                  height: 22,
                                  cursor: "pointer",
                                  "&:hover": {
                                    boxShadow: "0 2px 6px rgba(245, 158, 11, 0.4)",
                                  },
                                }}
                              />
                            </Tooltip>
                          ))
                        ) : row.major_name &&
                          !row.major_name.toLowerCase().includes("general") &&
                          !row.major_name.toLowerCase().includes("all") ? (
                          <Tooltip title={row.major_name} arrow placement="top">
                            <Chip
                              label={abbreviateMajor(row.major_name)}
                              size="small"
                              variant="filled"
                              color="warning"
                              sx={{
                                fontWeight: 800,
                                fontSize: "0.72rem",
                                borderRadius: "16px",
                                height: 22,
                                cursor: "pointer",
                                "&:hover": {
                                  boxShadow: "0 2px 6px rgba(245, 158, 11, 0.4)",
                                },
                              }}
                            />
                          </Tooltip>
                        ) : (
                          <Tooltip title="Berlaku untuk Semua Jurusan (General)" arrow placement="top">
                            <Chip
                              label="UMUM"
                              size="small"
                              variant="outlined"
                              color="default"
                              sx={{
                                fontWeight: 800,
                                fontSize: "0.72rem",
                                borderRadius: "16px",
                                height: 22,
                                cursor: "pointer",
                              }}
                            />
                          </Tooltip>
                        )}
                      </Box>
                    )}
                  </TableCell>

                  {/* 3. JP INTRA/THN (Bisa Diedit Langsung di Sini) */}
                  <TableCell
                    sx={{
                      py: isEditing ? 0.75 : 1.5,
                      fontWeight: 700,
                      color: "text.primary",
                      cursor: !isEditing ? "pointer" : "default",
                    }}
                    onClick={() => {
                      if (!isEditing) handleStartInlineEdit(row);
                    }}
                  >
                    {isEditing ? (
                      <TextField
                        size="small"
                        type="number"
                        autoFocus
                        value={editValues.intra}
                        onChange={(e) =>
                          setEditValues((prev) => ({
                            ...prev,
                            intra: Math.max(0, Number(e.target.value)),
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveInlineEdit(row);
                          if (e.key === "Escape") handleCancelInlineEdit();
                        }}
                        slotProps={{
                          input: {
                            endAdornment: (
                              <Typography
                                variant="caption"
                                sx={{ fontWeight: 700, color: "text.secondary", mr: -0.5 }}
                              >
                                JP
                              </Typography>
                            ),
                            sx: {
                              height: 32,
                              fontSize: "0.82rem",
                              fontWeight: 700,
                              borderRadius: 1.5,
                              width: 82,
                              bgcolor: "background.paper",
                            },
                          },
                          htmlInput: { min: 0 },
                        }}
                      />
                    ) : (
                      <Tooltip title="Klik untuk ubah langsung">
                        <Box
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 0.5,
                            px: 0.75,
                            py: 0.25,
                            borderRadius: 1,
                            "&:hover": {
                              bgcolor: "action.hover",
                              outline: "1px dashed #93c5fd",
                            },
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {row.jp_intra_year} JP
                          </Typography>
                        </Box>
                      </Tooltip>
                    )}
                  </TableCell>

                  {/* 4. JP KOKU/THN (Bisa Diedit Langsung di Sini) */}
                  <TableCell
                    sx={{
                      py: isEditing ? 0.75 : 1.5,
                      fontWeight: 700,
                      color: "text.secondary",
                      cursor: !isEditing ? "pointer" : "default",
                    }}
                    onClick={() => {
                      if (!isEditing) handleStartInlineEdit(row);
                    }}
                  >
                    {isEditing ? (
                      <TextField
                        size="small"
                        type="number"
                        value={editValues.koku}
                        onChange={(e) =>
                          setEditValues((prev) => ({
                            ...prev,
                            koku: Math.max(0, Number(e.target.value)),
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveInlineEdit(row);
                          if (e.key === "Escape") handleCancelInlineEdit();
                        }}
                        slotProps={{
                          input: {
                            endAdornment: (
                              <Typography
                                variant="caption"
                                sx={{ fontWeight: 700, color: "text.secondary", mr: -0.5 }}
                              >
                                JP
                              </Typography>
                            ),
                            sx: {
                              height: 32,
                              fontSize: "0.82rem",
                              fontWeight: 700,
                              borderRadius: 1.5,
                              width: 82,
                              bgcolor: "background.paper",
                            },
                          },
                          htmlInput: { min: 0 },
                        }}
                      />
                    ) : (
                      <Tooltip title="Klik untuk ubah langsung">
                        <Box
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 0.5,
                            px: 0.75,
                            py: 0.25,
                            borderRadius: 1,
                            "&:hover": {
                              bgcolor: "action.hover",
                              outline: "1px dashed #93c5fd",
                            },
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 700, color: "text.secondary" }}
                          >
                            {row.jp_koku_year} JP
                          </Typography>
                        </Box>
                      </Tooltip>
                    )}
                  </TableCell>

                  {/* 5. TARGET MINIMAL KURIKULUM (HASIL INTRA + KOKU - PATOKAN 36 MGG) */}
                  <TableCell sx={{ py: 1.5, fontWeight: 800 }}>
                    <Tooltip title="Target Minimal Kurikulum (Patokan 36 Mgg = JP Intra/Thn + JP Koku/Thn)">
                      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                        <Chip
                          label={`${liveTotalYear} JP`}
                          size="small"
                          sx={{
                            fontWeight: 800,
                            fontSize: "0.78rem",
                            bgcolor: (theme) =>
                              theme.palette.mode === "dark" ? "grey.800" : "#f1f5f9",
                            border: 1,
                            borderColor: "divider",
                            borderRadius: 1.5,
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary", fontSize: "0.68rem", mt: 0.25 }}
                        >
                          Patokan 36 Mgg
                        </Typography>
                      </Box>
                    </Tooltip>
                  </TableCell>

                  {/* 6. INTRA / MGG (Auto-Computed Live) */}
                  <TableCell sx={{ py: 1.5, fontWeight: 700, color: "primary.main" }}>
                    {liveIntraWeekly.toFixed(1).replace(".", ",")} JP
                  </TableCell>

                  {/* 7. KOKU / MGG (Auto-Computed Live) */}
                  <TableCell sx={{ py: 1.5, fontWeight: 700, color: "secondary.main" }}>
                    {liveKokuWeekly.toFixed(1).replace(".", ",")} JP
                  </TableCell>

                  {/* 8. TOTAL / MGG (Auto-Computed Live) */}
                  <TableCell sx={{ py: 1.5, fontWeight: 800 }}>
                    <Chip
                      label={`${liveTotalWeekly.toFixed(1).replace(".", ",")} JP`}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ fontWeight: 800, fontSize: "0.78rem", borderRadius: 1.5 }}
                    />
                  </TableCell>

                  {/* 9. JAM PELAJARAN EFEKTIF (JP RIIL) = ME × TOTAL / MGG */}
                  <TableCell sx={{ py: 1.5, fontWeight: 800 }}>
                    <Tooltip
                      title={`Jam Pelajaran Efektif (JP Riil) = ME (${state.effectiveWeeks}) × Total JP/Mgg (${liveTotalWeekly.toFixed(1)})`}
                    >
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: "primary.main" }}>
                          {liveRealProjected} JP
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary", fontSize: "0.68rem" }}
                        >
                          {state.effectiveWeeks} ME Kalender
                        </Typography>
                      </Box>
                    </Tooltip>
                  </TableCell>

                  {/* 10. ANALISIS ALOKASI & DISTRIBUSI CADANGAN (ATP) */}
                  <TableCell sx={{ py: 1.5 }}>
                    <Tooltip
                      title={`Selisih / Alokasi Cadangan = JP Riil (${liveRealProjected} JP) – Target Minimal Kurikulum (${liveTotalYear} JP). ${liveEvaluation.description}`}
                    >
                      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 0.35 }}>
                        <Chip
                          label={
                            liveEvaluation.status === "cadangan"
                              ? `+${liveDiff} JP Cadangan`
                              : liveEvaluation.status === "defisit"
                              ? `${liveDiff} JP Defisit`
                              : "0 JP (Sesuai)"
                          }
                          size="small"
                          color={liveEvaluation.badgeColor}
                          variant={liveEvaluation.status === "cadangan" ? "filled" : "outlined"}
                          sx={{ fontWeight: 800, fontSize: "0.74rem", height: 23, borderRadius: 1.5 }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            color: "text.secondary",
                            fontSize: "0.68rem",
                            lineHeight: 1.2,
                            maxWidth: 160,
                          }}
                        >
                          {liveEvaluation.status === "cadangan"
                            ? "Alokasi Cadangan ATP"
                            : liveEvaluation.status === "defisit"
                            ? "Penyesuaian Modul/ATP"
                            : "Tepat target kurikulum"}
                        </Typography>
                      </Box>
                    </Tooltip>
                  </TableCell>

                  {/* 11. Created At (Disembunyikan di Desktop dan Muncul di Expand) */}
                  <TableCell sx={{ py: 1.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      {formatAllocationDate(row.created_at)}
                    </Typography>
                  </TableCell>

                  {/* 12. Updated At (Disembunyikan di Desktop dan Muncul di Expand) */}
                  <TableCell sx={{ py: 1.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      {formatAllocationDate(row.updated_at)}
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            });

            return [headerRow, ...dataRows];
          })}
        </TableBody>

        <TableFooter>
          <TablePagination
            currentPage={state.pagination.page}
            totalPage={state.pagination.total_pages}
            onChange={handleChangePage}
          />
        </TableFooter>
      </BaseTable>

      {/* ───── FOOTER LEGEND (Mobile Friendly & Responsive) ───── */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          gap: { xs: 1.5, sm: 2 },
          mt: 2,
          px: { xs: 1, sm: 1.5 },
          py: { xs: 1.25, sm: 0 },
          borderRadius: { xs: 2, sm: 0 },
          bgcolor: { xs: "background.paper", sm: "transparent" },
          border: { xs: 1, sm: 0 },
          borderColor: "divider",
        }}
      >
        {/* Legend Bullets */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            gap: { xs: 1, sm: 2.5 },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                bgcolor: "#2563eb",
                flexShrink: 0,
              }}
            />
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color: "text.secondary",
                fontSize: { xs: "0.72rem", sm: "0.76rem" },
              }}
            >
              Intrakurikuler (Tatap Muka Teori & Praktik)
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                bgcolor: "#9333ea",
                flexShrink: 0,
              }}
            />
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color: "text.secondary",
                fontSize: { xs: "0.72rem", sm: "0.76rem" },
              }}
            >
              Kokurikuler (Projek P5)
            </Typography>
          </Box>
        </Box>

        {/* Verification Status */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            width: { xs: "100%", sm: "auto" },
            justifyContent: { xs: "flex-start", sm: "flex-end" },
            pt: { xs: 1, sm: 0 },
            borderTop: { xs: 1, sm: 0 },
            borderColor: "divider",
          }}
        >
          <VerifiedIcon sx={{ fontSize: 16, color: "success.main", flexShrink: 0 }} />
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              color: "text.secondary",
              fontSize: { xs: "0.7rem", sm: "0.75rem" },
            }}
          >
            Menampilkan {filteredData.length} Mata Pelajaran ({grouped.map(g => `${g.items.length} ${g.category}`).join(", ")})
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default AllocationTable;
