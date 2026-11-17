import React from 'react';
import {
    Alert,
    Box,
    Button,
    Card,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Stack,
    Typography,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import { useScheduleStore } from '../store/useScheduleStore';

const JpRecommendationModal: React.FC = () => {
    const {
        isRecommendationModalOpen,
        setRecommendationModalOpen,
        recommendations,
        autoScheduleSmart,
    } = useScheduleStore();

    const handleApplyAndClose = () => {
        autoScheduleSmart();
        setRecommendationModalOpen(false);
    };

    return (
        <Dialog
            open={isRecommendationModalOpen}
            onClose={() => setRecommendationModalOpen(false)}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle
                sx={{
                    fontWeight: 800,
                    bgcolor: '#f8fafc',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                }}
            >
                <Box
                    sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 2,
                        bgcolor: '#fef3c7',
                        color: '#d97706',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <LightbulbIcon fontSize="small" />
                </Box>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
                        Pedoman & Rekomendasi Penempatan JP (Kaidah Kurikulum SMK)
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                        Standar optimal alokasi jam pembelajaran untuk memaksimalkan daya serap siswa
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ pt: 3 }}>
                <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Mengapa Mapel Kejuruan SMK lebih cocok di JP ke 6-7 atau 6-8 (Blok Siang)?
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: '#334155' }}>
                        Pembelajaran praktik vokasi (Lab Jaringan, Studio DKV, Komputer Akuntansi, Bengkel) membutuhkan alokasi waktu yang panjang tanpa jeda. Menempatkannya pada jam 6 ke atas memastikan sesi praktikum tidak terpotong oleh jam istirahat pagi dan siswa dapat menyelesaikan proyek/karya secara menyeluruh.
                    </Typography>
                </Alert>

                <Stack spacing={2}>
                    {recommendations.map((rule, idx) => (
                        <Card
                            key={idx}
                            elevation={0}
                            sx={{
                                p: 2,
                                borderRadius: 2.5,
                                border: '1px solid #e2e8f0',
                                bgcolor:
                                    rule.type === 'PRODUKTIF_BLOK'
                                        ? '#fffbeb'
                                        : rule.type === 'TEORI_EKSAK_PAGI'
                                        ? '#f5f3ff'
                                        : '#f8fafc',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                                    {rule.subjectName}
                                </Typography>
                                <Chip
                                    size="small"
                                    label={rule.recommendedJpText}
                                    sx={{
                                        fontWeight: 800,
                                        bgcolor: rule.type === 'PRODUKTIF_BLOK' ? '#f59e0b' : '#6366f1',
                                        color: '#ffffff',
                                    }}
                                />
                            </Box>

                            <Typography variant="body2" sx={{ color: '#475569', fontSize: '13px', lineHeight: 1.5 }}>
                                {rule.reason}
                            </Typography>
                        </Card>
                    ))}
                </Stack>

                <Divider sx={{ my: 3 }} />

                <Box
                    sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: '#f0fdf4',
                        border: '1px solid #bbf7d0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <CheckCircleOutlineIcon sx={{ color: '#16a34a', fontSize: 32 }} />
                    <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#166534' }}>
                            Otomatisasi Penjadwalan Berbasis Rekomendasi
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#15803d' }}>
                            Klik tombol di bawah untuk menyusun ulang jadwal agar seluruh mapel produktif berada di blok siang dan mapel teori berada di pagi hari tanpa adanya bentrok guru.
                        </Typography>
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2.5, borderTop: '1px solid #e2e8f0' }}>
                <Button
                    onClick={() => setRecommendationModalOpen(false)}
                    sx={{ textTransform: 'none', color: '#64748b' }}
                >
                    Tutup
                </Button>
                <Button
                    variant="contained"
                    startIcon={<AutoAwesomeIcon />}
                    onClick={handleApplyAndClose}
                    sx={{
                        bgcolor: '#0284c7',
                        textTransform: 'none',
                        fontWeight: 700,
                        borderRadius: 2,
                        boxShadow: 'none',
                        '&:hover': { bgcolor: '#0369a1' },
                    }}
                >
                    Terapkan Rekomendasi ke Jadwal
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default JpRecommendationModal;

