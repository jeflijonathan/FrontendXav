import React from 'react';
import { Box, Card, Typography, Button, Stack, Chip } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import VerifiedIcon from '@mui/icons-material/Verified';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

interface AttendanceApprovalAlertProps {
    isApproved: boolean;
    approvalData?: {
        isApproved?: boolean;
        googleDriveUrl?: string;
        approvedBy?: string;
        headmasterNiy?: string;
        approvedAt?: string;
        notes?: string;
    } | null;
    periodeName?: string;
}

export const AttendanceApprovalAlert: React.FC<AttendanceApprovalAlertProps> = ({
    isApproved,
    approvalData,
    periodeName,
}) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    if (isApproved) {
        return (
            <Card
                variant="outlined"
                sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: 2.5,
                    bgcolor: isDark ? 'rgba(22, 101, 52, 0.2)' : '#f0fdf4',
                    borderColor: isDark ? '#16a34a' : '#86efac',
                }}
            >
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                            sx={{
                                width: 42,
                                height: 42,
                                borderRadius: 2,
                                bgcolor: isDark ? '#14532d' : '#dcfce7',
                                color: isDark ? '#4ade80' : '#16a34a',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <VerifiedIcon />
                        </Box>
                        <Box>
                            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: isDark ? '#4ade80' : '#166534' }}>
                                    Roster Jadwal Pelajaran Resmi Telah Disahkan
                                </Typography>
                                <Chip
                                    label="Jadwal Sah & Aktif"
                                    size="small"
                                    color="success"
                                    sx={{ fontWeight: 700, fontSize: '11px', height: 22 }}
                                />
                            </Stack>
                            <Typography variant="body2" sx={{ color: isDark ? '#86efac' : '#15803d', fontSize: '13px', mt: 0.2 }}>
                                {approvalData?.approvedBy
                                    ? `Disahkan oleh Kepala Sekolah: ${approvalData.approvedBy} ${approvalData.headmasterNiy ? `(NIY: ${approvalData.headmasterNiy})` : ''}`
                                    : 'Jadwal pelajaran periode ini telah disahkan oleh Kepala Sekolah.'}
                                {approvalData?.notes ? ` • ${approvalData.notes}` : ''}
                            </Typography>
                        </Box>
                    </Box>

                    {approvalData?.googleDriveUrl && (
                        <Button
                            variant="outlined"
                            size="small"
                            href={approvalData.googleDriveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                textTransform: 'none',
                                fontWeight: 700,
                                borderRadius: 2,
                                borderColor: isDark ? '#16a34a' : '#86efac',
                                color: isDark ? '#86efac' : '#15803d',
                            }}
                        >
                            Lihat Dokumen SK Jadwal
                        </Button>
                    )}
                </Stack>
            </Card>
        );
    }

    return (
        <Card
            variant="outlined"
            sx={{
                p: 3,
                mb: 3,
                borderRadius: 3,
                bgcolor: isDark ? 'rgba(153, 27, 27, 0.2)' : '#fef2f2',
                borderColor: isDark ? '#dc2626' : '#fecaca',
            }}
        >
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2.5} sx={{ alignItems: { md: 'center' }, justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2.5,
                            bgcolor: isDark ? '#7f1d1d' : '#fee2e2',
                            color: isDark ? '#f87171' : '#dc2626',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            mt: 0.5,
                        }}
                    >
                        <LockIcon sx={{ fontSize: 28 }} />
                    </Box>
                    <Box>
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap', mb: 0.5 }}>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: isDark ? '#f87171' : '#991b1b', fontSize: '17px' }}>
                                Presensi Terkunci — Roster Jadwal Belum Disahkan
                            </Typography>
                            <Chip
                                label="Akses Kehadiran Ditutup"
                                size="small"
                                color="error"
                                sx={{ fontWeight: 800, fontSize: '11px', height: 22 }}
                            />
                        </Stack>
                        <Typography variant="body2" sx={{ color: isDark ? '#fca5a5' : '#b91c1c', fontSize: '13.5px', lineHeight: 1.5, maxWidth: 800 }}>
                            Sesuai ketentuan akademik, pembukaan presensi kehadiran siswa <strong>wajib berdasarkan jadwal pelajaran resmi</strong>.
                            Karena jadwal pada periode <strong>{periodeName || 'aktif'}</strong> belum dikonfirmasi atau disahkan oleh Kepala Sekolah,
                            maka <strong>data guru dan daftar siswa belum dapat ditampilkan</strong>.
                            Silakan tunggu sampai jadwal disahkan terlebih dahulu untuk mulai mencatat presensi.
                        </Typography>
                    </Box>
                </Box>

                <Button
                    variant="contained"
                    color="error"
                    startIcon={<CalendarMonthIcon />}
                    onClick={() => navigate('/jadwal-pelajaran')}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 700,
                        borderRadius: 2,
                        px: 2.5,
                        py: 1,
                        whiteSpace: 'nowrap',
                    }}
                >
                    Lihat Jadwal Pelajaran
                </Button>
            </Stack>
        </Card>
    );
};

export default AttendanceApprovalAlert;
