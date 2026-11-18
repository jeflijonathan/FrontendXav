import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Box,
    Typography,
    Alert,
    IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { useScheduleStore } from '../store/useScheduleStore';
import type { DayName, GuruPiketEntry } from '../types';

interface GuruPiketFormDialogProps {
    open: boolean;
    onClose: () => void;
    editingIndex: number | null;
}

const DAYS: DayName[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export const GuruPiketFormDialog: React.FC<GuruPiketFormDialogProps> = ({
    open,
    onClose,
    editingIndex,
}) => {
    const { teachers, guruPiket, addGuruPiket, updateGuruPiket } = useScheduleStore();

    const [name, setName] = useState('');
    const [teacherCode, setTeacherCode] = useState<number | undefined>(undefined);
    const [hari, setHari] = useState<DayName>('Senin');
    const [jumlahJp, setJumlahJp] = useState<number>(4);
    const [role, setRole] = useState('Anggota Piket');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (open) {
            if (editingIndex !== null && guruPiket[editingIndex]) {
                const item = guruPiket[editingIndex];
                setName(item.name || '');
                setTeacherCode(item.teacherCode);
                setHari(item.hari || 'Senin');
                setJumlahJp(item.jumlahJp || 4);
                setRole(item.role || 'Anggota Piket');
                setNotes(item.notes || '');
            } else {
                setName(teachers[0]?.name || '');
                setTeacherCode(teachers[0]?.code);
                setHari('Senin');
                setJumlahJp(4);
                setRole('Anggota Piket');
                setNotes('');
            }
        }
    }, [open, editingIndex, guruPiket, teachers]);

    const handleTeacherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        const matched = teachers.find((t) => t.name === val || String(t.code) === val);
        if (matched) {
            setName(matched.name);
            setTeacherCode(matched.code);
        } else {
            setName(val);
            setTeacherCode(undefined);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        const payload: Omit<GuruPiketEntry, 'id'> = {
            name: name.trim(),
            teacherCode,
            hari,
            jumlahJp: Math.max(1, Number(jumlahJp) || 4),
            role: role.trim() || 'Anggota Piket',
            notes: notes.trim() || undefined,
        };

        if (editingIndex !== null) {
            updateGuruPiket(editingIndex, payload);
        } else {
            addGuruPiket(payload);
        }

        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1.5 }}>
                    <Box
                        sx={{
                            width: 38,
                            height: 38,
                            borderRadius: 2,
                            bgcolor: '#fef3c7',
                            color: '#b45309',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <AssignmentIndIcon />
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a' }}>
                            {editingIndex !== null ? 'Edit Jadwal Guru Piket' : 'Tambah Guru Piket Baru'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                            Atur hari tugas & alokasi JP untuk deteksi bentrok otomatis
                        </Typography>
                    </Box>
                </Box>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, py: 2.5 }}>
                    {/* Pilih Guru */}
                    <TextField
                        select
                        label="Pilih Guru / Tenaga Pengajar"
                        value={name}
                        onChange={handleTeacherChange}
                        fullWidth
                        size="small"
                        required
                        helperText="Pilih guru dari daftar pengajar aktif di database"
                    >
                        {teachers.map((t) => (
                            <MenuItem key={t.code} value={t.name}>
                                #{t.code} - {t.name} ({t.subjectName || 'Guru'})
                            </MenuItem>
                        ))}
                    </TextField>

                    {/* Hari Piket & Jumlah JP */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                        <TextField
                            select
                            label="Hari Piket"
                            value={hari}
                            onChange={(e) => setHari(e.target.value as DayName)}
                            fullWidth
                            size="small"
                            required
                        >
                            {DAYS.map((d) => (
                                <MenuItem key={d} value={d}>
                                    {d}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="Jumlah JP Piket"
                            type="number"
                            value={jumlahJp}
                            onChange={(e) => setJumlahJp(Math.max(1, Math.min(10, parseInt(e.target.value || '1', 10))))}
                            slotProps={{ htmlInput: { min: 1, max: 10 } }}
                            fullWidth
                            size="small"
                            required
                            helperText="Misal: 4 JP = slot KBM 1 s/d 4"
                        />
                    </Box>

                    {/* Box Penjelasan Logika Bentrok Sesuai Permintaan User */}
                    <Alert severity="info" sx={{ borderRadius: 2 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5, color: '#1e3a8a' }}>
                            💡 Logika Deteksi Bentrok Jadwal:
                        </Typography>
                        <Typography variant="caption" sx={{ display: 'block', color: '#1e40af', lineHeight: 1.5 }}>
                            • <strong>Slot KBM 1 s/d {jumlahJp}:</strong> Guru bertugas piket pada hari <strong>{hari}</strong>. Sistem akan mendeteksi <strong>BENTROK</strong> jika guru dijadwalkan mengajar pada slot KBM 1 sampai {jumlahJp}.
                        </Typography>
                        <Typography variant="caption" sx={{ display: 'block', color: '#15803d', fontWeight: 600, mt: 0.5 }}>
                            • <strong>Slot KBM {jumlahJp + 1} ke atas:</strong> <u>TIDAK BENTROK</u> (guru diperbolehkan mengajar secara normal setelah tugas piket selesai).
                        </Typography>
                    </Alert>

                    {/* Peran */}
                    <TextField
                        select
                        label="Peran Piket"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        fullWidth
                        size="small"
                    >
                        <MenuItem value="Koordinator Piket">Koordinator Piket</MenuItem>
                        <MenuItem value="Anggota Piket">Anggota Piket</MenuItem>
                        <MenuItem value="Piket Gerbang & Presensi">Piket Gerbang & Presensi</MenuItem>
                        <MenuItem value="Piket KBM & Ketertiban">Piket KBM & Ketertiban</MenuItem>
                    </TextField>

                    {/* Catatan */}
                    <TextField
                        label="Catatan Tambahan (Opsional)"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Contoh: Mengawasi gerbang dan ketertiban pagi"
                        fullWidth
                        size="small"
                        multiline
                        rows={2}
                    />
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={onClose} color="inherit" sx={{ textTransform: 'none', fontWeight: 600 }}>
                        Batal
                    </Button>
                    <Button type="submit" variant="contained" color="primary" sx={{ textTransform: 'none', fontWeight: 700 }}>
                        {editingIndex !== null ? 'Simpan Perubahan' : 'Tambahkan Piket'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default GuruPiketFormDialog;
