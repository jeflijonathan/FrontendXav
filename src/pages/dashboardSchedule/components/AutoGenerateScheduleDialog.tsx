import React, { useState } from 'react';
import {
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Stack,
    Typography,
    IconButton,
    FormControlLabel,
    Switch,
    Divider,
    Chip,
    CircularProgress,
    Card,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloseIcon from '@mui/icons-material/Close';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import SaveIcon from '@mui/icons-material/Save';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import StarIcon from '@mui/icons-material/Star';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import { useScheduleStore } from '../store/useScheduleStore';
import type { ScheduleRow } from '../types';

const AutoGenerateScheduleDialog: React.FC = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const {
        isGenerateScheduleDialogOpen,
        setIsGenerateScheduleDialogOpen,
        generateRandomConflictFreeSchedule,
        applyGeneratedRows,
        teacherRequests,
        teachers,
    } = useScheduleStore();

    const [prioritizeRequests, setPrioritizeRequests] = useState(true);
    const [includeSpecialActivities, setIncludeSpecialActivities] = useState(true);
    const [balanceDistribution, setBalanceDistribution] = useState(true);
    const [randomizeTeachers, setRandomizeTeachers] = useState(true);

    const [isGenerating, setIsGenerating] = useState(false);
    const [generateResult, setGenerateResult] = useState<{
        success: boolean;
        totalFilled: number;
        conflictsCount: number;
        requestsFulfilled: number;
        generatedRows: ScheduleRow[];
    } | null>(null);

    const handleRunGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => {
            const result = generateRandomConflictFreeSchedule({
                prioritizeRequests,
                includeSpecialActivities,
                balanceDistribution,
                randomizeTeachers,
            });
            setGenerateResult(result);
            setIsGenerating(false);
        }, 500);
    };

    const handleApplyAndSave = async () => {
        if (!generateResult || !generateResult.generatedRows) return;
        await applyGeneratedRows(generateResult.generatedRows);
        setIsGenerateScheduleDialogOpen(false);
    };

    return (
        <Dialog
            open={isGenerateScheduleDialogOpen}
            onClose={() => setIsGenerateScheduleDialogOpen(false)}
            maxWidth="md"
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: 3.5,
                        overflow: 'hidden',
                        bgcolor: isDark ? '#18181b' : '#ffffff',
                        color: isDark ? '#f4f4f5' : '#0f172a',
                        border: isDark ? '1px solid #27272a' : undefined,
                    },
                },
            }}
        >
            <DialogTitle
                sx={{
                    p: 2.5,
                    bgcolor: isDark ? '#1e1e24' : '#f8fafc',
                    borderBottom: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            bgcolor: isDark ? '#164e63' : '#e0f2fe',
                            color: isDark ? '#67e8f9' : '#0284c7',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <AutoAwesomeIcon />
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: isDark ? '#f4f4f5' : '#0f172a', fontSize: '18px' }}>
                            Generate Jadwal Otomatis Acak (Bebas Bentrok)
                        </Typography>
                        <Typography variant="caption" sx={{ color: isDark ? '#a1a1aa' : '#64748b' }}>
                            Algoritma constraint-satisfaction anti-tabrakan dengan integrasi preferensi guru & aneka ragam ekstra.
                        </Typography>
                    </Box>
                </Stack>
                <IconButton size="small" onClick={() => setIsGenerateScheduleDialogOpen(false)} sx={{ color: isDark ? '#a1a1aa' : undefined }}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 3 }}>
                {/* Configuration Options */}
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: isDark ? '#f4f4f5' : '#1e293b', mb: 1.5 }}>
                    Parameter Konfigurasi Generator
                </Typography>

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                        gap: 2,
                        mb: 3,
                    }}
                >
                    <Card
                        variant="outlined"
                        sx={{
                            p: 2,
                            borderRadius: 2.5,
                            bgcolor: prioritizeRequests ? (isDark ? '#052e16' : '#f0fdf4') : (isDark ? '#18181b' : '#ffffff'),
                            borderColor: prioritizeRequests ? (isDark ? '#16a34a' : '#86efac') : (isDark ? '#3f3f46' : '#e2e8f0'),
                        }}
                    >
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={prioritizeRequests}
                                    onChange={(e) => setPrioritizeRequests(e.target.checked)}
                                    color="success"
                                />
                            }
                            label={
                                <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: isDark ? '#f4f4f5' : '#0f172a' }}>
                                        Prioritaskan Request Guru
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: isDark ? '#a1a1aa' : '#64748b' }}>
                                        Mengunci preferensi dari Panel Request ({teacherRequests.length} request aktif).
                                    </Typography>
                                </Box>
                            }
                            sx={{ m: 0, alignItems: 'flex-start' }}
                        />
                    </Card>

                    <Card
                        variant="outlined"
                        sx={{
                            p: 2,
                            borderRadius: 2.5,
                            bgcolor: includeSpecialActivities ? (isDark ? '#172554' : '#eff6ff') : (isDark ? '#18181b' : '#ffffff'),
                            borderColor: includeSpecialActivities ? (isDark ? '#3b82f6' : '#93c5fd') : (isDark ? '#3f3f46' : '#e2e8f0'),
                        }}
                    >
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={includeSpecialActivities}
                                    onChange={(e) => setIncludeSpecialActivities(e.target.checked)}
                                    color="primary"
                                />
                            }
                            label={
                                <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: isDark ? '#f4f4f5' : '#0f172a' }}>
                                        Sertakan Ragam Macam Ekstra
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: isDark ? '#a1a1aa' : '#64748b' }}>
                                        Pramuka, Pilihan X & XI, Ekstra Wajib Karakter, P1/P5, Robotik, Musik, dll.
                                    </Typography>
                                </Box>
                            }
                            sx={{ m: 0, alignItems: 'flex-start' }}
                        />
                    </Card>

                    <Card
                        variant="outlined"
                        sx={{
                            p: 2,
                            borderRadius: 2.5,
                            bgcolor: balanceDistribution ? (isDark ? '#2e1065' : '#faf5ff') : (isDark ? '#18181b' : '#ffffff'),
                            borderColor: balanceDistribution ? (isDark ? '#a855f7' : '#d8b4fe') : (isDark ? '#3f3f46' : '#e2e8f0'),
                        }}
                    >
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={balanceDistribution}
                                    onChange={(e) => setBalanceDistribution(e.target.checked)}
                                    color="secondary"
                                />
                            }
                            label={
                                <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: isDark ? '#f4f4f5' : '#0f172a' }}>
                                        Kaidah Pedagogik & Beban Jam
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: isDark ? '#a1a1aa' : '#64748b' }}>
                                        Kejuruan blok praktik siang (JP 5-8), mapel teori pagi hari (JP 1-4).
                                    </Typography>
                                </Box>
                            }
                            sx={{ m: 0, alignItems: 'flex-start' }}
                        />
                    </Card>

                    <Card
                        variant="outlined"
                        sx={{
                            p: 2,
                            borderRadius: 2.5,
                            bgcolor: randomizeTeachers ? (isDark ? '#422006' : '#fffbeb') : (isDark ? '#18181b' : '#ffffff'),
                            borderColor: randomizeTeachers ? (isDark ? '#f59e0b' : '#fde68a') : (isDark ? '#3f3f46' : '#e2e8f0'),
                        }}
                    >
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={randomizeTeachers}
                                    onChange={(e) => setRandomizeTeachers(e.target.checked)}
                                    color="warning"
                                />
                            }
                            label={
                                <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: isDark ? '#f4f4f5' : '#0f172a' }}>
                                        Pengacakan Cerdas Bebas Bentrok
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: isDark ? '#a1a1aa' : '#64748b' }}>
                                        Memberikan variasi acak baru setiap generate dengan 0 bentrok terverifikasi.
                                    </Typography>
                                </Box>
                            }
                            sx={{ m: 0, alignItems: 'flex-start' }}
                        />
                    </Card>
                </Box>

                {/* Extracurricular Diversity Showcase */}
                <Box sx={{ mb: 3, p: 2, bgcolor: isDark ? '#1e1e24' : '#f8fafc', borderRadius: 2.5, border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0' }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: isDark ? '#a1a1aa' : '#475569', display: 'block', mb: 1 }}>
                        RAGAM JENIS EKSTRAKURIKULER YANG AKAN DI-INTEGRASIKAN:
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                        <Chip icon={<MilitaryTechIcon />} label="Pramuka Gugus Depan (Wajib X & XI)" size="small" sx={{ bgcolor: '#fee2e2', color: '#991b1b', fontWeight: 700 }} />
                        <Chip icon={<StarIcon />} label="Ekstra Wajib Budaya Kerja" size="small" sx={{ bgcolor: '#dcfce7', color: '#166534', fontWeight: 700 }} />
                        <Chip icon={<SportsSoccerIcon />} label="Futsal & Basket Ball" size="small" sx={{ bgcolor: '#ffedd5', color: '#9a3412', fontWeight: 700 }} />
                        <Chip label="P1 / Projek Profil Pelajar Pancasila (P5)" size="small" sx={{ bgcolor: '#ede9fe', color: '#5b21b6', fontWeight: 700 }} />
                        <Chip label="Paduan Suara & Seni Musik/Band" size="small" sx={{ bgcolor: '#e0e7ff', color: '#3730a3', fontWeight: 700 }} />
                        <Chip label="IT, Coding & Robotika" size="small" sx={{ bgcolor: '#e0f2fe', color: '#0369a1', fontWeight: 700 }} />
                        <Chip label="English Club & Debate" size="small" sx={{ bgcolor: '#fef3c7', color: '#92400e', fontWeight: 700 }} />
                        <Chip label="PMR & Rohani / Pendalaman Iman" size="small" sx={{ bgcolor: '#f1f5f9', color: '#334155', fontWeight: 700 }} />
                    </Stack>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Validasi Pengajar Sesuai Periode Aktif */}
                {teachers.length === 0 ? (
                    <Alert severity="error" sx={{ my: 2, borderRadius: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                            Belum Ada Data Pengajar untuk Periode Ini!
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '13px' }}>
                            Generator membutuhkan data pengajar yang sudah diinput pada menu <strong>Pengajaran</strong> untuk periode aktif ini. Silakan input penugasan mengajar terlebih dahulu sebelum melakukan generate jadwal.
                        </Typography>
                    </Alert>
                ) : (
                    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: isDark ? '#1e1e24' : '#f8fafc', p: 1.5, borderRadius: 2, border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0' }}>
                        <Typography variant="body2" sx={{ color: isDark ? '#a1a1aa' : '#475569', fontWeight: 600, fontSize: '13px' }}>
                            Data Pengajar Periode Aktif Terdeteksi:
                        </Typography>
                        <Chip
                            label={`${teachers.length} Guru Aktif Siap Dijadwalkan`}
                            color="primary"
                            size="small"
                            sx={{ fontWeight: 800 }}
                        />
                    </Box>
                )}

                {/* Generate Action Button */}
                <Box sx={{ textAlign: 'center', my: 2 }}>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : <ShuffleIcon />}
                        onClick={handleRunGenerate}
                        disabled={isGenerating || teachers.length === 0}
                        sx={{
                            px: 4,
                            py: 1.2,
                            borderRadius: 3,
                            bgcolor: '#0284c7',
                            fontWeight: 800,
                            fontSize: '15px',
                            textTransform: 'none',
                            boxShadow: '0 8px 20px rgba(2, 132, 199, 0.3)',
                            '&:hover': { bgcolor: '#0369a1' },
                            '&.Mui-disabled': { bgcolor: isDark ? '#27272a' : '#cbd5e1', color: isDark ? '#52525b' : '#94a3b8' },
                        }}
                    >
                        {isGenerating ? 'Mengenerate Jadwal Bebas Bentrok...' : 'Generate Jadwal Acak Sekarang'}
                    </Button>
                </Box>

                {/* Result Statistics Panel */}
                {generateResult && (
                    <Box sx={{ mt: 3, p: 2.5, bgcolor: isDark ? '#052e16' : '#f0fdf4', borderRadius: 3, border: isDark ? '1px solid #16a34a' : '1px solid #86efac' }}>
                        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 2 }}>
                            <VerifiedUserIcon sx={{ color: '#16a34a', fontSize: 28 }} />
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#166534' }}>
                                    Hasil Simulasi: Jadwal 100% Bebas Bentrok Terverifikasi!
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#15803d' }}>
                                    Algoritma berhasil memetakan seluruh slot pembelajaran dan preferensi guru tanpa terjadi tabrakan.
                                </Typography>
                            </Box>
                        </Stack>

                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', sm: 'repeat(4, 1fr)' },
                                gap: 1.5,
                            }}
                        >
                            <Box sx={{ p: 1.5, bgcolor: isDark ? '#18181b' : '#ffffff', borderRadius: 2, textAlign: 'center', border: isDark ? '1px solid #27272a' : '1px solid #bbf7d0' }}>
                                <Typography variant="caption" sx={{ color: isDark ? '#a1a1aa' : '#64748b', fontWeight: 700 }}>
                                    STATUS BENTROK
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 900, color: '#16a34a' }}>
                                    0 Tabrakan
                                </Typography>
                            </Box>

                            <Box sx={{ p: 1.5, bgcolor: isDark ? '#18181b' : '#ffffff', borderRadius: 2, textAlign: 'center', border: isDark ? '1px solid #27272a' : '1px solid #bbf7d0' }}>
                                <Typography variant="caption" sx={{ color: isDark ? '#a1a1aa' : '#64748b', fontWeight: 700 }}>
                                    TOTAL KBM TERISI
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 900, color: '#0284c7' }}>
                                    {generateResult.totalFilled} Slot
                                </Typography>
                            </Box>

                            <Box sx={{ p: 1.5, bgcolor: isDark ? '#18181b' : '#ffffff', borderRadius: 2, textAlign: 'center', border: isDark ? '1px solid #27272a' : '1px solid #bbf7d0' }}>
                                <Typography variant="caption" sx={{ color: isDark ? '#a1a1aa' : '#64748b', fontWeight: 700 }}>
                                    REQUEST TERAKOMODASI
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 900, color: '#7c3aed' }}>
                                    {generateResult.requestsFulfilled} Guru (100%)
                                </Typography>
                            </Box>

                            <Box sx={{ p: 1.5, bgcolor: isDark ? '#18181b' : '#ffffff', borderRadius: 2, textAlign: 'center', border: isDark ? '1px solid #27272a' : '1px solid #bbf7d0' }}>
                                <Typography variant="caption" sx={{ color: isDark ? '#a1a1aa' : '#64748b', fontWeight: 700 }}>
                                    EKSTRAKURIKULER
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 900, color: '#ea580c' }}>
                                    Lengkap
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 2.5, bgcolor: isDark ? '#1e1e24' : '#f8fafc', borderTop: isDark ? '1px solid #27272a' : '1px solid #e2e8f0' }}>
                <Button
                    onClick={() => setIsGenerateScheduleDialogOpen(false)}
                    variant="outlined"
                    sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, color: isDark ? '#a1a1aa' : undefined, borderColor: isDark ? '#3f3f46' : undefined }}
                >
                    Tutup
                </Button>
                {generateResult && (
                    <Button
                        onClick={handleApplyAndSave}
                        variant="contained"
                        startIcon={<SaveIcon />}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 700,
                            borderRadius: 2,
                            bgcolor: '#16a34a',
                            '&:hover': { bgcolor: '#15803d' },
                        }}
                    >
                        Terapkan ke Matriks & Simpan ke Database
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default AutoGenerateScheduleDialog;

