import React, { useEffect } from "react";
import { Box, Container } from "@mui/material";
import CalendarHeader from "./components/CalendarHeader";
import CalendarSummaryStats from "./components/CalendarSummaryStats";
import CalendarMatrixTable from "./components/CalendarMatrixTable";
import CalendarMonthlyGrid from "./components/CalendarMonthlyGrid";
import CalendarLegend from "./components/CalendarLegend";
import ScanPdfModal from "./components/ScanPdfModal";
import EditCellDialog from "./components/EditCellDialog";
import useAcademicCalendarStore from "./store/useAcademicCalendarStore";

const DashboardAcademicCalendar: React.FC = () => {
  const { initCalendar, viewMode } = useAcademicCalendarStore();

  useEffect(() => {
    initCalendar();
  }, [initCalendar]);

  return (
    <Container maxWidth={false} sx={{ py: 3, px: { xs: 2, md: 3 } }}>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        {/* Header & Controls */}
        <CalendarHeader />

        {/* Summary Metric Cards */}
        <CalendarSummaryStats />

        {/* Tampilan Kalender Bulanan (Default) atau Tabel Matriks */}
        {viewMode === "grid" ? (
          <CalendarMonthlyGrid />
        ) : (
          <CalendarMatrixTable />
        )}

        {/* Legend / Keterangan di Bagian Bawah */}
        <CalendarLegend />

        {/* Modal Pemindai Dokumen PDF */}
        <ScanPdfModal />

        {/* Dialog Edit Tanggal */}
        <EditCellDialog />
      </Box>
    </Container>
  );
};

export default DashboardAcademicCalendar;

