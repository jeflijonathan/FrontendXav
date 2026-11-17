import React, { useState } from 'react';
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
    Select,
    MenuItem,
    TextField,
    Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { BaseCard } from '@components/Card';
import { useRosterJamStore, type DayName } from '../store';

interface DayScheduleCardProps {
    day: DayName;
}

const getJenisJamStyle = (jenis: string) => {
    const lower = (jenis || '').toLowerCase();
    if (lower.includes('upacara') || lower.includes('apel') || lower.includes('pembinaan')) {
        return {
            bg: '#f3e8ff',
            color: '#7e22ce',
            border: '#e9d5ff',
        };
    }
    if (lower.includes('senam')) {
        return {
            bg: '#ffe4e6',
            color: '#e11d48',
            border: '#fecdd3',
        };
    }
    if (lower.includes('literasi') || lower.includes('rohani')) {
        return {
            bg: '#e0e7ff',
            color: '#4338ca',
            border: '#c7d2fe',
        };
    }
    if (lower.includes('kbm') || lower.includes('belajar')) {
        return {
            bg: '#dbeafe',
            color: '#1d4ed8',
            border: '#bfdbfe',
        };
    }
    if (lower.includes('istirahat') || lower.includes('ishoma')) {
        return {
            bg: '#fef3c7',
            color: '#b45309',
            border: '#fde68a',
        };
    }
    if (lower.includes('ekstra') || lower.includes('mandiri') || lower.includes('pramuka')) {
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

const STANDARD_CATEGORIES = ['KBM', 'Upacara', 'Senam', 'Literasi', 'Istirahat', 'Ekstra'];

const DayScheduleCard: React.FC<DayScheduleCardProps> = ({ day }) => {
    const {
        state,
        moveSlotUp,
        moveSlotDown,
        deleteSlot,
        openAddDialog,
        openEditDialog,
        updateSlotDuration,
        updateSlotCategory,
        setDayStartTime,
        setDayAllKbmDuration,
        setState,
    } = useRosterJamStore();

    const slots = state.schedules[day] || [];
    const effectiveCount = slots.filter((s) => s.isEffective).length;

    // Hitung jam mulai hari ini (dari slot pertama atau default)
    const currentStartTime = slots[0]?.jam ? slots[0].jam.split('-')[0].trim() : (day === 'Rabu' ? '06:40' : '07:00');
    const [editStartTime, setEditStartTime] = useState<string>(currentStartTime);
    const [showDayTools, setShowDayTools] = useState<boolean>(false);

    // Kategori gabungan (standar + jenis jam dari API)
    const availableCategories = Array.from(
        new Set([
            ...STANDARD_CATEGORIES,
            ...state.jenisJamList.map((j) => j.name),
        ])
    );

    return (
        <BaseCard
            noPadding
            headerSx={{ py: 1.25, px: 2, backgroundColor: '#fcfcfd' }}
            title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, letterSpacing: '0.04em' }}>
                        {day.toUpperCase()}
                    </Typography>
                    <Chip
                        label={`${effectiveCount} JP KBM`}
                        size="small"
                        color={effectiveCount > 0 ? 'primary' : 'default'}
                        variant={effectiveCount > 0 ? 'filled' : 'outlined'}
                        sx={{
                            fontWeight: 700,
                            fontSize: '0.7rem',
                            height: 22,
                            borderRadius: 1.5,
                        }}
                    />
                </Box>
            }
            headerAction={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Tooltip title="Atur Jam Mulai & Durasi Massal">
                        <IconButton
                            size="small"
                            onClick={() => setShowDayTools(!showDayTools)}
                            color={showDayTools ? 'primary' : 'default'}
                            sx={{
                                border: '1px solid',
                                borderColor: showDayTools ? 'primary.main' : 'divider',
                                borderRadius: 1.5,
                                p: 0.5,
                            }}
                        >
                            <AccessTimeIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                    </Tooltip>
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
                </Box>
            }
        >
            {/* Quick Header Tool: Jam Mulai & Penyesuaian Massal */}
            {showDayTools && slots.length > 0 && (
                <Box
                    sx={{
                        p: 1.25,
                        backgroundColor: '#f8fafc',
                        borderBottom: '1px solid #e2e8f0',
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 1,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                            Mulai:
                        </Typography>
                        <TextField
                            type="time"
                            size="small"
                            value={editStartTime}
                            onChange={(e) => {
                                setEditStartTime(e.target.value);
                                setDayStartTime(day, e.target.value);
                            }}
                            sx={{
                                width: 105,
                                '& .MuiInputBase-input': { py: 0.3, px: 0.8, fontSize: '0.75rem', fontWeight: 700 },
                            }}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                            Semua KBM:
                        </Typography>
                        {[45, 40, 35].map((m) => (
                            <Button
                                key={m}
                                size="small"
                                variant="outlined"
                                onClick={() => setDayAllKbmDuration(day, m)}
                                sx={{
                                    py: 0.1,
                                    px: 0.8,
                                    minWidth: 32,
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    borderRadius: 1,
                                }}
                            >
                                {m}m
                            </Button>
                        ))}
                    </Box>
                </Box>
            )}

            <Table size="small" sx={{ minWidth: 320 }}>
                <TableHead>
                    <TableRow sx={{ backgroundColor: '#fafafa' }}>
                        <TableCell sx={{ fontWeight: 700, fontSize: '0.72rem', color: 'text.secondary', py: 1, px: 0.8, width: 56, textAlign: 'center' }}>
                            Menit
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: '0.72rem', color: 'text.secondary', py: 1, px: 0.6, width: 34, textAlign: 'center' }}>
                            JP
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: '0.72rem', color: 'text.secondary', py: 1, px: 1 }}>
                            Waktu
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: '0.72rem', color: 'text.secondary', py: 1, px: 1, width: 110 }}>
                            Kategori Jam
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.72rem', color: 'text.secondary', py: 1, px: 0.5, width: 88 }}>
                            Aksi
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {slots.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, fontSize: '0.82rem' }}>
                                    Belum ada jadwal KBM pada periode ini
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        startIcon={<AddIcon sx={{ fontSize: 14 }} />}
                                        onClick={() => openAddDialog(day)}
                                        sx={{ textTransform: 'none', fontSize: '0.72rem', fontWeight: 700, borderRadius: 1.5 }}
                                    >
                                        Tambah Slot
                                    </Button>
                                </Box>
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
                                    {/* 1. Input Menit Kolom (Sebelum JP) */}
                                    <TableCell sx={{ py: 0.85, px: 0.8, textAlign: 'center' }}>
                                        <TextField
                                            type="number"
                                            size="small"
                                            value={slot.durasiMenit || 45}
                                            onChange={(e) => updateSlotDuration(day, slot.id, Number(e.target.value))}
                                            inputProps={{ min: 5, max: 240, step: 5 }}
                                            sx={{
                                                width: 48,
                                                '& .MuiInputBase-root': {
                                                    borderRadius: 1,
                                                    backgroundColor: '#ffffff',
                                                },
                                                '& .MuiInputBase-input': {
                                                    py: 0.3,
                                                    px: 0.4,
                                                    fontSize: '0.74rem',
                                                    fontWeight: 700,
                                                    textAlign: 'center',
                                                },
                                            }}
                                        />
                                    </TableCell>

                                    {/* 2. JP Kolom */}
                                    <TableCell sx={{ py: 0.85, px: 0.6, textAlign: 'center' }}>
                                        {slot.jp === 0 ? (
                                            <Chip
                                                label="0"
                                                size="small"
                                                sx={{
                                                    backgroundColor: '#f3e8ff',
                                                    color: '#7e22ce',
                                                    border: '1px solid #e9d5ff',
                                                    fontWeight: 800,
                                                    fontSize: '0.7rem',
                                                    height: 20,
                                                    minWidth: 22,
                                                    borderRadius: 1,
                                                }}
                                            />
                                        ) : slot.jp !== '-' ? (
                                            <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main', fontSize: '0.82rem' }}>
                                                {slot.jp}
                                            </Typography>
                                        ) : (
                                            <Typography variant="body2" sx={{ color: 'text.disabled', fontWeight: 700 }}>
                                                -
                                            </Typography>
                                        )}
                                    </TableCell>

                                    {/* 3. Waktu (Rentang Jam) */}
                                    <TableCell sx={{ py: 0.85, px: 1 }}>
                                        <Typography
                                            variant="body2"
                                            sx={{ fontSize: '0.78rem', fontWeight: 700, color: 'text.primary', letterSpacing: '-0.01em', lineHeight: 1.2, whiteSpace: 'nowrap' }}
                                        >
                                            {slot.jam}
                                        </Typography>
                                    </TableCell>

                                    {/* 4. Kategori Jam: Inline Dropdown Select */}
                                    <TableCell sx={{ py: 0.85, px: 1 }}>
                                        <Select
                                            size="small"
                                            value={slot.jenisJam}
                                            onChange={(e) => updateSlotCategory(day, slot.id, e.target.value)}
                                            sx={{
                                                fontSize: '0.72rem',
                                                fontWeight: 700,
                                                height: 28,
                                                borderRadius: 1.5,
                                                backgroundColor: style.bg,
                                                color: style.color,
                                                border: `1px solid ${style.border}`,
                                                '& .MuiSelect-select': {
                                                    py: 0.3,
                                                    px: 1,
                                                },
                                                '& fieldset': {
                                                    border: 'none',
                                                },
                                            }}
                                        >
                                            {availableCategories.map((cat) => {
                                                const catStyle = getJenisJamStyle(cat);
                                                return (
                                                    <MenuItem
                                                        key={cat}
                                                        value={cat}
                                                        sx={{
                                                            fontSize: '0.76rem',
                                                            fontWeight: 700,
                                                            color: catStyle.color,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 1,
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                width: 8,
                                                                height: 8,
                                                                borderRadius: '50%',
                                                                backgroundColor: catStyle.color,
                                                            }}
                                                        />
                                                        {cat}
                                                    </MenuItem>
                                                );
                                            })}
                                        </Select>
                                    </TableCell>

                                    {/* 5. Aksi: Edit, Move Up, Move Down, Delete */}
                                    <TableCell align="center" sx={{ py: 0.5, px: 0.5 }}>
                                        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.1 }}>
                                            <Tooltip title="Edit Rinci">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => openEditDialog(day, slot)}
                                                    sx={{ p: 0.35, color: 'primary.main', '&:hover': { bgcolor: 'primary.50' } }}
                                                >
                                                    <EditOutlinedIcon sx={{ fontSize: 15 }} />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Pindahkan ke atas (urutan jam menyesuaikan otomatis)">
                                                <span>
                                                    <IconButton
                                                        size="small"
                                                        disabled={isFirst}
                                                        onClick={() => moveSlotUp(day, slot.id)}
                                                        sx={{ p: 0.3, color: isFirst ? 'text.disabled' : 'text.secondary' }}
                                                    >
                                                        <ArrowUpwardIcon sx={{ fontSize: 15 }} />
                                                    </IconButton>
                                                </span>
                                            </Tooltip>
                                            <Tooltip title="Pindahkan ke bawah (urutan jam menyesuaikan otomatis)">
                                                <span>
                                                    <IconButton
                                                        size="small"
                                                        disabled={isLast}
                                                        onClick={() => moveSlotDown(day, slot.id)}
                                                        sx={{ p: 0.3, color: isLast ? 'text.disabled' : 'text.secondary' }}
                                                    >
                                                        <ArrowDownwardIcon sx={{ fontSize: 15 }} />
                                                    </IconButton>
                                                </span>
                                            </Tooltip>
                                            <Tooltip title="Hapus slot">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => deleteSlot(day, slot.id)}
                                                    sx={{ p: 0.3, color: 'error.main', '&:hover': { bgcolor: 'error.50' } }}
                                                >
                                                    <DeleteOutlineOutlinedIcon sx={{ fontSize: 15 }} />
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
