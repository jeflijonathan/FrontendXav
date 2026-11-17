import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { BaseCard } from '@components/Card';

const RosterLegend: React.FC = () => {
    const legends = [
        { label: 'Upacara / Pembinaan (Jam ke-0)', color: '#9333ea' },
        { label: 'Senam Bersama (Jam ke-0)', color: '#e11d48' },
        { label: 'Literasi / Rohani (Jam ke-0)', color: '#4338ca' },
        { label: 'KBM Tatap Muka (Jam 1 s/d 10)', color: '#2563eb' },
        { label: 'Istirahat / Ishoma (-)', color: '#f59e0b' },
        { label: 'Ekstrakurikuler / Pramuka (-)', color: '#059669' },
    ];

    return (
        <BaseCard sx={{ mt: 3 }} padding={2}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { xs: 'flex-start', md: 'center' },
                    justifyContent: 'space-between',
                    gap: 2,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 800 }} color="text.primary">
                        Keterangan Kategori Jam Belajar:
                    </Typography>
                </Box>
                <Stack sx={{ flexWrap: "wrap", direction: "row", alignItems: "center" }} spacing={2.5} >
                    {legends.map((item, idx) => (
                        <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box
                                sx={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: '50%',
                                    backgroundColor: item.color,
                                    flexShrink: 0,
                                }}
                            />
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, fontSize: '0.73rem' }}>
                                {item.label}
                            </Typography>
                        </Box>
                    ))}
                </Stack>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', fontSize: '0.7rem' }}>
                * Jam awal pembuka otomatis ditetapkan sebagai <strong>Jam ke-0</strong>. Ekstrakurikuler dan Istirahat bertanda strip <strong>(-)</strong>. Beban belajar diselaraskan dengan Alokasi Jam & Kalender Akademik.
            </Typography>
        </BaseCard>
    );
};

export default RosterLegend;
