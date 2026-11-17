import React from "react";
import { Box, Typography } from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import DateRangeIcon from "@mui/icons-material/DateRange";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import useAcademicCalendarStore from "../store/useAcademicCalendarStore";

const CalendarSummaryStats: React.FC = () => {
  const { calendarData } = useAcademicCalendarStore();

  const ganjil = calendarData.semesters.find((s) => s.id === "ganjil");
  const genap = calendarData.semesters.find((s) => s.id === "genap");

  const ganjilDays = ganjil?.total_effective_days || 0;
  const ganjilWeeks = ganjil?.total_effective_weeks || 0;

  const genapDays = genap?.total_effective_days || 0;
  const genapWeeks = genap?.total_effective_weeks || 0;

  const totalDays = ganjilDays + genapDays;
  const totalWeeks = ganjilWeeks + genapWeeks;

  const workDays =
    calendarData.work_days ||
    (calendarData.summary?.work_days) ||
    (calendarData.summary?.five_day_work_week ? 5 : 6) ||
    5;

  const statItems = [
    {
      title: "Semester Ganjil",
      mainVal: `${ganjilDays} Hari`,
      subVal: `${ganjilWeeks} Minggu Efektif`,
      color: "primary.main",
      icon: <EventAvailableIcon sx={{ fontSize: 26, color: "primary.main" }} />,
    },
    {
      title: "Semester Genap",
      mainVal: `${genapDays} Hari`,
      subVal: `${genapWeeks} Minggu Efektif`,
      color: "success.main",
      icon: <DateRangeIcon sx={{ fontSize: 26, color: "success.main" }} />,
    },
    {
      title: `Total Setahun (TP ${calendarData.academic_year || "2026/2027"})`,
      mainVal: `${totalDays} Hari Efektif`,
      subVal: `${totalWeeks} Minggu Efektif`,
      color: "secondary.main",
      icon: <WorkHistoryIcon sx={{ fontSize: 26, color: "secondary.main" }} />,
    },
    {
      title: "Ketentuan Belajar",
      mainVal: `${workDays} Hari Belajar`,
      subVal:
        workDays === 6
          ? "Senin - Sabtu Efektif • Hanya Minggu Libur (M)"
          : "Senin - Jumat Efektif • Sabtu & Minggu Libur (S / M)",
      color: "warning.main",
      icon: <CheckCircleIcon sx={{ fontSize: 26, color: "warning.main" }} />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      {statItems.map((stat, idx) => (
        <Box
          key={idx}
          sx={{
            p: 2.5,
            borderRadius: 2.5,
            bgcolor: "background.paper",
            border: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
          }}
        >
          <div>
            <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary", textTransform: "uppercase", letterSpacing: 0.5 }}>
              {stat.title}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary", mt: 0.25 }}>
              {stat.mainVal}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {stat.subVal}
            </Typography>
          </div>
          <Box
            sx={{
              p: 1.5,
              borderRadius: "50%",
              bgcolor: (theme) => (theme.palette.mode === "dark" ? "grey.800" : "grey.100"),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {stat.icon}
          </Box>
        </Box>
      ))}
    </div>
  );
};

export default CalendarSummaryStats;
