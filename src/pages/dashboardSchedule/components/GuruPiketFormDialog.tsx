import React, { useState, useEffect, useMemo } from 'react';
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
    Chip,
    Stack,
    Tooltip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useScheduleStore } from '../store/useScheduleStore';
import type { DayName, GuruPiketEntry, TeacherCodeEntry } from '../types';
import EmployeeService from '@api/employee/service';
import type { EmployeeResponseModel } from '@api/employee/model';

interface GuruPiketFormDialogProps {
    open: boolean;
    onClose: () => void;
    editingIndex: number | null;
    defaultDay?: DayName;
}

const DAYS: DayName[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export const GuruPiketFormDialog: React.FC<GuruPiketFormDialogProps> = ({
    open,
    onClose,
    editingIndex,
    defaultDay,
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const { teachers, guruPiket, rows, addGuruPiket, updateGuruPiket } = useScheduleStore();

    const [teacherCode, setTeacherCode] = useState<number | ''>('');
    const [name, setName] = useState('');
    const [hari, setHari] = useState<DayName>('Senin');
    const [selectedSlots, setSelectedSlots] = useState<number[]>([1, 2, 3, 4]);
    const [role, setRole] = useState('Anggota Piket');
    const [notes, setNotes] = useState('');

    // State untuk daftar karyawan dengan role guru_piket dari EmployeeService
    const [piketEmployeeUsers, setPiketEmployeeUsers] = useState<EmployeeResponseModel[]>([]);
    const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);

    // Ambil data user karyawan saat dialog dibuka untuk mendeteksi role guru_piket
    useEffect(() => {
        if (!open) return;
        setIsLoadingEmployees(true);
        const employeeService = new EmployeeService();
        employeeService.getAll(
            {
                onSuccess: (res) => {
                    const list = res.data || [];
                    setPiketEmployeeUsers(list);
                    setIsLoadingEmployees(false);
                },
                onError: () => {
                    setIsLoadingEmployees(false);
                },
            },
            { params: { limit: 100 } }
        );
    }, [open]);

    // FILTER HANYA GURU DENGAN ROLE "GURU_PIKET"
    const { filteredPiketTeachers, hasRoleFilterMatch } = useMemo(() => {
        // 1. Dapatkan daftar nama & NIY karyawan yang memiliki role "guru_piket"
        const employeesWithPiketRole = piketEmployeeUsers.filter((emp) => {
            const roleNames = emp.user?.roles?.map((r) => r.name.toLowerCase().trim()) || [];
            return roleNames.includes('guru_piket') || roleNames.includes('piket') || roleNames.some((r) => r.includes('piket'));
        });

        const piketNiySet = new Set(employeesWithPiketRole.map((e) => (e.niy || '').trim().toLowerCase()).filter(Boolean));
        const piketNameSet = new Set(
            employeesWithPiketRole.map((e) => (e.formatted_name || `${e.first_name || ''} ${e.last_name || ''}`).trim().toLowerCase()).filter(Boolean)
        );

        // 2. Filter teachers yang memiliki role guru_piket (baik dari backend /teachings/ atau dari EmployeeService)
        const matchedFromTeachers = teachers.filter((t) => {
            // Cek langsung dari t.roles
            const directRoles = t.roles?.map((r) => r.toLowerCase().trim()) || [];
            if (directRoles.includes('guru_piket') || directRoles.includes('piket') || directRoles.some((r) => r.includes('piket'))) {
                return true;
            }
            // Cek dari NIY
            if (t.niy && piketNiySet.has(t.niy.trim().toLowerCase())) {
                return true;
            }
            // Cek dari Nama
            if (t.name) {
                const nameClean = t.name.trim().toLowerCase();
                if (piketNameSet.has(nameClean)) return true;
                for (const pName of piketNameSet) {
                    if (nameClean.includes(pName) || pName.includes(nameClean)) return true;
                }
            }
            return false;
        });

        // 3. Tambahkan juga karyawan yang memiliki role guru_piket tetapi belum mengajar KBM di periode ini
        const additionalEmployees: TeacherCodeEntry[] = [];
        let fallbackCode = 901;
        employeesWithPiketRole.forEach((emp) => {
            const empName = (emp.formatted_name || `${emp.first_name || ''} ${emp.last_name || ''}`).trim();
            const isAlreadyInTeachers = matchedFromTeachers.some(
                (t) => (t.niy && emp.niy && t.niy.trim().toLowerCase() === emp.niy.trim().toLowerCase()) ||
                       t.name.trim().toLowerCase() === empName.toLowerCase()
            );
            if (!isAlreadyInTeachers) {
                additionalEmployees.push({
                    code: fallbackCode++,
                    teacherId: emp.id,
                    name: empName,
                    niy: emp.niy || undefined,
                    subjectName: 'Guru Pengawas Piket',
                    subjectCode: 'PIKET',
                    category: 'UMUM',
                    recommendedJp: 'Semua Jam Piket',
                    totalJpAssigned: 0,
                    targetJp: 0,
                    roles: ['guru_piket'],
                });
            }
        });

        const combined = [...matchedFromTeachers, ...additionalEmployees];

        // Strict filter: Hanya tampilkan guru/karyawan yang memiliki role "guru_piket"
        return { filteredPiketTeachers: combined, hasRoleFilterMatch: combined.length > 0 };
    }, [teachers, piketEmployeeUsers]);

    // Dapatkan slot KBM riil per hari dari rows
    const kbmSlotsForDay = useMemo(() => {
        const fromRows = rows.filter(
            (r) => r.day === hari && !r.specialActivity && typeof r.jp === 'number' && r.jp > 0
        );
        if (fromRows.length > 0) {
            const seen = new Set<number>();
            const unique: Array<{ jp: number; timeRange: string }> = [];
            fromRows.forEach((r) => {
                const jpNum = Number(r.jp);
                if (!seen.has(jpNum)) {
                    seen.add(jpNum);
                    unique.push({ jp: jpNum, timeRange: r.timeRange });
                }
            });
            return unique.sort((a, b) => a.jp - b.jp);
        }
        // Fallback jika rows belum ada/belum disinkronkan
        return Array.from({ length: 9 }, (_, i) => ({
            jp: i + 1,
            timeRange: `JP ${i + 1}`,
        }));
    }, [rows, hari]);

    useEffect(() => {
        if (!open) return;

        if (editingIndex !== null && guruPiket[editingIndex]) {
            const item = guruPiket[editingIndex];
            setName(item.name || '');
            const foundCode = item.teacherCode ?? (
                filteredPiketTeachers.find((t) => t.name === item.name)?.code ||
                teachers.find((t) => t.name === item.name)?.code ||
                ''
            );
            setTeacherCode(foundCode);
            setHari(item.hari || 'Senin');
            if (item.slots && item.slots.length > 0) {
                setSelectedSlots(item.slots);
            } else {
                const defaultJp = Number(item.jumlahJp) || 4;
                setSelectedSlots(Array.from({ length: defaultJp }, (_, i) => i + 1));
            }
            setRole(item.role || 'Anggota Piket');
            setNotes(item.notes || '');
        } else {
            const initialTeacher = filteredPiketTeachers[0] || teachers[0];
            setName(initialTeacher?.name || '');
            setTeacherCode(initialTeacher?.code || '');
            setHari(defaultDay || 'Senin');
            setSelectedSlots([1, 2, 3, 4]);
            setRole('Anggota Piket');
            setNotes('');
        }
    }, [open, editingIndex, guruPiket, teachers, filteredPiketTeachers, defaultDay]);

    const handleTeacherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (val === '') {
            setTeacherCode('');
            setName('');
            return;
        }
        const codeNum = Number(val);
        setTeacherCode(codeNum);
        const matched = filteredPiketTeachers.find((t) => t.code === codeNum) || teachers.find((t) => t.code === codeNum);
        if (matched) {
            setName(matched.name);
        }
    };

    const handleToggleSlot = (jp: number) => {
        setSelectedSlots((prev) => {
            if (prev.includes(jp)) {
                return prev.filter((s) => s !== jp);
            } else {
                return [...prev, jp].sort((a, b) => a - b);
            }
        });
    };

    const handleSelectAllSlots = () => {
        setSelectedSlots(kbmSlotsForDay.map((s) => s.jp));
    };

    const handleSelectMorningSlots = () => {
        setSelectedSlots([1, 2, 3, 4].filter((j) => kbmSlotsForDay.some((s) => s.jp === j)));
    };

    const handleSelectAfternoonSlots = () => {
        setSelectedSlots([5, 6, 7, 8, 9].filter((j) => kbmSlotsForDay.some((s) => s.jp === j)));
    };

    const handleClearSlots = () => {
        setSelectedSlots([]);
    };

    // Deteksi apakah hari ini sudah ada guru piket lain
    const existingPiketForDay = useMemo(() => {
        return guruPiket.find(
            (p, idx) => p.hari === hari && (editingIndex === null || idx !== editingIndex)
        );
    }, [guruPiket, hari, editingIndex]);

    // Deteksi real-time bentrok jadwal mengajar dengan slot piket yang dipilih
    const conflictedTeachingSlots = useMemo(() => {
        if (!teacherCode || !hari || selectedSlots.length === 0) return [];
        const conflicts: Array<{
            day: DayName;
            jp: number;
            timeRange: string;
            className: string;
            subjectName: string;
        }> = [];

        rows.forEach((row) => {
            if (row.day !== hari || row.specialActivity) return;
            const jpNum = Number(row.jp);
            if (!selectedSlots.includes(jpNum)) return;

            Object.entries(row.classCells || {}).forEach(([className, cell]) => {
                if (cell.teacherCode === Number(teacherCode)) {
                    conflicts.push({
                        day: row.day,
                        jp: jpNum,
                        timeRange: row.timeRange,
                        className,
                        subjectName: cell.subjectName || 'Mata Pelajaran',
                    });
                }
            });
        });

        return conflicts;
    }, [rows, teacherCode, hari, selectedSlots]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        if (selectedSlots.length === 0) {
            alert('Silakan pilih minimal 1 slot jam piket (klik kotak nomor [1], [2], dll)!');
            return;
        }

        const payload: Omit<GuruPiketEntry, 'id'> = {
            name: name.trim(),
            teacherCode: typeof teacherCode === 'number' ? teacherCode : undefined,
            hari,
            jumlahJp: selectedSlots.length,
            slots: [...selectedSlots].sort((a, b) => a - b),
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
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: 3.5,
                        overflow: 'hidden',
                        bgcolor: isDark ? '#18181b' : '#ffffff',
                        color: isDark ? '#f4f4f5' : '#0f172a',
                        border: isDark ? '1px solid #27272a' : undefined,
                    },
                },
            }}
        >
            <DialogTitle
                sx={{
                    p: 2.5,
                    bgcolor: isDark ? '#18181b' : '#f8fafc',
                    borderBottom: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                    <Box
                        sx={{
                            width: 38,
                            height: 38,
                            borderRadius: 2,
                            bgcolor: isDark ? 'rgba(245, 158, 11, 0.2)' : '#fef3c7',
                            color: isDark ? '#fbbf24' : '#b45309',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <AssignmentIndIcon />
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: isDark ? '#f4f4f5' : '#0f172a', fontSize: '17px' }}>
                            {editingIndex !== null ? 'Edit Jadwal Guru Piket' : 'Tugaskan Guru Piket Baru'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: isDark ? '#a1a1aa' : '#64748b' }}>
                            1 Hari diawasi oleh 1 Guru Piket • Jam KBM disesuaikan dengan Roster
                        </Typography>
                    </Box>
                </Stack>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    {/* Alert jika belum ada guru/karyawan ber-role guru_piket */}
                    {!hasRoleFilterMatch && (
                        <Alert severity="warning" sx={{ borderRadius: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '13px' }}>
                                Hanya Pengguna dengan Role &quot;guru_piket&quot; yang Ditampilkan
                            </Typography>
                            <Typography variant="caption" sx={{ display: 'block', mt: 0.5, lineHeight: 1.5 }}>
                                Saat ini belum ada guru/karyawan yang terdaftar dengan role <strong>guru_piket</strong> pada database. Silakan tugaskan role <strong>guru_piket</strong> pada akun pengguna/karyawan terlebih dahulu.
                            </Typography>
                        </Alert>
                    )}

                    {/* Pilih Guru dengan Filter Role Guru Piket */}
                    <TextField
                        select
                        label="Pilih Guru Pengawas Piket"
                        value={teacherCode}
                        onChange={handleTeacherChange}
                        fullWidth
                        size="small"
                        required
                        disabled={filteredPiketTeachers.length === 0}
                        helperText={
                            hasRoleFilterMatch
                                ? `✓ Menampilkan ${filteredPiketTeachers.length} guru pengawas terverifikasi role "guru_piket"`
                                : 'Filter ketat aktif: Hanya guru dengan role guru_piket yang dapat dipilih'
                        }
                        SelectProps={{
                            MenuProps: {
                                PaperProps: {
                                    sx: {
                                        bgcolor: isDark ? '#18181b' : '#ffffff',
                                        color: isDark ? '#f4f4f5' : '#0f172a',
                                        border: isDark ? '1px solid #27272a' : undefined,
                                        boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.6)' : undefined,
                                    },
                                },
                            },
                        }}
                        sx={{
                            '& .MuiInputBase-root': {
                                bgcolor: isDark ? '#141416' : '#ffffff',
                                color: isDark ? '#f4f4f5' : '#0f172a',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: isDark ? '#27272a' : '#cbd5e1',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: isDark ? '#52525b' : '#94a3b8',
                            },
                            '& .MuiInputLabel-root': {
                                color: isDark ? '#a1a1aa' : '#64748b',
                            },
                            '& .MuiFormHelperText-root': {
                                color: hasRoleFilterMatch
                                    ? (isDark ? '#4ade80' : '#16a34a')
                                    : (isDark ? '#f87171' : '#b91c1c'),
                                fontWeight: 700,
                            },
                        }}
                    >
                        {filteredPiketTeachers.length === 0 ? (
                            <MenuItem disabled value="" sx={{ color: isDark ? '#a1a1aa' : '#64748b' }}>
                                <em>Tidak ada guru dengan role guru_piket ditemukan</em>
                            </MenuItem>
                        ) : (
                            filteredPiketTeachers.map((t) => (
                                <MenuItem
                                    key={t.code}
                                    value={t.code}
                                    sx={{
                                        bgcolor: isDark ? '#18181b' : '#ffffff',
                                        color: isDark ? '#f4f4f5' : '#0f172a',
                                        '&:hover': {
                                            bgcolor: isDark ? '#27272a' : '#f1f5f9',
                                        },
                                        '&.Mui-selected': {
                                            bgcolor: isDark ? 'rgba(79, 70, 229, 0.25)' : '#ede9fe',
                                            '&:hover': {
                                                bgcolor: isDark ? 'rgba(79, 70, 229, 0.35)' : '#ddd6fe',
                                            },
                                        },
                                    }}
                                >
                                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', width: '100%' }}>
                                        <Chip
                                            label={`#${t.code}`}
                                            size="small"
                                            sx={{
                                                fontWeight: 800,
                                                bgcolor: isDark ? 'rgba(99, 102, 241, 0.25)' : '#e0e7ff',
                                                color: isDark ? '#a5b4fc' : '#3730a3',
                                                height: 20,
                                                fontSize: '11px',
                                            }}
                                        />
                                        <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#f4f4f5' : '#0f172a' }}>
                                            {t.name}
                                        </Typography>
                                        <Chip
                                            label="Guru Piket"
                                            size="small"
                                            color="success"
                                            variant="outlined"
                                            sx={{ height: 18, fontSize: '10px', fontWeight: 800 }}
                                        />
                                        <Typography variant="caption" sx={{ ml: 'auto', color: isDark ? '#a1a1aa' : '#64748b' }}>
                                            {t.subjectName || '-'}
                                        </Typography>
                                    </Stack>
                                </MenuItem>
                            ))
                        )}
                    </TextField>

                    {/* Pilih Hari */}
                    <Box>
                        <TextField
                            select
                            label="Hari Tugas Piket"
                            value={hari}
                            onChange={(e) => setHari(e.target.value as DayName)}
                            fullWidth
                            size="small"
                            required
                            SelectProps={{
                                MenuProps: {
                                    PaperProps: {
                                        sx: {
                                            bgcolor: isDark ? '#18181b' : '#ffffff',
                                            color: isDark ? '#f4f4f5' : '#0f172a',
                                            border: isDark ? '1px solid #27272a' : undefined,
                                            boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.6)' : undefined,
                                        },
                                    },
                                },
                            }}
                            sx={{
                                '& .MuiInputBase-root': {
                                    bgcolor: isDark ? '#141416' : '#ffffff',
                                    color: isDark ? '#f4f4f5' : '#0f172a',
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: isDark ? '#27272a' : '#cbd5e1',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: isDark ? '#52525b' : '#94a3b8',
                                },
                                '& .MuiInputLabel-root': {
                                    color: isDark ? '#a1a1aa' : '#64748b',
                                },
                            }}
                        >
                            {DAYS.map((d) => {
                                const isTaken = guruPiket.some(
                                    (p, idx) => p.hari === d && (editingIndex === null || idx !== editingIndex)
                                );
                                return (
                                    <MenuItem
                                        key={d}
                                        value={d}
                                        sx={{
                                            bgcolor: isDark ? '#18181b' : '#ffffff',
                                            color: isDark ? '#f4f4f5' : '#0f172a',
                                            '&:hover': {
                                                bgcolor: isDark ? '#27272a' : '#f1f5f9',
                                            },
                                            '&.Mui-selected': {
                                                bgcolor: isDark ? 'rgba(79, 70, 229, 0.25)' : '#ede9fe',
                                            },
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                Hari {d}
                                            </Typography>
                                            {isTaken && (
                                                <Chip
                                                    label="Sudah Ada Piket"
                                                    size="small"
                                                    sx={{
                                                        height: 18,
                                                        fontSize: '10px',
                                                        bgcolor: isDark ? 'rgba(217, 119, 6, 0.25)' : '#fef3c7',
                                                        color: isDark ? '#fbbf24' : '#b45309',
                                                    }}
                                                />
                                            )}
                                        </Box>
                                    </MenuItem>
                                );
                            })}
                        </TextField>

                        {existingPiketForDay && (
                            <Alert severity="warning" sx={{ mt: 1, py: 0.5, fontSize: '12px' }}>
                                ⚠️ Hari <strong>{hari}</strong> sudah ditugaskan ke <strong>{existingPiketForDay.name}</strong>. Menyimpan penugasan ini akan otomatis menggantikan guru piket sebelumnya (aturan: 1 hari 1 guru piket).
                            </Alert>
                        )}
                    </Box>

                    {/* PILIH JAM JP PIKET DENGAN KOTAK HIJAU [1], [2], [3] (SESUAI GAMBAR USER) */}
                    <Box
                        sx={{
                            p: 2.25,
                            bgcolor: isDark ? '#1e1e24' : '#f8fafc',
                            borderRadius: 3,
                            border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
                            <Box>
                                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{ fontWeight: 900, color: isDark ? '#86efac' : '#15803d', letterSpacing: 0.5 }}
                                    >
                                        {hari.toUpperCase()}
                                    </Typography>
                                    <Chip
                                        size="small"
                                        label={`${selectedSlots.length} JP`}
                                        sx={{
                                            fontWeight: 800,
                                            fontSize: '11px',
                                            bgcolor: selectedSlots.length > 0 ? (isDark ? 'rgba(22, 101, 52, 0.3)' : '#dcfce7') : (isDark ? '#27272a' : '#f1f5f9'),
                                            color: selectedSlots.length > 0 ? (isDark ? '#86efac' : '#15803d') : (isDark ? '#a1a1aa' : '#64748b'),
                                            height: 20,
                                        }}
                                    />
                                </Stack>
                                <Typography variant="caption" sx={{ color: isDark ? '#a1a1aa' : '#64748b', fontSize: '11px' }}>
                                    {kbmSlotsForDay.length} slot KBM tersedia pada hari {hari}
                                </Typography>
                            </Box>

                            {/* Preset Buttons */}
                            <Stack direction="row" spacing={0.5}>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={handleSelectMorningSlots}
                                    sx={{ fontSize: '10px', py: 0.2, px: 0.8, textTransform: 'none', borderRadius: 1 }}
                                >
                                    JP 1-4
                                </Button>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={handleSelectAllSlots}
                                    sx={{ fontSize: '10px', py: 0.2, px: 0.8, textTransform: 'none', borderRadius: 1 }}
                                >
                                    Semua KBM
                                </Button>
                                <Button
                                    size="small"
                                    variant="text"
                                    color="error"
                                    onClick={handleClearSlots}
                                    sx={{ fontSize: '10px', py: 0.2, px: 0.8, textTransform: 'none' }}
                                >
                                    Reset
                                </Button>
                            </Stack>
                        </Box>

                        {/* Kotak Nomor [1], [2], [3]... Interaktif */}
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
                            {kbmSlotsForDay.map((slot) => {
                                const isChecked = selectedSlots.includes(slot.jp);
                                return (
                                    <Tooltip
                                        key={slot.jp}
                                        title={`Jam Ke-${slot.jp} (${slot.timeRange})`}
                                        arrow
                                    >
                                        <Button
                                            variant={isChecked ? 'contained' : 'outlined'}
                                            onClick={() => handleToggleSlot(slot.jp)}
                                            sx={{
                                                minWidth: 44,
                                                width: 44,
                                                height: 42,
                                                p: 0,
                                                borderRadius: '8px',
                                                fontWeight: 900,
                                                fontSize: '15px',
                                                fontFamily: 'monospace',
                                                bgcolor: isChecked ? '#16a34a' : (isDark ? '#18181b' : '#ffffff'),
                                                color: isChecked ? '#ffffff' : (isDark ? '#f4f4f5' : '#334155'),
                                                borderColor: isChecked ? '#15803d' : (isDark ? '#3f3f46' : '#cbd5e1'),
                                                borderWidth: isChecked ? '2px' : '1px',
                                                boxShadow: isChecked
                                                    ? '0 3px 6px rgba(22, 163, 74, 0.35)'
                                                    : 'none',
                                                transition: 'all 0.15s ease-in-out',
                                                '&:hover': {
                                                    bgcolor: isChecked ? '#15803d' : (isDark ? '#27272a' : '#f1f5f9'),
                                                    borderColor: isChecked ? '#166534' : (isDark ? '#52525b' : '#94a3b8'),
                                                    transform: 'translateY(-1px)',
                                                },
                                            }}
                                        >
                                            [{slot.jp}]
                                        </Button>
                                    </Tooltip>
                                );
                            })}
                        </Box>
                    </Box>

                    {/* ALERT / DETEKSI BENTROK JADWAL MENGAJAR GURU PIKET */}
                    {conflictedTeachingSlots.length > 0 ? (
                        <Alert
                            severity="error"
                            icon={<WarningAmberIcon />}
                            sx={{
                                borderRadius: 2.5,
                                border: isDark ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid #fecaca',
                                bgcolor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2',
                            }}
                        >
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#ef4444' }}>
                                ⚠️ Terdeteksi {conflictedTeachingSlots.length} Jadwal Mengajar Bentrok!
                            </Typography>
                            <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: isDark ? '#fca5a5' : '#991b1b' }}>
                                Guru #{teacherCode} ({name}) memiliki jam mengajar di kelas pada waktu piket yang sama:
                            </Typography>
                            <Box sx={{ mt: 1, pl: 1 }}>
                                {conflictedTeachingSlots.map((item, idx) => (
                                    <Typography
                                        key={idx}
                                        variant="caption"
                                        sx={{ display: 'block', fontWeight: 700, color: isDark ? '#f87171' : '#dc2626' }}
                                    >
                                        • Jam Ke-{item.jp} ({item.timeRange}) di Kelas <strong>{item.className}</strong> ({item.subjectName})
                                    </Typography>
                                ))}
                            </Box>
                            <Typography variant="caption" sx={{ display: 'block', mt: 0.75, color: isDark ? '#fca5a5' : '#7f1d1d', fontStyle: 'italic' }}>
                                Di jadwal matriks, slot guru ini akan otomatis ditandai MERAH (BENTROK PIKET).
                            </Typography>
                        </Alert>
                    ) : selectedSlots.length > 0 && teacherCode ? (
                        <Alert
                            severity="success"
                            icon={<CheckCircleOutlineIcon />}
                            sx={{
                                borderRadius: 2.5,
                                border: isDark ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid #bbf7d0',
                                bgcolor: isDark ? 'rgba(34, 197, 94, 0.15)' : '#f0fdf4',
                                py: 0.5,
                            }}
                        >
                            <Typography variant="body2" sx={{ fontWeight: 700, color: isDark ? '#4ade80' : '#15803d', fontSize: '13px' }}>
                                ✓ Jadwal Piket Bebas Bentrok
                            </Typography>
                            <Typography variant="caption" sx={{ color: isDark ? '#86efac' : '#166534' }}>
                                Guru #{teacherCode} tidak memiliki jadwal mengajar pada slot Jam Ke-[{selectedSlots.join(', ')}] di hari {hari}.
                            </Typography>
                        </Alert>
                    ) : null}

                    {/* Peran & Catatan */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                        <TextField
                            select
                            label="Peran Piket"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            fullWidth
                            size="small"
                            SelectProps={{
                                MenuProps: {
                                    PaperProps: {
                                        sx: {
                                            bgcolor: isDark ? '#18181b' : '#ffffff',
                                            color: isDark ? '#f4f4f5' : '#0f172a',
                                            border: isDark ? '1px solid #27272a' : undefined,
                                        },
                                    },
                                },
                            }}
                            sx={{
                                '& .MuiInputBase-root': {
                                    bgcolor: isDark ? '#141416' : '#ffffff',
                                    color: isDark ? '#f4f4f5' : '#0f172a',
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: isDark ? '#27272a' : '#cbd5e1',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: isDark ? '#52525b' : '#94a3b8',
                                },
                                '& .MuiInputLabel-root': {
                                    color: isDark ? '#a1a1aa' : '#64748b',
                                },
                            }}
                        >
                            <MenuItem value="Koordinator Piket" sx={{ bgcolor: isDark ? '#18181b' : '#ffffff', color: isDark ? '#f4f4f5' : '#0f172a' }}>Koordinator Piket</MenuItem>
                            <MenuItem value="Anggota Piket" sx={{ bgcolor: isDark ? '#18181b' : '#ffffff', color: isDark ? '#f4f4f5' : '#0f172a' }}>Anggota Piket</MenuItem>
                            <MenuItem value="Piket Gerbang & Presensi" sx={{ bgcolor: isDark ? '#18181b' : '#ffffff', color: isDark ? '#f4f4f5' : '#0f172a' }}>Piket Gerbang & Presensi</MenuItem>
                            <MenuItem value="Piket KBM & Ketertiban" sx={{ bgcolor: isDark ? '#18181b' : '#ffffff', color: isDark ? '#f4f4f5' : '#0f172a' }}>Piket KBM & Ketertiban</MenuItem>
                        </TextField>

                        <TextField
                            label="Catatan Tambahan (Opsional)"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Contoh: Pengawasan KBM pagi"
                            fullWidth
                            size="small"
                            sx={{
                                '& .MuiInputBase-root': {
                                    bgcolor: isDark ? '#141416' : '#ffffff',
                                    color: isDark ? '#f4f4f5' : '#0f172a',
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: isDark ? '#27272a' : '#cbd5e1',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: isDark ? '#52525b' : '#94a3b8',
                                },
                                '& .MuiInputLabel-root': {
                                    color: isDark ? '#a1a1aa' : '#64748b',
                                },
                            }}
                        />
                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 2.5, bgcolor: isDark ? '#18181b' : '#f8fafc', borderTop: isDark ? '1px solid #27272a' : '1px solid #e2e8f0' }}>
                    <Button onClick={onClose} variant="outlined" sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}>
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{
                            textTransform: 'none',
                            fontWeight: 700,
                            borderRadius: 2,
                            bgcolor: '#4f46e5',
                            '&:hover': { bgcolor: '#4338ca' },
                            px: 3,
                        }}
                    >
                        {editingIndex !== null ? 'Simpan Perubahan' : 'Tugaskan Guru Piket'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default GuruPiketFormDialog;
