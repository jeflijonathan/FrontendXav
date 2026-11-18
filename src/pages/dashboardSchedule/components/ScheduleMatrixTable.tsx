import React, { useState, useMemo } from 'react';
import {
    Alert,
    Autocomplete,
    Box,
    Button,
    Card,
    Checkbox,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    IconButton,
    MenuItem,
    Select,
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
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useScheduleStore } from '../store/useScheduleStore';
import type {
    ClassColumn,
    DragPayload,
    ScheduleCell,
    ScheduleRow,
} from '../types';

const ScheduleMatrixTable: React.FC = () => {
    const {
        rows,
        classes,
        teachers,
        conflicts,
        selectedDayFilter,
        selectedGradeFilter,
        selectedClassFilter,
        searchQuery,
        setCellTeacher,
        setBatchCellTeacher,
        swapCells,
        applySpecialActivityToRow,
        removeSpecialActivityFromRow,
        setClassExtraActivity,
        categoryExtras,
        draggedItem,
        setDraggedItem,
    } = useScheduleStore();

    // Dialog state for editing a cell
    const [selectedCellTarget, setSelectedCellTarget] = useState<{
        rowId: string;
        day: string;
        jp: number | string;
        timeRange: string;
        className: string;
        currentCode: number | null;
    } | null>(null);

    const [selectedTeacherCode, setSelectedTeacherCode] = useState<number | ''>('');
    const [selectedSubjectCode, setSelectedSubjectCode] = useState<string>('');
    const [fillDown, setFillDown] = useState(false);
    const [fillDownCount, setFillDownCount] = useState(1);

    // Calculate JP usage for a given teacher + subject in the active target class
    const getJpUsage = useMemo(() => {
        return (teacherCode: number, subjectCode?: string, targetClassName?: string) => {
            let used = 0;
            rows.forEach((row) => {
                if (row.specialActivity) return;
                Object.entries(row.classCells).forEach(([className, cell]) => {
                    if (targetClassName && className !== targetClassName) return;
                    if (cell.teacherCode === teacherCode) {
                        if (subjectCode) {
                            if (cell.subjectCode === subjectCode) used++;
                        } else {
                            used++;
                        }
                    }
                });
            });
            return used;
        };
    }, [rows]);

    // Get the selected teacher's subject options and JP info
    const selectedTeacher = selectedTeacherCode !== '' ? teachers.find((t) => t.code === Number(selectedTeacherCode)) : null;
    const selectedSubjects = selectedTeacher?.subjects || [];
    const selectedSubject = selectedSubjects.find((s) => s.subjectCode === selectedSubjectCode) || null;

    const jpUsedForSubject = selectedTeacher && selectedSubject
        ? getJpUsage(selectedTeacher.code, selectedSubject.subjectCode, selectedCellTarget?.className)
        : 0;
    const jpTargetForSubject = selectedSubject?.targetJp || 0;
    const jpRemainingForSubject = jpTargetForSubject - jpUsedForSubject;
    const isJpExceeded = jpTargetForSubject > 0 && jpRemainingForSubject <= 0;

    // Get KBM rows after current row for fill-down calculation
    const getKbmRowsAfter = (rowId: string, _className?: string): ScheduleRow[] => {
        const currentIndex = rows.findIndex((r) => r.id === rowId);
        if (currentIndex < 0) return [];
        const currentRow = rows[currentIndex];
        const result: ScheduleRow[] = [];
        for (let i = currentIndex + 1; i < rows.length; i++) {
            const r = rows[i];
            if (r.day !== currentRow.day) break; // hanya dalam hari yang sama
            if (r.specialActivity) continue; // skip Istirahat, Upacara, etc
            result.push(r);
        }
        return result;
    };

    const availableFillDownRows = selectedCellTarget
        ? getKbmRowsAfter(selectedCellTarget.rowId, selectedCellTarget.className)
        : [];

    // Filtered classes according to selected room/class or grade
    const filteredClasses = classes.filter((c) => {
        if (selectedClassFilter && selectedClassFilter !== 'Semua') {
            return c.name === selectedClassFilter || c.id === selectedClassFilter;
        }
        if (selectedGradeFilter === 'Semua') return true;
        return c.grade === selectedGradeFilter;
    });

    // Filtered rows according to selected day
    const filteredRows = rows.filter((r) => {
        if (selectedDayFilter === 'Semua') return true;
        return r.day === selectedDayFilter;
    });

    // Check if a teacher code is conflicted in a particular row
    const isTeacherConflictedInRow = (
        day: string,
        jp: number | string,
        teacherCode: number | null
    ): boolean => {
        if (!teacherCode) return false;
        return conflicts.some(
            (c) => c.day === day && c.jp === jp && c.teacherCode === teacherCode
        );
    };

    // Open cell editor
    const handleCellClick = (
        row: ScheduleRow,
        className: string,
        cell: ScheduleCell
    ) => {
        setSelectedCellTarget({
            rowId: row.id,
            day: row.day,
            jp: row.jp,
            timeRange: row.timeRange,
            className,
            currentCode: cell.teacherCode,
        });
        const currentTeacher = teachers.find((t) => t.code === cell.teacherCode);
        setSelectedTeacherCode(cell.teacherCode || '');
        setSelectedSubjectCode(
            cell.subjectCode || currentTeacher?.subjects?.[0]?.subjectCode || ''
        );
        setFillDown(false);
        setFillDownCount(1);
    };

    // Save cell change
    const handleSaveCell = () => {
        if (selectedCellTarget) {
            const teacherCode = selectedTeacherCode === '' ? null : Number(selectedTeacherCode);
            if (fillDown && teacherCode && availableFillDownRows.length > 0) {
                const countToFill = Math.min(fillDownCount, availableFillDownRows.length);
                const targetRowIds = [
                    selectedCellTarget.rowId,
                    ...availableFillDownRows.slice(0, countToFill).map((r) => r.id),
                ];
                setBatchCellTeacher(
                    targetRowIds,
                    selectedCellTarget.className,
                    teacherCode,
                    selectedSubjectCode
                );
            } else {
                setCellTeacher(
                    selectedCellTarget.rowId,
                    selectedCellTarget.className,
                    teacherCode,
                    selectedSubjectCode
                );
            }
            setSelectedCellTarget(null);
        }
    };

    // Direct scroll to teacher in bottom table
    const handleDirectToTeacher = (code: number) => {
        setSelectedCellTarget(null);
        const el = document.getElementById(`teacher-row-${code}`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add('bg-amber-100');
            setTimeout(() => {
                el.classList.remove('bg-amber-100');
            }, 2500);
        } else {
            const tableEl = document.getElementById('daftar-guru-section');
            if (tableEl) tableEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Drag and Drop handlers
    const handleCellDragStart = (
        e: React.DragEvent,
        rowId: string,
        className: string,
        cell: ScheduleCell
    ) => {
        if (!cell.teacherCode) return;
        const payload: DragPayload = {
            type: 'SCHEDULE_CELL',
            teacherCode: cell.teacherCode,
            fromRowId: rowId,
            fromClassName: className,
        };
        e.dataTransfer.setData('text/plain', JSON.stringify(payload));
        e.dataTransfer.effectAllowed = 'copyMove';
        setDraggedItem(payload);
    };

    const handleCellDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleCellDrop = (
        e: React.DragEvent,
        targetRowId: string,
        targetClassName: string
    ) => {
        e.preventDefault();
        try {
            const raw = e.dataTransfer.getData('text/plain');
            const data: DragPayload = raw ? JSON.parse(raw) : draggedItem;

            if (!data) return;

            if (data.type === 'TEACHER_ITEM' && data.teacherCode) {
                setCellTeacher(targetRowId, targetClassName, data.teacherCode);
            } else if (
                data.type === 'SCHEDULE_CELL' &&
                data.fromRowId &&
                data.fromClassName
            ) {
                swapCells(
                    data.fromRowId,
                    data.fromClassName,
                    targetRowId,
                    targetClassName
                );
            } else if (data.type === 'SPECIAL_ACTIVITY' && data.activityType) {
                applySpecialActivityToRow(
                    targetRowId,
                    data.activityType,
                    data.activityTitle || data.activityType
                );
            }
        } catch (err) {
            console.error('Failed to parse dropped data', err);
        } finally {
            setDraggedItem(null);
        }
    };

    const handleRowDrop = (e: React.DragEvent, targetRowId: string) => {
        e.preventDefault();
        try {
            const raw = e.dataTransfer.getData('text/plain');
            const data: DragPayload = raw ? JSON.parse(raw) : draggedItem;
            if (data && data.type === 'SPECIAL_ACTIVITY' && data.activityType) {
                applySpecialActivityToRow(
                    targetRowId,
                    data.activityType,
                    data.activityTitle || data.activityType
                );
            }
        } catch (err) {
            console.error('Drop on row failed', err);
        } finally {
            setDraggedItem(null);
        }
    };

    // Calculate grouping by Grade for the top table header
    const gradeGroups: { grade: string; count: number; classes: ClassColumn[] }[] =
        [];
    ['X', 'XI', 'XII'].forEach((g) => {
        const cls = filteredClasses.filter((c) => c.grade === g);
        if (cls.length > 0) {
            gradeGroups.push({ grade: `KELAS ${g}`, count: cls.length, classes: cls });
        }
    });

    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: 3,
                border: '1px solid #cbd5e1',
                overflow: 'hidden',
                bgcolor: '#ffffff',
                mb: 4,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
            }}
        >
            {/* Header Document Bar */}
            <Box
                sx={{
                    p: 2,
                    bgcolor: '#f8fafc',
                    borderBottom: '2px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Box>
                    <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: 0.5 }}
                    >
                        TABEL MATRIKS JADWAL PELAJARAN (LAMPIRAN 3)
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                        SMK XAVERIUS PALEMBANG • Angka pada sel adalah Nomor Kode Guru Pengajar
                    </Typography>
                </Box>
                <Chip
                    size="small"
                    label={`${filteredRows.length} Slot Waktu • ${filteredClasses.length} Kelas Aktif`}
                    sx={{ bgcolor: '#e2e8f0', fontWeight: 700 }}
                />
            </Box>

            <TableContainer sx={{ maxHeight: '78vh' }}>
                <Table stickyHeader size="small" sx={{ minWidth: 1050 }}>
                    {/* Multi-tiered Table Head */}
                    <TableHead>
                        {/* Tier 1: Top Grouping */}
                        <TableRow>
                            <TableCell
                                rowSpan={2}
                                sx={{
                                    bgcolor: '#1e293b',
                                    color: '#ffffff',
                                    fontWeight: 800,
                                    fontSize: '12px',
                                    textAlign: 'center',
                                    borderRight: '1px solid #334155',
                                    width: 80,
                                }}
                            >
                                HARI
                            </TableCell>
                            <TableCell
                                rowSpan={2}
                                sx={{
                                    bgcolor: '#1e293b',
                                    color: '#ffffff',
                                    fontWeight: 800,
                                    fontSize: '11px',
                                    textAlign: 'center',
                                    borderRight: '1px solid #334155',
                                    width: 50,
                                }}
                            >
                                JAM KE
                            </TableCell>
                            <TableCell
                                rowSpan={2}
                                sx={{
                                    bgcolor: '#1e293b',
                                    color: '#ffffff',
                                    fontWeight: 800,
                                    fontSize: '11px',
                                    textAlign: 'center',
                                    borderRight: '2px solid #334155',
                                    width: 110,
                                }}
                            >
                                WAKTU
                            </TableCell>

                            {/* Class Category Spans */}
                            {gradeGroups.map((group) => (
                                <TableCell
                                    key={group.grade}
                                    colSpan={group.count}
                                    sx={{
                                        bgcolor:
                                            group.grade.includes('X ')
                                                ? '#334155'
                                                : group.grade.includes('XI ')
                                                ? '#1e293b'
                                                : '#0f172a',
                                        color: '#ffffff',
                                        fontWeight: 800,
                                        fontSize: '12px',
                                        textAlign: 'center',
                                        letterSpacing: 1,
                                        borderRight: '2px solid #475569',
                                        py: 0.75,
                                    }}
                                >
                                    {group.grade}
                                </TableCell>
                            ))}
                        </TableRow>

                        {/* Tier 2: Sub-columns for Classes */}
                        <TableRow>
                            {filteredClasses.map((cls) => {
                                const classConflictsCount = conflicts.filter((c) =>
                                    c.conflictedClasses.includes(cls.name)
                                ).length;
                                return (
                                    <TableCell
                                        key={cls.name}
                                        sx={{
                                            bgcolor: '#f1f5f9',
                                            color: '#0f172a',
                                            fontWeight: 800,
                                            fontSize: '11px',
                                            textAlign: 'center',
                                            borderRight: '1px solid #cbd5e1',
                                            py: 1,
                                            width: `${100 / (filteredClasses.length + 3)}%`,
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 0.75 }}>
                                            <Tooltip title={cls.major || cls.name}>
                                                <span>{cls.name}</span>
                                            </Tooltip>
                                            {classConflictsCount > 0 && (
                                                <Tooltip title={`${classConflictsCount} jadwal bentrok di ${cls.name}`}>
                                                    <Box
                                                        sx={{
                                                            minWidth: 18,
                                                            height: 18,
                                                            px: 0.5,
                                                            borderRadius: '999px',
                                                            bgcolor: '#ef4444',
                                                            color: '#ffffff',
                                                            fontSize: '10px',
                                                            fontWeight: 800,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            boxShadow: '0 1px 3px rgba(239, 68, 68, 0.4)',
                                                        }}
                                                    >
                                                        {classConflictsCount}
                                                    </Box>
                                                </Tooltip>
                                            )}
                                        </Box>
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {filteredRows.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={filteredClasses.length + 3}
                                    sx={{ py: 6, textAlign: 'center' }}
                                >
                                    <Box
                                        sx={{
                                            maxWidth: 480,
                                            mx: 'auto',
                                            p: 3,
                                            bgcolor: '#f8fafc',
                                            borderRadius: 3,
                                            border: '1px dashed #cbd5e1',
                                        }}
                                    >
                                        <Typography
                                            variant="subtitle1"
                                            sx={{ fontWeight: 800, color: '#334155', mb: 0.5 }}
                                        >
                                            Belum Ada Slot Waktu pada Roster Jam Belajar
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ color: '#64748b', fontSize: '13px' }}
                                        >
                                            Struktur baris tabel jadwal pelajaran mengikuti konfigurasi Roster Jam Belajar. Silakan atur slot jam KBM pada menu <strong>Jam & JP (Roster Jam Belajar)</strong> terlebih dahulu.
                                        </Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredRows.map((row, index) => {
                            const isNewDay =
                                index === 0 || filteredRows[index - 1].day !== row.day;
                            const sameDayRows = filteredRows.filter(
                                (r) => r.day === row.day
                            );

                            return (
                                <TableRow
                                    key={row.id}
                                    onDragOver={handleCellDragOver}
                                    onDrop={(e) => handleRowDrop(e, row.id)}
                                    sx={{
                                        '&:hover': { bgcolor: '#f8fafc' },
                                        borderBottom: '1px solid #e2e8f0',
                                    }}
                                >
                                    {/* Hari Column (Rowspan per Day) */}
                                    {isNewDay && (
                                        <TableCell
                                            rowSpan={sameDayRows.length}
                                            sx={{
                                                bgcolor: '#f8fafc',
                                                color: '#0f172a',
                                                fontWeight: 800,
                                                fontSize: '13px',
                                                textAlign: 'center',
                                                verticalAlign: 'middle',
                                                borderRight: '1px solid #cbd5e1',
                                                letterSpacing: 1,
                                            }}
                                        >
                                            {row.day.toUpperCase()}
                                        </TableCell>
                                    )}

                                    {/* Jam Ke */}
                                    <TableCell
                                        sx={{
                                            textAlign: 'center',
                                            fontWeight: 700,
                                            fontSize: '12px',
                                            color: row.jp === 0 || row.jp === '-' ? '#64748b' : '#1e293b',
                                            borderRight: '1px solid #e2e8f0',
                                            bgcolor: row.jp === 0 || row.jp === '-' ? '#f8fafc' : '#ffffff',
                                        }}
                                    >
                                        {row.jp}
                                    </TableCell>

                                    {/* Waktu */}
                                    <TableCell
                                        sx={{
                                            textAlign: 'center',
                                            fontSize: '11px',
                                            fontFamily: 'monospace',
                                            fontWeight: 600,
                                            color: '#475569',
                                            borderRight: '2px solid #cbd5e1',
                                            whiteSpace: 'nowrap',
                                            bgcolor: row.jp === 0 || row.jp === '-' ? '#f8fafc' : '#ffffff',
                                        }}
                                    >
                                        {row.timeRange}
                                    </TableCell>

                                    {/* Special Activity or KBM Cells */}
                                    {row.specialActivity ? (
                                        // Check if this is an EKSTRA type (per-class) or full-span (Istirahat, Upacara, etc.)
                                        row.specialActivity.activityType.toString().includes('EKSTRA') ||
                                        row.specialActivity.activityType === 'PRAMUKA' ||
                                        row.specialActivity.title.toUpperCase().includes('EKSTRA')
                                    ) ? (
                                        /* ========== EKSTRA: Per-Class Cells ========== */
                                        filteredClasses.map((cls) => {
                                            const allCats = categoryExtras.length > 0
                                                ? categoryExtras
                                                : [
                                                      { id_category_extra: '1', name: 'Pramuka', status: true },
                                                      { id_category_extra: '2', name: 'PMR', status: true },
                                                      { id_category_extra: '3', name: 'Paskibra', status: true },
                                                      { id_category_extra: '4', name: 'Futsal / Olahraga', status: true },
                                                      { id_category_extra: '5', name: 'Seni Tari & Musik', status: true },
                                                      { id_category_extra: '6', name: 'Rohani / Katolik', status: true },
                                                  ];
                                            // Hanya kategori berstatus aktif (status !== false) yang tampil di select
                                            const activeCats = allCats.filter((cat) => cat.status !== false);
                                            const activeOptions = activeCats.map((cat) => cat.name);

                                            const currentExtra = row.classExtraActivities?.[cls.name]
                                                || row.specialActivity?.subtitle
                                                || (activeOptions.length > 0 ? activeOptions[0] : 'Pramuka');

                                            const isMatchingSearch =
                                                searchQuery.trim() !== '' &&
                                                (currentExtra.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                 'ekstra'.includes(searchQuery.toLowerCase()));

                                            return (
                                                <TableCell
                                                    key={cls.name}
                                                    sx={{
                                                        bgcolor: isMatchingSearch ? '#fef08a' : '#f0fdf4',
                                                        border: '1px solid #bbf7d0',
                                                        textAlign: 'center',
                                                        p: 0.5,
                                                        verticalAlign: 'middle',
                                                        transition: 'background-color 0.2s ease',
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            gap: 0.4,
                                                            minWidth: 105,
                                                        }}
                                                    >
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                            <Chip
                                                                label="EKSTRA"
                                                                size="small"
                                                                sx={{
                                                                    fontWeight: 800,
                                                                    fontSize: '9px',
                                                                    letterSpacing: 0.5,
                                                                    height: 18,
                                                                    bgcolor: '#dcfce7',
                                                                    color: '#166534',
                                                                    border: '1px solid #86efac',
                                                                }}
                                                            />
                                                            <Tooltip title="Ubah kembali ke KBM">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => removeSpecialActivityFromRow(row.id)}
                                                                    sx={{
                                                                        color: '#dc2626',
                                                                        opacity: 0.6,
                                                                        '&:hover': { opacity: 1, bgcolor: '#fee2e2' },
                                                                        p: 0.2,
                                                                    }}
                                                                >
                                                                    <DeleteOutlineIcon sx={{ fontSize: 13 }} />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Box>

                                                        {/* Autocomplete dengan pencarian kategori ekstra (hanya yang aktif) */}
                                                        <Autocomplete
                                                            size="small"
                                                            options={activeOptions}
                                                            value={activeOptions.includes(currentExtra) ? currentExtra : activeOptions[0] || currentExtra}
                                                            onChange={(_, newValue) => {
                                                                if (newValue) {
                                                                    setClassExtraActivity(row.id, cls.name, newValue);
                                                                }
                                                            }}
                                                            disableClearable
                                                            noOptionsText="Tidak ada"
                                                            sx={{
                                                                width: '100%',
                                                                '& .MuiInputBase-root': {
                                                                    height: 24,
                                                                    fontSize: '11px',
                                                                    fontWeight: 700,
                                                                    color: '#15803d',
                                                                    bgcolor: '#ffffff',
                                                                    borderRadius: 1,
                                                                    px: 0.6,
                                                                    py: 0,
                                                                },
                                                                '& .MuiOutlinedInput-notchedOutline': {
                                                                    borderColor: '#86efac',
                                                                },
                                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                                    borderColor: '#22c55e',
                                                                },
                                                                '& .MuiAutocomplete-input': {
                                                                    py: '2px !important',
                                                                },
                                                            }}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    placeholder="Cari Ekstra..."
                                                                    variant="outlined"
                                                                    size="small"
                                                                />
                                                            )}
                                                        />
                                                    </Box>
                                                </TableCell>
                                            );
                                        })
                                    ) : (
                                        /* ========== Full-span: Istirahat, Upacara, Senam, Literasi ========== */
                                        <TableCell
                                            colSpan={filteredClasses.length}
                                            sx={{
                                                bgcolor: row.specialActivity.colorScheme.bg,
                                                color: row.specialActivity.colorScheme.text,
                                                border: `1px dashed ${row.specialActivity.colorScheme.border}`,
                                                textAlign: 'center',
                                                py: 0.8,
                                                position: 'relative',
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: 1.5,
                                                    flexWrap: 'wrap',
                                                }}
                                            >
                                                <Chip
                                                    label={row.specialActivity.title}
                                                    size="small"
                                                    sx={{
                                                        fontWeight: 900,
                                                        letterSpacing: 1,
                                                        fontSize: '11px',
                                                        bgcolor: row.specialActivity.colorScheme.bg,
                                                        color: row.specialActivity.colorScheme.text,
                                                        border: `1px solid ${row.specialActivity.colorScheme.border}`,
                                                        height: 24,
                                                    }}
                                                />
                                                <Tooltip title="Ubah baris ini kembali menjadi slot KBM biasa">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => removeSpecialActivityFromRow(row.id)}
                                                        sx={{
                                                            color: row.specialActivity.colorScheme.text,
                                                            opacity: 0.7,
                                                            '&:hover': { opacity: 1, bgcolor: 'rgba(0,0,0,0.06)' },
                                                            p: 0.4,
                                                        }}
                                                    >
                                                        <DeleteOutlineIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    ) : (
                                        /* Standard KBM Cells */
                                        filteredClasses.map((cls) => {
                                            const cell = row.classCells[cls.name] || { teacherCode: null };
                                            const hasConflict = isTeacherConflictedInRow(
                                                row.day,
                                                row.jp,
                                                cell.teacherCode
                                            );
                                            const conflictObj = hasConflict ? conflicts.find(
                                                (c) => c.day === row.day && String(c.jp) === String(row.jp) && c.teacherCode === cell.teacherCode
                                            ) : undefined;
                                            const teacher = teachers.find(
                                                (t) => t.code === cell.teacherCode
                                            );

                                            const isMatchingSearch =
                                                searchQuery.trim() !== '' &&
                                                cell.teacherCode &&
                                                (String(cell.teacherCode) === searchQuery.trim() ||
                                                    (teacher?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                    (teacher?.subjectName || '').toLowerCase().includes(searchQuery.toLowerCase()));

                                            return (
                                                <TableCell
                                                    key={cls.name}
                                                    draggable={Boolean(cell.teacherCode)}
                                                    onDragStart={(e) =>
                                                        handleCellDragStart(e, row.id, cls.name, cell)
                                                    }
                                                    onDragOver={handleCellDragOver}
                                                    onDrop={(e) => handleCellDrop(e, row.id, cls.name)}
                                                    onClick={() => handleCellClick(row, cls.name, cell)}
                                                    sx={{
                                                        textAlign: 'center',
                                                        borderRight: '1px solid #e2e8f0',
                                                        p: 0.75,
                                                        cursor: 'pointer',
                                                        bgcolor: hasConflict
                                                            ? '#fee2e2'
                                                            : isMatchingSearch
                                                            ? '#fef08a'
                                                            : cell.category === 'KEJURUAN'
                                                            ? '#fffbeb'
                                                            : '#ffffff',
                                                        transition: 'all 0.15s ease',
                                                        '&:hover': {
                                                            bgcolor: hasConflict ? '#fecaca' : '#f1f5f9',
                                                            transform: 'scale(1.02)',
                                                            zIndex: 2,
                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                                                        },
                                                    }}
                                                >
                                                    {cell.teacherCode ? (
                                                        <Tooltip
                                                            title={
                                                                <Box sx={{ p: 0.5 }}>
                                                                    <Typography variant="body2" sx={{ fontWeight: 800 }}>
                                                                        #{cell.teacherCode} {teacher?.name || 'Guru'}
                                                                    </Typography>
                                                                    <Typography variant="caption" sx={{ display: 'block', color: '#cbd5e1' }}>
                                                                        Mapel: {teacher?.subjectName || '-'} ({teacher?.category || 'UMUM'})
                                                                    </Typography>
                                                                    <Typography variant="caption" sx={{ display: 'block', color: '#93c5fd', mt: 0.5 }}>
                                                                        💡 {teacher?.recommendedJp || 'Jam Fleksibel'}
                                                                    </Typography>
                                                                    {hasConflict && (
                                                                        <Typography variant="caption" sx={{ color: '#f87171', fontWeight: 700, mt: 0.5, display: 'block' }}>
                                                                            ⚠️ {conflictObj?.conflictReason || 'BENTROK: Mengajar di kelas lain pada jam yang sama!'}
                                                                        </Typography>
                                                                    )}
                                                                </Box>
                                                            }
                                                        >
                                                            <Box
                                                                sx={{
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    width: 32,
                                                                    height: 32,
                                                                    borderRadius: 1.5,
                                                                    bgcolor: hasConflict
                                                                        ? '#ef4444'
                                                                        : cell.category === 'KEJURUAN'
                                                                        ? '#f97316'
                                                                        : '#3b82f6',
                                                                    color: '#ffffff',
                                                                    fontWeight: 900,
                                                                    fontSize: '14px',
                                                                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                                                }}
                                                            >
                                                                {cell.teacherCode}
                                                            </Box>
                                                        </Tooltip>
                                                    ) : (
                                                        <Box
                                                            sx={{
                                                                width: 28,
                                                                height: 28,
                                                                borderRadius: 1,
                                                                border: '1px dashed #cbd5e1',
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                color: '#94a3b8',
                                                                fontSize: '11px',
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            -
                                                        </Box>
                                                    )}
                                                </TableCell>
                                            );
                                        })
                                    )}
                                </TableRow>
                            );
                        })
                    )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Quick Edit Dialog */}
            <Dialog
                open={Boolean(selectedCellTarget)}
                onClose={() => setSelectedCellTarget(null)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>
                    Input / Ubah Nomor Guru
                </DialogTitle>
                <DialogContent>
                    {selectedCellTarget && (
                        <Box sx={{ pt: 1 }}>
                            <Box sx={{ mb: 2, p: 1.5, bgcolor: '#f8fafc', borderRadius: 2 }}>
                                <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                                    Target Slot:
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                                    {selectedCellTarget.day} • Jam Ke-{selectedCellTarget.jp} ({selectedCellTarget.timeRange})
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#4338ca', fontWeight: 700 }}>
                                    Kelas: {selectedCellTarget.className}
                                </Typography>
                            </Box>

                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                                Pilih Guru / Nomor Kode:
                            </Typography>
                            <Select
                                fullWidth
                                size="small"
                                value={selectedTeacherCode}
                                onChange={(e) => {
                                    const val = e.target.value as any;
                                    setSelectedTeacherCode(val);
                                    if (val !== '') {
                                        const t = teachers.find((item) => item.code === Number(val));
                                        if (t && t.subjects && t.subjects.length > 0) {
                                            setSelectedSubjectCode(t.subjects[0].subjectCode);
                                        }
                                    }
                                }}
                                displayEmpty
                                sx={{ mb: 2 }}
                            >
                                <MenuItem value="">
                                    <em>-- Kosongkan Slot (Tanpa Guru) --</em>
                                </MenuItem>
                                {teachers.map((t) => (
                                    <MenuItem key={t.code} value={t.code}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                                            <Chip
                                                size="small"
                                                label={`#${t.code}`}
                                                sx={{
                                                    fontWeight: 800,
                                                    bgcolor: t.category === 'KEJURUAN' ? '#ffedd5' : '#e0e7ff',
                                                    color: t.category === 'KEJURUAN' ? '#c2410c' : '#3730a3',
                                                }}
                                            />
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                {t.name}
                                            </Typography>
                                            <Typography variant="caption" sx={{ ml: 'auto', color: '#64748b' }}>
                                                {t.subjectCode}
                                            </Typography>
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>

                            {/* Pilihan Mata Pelajaran Pengajaran */}
                            {selectedTeacher && selectedSubjects.length > 0 && (
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                                        Pilih Mata Pelajaran:
                                    </Typography>
                                    <Select
                                        fullWidth
                                        size="small"
                                        value={selectedSubjectCode}
                                        onChange={(e) => setSelectedSubjectCode(e.target.value)}
                                    >
                                        {selectedSubjects.map((s) => (
                                            <MenuItem key={s.subjectCode} value={s.subjectCode}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                        {s.subjectName} ({s.subjectCode})
                                                    </Typography>
                                                    <Chip
                                                        size="small"
                                                        label={`${s.targetJp || 4} JP`}
                                                        sx={{ height: 20, fontSize: '10px', fontWeight: 700 }}
                                                    />
                                                </Box>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Box>
                            )}

                            {/* Detail JP Pemenuhan */}
                            {selectedTeacher && selectedSubject && (
                                <Box
                                    sx={{
                                        mb: 2,
                                        p: 1.5,
                                        borderRadius: 2,
                                        bgcolor: isJpExceeded ? '#fef2f2' : '#f0fdf4',
                                        border: '1px solid',
                                        borderColor: isJpExceeded ? '#fca5a5' : '#bbf7d0',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155' }}>
                                            Pemenuhan JP ({selectedSubject.subjectName} di {selectedCellTarget?.className || 'Kelas'}):
                                        </Typography>
                                        <Chip
                                            size="small"
                                            label={
                                                isJpExceeded
                                                    ? `0 JP Sisa (Terpenuhi: ${jpUsedForSubject}/${jpTargetForSubject} JP)`
                                                    : `Sisa ${jpRemainingForSubject} JP (Terpakai ${jpUsedForSubject}/${jpTargetForSubject} JP)`
                                            }
                                            sx={{
                                                fontWeight: 800,
                                                fontSize: '11px',
                                                bgcolor: isJpExceeded ? '#ef4444' : '#16a34a',
                                                color: '#ffffff',
                                            }}
                                        />
                                    </Box>

                                    {isJpExceeded && (
                                        <Alert severity="error" sx={{ mt: 1, py: 0.25, fontSize: '12px' }}>
                                            ⚠️ Target JP untuk mapel ini minggu ini sudah terpenuhi (0 JP tersisa)!
                                        </Alert>
                                    )}
                                </Box>
                            )}

                            {/* Fitur Tarik / Fill-Down ke Bawah Seperti Excel */}
                            {selectedTeacherCode !== '' && availableFillDownRows.length > 0 && (
                                <Box sx={{ mb: 2, p: 1.5, bgcolor: '#f1f5f9', borderRadius: 2 }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                size="small"
                                                checked={fillDown}
                                                onChange={(e) => setFillDown(e.target.checked)}
                                                sx={{ color: '#4f46e5', '&.Mui-checked': { color: '#4f46e5' } }}
                                            />
                                        }
                                        label={
                                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                                                Tarik data ke bawah (seperti Excel)
                                            </Typography>
                                        }
                                    />

                                    {fillDown && (
                                        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600 }}>
                                                Isi sebanyak:
                                            </Typography>
                                            <TextField
                                                size="small"
                                                type="number"
                                                value={fillDownCount}
                                                onChange={(e) => {
                                                    const val = Math.max(1, Math.min(Number(e.target.value), availableFillDownRows.length));
                                                    setFillDownCount(val);
                                                }}
                                                slotProps={{
                                                    htmlInput: {
                                                        min: 1,
                                                        max: availableFillDownRows.length,
                                                        style: { width: 45, textAlign: 'center', padding: '4px' },
                                                    },
                                                }}
                                            />
                                            <Typography variant="caption" sx={{ color: '#475569' }}>
                                                slot KBM berikutnya (tersedia maks {availableFillDownRows.length})
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            )}

                            {selectedTeacherCode !== '' && (
                                <Alert
                                    severity="info"
                                    icon={<ArrowDownwardIcon />}
                                    sx={{
                                        cursor: 'pointer',
                                        '&:hover': { bgcolor: '#e0f2fe' },
                                    }}
                                    onClick={() => handleDirectToTeacher(Number(selectedTeacherCode))}
                                >
                                    <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                        Direct ke detail guru #{selectedTeacherCode} di tabel bawah
                                    </Typography>
                                </Alert>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button
                        onClick={() => setSelectedCellTarget(null)}
                        sx={{ textTransform: 'none', color: '#64748b' }}
                    >
                        Batal
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSaveCell}
                        sx={{
                            bgcolor: '#4f46e5',
                            textTransform: 'none',
                            fontWeight: 700,
                            borderRadius: 2,
                        }}
                    >
                        Simpan Slot
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

export default ScheduleMatrixTable;

