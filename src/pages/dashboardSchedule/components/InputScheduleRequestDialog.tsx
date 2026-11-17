import React, { useState, useEffect, useMemo } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Stack,
    Typography,
    IconButton,
    Chip,
    Alert,
    Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useScheduleStore } from '../store/useScheduleStore';
import type { DayName, PreferredScheduleSlot } from '../types';
import { snackbar } from '@utils/snackbar';

const DAYS: DayName[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

interface SelectedSlotDetail {
    day: DayName;
    jp: number;
    timeRange: string;
}

const InputScheduleRequestDialog: React.FC = () => {
    const {
        isRequestDialogOpen,
        setIsRequestDialogOpen,
        editingRequest,
        teachers,
        rows,
        createTeacherRequest,
        updateTeacherRequest,
        validateTeacherRequest,
        isLoadingRequests,
    } = useScheduleStore();

    const [selectedTeacherCode, setSelectedTeacherCode] = useState<number>(1);
    const [selectedSubjectCode, setSelectedSubjectCode] = useState<string>('');
    const [customSubjectName, setCustomSubjectName] = useState<string>('');
    const [selectedSlots, setSelectedSlots] = useState<SelectedSlotDetail[]>([]);
    const [notes, setNotes] = useState<string>('');
    const [validationError, setValidationError] = useState<string | null>(null);

    // Guru yang sedang dipilih
    const selectedTeacher = useMemo(() => {
        return teachers.find((item) => item.code === selectedTeacherCode) || teachers[0];
    }, [teachers, selectedTeacherCode]);

    // Daftar mapel guru dari menu Pengajaran
    const teacherSubjects = useMemo(() => {
        return selectedTeacher?.subjects || [];
    }, [selectedTeacher]);

    // Mapel yang aktif dipilih
    const activeSubject = useMemo(() => {
        return (
            teacherSubjects.find((s) => s.subjectCode === selectedSubjectCode) ||
            teacherSubjects[0] ||
            null
        );
    }, [teacherSubjects, selectedSubjectCode]);

    // Target JP dari mapel yang dipilih (misal 3 JP, 4 JP)
    const targetJp = activeSubject?.targetJp || selectedTeacher?.targetJp || 4;

    // Ambil daftar slot KBM riil per hari dari Roster Jam Belajar
    const getKbmSlotsForDay = (day: DayName): Array<{ jp: number; timeRange: string }> => {
        // 1. Coba dari rows store
        const fromRows = rows.filter(
            (r) => r.day === day && !r.specialActivity && typeof r.jp === 'number' && r.jp > 0
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

        // 2. Fallback baca dari LocalStorage roster schedule
        try {
            const raw = localStorage.getItem('smk_roster_period_schedules');
            if (raw) {
                const parsed = JSON.parse(raw);
                const schoolInfoId = useScheduleStore.getState().idSchoolInformation;
                const scheduleObj =
                    (schoolInfoId && parsed[schoolInfoId]) || Object.values(parsed)[0];
                if (scheduleObj && Array.isArray(scheduleObj[day])) {
                    return scheduleObj[day]
                        .filter((s: any) => {
                            const jenis = (s.jenisJam || s.activityType || 'KBM').toString().toUpperCase();
                            return jenis === 'KBM' || jenis.includes('KBM');
                        })
                        .map((s: any, idx: number) => ({
                            jp: s.jp !== undefined ? Number(s.jp) : idx + 1,
                            timeRange: s.jam || s.timeRange || '07:00 - 07:45',
                        }));
                }
            }
        } catch {
            // Ignore
        }

        return [];
    };

    // Inisialisasi data saat modal dibuka
    useEffect(() => {
        if (!isRequestDialogOpen) return;

        if (editingRequest) {
            setSelectedTeacherCode(editingRequest.teacherCode);
            setCustomSubjectName(editingRequest.subjectName);

            // Cari subject code yang cocok jika ada
            const t = teachers.find((item) => item.code === editingRequest.teacherCode);
            const matchedSubj = t?.subjects?.find(
                (s) =>
                    s.subjectName === editingRequest.subjectName ||
                    editingRequest.subjectName.includes(s.subjectName)
            );
            if (matchedSubj) {
                setSelectedSubjectCode(matchedSubj.subjectCode);
            }

            // Parse preferredSlots ke selectedSlots detail
            const parsedSlots: SelectedSlotDetail[] = [];
            (editingRequest.preferredSlots || []).forEach((ps) => {
                if (ps.jpStart && ps.jpEnd) {
                    for (let j = ps.jpStart; j <= ps.jpEnd; j++) {
                        parsedSlots.push({
                            day: ps.day,
                            jp: j,
                            timeRange: ps.timeRange || '',
                        });
                    }
                } else {
                    // Coba ekstrak angka jam dari label e.g. "Jam ke 1-3" atau "Jam ke 1"
                    const match = ps.jam.match(/\d+/g);
                    if (match && match.length >= 2) {
                        const start = Number(match[0]);
                        const end = Number(match[1]);
                        for (let j = start; j <= end; j++) {
                            parsedSlots.push({ day: ps.day, jp: j, timeRange: ps.timeRange || '' });
                        }
                    } else if (match && match.length === 1) {
                        parsedSlots.push({ day: ps.day, jp: Number(match[0]), timeRange: ps.timeRange || '' });
                    }
                }
            });

            setSelectedSlots(parsedSlots);
            setNotes(editingRequest.notes || '');
            setValidationError(null);
        } else {
            // New request initial state
            const initialTeacher = teachers[0];
            if (initialTeacher) {
                setSelectedTeacherCode(initialTeacher.code);
                const firstSubj = initialTeacher.subjects?.[0];
                setSelectedSubjectCode(firstSubj?.subjectCode || '');
                setCustomSubjectName(firstSubj?.subjectName || initialTeacher.subjectName);
            }
            setSelectedSlots([]);
            setNotes('');
            setValidationError(null);
        }
    }, [editingRequest, teachers, isRequestDialogOpen]);

    const handleTeacherChange = (code: number) => {
        setSelectedTeacherCode(code);
        const t = teachers.find((item) => item.code === code);
        if (t && t.subjects && t.subjects.length > 0) {
            setSelectedSubjectCode(t.subjects[0].subjectCode);
            setCustomSubjectName(t.subjects[0].subjectName);
        }
        setSelectedSlots([]);
    };

    const handleSubjectChange = (subjectCode: string) => {
        setSelectedSubjectCode(subjectCode);
        const subj = teacherSubjects.find((s) => s.subjectCode === subjectCode);
        if (subj) {
            setCustomSubjectName(subj.subjectName);
        }
    };

    // Toggle kotak slot hijau: [1], [2], [3]
    const handleToggleSlot = (day: DayName, jp: number, timeRange: string) => {
        const isAlreadySelected = selectedSlots.some((s) => s.day === day && s.jp === jp);

        if (isAlreadySelected) {
            setSelectedSlots((prev) => prev.filter((s) => !(s.day === day && s.jp === jp)));
        } else {
            if (selectedSlots.length >= targetJp) {
                snackbar.info(
                    `Perhatian: Target JP untuk mapel ini adalah ${targetJp} JP (${selectedSlots.length} slot sudah dipilih).`
                );
            }
            setSelectedSlots((prev) => [...prev, { day, jp, timeRange }]);
        }
    };

    // Susun PreferredScheduleSlot[] dari selectedSlots
    const buildPreferredSlots = (): PreferredScheduleSlot[] => {
        const slotsByDay: Record<string, SelectedSlotDetail[]> = {};
        selectedSlots.forEach((s) => {
            if (!slotsByDay[s.day]) slotsByDay[s.day] = [];
            slotsByDay[s.day].push(s);
        });

        const result: PreferredScheduleSlot[] = [];

        Object.entries(slotsByDay).forEach(([dayStr, list]) => {
            const day = dayStr as DayName;
            const sorted = [...list].sort((a, b) => a.jp - b.jp);
            if (sorted.length === 0) return;

            const jpNumbers = sorted.map((s) => s.jp);
            const firstSlot = sorted[0];
            const lastSlot = sorted[sorted.length - 1];

            const startTime = firstSlot.timeRange.split(' - ')[0] || '07:00';
            const endTime = lastSlot.timeRange.split(' - ')[1] || '08:30';
            const combinedTimeRange = `${startTime} - ${endTime}`;

            // Cek apakah JP berurutan (misal 1, 2, 3 -> Jam ke 1-3)
            const isContiguous =
                jpNumbers.length > 1 &&
                jpNumbers.every((val, idx) => idx === 0 || val === jpNumbers[idx - 1] + 1);

            let jamLabel = '';
            if (isContiguous) {
                jamLabel = `Jam ke ${jpNumbers[0]}-${jpNumbers[jpNumbers.length - 1]} (${combinedTimeRange})`;
            } else if (jpNumbers.length === 1) {
                jamLabel = `Jam ke ${jpNumbers[0]} (${firstSlot.timeRange || combinedTimeRange})`;
            } else {
                jamLabel = `Jam ke ${jpNumbers.join(', ')} (${combinedTimeRange})`;
            }

            result.push({
                day,
                jam: jamLabel,
                timeRange: combinedTimeRange,
                jpStart: jpNumbers[0],
                jpEnd: jpNumbers[jpNumbers.length - 1],
            });
        });

        return result;
    };

    const handleSave = async () => {
        if (selectedSlots.length === 0) {
            setValidationError('Silakan pilih minimal 1 slot jam mengajar!');
            return;
        }

        const preferredSlots = buildPreferredSlots();

        // Validasi collision dengan request lain
        const validation = validateTeacherRequest(selectedTeacherCode, preferredSlots);
        if (!validation.isValid) {
            setValidationError(
                validation.conflictReason || 'Terdeteksi bentrok jadwal dengan request pengajar lain'
            );
            return;
        }

        const finalSubjectName = activeSubject
            ? `${activeSubject.subjectName} (${activeSubject.subjectCode})`
            : customSubjectName || selectedTeacher?.subjectName || 'Mata Pelajaran';

        const payload = {
            teacherCode: selectedTeacherCode,
            teacherName: selectedTeacher?.name || 'Guru',
            subjectName: finalSubjectName,
            preferredSlots,
            status: 'VALID',
            statusText: '✓ Tersedia & Bebas Bentrok',
            conflictReason: null,
            notes,
        };

        if (editingRequest) {
            await updateTeacherRequest(editingRequest.id, payload);
        } else {
            await createTeacherRequest(payload);
        }

        setIsRequestDialogOpen(false);
    };

    const isSlotSelected = (day: DayName, jp: number) => {
        return selectedSlots.some((s) => s.day === day && s.jp === jp);
    };

    return (
        <Dialog
            open={isRequestDialogOpen}
            onClose={() => setIsRequestDialogOpen(false)}
            maxWidth="md"
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: 3.5,
                        overflow: 'hidden',
                    },
                },
            }}
        >
            <DialogTitle
                sx={{
                    p: 2.5,
                    bgcolor: '#f8fafc',
                    borderBottom: '1px solid #e2e8f0',
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
                            bgcolor: '#ede9fe',
                            color: '#4f46e5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <EventAvailableIcon fontSize="small" />
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '17px' }}>
                            {editingRequest ? 'Edit Request Jadwal Pengajar' : 'Input Request Jadwal Pengajar Baru'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                            Data guru & mapel sinkron dengan Pengajaran • Slot disesuaikan dengan Roster Jam Belajar
                        </Typography>
                    </Box>
                </Stack>
                <IconButton size="small" onClick={() => setIsRequestDialogOpen(false)}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 3 }}>
                <Stack spacing={2.5}>
                    {validationError && (
                        <Alert severity="warning" onClose={() => setValidationError(null)}>
                            {validationError}
                        </Alert>
                    )}

                    {/* Section 1: Pemilihan Guru & Mapel Riil dari Database */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                        {/* Teacher Selector */}
                        <FormControl fullWidth size="small">
                            <InputLabel id="select-teacher-label">Pilih Guru Pengajar</InputLabel>
                            <Select
                                labelId="select-teacher-label"
                                value={selectedTeacherCode}
                                label="Pilih Guru Pengajar"
                                onChange={(e) => handleTeacherChange(Number(e.target.value))}
                            >
                                {teachers.map((t) => (
                                    <MenuItem key={t.code} value={t.code}>
                                        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                                            <Chip
                                                label={`#${t.code}`}
                                                size="small"
                                                sx={{
                                                    fontWeight: 800,
                                                    bgcolor: '#e0e7ff',
                                                    color: '#3730a3',
                                                    height: 22,
                                                    fontSize: '11px',
                                                }}
                                            />
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                {t.name}
                                            </Typography>
                                            {t.niy && (
                                                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                                    (NIY: {t.niy})
                                                </Typography>
                                            )}
                                        </Stack>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Subject Selector dari Penugasan Pengajaran */}
                        {teacherSubjects.length > 0 ? (
                            <FormControl fullWidth size="small">
                                <InputLabel id="select-subject-label">Mata Pelajaran (Pengajaran)</InputLabel>
                                <Select
                                    labelId="select-subject-label"
                                    value={selectedSubjectCode}
                                    label="Mata Pelajaran (Pengajaran)"
                                    onChange={(e) => handleSubjectChange(e.target.value)}
                                >
                                    {teacherSubjects.map((s) => (
                                        <MenuItem key={s.subjectCode} value={s.subjectCode}>
                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                sx={{ alignItems: 'center', width: '100%', justifyContent: 'space-between' }}
                                            >
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {s.subjectName} ({s.subjectCode})
                                                </Typography>
                                                <Chip
                                                    size="small"
                                                    label={`${s.targetJp || 4} JP`}
                                                    sx={{
                                                        height: 20,
                                                        fontSize: '10px',
                                                        fontWeight: 700,
                                                        bgcolor: '#f1f5f9',
                                                        color: '#475569',
                                                    }}
                                                />
                                            </Stack>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        ) : (
                            <TextField
                                size="small"
                                fullWidth
                                label="Mata Pelajaran"
                                value={customSubjectName}
                                onChange={(e) => setCustomSubjectName(e.target.value)}
                            />
                        )}
                    </Box>

                    {/* Section 2: Banner Status Pemenuhan JP */}
                    <Box
                        sx={{
                            p: 1.75,
                            borderRadius: 2.5,
                            bgcolor:
                                selectedSlots.length === targetJp
                                    ? '#f0fdf4'
                                    : selectedSlots.length > targetJp
                                    ? '#fffbeb'
                                    : '#f8fafc',
                            border: '1px solid',
                            borderColor:
                                selectedSlots.length === targetJp
                                    ? '#bbf7d0'
                                    : selectedSlots.length > targetJp
                                    ? '#fde68a'
                                    : '#e2e8f0',
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 1.5,
                        }}
                    >
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                            <InfoOutlinedIcon
                                sx={{
                                    fontSize: 20,
                                    color: selectedSlots.length === targetJp ? '#16a34a' : '#64748b',
                                }}
                            />
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                                Target Mata Pelajaran: {targetJp} JP/Minggu
                            </Typography>
                        </Stack>

                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                            <Chip
                                size="small"
                                label={`${selectedSlots.length} / ${targetJp} Slot Dipilih`}
                                sx={{
                                    fontWeight: 800,
                                    fontSize: '12px',
                                    bgcolor:
                                        selectedSlots.length === targetJp
                                            ? '#16a34a'
                                            : selectedSlots.length > targetJp
                                            ? '#d97706'
                                            : '#3b82f6',
                                    color: '#ffffff',
                                }}
                            />
                            {selectedSlots.length === targetJp && (
                                <Chip
                                    size="small"
                                    icon={<CheckCircleOutlineIcon sx={{ color: '#15803d !important', fontSize: '14px' }} />}
                                    label="✓ Terpenuhi Pas"
                                    sx={{ bgcolor: '#dcfce7', color: '#15803d', fontWeight: 700 }}
                                />
                            )}
                            {selectedSlots.length > targetJp && (
                                <Chip
                                    size="small"
                                    icon={<WarningAmberIcon sx={{ color: '#b45309 !important', fontSize: '14px' }} />}
                                    label={`Lebih ${selectedSlots.length - targetJp} Slot`}
                                    sx={{ bgcolor: '#fef3c7', color: '#b45309', fontWeight: 700 }}
                                />
                            )}
                        </Stack>
                    </Box>

                    {/* Section 3: PILIH JAM DENGAN KOTAK HIJAU [1], [2], [3] BERDASARKAN ROSTER JAM (TANPA SELECT HARI) */}
                    <Box
                        sx={{
                            p: 2.5,
                            bgcolor: '#f8fafc',
                            borderRadius: 3,
                            border: '1px solid #e2e8f0',
                        }}
                    >
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>
                                Preferensi Jam Belajar (Klik Kotak Hijau untuk Memilih)
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                                Kotak nomor [1], [2], [3] merepresentasikan Jam Ke- (KBM) yang terdaftar pada Roster Jam Belajar.
                            </Typography>
                        </Box>

                        <Stack spacing={1.75}>
                            {DAYS.map((day) => {
                                const kbmSlots = getKbmSlotsForDay(day);
                                const selectedInDay = selectedSlots.filter((s) => s.day === day);

                                return (
                                    <Box
                                        key={day}
                                        sx={{
                                            p: 1.5,
                                            px: 2,
                                            bgcolor: '#ffffff',
                                            borderRadius: 2.5,
                                            border: '1px solid',
                                            borderColor: selectedInDay.length > 0 ? '#bbf7d0' : '#e2e8f0',
                                            display: 'flex',
                                            flexDirection: { xs: 'column', sm: 'row' },
                                            alignItems: { xs: 'flex-start', sm: 'center' },
                                            justifyContent: 'space-between',
                                            gap: 1.5,
                                            transition: 'all 0.15s ease',
                                        }}
                                    >
                                        {/* Label Hari & Slot Info */}
                                        <Box sx={{ minWidth: 140 }}>
                                            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                                                <Typography
                                                    variant="subtitle2"
                                                    sx={{
                                                        fontWeight: 800,
                                                        color: selectedInDay.length > 0 ? '#15803d' : '#1e293b',
                                                        letterSpacing: 0.5,
                                                    }}
                                                >
                                                    {day.toUpperCase()}
                                                </Typography>
                                                {selectedInDay.length > 0 && (
                                                    <Chip
                                                        size="small"
                                                        label={`${selectedInDay.length} JP`}
                                                        sx={{
                                                            height: 18,
                                                            fontSize: '10px',
                                                            fontWeight: 800,
                                                            bgcolor: '#dcfce7',
                                                            color: '#15803d',
                                                        }}
                                                    />
                                                )}
                                            </Stack>
                                            <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '11px' }}>
                                                {kbmSlots.length > 0
                                                    ? `${kbmSlots.length} slot KBM tersedia`
                                                    : 'Tidak ada KBM di roster'}
                                            </Typography>
                                        </Box>

                                        {/* Tombol Cekbox Kotak Hijau [1], [2], [3]... Berdasarkan Roster */}
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
                                            {kbmSlots.length > 0 ? (
                                                kbmSlots.map((slot) => {
                                                    const isChecked = isSlotSelected(day, slot.jp);

                                                    return (
                                                        <Tooltip
                                                            key={`${day}-${slot.jp}`}
                                                            title={`Jam Ke-${slot.jp} (${slot.timeRange})`}
                                                            arrow
                                                        >
                                                            <Button
                                                                variant={isChecked ? 'contained' : 'outlined'}
                                                                onClick={() => handleToggleSlot(day, slot.jp, slot.timeRange)}
                                                                sx={{
                                                                    minWidth: 46,
                                                                    width: 46,
                                                                    height: 42,
                                                                    p: 0,
                                                                    borderRadius: '8px',
                                                                    fontWeight: 900,
                                                                    fontSize: '15px',
                                                                    fontFamily: 'monospace',
                                                                    bgcolor: isChecked ? '#16a34a' : '#f8fafc',
                                                                    color: isChecked ? '#ffffff' : '#475569',
                                                                    borderColor: isChecked ? '#15803d' : '#cbd5e1',
                                                                    borderWidth: isChecked ? '2px' : '1px',
                                                                    boxShadow: isChecked
                                                                        ? '0 3px 6px rgba(22, 163, 74, 0.35)'
                                                                        : 'none',
                                                                    transition: 'all 0.15s ease-in-out',
                                                                    '&:hover': {
                                                                        bgcolor: isChecked ? '#15803d' : '#e2e8f0',
                                                                        borderColor: isChecked ? '#166534' : '#94a3b8',
                                                                        transform: 'translateY(-1px)',
                                                                    },
                                                                }}
                                                            >
                                                                [{slot.jp}]
                                                            </Button>
                                                        </Tooltip>
                                                    );
                                                })
                                            ) : (
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        color: '#94a3b8',
                                                        fontStyle: 'italic',
                                                        py: 0.5,
                                                    }}
                                                >
                                                    Belum ada slot KBM pada hari ini di Roster Jam Belajar
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Stack>
                    </Box>

                    {/* Catatan Khusus */}
                    <TextField
                        size="small"
                        fullWidth
                        multiline
                        rows={2}
                        label="Catatan Khusus (Opsional)"
                        placeholder="Contoh: Menggunakan Lab Komputer / Penyesuaian jam dinas"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 2.5, bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                <Button
                    onClick={() => setIsRequestDialogOpen(false)}
                    variant="outlined"
                    sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
                >
                    Batal
                </Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    disabled={isLoadingRequests}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 700,
                        borderRadius: 2,
                        bgcolor: '#4f46e5',
                        '&:hover': { bgcolor: '#4338ca' },
                        px: 3,
                    }}
                >
                    Simpan Request Jadwal
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default InputScheduleRequestDialog;
