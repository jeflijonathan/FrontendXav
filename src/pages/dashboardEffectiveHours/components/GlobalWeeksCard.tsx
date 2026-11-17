import React from "react";
import { Box, Typography, Chip, Paper } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import NumberStepper from "@common/components/Input/NumberStepper";
import { useEffectiveWeeksControl } from "../hook/useEffectiveWeeksControl";

export const GlobalWeeksCard: React.FC = () => {
  const {
    effectiveWeeks,
    minWeeks,
    maxWeeks,
    nationalDivider,
    academicYear,
    setWeeks,
  } = useEffectiveWeeksControl();

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
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 2,
                bgcolor: "primary.50",
                color: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TuneIcon fontSize="small" />
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "text.primary" }}>
              Atur Minggu Efektif Global
            </Typography>
          </Box>
          <Chip
            label={`T.A. ${academicYear}`}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 700, fontSize: "0.75rem", borderRadius: 1.5 }}
          />
        </Box>

        {/* Subtitle / Description */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, lineHeight: 1.5 }}>
          Pengubah global yang mengkalkulasi ulang seluruh proyeksi beban jam pelajaran mingguan ke semester riil secara sinkron.
        </Typography>

        {/* Stepper Container Box */}
        <Box
          sx={{
            p: 2,
            borderRadius: 2.5,
            bgcolor: (theme) => (theme.palette.mode === "dark" ? "grey.900" : "#f8fafc"),
            border: 1,
            borderColor: "divider",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: "text.primary" }}>
              Total Minggu Efektif Kalender Sekolah
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
              Min: {minWeeks} | Max: {maxWeeks}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", py: 0.5 }}>
            <NumberStepper
              value={effectiveWeeks}
              onChange={setWeeks}
              min={minWeeks}
              max={maxWeeks}
              unit="Mgg"
              size="medium"
            />
          </Box>
        </Box>
      </Box>

      {/* Footer Info Box */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 1.5,
          py: 1,
          borderRadius: 2,
          bgcolor: (theme) => (theme.palette.mode === "dark" ? "grey.900" : "#f1f5f9"),
          border: 1,
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CheckCircleIcon sx={{ fontSize: 18, color: "primary.main" }} />
          <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary" }}>
            Standar Pembagi Nasional:
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ fontWeight: 800, color: "text.primary" }}>
          {nationalDivider} Minggu / Tahun
        </Typography>
      </Box>
    </Paper>
  );
};

export default GlobalWeeksCard;
