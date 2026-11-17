import React from "react";
import {
  Box,
  Typography,
  Tooltip,
} from "@mui/material";
import useAcademicCalendarStore from "../store/useAcademicCalendarStore";
import type { SemesterModel, MonthModel, DayCellModel } from "@api/academicCalendar/model";

const INDO_DAY_NAMES = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

export const getDayName = (year: number, monthNumber: number, day: number) => {
  const d = new Date(year, monthNumber - 1, day);
  return INDO_DAY_NAMES[d.getDay()] || "";
};

interface CellRendererProps {
  semesterId: string;
  monthIndex: number;
  month: MonthModel;
  day: number;
  cell: DayCellModel;
}

const CalendarCell: React.FC<CellRendererProps> = ({
  semesterId,
  monthIndex,
  month,
  day,
  cell,
}) => {
  const { setEditingCell } = useAcademicCalendarStore();
  const dayName = getDayName(month.year, month.month_number, day);

  if (!cell || !cell.valid) {
    return (
      <td
        className="border border-zinc-300 dark:border-zinc-700 bg-zinc-900 dark:bg-black p-0 text-center select-none"
        style={{ minWidth: 28, width: 32, height: 32, backgroundColor: "#18181b" }}
        title="Tanggal tidak ada"
      >
        <span className="text-[10px] text-zinc-600 dark:text-zinc-700">-</span>
      </td>
    );
  }

  const isWeekendSaturday = !cell.is_effective && (cell.label === "S" || cell.type === "weekend_saturday");
  const isWeekendSunday = cell.label === "M" || cell.type === "weekend_sunday";
  const isFirstDay = cell.label === "1" || cell.type === "first_day";
  const isHoliday = cell.type.startsWith("holiday_");

  let bgColor = cell.bg_color || "";
  let textColor = cell.text_color || "";

  if (isWeekendSaturday) {
    bgColor = bgColor || "#fef08a";
    textColor = textColor || "#854d0e";
  } else if (isWeekendSunday) {
    bgColor = bgColor || "#fca5a5";
    textColor = textColor || "#991b1b";
  } else if (isFirstDay) {
    bgColor = bgColor || "#86efac";
    textColor = textColor || "#14532d";
  } else if (isHoliday) {
    bgColor = bgColor || "#ef4444";
    textColor = textColor || "#ffffff";
  }

  const tooltipTitle = (
    <Box sx={{ p: 0.5, fontSize: "0.75rem" }}>
      <Typography variant="caption" sx={{ fontWeight: 700, display: "block", fontSize: "0.85rem" }}>
        {dayName}, {day} {month.name}
      </Typography>
      {cell.label && (
        <Typography variant="caption" sx={{ fontWeight: 600, color: "yellow", display: "block" }}>
          Kode: {cell.label}
        </Typography>
      )}
      <Typography variant="caption" sx={{ display: "block", color: "white" }}>
        {cell.note || (cell.is_effective ? "Hari Efektif Belajar" : "Hari Libur")}
      </Typography>
      <Typography variant="caption" sx={{ display: "block", color: "#a1a1aa", mt: 0.5 }}>
        Klik untuk mengubah
      </Typography>
    </Box>
  );

  return (
    <Tooltip title={tooltipTitle} arrow placement="top">
      <td
        onClick={() =>
          setEditingCell({
            semesterId,
            monthIndex,
            monthName: month.name,
            year: month.year,
            monthNumber: month.month_number,
            day,
            dayName,
            cell,
          })
        }
        className="border border-zinc-300 dark:border-zinc-700 text-center p-0 cursor-pointer transition-all hover:ring-2 hover:ring-blue-500 hover:z-10 relative select-none"
        style={{
          minWidth: 28,
          width: 32,
          height: 34,
          backgroundColor: bgColor || undefined,
          color: textColor || undefined,
        }}
      >
        <div className="flex flex-col items-center justify-center w-full h-full px-0.5 overflow-hidden">
          {cell.label ? (
            <span
              className="text-[10px] font-extrabold leading-tight block truncate w-full"
              style={{
                color: textColor || (isHoliday ? "#ffffff" : isWeekendSunday ? "#991b1b" : isWeekendSaturday ? "#854d0e" : "inherit"),
              }}
            >
              {cell.label}
            </span>
          ) : (
            <span className="text-[11px] font-medium opacity-40 leading-none">
              {day}
            </span>
          )}
        </div>
      </td>
    </Tooltip>
  );
};

const SemesterTable: React.FC<{ semester: SemesterModel }> = ({ semester }) => {
  return (
    <Box
      sx={{
        mb: 4,
        borderRadius: 3,
        bgcolor: "background.paper",
        border: 1,
        borderColor: "divider",
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      {/* Semester Header Banner */}
      <Box
        sx={{
          px: 2.5,
          py: 1.5,
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "grey.900" : "#f1f5f9",
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "text.primary" }}>
          {semester.name} (TP {semester.academic_year})
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: "primary.main" }}>
            Total Mg. Efektif: {semester.total_effective_weeks}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600, color: "success.main" }}>
            Total Hari Efektif: {semester.total_effective_days}
          </Typography>
        </Box>
      </Box>

      {/* Responsive Horizontal Scroll Container */}
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200">
              <th
                rowSpan={2}
                className="border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-center font-bold sticky left-0 z-20 bg-zinc-100 dark:bg-zinc-800"
                style={{ minWidth: 130 }}
              >
                BULAN
              </th>
              <th
                colSpan={31}
                className="border border-zinc-300 dark:border-zinc-700 py-1 text-center font-bold tracking-wider"
              >
                TANGGAL
              </th>
              <th
                colSpan={2}
                className="border border-zinc-300 dark:border-zinc-700 py-1 text-center font-bold tracking-wider bg-zinc-200 dark:bg-zinc-700"
                style={{ minWidth: 90 }}
              >
                JUMLAH
              </th>
            </tr>
            <tr className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-[11px]">
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                <th
                  key={d}
                  className="border border-zinc-300 dark:border-zinc-700 text-center font-semibold p-0"
                  style={{ width: 32, minWidth: 28 }}
                >
                  {d}
                </th>
              ))}
              <th
                className="border border-zinc-300 dark:border-zinc-700 px-1 py-1 text-center font-bold bg-zinc-200/70 dark:bg-zinc-700/70"
                style={{ width: 45 }}
                title="Minggu Efektif"
              >
                Mg.
              </th>
              <th
                className="border border-zinc-300 dark:border-zinc-700 px-1 py-1 text-center font-bold bg-zinc-200/70 dark:bg-zinc-700/70"
                style={{ width: 45 }}
                title="Hari Efektif"
              >
                Hari
              </th>
            </tr>
          </thead>
          <tbody>
            {semester.months.map((month, mIdx) => (
              <tr
                key={month.name}
                className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
              >
                {/* Nama Bulan */}
                <td
                  className="border border-zinc-300 dark:border-zinc-700 px-3 py-2 font-semibold text-zinc-900 dark:text-zinc-100 sticky left-0 z-10 bg-white dark:bg-zinc-900 whitespace-nowrap"
                  style={{ minWidth: 130 }}
                >
                  {month.name}
                </td>

                {/* Kolom Tanggal 1 s/d 31 */}
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => {
                  const cell = month.cells[String(d)];
                  return (
                    <CalendarCell
                      key={d}
                      semesterId={semester.id}
                      monthIndex={mIdx}
                      month={month}
                      day={d}
                      cell={cell}
                    />
                  );
                })}

                {/* Mg. Efektif Bulan */}
                <td className="border border-zinc-300 dark:border-zinc-700 text-center font-bold bg-zinc-50 dark:bg-zinc-800/60 text-zinc-800 dark:text-zinc-200">
                  {month.effective_weeks}
                </td>

                {/* Hari Efektif Bulan */}
                <td className="border border-zinc-300 dark:border-zinc-700 text-center font-bold bg-zinc-50 dark:bg-zinc-800/60 text-zinc-800 dark:text-zinc-200">
                  {month.effective_days}
                </td>
              </tr>
            ))}

            {/* Total Row Semester */}
            <tr className="bg-zinc-200 dark:bg-zinc-800 font-extrabold text-zinc-900 dark:text-zinc-100">
              <td
                className="border border-zinc-300 dark:border-zinc-700 px-3 py-2 uppercase tracking-wide sticky left-0 z-10 bg-zinc-200 dark:bg-zinc-800 text-right pr-4"
                colSpan={32}
              >
                JUMLAH TOTAL ({semester.name.toUpperCase()}) :
              </td>
              <td className="border border-zinc-300 dark:border-zinc-700 text-center font-extrabold text-blue-600 dark:text-blue-400">
                {semester.total_effective_weeks}
              </td>
              <td className="border border-zinc-300 dark:border-zinc-700 text-center font-extrabold text-green-600 dark:text-green-400">
                {semester.total_effective_days}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Box>
  );
};

const CalendarMatrixTable: React.FC = () => {
  const { calendarData, selectedSemester } = useAcademicCalendarStore();

  const semestersToRender = calendarData.semesters.filter((sem) => {
    if (selectedSemester === "all") return true;
    return sem.id === selectedSemester;
  });

  return (
    <Box sx={{ width: "100%" }}>
      {semestersToRender.map((semester) => (
        <SemesterTable key={semester.id} semester={semester} />
      ))}
    </Box>
  );
};

export default CalendarMatrixTable;

