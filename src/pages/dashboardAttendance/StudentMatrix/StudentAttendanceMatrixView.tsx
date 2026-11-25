import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Box,
    Typography,
    Stack,
    Card,
    Chip,
    CircularProgress,
    Alert,
    Avatar,
    Tooltip,
    Paper,
    TextField,
    MenuItem,
    InputAdornment,
    Button,
    Fab,
    Tabs,
    Tab,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import RefreshIcon from '@mui/icons-material/Refresh';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { attendanceService } from '@api/attendance/service';
import SchoolInformationService from '@api/schoolinformation/service';
import type { StudentAttendanceMatrixResponse, StudentSubjectAttendance, StudentMeetingAttendance } from '@api/attendance/model';

// ─── School Info types ─────────────────────────────────────────────────────────
interface SchoolInfoItem {
    id_school_information: string;
    periode?: string;
    name_school?: string;
    status?: boolean;
}

// ─── Status Badge ──────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string; border: string }> = {
    HADIR:  { label: 'H', bg: '#dcfce7', color: '#16a34a', border: '#86efac' },
    SAKIT:  { label: 'S', bg: '#fef9c3', color: '#a16207', border: '#fde047' },
    IZIN:   { label: 'I', bg: '#dbeafe', color: '#1d4ed8', border: '#93c5fd' },
    ALPA:   { label: 'A', bg: '#fee2e2', color: '#dc2626', border: '#fca5a5' },
};

const STATUS_CONFIG_DARK: Record<string, { label: string; bg: string; color: string; border: string }> = {
    HADIR:  { label: 'H', bg: 'rgba(22, 163, 74, 0.2)',  color: '#86efac', border: '#16a34a' },
    SAKIT:  { label: 'S', bg: 'rgba(161, 98, 7, 0.2)',   color: '#fde047', border: '#a16207' },
    IZIN:   { label: 'I', bg: 'rgba(29, 78, 216, 0.2)',  color: '#93c5fd', border: '#1d4ed8' },
    ALPA:   { label: 'A', bg: 'rgba(220, 38, 38, 0.2)',  color: '#fca5a5', border: '#dc2626' },
};

interface StatusBadgeProps {
    meeting: StudentMeetingAttendance | undefined;
    isDark: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ meeting, isDark }) => {
    if (!meeting || meeting.is_future || !meeting.status) {
        return (
            <Box
                sx={{
                    width: 32, height: 32, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: isDark ? '#52525b' : '#94a3b8',
                    fontSize: '12px', fontWeight: 700,
                }}
            >
                –
            </Box>
        );
    }

    const cfg = isDark ? STATUS_CONFIG_DARK[meeting.status] : STATUS_CONFIG[meeting.status];
    if (!cfg) return <Box sx={{ width: 32, height: 32 }}>?</Box>;

    const tooltipContent = [
        meeting.date,
        meeting.status,
        meeting.notes ? `Catatan: ${meeting.notes}` : null,
    ].filter(Boolean).join(' · ');

    return (
        <Tooltip title={tooltipContent} placement="top" arrow>
            <Box
                sx={{
                    width: 32, height: 32, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    bgcolor: cfg.bg, color: cfg.color,
                    border: `1.5px solid ${cfg.border}`,
                    fontSize: '11px', fontWeight: 900,
                    cursor: 'default', flexShrink: 0,
                    transition: 'transform 0.15s',
                    '&:hover': { transform: 'scale(1.15)' },
                }}
            >
                {cfg.label}
            </Box>
        </Tooltip>
    );
};

// ─── Percentage Chip ───────────────────────────────────────────────────────────
const PercentageChip: React.FC<{ pct: number; isDark: boolean }> = ({ pct, isDark }) => {
    const isOk = pct >= 75;
    return (
        <Chip
            label={`${pct.toFixed(1)}%`}
            size="small"
            sx={{
                fontWeight: 900, fontSize: '12px',
                bgcolor: isOk
                    ? (isDark ? 'rgba(22,163,74,0.2)' : '#dcfce7')
                    : (isDark ? 'rgba(220,38,38,0.2)' : '#fee2e2'),
                color: isOk
                    ? (isDark ? '#86efac' : '#16a34a')
                    : (isDark ? '#fca5a5' : '#dc2626'),
                border: `1.5px solid ${isOk ? (isDark ? '#16a34a' : '#86efac') : (isDark ? '#dc2626' : '#fca5a5')}`,
            }}
        />
    );
};

// ─── Subject Row ───────────────────────────────────────────────────────────────
const SubjectRow: React.FC<{
    subject: StudentSubjectAttendance;
    meetingColumns: number[];
    isDark: boolean;
}> = ({ subject, meetingColumns, isDark }) => {
    const meetingMap = new Map(subject.meetings.map((m) => [m.pertemuan_ke, m]));
    const isBelow = subject.is_below_threshold;

    return (
        <Box
            component="tr"
            sx={{
                bgcolor: isBelow
                    ? (isDark ? 'rgba(220,38,38,0.07)' : '#fff5f5')
                    : 'transparent',
                '&:hover td': {
                    bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                },
            }}
        >
            {/* Mata Pelajaran */}
            <Box
                component="td"
                sx={{
                    px: 2, py: 1.5,
                    position: 'sticky', left: 0, zIndex: 1,
                    bgcolor: isBelow
                        ? (isDark ? '#1c0a0a' : '#fff5f5')
                        : (isDark ? '#09090b' : '#ffffff'),
                    minWidth: 180, maxWidth: 220,
                    borderRight: `1px solid ${isDark ? '#27272a' : '#e2e8f0'}`,
                    borderBottom: `1px solid ${isDark ? '#27272a' : '#e2e8f0'}`,
                }}
            >
                <Typography variant="body2" sx={{ fontWeight: 800, color: isDark ? '#f4f4f5' : '#0f172a', lineHeight: 1.3 }}>
                    {subject.subject_name}
                    {isBelow && (
                        <WarningAmberIcon
                            sx={{ fontSize: 13, color: '#dc2626', ml: 0.5, verticalAlign: 'middle' }}
                        />
                    )}
                </Typography>
                <Typography variant="caption" sx={{ color: isDark ? '#71717a' : '#94a3b8', display: 'block' }}>
                    {subject.teacher_name || '-'}
                </Typography>
                <Stack direction="row" spacing={0.5} sx={{ mt: 0.5, flexWrap: 'wrap', gap: 0.25 }}>
                    <Chip label={`H:${subject.hadir_count}`} size="small" sx={{ height: 16, fontSize: '9px', fontWeight: 800, bgcolor: isDark ? 'rgba(22,163,74,0.2)' : '#dcfce7', color: isDark ? '#86efac' : '#16a34a' }} />
                    {subject.sakit_count > 0 && <Chip label={`S:${subject.sakit_count}`} size="small" sx={{ height: 16, fontSize: '9px', fontWeight: 800, bgcolor: isDark ? 'rgba(161,98,7,0.2)' : '#fef9c3', color: isDark ? '#fde047' : '#a16207' }} />}
                    {subject.izin_count > 0 && <Chip label={`I:${subject.izin_count}`} size="small" sx={{ height: 16, fontSize: '9px', fontWeight: 800, bgcolor: isDark ? 'rgba(29,78,216,0.2)' : '#dbeafe', color: isDark ? '#93c5fd' : '#1d4ed8' }} />}
                    {subject.alpa_count > 0 && <Chip label={`A:${subject.alpa_count}`} size="small" sx={{ height: 16, fontSize: '9px', fontWeight: 800, bgcolor: isDark ? 'rgba(220,38,38,0.2)' : '#fee2e2', color: isDark ? '#fca5a5' : '#dc2626' }} />}
                </Stack>
            </Box>

            {/* JP */}
            <Box
                component="td"
                sx={{
                    px: 1.5, py: 1.5, textAlign: 'center',
                    borderBottom: `1px solid ${isDark ? '#27272a' : '#e2e8f0'}`,
                    borderRight: `1px solid ${isDark ? '#27272a' : '#e2e8f0'}`,
                    minWidth: 48,
                    bgcolor: 'inherit',
                }}
            >
                <Typography variant="caption" sx={{ fontWeight: 700, color: isDark ? '#a1a1aa' : '#64748b' }}>
                    {subject.jp || '-'}
                </Typography>
            </Box>

            {/* Pertemuan cells */}
            {meetingColumns.map((n) => (
                <Box
                    key={n}
                    component="td"
                    sx={{
                        px: 0.5, py: 1,
                        textAlign: 'center',
                        borderBottom: `1px solid ${isDark ? '#27272a' : '#e2e8f0'}`,
                        borderRight: `1px solid ${isDark ? '#1f1f23' : '#f1f5f9'}`,
                        minWidth: 42,
                        bgcolor: 'inherit',
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <StatusBadge meeting={meetingMap.get(n)} isDark={isDark} />
                    </Box>
                </Box>
            ))}

            {/* Persentase */}
            <Box
                component="td"
                sx={{
                    px: 1.5, py: 1.5, textAlign: 'center',
                    borderBottom: `1px solid ${isDark ? '#27272a' : '#e2e8f0'}`,
                    position: 'sticky', right: 0, zIndex: 1,
                    bgcolor: isBelow
                        ? (isDark ? '#1c0a0a' : '#fff5f5')
                        : (isDark ? '#09090b' : '#ffffff'),
                    borderLeft: `1px solid ${isDark ? '#27272a' : '#e2e8f0'}`,
                    minWidth: 110,
                }}
            >
                <PercentageChip pct={subject.percentage} isDark={isDark} />
                <Typography variant="caption" sx={{ display: 'block', color: isDark ? '#71717a' : '#94a3b8', mt: 0.25, fontSize: '10px' }}>
                    {subject.total_points}/{subject.completed_meetings} poin
                </Typography>
            </Box>
        </Box>
    );
};

// ─── Main Component ────────────────────────────────────────────────────────────
interface StudentAttendanceMatrixViewProps {
    onOpenScan?: () => void;
    refreshTrigger?: number;
}

export const StudentAttendanceMatrixView: React.FC<StudentAttendanceMatrixViewProps> = ({
    onOpenScan,
    refreshTrigger = 0,
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const [schoolInfos, setSchoolInfos] = useState<SchoolInfoItem[]>([]);
    const [selectedSchoolInfoId, setSelectedSchoolInfoId] = useState<string>('');
    const [isLoadingSchoolInfo, setIsLoadingSchoolInfo] = useState(true);

    const [matrixData, setMatrixData] = useState<StudentAttendanceMatrixResponse | null>(null);
    const [isLoadingMatrix, setIsLoadingMatrix] = useState(false);
    const [matrixError, setMatrixError] = useState<string | null>(null);
    const [selectedSemester, setSelectedSemester] = useState<'GANJIL' | 'GENAP'>('GANJIL');

    // Load school info list
    useEffect(() => {
        const fetchSchoolInfos = async () => {
            setIsLoadingSchoolInfo(true);
            const schoolService = new SchoolInformationService();
            try {
                await schoolService.getAll({
                    onSuccess: (res: any) => {
                        const list: SchoolInfoItem[] = Array.isArray(res?.data)
                            ? res.data
                            : Array.isArray(res)
                            ? res
                            : [];
                        setSchoolInfos(list);
                        const active = list.find((s: SchoolInfoItem) => s.status);
                        const toSelect = active || list[0];
                        if (toSelect) {
                            setSelectedSchoolInfoId(toSelect.id_school_information);
                        }
                    },
                    onError: () => {},
                });
            } catch (err: any) {
                console.error('Gagal memuat daftar tahun pelajaran:', err);
            } finally {
                setIsLoadingSchoolInfo(false);
            }
        };
        fetchSchoolInfos();
    }, []);

    // Load matrix data when school info selected
    const loadMatrix = useCallback(async (id: string) => {
        if (!id) return;
        setIsLoadingMatrix(true);
        setMatrixError(null);
        try {
            const data = await attendanceService.getStudentMatrix(id);
            setMatrixData(data);
        } catch (err: any) {
            const msg = err?.response?.data?.detail || err?.message || 'Gagal memuat data kehadiran.';
            setMatrixError(msg);
            setMatrixData(null);
        } finally {
            setIsLoadingMatrix(false);
        }
    }, []);

    useEffect(() => {
        if (selectedSchoolInfoId) {
            loadMatrix(selectedSchoolInfoId);
        }
    }, [selectedSchoolInfoId, refreshTrigger, loadMatrix]);

    const filteredView = useMemo(() => {
        if (!matrixData) return null;

        const semKey = selectedSemester.toLowerCase();
        let totalPointsAll = 0;
        let totalCompletedAll = 0;
        let belowThresholdCount = 0;
        let maxMeetingsSem = 0;

        const subjects: StudentSubjectAttendance[] = matrixData.subjects.map((sub) => {
            const semMeetings = (sub.meetings || [])
                .filter((m) => String(m.semester || '').toLowerCase().includes(semKey))
                .map((m, idx) => ({
                    ...m,
                    pertemuan_ke: idx + 1,
                }));

            let hadir = 0;
            let sakit = 0;
            let izin = 0;
            let alpa = 0;
            let pts = 0;
            let completed = 0;

            for (const m of semMeetings) {
                if (!m.is_future && m.status) {
                    const st = m.status.toUpperCase();
                    if (st === 'HADIR') { hadir += 1; pts += 1.0; completed += 1; }
                    else if (st === 'SAKIT') { sakit += 1; pts += 1.0; completed += 1; }
                    else if (st === 'IZIN') { izin += 1; pts += 0.5; completed += 1; }
                    else if (st === 'ALPA') { alpa += 1; pts += 0.0; completed += 1; }
                }
            }

            const pct = completed > 0 ? Math.round((pts / completed) * 1000) / 10 : 100.0;
            const isBelow = pct < 75.0 && completed > 0;
            if (isBelow) belowThresholdCount += 1;
            totalPointsAll += pts;
            totalCompletedAll += completed;
            if (semMeetings.length > maxMeetingsSem) {
                maxMeetingsSem = semMeetings.length;
            }

            return {
                ...sub,
                meetings: semMeetings,
                hadir_count: hadir,
                sakit_count: sakit,
                izin_count: izin,
                alpa_count: alpa,
                total_points: pts,
                completed_meetings: completed,
                percentage: pct,
                is_below_threshold: isBelow,
            };
        });

        const avgPct = totalCompletedAll > 0
            ? Math.round((totalPointsAll / totalCompletedAll) * 1000) / 10
            : 100.0;

        return {
            subjects,
            maxMeetings: Math.max(maxMeetingsSem, 1),
            overall: {
                ...matrixData.overall,
                average_percentage: avgPct,
                total_points: totalPointsAll,
                total_completed: totalCompletedAll,
                subjects_below_75: belowThresholdCount,
                total_subjects: subjects.length,
            },
        };
    }, [matrixData, selectedSemester]);

    const meetingColumns = filteredView
        ? Array.from({ length: filteredView.maxMeetings }, (_, i) => i + 1)
        : [];

    const avgPct = filteredView?.overall.average_percentage ?? 0;
    const avgColor = avgPct >= 75
        ? (isDark ? '#86efac' : '#16a34a')
        : (isDark ? '#fca5a5' : '#dc2626');

    return (
        <Box sx={{ p: { xs: 1.5, sm: 2.5 }, maxWidth: '100%', position: 'relative', minHeight: '100vh' }}>
            {/* ── HEADER ──────────────────────────────────────────────────────── */}
            <Box
                sx={{
                    mb: 2.5,
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { md: 'center' },
                    justifyContent: 'space-between',
                    gap: 2,
                }}
            >
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                    <Box
                        sx={{
                            width: 44, height: 44, borderRadius: 2.5,
                            bgcolor: '#2563eb', color: '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(37,99,235,0.3)', flexShrink: 0,
                        }}
                    >
                        <FactCheckIcon />
                    </Box>
                    <Box>
                        <Typography
                            variant="h5"
                            sx={{ fontWeight: 900, fontSize: { xs: '1.1rem', sm: '1.35rem' }, color: isDark ? '#f4f4f5' : '#0f172a' }}
                        >
                            Presensi Kehadiran Siswa
                        </Typography>
                        <Typography variant="caption" sx={{ color: isDark ? '#a1a1aa' : '#64748b', display: 'block' }}>
                            Berbasis jadwal pelajaran resmi, mata pelajaran yang diampu guru, kalender akademik, &amp; scan barcode.
                        </Typography>
                    </Box>
                </Stack>

                {/* Controls */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} sx={{ alignItems: { sm: 'center' } }}>
                    {/* School info selector */}
                    <TextField
                        select size="small"
                        disabled={isLoadingSchoolInfo}
                        label="Tahun Pelajaran"
                        value={selectedSchoolInfoId}
                        onChange={(e) => setSelectedSchoolInfoId(e.target.value)}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountBalanceIcon sx={{ fontSize: 18, color: isDark ? '#94a3b8' : '#64748b' }} />
                                    </InputAdornment>
                                ),
                            },
                        }}
                        sx={{
                            minWidth: { xs: '100%', sm: 220 },
                            '& .MuiInputBase-root': { bgcolor: isDark ? '#18181b' : '#ffffff', borderRadius: 2 },
                        }}
                    >
                        {isLoadingSchoolInfo ? (
                            <MenuItem value="">Memuat...</MenuItem>
                        ) : schoolInfos.length === 0 ? (
                            <MenuItem value="">Tidak ada data</MenuItem>
                        ) : (
                            schoolInfos.map((info) => (
                                <MenuItem key={info.id_school_information} value={info.id_school_information}>
                                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                        <span>{info.periode || info.name_school}</span>
                                        {info.status && (
                                            <Chip label="Aktif" size="small" color="primary" sx={{ height: 18, fontSize: '10px' }} />
                                        )}
                                    </Stack>
                                </MenuItem>
                            ))
                        )}
                    </TextField>

                    <Button
                        variant="outlined" size="small"
                        startIcon={isLoadingMatrix ? <CircularProgress size={16} /> : <RefreshIcon />}
                        onClick={() => loadMatrix(selectedSchoolInfoId)}
                        disabled={isLoadingMatrix || !selectedSchoolInfoId}
                        sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2, height: 40, whiteSpace: 'nowrap' }}
                    >
                        Refresh
                    </Button>

                    {onOpenScan && (
                        <Button
                            variant="contained" size="small"
                            startIcon={<QrCodeScannerIcon />}
                            onClick={onOpenScan}
                            sx={{
                                textTransform: 'none', fontWeight: 800, borderRadius: 2, height: 40, whiteSpace: 'nowrap',
                                bgcolor: '#2563eb', '&:hover': { bgcolor: '#1d4ed8' },
                                boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
                            }}
                        >
                            Scan Presensi
                        </Button>
                    )}
                </Stack>
            </Box>

            {/* ── STUDENT INFO CHIP ─────────────────────────────────────────────── */}
            {matrixData && (
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                    <Avatar
                        src={matrixData.student.profile_url || undefined}
                        sx={{ width: 36, height: 36, bgcolor: '#2563eb', fontSize: 14 }}
                    >
                        {matrixData.student.name.charAt(0)}
                    </Avatar>
                    <Box>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: isDark ? '#f4f4f5' : '#0f172a' }}>
                            {matrixData.student.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: isDark ? '#a1a1aa' : '#64748b' }}>
                            NIS: {matrixData.student.nis} &nbsp;·&nbsp; Kelas: {matrixData.student.class_name}
                        </Typography>
                    </Box>
                    <Chip icon={<SchoolIcon sx={{ fontSize: '14px !important' }} />} label={matrixData.student.class_name} size="small" color="primary" sx={{ fontWeight: 700 }} />
                </Stack>
            )}

            {/* ── SUMMARY CARDS ─────────────────────────────────────────────────── */}
            {matrixData && filteredView && (
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2.5 }}>
                    <Card
                        variant="outlined"
                        sx={{
                            flex: 1, p: 2.5, borderRadius: 2.5,
                            bgcolor: isDark ? '#18181b' : '#ffffff',
                            borderColor: isDark ? '#27272a' : '#e2e8f0',
                        }}
                    >
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
                            <TrendingUpIcon sx={{ fontSize: 18, color: isDark ? '#94a3b8' : '#64748b' }} />
                            <Typography variant="caption" sx={{ color: isDark ? '#a1a1aa' : '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Rata-rata Kehadiran ({selectedSemester === 'GANJIL' ? 'Semester Ganjil' : 'Semester Genap'})
                            </Typography>
                        </Stack>
                        <Typography variant="h4" sx={{ fontWeight: 900, color: avgColor }}>
                            {avgPct.toFixed(1)}%
                        </Typography>
                        <Typography variant="caption" sx={{ color: isDark ? '#71717a' : '#94a3b8' }}>
                            {filteredView.overall.total_points} poin dari {filteredView.overall.total_completed} pertemuan tercatat
                        </Typography>
                    </Card>

                    <Card
                        variant="outlined"
                        sx={{
                            flex: 1, p: 2.5, borderRadius: 2.5,
                            bgcolor: isDark ? '#18181b' : '#ffffff',
                            borderColor: filteredView.overall.subjects_below_75 > 0
                                ? (isDark ? '#dc2626' : '#fca5a5')
                                : (isDark ? '#27272a' : '#e2e8f0'),
                        }}
                    >
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
                            <WarningAmberIcon sx={{ fontSize: 18, color: filteredView.overall.subjects_below_75 > 0 ? '#dc2626' : (isDark ? '#94a3b8' : '#64748b') }} />
                            <Typography variant="caption" sx={{ color: isDark ? '#a1a1aa' : '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Syarat Ujian (&ge; 75%)
                            </Typography>
                        </Stack>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 900,
                                color: filteredView.overall.subjects_below_75 > 0
                                    ? (isDark ? '#fca5a5' : '#dc2626')
                                    : (isDark ? '#86efac' : '#16a34a'),
                            }}
                        >
                            {filteredView.overall.subjects_below_75 > 0
                                ? `${filteredView.overall.subjects_below_75} MK di Bawah 75%`
                                : 'Semua Memenuhi'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: isDark ? '#71717a' : '#94a3b8' }}>
                            {filteredView.overall.total_subjects} mata pelajaran total
                        </Typography>
                    </Card>
                </Stack>
            )}

            {/* ── SEMESTER TABS (GANJIL / GENAP) ─────────────────────────────────── */}
            {matrixData && !isLoadingMatrix && matrixData.subjects.length > 0 && (
                <Box sx={{ mb: 2 }}>
                    <Tabs
                        value={selectedSemester}
                        onChange={(_, val) => setSelectedSemester(val)}
                        sx={{
                            minHeight: 40,
                            bgcolor: isDark ? '#18181b' : '#f1f5f9',
                            borderRadius: 2,
                            p: 0.5,
                            display: 'inline-flex',
                            '& .MuiTabs-indicator': { display: 'none' },
                            '& .MuiTab-root': {
                                minHeight: 34,
                                py: 0.5,
                                px: 2.5,
                                borderRadius: 1.5,
                                textTransform: 'none',
                                fontWeight: 800,
                                fontSize: '0.82rem',
                                color: isDark ? '#a1a1aa' : '#64748b',
                            },
                            '& .Mui-selected': {
                                bgcolor: isDark ? '#2563eb' : '#ffffff',
                                color: isDark ? '#ffffff !important' : '#1d4ed8 !important',
                                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                            },
                        }}
                    >
                        <Tab value="GANJIL" label="Semester Ganjil" />
                        <Tab value="GENAP" label="Semester Genap" />
                    </Tabs>
                </Box>
            )}

            {/* ── LOADING / ERROR ────────────────────────────────────────────────── */}
            {isLoadingMatrix && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <Stack spacing={2} sx={{ alignItems: 'center' }}>
                        <CircularProgress />
                        <Typography variant="body2" sx={{ color: isDark ? '#a1a1aa' : '#64748b' }}>
                            Memuat data kehadiran...
                        </Typography>
                    </Stack>
                </Box>
            )}

            {matrixError && !isLoadingMatrix && (
                <Alert
                    severity="error"
                    sx={{ mb: 2.5, borderRadius: 2 }}
                    action={
                        <Button size="small" color="inherit" onClick={() => loadMatrix(selectedSchoolInfoId)}>
                            Coba Lagi
                        </Button>
                    }
                >
                    {matrixError}
                </Alert>
            )}

            {/* ── MATRIX TABLE ───────────────────────────────────────────────────── */}
            {matrixData && !isLoadingMatrix && matrixData.subjects.length > 0 && (
                <Card
                    variant="outlined"
                    sx={{
                        borderRadius: 2.5, overflow: 'hidden',
                        bgcolor: isDark ? '#09090b' : '#ffffff',
                        borderColor: isDark ? '#27272a' : '#e2e8f0',
                        mb: 2.5,
                    }}
                >
                    <Box sx={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                        <Box
                            component="table"
                            sx={{
                                borderCollapse: 'collapse', width: '100%', minWidth: 600,
                                tableLayout: 'auto',
                            }}
                        >
                            {/* THEAD */}
                            <Box component="thead">
                                <Box component="tr">
                                    {/* Mata Pelajaran header */}
                                    <Box
                                        component="th"
                                        sx={{
                                            px: 2, py: 1.5, textAlign: 'left',
                                            position: 'sticky', left: 0, zIndex: 2,
                                            bgcolor: isDark ? '#18181b' : '#f8fafc',
                                            borderBottom: `2px solid ${isDark ? '#27272a' : '#e2e8f0'}`,
                                            borderRight: `1px solid ${isDark ? '#27272a' : '#e2e8f0'}`,
                                            minWidth: 180,
                                        }}
                                    >
                                        <Typography variant="caption" sx={{ fontWeight: 900, color: isDark ? '#a1a1aa' : '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            Mata Pelajaran
                                        </Typography>
                                    </Box>

                                    {/* JP header */}
                                    <Box
                                        component="th"
                                        sx={{
                                            px: 1.5, py: 1.5, textAlign: 'center',
                                            bgcolor: isDark ? '#18181b' : '#f8fafc',
                                            borderBottom: `2px solid ${isDark ? '#27272a' : '#e2e8f0'}`,
                                            borderRight: `1px solid ${isDark ? '#27272a' : '#e2e8f0'}`,
                                            minWidth: 48,
                                        }}
                                    >
                                        <Typography variant="caption" sx={{ fontWeight: 900, color: isDark ? '#a1a1aa' : '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            JP
                                        </Typography>
                                    </Box>

                                    {/* Pertemuan span header */}
                                    <Box
                                        component="th"
                                        colSpan={meetingColumns.length}
                                        sx={{
                                            px: 2, py: 1,
                                            bgcolor: isDark ? '#18181b' : '#f8fafc',
                                            borderBottom: `1px solid ${isDark ? '#27272a' : '#e2e8f0'}`,
                                            textAlign: 'center',
                                        }}
                                    >
                                        <Typography variant="caption" sx={{ fontWeight: 900, color: isDark ? '#a1a1aa' : '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            Pertemuan ({selectedSemester === 'GANJIL' ? 'Semester Ganjil' : 'Semester Genap'})
                                        </Typography>
                                    </Box>

                                    {/* Persentase header */}
                                    <Box
                                        component="th"
                                        sx={{
                                            px: 1.5, py: 1.5, textAlign: 'center',
                                            position: 'sticky', right: 0, zIndex: 2,
                                            bgcolor: isDark ? '#18181b' : '#f8fafc',
                                            borderBottom: `2px solid ${isDark ? '#27272a' : '#e2e8f0'}`,
                                            borderLeft: `1px solid ${isDark ? '#27272a' : '#e2e8f0'}`,
                                            minWidth: 110,
                                        }}
                                    >
                                        <Typography variant="caption" sx={{ fontWeight: 900, color: isDark ? '#a1a1aa' : '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '9px' }}>
                                            % Kehadiran
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Sub-header: meeting numbers */}
                                <Box component="tr">
                                    <Box component="th" sx={{ bgcolor: isDark ? '#18181b' : '#f8fafc', position: 'sticky', left: 0, zIndex: 2, borderBottom: `1px solid ${isDark ? '#27272a' : '#e2e8f0'}`, borderRight: `1px solid ${isDark ? '#27272a' : '#e2e8f0'}` }} />
                                    <Box component="th" sx={{ bgcolor: isDark ? '#18181b' : '#f8fafc', borderBottom: `1px solid ${isDark ? '#27272a' : '#e2e8f0'}`, borderRight: `1px solid ${isDark ? '#27272a' : '#e2e8f0'}` }} />
                                    {meetingColumns.map((n) => (
                                        <Box
                                            key={n}
                                            component="th"
                                            sx={{
                                                px: 0.5, py: 1, textAlign: 'center',
                                                bgcolor: isDark ? '#18181b' : '#f8fafc',
                                                borderBottom: `1px solid ${isDark ? '#27272a' : '#e2e8f0'}`,
                                                borderRight: `1px solid ${isDark ? '#1f1f23' : '#f1f5f9'}`,
                                                minWidth: 42,
                                            }}
                                        >
                                            <Typography variant="caption" sx={{ fontWeight: 800, color: isDark ? '#71717a' : '#94a3b8', fontSize: '10px' }}>
                                                {n}
                                            </Typography>
                                        </Box>
                                    ))}
                                    <Box component="th" sx={{ bgcolor: isDark ? '#18181b' : '#f8fafc', position: 'sticky', right: 0, zIndex: 2, borderBottom: `1px solid ${isDark ? '#27272a' : '#e2e8f0'}`, borderLeft: `1px solid ${isDark ? '#27272a' : '#e2e8f0'}` }} />
                                </Box>
                            </Box>

                            {/* TBODY */}
                            <Box component="tbody">
                                {(filteredView?.subjects || []).map((subject, idx) => (
                                    <SubjectRow
                                        key={`${subject.subject_name}-${idx}`}
                                        subject={subject}
                                        meetingColumns={meetingColumns}
                                        isDark={isDark}
                                    />
                                ))}
                            </Box>
                        </Box>
                    </Box>
                </Card>
            )}

            {/* Empty state */}
            {matrixData && !isLoadingMatrix && matrixData.subjects.length === 0 && (
                <Card
                    variant="outlined"
                    sx={{
                        p: 5, textAlign: 'center', borderRadius: 2.5,
                        bgcolor: isDark ? '#18181b' : '#ffffff',
                        borderColor: isDark ? '#27272a' : '#e2e8f0',
                        mb: 2.5,
                    }}
                >
                    <FactCheckIcon sx={{ fontSize: 48, color: isDark ? '#3f3f46' : '#cbd5e1', mb: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 800, color: isDark ? '#71717a' : '#94a3b8' }}>
                        Belum Ada Data Kehadiran
                    </Typography>
                    <Typography variant="body2" sx={{ color: isDark ? '#52525b' : '#94a3b8', mt: 0.5 }}>
                        Data kehadiran belum tersedia untuk tahun pelajaran ini.
                    </Typography>
                </Card>
            )}

            {/* ── LEGEND POIN ───────────────────────────────────────────────────── */}
            <Paper
                variant="outlined"
                sx={{
                    p: 2, borderRadius: 2.5, mb: 10,
                    bgcolor: isDark ? '#18181b' : '#f8fafc',
                    borderColor: isDark ? '#27272a' : '#e2e8f0',
                }}
            >
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1 }}>
                    <InfoOutlinedIcon sx={{ fontSize: 16, color: isDark ? '#94a3b8' : '#64748b' }} />
                    <Typography variant="caption" sx={{ fontWeight: 900, color: isDark ? '#a1a1aa' : '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Sistem Penilaian Kehadiran
                    </Typography>
                </Stack>
                <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap', gap: 1 }}>
                    <Chip label="H = Hadir (1 poin)" size="small" sx={{ fontWeight: 800, bgcolor: isDark ? 'rgba(22,163,74,0.2)' : '#dcfce7', color: isDark ? '#86efac' : '#16a34a', border: `1px solid ${isDark ? '#16a34a' : '#86efac'}` }} />
                    <Chip label="S = Sakit (1 poin – surat dokter)" size="small" sx={{ fontWeight: 800, bgcolor: isDark ? 'rgba(161,98,7,0.2)' : '#fef9c3', color: isDark ? '#fde047' : '#a16207', border: `1px solid ${isDark ? '#a16207' : '#fde047'}` }} />
                    <Chip label="I = Izin (0,5 poin)" size="small" sx={{ fontWeight: 800, bgcolor: isDark ? 'rgba(29,78,216,0.2)' : '#dbeafe', color: isDark ? '#93c5fd' : '#1d4ed8', border: `1px solid ${isDark ? '#1d4ed8' : '#93c5fd'}` }} />
                    <Chip label="A = Alpa (0 poin)" size="small" sx={{ fontWeight: 800, bgcolor: isDark ? 'rgba(220,38,38,0.2)' : '#fee2e2', color: isDark ? '#fca5a5' : '#dc2626', border: `1px solid ${isDark ? '#dc2626' : '#fca5a5'}` }} />
                </Stack>
                <Typography variant="caption" sx={{ display: 'block', mt: 1, color: isDark ? '#71717a' : '#94a3b8' }}>
                    Rumus: % Kehadiran = (Jumlah Poin ÷ Total Pertemuan) × 100% &nbsp;·&nbsp; Syarat Ujian: ≥ 75%
                </Typography>
            </Paper>

            {/* ── FAB Scan ──────────────────────────────────────────────────────── */}
            {onOpenScan && (
                <Fab
                    color="primary"
                    variant="extended"
                    onClick={onOpenScan}
                    sx={{
                        position: 'fixed', bottom: 24, right: 24, zIndex: 100,
                        bgcolor: '#2563eb', '&:hover': { bgcolor: '#1d4ed8' },
                        boxShadow: '0 6px 20px rgba(37,99,235,0.4)',
                        fontWeight: 800, textTransform: 'none', gap: 1,
                    }}
                >
                    <QrCodeScannerIcon />
                    Scan Presensi
                </Fab>
            )}
        </Box>
    );
};

export default StudentAttendanceMatrixView;
