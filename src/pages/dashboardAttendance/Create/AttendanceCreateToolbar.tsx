import React from 'react';
import { Box, Card, Stack, Typography, Button, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import TuneIcon from '@mui/icons-material/Tune';
import { useTheme } from '@mui/material/styles';
import type { AttendanceRecap } from '../List/utils/attendanceFormatter';

interface AttendanceCreateToolbarProps {
    recap: AttendanceRecap;
    onMarkAllHadir: () => void;
    onMarkAllAlpa: () => void;
    onSave: () => void;
    onOpenBarcode: () => void;
    onOpenScan: () => void;
    onOpenSettings: () => void;
    isSaving: boolean;
    disabled?: boolean;
}

export const AttendanceCreateToolbar: React.FC<AttendanceCreateToolbarProps> = ({
    recap,
    onMarkAllHadir,
    onMarkAllAlpa,
    onSave,
    onOpenBarcode,
    onOpenScan,
    onOpenSettings,
    isSaving,
    disabled = false,
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const hadirPct = recap.TOTAL > 0 ? Math.round((recap.HADIR / recap.TOTAL) * 100) : 0;

    return (
        <Card
            variant="outlined"
            sx={{
                p: { xs: 2, sm: 2.5 },
                mb: 2.5,
                borderRadius: 3,
                bgcolor: isDark ? '#18181b' : '#ffffff',
                borderColor: isDark ? '#27272a' : '#e2e8f0',
                overflow: 'visible',
            }}
        >
            <Stack spacing={2}>
                {/* Stats grid */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: 'repeat(2, minmax(0, 1fr))',
                            sm: 'repeat(3, minmax(0, 1fr))',
                            md: 'repeat(5, minmax(0, 1fr))',
                        },
                        gap: 1.25,
                    }}
                >
                    <Box
                        sx={{
                            p: 1.25,
                            borderRadius: 2,
                            bgcolor: isDark ? '#27272a' : '#f8fafc',
                            border: isDark ? '1px solid #3f3f46' : '1px solid #e2e8f0',
                            textAlign: 'center',
                            gridColumn: { xs: 'span 2', sm: 'span 1' },
                        }}
                    >
                        <Typography variant="caption" sx={{ color: isDark ? '#a1a1aa' : '#64748b', fontWeight: 700, display: 'block' }}>
                            TOTAL SISWA
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 900, color: isDark ? '#f4f4f5' : '#0f172a', lineHeight: 1.2, my: 0.25 }}>
                            {recap.TOTAL}
                        </Typography>
                        <Typography variant="caption" sx={{ color: isDark ? '#71717a' : '#94a3b8', fontSize: '11px' }}>
                            Terdaftar
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            p: 1.25,
                            borderRadius: 2,
                            bgcolor: isDark ? 'rgba(22, 101, 52, 0.2)' : '#f0fdf4',
                            border: isDark ? '1px solid #16a34a' : '1px solid #bbf7d0',
                            textAlign: 'center',
                        }}
                    >
                        <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'center', alignItems: 'center' }}>
                            <CheckCircleIcon sx={{ fontSize: 15, color: '#16a34a' }} />
                            <Typography variant="caption" sx={{ color: isDark ? '#86efac' : '#166534', fontWeight: 800 }}>
                                HADIR
                            </Typography>
                        </Stack>
                        <Typography variant="h5" sx={{ fontWeight: 900, color: '#16a34a', lineHeight: 1.2, my: 0.25 }}>
                            {recap.HADIR}
                        </Typography>
                        <Typography variant="caption" sx={{ color: isDark ? '#86efac' : '#15803d', fontSize: '11px', fontWeight: 700 }}>
                            {hadirPct}%
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            p: 1.25,
                            borderRadius: 2,
                            bgcolor: isDark ? 'rgba(202, 138, 4, 0.15)' : '#fefce8',
                            border: isDark ? '1px solid #ca8a04' : '1px solid #fef08a',
                            textAlign: 'center',
                        }}
                    >
                        <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'center', alignItems: 'center' }}>
                            <InfoIcon sx={{ fontSize: 15, color: '#ca8a04' }} />
                            <Typography variant="caption" sx={{ color: isDark ? '#fde047' : '#854d0e', fontWeight: 800 }}>
                                IZIN
                            </Typography>
                        </Stack>
                        <Typography variant="h5" sx={{ fontWeight: 900, color: '#ca8a04', lineHeight: 1.2, my: 0.25 }}>
                            {recap.IZIN}
                        </Typography>
                        <Typography variant="caption" sx={{ color: isDark ? '#fde047' : '#a16207', fontSize: '11px' }}>
                            Keterangan
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            p: 1.25,
                            borderRadius: 2,
                            bgcolor: isDark ? 'rgba(37, 99, 235, 0.15)' : '#eff6ff',
                            border: isDark ? '1px solid #2563eb' : '1px solid #bfdbfe',
                            textAlign: 'center',
                        }}
                    >
                        <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'center', alignItems: 'center' }}>
                            <LocalHospitalIcon sx={{ fontSize: 15, color: '#2563eb' }} />
                            <Typography variant="caption" sx={{ color: isDark ? '#93c5fd' : '#1e40af', fontWeight: 800 }}>
                                SAKIT
                            </Typography>
                        </Stack>
                        <Typography variant="h5" sx={{ fontWeight: 900, color: '#2563eb', lineHeight: 1.2, my: 0.25 }}>
                            {recap.SAKIT}
                        </Typography>
                        <Typography variant="caption" sx={{ color: isDark ? '#93c5fd' : '#1d4ed8', fontSize: '11px' }}>
                            Sakit
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            p: 1.25,
                            borderRadius: 2,
                            bgcolor: isDark ? 'rgba(220, 38, 38, 0.15)' : '#fef2f2',
                            border: isDark ? '1px solid #dc2626' : '1px solid #fecaca',
                            textAlign: 'center',
                        }}
                    >
                        <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'center', alignItems: 'center' }}>
                            <CancelIcon sx={{ fontSize: 15, color: '#dc2626' }} />
                            <Typography variant="caption" sx={{ color: isDark ? '#fca5a5' : '#991b1b', fontWeight: 800 }}>
                                ALPA
                            </Typography>
                        </Stack>
                        <Typography variant="h5" sx={{ fontWeight: 900, color: '#dc2626', lineHeight: 1.2, my: 0.25 }}>
                            {recap.ALPA}
                        </Typography>
                        <Typography variant="caption" sx={{ color: isDark ? '#fca5a5' : '#b91c1c', fontSize: '11px' }}>
                            Tanpa Ket.
                        </Typography>
                    </Box>
                </Box>

                {/* Action Bar */}
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={1.5}
                    sx={{
                        flexWrap: 'wrap',
                        alignItems: { xs: 'stretch', md: 'center' },
                        justifyContent: 'space-between',
                        gap: 1.5,
                        pt: 1.5,
                        borderTop: isDark ? '1px solid #27272a' : '1px solid #f1f5f9',
                    }}
                >
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={1.25}
                        sx={{ flexWrap: 'wrap', gap: 1.25, alignItems: { sm: 'center' } }}
                    >
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<QrCode2Icon />}
                            onClick={onOpenBarcode}
                            disabled={disabled || recap.TOTAL === 0}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 800,
                                borderRadius: 2,
                                px: 2.25,
                                py: 1,
                                whiteSpace: 'nowrap',
                                boxShadow: '0 4px 14px rgba(147, 51, 234, 0.3)',
                            }}
                        >
                            Tampilkan Barcode Presensi
                        </Button>

                        <Button
                            variant="outlined"
                            startIcon={<TuneIcon />}
                            onClick={onOpenSettings}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 700,
                                borderRadius: 2,
                                px: 2,
                                py: 1,
                                whiteSpace: 'nowrap',
                            }}
                        >
                            Pengaturan Face & GPS
                        </Button>

                        <Button
                            variant="text"
                            color="inherit"
                            size="small"
                            startIcon={<QrCodeScannerIcon fontSize="small" />}
                            onClick={onOpenScan}
                            disabled={disabled || recap.TOTAL === 0}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 700,
                                borderRadius: 2,
                                px: 1.5,
                                py: 0.5,
                                fontSize: '12px',
                                color: isDark ? '#a1a1aa' : '#64748b',
                            }}
                        >
                            Scan Kartu (Manual)
                        </Button>
                    </Stack>

                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={1.25}
                        sx={{ flexWrap: 'wrap', gap: 1.25 }}
                    >
                        <Button
                            variant="outlined"
                            color="success"
                            startIcon={<DoneAllIcon />}
                            onClick={onMarkAllHadir}
                            disabled={disabled || recap.TOTAL === 0}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 700,
                                borderRadius: 2,
                                px: 2,
                                py: 1,
                                whiteSpace: 'nowrap',
                            }}
                        >
                            Tandai Semua Hadir
                        </Button>

                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<CancelIcon />}
                            onClick={onMarkAllAlpa}
                            disabled={disabled || recap.TOTAL === 0}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 700,
                                borderRadius: 2,
                                px: 2,
                                py: 1,
                                whiteSpace: 'nowrap',
                            }}
                        >
                            Tandai Semua Alpa
                        </Button>

                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={isSaving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
                            onClick={onSave}
                            disabled={disabled || isSaving || recap.TOTAL === 0}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 800,
                                borderRadius: 2,
                                px: 2.5,
                                py: 1,
                                whiteSpace: 'nowrap',
                                bgcolor: '#2563eb',
                                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
                                '&:hover': { bgcolor: '#1d4ed8' },
                            }}
                        >
                            {isSaving ? 'Menyimpan...' : 'Simpan Presensi'}
                        </Button>
                    </Stack>
                </Stack>
            </Stack>
        </Card>
    );
};

export default AttendanceCreateToolbar;
