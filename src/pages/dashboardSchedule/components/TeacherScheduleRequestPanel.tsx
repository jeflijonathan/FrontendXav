import React, { useEffect } from 'react';
import {
    Box,
    Card,
    Typography,
    Stack,
    Button,
    Chip,
    IconButton,
    Tooltip,
    CircularProgress,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EditNoteIcon from '@mui/icons-material/EditNote';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlined';
import EditIcon from '@mui/icons-material/Edit';
import { useScheduleStore } from '../store/useScheduleStore';
import type { TeacherScheduleRequest } from '../types';

const TeacherScheduleRequestPanel: React.FC = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const {
        teacherRequests,
        isLoadingRequests,
        fetchTeacherRequests,
        setIsRequestDialogOpen,
        setEditingRequest,
        deleteTeacherRequest,
    } = useScheduleStore();

    useEffect(() => {
        fetchTeacherRequests();
    }, [fetchTeacherRequests]);

    const handleOpenNewRequest = () => {
        setEditingRequest(null);
        setIsRequestDialogOpen(true);
    };

    const handleEditRequest = (req: TeacherScheduleRequest) => {
        setEditingRequest(req);
        setIsRequestDialogOpen(true);
    };

    const handleDeleteRequest = async (id: string, name: string) => {
        if (window.confirm(`Hapus request jadwal pengajar ${name}?`)) {
            await deleteTeacherRequest(id);
        }
    };

    return (
        <Card
            elevation={0}
            sx={{
                mb: 3,
                p: { xs: 2.5, md: 3 },
                borderRadius: 3,
                border: '1px solid #e2e8f0',
                bgcolor: '#ffffff',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)',
            }}
        >
            {/* Header: Title, Subtitle, & Input Request Baru Button (Sesuai Gambar 1) */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: 2,
                    mb: 2.5,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            bgcolor: '#ede9fe',
                            color: '#4f46e5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}
                    >
                        <EventAvailableIcon />
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e1b4b', fontSize: '18px' }}>
                            Panel Request Jadwal Pengajar
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b', fontSize: '13px' }}>
                            Form preferensi waktu mengajar & riwayat request yang telah divalidasi sistem.
                        </Typography>
                    </Box>
                </Box>

                <Button
                    variant="contained"
                    onClick={handleOpenNewRequest}
                    startIcon={<EditNoteIcon />}
                    sx={{
                        bgcolor: '#4f46e5',
                        color: '#ffffff',
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '13px',
                        borderRadius: 2,
                        px: 2.5,
                        py: 0.9,
                        boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
                        '&:hover': {
                            bgcolor: '#4338ca',
                        },
                    }}
                >
                    Input Request Baru
                </Button>
            </Box>

            {/* List Cards Request Pengajar (Sesuai Desain Gambar 1) */}
            {isLoadingRequests ? (
                <Box sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1.5 }}>
                    <CircularProgress size={22} color="primary" />
                    <Typography variant="body2" color="text.secondary">
                        Memuat daftar request jadwal pengajar...
                    </Typography>
                </Box>
            ) : teacherRequests.length === 0 ? (
                <Box
                    sx={{
                        p: 3,
                        textAlign: 'center',
                        bgcolor: '#f8fafc',
                        borderRadius: 2.5,
                        border: '1px dashed #cbd5e1',
                    }}
                >
                    <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                        Belum ada request jadwal pengajar.
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                        Klik tombol "Input Request Baru" untuk mengajukan preferensi waktu mengajar guru.
                    </Typography>
                </Box>
            ) : (
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            md: 'repeat(2, 1fr)',
                        },
                        gap: 2.5,
                    }}
                >
                    {teacherRequests.map((req) => {
                        const isConflict = req.status === 'CONFLICT';

                        return (
                            <Card
                                key={req.id}
                                variant="outlined"
                                sx={{
                                    p: 2.5,
                                    borderRadius: 3,
                                    borderColor: isConflict ? '#fecaca' : '#e0e7ff',
                                    bgcolor: isConflict ? '#fffbfa' : '#ffffff',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        borderColor: isConflict ? '#f87171' : '#c7d2fe',
                                        boxShadow: '0 4px 12px 0 rgba(79, 70, 229, 0.06)',
                                    },
                                }}
                            >
                                {/* Top: Code Badge, Name, Subject, and Status Badge */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        justifyContent: 'space-between',
                                        gap: 1.5,
                                        mb: 2,
                                    }}
                                >
                                    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                                        {/* Blue Number Badge (Sesuai Gambar 1: Kotak biru dengan angka) */}
                                        <Box
                                            sx={{
                                                width: 36,
                                                height: 36,
                                                borderRadius: '8px',
                                                bgcolor: '#2563eb',
                                                color: '#ffffff',
                                                fontWeight: 800,
                                                fontSize: '16px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0,
                                            }}
                                        >
                                            {req.teacherCode}
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                                                {req.teacherName}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                                                {req.subjectName}
                                            </Typography>
                                        </Box>
                                    </Stack>

                                    {/* Status Badge */}
                                    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                                        <Chip
                                            icon={
                                                isConflict ? (
                                                    <ErrorOutlineIcon sx={{ fontSize: '15px !important', color: '#b91c1c !important' }} />
                                                ) : (
                                                    <CheckCircleOutlineIcon sx={{ fontSize: '15px !important', color: '#15803d !important' }} />
                                                )
                                            }
                                            label={isConflict ? '⚠️ Terdeteksi Bentrok' : '✓ Tersedia & Bebas Bentrok'}
                                            size="small"
                                            sx={{
                                                height: 24,
                                                fontSize: '11px',
                                                fontWeight: 700,
                                                bgcolor: isConflict ? '#fef2f2' : '#dcfce7',
                                                color: isConflict ? '#b91c1c' : '#15803d',
                                                border: `1px solid ${isConflict ? '#fca5a5' : '#bbf7d0'}`,
                                                borderRadius: '12px',
                                            }}
                                        />
                                        <Tooltip title="Edit Request">
                                            <IconButton size="small" onClick={() => handleEditRequest(req)}>
                                                <EditIcon sx={{ fontSize: 16, color: '#64748b' }} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Hapus Request">
                                            <IconButton size="small" onClick={() => handleDeleteRequest(req.id, req.teacherName)}>
                                                <DeleteOutlineIcon sx={{ fontSize: 16, color: '#ef4444' }} />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </Box>

                                {/* List of requested days and hours (Sesuai Gambar 1) */}
                                <Stack spacing={1}>
                                    {req.preferredSlots.map((slot, sIdx) => (
                                        <Box
                                            key={sIdx}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                p: 1.2,
                                                px: 1.5,
                                                borderRadius: 2,
                                                bgcolor: '#f8fafc',
                                                border: '1px solid #f1f5f9',
                                            }}
                                        >
                                            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                                                <CalendarTodayIcon sx={{ fontSize: 14, color: '#3b82f6' }} />
                                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b', fontSize: '13px' }}>
                                                    {slot.day}
                                                </Typography>
                                            </Stack>
                                            <Typography variant="caption" sx={{ fontWeight: 600, color: '#475569', fontSize: '12px' }}>
                                                {slot.jam}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Stack>

                                {req.conflictReason && (
                                    <Typography variant="caption" sx={{ color: '#b91c1c', mt: 1, display: 'block', fontWeight: 600 }}>
                                        {req.conflictReason}
                                    </Typography>
                                )}
                            </Card>
                        );
                    })}
                </Box>
            )}
        </Card>
    );
};

export default TeacherScheduleRequestPanel;

