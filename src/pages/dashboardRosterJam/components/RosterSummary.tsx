import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import { BaseCard } from '@components/Card';
import { useRosterJamStore, type DayName } from '../store';

const RosterSummary: React.FC = () => {
    const { state } = useRosterJamStore();

    // Calculate effective JP and non-KBM reduction based on active days
    const activeDays: DayName[] = state.showSabtu
        ? ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
        : ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

    let weeklyJp = 0;
    let totalNonKbmMinutes = 0;
    let totalKbmMinutes = 0;

    activeDays.forEach((day) => {
        const slots = state.schedules[day] || [];
        slots.forEach((s) => {
            const dur = Number(s.durasiMenit) || 45;
            if (s.isEffective) {
                weeklyJp += 1;
                totalKbmMinutes += dur;
            } else {
                totalNonKbmMinutes += dur;
            }
        });
    });

    const standardExpectedMinutes = weeklyJp * (state.jpDuration || 45);
    const compressedReduction = Math.max(0, standardExpectedMinutes - totalKbmMinutes);
    const totalReductionAndOther = totalNonKbmMinutes + compressedReduction;

    const monthlyJp = Math.round(weeklyJp * 4);
    const yearlyJp = weeklyJp * 36; // 36 Pekan Efektif standar Kurikulum Merdeka

    const cards = [
        {
            title: 'Total JP KBM per Minggu',
            value: weeklyJp,
            unit: 'JP / Pekan',
            unitColor: '#4f46e5',
            subtitle: weeklyJp > 0 ? `${totalKbmMinutes} menit tatap muka riil` : 'Belum ada jadwal KBM',
            icon: <CalendarMonthOutlinedIcon sx={{ color: '#4f46e5', fontSize: 24 }} />,
            iconBg: '#eef2ff',
        },
        {
            title: 'Pengurangan Jam Lainnya',
            value: totalReductionAndOther,
            unit: 'Menit / Pekan',
            unitColor: '#d97706',
            subtitle: 'Upacara, Senam, Literasi & Istirahat',
            icon: <ScheduleOutlinedIcon sx={{ color: '#d97706', fontSize: 24 }} />,
            iconBg: '#fef3c7',
        },
        {
            title: 'Akumulasi JP Bulanan',
            value: monthlyJp,
            unit: 'JP / Bulan',
            unitColor: '#7c3aed',
            subtitle: 'Berdasarkan 4 pekan aktif',
            icon: <BarChartOutlinedIcon sx={{ color: '#7c3aed', fontSize: 24 }} />,
            iconBg: '#f3e8ff',
        },
        {
            title: 'Target JP Tahunan (36 ME)',
            value: yearlyJp.toLocaleString('id-ID'),
            unit: 'JP / Tahun',
            unitColor: '#059669',
            subtitle: 'Standar patokan Kurikulum Merdeka',
            icon: <MonetizationOnOutlinedIcon sx={{ color: '#059669', fontSize: 24 }} />,
            iconBg: '#ecfdf5',
        },
    ];

    return (
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
            {cards.map((item, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                    <BaseCard padding={2}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box>
                                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                    {item.title}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.8, mt: 0.5 }}>
                                    <Typography variant="h5" fontWeight={800}>
                                        {item.value}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        fontWeight={700}
                                        sx={{ color: item.unitColor, fontSize: '0.72rem' }}
                                    >
                                        {item.unit}
                                    </Typography>
                                </Box>
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block', fontSize: '0.7rem' }}>
                                    {item.subtitle}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    width: 42,
                                    height: 42,
                                    borderRadius: 2.5,
                                    backgroundColor: item.iconBg,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
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
