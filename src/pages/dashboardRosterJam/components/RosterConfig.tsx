import React from 'react';
import {
    Box,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Typography,
    Chip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { BaseCard } from '@components/Card';
import { BaseButton } from '@components/Button';
import { useRosterJamStore } from '../store';

const RosterConfig: React.FC = () => {
    const { state, setState } = useRosterJamStore();

    return (
        <BaseCard sx={{ mb: 3 }}>
            <Grid container spacing={3} alignItems="flex-start">
                {/* Periode */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <FormControl fullWidth size="small">
                        <InputLabel id="periode-select-label">Periode</InputLabel>
                        <Select
                            labelId="periode-select-label"
                            value={state.periode}
                            label="Periode"
                            onChange={(e) =>
                                setState((prev) => ({ ...prev, periode: e.target.value }))
                            }
                            sx={{ borderRadius: 2 }}
                        >
                            <MenuItem value="2026/2027 (Ganjil)">2026/2027 (Ganjil)</MenuItem>
                            <MenuItem value="2026/2027 (Genap)">2026/2027 (Genap)</MenuItem>
                            <MenuItem value="2025/2026 (Genap)">2025/2026 (Genap)</MenuItem>
                        </Select>
                    </FormControl>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        Tahun akademik aktif sistem
                    </Typography>
                </Grid>

                {/* Hari Kerja */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <FormControl fullWidth size="small">
                        <InputLabel id="hari-kerja-label">Hari Kerja</InputLabel>
                        <Select
                            labelId="hari-kerja-label"
                            value={state.hariKerja}
                            label="Hari Kerja"
                            onChange={(e) =>
                                setState((prev) => ({ ...prev, hariKerja: e.target.value }))
                            }
                            sx={{ borderRadius: 2 }}
                        >
                            <MenuItem value="6 hari (Senin - Sabtu)">6 hari (Senin - Sabtu)</MenuItem>
                            <MenuItem value="5 hari (Senin - Jumat)">5 hari (Senin - Jumat)</MenuItem>
                        </Select>
                    </FormControl>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        Total hari persekolahan rutin
                    </Typography>
                </Grid>

                {/* Jam Pembelajaran (JP) */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <TextField
                        label="Jam Pembelajaran (JP)"
                        value={state.jpDuration}
                        onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            setState((prev) => ({ ...prev, jpDuration: val }));
                        }}
                        type="number"
                        size="small"
                        fullWidth
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap', ml: 1 }}>
                                        Menit / JP
                                    </Typography>
                                ),
                                sx: { borderRadius: 2 },
                            },
                        }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        Durasi 1 JP kegiatan belajar
                    </Typography>
                </Grid>

                {/* Status Kalender */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Box
                        sx={{
                            border: '1px solid #bbf7d0',
                            backgroundColor: '#f0fdf4',
                            borderRadius: 2,
                            p: 1.25,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box
                                sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    backgroundColor: '#16a34a',
                                }}
                            />
                            <Typography variant="body2" fontWeight={600} color="#15803d">
                                Tersinkronisasi
                            </Typography>
                        </Box>
                        <BaseButton
                            variant="text"
                            size="small"
                            colorScheme="success"
                            sx={{ p: 0.5, minWidth: 'auto', fontSize: '0.8rem', fontWeight: 600 }}
                        >
                            Validasi Jam
                        </BaseButton>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        Total alokasi kurikulum terpenuhi
                    </Typography>
                </Grid>
            </Grid>
        </BaseCard>
    );
};

export default RosterConfig;
