import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  LinearProgress,
  Alert,
  AlertTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import SchoolIcon from "@mui/icons-material/School";
import { useNavigate } from "react-router-dom";
import useAcademicCalendarStore from "../store/useAcademicCalendarStore";
import { useSnackbar } from "notistack";

const ScanPdfModal: React.FC = () => {
  const {
    isScanModalOpen,
    setIsScanModalOpen,
    scanPdfFile,
    isScanning,
    scanResultNote,
    scanErrorMessage,
    clearScanError,
    schoolInformations,
    selectedSchoolInfoId,
    setSelectedSchoolInfoId,
    loadDefaults,
  } = useAcademicCalendarStore();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [scanStep, setScanStep] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClose = () => {
    if (isScanning) return;
    setIsScanModalOpen(false);
    setSelectedFile(null);
    setScanStep("");
    clearScanError();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      clearScanError();
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      clearScanError();
    }
  };

  const handleStartScan = async () => {
    if (!selectedFile) return;

    setScanStep("Menganalisis berkas dan membaca periode pembelajaran...");
    setTimeout(() => {
      setScanStep("Memverifikasi periode dengan data Informasi Sekolah...");
    }, 700);

    const success = await scanPdfFile(selectedFile, selectedSchoolInfoId);
    if (success) {
      setScanStep("Selesai! Periode pembelajaran dan format kalender berhasil disinkronkan.");
      enqueueSnackbar("Berkas kalender berhasil dipindai dan dipetakan sesuai periode pembelajaran!", {
        variant: "success",
      });
      setTimeout(() => {
        handleClose();
      }, 1200);
    } else {
      setScanStep("");
      enqueueSnackbar("Belum terdaftar periode pembelajaran. Silakan periksa notifikasi.", {
        variant: "error",
      });
    }
  };

  const handleApplyPreset = () => {
    loadDefaults();
    enqueueSnackbar("Template SMK Xaverius Palembang 2026/2027 berhasil dimuat!", {
      variant: "success",
    });
    handleClose();
  };

  const handleNavigateToSchoolInfo = () => {
    handleClose();
    navigate("/school-informations");
  };

  const selectedSchool = schoolInformations.find(
    (s) => s.id_school_information === selectedSchoolInfoId
  );

  return (
    <Dialog
      open={isScanModalOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiPaper-root": {
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, pb: 1, display: "flex", alignItems: "center", gap: 1 }}>
        <PictureAsPdfIcon color="error" />
        Pindai Dokumen Kalender Akademik (PDF / Gambar)
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Unggah berkas kalender pendidikan (.pdf, .png, .jpg). Sistem akan membaca periode pembelajaran
            dari <strong>id_informasi_sekolah</strong> dan memetakan tanggal, hari efektif, serta kegiatan sekolah.
          </Typography>

          {/* Pemilih Periode Informasi Sekolah */}
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: (theme) => (theme.palette.mode === "dark" ? "grey.900" : "#f8fafc"),
              border: 1,
              borderColor: "divider",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
              <SchoolIcon fontSize="small" color="primary" />
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Periode Informasi Sekolah Terdaftar
              </Typography>
            </Box>

            <FormControl fullWidth size="small">
              <InputLabel id="school-info-select-label">Pilih Informasi Sekolah / Periode</InputLabel>
              <Select
                labelId="school-info-select-label"
                value={selectedSchoolInfoId}
                label="Pilih Informasi Sekolah / Periode"
                onChange={(e) => {
                  setSelectedSchoolInfoId(e.target.value);
                  clearScanError();
                }}
              >
                <MenuItem value="">
                  <em>-- Deteksi Otomatis Periode dari Berkas Dokumen --</em>
                </MenuItem>
                {schoolInformations.map((school) => (
                  <MenuItem key={school.id_school_information} value={school.id_school_information}>
                    {school.name_school} — Periode: {school.periode || "Belum ada periode"} {school.status ? "(Aktif)" : ""}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedSchool && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1.5 }}>
                <Chip
                  label={`Periode: ${selectedSchool.periode || "Tidak terdaftar"}`}
                  color={selectedSchool.periode ? "primary" : "warning"}
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
                <Typography variant="caption" color="text.secondary">
                  ID: {selectedSchool.id_school_information}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Notifikasi Error: Belum terdaftar periode pembelajaran */}
          {scanErrorMessage && (
            <Alert
              severity="error"
              icon={<ErrorIcon fontSize="inherit" />}
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={handleNavigateToSchoolInfo}
                  sx={{ fontWeight: 700, textTransform: "none", textDecoration: "underline" }}
                >
                  Daftarkan di Informasi Sekolah
                </Button>
              }
              sx={{ borderRadius: 2 }}
            >
              <AlertTitle sx={{ fontWeight: 700 }}>Belum Terdaftar Periode Pembelajaran</AlertTitle>
              {scanErrorMessage}
            </Alert>
          )}

          {/* Drag & Drop Area */}
          <Box
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            sx={{
              p: 3.5,
              border: "2px dashed",
              borderColor: selectedFile ? "primary.main" : scanErrorMessage ? "error.main" : "divider",
              borderRadius: 3,
              textAlign: "center",
              bgcolor: (theme) =>
                selectedFile
                  ? theme.palette.mode === "dark"
                    ? "rgba(59, 130, 246, 0.1)"
                    : "rgba(59, 130, 246, 0.05)"
                  : theme.palette.mode === "dark"
                  ? "grey.900"
                  : "#f8fafc",
              cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": {
                borderColor: "primary.main",
              },
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.png,.jpg,.jpeg"
              style={{ display: "none" }}
            />
            <CloudUploadIcon
              color={selectedFile ? "primary" : scanErrorMessage ? "error" : "action"}
              sx={{ fontSize: 44, mb: 1 }}
            />
            {selectedFile ? (
              <div>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "primary.main" }}>
                  {selectedFile.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {(selectedFile.size / 1024).toFixed(1)} KB • Berkas siap dipindai
                </Typography>
              </div>
            ) : (
              <div>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Tarik & Lepaskan berkas PDF / Gambar kalender di sini
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  atau klik untuk memilih berkas kalender pendidikan (.pdf, .jpg, .png)
                </Typography>
              </div>
            )}
          </Box>

          {/* Progress Scanning */}
          {isScanning && (
            <Box sx={{ width: "100%" }}>
              <LinearProgress />
              <Typography variant="caption" sx={{ mt: 1, display: "block", color: "primary.main", fontWeight: 600 }}>
                {scanStep || "Sedang memproses pemindaian kalender..."}
              </Typography>
            </Box>
          )}

          {/* Alert Success / Notes */}
          {scanResultNote && (
            <Alert severity="success" icon={<CheckCircleIcon />}>
              {scanResultNote}
            </Alert>
          )}

          {/* Tombol Cepat Template SMK Xaverius */}
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: (theme) => (theme.palette.mode === "dark" ? "grey.900" : "#eff6ff"),
              border: 1,
              borderColor: (theme) => (theme.palette.mode === "dark" ? "grey.800" : "#bfdbfe"),
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <div>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "primary.main" }}>
                Template Resmi SMK Xaverius 2026/2027
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Gunakan format presisi kalender pendidikan Yayasan Xaverius Palembang (112 & 100 hari efektif).
              </Typography>
            </div>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              startIcon={<AutoFixHighIcon />}
              onClick={handleApplyPreset}
              sx={{ textTransform: "none", whiteSpace: "nowrap", borderRadius: 2 }}
            >
              Gunakan Template
            </Button>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
        <Button onClick={handleClose} disabled={isScanning} color="inherit" sx={{ textTransform: "none" }}>
          Tutup
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleStartScan}
          disabled={!selectedFile || isScanning}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          {isScanning ? "Memindai..." : "Mulai Pindai PDF"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScanPdfModal;
