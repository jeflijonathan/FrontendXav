import React, { useMemo, useState } from "react";
import { Box, Typography, Button, Chip, Stack, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SaveIcon from "@mui/icons-material/Save";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
import TableChartIcon from "@mui/icons-material/TableChart";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import useAcademicCalendarStore from "../store/useAcademicCalendarStore";
import { useCalendarPermissions } from "../utils/permissions";
import { useSnackbar } from "notistack";

const CalendarHeader: React.FC = () => {
  const {
    calendarData,
    setIsScanModalOpen,
    saveCalendar,
    isSaving,
    selectedSemester,
    setSelectedSemester,
    viewMode,
    setViewMode,
    selectedAcademicYear,
    setSelectedAcademicYear,
    clearHolidaysOnly,
    schoolInformations,
  } = useAcademicCalendarStore();
  const { canEdit, roleName } = useCalendarPermissions();
  const { enqueueSnackbar } = useSnackbar();

  const [isClearHolidaysDialogOpen, setIsClearHolidaysDialogOpen] = useState(false);

  const handleSave = async () => {
    const success = await saveCalendar();
    if (success) {
      enqueueSnackbar("Kalender akademik berhasil disimpan!", { variant: "success" });
    } else {
      enqueueSnackbar("Gagal menyimpan kalender", { variant: "error" });
    }
  };

  const handleClearHolidays = async () => {
    await clearHolidaysOnly();
    enqueueSnackbar("Seluruh hari raya dan event libur berhasil dibersihkan! Nomor kalender tetap dipertahankan.", {
      variant: "success",
    });
    setIsClearHolidaysDialogOpen(false);
  };

  const periodOptions = useMemo(() => {
    const years = new Set<string>();
    (calendarData.semesters || []).forEach((sem) => {
      if (sem.academic_year) years.add(sem.academic_year);
    });
    (schoolInformations || []).forEach((s) => {
      if (s.periode) years.add(s.periode);
    });
    return Array.from(years).sort((a, b) => (a === b ? 0 : a > b ? 1 : -1));
  }, [calendarData, schoolInformations]);

  const handlePeriodChange = async (year: string) => {
    if (!year) return;
    await setSelectedAcademicYear(year);
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: 3,
        bgcolor: "background.paper",
        border: 1,
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        mb: 3,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      {/* Baris 1: Judul Utama & Info Status Sekolah */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          gap: 1.5,
          borderBottom: 1,
          borderColor: "divider",
          pb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
          <CalendarMonthIcon color="primary" sx={{ fontSize: 30 }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: "text.primary",
              letterSpacing: -0.2,
              fontSize: { xs: "1.1rem", sm: "1.25rem" },
            }}
          >
            Kalender Akademik SMK Xaverius Palembang
          </Typography>
          <Chip
            label={`TP ${calendarData.academic_year}`}
            color="primary"
            size="small"
            sx={{ fontWeight: 700 }}
          />
          {calendarData.id_school_information ? (
            <Chip
              label="Periode Terdaftar: Info Sekolah"
              color="success"
              variant="outlined"
              size="small"
              sx={{ fontWeight: 600, fontSize: "0.75rem" }}
            />
          ) : (
            <Chip
              label="Belum Terhubung Info Sekolah"
              color="warning"
              variant="outlined"
              size="small"
              sx={{ fontWeight: 600, fontSize: "0.75rem" }}
            />
          )}
        </Box>

        <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 500 }}>
          {`Sistem ${calendarData.work_days || 5} Hari Kerja (${(calendarData.work_days || 5) === 6 ? "Senin - Sabtu" : "Senin - Jumat"}) • Format Resmi Kalender Pendidikan`}
        </Typography>
      </Box>

      {/* Baris 2: Toolbar Kontrol & Aksi (Wrap Bersih & Responsif) */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
        }}
      >
        {/* Kelompok Kontrol Kiri: Periode, Mode Tampilan, Filter Semester */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, flexWrap: "wrap" }}>
          {/* Period Selector */}
          <FormControl
            size="small"
            sx={{
              minWidth: 150,
              bgcolor: (theme) => (theme.palette.mode === "dark" ? "grey.900" : "grey.50"),
              borderRadius: 2,
            }}
          >
            <InputLabel id="academic-period-select-label">Periode</InputLabel>
            <Select
              labelId="academic-period-select-label"
              value={selectedAcademicYear}
              label="Periode"
              onChange={(e) => handlePeriodChange(e.target.value as string)}
              sx={{ borderRadius: 2 }}
            >
              {periodOptions.map((period) => (
                <MenuItem key={period} value={period}>
                  {period}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Toggle Tampilan (Kalender Bulanan Grid vs Tabel Matriks) */}
          <Box
            sx={{
              display: "flex",
              bgcolor: (theme) => (theme.palette.mode === "dark" ? "grey.900" : "grey.100"),
              p: 0.5,
              borderRadius: 2,
              border: 1,
              borderColor: "divider",
            }}
          >
            <Button
              size="small"
              variant={viewMode === "grid" ? "contained" : "text"}
              color="primary"
              startIcon={<CalendarViewMonthIcon sx={{ fontSize: 16 }} />}
              onClick={() => setViewMode("grid")}
              sx={{ textTransform: "none", fontSize: "0.8rem", px: 1.5, borderRadius: 1.5 }}
            >
              Kalender Bulanan
            </Button>
            <Button
              size="small"
              variant={viewMode === "matrix" ? "contained" : "text"}
              color="primary"
              startIcon={<TableChartIcon sx={{ fontSize: 16 }} />}
              onClick={() => setViewMode("matrix")}
              sx={{ textTransform: "none", fontSize: "0.8rem", px: 1.5, borderRadius: 1.5 }}
            >
              Tabel Matriks
            </Button>
          </Box>

          {/* Toggle Semester */}
          <Box
            sx={{
              display: "flex",
              bgcolor: (theme) => (theme.palette.mode === "dark" ? "grey.900" : "grey.100"),
              p: 0.5,
              borderRadius: 2,
              border: 1,
              borderColor: "divider",
            }}
          >
            <Button
              size="small"
              variant={selectedSemester === "all" ? "contained" : "text"}
              color="primary"
              onClick={() => setSelectedSemester("all")}
              sx={{ textTransform: "none", fontSize: "0.8rem", px: 1.25, minWidth: 55, borderRadius: 1.5 }}
            >
              Semua
            </Button>
            <Button
              size="small"
              variant={selectedSemester === "ganjil" ? "contained" : "text"}
              color="primary"
              onClick={() => setSelectedSemester("ganjil")}
              sx={{ textTransform: "none", fontSize: "0.8rem", px: 1.25, borderRadius: 1.5 }}
            >
              Ganjil
            </Button>
            <Button
              size="small"
              variant={selectedSemester === "genap" ? "contained" : "text"}
              color="primary"
              onClick={() => setSelectedSemester("genap")}
              sx={{ textTransform: "none", fontSize: "0.8rem", px: 1.25, borderRadius: 1.5 }}
            >
              Genap
            </Button>
          </Box>
        </Box>

        {/* Kelompok Aksi Kanan: Pindai PDF, Simpan, Hapus Hari Raya (Hanya Kurikulum) */}
        <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
          {canEdit ? (
            <>
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<UploadFileIcon />}
                onClick={() => setIsScanModalOpen(true)}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  px: 1.5,
                  py: 0.8,
                }}
              >
                Pindai / Import PDF
              </Button>

              <Button
                variant="contained"
                color="success"
                size="small"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={isSaving}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  px: 1.5,
                  py: 0.8,
                }}
              >
                {isSaving ? "Menyimpan..." : "Simpan"}
              </Button>

              <Button
                variant="outlined"
                color="warning"
                size="small"
                startIcon={<EventBusyIcon />}
                onClick={() => setIsClearHolidaysDialogOpen(true)}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  px: 1.5,
                  py: 0.8,
                }}
              >
                Hapus Hari Raya
              </Button>
            </>
          ) : (
            <Chip
              icon={<VisibilityOutlinedIcon sx={{ fontSize: "16px !important", color: "text.secondary" }} />}
              label={`Mode Lihat Saja (${roleName} - Akses Edit: Khusus Kurikulum)`}
              size="small"
              sx={{
                bgcolor: (theme) => (theme.palette.mode === "dark" ? "rgba(148, 163, 184, 0.15)" : "#f1f5f9"),
                color: (theme) => (theme.palette.mode === "dark" ? "#94a3b8" : "#475569"),
                border: 1,
                borderColor: (theme) => (theme.palette.mode === "dark" ? "rgba(148, 163, 184, 0.3)" : "#cbd5e1"),
                fontWeight: 600,
                fontSize: "0.75rem",
                py: 1.6,
                px: 0.5,
              }}
            />
          )}
        </Stack>
      </Box>

      {/* Dialog Konfirmasi Hapus Hari Raya Saja */}
      <Dialog
        open={isClearHolidaysDialogOpen}
        onClose={() => setIsClearHolidaysDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        sx={{ "& .MuiPaper-root": { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: "warning.main", display: "flex", alignItems: "center", gap: 1 }}>
          <EventBusyIcon color="warning" />
          Hapus Hari Raya Saja
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Apakah Anda yakin ingin menghapus <strong>seluruh tanda hari raya dan libur kegiatan</strong> pada kalender periode <strong>{selectedAcademicYear}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • <strong>Nomor tanggal kalender (1 - 31) tetap utuh</strong> dan tidak akan hilang.<br />
            • Hari Sabtu (S) dan Minggu (M) tetap menjadi hari libur akhir pekan.<br />
            • Seluruh hari kerja (Senin - Jumat) akan dikembalikan menjadi <strong>Hari Efektif Belajar</strong>.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
          <Button onClick={() => setIsClearHolidaysDialogOpen(false)} color="inherit" sx={{ textTransform: "none" }}>
            Batal
          </Button>
          <Button
            onClick={handleClearHolidays}
            color="warning"
            variant="contained"
            sx={{ textTransform: "none", fontWeight: 600, px: 3 }}
          >
            Ya, Bersihkan Hari Raya
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CalendarHeader;
