import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListSubheader,
  Chip,
  Collapse,
} from "@mui/material";
import useAcademicCalendarStore from "../store/useAcademicCalendarStore";
import type { DayCellType } from "@api/academicCalendar/model";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EventIcon from "@mui/icons-material/Event";
import EditNoteIcon from "@mui/icons-material/EditNote";

const COLOR_PRESETS = [
  { label: "Kuning (Sabtu/Acara)", hex: "#fef08a", textColor: "#854d0e" },
  { label: "Merah (Libur/Minggu)", hex: "#ef4444", textColor: "#ffffff" },
  { label: "Hijau (Masuk Pertama)", hex: "#86efac", textColor: "#14532d" },
  { label: "Biru (Event Sekolah)", hex: "#bfdbfe", textColor: "#1e3a8a" },
  { label: "Oranye (Ujian/Khusus)", hex: "#fed7aa", textColor: "#9a3412" },
  { label: "Pink (Raport/Pelindung)", hex: "#fbcfe8", textColor: "#831843" },
  { label: "Putih / Default", hex: "", textColor: "" },
];

const EditCellDialog: React.FC = () => {
  const { editingCell, setEditingCell, updateCell, calendarData } = useAcademicCalendarStore();

  const [selectedOptionKey, setSelectedOptionKey] = useState<string>("custom");
  const [label, setLabel] = useState("");
  const [note, setNote] = useState("");
  const [isEffective, setIsEffective] = useState(true);
  const [selectedColor, setSelectedColor] = useState("");
  const [cellType, setCellType] = useState<DayCellType>("effective_day");
  const [showManualInputs, setShowManualInputs] = useState(false);

  // Buat daftar opsi terpadu dari legends yang sudah ada di bawah kalender
  const eventOptions = useMemo(() => {
    // 1. Opsi Rutin
    const routineOptions = [
      {
        key: "normal",
        code: "",
        name: "Hari Efektif Belajar (Standar)",
        color: "",
        textColor: "",
        is_effective: true,
        type: "effective_day" as DayCellType,
        group: "Hari Rutin",
      },
      {
        key: "sabtu",
        code: "S",
        name: "Libur Akhir Pekan (Sabtu)",
        color: "#fef08a",
        textColor: "#854d0e",
        is_effective: false,
        type: "weekend_saturday" as DayCellType,
        group: "Hari Rutin",
      },
      {
        key: "minggu",
        code: "M",
        name: "Libur Akhir Pekan (Minggu)",
        color: "#fca5a5",
        textColor: "#991b1b",
        is_effective: false,
        type: "weekend_sunday" as DayCellType,
        group: "Hari Rutin",
      },
    ];

    // 2. Opsi dari Daftar Keterangan (Legends) Kalender Pendidikan Xaverius
    const legendOptions = (calendarData?.legends || []).map((leg) => {
      const labelUpper = leg.label.toUpperCase();

      // Tentukan apakah hari efektif atau libur berdasarkan kata kunci
      const isHoliday =
        labelUpper.includes("LIBUR") ||
        labelUpper.includes("HARI RAYA") ||
        labelUpper.includes("KEMERDEKAAN") ||
        labelUpper.includes("MAULID") ||
        labelUpper.includes("ISRA") ||
        labelUpper.includes("IMLEK") ||
        labelUpper.includes("NYEPI") ||
        labelUpper.includes("IDUL") ||
        labelUpper.includes("JUMAT AGUNG") ||
        labelUpper.includes("BURUH") ||
        labelUpper.includes("KENAIKAN") ||
        labelUpper.includes("WAISAK") ||
        labelUpper.includes("PANCASILA") ||
        labelUpper.includes("TAHUN BARU");

      let textColor = "#18181b";
      if (leg.color === "#ef4444") textColor = "#ffffff";
      else if (leg.color === "#86efac") textColor = "#14532d";
      else if (leg.color === "#fef08a") textColor = "#854d0e";
      else if (leg.color === "#fed7aa") textColor = "#9a3412";
      else if (leg.color === "#bfdbfe") textColor = "#1e3a8a";
      else if (leg.color === "#fbcfe8") textColor = "#831843";

      return {
        key: `legend_${leg.code}`,
        code: leg.code,
        name: `${leg.code} - ${leg.label}`,
        color: leg.color || "#fed7aa",
        textColor,
        is_effective: !isHoliday,
        type: (isHoliday ? "holiday_national" : "effective_day") as DayCellType,
        group: "Keterangan Kalender Yayasan Xaverius",
      };
    });

    return [...routineOptions, ...legendOptions];
  }, [calendarData]);

  // Sinkronisasi saat cell dibuka
  useEffect(() => {
    if (editingCell) {
      const currentLabel = editingCell.cell.label || "";
      const currentNote = editingCell.cell.note || "";
      const currentColor = editingCell.cell.bg_color || "";
      const currentEffective = editingCell.cell.is_effective;

      setLabel(currentLabel);
      setNote(currentNote);
      setIsEffective(currentEffective);
      setSelectedColor(currentColor);
      setCellType(editingCell.cell.type || "effective_day");

      // Coba cocokkan dengan opsi yang ada di daftar legends
      if (!currentLabel && currentEffective) {
        setSelectedOptionKey("normal");
        setShowManualInputs(false);
      } else if (currentLabel === "S") {
        setSelectedOptionKey("sabtu");
        setShowManualInputs(false);
      } else if (currentLabel === "M") {
        setSelectedOptionKey("minggu");
        setShowManualInputs(false);
      } else {
        const found = eventOptions.find(
          (opt) => opt.code && opt.code.toLowerCase() === currentLabel.toLowerCase()
        );
        if (found) {
          setSelectedOptionKey(found.key);
          setShowManualInputs(false);
        } else {
          setSelectedOptionKey("custom");
          setShowManualInputs(true);
        }
      }
    }
  }, [editingCell, eventOptions]);

  if (!editingCell) return null;

  const handleClose = () => {
    setEditingCell(null);
  };

  // Saat pengguna memilih salah satu opsi dari dropdown
  const handleOptionChange = (key: string) => {
    setSelectedOptionKey(key);

    if (key === "custom") {
      setShowManualInputs(true);
      return;
    }

    const matched = eventOptions.find((opt) => opt.key === key);
    if (matched) {
      setLabel(matched.code);
      setNote(matched.name.replace(/^[^-]+-\s*/, ""));
      setIsEffective(matched.is_effective);
      setSelectedColor(matched.color);
      setCellType(matched.type);
      setShowManualInputs(false);
    }
  };

  const handleSave = () => {
    const preset = COLOR_PRESETS.find((c) => c.hex === selectedColor);

    updateCell(editingCell.semesterId, editingCell.monthIndex, editingCell.day, {
      label: label.trim(),
      note: note.trim(),
      is_effective: isEffective,
      bg_color: selectedColor || undefined,
      text_color: preset?.textColor || undefined,
      type: cellType,
    });

    setEditingCell(null);
  };

  const handleResetToStandard = () => {
    const isSunday = editingCell.dayName?.toLowerCase() === "minggu";
    const isSaturday = editingCell.dayName?.toLowerCase() === "sabtu";
    const workDays = calendarData.work_days || 5;

    if (isSunday) {
      updateCell(editingCell.semesterId, editingCell.monthIndex, editingCell.day, {
        label: "M",
        note: "Libur Akhir Pekan (Minggu)",
        is_effective: false,
        bg_color: "#fca5a5",
        text_color: "#991b1b",
        type: "weekend_sunday",
      });
    } else if (isSaturday && workDays === 5) {
      updateCell(editingCell.semesterId, editingCell.monthIndex, editingCell.day, {
        label: "S",
        note: "Libur Akhir Pekan (Sabtu)",
        is_effective: false,
        bg_color: "#fef08a",
        text_color: "#854d0e",
        type: "weekend_saturday",
      });
    } else {
      updateCell(editingCell.semesterId, editingCell.monthIndex, editingCell.day, {
        label: "",
        note: "Hari Efektif Belajar",
        is_effective: true,
        bg_color: undefined,
        text_color: undefined,
        type: "effective_day",
      });
    }

    setEditingCell(null);
  };

  const fullDateText = editingCell.dayName
    ? `${editingCell.dayName}, ${editingCell.day} ${editingCell.monthName || ""}`
    : `Tanggal: ${editingCell.day}`;

  return (
    <Dialog
      open={Boolean(editingCell)}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiPaper-root": {
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, pb: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <EventIcon color="primary" />
          <span>Edit: <strong style={{ color: "#2563eb" }}>{fullDateText}</strong></span>
        </Box>
        <Chip
          label={isEffective ? "Hari Efektif Belajar" : "Hari Libur / Tidak Efektif"}
          color={isEffective ? "success" : "default"}
          size="small"
          sx={{ fontWeight: 600 }}
        />
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}>
          {/* 1. INPUT OPTIONS: Pilih Keterangan Event / Libur dari Daftar Legends */}
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: "primary.main", mb: 0.75, display: "block", textTransform: "uppercase" }}>
              PILIH DARI DAFTAR LABEL & KETERANGAN (OPTIONS)
            </Typography>

            <FormControl fullWidth size="medium">
              <InputLabel id="event-option-select-label">Pilih Kegiatan / Hari Libur</InputLabel>
              <Select
                labelId="event-option-select-label"
                value={selectedOptionKey}
                label="Pilih Kegiatan / Hari Libur"
                onChange={(e) => handleOptionChange(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                {/* Grup Hari Rutin */}
                <ListSubheader sx={{ fontWeight: 700, bgcolor: "background.paper", color: "text.secondary" }}>
                  --- HARI RUTIN ---
                </ListSubheader>
                {eventOptions
                  .filter((opt) => opt.group === "Hari Rutin")
                  .map((opt) => (
                    <MenuItem key={opt.key} value={opt.key}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: "100%" }}>
                        {opt.code ? (
                          <Box
                            sx={{
                              width: 28,
                              height: 24,
                              borderRadius: 1,
                              bgcolor: opt.color || "#e2e8f0",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "11px",
                              fontWeight: 800,
                              color: opt.textColor || "inherit",
                              border: 1,
                              borderColor: "rgba(0,0,0,0.1)",
                            }}
                          >
                            {opt.code}
                          </Box>
                        ) : (
                          <Box sx={{ width: 28, height: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <CheckCircleIcon sx={{ fontSize: 18, color: "success.main" }} />
                          </Box>
                        )}
                        <span className="font-medium text-sm">{opt.name}</span>
                      </Box>
                    </MenuItem>
                  ))}

                {/* Grup Keterangan Dokumen SK Yayasan Xaverius */}
                <ListSubheader sx={{ fontWeight: 700, bgcolor: "background.paper", color: "primary.main" }}>
                  --- DAFTAR KETERANGAN SK YAYASAN XAVERIUS ---
                </ListSubheader>
                {eventOptions
                  .filter((opt) => opt.group !== "Hari Rutin")
                  .map((opt) => (
                    <MenuItem key={opt.key} value={opt.key}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: "100%" }}>
                        <Box
                          sx={{
                            minWidth: 32,
                            height: 24,
                            px: 0.5,
                            borderRadius: 1,
                            bgcolor: opt.color || "#fed7aa",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "10px",
                            fontWeight: 800,
                            color: opt.textColor || "inherit",
                            border: 1,
                            borderColor: "rgba(0,0,0,0.1)",
                          }}
                        >
                          {opt.code}
                        </Box>
                        <span className="font-medium text-sm truncate">{opt.name}</span>
                      </Box>
                    </MenuItem>
                  ))}

                {/* Opsi Kustom */}
                <ListSubheader sx={{ fontWeight: 700, bgcolor: "background.paper", color: "text.secondary" }}>
                  --- LAINNYA ---
                </ListSubheader>
                <MenuItem value="custom">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <EditNoteIcon color="action" />
                    <span className="font-semibold text-sm">Ketik Manual / Kustom</span>
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* 2. Kartu Preview Pilihan */}
          {label && (
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: (theme) => (theme.palette.mode === "dark" ? "grey.900" : "#f8fafc"),
                border: 1,
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 40,
                    borderRadius: 1.5,
                    bgcolor: selectedColor || "#e2e8f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: 1,
                    borderColor: "rgba(0,0,0,0.15)",
                    boxShadow: 1,
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 800,
                      color: selectedColor === "#ef4444" ? "#ffffff" : "#18181b",
                    }}
                  >
                    {label}
                  </span>
                </Box>
                <div>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: "primary.main", display: "block" }}>
                    {fullDateText}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {note || label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Status: {isEffective ? "Hari Efektif Belajar" : "Hari Libur / Tidak Efektif"}
                  </Typography>
                </div>
              </Box>

              <Button
                size="small"
                variant="text"
                onClick={() => setShowManualInputs(!showManualInputs)}
                sx={{ textTransform: "none", fontSize: "0.75rem" }}
              >
                {showManualInputs ? "Tutup Rincian" : "Ubah Rincian"}
              </Button>
            </Box>
          )}

          {/* 3. Panel Rincian Manual (Dapat dibuka jika ingin menyesuaikan teks/warna) */}
          <Collapse in={showManualInputs}>
            <Box sx={{ p: 2, borderRadius: 2, border: 1, borderColor: "divider", display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary" }}>
                PENYESUAIAN RINCIAN (OPSIONAL)
              </Typography>

              {/* Label Singkatan */}
              <TextField
                label="Kode Singkatan yang Tampil di Kotak Kalender"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                fullWidth
                size="small"
                placeholder="Contoh: Libur TP, MPLS, SAS-G, 1, S, M"
              />

              {/* Keterangan Lengkap */}
              <TextField
                label="Nama / Deskripsi Kegiatan Lengkap"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                fullWidth
                size="small"
                multiline
                rows={2}
                placeholder="Contoh: Libur Akhir Tahun Pelajaran"
              />

              {/* Switch Hari Efektif Belajar */}
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: (theme) => (theme.palette.mode === "dark" ? "grey.900" : "grey.50"),
                  border: 1,
                  borderColor: "divider",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Hari Efektif Belajar
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Apakah tanggal ini dihitung sebagai hari belajar aktif?
                  </Typography>
                </div>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isEffective}
                      onChange={(e) => setIsEffective(e.target.checked)}
                      color="success"
                    />
                  }
                  label={isEffective ? "Ya" : "Libur"}
                  labelPlacement="start"
                />
              </Box>

              {/* Pilihan Warna */}
              <div>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", mb: 1, display: "block" }}>
                  WARNA KOTAK TANGGAL
                </Typography>
                <div className="grid grid-cols-2 gap-2">
                  {COLOR_PRESETS.map((preset) => (
                    <Box
                      key={preset.hex}
                      onClick={() => setSelectedColor(preset.hex)}
                      sx={{
                        p: 1,
                        borderRadius: 1.5,
                        border: 2,
                        borderColor: selectedColor === preset.hex ? "primary.main" : "divider",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        transition: "all 0.15s",
                        bgcolor: (theme) => (theme.palette.mode === "dark" ? "grey.900" : "grey.50"),
                      }}
                    >
                      <Box
                        sx={{
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          bgcolor: preset.hex || "#e4e4e7",
                          border: 1,
                          borderColor: "rgba(0,0,0,0.2)",
                        }}
                      />
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {preset.label.split(" ")[0]}
                      </Typography>
                    </Box>
                  ))}
                </div>
              </div>
            </Box>
          </Collapse>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
        <Button
          variant="text"
          color="error"
          size="small"
          onClick={handleResetToStandard}
          sx={{ textTransform: "none" }}
        >
          Reset Hari Normal
        </Button>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button onClick={handleClose} color="inherit" sx={{ textTransform: "none" }}>
            Batal
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave} sx={{ textTransform: "none", fontWeight: 600, px: 3 }}>
            Simpan
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default EditCellDialog;
