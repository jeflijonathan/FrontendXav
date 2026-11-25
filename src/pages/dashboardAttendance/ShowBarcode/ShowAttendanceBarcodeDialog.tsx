import React, { useMemo, useState } from 'react';
import {
    Box,
    Stack,
    Typography,
    Button,
    Chip,
    IconButton,
    Tooltip,
} from '@mui/material';
import { BaseDialog, DialogHeader, DialogBody, DialogFooter } from '@components/Dialog';
import { QRCodeSVG } from 'qrcode.react';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import ShieldIcon from '@mui/icons-material/Shield';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useTheme } from '@mui/material/styles';
import useDashboardAttendanceStore from '../store';
import useAttendanceList from '../List/hook/useAttendanceList';

export const ShowAttendanceBarcodeDialog: React.FC = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const [isFullscreen, setIsFullscreen] = useState(false);

    const { state, setState } = useDashboardAttendanceStore();
    const {
        isBarcodeDialogOpen,
        selectedSchoolInfoId,
        selectedClassId,
        classes,
        selectedSubject,
        selectedMeeting,
        students,
        teacherDisplayName,
        sessionOpenStatus,
        sessionToken,
    } = state;

    const { loadAttendanceSheet } = useAttendanceList();

    const selectedClassObj = useMemo(() => {
        return classes.find((c) => c.id_class === selectedClassId);
    }, [classes, selectedClassId]);

    // Payload QR Code JSON yang akan dibaca oleh kamera siswa
    const qrPayload = useMemo(() => {
        if (!selectedMeeting || sessionOpenStatus !== 'DIBUKA' || !sessionToken) return '';
        const payloadObj = {
            app: 'SMK_XAVERIUS_PALEMBANG',
            type: 'PRESENSI_KBM',
            id_school_information: selectedSchoolInfoId,
            id_class: selectedClassId,
            class_name: selectedClassObj?.name || '',
            subject_name: selectedSubject || selectedMeeting.subject_name || '',
            date: selectedMeeting.date,
            day: selectedMeeting.day,
            jp: selectedMeeting.jp,
            time_range: selectedMeeting.time_range,
            teacher_name: teacherDisplayName || selectedMeeting.teacher_name || '',
            session_code: `PRES-${selectedClassObj?.name || 'CLS'}-${selectedMeeting.date}-${selectedMeeting.jp}`,
            session_token: sessionToken,
            timestamp: Date.now(),
        };
        return JSON.stringify(payloadObj);
    }, [
        selectedSchoolInfoId,
        selectedClassId,
        selectedClassObj,
        selectedSubject,
        selectedMeeting,
        teacherDisplayName,
        sessionOpenStatus,
        sessionToken,
    ]);

    // Hitung statistik kehadiran terkini
    const hadirCount = students.filter((s) => s.status === 'HADIR').length;
    const totalSiswa = students.length;

    const handleClose = () => {
        setIsFullscreen(false);
        setState({ isBarcodeDialogOpen: false });
    };

    if (!selectedMeeting) return null;

    return (
        <BaseDialog
            isOpen={isBarcodeDialogOpen}
            onClose={handleClose}
            maxWidth={isFullscreen ? 'xl' : 'md'}
        >
            <DialogHeader
                title="Barcode / QR Presensi Sesi KBM"
                description="Tampilkan barcode ini di layar atau proyektor. Siswa memindai barcode ini dan memverifikasi wajah asli (DeepFace Anti-Spoofing)."
                onClose={handleClose}
            />

            <DialogBody>
                <Box sx={{ p: { xs: 1, sm: 2 } }}>
                    {/* Toolbar Status & Mode Layar Penuh */}
                    <Stack
                        direction="row"
                        sx={{
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 1.5,
                            mb: 2.5,
                        }}
                    >
                        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                            <Chip
                                icon={<SchoolIcon sx={{ fontSize: '15px !important' }} />}
                                label={`Kelas: ${selectedClassObj?.name || '-'}`}
                                color="primary"
                                size="small"
                                sx={{ fontWeight: 800 }}
                            />
                            <Chip
                                icon={<MenuBookIcon sx={{ fontSize: '15px !important' }} />}
                                label={selectedSubject || selectedMeeting.subject_name || '-'}
                                color="secondary"
                                size="small"
                                sx={{ fontWeight: 800 }}
                            />
                            <Chip
                                icon={<AccessTimeIcon sx={{ fontSize: '15px !important' }} />}
                                label={`${selectedMeeting.jp} (${selectedMeeting.time_range})`}
                                variant="outlined"
                                size="small"
                                sx={{ fontWeight: 700 }}
                            />
                            <Chip
                                icon={
                                    sessionOpenStatus === 'DIBUKA' ? (
                                        <LockOpenIcon sx={{ fontSize: '14px !important' }} />
                                    ) : (
                                        <LockIcon sx={{ fontSize: '14px !important' }} />
                                    )
                                }
                                label={
                                    sessionOpenStatus === 'DIBUKA'
                                        ? 'Status: Dibuka'
                                        : sessionOpenStatus === 'DITUTUP'
                                        ? 'Status: Ditutup'
                                        : 'Status: Belum Dibuka'
                                }
                                color={
                                    sessionOpenStatus === 'DIBUKA'
                                        ? 'success'
                                        : sessionOpenStatus === 'DITUTUP'
                                        ? 'error'
                                        : 'default'
                                }
                                size="small"
                                sx={{ fontWeight: 800 }}
                            />
                        </Stack>

                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                            <Tooltip title="Muat ulang data presensi terkini">
                                <IconButton size="small" onClick={() => loadAttendanceSheet()}>
                                    <RefreshIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Button
                                size="small"
                                variant={isFullscreen ? 'contained' : 'outlined'}
                                color="inherit"
                                startIcon={isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                                onClick={() => setIsFullscreen(!isFullscreen)}
                                sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
                            >
                                {isFullscreen ? 'Keluar Fullscreen' : 'Mode Proyektor (Fullscreen)'}
                            </Button>
                        </Stack>
                    </Stack>

                    {/* QR Code Presentation Panel */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: isFullscreen ? 'row' : 'row' },
                            gap: 3,
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: isDark ? '#09090b' : '#f8fafc',
                            p: { xs: 2, sm: 3.5 },
                            borderRadius: 3,
                            border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
                        }}
                    >
                        {/* High-Contrast QR Code Card */}
                        <Box
                            sx={{
                                position: 'relative',
                                p: { xs: 2.5, sm: 3 },
                                bgcolor: '#ffffff',
                                borderRadius: 3,
                                boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border:
                                    sessionOpenStatus === 'DIBUKA'
                                        ? '3px solid #2563eb'
                                        : '3px solid #ef4444',
                                minWidth: isFullscreen ? 380 : 320,
                                minHeight: isFullscreen ? 380 : 320,
                            }}
                        >
                            {sessionOpenStatus === 'DIBUKA' && qrPayload ? (
                                <QRCodeSVG
                                    value={qrPayload}
                                    size={isFullscreen ? 340 : 280}
                                    level="L"
                                    includeMargin
                                />
                            ) : (
                                <Stack spacing={1.5} sx={{ alignItems: 'center', textAlign: 'center', px: 2, py: 4 }}>
                                    <LockIcon sx={{ fontSize: 52, color: '#ef4444' }} />
                                    <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#0f172a' }}>
                                        {sessionOpenStatus === 'DITUTUP'
                                            ? 'Presensi Ditutup'
                                            : 'Presensi Belum Dibuka'}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#64748b', maxWidth: 240 }}>
                                        Silakan buka presensi terlebih dahulu melalui tombol di halaman utama sebelum menampilkan barcode.
                                    </Typography>
                                </Stack>
                            )}
                            <Typography
                                variant="caption"
                                sx={{
                                    mt: 1.5,
                                    fontWeight: 900,
                                    color: '#1e293b',
                                    letterSpacing: 1.5,
                                    textTransform: 'uppercase',
                                    fontSize: '11px',
                                }}
                            >
                                PRESENSI KBM • {selectedClassObj?.name}
                            </Typography>
                        </Box>

                        {/* Session Details & Live Counter */}
                        <Box sx={{ flex: 1, minWidth: 260 }}>
                            <Typography
                                variant="h6"
                                sx={{ fontWeight: 900, color: isDark ? '#f4f4f5' : '#0f172a', mb: 1 }}
                            >
                                Scan QR & Verifikasi Wajah Asli
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: isDark ? '#a1a1aa' : '#64748b', mb: 2, fontSize: '13px' }}
                            >
                                Siswa membuka menu <b>Presensi Siswa</b> pada akun masing-masing, mengarahkan kamera ke QR code ini, lalu melakukan verifikasi wajah dengan perlindungan <b>Anti-Spoofing</b>.
                            </Typography>

                            {/* Anti-spoofing status badges */}
                            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mb: 2.5 }}>
                                <Chip
                                    icon={<ShieldIcon sx={{ fontSize: '15px !important' }} />}
                                    label="Anti-Spoofing: AKTIF"
                                    size="small"
                                    color="success"
                                    sx={{ fontWeight: 800 }}
                                />
                                <Chip
                                    icon={<FaceRetouchingNaturalIcon sx={{ fontSize: '15px !important' }} />}
                                    label="DeepFace: AKTIF"
                                    size="small"
                                    color="info"
                                    sx={{ fontWeight: 800 }}
                                />
                            </Stack>

                            {/* Live attendance count box */}
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 2.5,
                                    bgcolor: isDark ? '#18181b' : '#ffffff',
                                    border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
                                    mb: 2,
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    sx={{ fontWeight: 800, color: isDark ? '#a1a1aa' : '#64748b', display: 'block' }}
                                >
                                    STATUS KEHADIRAN LANGSUNG (REAL-TIME)
                                </Typography>
                                <Stack direction="row" spacing={2} sx={{ alignItems: 'baseline', mt: 0.5 }}>
                                    <Typography variant="h3" sx={{ fontWeight: 900, color: '#16a34a' }}>
                                        {hadirCount}
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ color: isDark ? '#a1a1aa' : '#64748b', fontWeight: 700 }}>
                                        / {totalSiswa} Siswa Hadir
                                    </Typography>
                                </Stack>
                            </Box>

                            {/* Recent verified students list */}
                            <Box
                                sx={{
                                    maxHeight: 140,
                                    overflowY: 'auto',
                                    pr: 0.5,
                                }}
                            >
                                <Typography variant="caption" sx={{ fontWeight: 800, color: isDark ? '#71717a' : '#94a3b8' }}>
                                    Siswa yang Baru Hadir:
                                </Typography>
                                <Stack spacing={0.75} sx={{ mt: 0.75 }}>
                                    {students
                                        .filter((s) => s.status === 'HADIR')
                                        .slice(-4)
                                        .reverse()
                                        .map((s) => (
                                            <Stack
                                                key={s.id_student}
                                                direction="row"
                                                spacing={1}
                                                sx={{
                                                    alignItems: 'center',
                                                    p: 0.75,
                                                    px: 1.25,
                                                    borderRadius: 1.5,
                                                    bgcolor: isDark ? 'rgba(22, 101, 52, 0.15)' : '#f0fdf4',
                                                    border: isDark ? '1px solid #16a34a' : '1px solid #bbf7d0',
                                                }}
                                            >
                                                <CheckCircleIcon sx={{ fontSize: 16, color: '#16a34a' }} />
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontWeight: 700,
                                                        color: isDark ? '#86efac' : '#166534',
                                                        fontSize: '12px',
                                                        flex: 1,
                                                    }}
                                                >
                                                    {s.name}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: isDark ? '#86efac' : '#15803d', fontSize: '10px' }}>
                                                    Hadir
                                                </Typography>
                                            </Stack>
                                        ))}
                                    {hadirCount === 0 && (
                                        <Typography variant="caption" sx={{ color: isDark ? '#71717a' : '#94a3b8', fontStyle: 'italic' }}>
                                            Menunggu siswa memindai barcode & memverifikasi wajah...
                                        </Typography>
                                    )}
                                </Stack>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </DialogBody>

            <DialogFooter>
                <Button onClick={handleClose} color="inherit" sx={{ textTransform: 'none', fontWeight: 700 }}>
                    Tutup Tampilan Barcode
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<RefreshIcon />}
                    onClick={() => loadAttendanceSheet()}
                    sx={{ textTransform: 'none', fontWeight: 800, borderRadius: 2, px: 2.5 }}
                >
                    Perbarui Lembar Presensi
                </Button>
            </DialogFooter>
        </BaseDialog>
    );
};

export default ShowAttendanceBarcodeDialog;
