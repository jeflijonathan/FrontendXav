import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Chip,
  Paper,
  Button,
  CircularProgress,
  Tooltip,
  TextField,
  InputAdornment,
  Collapse,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventNoteIcon from "@mui/icons-material/EventNote";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SchoolIcon from "@mui/icons-material/School";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import CalculateIcon from "@mui/icons-material/Calculate";
import type { AllocationSummaryStats } from "../utils/allocationBusinessLogic";
import useDashboardEffectiveHoursStore from "../store";
import { useAllocationList } from "../List/hook/useAllocationList";

interface Props {
  summary: AllocationSummaryStats;
}

export const AllocationKpiCards: React.FC<Props> = ({ summary }) => {
  const navigate = useNavigate();
  const { state } = useDashboardEffectiveHoursStore();
  const { lessonDuration, workDays, isUpdatingSchoolInfo, updateLessonDuration } =
    useAllocationList();

  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customValue, setCustomValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const kelasLabel =
    state.filters.kelas && state.filters.kelas !== "all"
      ? `Kelas ${state.filters.kelas}`
      : "Semua Kelas";
  const surplusSign = summary.totalDiffCadangan >= 0 ? "+" : "";

  useEffect(() => {
    if (isCustomMode) {
      setCustomValue(String(lessonDuration));
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isCustomMode, lessonDuration]);

  const handleCustomConfirm = () => {
    const val = parseInt(customValue, 10);
    if (!isNaN(val) && val >= 1 && val <= 120) {
      updateLessonDuration(val);
      setIsCustomMode(false);
    }
  };

  const handleCustomCancel = () => {
    setIsCustomMode(false);
    setCustomValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleCustomConfirm();
    if (e.key === "Escape") handleCustomCancel();
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {/* 1. DURASI 1 JP - bisa pilih 45/35 atau custom */}
      <Paper
        elevation={0}
        sx={{
          p: 2.25,
          borderRadius: 3,
          border: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.25 }}>
          <Typography
            variant="caption"
            sx={{ fontWeight: 800, color: "text.secondary", letterSpacing: 0.5, textTransform: "uppercase", fontSize: "0.72rem" }}
          >
            DURASI 1 JP (JAM BELAJAR)
          </Typography>
          <Box sx={{ width: 32, height: 32, borderRadius: 2, bgcolor: "primary.50", color: "primary.main", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <SchoolIcon sx={{ fontSize: 18 }} />
          </Box>
        </Box>

        {/* Nilai utama */}
        <Box sx={{ my: 0.25 }}>
          {!isCustomMode ? (
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.75 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: "text.primary", lineHeight: 1 }}>
                {lessonDuration}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: "text.secondary" }}>
                Menit / JP
              </Typography>
              {isUpdatingSchoolInfo && <CircularProgress size={14} sx={{ ml: 0.5, color: "primary.main" }} />}
            </Box>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
              <TextField
                inputRef={inputRef}
                size="small"
                type="number"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. 50"
                slotProps={{
                  input: {
                    endAdornment: <InputAdornment position="end"><Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>mnt</Typography></InputAdornment>,
                    sx: { borderRadius: 1.5, fontSize: "0.85rem", fontWeight: 700 },
                  },
                  htmlInput: { min: 1, max: 120 },
                }}
                sx={{ width: 110 }}
              />
              <Tooltip title="Simpan">
                <Button size="small" variant="contained" color="primary" onClick={handleCustomConfirm}
                  sx={{ minWidth: 0, p: 0.6, borderRadius: 1.5 }}>
                  <CheckIcon sx={{ fontSize: 16 }} />
                </Button>
              </Tooltip>
              <Tooltip title="Batal">
                <Button size="small" variant="outlined" color="inherit" onClick={handleCustomCancel}
                  sx={{ minWidth: 0, p: 0.6, borderRadius: 1.5 }}>
                  <CloseIcon sx={{ fontSize: 16 }} />
                </Button>
              </Tooltip>
            </Box>
          )}

          {/* Tombol pilihan cepat + Custom */}
          <Collapse in={!isCustomMode}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mt: 1.25, flexWrap: "wrap" }}>
              <Tooltip title="Standar nasional: 45 menit/JP">
                <Button
                  size="small"
                  variant={lessonDuration === 45 ? "contained" : "outlined"}
                  disabled={isUpdatingSchoolInfo}
                  onClick={() => updateLessonDuration(45)}
                  sx={{ py: 0.3, px: 1.1, minWidth: 0, fontSize: "0.73rem", fontWeight: 700, borderRadius: 1.75, textTransform: "none" }}
                >
                  45 Menit
                </Button>
              </Tooltip>

              <Tooltip title="Jadwal khusus: 35 menit/JP">
                <Button
                  size="small"
                  variant={lessonDuration === 35 ? "contained" : "outlined"}
                  disabled={isUpdatingSchoolInfo}
                  onClick={() => updateLessonDuration(35)}
                  sx={{ py: 0.3, px: 1.1, minWidth: 0, fontSize: "0.73rem", fontWeight: 700, borderRadius: 1.75, textTransform: "none" }}
                >
                  35 Menit
                </Button>
              </Tooltip>

              <Tooltip title="Masukkan durasi kustom (1-120 menit)">
                <Button
                  size="small"
                  variant={lessonDuration !== 45 && lessonDuration !== 35 ? "contained" : "outlined"}
                  disabled={isUpdatingSchoolInfo}
                  onClick={() => setIsCustomMode(true)}
                  startIcon={<EditIcon sx={{ fontSize: "0.78rem !important" }} />}
                  sx={{ py: 0.3, px: 1.1, minWidth: 0, fontSize: "0.73rem", fontWeight: 700, borderRadius: 1.75, textTransform: "none" }}
                >
                  Custom
                </Button>
              </Tooltip>
            </Box>
          </Collapse>
        </Box>

        <Box sx={{ mt: 1.5, pt: 1, borderTop: 1, borderColor: "divider", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
            Sistem: <strong>{workDays} Hari Belajar</strong> ({workDays === 6 ? "Senin-Sabtu" : "Senin-Jumat"})
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              size="small"
              variant="text"
              color="primary"
              onClick={() => navigate("/roster-jam")}
              sx={{ p: 0, minWidth: "auto", fontSize: "0.7rem", fontWeight: 700, textTransform: "none" }}
            >
              Roster Jam ↗
            </Button>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: isUpdatingSchoolInfo ? "warning.main" : "success.main" }} />
              <Typography variant="caption" sx={{ fontSize: "0.68rem", color: "text.secondary", fontWeight: 600 }}>
                {isUpdatingSchoolInfo ? "Menyimpan..." : "Info Sekolah"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* 2. TARGET ALOKASI TAHUNAN (TARGET MINIMAL KURIKULUM) */}
      <Paper
        elevation={0}
        sx={{
          p: 2.25,
          borderRadius: 3,
          border: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.25 }}>
          <Typography
            variant="caption"
            sx={{ fontWeight: 800, color: "text.secondary", letterSpacing: 0.5, textTransform: "uppercase", fontSize: "0.72rem" }}
          >
            TARGET ALOKASI TAHUNAN
          </Typography>
          <Box sx={{ width: 32, height: 32, borderRadius: 2, bgcolor: "warning.50", color: "warning.main", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CalculateIcon sx={{ fontSize: 18 }} />
          </Box>
        </Box>
        <Box sx={{ my: 0.25 }}>
          <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.75 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "text.primary", lineHeight: 1 }}>
              {summary.totalOverallYear}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "text.secondary" }}>
              JP / Tahun
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mt: 1.25, flexWrap: "wrap" }}>
            <Chip
              label={`Intra: ${summary.totalIntraYear} JP`}
              size="small"
              sx={{
                fontWeight: 700,
                fontSize: "0.72rem",
                bgcolor: (theme) => theme.palette.mode === "dark" ? "grey.800" : "#eff6ff",
                color: "primary.main",
                borderColor: "#bfdbfe",
                border: 1,
                borderRadius: 1.5,
              }}
            />
            <Chip
              label={`P5: ${summary.totalKokuYear} JP`}
              size="small"
              sx={{
                fontWeight: 700,
                fontSize: "0.72rem",
                bgcolor: (theme) => theme.palette.mode === "dark" ? "grey.800" : "#faf5ff",
                color: "secondary.main",
                borderColor: "#e9d5ff",
                border: 1,
                borderRadius: 1.5,
              }}
            />
          </Box>
        </Box>
        <Box sx={{ mt: 1.5, pt: 1, borderTop: 1, borderColor: "divider", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
            Patokan 36 Mgg:
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 700, color: "text.primary", fontSize: "0.72rem" }}>
            Rasio P5 {summary.p5RatioPercent.toFixed(1).replace(".", ",")}%
          </Typography>
        </Box>
      </Paper>

      {/* 3. TOTAL JP MINGGUAN */}
      <Paper elevation={0} sx={{ p: 2.25, borderRadius: 3, border: 1, borderColor: "divider", bgcolor: "background.paper", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.25 }}>
          <Typography variant="caption" sx={{ fontWeight: 800, color: "text.secondary", letterSpacing: 0.5, textTransform: "uppercase", fontSize: "0.72rem" }}>
            TOTAL JP MINGGUAN ({kelasLabel})
          </Typography>
          <Box sx={{ width: 32, height: 32, borderRadius: 2, bgcolor: "info.50", color: "info.main", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <AccessTimeIcon sx={{ fontSize: 18 }} />
          </Box>
        </Box>
        <Box sx={{ my: 0.25 }}>
          <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.75 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "text.primary", lineHeight: 1 }}>
              {summary.totalWeekly.toFixed(1).replace(".", ",")}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "text.secondary" }}>
              JP / Minggu
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mt: 1.25, flexWrap: "wrap" }}>
            <Chip
              label={`Intra: ${summary.totalIntraWeekly.toFixed(1).replace(".", ",")} JP`}
              size="small"
              sx={{
                fontWeight: 700,
                fontSize: "0.72rem",
                bgcolor: (theme) => theme.palette.mode === "dark" ? "grey.800" : "#eff6ff",
                color: "primary.main",
                borderColor: "#bfdbfe",
                border: 1,
                borderRadius: 1.5,
              }}
            />
            <Chip
              label={`P5: ${summary.totalKokuWeekly.toFixed(1).replace(".", ",")} JP`}
              size="small"
              sx={{
                fontWeight: 700,
                fontSize: "0.72rem",
                bgcolor: (theme) => theme.palette.mode === "dark" ? "grey.800" : "#faf5ff",
                color: "secondary.main",
                borderColor: "#e9d5ff",
                border: 1,
                borderRadius: 1.5,
              }}
            />
          </Box>
        </Box>
        <Box sx={{ mt: 1.5, pt: 1, borderTop: 1, borderColor: "divider", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>Kapasitas Maks Pekan:</Typography>
          <Typography variant="caption" sx={{ fontWeight: 700, color: "success.main", fontSize: "0.72rem" }}>
            {summary.capacityAvailable.toFixed(0)} JP Tersedia
          </Typography>
        </Box>
      </Paper>

      {/* 4. AKUMULASI JP KALENDER RIIL */}
      <Paper elevation={0} sx={{ p: 2.25, borderRadius: 3, border: 1, borderColor: "divider", bgcolor: "background.paper", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.25 }}>
          <Typography variant="caption" sx={{ fontWeight: 800, color: "text.secondary", letterSpacing: 0.5, textTransform: "uppercase", fontSize: "0.72rem" }}>
            AKUMULASI JP KALENDER RIIL
          </Typography>
          <Box sx={{ width: 32, height: 32, borderRadius: 2, bgcolor: "secondary.50", color: "secondary.main", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <EventNoteIcon sx={{ fontSize: 18 }} />
          </Box>
        </Box>
        <Box sx={{ my: 0.25 }}>
          <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.75 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "primary.main", lineHeight: 1 }}>
              {summary.totalRealProjected}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "text.secondary" }}>
              JP ({summary.effectiveWeeks} ME Kalender)
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.72rem", mt: 0.5, display: "block" }}>
            ME ({summary.effectiveWeeks}) × Total {summary.totalWeekly.toFixed(1).replace(".", ",")} JP/Mgg
          </Typography>
        </Box>
        <Box sx={{ mt: 1.5, pt: 1, borderTop: 1, borderColor: "divider", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
            {state.academicCalendarDetails
              ? `Ganjil ${state.academicCalendarDetails.ganjilWeeks} ME • Genap ${state.academicCalendarDetails.genapWeeks} ME`
              : "Vs Standar 36 Mgg:"}
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 700, color: summary.totalDiffCadangan >= 0 ? "success.main" : "error.main", fontSize: "0.72rem" }}>
            {surplusSign}{summary.totalDiffCadangan} JP Cadangan
          </Typography>
        </Box>
      </Paper>

      {/* 5. ANALISIS ALOKASI & CADANGAN (ATP) */}
      <Paper elevation={0} sx={{ p: 2.25, borderRadius: 3, border: 1, borderColor: "divider", bgcolor: "background.paper", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.25 }}>
          <Typography variant="caption" sx={{ fontWeight: 800, color: "text.secondary", letterSpacing: 0.5, textTransform: "uppercase", fontSize: "0.72rem" }}>
            ANALISIS ALOKASI & CADANGAN
          </Typography>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 2,
              bgcolor: summary.totalDiffCadangan >= 0 ? "success.50" : "error.50",
              color: summary.totalDiffCadangan >= 0 ? "success.main" : "error.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 18 }} />
          </Box>
        </Box>
        <Box sx={{ my: 0.25, display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Chip
              label={`${summary.totalDiffCadangan >= 0 ? "+" : ""}${summary.totalDiffCadangan} JP Cadangan`}
              size="small"
              variant="filled"
              color={summary.totalDiffCadangan >= 0 ? "success" : "error"}
              sx={{ fontWeight: 800, fontSize: "0.78rem", py: 0.5, borderRadius: 1.5 }}
            />
          </Box>
          <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.7rem", lineHeight: 1.3 }}>
            {summary.globalEvaluation.status === "cadangan"
              ? "Surplus Cadangan ATP (siap dialokasikan untuk modul & pengayaan)"
              : summary.globalEvaluation.status === "defisit"
              ? "Defisit jam: guru perlu menyesuaikan alur tujuan pembelajaran (ATP)"
              : "Alokasi jam riil tepat sesuai struktur kurikulum nasional"}
          </Typography>
        </Box>
        <Box sx={{ mt: 1.5, pt: 1, borderTop: 1, borderColor: "divider", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
            Evaluasi Global:
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 700, color: "text.primary", fontSize: "0.72rem" }}>
            {summary.complianceLabel}
          </Typography>
        </Box>
      </Paper>
    </div>
  );
};

export default AllocationKpiCards;
