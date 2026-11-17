import React from 'react';
import {
    Box,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Button,
    Chip,
    Tooltip,
} from '@mui/material';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';
import SchoolIcon from '@mui/icons-material/School';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { BaseCard } from '@components/Card';
import { useRosterJamStore, type DayName } from '../store';

const RosterConfig: React.FC = () => {
    const {
        state,
        selectPeriod,
        applyFlatTemplate,
        clearCurrentSchedule,
        toggleShowSabtu,
    } = useRosterJamStore();

    // Hitung pengurangan waktu KBM akibat jam lainnya (Upacara, Senam, Literasi, Istirahat)
    const activeDays: DayName[] = state.showSabtu
        ? ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
        : ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

    let totalNonKbmMinutes = 0;
    let totalKbmMinutes = 0;
    let totalEffectiveJp = 0;

    activeDays.forEach((day) => {
        const slots = state.schedules[day] || [];
        slots.forEach((s) => {
            const dur = Number(s.durasiMenit) || 45;
            if (s.isEffective) {
                totalKbmMinutes += dur;
                totalEffectiveJp += 1;
            } else {
                totalNonKbmMinutes += dur;
            }
        });
    });

    // Standar flat tanpa pengurangan: totalEffectiveJp * state.jpDuration
    const standardExpectedMinutes = totalEffectiveJp * (state.jpDuration || 45);
    const compressedReduction = Math.max(0, standardExpectedMinutes - totalKbmMinutes);

    const isScheduleEmpty = totalEffectiveJp === 0;

    return (
        <BaseCard sx={{ mb: 3 }}>
            <Grid container spacing={2.5} alignItems="flex-start">
                {/* 1. Periode / Tahun Ajaran dari Table School Information */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <FormControl fullWidth size="small">
                        <InputLabel id="periode-select-label">Periode Akademik (Info Sekolah)</InputLabel>
                        <Select
                            labelId="periode-select-label"
                            value={state.selectedSchoolInfoId || (state.schoolInfoList[0]?.id_school_information || '')}
                            label="Periode Akademik (Info Sekolah)"
                            onChange={(e) => selectPeriod(e.target.value)}
                            sx={{ borderRadius: 2 }}
                        >
                            {state.schoolInfoList.length > 0 ? (
                                state.schoolInfoList.map((school) => (
                                    <MenuItem
                                        key={school.id_school_information}
                                        value={school.id_school_information}
                                        sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}
                                    >
                                        <span>{school.periode || 'Periode Baru'}</span>
                                        {school.status && (
                                            <Chip label="Aktif" size="small" color="success" sx={{ height: 18, fontSize: '0.65rem' }} />
                                        )}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem value={state.periode || '2026/2027 (Ganjil)'}>
                                    {state.periode || '2026/2027 (Ganjil)'}
                                </MenuItem>
                            )}
                        </Select>
                    </FormControl>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        Tersimpan spesifik per ID periode sekolah
                    </Typography>
                </Grid>

                {/* 2. Hari Kerja (Read-Only dari School Information) */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Box
                        sx={{
                            border: '1px solid #e2e8f0',
                            backgroundColor: '#f8fafc',
                            borderRadius: 2,
                            p: 1,
                            minHeight: 40,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                <SchoolIcon sx={{ color: '#64748b', fontSize: 18 }} />
                                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.82rem' }}>
                                    {state.hariKerja}
                                </Typography>
                            </Box>
                            <Chip
                                label="Terkunci"
                                size="small"
                                sx={{ height: 18, fontSize: '0.62rem', fontWeight: 600, bgcolor: '#e2e8f0' }}
                            />
                        </Box>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        Ditetapkan dari Tabel Informasi Sekolah
                    </Typography>
                </Grid>

                {/* 3. Durasi JP Standar (Read-Only dari School Information) */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Box
                        sx={{
                            border: '1px solid #e2e8f0',
                            backgroundColor: '#f8fafc',
                            borderRadius: 2,
                            p: 1,
                            minHeight: 40,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                <AccessTimeIcon sx={{ color: '#64748b', fontSize: 18 }} />
                                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.82rem' }}>
                                    {state.jpDuration || 45} Menit / JP
                                </Typography>
                            </Box>
                            <Chip
                                label="Standar SMK"
                                size="small"
                                sx={{ height: 18, fontSize: '0.62rem', fontWeight: 600, bgcolor: '#e2e8f0' }}
                            />
                        </Box>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        Regulasi standar Kemendikdasmen (Info Sekolah)
                    </Typography>
                </Grid>

                {/* 4. Status Sinkronisasi & Alokasi Pengurangan Jam Lainnya */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Box
                        sx={{
                            border: '1px solid',
                            borderColor: isScheduleEmpty ? '#fed7aa' : '#bbf7d0',
                            backgroundColor: isScheduleEmpty ? '#fff7ed' : '#f0fdf4',
                            borderRadius: 2,
                            p: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                            {isScheduleEmpty ? (
                                <InfoOutlinedIcon sx={{ color: '#ea580c', fontSize: 18 }} />
                            ) : (
                                <CheckCircleOutlinedIcon sx={{ color: '#16a34a', fontSize: 18 }} />
                            )}
                            <Box>
                                <Typography
                                    variant="body2"
                                    fontWeight={700}
                                    color={isScheduleEmpty ? '#c2410c' : '#15803d'}
                                    sx={{ fontSize: '0.78rem', lineHeight: 1.2 }}
                                >
                                    {isScheduleEmpty ? 'Jadwal Kosong' : 'Tersinkronisasi'}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                                    {isScheduleEmpty
                                        ? 'Belum dikonfigurasi'
                                        : `Penyesuaian -${compressedReduction + totalNonKbmMinutes}m jam lainnya`}
                                </Typography>
                            </Box>
                        </Box>
                        <Button
                            variant="text"
                            size="small"
                            onClick={toggleShowSabtu}
                            sx={{ p: 0.5, minWidth: 'auto', fontSize: '0.72rem', fontWeight: 700 }}
                        >
                            {state.showSabtu ? '5 Hari' : '6 Hari'}
                        </Button>
                    </Box>
                    <Tooltip title="Sinkronisasi memperhitungkan alokasi waktu non-KBM (Upacara, Senam, Literasi, Istirahat) yang mengurangi durasi tatap muka reguler">
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block', cursor: 'help' }}>
                            {state.showSabtu ? 'Tampil: Senin - Sabtu (6 Hari)' : 'Tampil: Senin - Jumat (5 Hari)'}
                        </Typography>
                    </Tooltip>
                </Grid>
            </Grid>

            {/* Quick Presets & Toolbar */}
            <Box
                sx={{
                    mt: 2.5,
                    pt: 2,
                    borderTop: 1,
                    borderColor: 'divider',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1.5,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase' }}>
                        Preset & Aksi Jadwal:
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    <Button
                        size="small"
                        variant="outlined"
                        color="inherit"
                        startIcon={<RefreshIcon fontSize="small" />}
                        onClick={() => applyFlatTemplate(state.jpDuration || 45)}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 700,
                            fontSize: '0.78rem',
                        }}
                    >
                        Reset 45 Menit Rata
                    </Button>

                    <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteSweepOutlinedIcon fontSize="small" />}
                        onClick={clearCurrentSchedule}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 700,
                            fontSize: '0.78rem',
                        }}
                    >
                        Kosongkan Jadwal
                    </Button>
                </Box>
            </Box>
        </BaseCard>
    );
};

export default RosterConfig;
