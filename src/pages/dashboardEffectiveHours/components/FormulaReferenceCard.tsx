import React from "react";
import { Box, Typography, Chip, Paper } from "@mui/material";
import FunctionsIcon from "@mui/icons-material/Functions";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import useDashboardEffectiveHoursStore from "../store";

export const FormulaReferenceCard: React.FC = () => {
  const { state } = useDashboardEffectiveHoursStore();
  const weeks = state.effectiveWeeks;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 3,
        border: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <Box>
        {/* Header Top */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 2,
                bgcolor: "success.50",
                color: "success.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FunctionsIcon fontSize="small" />
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "text.primary" }}>
              Rujukan Beban Belajar SMK Kurikulum Merdeka (Kemendikdasmen)
            </Typography>
          </Box>
          <Chip
            label="Auto-Computed"
            size="small"
            color="success"
            variant="filled"
            sx={{ fontWeight: 700, fontSize: "0.72rem", height: 24, borderRadius: 1.5 }}
          />
        </Box>

        {/* Kotak Formula Rujukan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mb-2.5">
          {/* Formula 1 */}
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: (theme) => (theme.palette.mode === "dark" ? "grey.900" : "#f8fafc"),
              border: 1,
              borderColor: "divider",
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 800, color: "text.secondary", display: "block", textTransform: "uppercase", fontSize: "0.68rem" }}>
              1. ALOKASI INTRA MINGGUAN
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 800, color: "primary.main", my: 0.25 }}>
              Intra/Mgg = JP Intra Thn ÷ 36
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem", display: "block" }}>
              Dihitung pembulatan 1 desimal
            </Typography>
          </Box>

          {/* Formula 2 */}
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: (theme) => (theme.palette.mode === "dark" ? "grey.900" : "#f8fafc"),
              border: 1,
              borderColor: "divider",
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 800, color: "text.secondary", display: "block", textTransform: "uppercase", fontSize: "0.68rem" }}>
              2. ALOKASI P5 (KOKURIKULER)
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 800, color: "secondary.main", my: 0.25 }}>
              Koku/Mgg = JP Koku Thn ÷ 36
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem", display: "block" }}>
              Sesuai proporsi 20-30%
            </Typography>
          </Box>

          {/* Formula 3 */}
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: (theme) => (theme.palette.mode === "dark" ? "grey.900" : "#f8fafc"),
              border: 1,
              borderColor: "divider",
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 800, color: "text.secondary", display: "block", textTransform: "uppercase", fontSize: "0.68rem" }}>
              3. TOTAL BEBAN MINGGUAN
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 800, color: "text.primary", my: 0.25 }}>
              Total/Mgg = Intra/Mgg + Koku/Mgg
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem", display: "block" }}>
              Beban mengajar riil per pekan
            </Typography>
          </Box>

          {/* Formula 4 */}
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: (theme) => (theme.palette.mode === "dark" ? "grey.900" : "#f8fafc"),
              border: 1,
              borderColor: "divider",
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 800, color: "text.secondary", display: "block", textTransform: "uppercase", fontSize: "0.68rem" }}>
              4. JP EFEKTIF RIIL KALENDER
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 800, color: "info.main", my: 0.25 }}>
              JP Riil = ME × Total JP per Minggu
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem", display: "block" }}>
              ME = {weeks} Minggu Efektif dari Kalender Akademik
            </Typography>
          </Box>

          {/* Formula 5 */}
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: (theme) => (theme.palette.mode === "dark" ? "grey.900" : "#f8fafc"),
              border: 1,
              borderColor: "divider",
              gridColumn: { sm: "span 2", lg: "span 2" },
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 800, color: "text.secondary", display: "block", textTransform: "uppercase", fontSize: "0.68rem" }}>
              5. DISTRIBUSI ALOKASI CADANGAN (ATP / MODUL AJAR)
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 800, color: "success.main", my: 0.25 }}>
              Selisih / Alokasi Cadangan = JP Riil Lapangan – Target Minimal Kurikulum (36 Mgg)
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem", display: "block" }}>
              (+) Positif: Jam Cadangan & Pengayaan pada Alur Tujuan Pembelajaran (ATP) • (-) Negatif: Defisit jam / Penyesuaian TP
            </Typography>
          </Box>
        </div>
      </Box>

      {/* Footer Alert Note */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 1.25,
          p: 1.25,
          borderRadius: 2,
          bgcolor: (theme) => (theme.palette.mode === "dark" ? "grey.900" : "#f8fafc"),
          border: 1,
          borderColor: "divider",
        }}
      >
        <InfoOutlinedIcon sx={{ fontSize: 18, color: "info.main", mt: 0.25, flexShrink: 0 }} />
        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4 }}>
          Regulasi Kemendikdasmen (Permendikbudristek No. 12/2024 & Panduan PPA SMK): Pembagian berbasis 36 minggu (X-XI) & sinkronisasi kalender operasional semester ganjil/genap Dapodik.
        </Typography>
      </Box>
    </Paper>
  );
};

export default FormulaReferenceCard;

