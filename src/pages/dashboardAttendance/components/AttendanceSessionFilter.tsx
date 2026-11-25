import React, { useMemo, useState } from 'react';
import {
    Box,
    Card,
    Grid,
    TextField,
    MenuItem,
    Typography,
    Stack,
    Chip,
    Alert,
    AlertTitle,
    Button,
    Tabs,
    Tab,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import TodayIcon from '@mui/icons-material/Today';
import { useTheme } from '@mui/material/styles';
import type { AcademicYearMeetingItem, AccessibleClassItem } from '@api/attendance/model';

interface AttendanceSessionFilterProps {
    isAdminView: boolean;
    teacherName?: string | null;
    hasCalendar: boolean;
    classes: AccessibleClassItem[];
    selectedClassId: string;
    onSelectClassId: (idClass: string) => void;
    selectedSubject: string;
    onSelectSubject: (subject: string) => void;
    meetings: AcademicYearMeetingItem[];
    selectedMeeting: AcademicYearMeetingItem | null;
    onSelectMeeting: (meeting: AcademicYearMeetingItem) => void;
    disabled?: boolean;
}

const formatDisplayDate = (dateStr: string) => {
    try {
        const d = new Date(dateStr + 'T00:00:00');
        return d.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    } catch {
        return dateStr;
    }
};

export const AttendanceSessionFilter: React.FC<AttendanceSessionFilterProps> = ({
    isAdminView,
    teacherName,
    hasCalendar,
    classes,
    selectedClassId,
    onSelectClassId,
    selectedSubject,
    onSelectSubject,
    meetings,
    selectedMeeting,
    onSelectMeeting,
    disabled = false,
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const [semesterFilter, setSemesterFilter] = useState<string>('ALL');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'RECORDED' | 'UNRECORDED'>('ALL');

    const todayStr = useMemo(() => {
        const t = new Date();
        return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
    }, []);

    const selectedClassObj = classes.find((c) => c.id_class === selectedClassId);

    const uniqueSubjects = useMemo(() => {
        const subs = new Set<string>();
        selectedClassObj?.subjects?.forEach((s) => {
            if (s) subs.add(s);
        });
        meetings.forEach((m) => {
            if (m.subject_name) subs.add(m.subject_name);
        });
        return Array.from(subs);
    }, [selectedClassObj, meetings]);

    // Pertemuan hanya dimuat jika mata pelajaran sudah dipilih
    const subjectMeetings = useMemo(() => {
        if (!selectedSubject) return [];
        return meetings.filter((m) => m.subject_name === selectedSubject);
    }, [meetings, selectedSubject]);

    const uniqueSemesters = useMemo(() => {
        const sems = new Set<string>();
        subjectMeetings.forEach((m) => {
            if (m.semester) sems.add(m.semester);
        });
        return Array.from(sems);
    }, [subjectMeetings]);

    const filteredMeetings = useMemo(() => {
        if (!selectedSubject) return [];
        return subjectMeetings.filter((m) => {
            if (semesterFilter !== 'ALL' && m.semester !== semesterFilter) return false;
            if (statusFilter === 'RECORDED' && !m.is_recorded) return false;
            if (statusFilter === 'UNRECORDED' && m.is_recorded) return false;
            return true;
        });
    }, [selectedSubject, subjectMeetings, semesterFilter, statusFilter]);

    const handleJumpToNearest = () => {
        const source = filteredMeetings.length > 0 ? filteredMeetings : subjectMeetings;
        if (source.length === 0) return;
        const nearest = source.find((m) => m.date >= todayStr) || source[source.length - 1];
        if (nearest) onSelectMeeting(nearest);
    };

    if (classes.length === 0) {
        return (
            <Card
                variant="outlined"
                sx={{
                    p: { xs: 2.5, sm: 3 },
                    mb: 3,
                    borderRadius: 3,
                    bgcolor: isDark ? '#18181b' : '#ffffff',
                    borderColor: isDark ? '#27272a' : '#e2e8f0',
                    textAlign: 'center',
                }}
            >
                <LockPersonIcon sx={{ fontSize: 44, color: isDark ? '#71717a' : '#94a3b8', mb: 1 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: isDark ? '#f4f4f5' : '#0f172a' }}>
                    Tidak Ada Mata Pelajaran yang Diampu
                </Typography>
                <Typography variant="body2" sx={{ color: isDark ? '#a1a1aa' : '#64748b', maxWidth: 520, mx: 'auto', mt: 0.5 }}>
                    {isAdminView
                        ? 'Belum ada slot jadwal KBM pada Tahun Pelajaran ini.'
                        : 'Anda tidak memiliki jadwal mengajar pada Tahun Pelajaran yang dipilih. Presensi hanya dapat dibuka untuk kelas dan mata pelajaran yang Anda ampu.'}
                </Typography>
            </Card>
        );
    }

    return (
        <Card
            variant="outlined"
            sx={{
                p: { xs: 2, sm: 2.5 },
                mb: 2.5,
                borderRadius: 3,
                bgcolor: isDark ? '#18181b' : '#ffffff',
                borderColor: isDark ? '#27272a' : '#e2e8f0',
            }}
        >
            {/* Header Filter */}
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1}
                sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between', mb: 2 }}
            >
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <SchoolIcon fontSize="small" sx={{ color: '#2563eb' }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: isDark ? '#f4f4f5' : '#0f172a' }}>
                        PILIH KELAS, MATA PELAJARAN & PERTEMUAN
                    </Typography>
                </Stack>

                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                    {teacherName && !isAdminView && (
                        <Chip
                            icon={<PersonIcon sx={{ fontSize: '15px !important' }} />}
                            label={`Pengampu: ${teacherName}`}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ fontWeight: 700, fontSize: '11.5px' }}
                        />
                    )}
                    <Chip
                        icon={<CalendarMonthIcon sx={{ fontSize: '14px !important' }} />}
                        label={hasCalendar ? 'Tersinkron Kalender Akademik' : 'Kalender Standar Hari Kerja'}
                        size="small"
                        color={hasCalendar ? 'success' : 'default'}
                        variant="outlined"
                        sx={{ fontWeight: 700, fontSize: '11px' }}
                    />
                </Stack>
            </Stack>

            {/* Step 2: Pilih Kelas + Pilih Mata Pelajaran + Status */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                        select
                        fullWidth
                        size="small"
                        disabled={disabled}
                        label="1. Pilih Kelas yang Diampu"
                        value={selectedClassId}
                        onChange={(e) => {
                            setSemesterFilter('ALL');
                            onSelectClassId(e.target.value);
                        }}
                        helperText={
                            selectedClassObj
                                ? `MK Diampu: ${selectedClassObj.subjects.join(', ')}`
                                : 'Pilih kelas yang Anda ajar'
                        }
                        sx={{
                            '& .MuiInputBase-root': {
                                bgcolor: isDark ? '#27272a' : '#ffffff',
                                borderRadius: 2,
                            },
                        }}
                    >
                        {classes.map((cls) => (
                            <MenuItem key={cls.id_class} value={cls.id_class}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                        gap: 1,
                                        pr: 1,
                                    }}
                                >
                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                        {cls.name}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: isDark ? '#a1a1aa' : '#64748b',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            maxWidth: { xs: 150, sm: 200 },
                                        }}
                                    >
                                        {cls.subjects.join(', ')}
                                    </Typography>
                                </Box>
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <TextField
                        select
                        fullWidth
                        size="small"
                        disabled={disabled || !selectedClassId}
                        label="2. Pilih Mata Pelajaran"
                        value={selectedSubject}
                        onChange={(e) => {
                            setSemesterFilter('ALL');
                            onSelectSubject(e.target.value);
                        }}
                        slotProps={{
                            select: {
                                displayEmpty: true,
                                renderValue: (val: any) =>
                                    val ? (
                                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                            {val}
                                        </Typography>
                                    ) : (
                                        <Typography variant="body2" sx={{ color: isDark ? '#a1a1aa' : '#94a3b8' }}>
                                            -- Pilih Mata Pelajaran --
                                        </Typography>
                                    ),
                            },
                            inputLabel: { shrink: true },
                        }}
                        helperText={
                            selectedSubject
                                ? `${subjectMeetings.length} pertemuan tersedia`
                                : 'Wajib dipilih untuk menampilkan pertemuan'
                        }
                        sx={{
                            '& .MuiInputBase-root': {
                                bgcolor: isDark ? '#27272a' : '#ffffff',
                                borderRadius: 2,
                            },
                        }}
                    >
                        <MenuItem value="">
                            <em>-- Pilih Mata Pelajaran --</em>
                        </MenuItem>
                        {uniqueSubjects.map((sub) => (
                            <MenuItem key={sub} value={sub}>
                                {sub}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <TextField
                        select
                        fullWidth
                        size="small"
                        disabled={disabled || !selectedSubject}
                        label="Filter Status Presensi"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        sx={{
                            '& .MuiInputBase-root': {
                                bgcolor: isDark ? '#27272a' : '#ffffff',
                                borderRadius: 2,
                            },
                        }}
                    >
                        <MenuItem value="ALL">Semua Pertemuan ({subjectMeetings.length})</MenuItem>
                        <MenuItem value="UNRECORDED">Belum Diabsen</MenuItem>
                        <MenuItem value="RECORDED">Sudah Diabsen</MenuItem>
                    </TextField>
                </Grid>
            </Grid>

            {/* Jika Mata Pelajaran belum dipilih -> Kosongkan data pertemuan */}
            {!selectedSubject ? (
                <Alert
                    severity="info"
                    icon={<MenuBookIcon />}
                    sx={{
                        borderRadius: 2.5,
                        bgcolor: isDark ? 'rgba(37, 99, 235, 0.08)' : '#f8fafc',
                        border: isDark ? '1px solid #27272a' : '1px dashed #cbd5e1',
                        color: isDark ? '#d4d4d8' : '#334155',
                    }}
                >
                    <AlertTitle sx={{ fontWeight: 800 }}>Pilih Mata Pelajaran Terlebih Dahulu</AlertTitle>
                    <Typography variant="body2">
                        Silakan pilih <strong>Mata Pelajaran</strong> pada dropdown di atas untuk menampilkan daftar pertemuan sepanjang Tahun Pelajaran dan membuka lembar presensi siswa.
                    </Typography>
                </Alert>
            ) : (
                <>
                    {/* Semester Tabs & Jump to Nearest */}
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={1}
                        sx={{
                            alignItems: { sm: 'center' },
                            justifyContent: 'space-between',
                            mb: 1.5,
                            borderBottom: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
                            pb: 1,
                        }}
                    >
                        <Tabs
                            value={semesterFilter}
                            onChange={(_, val) => setSemesterFilter(val)}
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{ minHeight: 36 }}
                        >
                            <Tab
                                label={`Semua (${subjectMeetings.length})`}
                                value="ALL"
                                sx={{ minHeight: 36, textTransform: 'none', fontWeight: 700, fontSize: '12.5px' }}
                            />
                            {uniqueSemesters.map((sem) => (
                                <Tab
                                    key={sem}
                                    label={sem}
                                    value={sem}
                                    sx={{ minHeight: 36, textTransform: 'none', fontWeight: 700, fontSize: '12.5px' }}
                                />
                            ))}
                        </Tabs>

                        <Button
                            size="small"
                            variant="outlined"
                            startIcon={<TodayIcon sx={{ fontSize: 16 }} />}
                            onClick={handleJumpToNearest}
                            disabled={subjectMeetings.length === 0}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 700,
                                borderRadius: 2,
                                fontSize: '12px',
                                whiteSpace: 'nowrap',
                                alignSelf: { xs: 'flex-start', sm: 'center' },
                            }}
                        >
                            Pertemuan Terdekat
                        </Button>
                    </Stack>

                    {/* Step 3: Seluruh Pertemuan dari Tahun Ajaran */}
                    <Typography
                        variant="caption"
                        sx={{
                            fontWeight: 800,
                            color: isDark ? '#a1a1aa' : '#64748b',
                            display: 'block',
                            mb: 1,
                            textTransform: 'uppercase',
                            letterSpacing: 0.4,
                        }}
                    >
                        3. Pilih Pertemuan ({filteredMeetings.length} Pertemuan Efektif — Hari Libur Otomatis Dikecualikan)
                    </Typography>

                    {filteredMeetings.length === 0 ? (
                        <Alert
                            severity="info"
                            sx={{
                                borderRadius: 2.5,
                                bgcolor: isDark ? 'rgba(37, 99, 235, 0.1)' : '#eff6ff',
                                border: isDark ? '1px solid #1d4ed8' : '1px solid #bfdbfe',
                            }}
                        >
                            <AlertTitle sx={{ fontWeight: 800 }}>Tidak Ada Pertemuan</AlertTitle>
                            <Typography variant="body2">
                                Tidak ditemukan pertemuan untuk mata pelajaran <strong>{selectedSubject}</strong> di kelas{' '}
                                <strong>{selectedClassObj?.name}</strong> dengan filter status ini.
                            </Typography>
                        </Alert>
                    ) : (
                        <Box
                            sx={{
                                maxHeight: 340,
                                overflowY: 'auto',
                                pr: 0.5,
                            }}
                        >
                            <Grid container spacing={1.25}>
                                {filteredMeetings.map((m) => {
                                    const isSelected =
                                        selectedMeeting?.date === m.date &&
                                        String(selectedMeeting?.jp) === String(m.jp) &&
                                        selectedMeeting?.subject_name === m.subject_name;
                                    const isToday = m.date === todayStr;

                                    return (
                                        <Grid
                                            size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                                            key={`${m.date}-${m.jp}-${m.subject_name}`}
                                        >
                                            <Box
                                                onClick={() => !disabled && onSelectMeeting(m)}
                                                sx={{
                                                    p: 1.5,
                                                    borderRadius: 2.5,
                                                    cursor: disabled ? 'not-allowed' : 'pointer',
                                                    transition: 'all 0.15s ease',
                                                    border: isSelected
                                                        ? '2px solid #2563eb'
                                                        : isToday
                                                        ? '1.5px solid #16a34a'
                                                        : isDark
                                                        ? '1px solid #27272a'
                                                        : '1px solid #e2e8f0',
                                                    bgcolor: isSelected
                                                        ? isDark
                                                            ? 'rgba(37, 99, 235, 0.18)'
                                                            : '#eff6ff'
                                                        : isDark
                                                        ? '#27272a'
                                                        : '#ffffff',
                                                    '&:hover': disabled
                                                        ? {}
                                                        : {
                                                              borderColor: '#2563eb',
                                                              boxShadow: isDark
                                                                  ? '0 4px 12px rgba(0,0,0,0.35)'
                                                                  : '0 4px 12px rgba(37, 99, 235, 0.1)',
                                                          },
                                                }}
                                            >
                                                <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}>
                                                    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                                                        <Chip
                                                            label={`Pertemuan ${m.pertemuan_ke}`}
                                                            size="small"
                                                            color={isSelected ? 'primary' : 'default'}
                                                            sx={{ fontWeight: 800, fontSize: '10.5px', height: 20 }}
                                                        />
                                                        {isToday && (
                                                            <Chip
                                                                label="Hari Ini"
                                                                size="small"
                                                                color="success"
                                                                sx={{ fontWeight: 800, fontSize: '10px', height: 20 }}
                                                            />
                                                        )}
                                                    </Stack>

                                                    {isSelected ? (
                                                        <CheckCircleIcon sx={{ fontSize: 17, color: '#2563eb' }} />
                                                    ) : (
                                                        <RadioButtonUncheckedIcon sx={{ fontSize: 17, color: isDark ? '#52525b' : '#cbd5e1' }} />
                                                    )}
                                                </Stack>

                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontWeight: 800,
                                                        fontSize: '12.5px',
                                                        color: isDark ? '#f4f4f5' : '#0f172a',
                                                    }}
                                                >
                                                    {m.day}, {formatDisplayDate(m.date)}
                                                </Typography>

                                                <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', mt: 0.3 }}>
                                                    <AccessTimeIcon sx={{ fontSize: 13, color: isDark ? '#a1a1aa' : '#64748b' }} />
                                                    <Typography variant="caption" sx={{ color: isDark ? '#d4d4d8' : '#475569', fontWeight: 600 }}>
                                                        JP {m.jp} ({m.time_range || '-'})
                                                    </Typography>
                                                </Stack>

                                                <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', mt: 0.4 }}>
                                                    <MenuBookIcon sx={{ fontSize: 13, color: '#2563eb', flexShrink: 0 }} />
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            fontWeight: 700,
                                                            color: isDark ? '#93c5fd' : '#1d4ed8',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap',
                                                        }}
                                                    >
                                                        {m.subject_name}
                                                    </Typography>
                                                </Stack>

                                                <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mt: 0.75 }}>
                                                    <Typography variant="caption" sx={{ fontSize: '10px', color: isDark ? '#a1a1aa' : '#64748b' }}>
                                                        {m.semester}
                                                    </Typography>
                                                    <Chip
                                                        label={m.is_recorded ? 'Sudah Diabsen' : 'Belum Diabsen'}
                                                        size="small"
                                                        color={m.is_recorded ? 'success' : 'warning'}
                                                        variant={m.is_recorded ? 'filled' : 'outlined'}
                                                        sx={{ height: 18, fontSize: '9.5px', fontWeight: 700 }}
                                                    />
                                                </Stack>
                                            </Box>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </Box>
                    )}
                </>
            )}
        </Card>
    );
};

export default AttendanceSessionFilter;
