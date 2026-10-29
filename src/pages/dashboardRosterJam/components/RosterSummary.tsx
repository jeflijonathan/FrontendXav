import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import { BaseCard } from '@components/Card';
import { useRosterJamStore } from '../store';

const RosterSummary: React.FC = () => {
    const { state } = useRosterJamStore();

    // Calculate effective JP per week
    let weeklyJp = 0;
    Object.values(state.schedules).forEach((daySlots) => {
        const effectiveCount = daySlots.filter((slot) => slot.isEffective).length;
        weeklyJp += effectiveCount;
    });

    // If no effective JP calculated (fallback to standard 24)
    if (weeklyJp === 0) weeklyJp = 24;

    const monthlyJp = Math.round(weeklyJp * 3.916);
    const yearlyJp = monthlyJp * 12;

    const cards = [
        {
            title: 'Total JP per minggu',
            value: weeklyJp,
            unit: 'JP / Pekan',
            unitColor: '#4f46e5',
            subtitle: 'Alokasi reguler kelas',
            icon: <CalendarMonthOutlinedIcon sx={{ color: '#4f46e5', fontSize: 26 }} />,
            iconBg: '#eef2ff',
        },
        {
            title: 'Total JP per bulan',
            value: monthlyJp,
            unit: 'JP / Bulan',
            unitColor: '#7c3aed',
            subtitle: 'Berdasarkan 4 pekan aktif',
            icon: <BarChartOutlinedIcon sx={{ color: '#7c3aed', fontSize: 26 }} />,
            iconBg: '#f3e8ff',
        },
        {
            title: 'Total JP per Tahun',
            value: yearlyJp.toLocaleString('id-ID'),
            unit: 'JP / Tahun',
            unitColor: '#059669',
            subtitle: 'Total beban belajar tahunan',
            icon: <MonetizationOnOutlinedIcon sx={{ color: '#059669', fontSize: 26 }} />,
            iconBg: '#ecfdf5',
        },
    ];

    return (
        <Grid container spacing={3} sx={{ mb: 3 }}>
            {cards.map((item, index) => (
                <Grid size={{ xs: 12, md: 4 }} key={index}>
                    <BaseCard padding={2.5}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box>
                                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                    {item.title}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 0.5 }}>
                                    <Typography variant="h4" fontWeight={700}>
                                        {item.value}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        fontWeight={700}
                                        sx={{ color: item.unitColor }}
                                    >
                                        {item.unit}
                                    </Typography>
                                </Box>
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                    {item.subtitle}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 3,
                                    backgroundColor: item.iconBg,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                {item.icon}
                            </Box>
                        </Box>
                    </BaseCard>
                </Grid>
            ))}
        </Grid>
    );
};

export default RosterSummary;
