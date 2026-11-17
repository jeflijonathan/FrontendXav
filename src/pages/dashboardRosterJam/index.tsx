import React from 'react';
import { Box, Grid, Typography, Stack } from '@mui/material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import CheckIcon from '@mui/icons-material/Check';
import { BaseButton } from '@components/Button';
import RosterConfig from './components/RosterConfig';
import RosterSummary from './components/RosterSummary';
import DayScheduleCard from './components/DayScheduleCard';
import RosterLegend from './components/RosterLegend';
import AddSlotDialog from './components/AddSlotDialog';
import RosterJamSkeleton from './components/RosterJamSkeleton';
import { useRosterJam } from './hook/useRosterJam';
import type { DayName } from './store';

const DAYS: DayName[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

const DashboardRosterJam: React.FC = () => {
    const { state, handleSaveAll, handleExport } = useRosterJam();

    const activeDays = state.showSabtu
        ? DAYS
        : state.hariKerja.includes('5')
            ? DAYS.filter((d) => d !== 'Sabtu')
            : DAYS;

    return (
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
            {/* Page Header */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: 2,
                    mb: 3,
                }}
            >
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800 }} color="text.primary">
                        Roster Jam Belajar
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Konfigurasi struktur jam pembelajaran (JP), alokasi durasi menit, serta jadwal harian SMK Xaverius Palembang.
                    </Typography>
                </Box>
                <Stack sx={{ flexWrap: "wrap", direction: "row", alignItems: "center" }} spacing={1.5}>
                    <BaseButton
                        variant="outlined"
                        colorScheme="secondary"
                        startIcon={<FileDownloadOutlinedIcon fontSize="small" />}
                        disabled={state.isLoading}
                        onClick={handleExport}
                        sx={{
                            backgroundColor: '#ffffff',
                            borderColor: '#e2e8f0',
                            color: '#334155',
                            '&:hover': {
                                backgroundColor: '#f8fafc',
                                borderColor: '#cbd5e1',
                            },
                        }}
                    >
                        Export Format
                    </BaseButton>
                    <BaseButton
                        variant="contained"
                        colorScheme="primary"
                        customColor="#4f46e5"
                        startIcon={<CheckIcon fontSize="small" />}
                        isLoading={state.isSaving}
                        disabled={state.isLoading}
                        onClick={handleSaveAll}
                    >
                        Simpan Perubahan
                    </BaseButton>
                </Stack>
            </Box>

            {/* Content or Skeleton Loader */}
            {state.isLoading ? (
                <RosterJamSkeleton daysCount={activeDays.length} />
            ) : (
                <>
                    {/* Top Configuration Controls */}
                    <RosterConfig />

                    {/* Metric Summary Cards */}
                    <RosterSummary />

                    {/* Daily Schedule Grid */}
                    <Grid container spacing={2.5}>
                        {activeDays.map((day) => (
                            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={day}>
                                <DayScheduleCard day={day} />
                            </Grid>
                        ))}
                    </Grid>

                    {/* Bottom Legend */}
                    <RosterLegend />
                </>
            )}

            {/* Add / Edit Slot Dialog */}
            <AddSlotDialog />
        </Box>
    );
};

export default DashboardRosterJam;
