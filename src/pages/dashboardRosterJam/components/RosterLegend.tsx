import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { BaseCard } from '@components/Card';

const RosterLegend: React.FC = () => {
    const legends = [
        { label: 'Upacara / Apel Pagi', color: '#9333ea' },
        { label: 'KBM (Kegiatan Belajar Mengajar)', color: '#2563eb' },
        { label: 'Istirahat', color: '#f59e0b' },
        { label: 'Ekstrakurikuler / Kegiatan Mandiri', color: '#10b981' },
    ];

    return (
        <BaseCard sx={{ mt: 3 }} padding={2}>
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: 3,
                }}
            >
                <Typography variant="body2" fontWeight={700}>
                    Keterangan Jenis Jam:
                </Typography>
                <Stack direction="row" flexWrap="wrap" spacing={3} alignItems="center">
                    {legends.map((item, idx) => (
                        <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box
                                sx={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: '50%',
                                    backgroundColor: item.color,
                                }}
                            />
                            <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                {item.label}
                            </Typography>
                        </Box>
                    ))}
                </Stack>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Terakhir diselaraskan: Hari ini, {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
            </Typography>
        </BaseCard>
    );
};

export default RosterLegend;
