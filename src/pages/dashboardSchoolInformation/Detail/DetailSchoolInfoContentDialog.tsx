import React from 'react';
import {
    Grid,
    Typography,
    Chip,
    Box,
    Paper
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';

interface Headmaster {
    first_name: string;
    last_name: string;
}

interface SchoolDetail {
    name_school: string;
    NPSN?: string;
    periode?: string;
    alamat?: string;
    headmaster?: Headmaster;
    status: boolean;
    created_at: string;
    updated_at: string;
}

interface DetailSchoolInfoContentDialogProps {
    detail: SchoolDetail;
}

const DetailSchoolInfoContentDialog: React.FC<DetailSchoolInfoContentDialogProps> = ({ detail }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 1 }}>
            <Paper
                elevation={0}
                sx={{
                    p: 2.5,
                    bgcolor: 'grey.50',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider'
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

                    <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <SchoolIcon color="primary" fontSize="small" />
                                <Typography variant="subtitle2" color="text.secondary">Nama Sekolah</Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 8 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                {detail.name_school}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Typography variant="subtitle2" color="text.secondary">NPSN</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 8 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {detail.NPSN || '-'}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CalendarTodayIcon color="action" fontSize="small" />
                                <Typography variant="subtitle2" color="text.secondary">Periode</Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 8 }}>
                            <Typography variant="body2">
                                {detail.periode || '-'}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LocationOnIcon color="action" fontSize="small" />
                                <Typography variant="subtitle2" color="text.secondary">Alamat</Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 8 }}>
                            <Typography variant="body2" color="text.secondary">
                                {detail.alamat || '-'}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PersonIcon color="action" fontSize="small" />
                                <Typography variant="subtitle2" color="text.secondary">Kepala Sekolah</Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 8 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {detail.headmaster ? `${detail.headmaster.first_name} ${detail.headmaster.last_name}` : '-'}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 8 }}>
                            <Chip
                                label={detail.status ? 'Aktif' : 'Non Aktif'}
                                color={detail.status ? 'success' : 'error'}
                                size="small"
                                variant="filled"
                                sx={{ fontWeight: 600, px: 1 }}
                            />
                        </Grid>
                    </Grid>

                </Box>
            </Paper>

            {/* Section 2: Metadata / Riwayat Waktu */}
            <Box sx={{ px: 1 }}>
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 700, display: 'block', mb: 1.5 }}
                >
                    INFORMASI SISTEM
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>

                    <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Typography variant="caption" color="text.secondary">Dibuat Pada</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 8 }}>
                            <Typography variant="caption" color="text.primary" sx={{ fontWeight: 500 }}>
                                {new Date(detail.created_at).toLocaleString('id-ID')}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Typography variant="caption" color="text.secondary">Diperbarui Pada</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 8 }}>
                            <Typography variant="caption" color="text.primary" sx={{ fontWeight: 500 }}>
                                {new Date(detail.updated_at).toLocaleString('id-ID')}
                            </Typography>
                        </Grid>
                    </Grid>

                </Box>
            </Box>

        </Box>
    );
};

export default DetailSchoolInfoContentDialog;