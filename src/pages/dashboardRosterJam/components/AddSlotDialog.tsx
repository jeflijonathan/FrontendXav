import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Typography,
    Button,
    InputAdornment,
} from '@mui/material';
import { BaseDialog, DialogHeader, DialogBody, DialogFooter } from '@components/Dialog';
import { useRosterJamStore } from '../store';

/**
 * Menghitung jam selesai berdasarkan jam mulai + durasi menit
 * Contoh: "07:45" + 35 menit -> "08:20"
 */
const addMinutesToTime = (timeStr: string, minutesToAdd: number): string => {
    try {
        const parts = timeStr.trim().replace('.', ':').split(':');
        if (parts.length < 2) return timeStr;
        const hours = parseInt(parts[0], 10);
        const minutes = parseInt(parts[1], 10);
        if (isNaN(hours) || isNaN(minutes)) return timeStr;

        const totalMinutes = hours * 60 + minutes + minutesToAdd;
        const newHours = Math.floor(totalMinutes / 60) % 24;
        const newMinutes = totalMinutes % 60;

        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${pad(newHours)}:${pad(newMinutes)}`;
    } catch {
        return timeStr;
    }
};

const AddSlotDialog: React.FC = () => {
    const { state, closeAddDialog, closeEditDialog, addSlot, updateSlot } = useRosterJamStore();

    const isEditMode = Boolean(state.editingSlot);
    const isOpen = state.isAddDialogOpen || isEditMode;
    const currentDay = state.editingSlot ? state.editingSlot.day : state.selectedDayForAdd;

    const [jamMulai, setJamMulai] = useState<string>('07:00');
    const [jamSelesai, setJamSelesai] = useState<string>('07:45');
    const [durasiMenit, setDurasiMenit] = useState<number>(45);
    const [jenisJam, setJenisJam] = useState<string>('KBM');

    useEffect(() => {
        if (state.editingSlot) {
            const slot = state.editingSlot.slot;
            setJenisJam(slot.jenisJam);
            setDurasiMenit(slot.durasiMenit || 45);

            const parts = slot.jam.split('-');
            if (parts.length >= 2) {
                setJamMulai(parts[0].trim());
                setJamSelesai(parts[1].trim());
            } else {
                setJamMulai('07:00');
                setJamSelesai('07:45');
            }
        } else if (state.isAddDialogOpen) {
            setJamMulai('07:00');
            setJamSelesai('07:45');
            setDurasiMenit(45);
            setJenisJam('KBM');
        }
    }, [state.editingSlot, state.isAddDialogOpen]);

    const handleDurationChange = (minutes: number) => {
        setDurasiMenit(minutes);
        if (jamMulai) {
            setJamSelesai(addMinutesToTime(jamMulai, minutes));
        }
    };

    const handleJamMulaiChange = (val: string) => {
        setJamMulai(val);
        if (durasiMenit > 0) {
            setJamSelesai(addMinutesToTime(val, durasiMenit));
        }
    };

    const handleJenisChange = (val: string) => {
        setJenisJam(val);
        // Default saran durasi sesuai kategori sekolah Xaverius
        const lower = val.toLowerCase();
        if (lower.includes('upacara') || lower.includes('literasi')) {
            handleDurationChange(45);
        } else if (lower.includes('senam')) {
            handleDurationChange(65);
        } else if (lower.includes('istirahat')) {
            handleDurationChange(15);
        } else if (lower.includes('ekstra')) {
            handleDurationChange(90);
        } else if (lower.includes('kbm')) {
            handleDurationChange(45);
        }
    };

    const handleClose = () => {
        if (isEditMode) {
            closeEditDialog();
        } else {
            closeAddDialog();
        }
    };

    const handleSave = () => {
        if (!currentDay) return;

        const isEffective = jenisJam.toLowerCase().includes('kbm');
        const jamFormatted = `${jamMulai} - ${jamSelesai}`;

        if (isEditMode && state.editingSlot) {
            updateSlot(currentDay, state.editingSlot.slot.id, {
                jam: jamFormatted,
                durasiMenit,
                jenisJam,
                isEffective,
            });
            closeEditDialog();
        } else {
            addSlot(currentDay, {
                jp: '-', // akan otomatis dihitung oleh resequenceDaySlots
                jam: jamFormatted,
                durasiMenit,
                jenisJam,
                isEffective,
            });
            closeAddDialog();
        }
    };

    return (
        <BaseDialog isOpen={isOpen} onClose={handleClose}>
            <DialogHeader
                title={
                    isEditMode
                        ? `Ubah Slot Jadwal — ${currentDay || ''}`
                        : `Tambah Slot Jadwal — ${currentDay || ''}`
                }
                onClose={handleClose}
            />
            <DialogBody>
                <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    {/* 1. Pilih Kategori / Jenis Jam */}
                    <FormControl fullWidth size="small">
                        <InputLabel id="jenis-jam-dialog-label">Kategori / Jenis Jam</InputLabel>
                        <Select
                            labelId="jenis-jam-dialog-label"
                            value={jenisJam}
                            label="Kategori / Jenis Jam"
                            onChange={(e) => handleJenisChange(e.target.value)}
                            sx={{ borderRadius: 2 }}
                        >
                            <MenuItem value="Upacara">Upacara / Pembinaan Pagi (Jam ke-0)</MenuItem>
                            <MenuItem value="Senam">Senam Bersama (Jam ke-0)</MenuItem>
                            <MenuItem value="Literasi">Literasi / Rohani (Jam ke-0)</MenuItem>
                            <MenuItem value="KBM">KBM (Kegiatan Belajar Mengajar)</MenuItem>
                            <MenuItem value="Istirahat">Istirahat / Ishoma</MenuItem>
                            <MenuItem value="Ekstra">Ekstrakurikuler Wajib / Pilihan / Pramuka</MenuItem>
                        </Select>
                    </FormControl>

                    {/* 2. Durasi Menit & Quick Preset */}
                    <Box>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.75 }}>
                            DURASI ALOKASI WAKTU (MENIT)
                        </Typography>
                        <TextField
                            type="number"
                            size="small"
                            value={durasiMenit}
                            onChange={(e) => handleDurationChange(Math.max(1, parseInt(e.target.value) || 0))}
                            fullWidth
                            slotProps={{
                                input: {
                                    endAdornment: <InputAdornment position="end">Menit</InputAdornment>,
                                    sx: { borderRadius: 2 },
                                },
                            }}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 1, flexWrap: 'wrap' }}>
                            <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>
                                Pilihan:
                            </Typography>
                            {[45, 40, 35, 30, 25, 15, 65, 90].map((mins) => (
                                <Button
                                    key={mins}
                                    size="small"
                                    variant={durasiMenit === mins ? 'contained' : 'outlined'}
                                    onClick={() => handleDurationChange(mins)}
                                    sx={{
                                        py: 0.2,
                                        px: 1,
                                        minWidth: 0,
                                        fontSize: '0.72rem',
                                        borderRadius: 1.5,
                                        textTransform: 'none',
                                    }}
                                >
                                    {mins}m
                                </Button>
                            ))}
                        </Box>
                    </Box>

                    {/* 3. Jam Mulai dan Jam Selesai */}
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 6 }}>
                            <TextField
                                label="Jam Mulai"
                                placeholder="07:00"
                                value={jamMulai}
                                onChange={(e) => handleJamMulaiChange(e.target.value)}
                                fullWidth
                                size="small"
                                slotProps={{ input: { sx: { borderRadius: 2 } } }}
                            />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <TextField
                                label="Jam Selesai (Auto)"
                                placeholder="07:45"
                                value={jamSelesai}
                                onChange={(e) => setJamSelesai(e.target.value)}
                                fullWidth
                                size="small"
                                slotProps={{ input: { sx: { borderRadius: 2 } } }}
                            />
                        </Grid>
                    </Grid>

                    {/* Info Penomoran JP Otomatis */}
                    <Box
                        sx={{
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'grey.900' : '#f8fafc'),
                            border: 1,
                            borderColor: 'divider',
                        }}
                    >
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.4 }}>
                            <strong>Ketentuan Penomoran JP:</strong>
                            <br />
                            • Upacara, Senam, Literasi di awal hari otomatis menjadi <strong>Jam ke-0</strong>
                            <br />
                            • KBM tatap muka otomatis bernomor urut <strong>1, 2, 3, dst.</strong>
                            <br />
                            • Istirahat & Ekstrakurikuler ditandai dengan strip <strong>(-)</strong>
                        </Typography>
                    </Box>
                </Box>
            </DialogBody>
            <DialogFooter
                onCancel={handleClose}
                onSubmit={handleSave}
                submitText={isEditMode ? 'Simpan Perubahan' : 'Tambahkan Slot'}
            />
        </BaseDialog>
    );
};

export default AddSlotDialog;
