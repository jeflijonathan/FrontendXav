import React from "react";
import { Box, Typography } from "@mui/material";
import useAcademicCalendarStore from "../store/useAcademicCalendarStore";

const CalendarLegend: React.FC = () => {
  const { calendarData } = useAcademicCalendarStore();

  const displayLegends = (calendarData.legends || []).filter(
    (item) =>
      item &&
      item.code &&
      item.code.trim().toUpperCase() !== "S" &&
      item.code.trim().toUpperCase() !== "M"
  );

  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 3,
        bgcolor: "background.paper",
        border: 1,
        borderColor: "divider",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2, pb: 1, borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "primary.main", letterSpacing: 0.5, textTransform: "uppercase" }}>
          Keterangan Kalender Pendidikan (Kegiatan & Hari Libur)
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Sesuai SK Yayasan Xaverius Palembang
        </Typography>
      </Box>

      {/* Grid Keterangan 3 Kolom */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {displayLegends.map((item, idx) => (
          <Box
            key={idx}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              p: 1.25,
              borderRadius: 2,
              bgcolor: (theme) => (theme.palette.mode === "dark" ? "grey.900" : "#f8fafc"),
              border: 1,
              borderColor: "divider",
            }}
          >
            {/* Color Badge / Code */}
            <Box
              sx={{
                minWidth: 32,
                height: 28,
                px: 1,
                borderRadius: 1,
                bgcolor: item.color || "#e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: 1,
                borderColor: "rgba(0,0,0,0.1)",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  color: item.color === "#ef4444" ? "#ffffff" : "#18181b",
                }}
              >
                {item.code}
              </span>
            </Box>

            {/* Label & Date Range */}
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                {item.label}
              </span>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                {item.date_range}
              </span>
            </div>
          </Box>
        ))}
      </div>
    </Box>
  );
};

export default CalendarLegend;

