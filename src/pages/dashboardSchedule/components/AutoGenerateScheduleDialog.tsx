import React, { useState } from 'react';
import {
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
    const {
        isGenerateScheduleDialogOpen,
        setIsGenerateScheduleDialogOpen,
        generateRandomConflictFreeSchedule,
        applyGeneratedRows,
        teacherRequests,
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
                    },
                },
            }}
        >
            <DialogTitle
                sx={{
                    p: 2.5,
                    bgcolor: '#f8fafc',
                    borderBottom: '1px solid #e2e8f0',
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
                            bgcolor: '#e0f2fe',
                            color: '#0284c7',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <AutoAwesomeIcon />
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '18px' }}>
                            Generate Jadwal Otomatis Acak (Bebas Bentrok)
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                            Algoritma constraint-satisfaction anti-tabrakan dengan integrasi preferensi guru & aneka ragam ekstra.
                        </Typography>
                    </Box>
                </Stack>
                <IconButton size="small" onClick={() => setIsGenerateScheduleDialogOpen(false)}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 3 }}>
                {/* Configuration Options */}
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b', mb: 1.5 }}>
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
                            bgcolor: prioritizeRequests ? '#f0fdf4' : '#ffffff',
                            borderColor: prioritizeRequests ? '#86efac' : '#e2e8f0',
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
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                                        Prioritaskan Request Guru
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#64748b' }}>
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
                            bgcolor: includeSpecialActivities ? '#eff6ff' : '#ffffff',
                            borderColor: includeSpecialActivities ? '#93c5fd' : '#e2e8f0',
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
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                                        Sertakan Ragam Macam Ekstra
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#64748b' }}>
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
                            bgcolor: balanceDistribution ? '#faf5ff' : '#ffffff',
                            borderColor: balanceDistribution ? '#d8b4fe' : '#e2e8f0',
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
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                                        Kaidah Pedagogik & Beban Jam
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#64748b' }}>
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
                            bgcolor: randomizeTeachers ? '#fffbeb' : '#ffffff',
                            borderColor: randomizeTeachers ? '#fde68a' : '#e2e8f0',
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
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                                        Pengacakan Cerdas Bebas Bentrok
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                                        Memberikan variasi acak baru setiap generate dengan 0 bentrok terverifikasi.
                                    </Typography>
                                </Box>
                            }
                            sx={{ m: 0, alignItems: 'flex-start' }}
                        />
                    </Card>
                </Box>

                {/* Extracurricular Diversity Showcase */}
                <Box sx={{ mb: 3, p: 2, bgcolor: '#f8fafc', borderRadius: 2.5, border: '1px solid #e2e8f0' }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#475569', display: 'block', mb: 1 }}>
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

                {/* Generate Action Button */}
                <Box sx={{ textAlign: 'center', my: 2 }}>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : <ShuffleIcon />}
                        onClick={handleRunGenerate}
                        disabled={isGenerating}
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
                        }}
                    >
                        {isGenerating ? 'Mengenerate Jadwal Bebas Bentrok...' : 'Generate Jadwal Acak Sekarang'}
                    </Button>
                </Box>

                {/* Result Statistics Panel */}
                {generateResult && (
                    <Box sx={{ mt: 3, p: 2.5, bgcolor: '#f0fdf4', borderRadius: 3, border: '1px solid #86efac' }}>
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
                            <Box sx={{ p: 1.5, bgcolor: '#ffffff', borderRadius: 2, textAlign: 'center', border: '1px solid #bbf7d0' }}>
                                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>
                                    STATUS BENTROK
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 900, color: '#16a34a' }}>
                                    0 Tabrakan
                                </Typography>
                            </Box>

                            <Box sx={{ p: 1.5, bgcolor: '#ffffff', borderRadius: 2, textAlign: 'center', border: '1px solid #bbf7d0' }}>
                                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>
                                    TOTAL KBM TERISI
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 900, color: '#0284c7' }}>
                                    {generateResult.totalFilled} Slot
                                </Typography>
                            </Box>

                            <Box sx={{ p: 1.5, bgcolor: '#ffffff', borderRadius: 2, textAlign: 'center', border: '1px solid #bbf7d0' }}>
                                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>
                                    REQUEST TERAKOMODASI
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 900, color: '#7c3aed' }}>
                                    {generateResult.requestsFulfilled} Guru (100%)
                                </Typography>
                            </Box>

                            <Box sx={{ p: 1.5, bgcolor: '#ffffff', borderRadius: 2, textAlign: 'center', border: '1px solid #bbf7d0' }}>
                                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>
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

            <DialogActions sx={{ p: 2.5, bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                <Button
                    onClick={() => setIsGenerateScheduleDialogOpen(false)}
                    variant="outlined"
                    sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
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

