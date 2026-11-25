import React, { useMemo } from "react";
import {
  Box,
  Typography,
  Tooltip,
  Paper,
  Chip,
  Stack,
  useTheme,
} from "@mui/material";
import useAcademicCalendarStore from "../store/useAcademicCalendarStore";
import type { SemesterModel, MonthModel, DayCellModel } from "@api/academicCalendar/model";
import { getDayName } from "./CalendarMatrixTable";
import { useCalendarPermissions } from "../utils/permissions";

const DAY_HEADERS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

interface MonthEventItem {
  dateRangeText: string;
  description: string;
  isHoliday: boolean;
  sampleDay: number;
  label?: string;
  sampleCell: DayCellModel;
}

/**
 * Ekstraksi & pengelompokan kegiatan/libur khusus per bulan (Sesuai format resmi Kalender Pendidikan).
 * Tanggal berturut-turut (misal 1-5 atau 6-10) digabungkan menjadi rentang tanggal.
 * Hari libur/hari raya ditampilkan merah, kegiatan/agenda sekolah ditampilkan biru gelap.
 */
const getMonthEvents = (month: MonthModel, daysInMonth: number): MonthEventItem[] => {
  const rawEvents: Array<{
    day: number;
    description: string;
    isHoliday: boolean;
    cell: DayCellModel;
  }> = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const cell = month.cells[String(d)];
    if (!cell || cell.valid === false) continue;

    // Abaikan hari-hari standar/rutin (KBM biasa tanpa catatan, atau akhir pekan biasa)
    const isStandardSaturday =
      (cell.type === "weekend_saturday" || cell.label === "S") &&
      (!cell.note || cell.note.toLowerCase().includes("libur akhir pekan") || cell.note.trim() === "Sabtu");
    const isStandardSunday =
      (cell.type === "weekend_sunday" || cell.label === "M") &&
      (!cell.note || cell.note.toLowerCase().includes("libur akhir pekan") || cell.note.trim() === "Minggu");
    const isStandardEffective =
      (cell.type === "effective_day" || (!cell.type && cell.is_effective)) &&
      (!cell.label || cell.label.trim() === "") &&
      (!cell.note || cell.note.toLowerCase().includes("hari efektif belajar") || cell.note.trim() === "");

    if (isStandardSaturday || isStandardSunday || isStandardEffective) {
      continue;
    }

    let description = (cell.note || "").trim();
    const cellLabel = (cell.label || "").trim();

    if (!description && cellLabel && cellLabel !== "S" && cellLabel !== "M") {
      description = cellLabel;
    }

    if (!description) {
      if (cell.type?.startsWith("holiday_")) {
        description = "Hari Libur";
      } else if (cell.type === "first_day") {
        description = "Hari Pertama Masuk Sekolah";
      } else {
        description = "Kegiatan Khusus";
      }
    }

    const descLower = description.toLowerCase();
    const isHoliday =
      cell.type?.startsWith("holiday_") ||
      cell.bg_color === "#ef4444" ||
      cell.bg_color === "#dc2626" ||
      (!cell.is_effective && cell.type !== "weekend_saturday") ||
      descLower.includes("libur") ||
      descLower.includes("hari raya") ||
      descLower.includes("wafat") ||
      descLower.includes("isra") ||
      descLower.includes("tahun baru") ||
      descLower.includes("kemerdekaan") ||
      descLower.includes("cuti bersama") ||
      descLower.includes("imlek") ||
      descLower.includes("nyepi") ||
      descLower.includes("idul") ||
      descLower.includes("natal") ||
      descLower.includes("waisak");

    rawEvents.push({
      day: d,
      description,
      isHoliday,
      cell,
    });
  }

  if (rawEvents.length === 0) return [];

  // Gabungkan tanggal yang berurutan dengan deskripsi & tipe yang sama
  const grouped: MonthEventItem[] = [];

  let currentGroup: {
    startDay: number;
    endDay: number;
    description: string;
    isHoliday: boolean;
    sampleDay: number;
    sampleCell: DayCellModel;
  } | null = null;

  for (const item of rawEvents) {
    if (!currentGroup) {
      currentGroup = {
        startDay: item.day,
        endDay: item.day,
        description: item.description,
        isHoliday: item.isHoliday,
        sampleDay: item.day,
        sampleCell: item.cell,
      };
      continue;
    }

    // Jika deskripsi sama dan tanggal berlanjut (atau terpotong akhir pekan 1-2 hari)
    const isContinuous =
      item.day === currentGroup.endDay + 1 ||
      (item.day <= currentGroup.endDay + 3 &&
        item.description.trim().toLowerCase() === currentGroup.description.trim().toLowerCase());

    const isSameEvent =
      item.description.trim().toLowerCase() === currentGroup.description.trim().toLowerCase() &&
      item.isHoliday === currentGroup.isHoliday;

    if (isContinuous && isSameEvent) {
      currentGroup.endDay = item.day;
    } else {
      // Simpan grup sebelumnya
      grouped.push({
        dateRangeText:
          currentGroup.startDay === currentGroup.endDay
            ? `${currentGroup.startDay}`
            : `${currentGroup.startDay}-${currentGroup.endDay}`,
        description: currentGroup.description,
        isHoliday: currentGroup.isHoliday,
        sampleDay: currentGroup.sampleDay,
        label: currentGroup.sampleCell.label,
        sampleCell: currentGroup.sampleCell,
      });

      // Mulai grup baru
      currentGroup = {
        startDay: item.day,
        endDay: item.day,
        description: item.description,
        isHoliday: item.isHoliday,
        sampleDay: item.day,
        sampleCell: item.cell,
      };
    }
  }

  if (currentGroup) {
    grouped.push({
      dateRangeText:
        currentGroup.startDay === currentGroup.endDay
          ? `${currentGroup.startDay}`
          : `${currentGroup.startDay}-${currentGroup.endDay}`,
      description: currentGroup.description,
      isHoliday: currentGroup.isHoliday,
      sampleDay: currentGroup.sampleDay,
      label: currentGroup.sampleCell.label,
      sampleCell: currentGroup.sampleCell,
    });
  }

  return grouped;
};

interface MonthCardProps {
  semesterId: string;
  monthIndex: number;
  month: MonthModel;
}

const MonthCard: React.FC<MonthCardProps> = ({ semesterId, monthIndex, month }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { setEditingCell } = useAcademicCalendarStore();
  const { canEdit } = useCalendarPermissions();

  // Jumlah hari dalam bulan (28, 29, 30, atau 31)
  const daysInMonth = new Date(month.year, month.month_number, 0).getDate();

  // Hari pertama bulan (0 = Minggu, 1 = Senin, ..., 6 = Sabtu)
  const firstDayDate = new Date(month.year, month.month_number - 1, 1);
  // Senin = 0, Selasa = 1, ..., Minggu = 6
  const startDayOfWeek = (firstDayDate.getDay() + 6) % 7;

  // Judul bulan bersih tanpa duplikasi tahun (misal: "Juli 2026", bukan "Juli 2026 2026")
  const displayMonthTitle = useMemo(() => {
    const rawName = (month.name || "").trim();
    const strYear = String(month.year);
    if (rawName.includes(strYear)) {
      return rawName;
    }
    return `${rawName} ${strYear}`;
  }, [month.name, month.year]);

  // Daftar agenda/kegiatan bulan ini (Contoh gambar 2)
  const monthEvents = useMemo(() => {
    return getMonthEvents(month, daysInMonth);
  }, [month, daysInMonth]);

  const handleDayClick = (d: number, dayName: string, cell: DayCellModel) => {
    if (!canEdit) return;
    setEditingCell({
      semesterId,
      monthIndex,
      monthName: month.name,
      year: month.year,
      monthNumber: month.month_number,
      day: d,
      dayName,
      cell,
    });
  };

  const handleEventClick = (eventItem: MonthEventItem) => {
    if (!canEdit) return;
    const dayName = getDayName(month.year, month.month_number, eventItem.sampleDay);
    setEditingCell({
      semesterId,
      monthIndex,
      monthName: month.name,
      year: month.year,
      monthNumber: month.month_number,
      day: eventItem.sampleDay,
      dayName,
      cell: eventItem.sampleCell,
    });
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2.5,
        overflow: "hidden",
        border: 1,
        borderColor: isDark ? "rgba(51, 65, 85, 0.6)" : "#e2e8f0",
        bgcolor: isDark ? "#141416" : "#ffffff",
        boxShadow: isDark
          ? "0 2px 10px rgba(0,0,0,0.4)"
          : "0 1px 3px rgba(0,0,0,0.04)",
        display: "flex",
        flexDirection: "column",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          borderColor: isDark ? "#60a5fa" : "#3b82f6",
          boxShadow: isDark
            ? "0 4px 16px rgba(0,0,0,0.6)"
            : "0 4px 12px rgba(59,130,246,0.08)",
        },
      }}
    >
      {/* Header Bulan: Judul Bersih & Chip Jumlah Hari & Minggu Efektif */}
      <Box
        sx={{
          px: 1.5,
          py: 1,
          bgcolor: isDark ? "#1e293b" : "#f8fafc",
          borderBottom: 1,
          borderColor: isDark ? "rgba(51, 65, 85, 0.6)" : "#e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 800,
            fontSize: "0.875rem",
            color: isDark ? "#f1f5f9" : "#0f172a",
            letterSpacing: 0.2,
          }}
        >
          {displayMonthTitle}
        </Typography>

        <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
          <Chip
            label={`${month.effective_days} Hari`}
            size="small"
            sx={{
              height: 18,
              fontSize: "9px",
              fontWeight: 700,
              bgcolor: isDark ? "rgba(34, 197, 94, 0.15)" : "#dcfce7",
              color: isDark ? "#86efac" : "#15803d",
              border: 1,
              borderColor: isDark ? "rgba(34, 197, 94, 0.3)" : "#bbf7d0",
            }}
          />
          <Chip
            label={`${month.effective_weeks} Mg`}
            size="small"
            sx={{
              height: 18,
              fontSize: "9px",
              fontWeight: 700,
              bgcolor: isDark ? "rgba(59, 130, 246, 0.15)" : "#eff6ff",
              color: isDark ? "#93c5fd" : "#1d4ed8",
              border: 1,
              borderColor: isDark ? "rgba(59, 130, 246, 0.3)" : "#bfdbfe",
            }}
          />
        </Stack>
      </Box>

      {/* Baris Nama Hari: Sen Sel Rab Kam Jum Sab Min */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
          bgcolor: isDark ? "#18181b" : "#fbfcfd",
          borderBottom: 1,
          borderColor: isDark ? "rgba(51, 65, 85, 0.4)" : "#f1f5f9",
          textAlign: "center",
          py: 0.5,
          px: 0.75,
        }}
      >
        {DAY_HEADERS.map((dh, i) => {
          const isSunday = i === 6;
          const isSaturday = i === 5;
          return (
            <Typography
              key={dh}
              variant="caption"
              sx={{
                fontWeight: 700,
                fontSize: "10px",
                color: isSunday
                  ? "#dc2626"
                  : isSaturday
                  ? isDark
                    ? "#facc15"
                    : "#b45309"
                  : isDark
                  ? "#94a3b8"
                  : "#64748b",
              }}
            >
              {dh}
            </Typography>
          );
        })}
      </Box>

      {/* Grid Tanggal Kalender (7 Kolom Responsif) */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
          p: 0.75,
          gap: "2px",
        }}
      >
        {/* Kotak kosong sebelum Tanggal 1 */}
        {Array.from({ length: startDayOfWeek }).map((_, idx) => (
          <Box
            key={`empty-${idx}`}
            sx={{
              height: 28,
              minWidth: 0,
            }}
          />
        ))}

        {/* Tanggal 1 s/d Hari Terakhir Bulan */}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
          const cell = month.cells[String(d)] || {
            day: d,
            valid: true,
            label: "",
            note: "",
            type: "effective_day",
            is_effective: true,
          };

          const dayName = getDayName(month.year, month.month_number, d);
          const isWeekendSaturday = !cell.is_effective && (cell.label === "S" || cell.type === "weekend_saturday");
          const isWeekendSunday = cell.label === "M" || cell.type === "weekend_sunday";
          const isFirstDay = cell.label === "1" || cell.type === "first_day";
          const isHoliday = cell.type?.startsWith("holiday_");

          let bgColor = "transparent";
          let textColor = isDark ? "#e2e8f0" : "#1e293b";
          let borderColor = isDark ? "rgba(51,65,85,0.4)" : "#f1f5f9";

          if (isWeekendSaturday) {
            bgColor = isDark ? "rgba(234, 179, 8, 0.08)" : "#fefce8";
            textColor = isDark ? "#fde047" : "#a16207";
            borderColor = isDark ? "rgba(234, 179, 8, 0.2)" : "#fef08a";
          } else if (isWeekendSunday) {
            bgColor = isDark ? "rgba(239, 68, 68, 0.08)" : "#fef2f2";
            textColor = isDark ? "#f87171" : "#dc2626";
            borderColor = isDark ? "rgba(239, 68, 68, 0.2)" : "#fee2e2";
          } else if (isFirstDay) {
            bgColor = isDark ? "rgba(34, 197, 94, 0.15)" : "#ecfdf5";
            textColor = isDark ? "#86efac" : "#15803d";
            borderColor = isDark ? "rgba(34, 197, 94, 0.3)" : "#a7f3d0";
          } else if (isHoliday) {
            bgColor = isDark ? "rgba(239, 68, 68, 0.15)" : "#fee2e2";
            textColor = isDark ? "#fca5a5" : "#b91c1c";
            borderColor = isDark ? "rgba(239, 68, 68, 0.35)" : "#fca5a5";
          } else if (cell.bg_color) {
            bgColor = cell.bg_color;
            textColor = cell.text_color || (isDark ? "#ffffff" : "#0f172a");
          }

          const hasCustomLabel = cell.label && cell.label !== "S" && cell.label !== "M";

          const tooltipTitle = (
            <Box sx={{ p: 0.5, maxWidth: 220 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: "#ffffff", display: "block" }}>
                {dayName}, {d} {month.name} {month.year}
              </Typography>
              {cell.label && (
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#fde047", display: "block" }}>
                  Kode: {cell.label}
                </Typography>
              )}
              <Typography variant="caption" sx={{ color: "#cbd5e1", display: "block", fontSize: "11px" }}>
                {cell.note || (cell.is_effective ? "Hari Efektif Belajar" : "Hari Libur")}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: canEdit ? "#93c5fd" : "#94a3b8",
                  display: "block",
                  mt: 0.5,
                  fontSize: "10px",
                  fontWeight: 600,
                }}
              >
                {canEdit ? "Klik untuk ubah jadwal" : "Mode Lihat Saja (Kurikulum)"}
              </Typography>
            </Box>
          );

          return (
            <Tooltip key={d} title={tooltipTitle} arrow placement="top">
              <Box
                onClick={() => handleDayClick(d, dayName, cell)}
                sx={{
                  height: 28,
                  minWidth: 0,
                  borderRadius: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: canEdit ? "pointer" : "default",
                  p: "1px",
                  bgcolor: bgColor,
                  color: textColor,
                  border: 1,
                  borderColor: borderColor,
                  transition: canEdit ? "transform 0.12s ease, border-color 0.12s ease" : "none",
                  overflow: "hidden",
                  "&:hover": canEdit
                    ? {
                        transform: "scale(1.08)",
                        borderColor: "#3b82f6",
                        zIndex: 2,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      }
                    : {},
                }}
              >
                {/* Nomor Tanggal */}
                <Typography
                  sx={{
                    fontWeight: isHoliday || isWeekendSunday || isWeekendSaturday ? 800 : 600,
                    fontSize: "11px",
                    lineHeight: 1,
                  }}
                >
                  {d}
                </Typography>

                {/* Badge Teks Event Singkat */}
                {hasCustomLabel && (
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "7.5px",
                      fontWeight: 800,
                      lineHeight: 1,
                      mt: "1px",
                      maxWidth: "100%",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      px: "2px",
                      borderRadius: "2px",
                      bgcolor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)",
                    }}
                  >
                    {cell.label}
                  </Typography>
                )}
              </Box>
            </Tooltip>
          );
        })}
      </Box>

      {/* --- DESKRIPSI & KETERANGAN AGENDA BULANAN (Sesuai Gambar 1 & Gambar 2) --- */}
      <Box
        sx={{
          borderTop: 1,
          borderColor: isDark ? "rgba(51, 65, 85, 0.6)" : "#f1f5f9",
          bgcolor: isDark ? "#0b0f19" : "#ffffff",
          px: 1.5,
          py: 1.25,
          minHeight: 65,
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
          flex: 1,
        }}
      >
        {monthEvents.length === 0 ? (
          <Box sx={{ py: 1, textAlign: "center" }}>
            <Typography
              variant="caption"
              sx={{
                color: isDark ? "#64748b" : "#94a3b8",
                fontSize: "10.5px",
                fontStyle: "italic",
                display: "block",
              }}
            >
              - Tidak ada agenda khusus -
            </Typography>
          </Box>
        ) : (
          <Stack spacing={0.5}>
            {monthEvents.map((ev, idx) => {
              const holidayColor = isDark ? "#f87171" : "#dc2626";
              const activityColor = isDark ? "#93c5fd" : "#0f2b5c";

              return (
                <Box
                  key={idx}
                  onClick={() => handleEventClick(ev)}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 0.75,
                    lineHeight: 1.35,
                    cursor: canEdit ? "pointer" : "default",
                    px: 0.5,
                    py: 0.25,
                    borderRadius: 1,
                    transition: "background-color 0.15s ease",
                    "&:hover": canEdit
                      ? {
                          bgcolor: isDark ? "rgba(255,255,255,0.06)" : "rgba(59, 130, 246, 0.06)",
                        }
                      : {},
                  }}
                  title={canEdit ? "Klik untuk mengedit kegiatan ini" : undefined}
                >
                  {/* Nomor / Rentang Tanggal (contoh: 1, 5-7, 8-10, 12-19) */}
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: "11px",
                      minWidth: 38,
                      flexShrink: 0,
                      color: ev.isHoliday ? holidayColor : activityColor,
                      textAlign: "left",
                      letterSpacing: -0.2,
                    }}
                  >
                    {ev.dateRangeText}
                  </Typography>

                  {/* Titik Dua Pemisah */}
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: "11px",
                      flexShrink: 0,
                      color: ev.isHoliday ? holidayColor : activityColor,
                      userSelect: "none",
                    }}
                  >
                    :
                  </Typography>

                  {/* Deskripsi Kegiatan */}
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "11px",
                      color: ev.isHoliday ? holidayColor : activityColor,
                      wordBreak: "break-word",
                      lineHeight: 1.3,
                    }}
                  >
                    {ev.description}
                  </Typography>
                </Box>
              );
            })}
          </Stack>
        )}
      </Box>
    </Paper>
  );
};

const SemesterGrid: React.FC<{ semester: SemesterModel }> = ({ semester }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box sx={{ mb: 4 }}>
      {/* Semester Header Title */}
      <Box
        sx={{
          mb: 2,
          p: 1.75,
          borderRadius: 2,
          bgcolor: isDark ? "#141416" : "#ffffff",
          border: 1,
          borderColor: isDark ? "rgba(51, 65, 85, 0.6)" : "#e2e8f0",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: isDark ? "#f4f4f5" : "#0f172a" }}>
            {semester.name} (TP {semester.academic_year})
          </Typography>
          <Chip
            label={`${semester.months.length} Bulan`}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 700, height: 20, fontSize: "10px" }}
          />
        </Box>

        <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
          <Chip
            label={`Total Mg. Efektif: ${semester.total_effective_weeks}`}
            size="small"
            sx={{
              fontWeight: 700,
              height: 24,
              fontSize: "11px",
              bgcolor: isDark ? "rgba(59, 130, 246, 0.15)" : "#eff6ff",
              color: isDark ? "#93c5fd" : "#1d4ed8",
              border: 1,
              borderColor: isDark ? "rgba(59,130,246,0.3)" : "#bfdbfe",
            }}
          />
          <Chip
            label={`Total Hari Efektif: ${semester.total_effective_days} Hari`}
            size="small"
            sx={{
              fontWeight: 700,
              height: 24,
              fontSize: "11px",
              bgcolor: isDark ? "rgba(34, 197, 94, 0.15)" : "#f0fdf4",
              color: isDark ? "#86efac" : "#15803d",
              border: 1,
              borderColor: isDark ? "rgba(34,197,94,0.3)" : "#bbf7d0",
            }}
          />
        </Stack>
      </Box>

      {/* Grid Kalender Per Bulan (Responsif: 1 kolom di HP, 2 kolom di tablet, 3-4 kolom di desktop) */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            md: "repeat(3, minmax(0, 1fr))",
            lg: "repeat(3, minmax(0, 1fr))",
            xl: "repeat(4, minmax(0, 1fr))",
          },
          gap: 2,
        }}
      >
        {semester.months.map((month, mIdx) => (
          <MonthCard
            key={month.name || mIdx}
            semesterId={semester.id}
            monthIndex={mIdx}
            month={month}
          />
        ))}
      </Box>
    </Box>
  );
};

const CalendarMonthlyGrid: React.FC = () => {
  const { calendarData, selectedSemester } = useAcademicCalendarStore();

  const semestersToRender = (calendarData.semesters || []).filter((sem) => {
    if (selectedSemester === "all") return true;
    return sem.id === selectedSemester;
  });

  return (
    <Box sx={{ width: "100%" }}>
      {semestersToRender.map((semester) => (
        <SemesterGrid key={semester.id} semester={semester} />
      ))}
    </Box>
  );
};

export default CalendarMonthlyGrid;
