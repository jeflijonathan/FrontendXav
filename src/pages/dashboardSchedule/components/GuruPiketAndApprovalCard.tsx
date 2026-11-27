import React, { useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Card,
    Chip,
    Grid,
    IconButton,
    Paper,
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
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import VerifiedIcon from '@mui/icons-material/Verified';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import LinkIcon from '@mui/icons-material/Link';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import DownloadIcon from '@mui/icons-material/Download';

import { useScheduleStore } from '../store/useScheduleStore';
import { useSchedulePermissions } from '../utils/permissions';
import { GoogleDrivePreview } from '@components/GoogleDrivePreview/GoogleDrivePreview';
import { parseGoogleDriveUrl } from '@utils/googleDrive';
import GuruPiketFormDialog from './GuruPiketFormDialog';
import type { DayName, GuruPiketEntry } from '../types';

const DAYS: DayName[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export const GuruPiketAndApprovalCard: React.FC = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const {
        guruPiket,
        deleteGuruPiket,
        conflicts,
        approvalData,
        confirmApproval,
        revokeApproval,
        schoolInformations,
        idSchoolInformation,
        teachers,
    } = useScheduleStore();

    const { canEditSchedule, isKepalaSekolah } = useSchedulePermissions();

    // Dialog form guru piket
    const [isPiketDialogOpen, setIsPiketDialogOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [defaultDay, setDefaultDay] = useState<DayName | undefined>(undefined);

    // Form pengesahan kepala sekolah
    const [driveUrlInput, setDriveUrlInput] = useState(approvalData?.googleDriveUrl || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Data kepala sekolah aktif dari schoolInformation
    const activeSchoolInfo = schoolInformations.find(
        (i) => i.id_school_information === idSchoolInformation
    );
    const periodeLabel = activeSchoolInfo?.periode || activeSchoolInfo?.name_school || 'Periode Berjalan';

    // Helper: Hitung bentrok piket untuk setiap guru piket
    const getPiketConflicts = (piket: GuruPiketEntry) => {
        return conflicts.filter((c) => {
            if (c.conflictType !== 'PIKET_CONFLICT') return false;
            if (c.day !== piket.hari) return false;
            if (piket.teacherCode && c.teacherCode === piket.teacherCode) return true;
            if (piket.name && c.teacherName && (
                c.teacherName.toLowerCase().includes(piket.name.toLowerCase()) ||
                piket.name.toLowerCase().includes(c.teacherName.toLowerCase())
            )) return true;
            return false;
        });
    };

    const totalPiketConflicts = conflicts.filter((c) => c.conflictType === 'PIKET_CONFLICT').length;

    const handleOpenAddPiket = (day?: DayName) => {
        setEditingIndex(null);
        setDefaultDay(day);
        setIsPiketDialogOpen(true);
    };

    const handleOpenEditPiket = (index: number) => {
        setEditingIndex(index);
        setDefaultDay(undefined);
        setIsPiketDialogOpen(true);
    };

    const handleDeletePiket = (index: number, name: string) => {
        if (window.confirm(`Hapus jadwal guru piket untuk ${name}?`)) {
            deleteGuruPiket(index);
        }
    };

    // Handler konfirmasi pengesahan Kepala Sekolah
    const handleConfirmApproval = async () => {
        if (!isKepalaSekolah) return;
        setIsSubmitting(true);
        try {
            await confirmApproval(driveUrlInput.trim());
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRevokeApproval = async () => {
        if (!isKepalaSekolah) return;
        if (window.confirm('Yakin ingin membatalkan status pengesahan dokumen jadwal ini?')) {
            setIsSubmitting(true);
            try {
                await revokeApproval();
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const driveParse = parseGoogleDriveUrl(driveUrlInput || approvalData?.googleDriveUrl);

    return (
        <>
            <Box sx={{ mb: 4, width: '100%', display: 'flex', flexDirection: 'column', gap: 3.5 }}>
                {/* ======================================================== */}
                {/* 1. TABEL JADWAL GURU PIKET PER PERIODE (1 HARI = 1 GURU) */}
                {/* ======================================================== */}
                <Card
                    elevation={0}
                    sx={{
                        borderRadius: 3,
                        border: isDark ? '1px solid #27272a' : '1px solid #cbd5e1',
                        p: { xs: 2, sm: 2.5 },
                        bgcolor: isDark ? '#141416' : '#ffffff',
                        boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.5)' : '0 1px 3px rgba(0,0,0,0.05)',
                    }}
                >
                    {/* Header Tabel Guru Piket */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'flex-start', sm: 'center' },
                            justifyContent: 'space-between',
                            gap: 1.5,
                            mb: 2.5,
                            pb: 2,
                            borderBottom: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
                        }}
                    >
                        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                            <Box
                                sx={{
                                    width: 40,
                                    height: 40,
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
                                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: isDark ? '#f4f4f5' : '#0f172a', letterSpacing: 0.3 }}>
                                    TABEL JADWAL GURU PIKET (HARIAN)
                                </Typography>
                                <Typography variant="caption" sx={{ color: isDark ? '#a1a1aa' : '#64748b' }}>
                                    Tahun Pelajaran: <strong>{periodeLabel}</strong> • Setiap hari diawasi oleh 1 Guru Piket
                                </Typography>
                            </Box>
                        </Stack>

                        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', alignItems: 'center' }}>
                            {totalPiketConflicts > 0 ? (
                                <Chip
                                    icon={<WarningAmberIcon sx={{ fontSize: '15px !important' }} />}
                                    label={`${totalPiketConflicts} Bentrok Jadwal Piket!`}
                                    color="error"
                                    size="small"
                                    sx={{ fontWeight: 800 }}
                                />
                            ) : (
                                <Chip
                                    icon={<CheckCircleOutlineIcon sx={{ fontSize: '15px !important' }} />}
                                    label="Semua Guru Piket Bebas Bentrok"
                                    color="success"
                                    size="small"
                                    sx={{ fontWeight: 700 }}
                                />
                            )}

                            {canEditSchedule && (
                                <Button
                                    variant="contained"
                                    size="small"
                                    startIcon={<AddIcon />}
                                    onClick={() => handleOpenAddPiket()}
                                    sx={{
                                        bgcolor: '#4f46e5',
                                        textTransform: 'none',
                                        fontWeight: 700,
                                        borderRadius: 2,
                                        '&:hover': { bgcolor: '#4338ca' },
                                    }}
                                >
                                    Tambah Guru Piket
                                </Button>
                            )}
                        </Stack>
                    </Box>

                    {/* Banner Keterangan Aturan Bentrok */}
                    <Alert severity="info" sx={{ mb: 2.5, borderRadius: 2, py: 0.75 }}>
                        <Typography variant="caption" sx={{ display: 'block', color: isDark ? '#93c5fd' : '#1e3a8a', lineHeight: 1.5 }}>
                            💡 <strong>Aturan Deteksi Bentrok Otomatis:</strong> 1 Hari diawasi oleh 1 Guru Piket. Jika guru yang bersangkutan memiliki jadwal mengajar di kelas pada hari & slot jam pelajaran (JP) piket yang sama, sistem otomatis menandai status <strong>BENTROK (MERAH)</strong> pada tabel dan matriks jadwal.
                        </Typography>
                    </Alert>

                    {/* Tabel Guru Piket per Hari */}
                    <TableContainer component={Paper} elevation={0} sx={{ border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0', borderRadius: 2.5, overflow: 'hidden', bgcolor: isDark ? '#141416' : '#ffffff' }}>
                        <Table size="small">
                            <TableHead sx={{ bgcolor: isDark ? '#18181b' : '#f8fafc' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 800, color: isDark ? '#cbd5e1' : '#334155', width: 110, borderBottom: isDark ? '1px solid #27272a' : undefined }}>HARI</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: isDark ? '#cbd5e1' : '#334155', minWidth: 200, borderBottom: isDark ? '1px solid #27272a' : undefined }}>GURU PENGAWAS PIKET</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: isDark ? '#cbd5e1' : '#334155', minWidth: 220, borderBottom: isDark ? '1px solid #27272a' : undefined }}>JAM PIKET (SLOT JP)</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: isDark ? '#cbd5e1' : '#334155', width: 140, borderBottom: isDark ? '1px solid #27272a' : undefined }}>PERAN</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: isDark ? '#cbd5e1' : '#334155', minWidth: 160, borderBottom: isDark ? '1px solid #27272a' : undefined }}>STATUS BENTROK</TableCell>
                                    {canEditSchedule && (
                                        <TableCell sx={{ fontWeight: 800, color: isDark ? '#cbd5e1' : '#334155', width: 110, textAlign: 'center', borderBottom: isDark ? '1px solid #27272a' : undefined }}>AKSI</TableCell>
                                    )}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {DAYS.map((day) => {
                                    const piketIndex = guruPiket.findIndex((p) => p.hari === day);
                                    const piket = piketIndex !== -1 ? guruPiket[piketIndex] : null;
                                    const piketConflicts = piket ? getPiketConflicts(piket) : [];
                                    const hasConflict = piketConflicts.length > 0;
                                    const teacher = piket?.teacherCode ? teachers.find((t) => t.code === piket.teacherCode) : null;

                                    // Susun daftar slot terpilih
                                    const slotsList = piket?.slots && piket.slots.length > 0
                                        ? piket.slots
                                        : Array.from({ length: Number(piket?.jumlahJp) || 4 }, (_, i) => i + 1);

                                    return (
                                        <TableRow
                                            key={day}
                                            sx={{
                                                bgcolor: hasConflict
                                                    ? (isDark ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2')
                                                    : piket
                                                    ? (isDark ? '#141416' : '#ffffff')
                                                    : (isDark ? '#18181b' : '#f8fafc'),
                                                '&:hover': {
                                                    bgcolor: hasConflict
                                                        ? (isDark ? 'rgba(239, 68, 68, 0.25)' : '#fee2e2')
                                                        : (isDark ? '#1e1e24' : '#f1f5f9'),
                                                },
                                                transition: 'all 0.15s ease',
                                                borderBottom: isDark ? '1px solid #27272a' : undefined,
                                            }}
                                        >
                                            {/* Hari */}
                                            <TableCell sx={{ verticalAlign: 'middle', borderBottom: isDark ? '1px solid #27272a' : undefined }}>
                                                <Chip
                                                    label={day.toUpperCase()}
                                                    size="small"
                                                    sx={{
                                                        fontWeight: 900,
                                                        fontSize: '11px',
                                                        letterSpacing: 0.5,
                                                        bgcolor: piket
                                                            ? hasConflict
                                                                ? (isDark ? 'rgba(239, 68, 68, 0.3)' : '#fee2e2')
                                                                : (isDark ? 'rgba(22, 101, 52, 0.3)' : '#dcfce7')
                                                            : (isDark ? '#27272a' : '#e2e8f0'),
                                                        color: piket
                                                            ? hasConflict
                                                                ? (isDark ? '#f87171' : '#b91c1c')
                                                                : (isDark ? '#86efac' : '#15803d')
                                                            : (isDark ? '#a1a1aa' : '#64748b'),
                                                        borderRadius: 1.5,
                                                    }}
                                                />
                                            </TableCell>

                                            {/* Guru Piket */}
                                            <TableCell sx={{ verticalAlign: 'middle', borderBottom: isDark ? '1px solid #27272a' : undefined }}>
                                                {piket ? (
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                                                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                                                            {piket.teacherCode && (
                                                                <Chip
                                                                    label={`#${piket.teacherCode}`}
                                                                    size="small"
                                                                    sx={{
                                                                        fontWeight: 800,
                                                                        bgcolor: isDark ? 'rgba(99, 102, 241, 0.25)' : '#e0e7ff',
                                                                        color: isDark ? '#a5b4fc' : '#3730a3',
                                                                        height: 20,
                                                                        fontSize: '10px',
                                                                    }}
                                                                />
                                                            )}
                                                            <Typography variant="body2" sx={{ fontWeight: 700, color: isDark ? '#f4f4f5' : '#0f172a' }}>
                                                                {piket.name}
                                                            </Typography>
                                                        </Stack>
                                                        <Typography variant="caption" sx={{ color: isDark ? '#a1a1aa' : '#64748b' }}>
                                                            {teacher?.subjectName || 'Tenaga Pengajar'} {teacher?.niy ? `(NIY: ${teacher.niy})` : ''}
                                                        </Typography>
                                                    </Box>
                                                ) : (
                                                    <Typography variant="caption" sx={{ color: isDark ? '#71717a' : '#94a3b8', fontStyle: 'italic' }}>
                                                        Belum ada guru piket ditugaskan
                                                    </Typography>
                                                )}
                                            </TableCell>

                                            {/* Jam Piket (Slot JP Hijau Sesuai Gambar User) */}
                                            <TableCell sx={{ verticalAlign: 'middle', borderBottom: isDark ? '1px solid #27272a' : undefined }}>
                                                {piket ? (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                                        {/* Badge Total JP */}
                                                        <Chip
                                                            size="small"
                                                            label={`${piket.jumlahJp || slotsList.length} JP`}
                                                            sx={{
                                                                height: 20,
                                                                fontSize: '10px',
                                                                fontWeight: 800,
                                                                bgcolor: hasConflict
                                                                    ? (isDark ? 'rgba(239, 68, 68, 0.3)' : '#fca5a5')
                                                                    : (isDark ? 'rgba(22, 101, 52, 0.3)' : '#bbf7d0'),
                                                                color: hasConflict
                                                                    ? (isDark ? '#fca5a5' : '#991b1b')
                                                                    : (isDark ? '#86efac' : '#166534'),
                                                            }}
                                                        />

                                                        {/* Kotak-kotak Hijau [1], [2], [3]... */}
                                                        <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap' }}>
                                                            {slotsList.map((slotNum) => {
                                                                const isSlotConflicted = piketConflicts.some((c) => Number(c.jp) === slotNum);
                                                                return (
                                                                    <Box
                                                                        key={slotNum}
                                                                        sx={{
                                                                            minWidth: 26,
                                                                            height: 24,
                                                                            px: 0.5,
                                                                            borderRadius: 1,
                                                                            bgcolor: isSlotConflicted ? '#ef4444' : '#16a34a',
                                                                            color: '#ffffff',
                                                                            display: 'inline-flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            fontWeight: 900,
                                                                            fontSize: '11px',
                                                                            fontFamily: 'monospace',
                                                                            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                                                        }}
                                                                        title={isSlotConflicted ? `Jam Ke-${slotNum} BENTROK dengan jadwal mengajar!` : `Jam Ke-${slotNum}`}
                                                                    >
                                                                        [{slotNum}]
                                                                    </Box>
                                                                );
                                                            })}
                                                        </Stack>
                                                    </Box>
                                                ) : (
                                                    <Typography variant="caption" sx={{ color: isDark ? '#71717a' : '#cbd5e1' }}>
                                                        -
                                                    </Typography>
                                                )}
                                            </TableCell>

                                            {/* Peran */}
                                            <TableCell sx={{ verticalAlign: 'middle', borderBottom: isDark ? '1px solid #27272a' : undefined }}>
                                                {piket ? (
                                                    <Box>
                                                        <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#e4e4e7' : '#334155', fontSize: '12px' }}>
                                                            {piket.role || 'Anggota Piket'}
                                                        </Typography>
                                                        {piket.notes && (
                                                            <Typography variant="caption" sx={{ color: isDark ? '#a1a1aa' : '#64748b', display: 'block', fontSize: '11px' }}>
                                                                {piket.notes}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                ) : (
                                                    <Typography variant="caption" sx={{ color: isDark ? '#71717a' : '#cbd5e1' }}>
                                                        -
                                                    </Typography>
                                                )}
                                            </TableCell>

                                            {/* Status Bentrok */}
                                            <TableCell sx={{ verticalAlign: 'middle', borderBottom: isDark ? '1px solid #27272a' : undefined }}>
                                                {piket ? (
                                                    hasConflict ? (
                                                        <Tooltip
                                                            title={
                                                                <Box sx={{ p: 0.5 }}>
                                                                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#fca5a5', display: 'block' }}>
                                                                        ⚠️ Rincian Bentrok Mengajar:
                                                                    </Typography>
                                                                    {piketConflicts.map((c, idx) => (
                                                                        <Typography key={idx} variant="caption" sx={{ display: 'block' }}>
                                                                            • Jam Ke-{c.jp} ({c.timeRange}) di Kelas {c.conflictedClasses.join(', ')}
                                                                        </Typography>
                                                                    ))}
                                                                </Box>
                                                            }
                                                            arrow
                                                        >
                                                            <Chip
                                                                icon={<WarningAmberIcon sx={{ fontSize: '14px !important', color: '#ffffff !important' }} />}
                                                                label={`BENTROK (${piketConflicts.length} Slot)`}
                                                                size="small"
                                                                sx={{
                                                                    bgcolor: '#ef4444',
                                                                    color: '#ffffff',
                                                                    fontWeight: 800,
                                                                    fontSize: '11px',
                                                                    cursor: 'pointer',
                                                                }}
                                                            />
                                                        </Tooltip>
                                                    ) : (
                                                        <Chip
                                                            icon={<CheckCircleIcon sx={{ fontSize: '14px !important', color: isDark ? '#4ade80 !important' : '#16a34a !important' }} />}
                                                            label="Bebas Bentrok"
                                                            size="small"
                                                            sx={{
                                                                bgcolor: isDark ? 'rgba(22, 101, 52, 0.25)' : '#dcfce7',
                                                                color: isDark ? '#86efac' : '#15803d',
                                                                fontWeight: 700,
                                                                fontSize: '11px',
                                                            }}
                                                        />
                                                    )
                                                ) : (
                                                    <Chip
                                                        icon={<EventBusyIcon sx={{ fontSize: '13px !important' }} />}
                                                        label="Kosong"
                                                        size="small"
                                                        sx={{ bgcolor: isDark ? '#27272a' : '#f1f5f9', color: isDark ? '#71717a' : '#94a3b8', fontSize: '10px' }}
                                                    />
                                                )}
                                            </TableCell>

                                            {/* Aksi */}
                                            {canEditSchedule && (
                                                <TableCell sx={{ textAlign: 'center', verticalAlign: 'middle', borderBottom: isDark ? '1px solid #27272a' : undefined }}>
                                                    {piket ? (
                                                        <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'center' }}>
                                                            <Tooltip title="Edit Jam & Slot Guru Piket">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => handleOpenEditPiket(piketIndex)}
                                                                    sx={{ color: '#4f46e5', '&:hover': { bgcolor: '#ede9fe' } }}
                                                                >
                                                                    <EditIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Hapus Tugas Piket">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => handleDeletePiket(piketIndex, piket.name)}
                                                                    sx={{ color: '#ef4444', '&:hover': { bgcolor: '#fee2e2' } }}
                                                                >
                                                                    <DeleteIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Stack>
                                                    ) : (
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={() => handleOpenAddPiket(day)}
                                                            sx={{
                                                                fontSize: '10px',
                                                                textTransform: 'none',
                                                                fontWeight: 700,
                                                                py: 0.3,
                                                                borderRadius: 1.5,
                                                            }}
                                                        >
                                                            + Tugaskan
                                                        </Button>
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

                {/* ======================================================== */}
                {/* 2. LEMBAR PENGESAHAN DOKUMEN JADWAL (KEPALA SEKOLAH)     */}
                {/* ======================================================== */}
                <Grid>
                    <Card
                        elevation={0}
                        sx={{
                            borderRadius: 3,
                            border: approvalData?.isApproved
                                ? (isDark ? '2px solid #22c55e' : '2px solid #16a34a')
                                : (isDark ? '1px solid #27272a' : '1px solid #cbd5e1'),
                            p: 2.5,
                            bgcolor: isDark ? '#141416' : '#ffffff',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            height: '100%',
                            position: 'relative',
                            boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.5)' : '0 1px 3px rgba(0,0,0,0.05)',
                        }}
                    >
                        {/* Header Pengesahan */}
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box
                                    sx={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: 2,
                                        bgcolor: approvalData?.isApproved
                                            ? (isDark ? 'rgba(34, 197, 94, 0.2)' : '#dcfce7')
                                            : (isDark ? 'rgba(99, 102, 241, 0.2)' : '#e0e7ff'),
                                        color: approvalData?.isApproved ? '#4ade80' : '#818cf8',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <VerifiedIcon fontSize="small" />
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: isDark ? '#f4f4f5' : '#0f172a' }}>
                                        LEMBAR PENGESAHAN DOKUMEN JADWAL
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: isDark ? '#a1a1aa' : '#64748b' }}>
                                        Dokumen jadwal yang sudah dicetak &amp; ditandatangani resmi oleh Kepala Sekolah
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Status Chip */}
                            {approvalData?.isApproved ? (
                                <Chip
                                    icon={<CheckCircleIcon sx={{ fontSize: '14px !important' }} />}
                                    label="Disahkan Kepala Sekolah"
                                    color="success"
                                    size="small"
                                    sx={{ fontWeight: 800 }}
                                />
                            ) : (
                                <Chip
                                    icon={<LockIcon sx={{ fontSize: '14px !important' }} />}
                                    label="Menunggu Pengesahan"
                                    size="small"
                                    sx={{ bgcolor: isDark ? 'rgba(217, 119, 6, 0.2)' : '#fef3c7', color: isDark ? '#fbbf24' : '#b45309', fontWeight: 700 }}
                                />
                            )}
                        </Box>

                        {!isKepalaSekolah && (
                            <Alert severity="warning" icon={<LockIcon fontSize="inherit" />} sx={{ mb: 2, borderRadius: 2 }}>
                                <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>
                                    Akses Khusus Kepala Sekolah:
                                </Typography>
                                <Typography variant="caption" sx={{ display: 'block' }}>
                                    Fitur input link Google Drive dan tombol konfirmasi pengesahan jadwal ini hanya dapat digunakan oleh <strong>Kepala Sekolah</strong>.
                                </Typography>
                            </Alert>
                        )}

                        <Box sx={{ mb: 2.5, p: 2, borderRadius: 2, bgcolor: isDark ? '#1e1e24' : '#f8fafc', border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0' }}>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: isDark ? '#cbd5e1' : '#334155', display: 'block', mb: 1 }}>
                                LINK DOKUMEN GOOGLE DRIVE (SURAT KEPUTUS / ROSTER JADWAL RESMI)
                            </Typography>

                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1, alignItems: 'center' }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="https://drive.google.com/file/d/... atau docs.google.com/..."
                                    value={driveUrlInput}
                                    onChange={(e) => setDriveUrlInput(e.target.value)}
                                    disabled={!isKepalaSekolah}
                                    sx={{
                                        bgcolor: isDark ? '#18181b' : '#ffffff',
                                        '& .MuiInputBase-input': { color: isDark ? '#f4f4f5' : '#0f172a' },
                                    }}
                                    slotProps={{
                                        input: {
                                            startAdornment: <LinkIcon sx={{ color: isDark ? '#71717a' : '#94a3b8', mr: 1, fontSize: 18 }} />,
                                        },
                                    }}
                                />

                                {driveParse.isValid && driveParse.originalUrl && (
                                    <IconButton
                                        size="small"
                                        onClick={() => window.open(driveParse.originalUrl, '_blank')}
                                        title="Buka Dokumen di Google Drive"
                                        color="primary"
                                    >
                                        <OpenInNewIcon fontSize="small" />
                                    </IconButton>
                                )}
                            </Box>

                            {driveParse.isValid ? (
                                <Box sx={{ mt: 2, borderRadius: 2, overflow: 'hidden', border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0' }}>
                                    <GoogleDrivePreview
                                        url={driveUrlInput || approvalData?.googleDriveUrl}
                                        height={340}
                                        title="Dokumen Pengesahan Resmi"
                                    />
                                </Box>
                            ) : (
                                (driveUrlInput || approvalData?.googleDriveUrl) ? (
                                    <Box sx={{ mt: 1.5, p: 1.5, borderRadius: 2, bgcolor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2', border: isDark ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid #fecaca' }}>
                                        <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 600 }}>
                                            ⚠️ Format URL Google Drive belum valid atau belum dapat disematkan.
                                        </Typography>
                                    </Box>
                                ) : null
                            )}
                        </Box>

                        {/* Stempel Pengesahan */}
                        {approvalData?.isApproved && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    left: 20,
                                    top: 20,
                                    border: '2px solid #16a34a',
                                    color: isDark ? '#4ade80' : '#16a34a',
                                    borderRadius: 2,
                                    px: 1.5,
                                    py: 0.5,
                                    fontWeight: 900,
                                    fontSize: '12px',
                                    letterSpacing: 1,
                                    textTransform: 'uppercase',
                                    transform: 'rotate(-8deg)',
                                    bgcolor: isDark ? 'rgba(20, 20, 22, 0.95)' : 'rgba(255,255,255,0.9)',
                                }}
                            >
                                ✓ SAH & TERVERIFIKASI
                            </Box>
                        )}

                        {/* Tombol Download & Konfirmasi Pengesahan (Khusus Kepala Sekolah) */}
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1.5, flexWrap: 'wrap' }}>
                            {approvalData?.isApproved && driveParse.isValid && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    startIcon={<DownloadIcon />}
                                    onClick={() => {
                                        const dlUrl =
                                            driveParse.id && driveParse.type === 'file'
                                                ? `https://drive.google.com/uc?export=download&id=${driveParse.id}`
                                                : driveParse.originalUrl;
                                        if (dlUrl) window.open(dlUrl, '_blank');
                                    }}
                                    sx={{ textTransform: 'none', fontWeight: 800, borderRadius: 2 }}
                                >
                                    Download Dokumen Jadwal Sah (TTD Kepsek)
                                </Button>
                            )}

                            {isKepalaSekolah ? (
                                approvalData?.isApproved ? (
                                    <>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            onClick={handleRevokeApproval}
                                            disabled={isSubmitting}
                                            sx={{ textTransform: 'none', fontWeight: 700 }}
                                        >
                                            Batalkan Pengesahan
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            size="small"
                                            onClick={handleConfirmApproval}
                                            disabled={isSubmitting}
                                            startIcon={<CheckCircleIcon />}
                                            sx={{ textTransform: 'none', fontWeight: 800 }}
                                        >
                                            Perbarui Link & Pengesahan
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        variant="contained"
                                        color="success"
                                        size="medium"
                                        onClick={handleConfirmApproval}
                                        disabled={isSubmitting}
                                        startIcon={<CheckCircleIcon />}
                                        sx={{
                                            textTransform: 'none',
                                            fontWeight: 800,
                                            px: 3,
                                            boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)',
                                        }}
                                    >
                                        Konfirmasi & Sahkan Jadwal
                                    </Button>
                                )
                            ) : (
                                <Tooltip title="Hanya Kepala Sekolah yang memiliki wewenang untuk menandatangani dan mengesahkan jadwal ini">
                                    <span>
                                        <Button
                                            variant="contained"
                                            disabled
                                            startIcon={<LockIcon />}
                                            sx={{ textTransform: 'none', fontWeight: 700 }}
                                        >
                                            Konfirmasi Pengesahan (Terkunci)
                                        </Button>
                                    </span>
                                </Tooltip>
                            )}
                        </Box>
                    </Card>
                </Grid>
            </Box>

            {/* Dialog Form Tambah / Edit Guru Piket */}
            <GuruPiketFormDialog
                open={isPiketDialogOpen}
                onClose={() => setIsPiketDialogOpen(false)}
                editingIndex={editingIndex}
                defaultDay={defaultDay}
            />
        </>
    );
};

export default GuruPiketAndApprovalCard;
