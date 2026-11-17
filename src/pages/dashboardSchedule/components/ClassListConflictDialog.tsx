import React from 'react';
import {
    Box,
    Button,
    Card,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useScheduleStore } from '../store/useScheduleStore';

const ClassListConflictDialog: React.FC = () => {
    const {
        classes,
        conflicts,
        selectedClassFilter,
        setSelectedClassFilter,
        setSelectedClassForInput,
        isClassListModalOpen,
        setIsClassListModalOpen,
        schoolInformations,
        idSchoolInformation,
    } = useScheduleStore();

    const activeSchoolInfo = schoolInformations.find(
        (i) => i.id_school_information === idSchoolInformation
    );

    const handleSelectClass = (className: string) => {
        setSelectedClassFilter(className);
        setSelectedClassForInput(className);
        setIsClassListModalOpen(false);
    };

    const handleSelectAll = () => {
        setSelectedClassFilter('Semua');
        setIsClassListModalOpen(false);
    };

    return (
        <Dialog
            open={isClassListModalOpen}
            onClose={() => setIsClassListModalOpen(false)}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    p: 1,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    pb: 1,
                }}
            >
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                        sx={{
                            width: 42,
                            height: 42,
                            borderRadius: 2.5,
                            bgcolor: '#eff6ff',
                            color: '#2563eb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <MeetingRoomIcon />
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '18px' }}>
                            Daftar Ruang Kelas (Rombel) & Status Bentrok
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b', fontSize: '13px' }}>
                            Periode: TP {activeSchoolInfo?.periode || 'Aktif'} • Total {classes.length} Ruang Kelas Terdaftar di Database
                        </Typography>
                    </Box>
                </Stack>
                <IconButton onClick={() => setIsClassListModalOpen(false)} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <Divider sx={{ my: 1 }} />

            <DialogContent sx={{ pt: 2, pb: 2 }}>
                <Box sx={{ mb: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                        Pilih ruangan kelas di bawah untuk memfokuskan tampilan jadwal atau berpindah kotak grid:
                    </Typography>
                    <Button
                        variant={selectedClassFilter === 'Semua' ? 'contained' : 'outlined'}
                        size="small"
                        onClick={handleSelectAll}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 700,
                            borderRadius: 2,
                            fontSize: '12px',
                        }}
                    >
                        Tampilkan Semua Kelas ({classes.length})
                    </Button>
                </Box>

                {classes.length === 0 ? (
                    <Box
                        sx={{
                            p: 4,
                            textAlign: 'center',
                            bgcolor: '#f8fafc',
                            borderRadius: 2.5,
                            border: '1px dashed #cbd5e1',
                        }}
                    >
                        <Typography sx={{ color: '#64748b', fontWeight: 600 }}>
                            Belum ada data kelas yang terdaftar di database untuk periode ini.
                        </Typography>
                    </Box>
                ) : (
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' },
                            gap: 2,
                        }}
                    >
                        {classes.map((cls) => {
                            const classConflicts = conflicts.filter((c) =>
                                c.conflictedClasses.includes(cls.name)
                            );
                            const hasConflict = classConflicts.length > 0;
                            const isSelected = selectedClassFilter === cls.name;

                            return (
                                <Card
                                    key={cls.id || cls.name}
                                    elevation={0}
                                    onClick={() => handleSelectClass(cls.name)}
                                    sx={{
                                        p: 2,
                                        borderRadius: 2.5,
                                        border: isSelected
                                            ? '2px solid #2563eb'
                                            : hasConflict
                                            ? '1px solid #fecaca'
                                            : '1px solid #e2e8f0',
                                        bgcolor: isSelected
                                            ? '#eff6ff'
                                            : hasConflict
                                            ? '#fff5f5'
                                            : '#ffffff',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        position: 'relative',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 8px 16px rgba(0,0,0,0.06)',
                                            borderColor: isSelected ? '#1d4ed8' : '#3b82f6',
                                        },
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                                        <Box>
                                            <Typography
                                                variant="subtitle1"
                                                sx={{
                                                    fontWeight: 800,
                                                    color: isSelected ? '#1d4ed8' : '#0f172a',
                                                    fontSize: '16px',
                                                }}
                                            >
                                                {cls.name}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: '#64748b',
                                                    display: 'block',
                                                    fontSize: '12px',
                                                    fontWeight: 500,
                                                }}
                                            >
                                                {cls.major ? `${cls.major} • Tingkat ${cls.grade}` : `Tingkat ${cls.grade}`}
                                            </Typography>
                                        </Box>

                                        {/* Lingkaran Merah Hitungan Bentrok Sesuai Permintaan User */}
                                        {hasConflict ? (
                                            <Tooltip title={`${classConflicts.length} slot jadwal bentrok di kelas ini!`}>
                                                <Box
                                                    sx={{
                                                        minWidth: 26,
                                                        height: 26,
                                                        px: 0.75,
                                                        borderRadius: '999px',
                                                        bgcolor: '#ef4444',
                                                        color: '#ffffff',
                                                        fontWeight: 900,
                                                        fontSize: '12px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        boxShadow: '0 2px 6px rgba(239, 68, 68, 0.45)',
                                                    }}
                                                >
                                                    {classConflicts.length}
                                                </Box>
                                            </Tooltip>
                                        ) : (
                                            <Box
                                                sx={{
                                                    width: 24,
                                                    height: 24,
                                                    borderRadius: '50%',
                                                    bgcolor: '#ecfdf5',
                                                    color: '#10b981',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <CheckCircleOutlineIcon sx={{ fontSize: 16 }} />
                                            </Box>
                                        )}
                                    </Box>

                                    <Box sx={{ pt: 1, borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        {hasConflict ? (
                                            <Stack direction="row" spacing={0.5} alignItems="center">
                                                <WarningAmberIcon sx={{ fontSize: 14, color: '#ef4444' }} />
                                                <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 700, fontSize: '11px' }}>
                                                    {classConflicts.length} Bentrok
                                                </Typography>
                                            </Stack>
                                        ) : (
                                            <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600, fontSize: '11px' }}>
                                                Bebas Bentrok (0)
                                            </Typography>
                                        )}

                                        <Stack direction="row" spacing={0.5} alignItems="center">
                                            <Typography variant="caption" sx={{ color: isSelected ? '#1d4ed8' : '#3b82f6', fontWeight: 700, fontSize: '11px' }}>
                                                {isSelected ? 'Sedang Aktif' : 'Pilih Kelas'}
                                            </Typography>
                                            <ArrowForwardIosIcon sx={{ fontSize: 10, color: isSelected ? '#1d4ed8' : '#3b82f6' }} />
                                        </Stack>
                                    </Box>
                                </Card>
                            );
                        })}
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={() => setIsClassListModalOpen(false)} sx={{ textTransform: 'none', fontWeight: 600 }}>
                    Tutup
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ClassListConflictDialog;

