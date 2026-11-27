import React, { useMemo, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Card,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlined';
import ClassIcon from '@mui/icons-material/Class';
import SchoolIcon from '@mui/icons-material/School';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useScheduleStore } from '../store/useScheduleStore';
import { useSchedulePermissions } from '../utils/permissions';
import type { DayName, ScheduleCell, ScheduleRow } from '../types';

const DAYS: DayName[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

const PerClassScheduleView: React.FC = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const { canEditSchedule } = useSchedulePermissions();

    const {
        rows,
        classes,
        teachers,
        teachingStaff,
        conflicts,
        selectedClassForInput,
        setSelectedClassForInput,
        selectedDayFilter,
        setSelectedDayFilter,
        setCellTeacher,
        setBatchCellTeacher,
        draggedItem,
        setDraggedItem,
    } = useScheduleStore();

    // Dialog state for editing a slot
    const [selectedSlot, setSelectedSlot] = useState<{
        rowId: string;
        day: DayName;
        jp: number | string;
        timeRange: string;
        currentCell: ScheduleCell;
    } | null>(null);

    const [selectedTeacherCode, setSelectedTeacherCode] = useState<number | ''>('');
    const [consecutiveJpCount, setConsecutiveJpCount] = useState<number>(1);
    const [filterSearch, setFilterSearch] = useState('');

    // Active selected class object
    const currentClassObj = useMemo(() => {
        return (
            classes.find((c) => c.name === selectedClassForInput) ||
            classes[0] || {
                id: '1',
                name: selectedClassForInput || 'X AKL',
                grade: 'X',
                major: 'AKL',
            }
        );
    }, [classes, selectedClassForInput]);

    // Rows for this class, optionally filtered by day
    const classRows = useMemo(() => {
        return rows.filter((r) => {
            if (selectedDayFilter === 'Semua') return true;
            return r.day === selectedDayFilter;
        });
    }, [rows, selectedDayFilter]);

    // Teaching staff specifically assigned to this class from DB (TeachingService)
    const assignedDbTeachers = useMemo(() => {
        const results: Array<{
            teacherId: string;
            teacherName: string;
            subjectName: string;
            codeSubject: string;
            jpAmount: number;
            matchedTeacherCode?: number;
        }> = [];

        teachingStaff.forEach((staff) => {
            const fullName = `${staff.first_name || ''} ${staff.last_name || ''}`.trim();
            staff.subjects.forEach((subj) => {
                const isAssignedToThisClass = subj.classes.some((c) => {
                    const cName = (c.class_name || '').toLowerCase();
                    const targetName = selectedClassForInput.toLowerCase();
                    return (
                        cName === targetName ||
                        targetName.includes(cName) ||
                        cName.includes(targetName)
                    );
                });

                if (isAssignedToThisClass) {
                    const matched = teachers.find(
                        (t) =>
                            t.name.toLowerCase() === fullName.toLowerCase() ||
                            t.subjectName.toLowerCase() === (subj.subject_name || '').toLowerCase()
                    );

                    results.push({
                        teacherId: staff.id_teacher,
                        teacherName: fullName,
                        subjectName: subj.subject_name || 'Mata Pelajaran',
                        codeSubject: subj.code_subject || '',
                        jpAmount: subj.jp_amount || 0,
                        matchedTeacherCode: matched?.code,
                    });
                }
            });
        });

        return results;
    }, [teachingStaff, selectedClassForInput, teachers]);

    // KPI statistics for this selected class
    const kpiStats = useMemo(() => {
        let totalJpAllocated = 0;
        const uniqueTeacherCodes = new Set<number>();
        const classConflicts: string[] = [];

        rows.forEach((row) => {
            if (row.specialActivity) return;
            const cell = row.classCells[selectedClassForInput];
            if (cell && cell.teacherCode) {
                totalJpAllocated += 1;
                uniqueTeacherCodes.add(cell.teacherCode);

                const hasClash = conflicts.some(
                    (c) =>
                        c.day === row.day &&
                        c.jp === row.jp &&
                        c.teacherCode === cell.teacherCode
                );
                if (hasClash) {
                    classConflicts.push(
                        `${row.day} JP ${row.jp} (${cell.teacherName || `Guru #${cell.teacherCode}`})`
                    );
                }
            }
        });

        return {
            totalJpAllocated,
            uniqueTeacherCount: uniqueTeacherCodes.size,
            clashCount: classConflicts.length,
            clashDetails: classConflicts,
        };
    }, [rows, selectedClassForInput, conflicts]);

    // Teacher breakdown for this class (how many JP scheduled vs target)
    const classTeacherSummary = useMemo(() => {
        const usageMap: Record<number, number> = {};

        rows.forEach((row) => {
            if (row.specialActivity) return;
            const cell = row.classCells[selectedClassForInput];
            if (cell && cell.teacherCode) {
                usageMap[cell.teacherCode] = (usageMap[cell.teacherCode] || 0) + 1;
            }
        });

        return Object.entries(usageMap).map(([codeStr, count]) => {
            const code = Number(codeStr);
            const teacher = teachers.find((t) => t.code === code);
            const dbAssigned = assignedDbTeachers.find((d) => d.matchedTeacherCode === code);

            return {
                code,
                name: teacher?.name || `Guru #${code}`,
                subjectName: teacher?.subjectName || 'Mata Pelajaran',
                category: teacher?.category || 'KEJURUAN',
                color: teacher?.color || '#2563eb',
                scheduledJp: count,
                targetJp: dbAssigned?.jpAmount || teacher?.targetJp || 4,
            };
        });
    }, [rows, selectedClassForInput, teachers, assignedDbTeachers]);

    // Open slot editor
    const handleOpenSlotEditor = (row: ScheduleRow) => {
        if (!canEditSchedule) return;
        if (row.specialActivity) return; // Special activity (Upacara/Senam/Istirahat) cannot be overridden per class

        const cell = row.classCells[selectedClassForInput] || { teacherCode: null };
        setSelectedSlot({
            rowId: row.id,
            day: row.day,
            jp: row.jp,
            timeRange: row.timeRange,
            currentCell: cell,
        });
        setSelectedTeacherCode(cell.teacherCode || '');
        setConsecutiveJpCount(1);
    };

    // Save slot edit
    const handleSaveSlot = () => {
        if (!selectedSlot) return;

        const codeVal = selectedTeacherCode === '' ? null : Number(selectedTeacherCode);

        if (consecutiveJpCount <= 1 || !codeVal) {
            setCellTeacher(selectedSlot.rowId, selectedClassForInput, codeVal);
        } else {
            // Consecutive slots: find the next rows on the same day that are not special activities
            const sameDayRows = rows.filter((r) => r.day === selectedSlot.day && !r.specialActivity);
            const startIdx = sameDayRows.findIndex((r) => r.id === selectedSlot.rowId);

            if (startIdx >= 0) {
                const targetRowIds: string[] = [];
                for (let i = startIdx; i < Math.min(startIdx + consecutiveJpCount, sameDayRows.length); i++) {
                    targetRowIds.push(sameDayRows[i].id);
                }
                setBatchCellTeacher(targetRowIds, selectedClassForInput, codeVal);
            } else {
                setCellTeacher(selectedSlot.rowId, selectedClassForInput, codeVal);
            }
        }

        setSelectedSlot(null);
    };

    // Quick clear slot
    const handleClearSlot = (rowId: string) => {
        setCellTeacher(rowId, selectedClassForInput, null);
    };

    // Drag and Drop handlers
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };

    const handleDrop = (e: React.DragEvent, row: ScheduleRow) => {
        e.preventDefault();
        if (row.specialActivity) return;

        if (draggedItem && draggedItem.type === 'TEACHER_ITEM' && draggedItem.teacherCode) {
            setCellTeacher(row.id, selectedClassForInput, draggedItem.teacherCode);
            setDraggedItem(null);
        }
    };

    // Filter teachers for dialog list
    const filteredTeachersList = useMemo(() => {
        if (!filterSearch.trim()) return teachers;
        const q = filterSearch.toLowerCase();
        return teachers.filter(
            (t) =>
                t.name.toLowerCase().includes(q) ||
                t.subjectName.toLowerCase().includes(q) ||
                String(t.code).includes(q)
        );
    }, [teachers, filterSearch]);

    return (
        <Box sx={{ mb: 4 }}>
            {/* Top Class Selection & Quick Stats Bar */}
            <Card
                elevation={0}
                sx={{
                    p: { xs: 2.5, md: 3 },
                    mb: 3,
                    bgcolor: isDark ? '#141416' : '#ffffff',
                    borderRadius: 3,
                    border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
                    boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.5)' : '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        justifyContent: 'space-between',
                        alignItems: { xs: 'flex-start', md: 'center' },
                        gap: 2,
                        pb: 2.5,
                        borderBottom: isDark ? '1px solid #27272a' : '1px solid #f1f5f9',
                    }}
                >
                    <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                        <Box
                            sx={{
                                width: 44,
                                height: 44,
                                borderRadius: 2.5,
                                bgcolor: '#eff6ff',
                                color: '#2563eb',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <ClassIcon fontSize="medium" />
                        </Box>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
                                Input Jadwal Khusus Rombel: {selectedClassForInput}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748b' }}>
                                Tingkat {currentClassObj.grade} • Jurusan {currentClassObj.major || 'Semua'}
                            </Typography>
                        </Box>
                    </Stack>

                    {/* Class Selector Dropdown */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                        <FormControl size="small" sx={{ minWidth: 220 }}>
                            <InputLabel id="class-select-label">Pilih Kelas / Rombel</InputLabel>
                            <Select
                                labelId="class-select-label"
                                value={selectedClassForInput}
                                label="Pilih Kelas / Rombel"
                                onChange={(e) => setSelectedClassForInput(e.target.value)}
                            >
                                {classes.map((cls) => (
                                    <MenuItem key={cls.id || cls.name} value={cls.name}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                                            <Chip
                                                label={cls.grade}
                                                size="small"
                                                sx={{
                                                    height: 20,
                                                    fontSize: '10px',
                                                    fontWeight: 700,
                                                    bgcolor:
                                                        cls.grade === 'X'
                                                            ? '#dbeafe'
                                                            : cls.grade === 'XI'
                                                            ? '#fef3c7'
                                                            : '#fce7f3',
                                                    color:
                                                        cls.grade === 'X'
                                                            ? '#1d4ed8'
                                                            : cls.grade === 'XI'
                                                            ? '#b45309'
                                                            : '#be185d',
                                                }}
                                            />
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                {cls.name}
                                            </Typography>
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Day Filter */}
                        <FormControl size="small" sx={{ minWidth: 160 }}>
                            <InputLabel id="day-class-filter-label">Filter Hari</InputLabel>
                            <Select
                                labelId="day-class-filter-label"
                                value={selectedDayFilter}
                                label="Filter Hari"
                                onChange={(e) => setSelectedDayFilter(e.target.value as any)}
                            >
                                <MenuItem value="Semua">Semua Hari</MenuItem>
                                {DAYS.map((d) => (
                                    <MenuItem key={d} value={d}>
                                        Hari {d}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Box>

                {/* KPI Cards for Selected Class */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
                        gap: 2,
                        pt: 2.5,
                    }}
                >
                    <Box
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: isDark ? '#1e1e24' : '#f8fafc',
                            border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
                        }}
                    >
                        <Typography variant="caption" sx={{ color: isDark ? '#a1a1aa' : '#64748b', fontWeight: 600 }}>
                            TOTAL JP KBM TERJADWAL
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: isDark ? '#f4f4f5' : '#0f172a', mt: 0.5 }}>
                            {kpiStats.totalJpAllocated} <span style={{ fontSize: '14px', fontWeight: 500, color: isDark ? '#a1a1aa' : '#64748b' }}>/ 48 JP</span>
                        </Typography>
                        <Typography variant="caption" sx={{ color: isDark ? '#4ade80' : '#16a34a', fontWeight: 600 }}>
                            Target Pekan: 48 Jam Pelajaran
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: isDark ? '#1e1e24' : '#f8fafc',
                            border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
                        }}
                    >
                        <Typography variant="caption" sx={{ color: isDark ? '#a1a1aa' : '#64748b', fontWeight: 600 }}>
                            GURU PENGAJAR DI KELAS INI
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: isDark ? '#f4f4f5' : '#0f172a', mt: 0.5 }}>
                            {kpiStats.uniqueTeacherCount} Guru
                        </Typography>
                        <Typography variant="caption" sx={{ color: isDark ? '#a1a1aa' : '#64748b' }}>
                            {assignedDbTeachers.length > 0
                                ? `${assignedDbTeachers.length} mapel terdaftar di database`
                                : 'Terjadwal di rombel ini'}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: kpiStats.clashCount === 0
                                ? (isDark ? 'rgba(22, 101, 52, 0.2)' : '#f0fdf4')
                                : (isDark ? 'rgba(239, 68, 68, 0.2)' : '#fef2f2'),
                            border: `1px solid ${
                                kpiStats.clashCount === 0
                                    ? (isDark ? 'rgba(22, 101, 52, 0.4)' : '#bbf7d0')
                                    : (isDark ? 'rgba(239, 68, 68, 0.4)' : '#fecaca')
                            }`,
                        }}
                    >
                        <Typography
                            variant="caption"
                            sx={{
                                color: kpiStats.clashCount === 0
                                    ? (isDark ? '#4ade80' : '#166534')
                                    : (isDark ? '#f87171' : '#991b1b'),
                                fontWeight: 600,
                            }}
                        >
                            STATUS BENTROK JAM
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            {kpiStats.clashCount === 0 ? (
                                <>
                                    <CheckCircleOutlineIcon sx={{ color: isDark ? '#4ade80' : '#16a34a' }} />
                                    <Typography variant="h6" sx={{ fontWeight: 800, color: isDark ? '#4ade80' : '#166534' }}>
                                        0 Bentrok
                                    </Typography>
                                </>
                            ) : (
                                <>
                                    <ErrorOutlineIcon sx={{ color: isDark ? '#f87171' : '#dc2626' }} />
                                    <Typography variant="h6" sx={{ fontWeight: 800, color: isDark ? '#f87171' : '#991b1b' }}>
                                        {kpiStats.clashCount} Bentrok!
                                    </Typography>
                                </>
                            )}
                        </Box>
                        <Typography variant="caption" sx={{ color: isDark ? '#a1a1aa' : '#64748b' }}>
                            {kpiStats.clashCount === 0 ? 'Semua slot aman' : 'Cek slot merah di bawah'}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: isDark ? 'rgba(37, 99, 235, 0.15)' : '#eff6ff',
                            border: isDark ? '1px solid rgba(37, 99, 235, 0.3)' : '1px solid #bfdbfe',
                        }}
                    >
                        <Typography variant="caption" sx={{ color: isDark ? '#93c5fd' : '#1e40af', fontWeight: 600 }}>
                            REKOMENDASI PEDAGOGIK JP
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: isDark ? '#bfdbfe' : '#1e3a8a', mt: 0.5 }}>
                            💡 Praktik: JP 6-8 (Siang)
                        </Typography>
                        <Typography variant="caption" sx={{ color: isDark ? '#60a5fa' : '#3b82f6' }}>
                            Teori/Eksak: JP 1-3 (Pagi Segar)
                        </Typography>
                    </Box>
                </Box>
            </Card>

            {/* Clash Alert banner if any */}
            {kpiStats.clashCount > 0 && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                    <b>Perhatian: Terdeteksi {kpiStats.clashCount} slot bentrok pada kelas {selectedClassForInput}!</b>
                    <br />
                    Guru pada slot tersebut sedang mengajar di kelas lain pada waktu yang sama:{' '}
                    {kpiStats.clashDetails.join(', ')}
                </Alert>
            )}

            {/* Main Timetable Table for Selected Class */}
            <Card
                elevation={0}
                sx={{
                    borderRadius: 3,
                    border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
                    boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.5)' : '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
                    overflow: 'hidden',
                    mb: 3,
                    bgcolor: isDark ? '#141416' : '#ffffff',
                }}
            >
                <Box
                    sx={{
                        p: 2,
                        bgcolor: isDark ? '#18181b' : '#f8fafc',
                        borderBottom: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <SchoolIcon sx={{ color: isDark ? '#60a5fa' : '#2563eb' }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: isDark ? '#f4f4f5' : '#0f172a' }}>
                            Jadwal Pembelajaran Kelas {selectedClassForInput}
                        </Typography>
                        <Chip
                            label={`${classRows.length} Slot Waktu`}
                            size="small"
                            sx={{ fontWeight: 700, bgcolor: isDark ? '#27272a' : '#e2e8f0', color: isDark ? '#e4e4e7' : '#0f172a' }}
                        />
                    </Box>
                    <Typography variant="caption" sx={{ color: isDark ? '#a1a1aa' : '#64748b' }}>
                        Klik tombol <b>Edit (✏️)</b> pada slot atau drag kartu guru ke baris untuk mengisi jam pelajaran.
                    </Typography>
                </Box>

                <TableContainer component={Paper} elevation={0} sx={{ bgcolor: isDark ? '#141416' : '#ffffff' }}>
                    <Table size="small">
                        <TableHead sx={{ bgcolor: isDark ? '#18181b' : '#f8fafc' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 800, color: isDark ? '#cbd5e1' : '#334155', borderBottom: isDark ? '1px solid #27272a' : undefined }}>HARI</TableCell>
                                <TableCell sx={{ fontWeight: 800, color: isDark ? '#cbd5e1' : '#334155', borderBottom: isDark ? '1px solid #27272a' : undefined }}>JAM KE</TableCell>
                                <TableCell sx={{ fontWeight: 800, color: isDark ? '#cbd5e1' : '#334155', borderBottom: isDark ? '1px solid #27272a' : undefined }}>WAKTU</TableCell>
                                <TableCell sx={{ fontWeight: 800, color: isDark ? '#cbd5e1' : '#334155', borderBottom: isDark ? '1px solid #27272a' : undefined }}>GURU & MATA PELAJARAN</TableCell>
                                <TableCell sx={{ fontWeight: 800, color: isDark ? '#cbd5e1' : '#334155', borderBottom: isDark ? '1px solid #27272a' : undefined, textAlign: 'center', width: 110 }}>AKSI</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#0f172a' }}>
                                <TableCell sx={{ color: '#ffffff', fontWeight: 800, width: 90, textAlign: 'center' }}>
                                    HARI
                                </TableCell>
                                <TableCell sx={{ color: '#ffffff', fontWeight: 800, width: 80, textAlign: 'center' }}>
                                    JAM KE
                                </TableCell>
                                <TableCell sx={{ color: '#ffffff', fontWeight: 800, width: 130, textAlign: 'center' }}>
                                    WAKTU
                                </TableCell>
                                <TableCell sx={{ color: '#ffffff', fontWeight: 800, minWidth: 260 }}>
                                    GURU PENGAJAR & MATA PELAJARAN
                                </TableCell>
                                <TableCell sx={{ color: '#ffffff', fontWeight: 800, width: 140, textAlign: 'center' }}>
                                    KATEGORI
                                </TableCell>
                                <TableCell sx={{ color: '#ffffff', fontWeight: 800, minWidth: 200 }}>
                                    REKOMENDASI JP
                                </TableCell>
                                <TableCell sx={{ color: '#ffffff', fontWeight: 800, width: 110, textAlign: 'center' }}>
                                    STATUS
                                </TableCell>
                                {canEditSchedule && (
                                    <TableCell sx={{ color: '#ffffff', fontWeight: 800, width: 120, textAlign: 'center' }}>
                                        AKSI
                                    </TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {classRows.map((row) => {
                                const cell = row.classCells[selectedClassForInput] || { teacherCode: null };
                                const teacher = teachers.find((t) => t.code === cell.teacherCode);
                                const isSpecial = Boolean(row.specialActivity);

                                // Clash check
                                const isClashing =
                                    !isSpecial &&
                                    cell.teacherCode &&
                                    conflicts.some(
                                        (c) =>
                                            c.day === row.day &&
                                            c.jp === row.jp &&
                                            c.teacherCode === cell.teacherCode
                                    );

                                return (
                                    <TableRow
                                        key={row.id}
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => canEditSchedule && handleDrop(e, row)}
                                        sx={{
                                            bgcolor: isSpecial
                                                ? (isDark ? 'rgba(234, 179, 8, 0.15)' : row.specialActivity?.colorScheme.bg)
                                                : isClashing
                                                ? (isDark ? 'rgba(239, 68, 68, 0.25)' : '#fef2f2')
                                                : (isDark ? '#141416' : '#ffffff'),
                                            '&:hover': {
                                                bgcolor: isSpecial
                                                    ? (isDark ? 'rgba(234, 179, 8, 0.25)' : row.specialActivity?.colorScheme.bg)
                                                    : (isDark ? '#1e1e24' : '#f8fafc'),
                                            },
                                            borderBottom: isDark ? '1px solid #27272a' : '1px solid #f1f5f9',
                                        }}
                                    >
                                        {/* Day */}
                                        <TableCell
                                            sx={{
                                                textAlign: 'center',
                                                fontWeight: 800,
                                                color: isDark ? '#f4f4f5' : '#1e293b',
                                                bgcolor: isDark ? '#18181b' : '#f8fafc',
                                                borderRight: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
                                            }}
                                        >
                                            {row.day}
                                        </TableCell>

                                        {/* JP */}
                                        <TableCell
                                            sx={{
                                                textAlign: 'center',
                                                fontWeight: 700,
                                                color: row.jp === 0
                                                    ? (isDark ? '#c084fc' : '#6d28d9')
                                                    : (isDark ? '#f4f4f5' : '#0f172a'),
                                            }}
                                        >
                                            {row.jp === 0
                                                ? '0'
                                                : row.jp === '-'
                                                ? '-'
                                                : `JP ${row.jp}`}
                                        </TableCell>

                                        {/* Time Range */}
                                        <TableCell sx={{ textAlign: 'center', fontSize: '12px', color: isDark ? '#a1a1aa' : '#64748b', fontWeight: 600 }}>
                                            {row.timeRange}
                                        </TableCell>

                                        {/* Teacher & Subject or Special Activity */}
                                        <TableCell>
                                            {isSpecial ? (() => {
                                                const isEkstraAct = Boolean(
                                                    row.specialActivity && (
                                                        row.specialActivity.activityType.toString().includes('EKSTRA') ||
                                                        row.specialActivity.activityType === 'PRAMUKA' ||
                                                        row.specialActivity.title.toUpperCase().includes('EKSTRA')
                                                    )
                                                );
                                                const classExtraVal = isEkstraAct && selectedClassForInput
                                                    ? (row.classExtraActivities?.[selectedClassForInput] ?? (currentClassObj?.id ? row.classExtraActivities?.[currentClassObj.id] : undefined))
                                                    : undefined;
                                                const displaySubtitle = classExtraVal !== undefined
                                                    ? (classExtraVal === '' ? '- Kosong -' : classExtraVal)
                                                    : (row.specialActivity?.subtitle || 'Seluruh rombel sekolah');

                                                return (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Chip
                                                            label={row.specialActivity?.title}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: isDark ? 'rgba(234, 179, 8, 0.2)' : row.specialActivity?.colorScheme.bg,
                                                                color: isDark ? '#fde047' : row.specialActivity?.colorScheme.text,
                                                                border: `1px solid ${isDark ? '#eab308' : row.specialActivity?.colorScheme.border}`,
                                                                fontWeight: 800,
                                                                fontSize: '11px',
                                                            }}
                                                        />
                                                        <Typography
                                                            variant="caption"
                                                            sx={{
                                                                color: isDark ? '#a1a1aa' : '#64748b',
                                                                fontStyle: classExtraVal === '' ? 'italic' : 'normal',
                                                            }}
                                                        >
                                                            {displaySubtitle}
                                                        </Typography>
                                                    </Box>
                                                );
                                            })() : cell.teacherCode ? (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Box
                                                        sx={{
                                                            width: 32,
                                                            height: 32,
                                                            borderRadius: 1.5,
                                                            bgcolor: teacher?.color || '#2563eb',
                                                            color: '#ffffff',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontWeight: 800,
                                                            fontSize: '14px',
                                                            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                                        }}
                                                    >
                                                        {cell.teacherCode}
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="body2" sx={{ fontWeight: 700, color: isDark ? '#f4f4f5' : '#0f172a' }}>
                                                            {cell.teacherName || teacher?.name || `Guru #${cell.teacherCode}`}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: isDark ? '#a1a1aa' : '#64748b' }}>
                                                            {cell.subjectName || teacher?.subjectName || 'Mata Pelajaran'} • {cell.subjectCode || teacher?.subjectCode}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            ) : (
                                                <Button
                                                    size="small"
                                                    variant="text"
                                                    startIcon={<AutoAwesomeIcon sx={{ fontSize: '14px' }} />}
                                                    onClick={() => handleOpenSlotEditor(row)}
                                                    sx={{
                                                        color: isDark ? '#71717a' : '#94a3b8',
                                                        textTransform: 'none',
                                                        fontSize: '12px',
                                                        fontStyle: 'italic',
                                                        '&:hover': {
                                                            color: isDark ? '#60a5fa' : '#2563eb',
                                                            bgcolor: isDark ? 'rgba(37, 99, 235, 0.15)' : '#eff6ff',
                                                        },
                                                    }}
                                                >
                                                    + Klik untuk isi Guru & Mapel
                                                </Button>
                                            )}
                                        </TableCell>

                                        {/* Category */}
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            {isSpecial ? (
                                                <Chip
                                                    label={row.specialActivity?.activityType}
                                                    size="small"
                                                    sx={{ fontSize: '10px', height: 20, fontWeight: 700 }}
                                                />
                                            ) : cell.teacherCode ? (
                                                <Chip
                                                    label={cell.category || teacher?.category || 'UMUM'}
                                                    size="small"
                                                    sx={{
                                                        fontSize: '10px',
                                                        height: 22,
                                                        fontWeight: 700,
                                                        bgcolor:
                                                            (cell.category || teacher?.category) === 'KEJURUAN'
                                                                ? '#ffedd5'
                                                                : '#eff6ff',
                                                        color:
                                                            (cell.category || teacher?.category) === 'KEJURUAN'
                                                                ? '#c2410c'
                                                                : '#1d4ed8',
                                                        border: `1px solid ${
                                                            (cell.category || teacher?.category) === 'KEJURUAN'
                                                                ? '#fed7aa'
                                                                : '#bfdbfe'
                                                        }`,
                                                    }}
                                                />
                                            ) : (
                                                <Typography variant="caption" sx={{ color: '#cbd5e1' }}>
                                                    -
                                                </Typography>
                                            )}
                                        </TableCell>

                                        {/* Pedagogic Recommendation */}
                                        <TableCell>
                                            {!isSpecial && teacher?.recommendedJp ? (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <LightbulbOutlinedIcon
                                                        sx={{
                                                            fontSize: '14px',
                                                            color:
                                                                teacher.category === 'KEJURUAN'
                                                                    ? '#ea580c'
                                                                    : '#2563eb',
                                                        }}
                                                    />
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            color:
                                                                teacher.category === 'KEJURUAN'
                                                                    ? '#9a3412'
                                                                    : '#1e40af',
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        {teacher.recommendedJp}
                                                    </Typography>
                                                </Box>
                                            ) : (
                                                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                                    -
                                                </Typography>
                                            )}
                                        </TableCell>

                                        {/* Status */}
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            {isSpecial ? (
                                                <Chip
                                                    label="Aktivitas"
                                                    size="small"
                                                    sx={{ fontSize: '10px', height: 20, bgcolor: '#f1f5f9' }}
                                                />
                                            ) : isClashing ? (
                                                <Tooltip title="Bentrok! Guru ini mengajar di kelas lain pada slot waktu yang sama.">
                                                    <Chip
                                                        icon={<ErrorOutlineIcon sx={{ fontSize: '12px !important' }} />}
                                                        label="Bentrok!"
                                                        size="small"
                                                        color="error"
                                                        sx={{ fontWeight: 800, fontSize: '10px', height: 22 }}
                                                    />
                                                </Tooltip>
                                            ) : cell.teacherCode ? (
                                                <Chip
                                                    icon={<CheckCircleOutlineIcon sx={{ fontSize: '12px !important' }} />}
                                                    label="OK"
                                                    size="small"
                                                    color="success"
                                                    variant="outlined"
                                                    sx={{ fontWeight: 700, fontSize: '10px', height: 22 }}
                                                />
                                            ) : (
                                                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                                    Kosong
                                                </Typography>
                                            )}
                                        </TableCell>

                                        {/* Actions */}
                                        {canEditSchedule && (
                                            <TableCell sx={{ textAlign: 'center' }}>
                                                {!isSpecial && (
                                                    <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'center' }}>
                                                        <Tooltip title="Pilih / Ubah Guru & Mapel">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleOpenSlotEditor(row)}
                                                                sx={{ color: '#2563eb', '&:hover': { bgcolor: '#eff6ff' } }}
                                                            >
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>

                                                        {cell.teacherCode && (
                                                            <Tooltip title="Kosongkan Slot">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => handleClearSlot(row.id)}
                                                                    sx={{ color: '#ef4444', '&:hover': { bgcolor: '#fef2f2' } }}
                                                                >
                                                                    <DeleteOutlineIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        )}
                                                    </Stack>
                                                )}
                                            </TableCell>
                                        )}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

            {/* Bottom Summary Table: Daftar Guru Pengampu di Rombel Ini */}
            <Card
                elevation={0}
                sx={{
                    borderRadius: 3,
                    border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
                    p: 2.5,
                    bgcolor: isDark ? '#141416' : '#ffffff',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <AssignmentIcon sx={{ color: isDark ? '#818cf8' : '#4f46e5' }} />
                    <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: isDark ? '#f4f4f5' : '#0f172a' }}>
                            Rekap Guru Pengampu di Kelas {selectedClassForInput}
                        </Typography>
                        <Typography variant="caption" sx={{ color: isDark ? '#a1a1aa' : '#64748b' }}>
                            Dihitung otomatis dari slot jadwal KBM yang teralokasi di atas
                        </Typography>
                    </Box>
                </Box>

                <TableContainer component={Paper} elevation={0} sx={{ border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0', borderRadius: 2, bgcolor: isDark ? '#141416' : '#ffffff' }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ bgcolor: isDark ? '#18181b' : '#f8fafc' }}>
                                <TableCell sx={{ fontWeight: 800, width: 60, textAlign: 'center', color: isDark ? '#cbd5e1' : '#334155' }}>#KODE</TableCell>
                                <TableCell sx={{ fontWeight: 800, color: isDark ? '#cbd5e1' : '#334155' }}>NAMA GURU</TableCell>
                                <TableCell sx={{ fontWeight: 800, color: isDark ? '#cbd5e1' : '#334155' }}>MATA PELAJARAN</TableCell>
                                <TableCell sx={{ fontWeight: 800, textAlign: 'center', color: isDark ? '#cbd5e1' : '#334155' }}>KATEGORI</TableCell>
                                <TableCell sx={{ fontWeight: 800, width: 140, textAlign: 'center', color: isDark ? '#cbd5e1' : '#334155' }}>
                                    REALISASI JP
                                </TableCell>
                                <TableCell sx={{ fontWeight: 800, width: 140, textAlign: 'center', color: isDark ? '#cbd5e1' : '#334155' }}>
                                    STATUS BEBAN
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {classTeacherSummary.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} sx={{ textAlign: 'center', py: 3, color: isDark ? '#71717a' : '#94a3b8' }}>
                                        Belum ada guru yang dijadwalkan pada kelas {selectedClassForInput}. Silakan isi jadwal pada tabel di atas.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                classTeacherSummary.map((item) => (
                                    <TableRow key={item.code} sx={{ '&:hover': { bgcolor: isDark ? '#1e1e24' : '#f8fafc' }, borderBottom: isDark ? '1px solid #27272a' : undefined }}>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            <Chip
                                                label={item.code}
                                                size="small"
                                                sx={{
                                                    fontWeight: 800,
                                                    bgcolor: item.color,
                                                    color: '#ffffff',
                                                    height: 24,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: isDark ? '#f4f4f5' : '#1e293b' }}>
                                            {item.name}
                                        </TableCell>
                                        <TableCell sx={{ color: isDark ? '#a1a1aa' : '#475569' }}>
                                            {item.subjectName}
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            <Chip
                                                label={item.category}
                                                size="small"
                                                sx={{
                                                    fontSize: '10px',
                                                    height: 20,
                                                    fontWeight: 700,
                                                    bgcolor: item.category === 'KEJURUAN'
                                                        ? (isDark ? 'rgba(234, 88, 12, 0.25)' : '#ffedd5')
                                                        : (isDark ? 'rgba(37, 99, 235, 0.25)' : '#eff6ff'),
                                                    color: item.category === 'KEJURUAN'
                                                        ? (isDark ? '#fb923c' : '#c2410c')
                                                        : (isDark ? '#93c5fd' : '#1d4ed8'),
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center', fontWeight: 800, color: isDark ? '#f4f4f5' : '#0f172a' }}>
                                            {item.scheduledJp} JP
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            <Chip
                                                label={
                                                    item.scheduledJp >= item.targetJp
                                                        ? 'Lengkap'
                                                        : `Sisa ${item.targetJp - item.scheduledJp} JP`
                                                }
                                                size="small"
                                                sx={{
                                                    fontWeight: 700,
                                                    fontSize: '10px',
                                                    bgcolor: item.scheduledJp >= item.targetJp
                                                        ? (isDark ? 'rgba(22, 101, 52, 0.25)' : '#dcfce7')
                                                        : (isDark ? 'rgba(217, 119, 6, 0.25)' : '#fef3c7'),
                                                    color: item.scheduledJp >= item.targetJp
                                                        ? (isDark ? '#86efac' : '#166534')
                                                        : (isDark ? '#fcd34d' : '#b45309'),
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

            {/* Dialog Edit Slot (Pilih Guru & Mapel) */}
            <Dialog
                open={Boolean(selectedSlot)}
                onClose={() => setSelectedSlot(null)}
                maxWidth="sm"
                fullWidth
                slotProps={{
                    paper: {
                        sx: {
                            bgcolor: isDark ? '#18181b' : '#ffffff',
                            color: isDark ? '#f4f4f5' : '#0f172a',
                            border: isDark ? '1px solid #27272a' : undefined,
                            borderRadius: 3,
                        },
                    },
                }}
            >
                <DialogTitle sx={{ fontWeight: 800, bgcolor: isDark ? '#18181b' : '#f8fafc', borderBottom: isDark ? '1px solid #27272a' : '1px solid #e2e8f0' }}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <ClassIcon sx={{ color: isDark ? '#60a5fa' : '#2563eb' }} />
                        <Typography variant="h6" sx={{ fontWeight: 800, color: isDark ? '#f4f4f5' : '#0f172a' }}>
                            Pilih Guru: {selectedSlot?.day} • JP {selectedSlot?.jp} ({selectedSlot?.timeRange})
                        </Typography>
                    </Stack>
                    <Typography variant="caption" sx={{ color: isDark ? '#a1a1aa' : '#64748b' }}>
                        Kelas: <b>{selectedClassForInput}</b>
                    </Typography>
                </DialogTitle>

                <DialogContent sx={{ pt: 3 }}>
                    {/* Multi-slot consecutive JP option */}
                    <Box sx={{ mb: 2.5, p: 2, bgcolor: isDark ? '#1e1e24' : '#eff6ff', borderRadius: 2, border: isDark ? '1px solid #27272a' : '1px solid #bfdbfe' }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: isDark ? '#93c5fd' : '#1e40af', display: 'block', mb: 1 }}>
                            OPSI ALOKASI BLOK JAM PELAJARAN:
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            {[1, 2, 3, 4].map((count) => (
                                <Button
                                    key={count}
                                    size="small"
                                    variant={consecutiveJpCount === count ? 'contained' : 'outlined'}
                                    onClick={() => setConsecutiveJpCount(count)}
                                    sx={{
                                        fontWeight: 700,
                                        textTransform: 'none',
                                        fontSize: '12px',
                                        borderRadius: 1.5,
                                    }}
                                >
                                    {count === 1 ? '1 JP Saja' : `${count} JP Berurutan`}
                                </Button>
                            ))}
                        </Stack>
                    </Box>

                    {/* Section 1: Guru Ditugaskan di Kelas Ini dari Database */}
                    {assignedDbTeachers.length > 0 && (
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: isDark ? '#f4f4f5' : '#0f172a', mb: 1 }}>
                                📌 Guru Pengampu Terdaftar di Database untuk Rombel Ini:
                            </Typography>
                            <Stack spacing={1}>
                                {assignedDbTeachers.map((dbT, idx) => (
                                    <Box
                                        key={idx}
                                        onClick={() => {
                                            if (dbT.matchedTeacherCode) {
                                                setSelectedTeacherCode(dbT.matchedTeacherCode);
                                            }
                                        }}
                                        sx={{
                                            p: 1.5,
                                            borderRadius: 2,
                                            border: `2px solid ${
                                                selectedTeacherCode === dbT.matchedTeacherCode
                                                    ? '#2563eb'
                                                    : (isDark ? '#27272a' : '#e2e8f0')
                                            }`,
                                            bgcolor:
                                                selectedTeacherCode === dbT.matchedTeacherCode
                                                    ? (isDark ? 'rgba(37, 99, 235, 0.2)' : '#eff6ff')
                                                    : (isDark ? '#141416' : '#ffffff'),
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            transition: 'all 0.15s ease',
                                            '&:hover': { borderColor: '#93c5fd' },
                                        }}
                                    >
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 700, color: isDark ? '#f4f4f5' : '#0f172a' }}>
                                                {dbT.teacherName}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: isDark ? '#a1a1aa' : '#64748b' }}>
                                                {dbT.subjectName} • Target: {dbT.jpAmount} JP
                                            </Typography>
                                        </Box>
                                        {dbT.matchedTeacherCode && (
                                            <Chip
                                                label={`Kode #${dbT.matchedTeacherCode}`}
                                                size="small"
                                                color="primary"
                                                sx={{ fontWeight: 700 }}
                                            />
                                        )}
                                    </Box>
                                ))}
                            </Stack>
                        </Box>
                    )}

                    {/* Section 2: Pilih dari Semua Guru Terdaftar */}
                    <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: isDark ? '#f4f4f5' : '#0f172a', mb: 1 }}>
                            Semua Guru Terdaftar (#Kode 1 s/d 25):
                        </Typography>

                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Cari nama guru, mapel, atau kode..."
                            value={filterSearch}
                            onChange={(e) => setFilterSearch(e.target.value)}
                            sx={{ mb: 1.5 }}
                        />

                        <FormControl fullWidth size="small">
                            <InputLabel id="teacher-dropdown-select-label">Pilih Guru & Mapel</InputLabel>
                            <Select
                                labelId="teacher-dropdown-select-label"
                                value={selectedTeacherCode}
                                label="Pilih Guru & Mapel"
                                onChange={(e) => setSelectedTeacherCode(e.target.value as any)}
                            >
                                <MenuItem value="">
                                    <em>-- Kosongkan Slot (Tanpa Guru) --</em>
                                </MenuItem>
                                {filteredTeachersList.map((t) => (
                                    <MenuItem key={t.code} value={t.code}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                                            <Chip
                                                label={`#${t.code}`}
                                                size="small"
                                                sx={{
                                                    fontWeight: 800,
                                                    bgcolor: t.color || '#2563eb',
                                                    color: '#ffffff',
                                                    height: 20,
                                                    fontSize: '11px',
                                                }}
                                            />
                                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                {t.name}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#64748b', ml: 'auto' }}>
                                                {t.subjectName} ({t.category})
                                            </Typography>
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 2, bgcolor: isDark ? '#18181b' : '#f8fafc', borderTop: isDark ? '1px solid #27272a' : '1px solid #e2e8f0' }}>
                    <Button
                        color="error"
                        onClick={() => {
                            setSelectedTeacherCode('');
                            handleSaveSlot();
                        }}
                    >
                        Kosongkan Slot
                    </Button>
                    <Box sx={{ flex: 1 }} />
                    <Button onClick={() => setSelectedSlot(null)} sx={{ color: isDark ? '#a1a1aa' : undefined }}>Batal</Button>
                    <Button variant="contained" onClick={handleSaveSlot} sx={{ fontWeight: 700 }}>
                        Terapkan ke Slot
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PerClassScheduleView;

