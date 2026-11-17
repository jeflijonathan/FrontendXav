import React from 'react';
import {
    Box,
    Grid,
    Skeleton,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Divider,
} from '@mui/material';
import { BaseCard } from '@components/Card';

// ─── 1. CONFIGURATION SKELETON ────────────────────────────────────────────────
export const RosterConfigSkeleton: React.FC = () => {
    return (
        <BaseCard sx={{ mb: 3 }}>
            <Grid container spacing={2.5} alignItems="flex-start">
                {/* 1. Periode / Tahun Ajaran */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                        <Skeleton variant="text" width="70%" height={16} />
                        <Skeleton variant="rounded" width="100%" height={40} sx={{ borderRadius: 2 }} />
                        <Skeleton variant="text" width="85%" height={14} />
                    </Box>
                </Grid>

                {/* 2. Hari Kerja */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                        <Skeleton variant="text" width="50%" height={16} />
                        <Skeleton variant="rounded" width="100%" height={40} sx={{ borderRadius: 2 }} />
                        <Skeleton variant="text" width="90%" height={14} />
                    </Box>
                </Grid>

                {/* 3. Durasi JP Standar */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                        <Skeleton variant="text" width="55%" height={16} />
                        <Skeleton variant="rounded" width="100%" height={40} sx={{ borderRadius: 2 }} />
                        <Skeleton variant="text" width="95%" height={14} />
                    </Box>
                </Grid>

                {/* 4. Status Sinkronisasi */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                        <Skeleton variant="text" width="60%" height={16} />
                        <Skeleton variant="rounded" width="100%" height={40} sx={{ borderRadius: 2 }} />
                        <Skeleton variant="text" width="80%" height={14} />
                    </Box>
                </Grid>
            </Grid>

            <Divider sx={{ my: 2.5, borderColor: 'divider' }} />

            {/* Bottom Controls: Preset Buttons */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', md: 'center' },
                    gap: 1.5,
                }}
            >
                <Skeleton variant="text" width={180} height={20} />
                <Box sx={{ display: 'flex', gap: 1.25, flexWrap: 'wrap' }}>
                    <Skeleton variant="rounded" width={160} height={34} sx={{ borderRadius: 2 }} />
                    <Skeleton variant="rounded" width={150} height={34} sx={{ borderRadius: 2 }} />
                </Box>
            </Box>
        </BaseCard>
    );
};

// ─── 2. METRIC SUMMARY CARDS SKELETON ─────────────────────────────────────────
export const RosterSummarySkeleton: React.FC = () => {
    return (
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
            {[1, 2, 3, 4].map((item) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item}>
                    <BaseCard padding={2}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box sx={{ flex: 1, mr: 2 }}>
                                <Skeleton variant="text" width="70%" height={16} />
                                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 0.5 }}>
                                    <Skeleton variant="text" width="40%" height={36} />
                                    <Skeleton variant="text" width="30%" height={18} />
                                </Box>
                                <Skeleton variant="text" width="85%" height={14} sx={{ mt: 0.5 }} />
                            </Box>
                            <Skeleton
                                variant="rounded"
                                width={42}
                                height={42}
                                sx={{ borderRadius: 2.5, flexShrink: 0 }}
                            />
                        </Box>
                    </BaseCard>
                </Grid>
            ))}
        </Grid>
    );
};

// ─── 3. SINGLE DAY SCHEDULE CARD SKELETON ─────────────────────────────────────
export const DayScheduleCardSkeleton: React.FC = () => {
    return (
        <BaseCard padding={0} sx={{ overflow: 'hidden', height: '100%' }}>
            {/* Header: Day title + Badge + Action buttons */}
            <Box
                sx={{
                    px: 2,
                    py: 1.5,
                    borderBottom: 1,
                    borderColor: 'divider',
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'grey.900' : '#f8fafc'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                    <Skeleton variant="text" width={65} height={24} sx={{ fontWeight: 800 }} />
                    <Skeleton variant="rounded" width={85} height={22} sx={{ borderRadius: 1.5 }} />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <Skeleton variant="circular" width={28} height={28} />
                    <Skeleton variant="circular" width={28} height={28} />
                </Box>
            </Box>

            {/* Table of Slots */}
            <Table size="small">
                <TableHead>
                    <TableRow sx={{ bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'grey.800' : '#f1f5f9') }}>
                        <TableCell sx={{ width: 48, py: 1, px: 1 }}>
                            <Skeleton variant="text" width={28} height={14} />
                        </TableCell>
                        <TableCell sx={{ width: 32, py: 1, px: 0.75 }}>
                            <Skeleton variant="text" width={18} height={14} />
                        </TableCell>
                        <TableCell sx={{ py: 1, px: 1 }}>
                            <Skeleton variant="text" width={40} height={14} />
                        </TableCell>
                        <TableCell sx={{ py: 1, px: 1 }}>
                            <Skeleton variant="text" width={65} height={14} />
                        </TableCell>
                        <TableCell sx={{ width: 75, py: 1, px: 1, textAlign: 'center' }}>
                            <Skeleton variant="text" width={30} height={14} sx={{ mx: 'auto' }} />
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {[1, 2, 3, 4, 5, 6].map((rowIdx) => (
                        <TableRow key={rowIdx}>
                            {/* Menit Input */}
                            <TableCell sx={{ py: 1, px: 1 }}>
                                <Skeleton variant="rounded" width={42} height={28} sx={{ borderRadius: 1 }} />
                            </TableCell>
                            {/* JP Badge */}
                            <TableCell sx={{ py: 1, px: 0.75 }}>
                                <Skeleton variant="rounded" width={22} height={22} sx={{ borderRadius: 1 }} />
                            </TableCell>
                            {/* Waktu Range */}
                            <TableCell sx={{ py: 1, px: 1 }}>
                                <Skeleton variant="text" width={82} height={18} />
                            </TableCell>
                            {/* Kategori Pill */}
                            <TableCell sx={{ py: 1, px: 1 }}>
                                <Skeleton variant="rounded" width={68} height={24} sx={{ borderRadius: 1.5 }} />
                            </TableCell>
                            {/* Action Buttons */}
                            <TableCell sx={{ py: 1, px: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                                    <Skeleton variant="circular" width={18} height={18} />
                                    <Skeleton variant="circular" width={18} height={18} />
                                    <Skeleton variant="circular" width={18} height={18} />
                                    <Skeleton variant="circular" width={18} height={18} />
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </BaseCard>
    );
};

// ─── 4. FULL ROSTER JAM SKELETON PAGE ─────────────────────────────────────────
interface RosterJamSkeletonProps {
    daysCount?: number;
}

export const RosterJamSkeleton: React.FC<RosterJamSkeletonProps> = ({ daysCount = 5 }) => {
    return (
        <Box>
            {/* Top Configuration Controls Skeleton */}
            <RosterConfigSkeleton />

            {/* Metric Summary Cards Skeleton */}
            <RosterSummarySkeleton />

            {/* Daily Schedule Grid Skeleton */}
            <Grid container spacing={2.5}>
                {Array.from({ length: daysCount }).map((_, idx) => (
                    <Grid size={{ xs: 12, md: 6, lg: 4 }} key={idx}>
                        <DayScheduleCardSkeleton />
                    </Grid>
                ))}
            </Grid>

            {/* Bottom Legend Skeleton */}
            <Box sx={{ mt: 3, p: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <Skeleton variant="text" width={100} height={16} />
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Skeleton variant="rounded" width={80} height={24} sx={{ borderRadius: 1.5 }} />
                    <Skeleton variant="rounded" width={85} height={24} sx={{ borderRadius: 1.5 }} />
                    <Skeleton variant="rounded" width={75} height={24} sx={{ borderRadius: 1.5 }} />
                    <Skeleton variant="rounded" width={90} height={24} sx={{ borderRadius: 1.5 }} />
                    <Skeleton variant="rounded" width={80} height={24} sx={{ borderRadius: 1.5 }} />
                </Box>
            </Box>
        </Box>
    );
};

export default RosterJamSkeleton;

