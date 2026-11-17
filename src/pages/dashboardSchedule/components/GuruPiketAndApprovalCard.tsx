import React from 'react';
import {
    Box,
    Card,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useScheduleStore } from '../store/useScheduleStore';

const GuruPiketAndApprovalCard: React.FC = () => {
    const { guruPiket } = useScheduleStore();

    return (
        <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Daftar Guru Piket */}
            <Grid size={{ xs: 12, md: 6 }}>
                <Card
                    elevation={0}
                    sx={{
                        borderRadius: 3,
                        border: '1px solid #cbd5e1',
                        p: 2.5,
                        bgcolor: '#ffffff',
                        height: '100%',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                        <Box
                            sx={{
                                width: 34,
                                height: 34,
                                borderRadius: 2,
                                bgcolor: '#fef3c7',
                                color: '#b45309',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <AssignmentIndIcon fontSize="small" />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                                DAFTAR GURU PIKET HARIAN
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                                Lampiran Jadwal Pelajaran SMK Xaverius Palembang
                            </Typography>
                        </Box>
                    </Box>

                    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2 }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#f8fafc' }}>
                                    <TableCell sx={{ fontWeight: 800, width: 50, textAlign: 'center' }}>NO</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>NAMA GURU PIKET</TableCell>
                                    <TableCell sx={{ fontWeight: 800, width: 140, textAlign: 'center' }}>PERAN</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {guruPiket.map((piket, idx) => (
                                    <TableRow key={idx} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                                        <TableCell sx={{ textAlign: 'center', fontWeight: 700 }}>
                                            {idx + 1}
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>
                                            {piket.name}
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center', fontSize: '11px', color: '#64748b' }}>
                                            {piket.role || 'Guru Piket'}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            </Grid>

            {/* Lembar Pengesahan Kepala Sekolah */}
            <Grid size={{ xs: 12, md: 6 }}>
                <Card
                    elevation={0}
                    sx={{
                        borderRadius: 3,
                        border: '1px solid #cbd5e1',
                        p: 2.5,
                        bgcolor: '#ffffff',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '100%',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                        <Box
                            sx={{
                                width: 34,
                                height: 34,
                                borderRadius: 2,
                                bgcolor: '#dcfce7',
                                color: '#15803d',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <VerifiedIcon fontSize="small" />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                                LEMBAR PENGESAHAN DOKUMEN
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                                Berlaku sah untuk kegiatan belajar mengajar semester berjalan
                            </Typography>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            border: '1px dashed #cbd5e1',
                            bgcolor: '#fafafa',
                            textAlign: 'right',
                        }}
                    >
                        <Typography variant="body2" sx={{ color: '#475569', mb: 1 }}>
                            Palembang, 10 Juli 2026
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b', mb: 6 }}>
                            Kepala Sekolah SMK Xaverius Palembang
                        </Typography>

                        <Box sx={{ display: 'inline-block', textAlign: 'center' }}>
                            <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: 800, color: '#0f172a', textDecoration: 'underline' }}
                            >
                                Merly Puspita, S.Pd.
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                                NIY. 19840214 200801 2 001
                            </Typography>
                        </Box>
                    </Box>
                </Card>
            </Grid>
        </Grid>
    );
};

export default GuruPiketAndApprovalCard;

