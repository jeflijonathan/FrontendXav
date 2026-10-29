import React from 'react';
import {
    Box,
    Typography,
    Chip,
    IconButton,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { BaseCard } from '@components/Card';
import { useRosterJamStore, type DayName } from '../store';
import { DeleteOutlineOutlined } from '@mui/icons-material';

interface DayScheduleCardProps {
    day: DayName;
}

const getJenisJamStyle = (jenis: string) => {
    const lower = jenis.toLowerCase();
    if (lower.includes('upacara') || lower.includes('apel')) {
        return {
            bg: '#f3e8ff',
            color: '#7e22ce',
            border: '#e9d5ff',
        };
    }
    if (lower.includes('kbm') || lower.includes('belajar')) {
        return {
            bg: '#dbeafe',
            color: '#1d4ed8',
            border: '#bfdbfe',
        };
    }
    if (lower.includes('istirahat')) {
        return {
            bg: '#fef3c7',
            color: '#b45309',
            border: '#fde68a',
        };
    }
    if (lower.includes('ekstra') || lower.includes('mandiri')) {
        return {
            bg: '#dcfce7',
            color: '#15803d',
            border: '#bbf7d0',
        };
    }
    return {
        bg: '#f3f4f6',
        color: '#4b5563',
        border: '#e5e7eb',
    };
};

const DayScheduleCard: React.FC<DayScheduleCardProps> = ({ day }) => {
    const { state, moveSlotUp, moveSlotDown, deleteSlot, openAddDialog } = useRosterJamStore();
    const slots = state.schedules[day] || [];
    const effectiveCount = slots.filter((s) => s.isEffective).length;

    return (
        <BaseCard
            noPadding
            headerSx={{ py: 1.25, px: 2 }}
            title={day.toUpperCase()}
            headerExtra={
                <Chip
                    label={`${effectiveCount} JP Efektif`}
                    size="small"
                    sx={{
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 24,
                    }}
                />
            }
            headerAction={
                <Tooltip title={`Tambah Slot ${day}`}>
                    <IconButton
                        size="small"
                        onClick={() => openAddDialog(day)}
                        sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1.5,
                            p: 0.5,
                            '&:hover': {
                                backgroundColor: '#f8fafc',
                            },
                        }}
                    >
                        <AddIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            }
        >
            <Table size="small" sx={{ minWidth: 260 }}>
                <TableHead>
                    <TableRow sx={{ backgroundColor: '#fafafa' }}>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary', py: 1, px: 1.5, width: 40 }}>
                            JP
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary', py: 1, px: 1.5 }}>
                            Jam
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary', py: 1, px: 1.5 }}>
                            Jenis Jam
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary', py: 1, px: 1, width: 90 }}>
                            Aksi
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {slots.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                Belum ada slot jadwal
                            </TableCell>
                        </TableRow>
                    ) : (
                        slots.map((slot, index) => {
                            const style = getJenisJamStyle(slot.jenisJam);
                            const isFirst = index === 0;
                            const isLast = index === slots.length - 1;

                            return (
                                <TableRow
                                    key={slot.id}
                                    hover
                                    sx={{
                                        '&:last-child td, &:last-child th': { border: 0 },
                                        transition: 'background-color 0.15s ease',
                                    }}
                                >
                                    {/* JP */}
                                    <TableCell sx={{ py: 1, px: 1.5, fontWeight: slot.jp !== '-' ? 700 : 400, color: slot.jp !== '-' ? 'text.primary' : 'text.disabled' }}>
                                        {slot.jp}
                                    </TableCell>

                                    {/* Jam */}
                                    <TableCell sx={{ py: 1, px: 1.5, fontSize: '0.8125rem' }}>
                                        {slot.jam}
                                    </TableCell>

                                    {/* Jenis Jam Chip */}
                                    <TableCell sx={{ py: 1, px: 1.5 }}>
                                        <Chip
                                            label={slot.jenisJam}
                                            size="small"
                                            sx={{
                                                backgroundColor: style.bg,
                                                color: style.color,
                                                border: `1px solid ${style.border}`,
                                                fontWeight: 700,
                                                fontSize: '0.7rem',
                                                height: 22,
                                                borderRadius: 1,
                                            }}
                                        />
                                    </TableCell>

                                    {/* Aksi: Move Up, Move Down, Delete */}
                                    <TableCell align="center" sx={{ py: 0.5, px: 0.5 }}>
                                        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25 }}>
                                            <Tooltip title="Pindahkan ke atas">
                                                <span>
                                                    <IconButton
                                                        size="small"
                                                        disabled={isFirst}
                                                        onClick={() => moveSlotUp(day, slot.id)}
                                                        sx={{ p: 0.3, color: isFirst ? 'text.disabled' : 'text.secondary' }}
                                                    >
                                                        <ArrowUpwardIcon sx={{ fontSize: 16 }} />
                                                    </IconButton>
                                                </span>
                                            </Tooltip>
                                            <Tooltip title="Pindahkan ke bawah">
                                                <span>
                                                    <IconButton
                                                        size="small"
                                                        disabled={isLast}
                                                        onClick={() => moveSlotDown(day, slot.id)}
                                                        sx={{ p: 0.3, color: isLast ? 'text.disabled' : 'text.secondary' }}
                                                    >
                                                        <ArrowDownwardIcon sx={{ fontSize: 16 }} />
                                                    </IconButton>
                                                </span>
                                            </Tooltip>
                                            <Tooltip title="Hapus baris">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => deleteSlot(day, slot.id)}
                                                    sx={{
                                                        p: 0.3,
                                                        color: 'error.main',
                                                        '&:hover': { backgroundColor: 'error.light', color: 'error.dark' },
                                                    }}
                                                >
                                                    <DeleteOutlineOutlined sx={{ fontSize: 16 }} />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </BaseCard>
    );
};

export default DayScheduleCard;
