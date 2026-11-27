import React from 'react';
import {
    Box,
    Button,
    Chip,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TableChartIcon from '@mui/icons-material/TableChart';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlined';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import SearchIcon from '@mui/icons-material/Search';
import { useScheduleStore } from '../store/useScheduleStore';
import type { DayName } from '../types';

const DAYS: DayName[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

const ScheduleControlBar: React.FC = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const {
        viewMode,
        setViewMode,
        setSelectedClassForInput,
        selectedDayFilter,
        setSelectedDayFilter,
        selectedClassFilter,
        setSelectedClassFilter,
        searchQuery,
        setSearchQuery,
        conflicts,
        classes,
        teachers,
        setIsClassListModalOpen,
    } = useScheduleStore();

    const totalConflicts = conflicts.length;

    const getClassConflictCount = (className: string) => {
        return conflicts.filter((c) => c.conflictedClasses.includes(className)).length;
    };

    return (
        <Box
            sx={{
                mb: 2.5,
                p: { xs: 1.75, sm: 2 },
                bgcolor: isDark ? '#141416' : '#ffffff',
                borderRadius: 3,
                border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
                boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.5)' : '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
            }}
        >
            {/* Baris 1: Switcher Tampilan & Ringkasan Status */}
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                sx={{
                    alignItems: { xs: 'stretch', sm: 'center' },
                    justifyContent: 'space-between',
                    pb: 1.75,
                    borderBottom: isDark ? '1px solid #27272a' : '1px solid #f1f5f9',
                }}
            >
                <ToggleButtonGroup
                    value={viewMode}
                    exclusive
                    onChange={(_, newMode) => {
                        if (newMode) setViewMode(newMode);
                    }}
                    size="small"
                    sx={{
                        bgcolor: isDark ? '#1e1e24' : '#f1f5f9',
                        p: 0.5,
                        borderRadius: 2,
                        alignSelf: { xs: 'stretch', sm: 'auto' },
                        '& .MuiToggleButton-root': {
                            flex: { xs: 1, sm: 'initial' },
                            border: 'none',
                            borderRadius: 1.5,
                            textTransform: 'none',
                            fontWeight: 700,
                            fontSize: '12.5px',
                            px: { xs: 1.5, sm: 2 },
                            py: 0.65,
                            whiteSpace: 'nowrap',
                            color: isDark ? '#a1a1aa' : '#64748b',
                            '&.Mui-selected': {
                                bgcolor: isDark ? '#27272a' : '#ffffff',
                                color: isDark ? '#60a5fa' : '#1d4ed8',
                                boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.4)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                            },
                        },
                    }}
                >
                    <ToggleButton value="matrix">
                        <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
                            <TableChartIcon sx={{ fontSize: 16 }} />
                            <span>Matriks</span>
                        </Stack>
                    </ToggleButton>
                    <ToggleButton value="per_class">
                        <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
                            <CalendarMonthIcon sx={{ fontSize: 16 }} />
                            <span>Per Kelas</span>
                        </Stack>
                    </ToggleButton>
                </ToggleButtonGroup>

                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', alignItems: 'center', gap: 0.75 }}>
                    <Chip
                        label={`${classes.length} Kelas • ${teachers.length} Guru`}
                        size="small"
                        sx={{
                            bgcolor: isDark ? '#1e1e24' : '#f1f5f9',
                            color: isDark ? '#cbd5e1' : '#334155',
                            fontWeight: 600,
                            fontSize: '11.5px',
                            border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
                        }}
                    />

                    {totalConflicts === 0 ? (
                        <Chip
                            icon={<CheckCircleOutlineIcon sx={{ fontSize: '15px !important' }} />}
                            label="0 Bentrok"
                            size="small"
                            sx={{
                                bgcolor: isDark ? 'rgba(4, 120, 87, 0.2)' : '#ecfdf5',
                                color: isDark ? '#6ee7b7' : '#047857',
                                fontWeight: 700,
                                fontSize: '11.5px',
                                border: isDark ? '1px solid rgba(4, 120, 87, 0.4)' : '1px solid #a7f3d0',
                            }}
                        />
                    ) : (
                        <Chip
                            clickable
                            onClick={() => setIsClassListModalOpen(true)}
                            icon={<ErrorOutlineIcon sx={{ fontSize: '15px !important' }} />}
                            label={`${totalConflicts} Bentrok`}
                            size="small"
                            sx={{
                                bgcolor: isDark ? 'rgba(185, 28, 28, 0.2)' : '#fef2f2',
                                color: isDark ? '#fca5a5' : '#b91c1c',
                                fontWeight: 700,
                                fontSize: '11.5px',
                                border: isDark ? '1px solid rgba(185, 28, 28, 0.4)' : '1px solid #fecaca',
                            }}
                        />
                    )}
                </Stack>
            </Stack>

            {/* Baris 2: Filter Responsif (Hari, Kelas, Pencarian, Daftar Kelas) */}
            <Grid container spacing={1.25} sx={{ pt: 1.75, alignItems: 'center' }}>
                <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
                    <FormControl fullWidth size="small">
                        <InputLabel id="day-filter-label">Hari</InputLabel>
                        <Select
                            labelId="day-filter-label"
                            value={selectedDayFilter}
                            label="Hari"
                            onChange={(e) => setSelectedDayFilter(e.target.value as any)}
                        >
                            <MenuItem value="Semua">Semua Hari</MenuItem>
                            {DAYS.map((d) => (
                                <MenuItem key={d} value={d}>
                                    {d}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <FormControl fullWidth size="small">
                        <InputLabel id="class-filter-label">Kelas</InputLabel>
                        <Select
                            labelId="class-filter-label"
                            value={selectedClassFilter}
                            label="Kelas"
                            onChange={(e) => {
                                const val = e.target.value;
                                setSelectedClassFilter(val);
                                if (val !== 'Semua') {
                                    setSelectedClassForInput(val);
                                }
                            }}
                            sx={{
                                '& .MuiSelect-select': {
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                },
                            }}
                        >
                            <MenuItem value="Semua">Semua Kelas ({classes.length})</MenuItem>
                            {classes.map((cls) => {
                                const count = getClassConflictCount(cls.name);
                                return (
                                    <MenuItem key={cls.id || cls.name} value={cls.name}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 1 }}>
                                            <span>{cls.name}</span>
                                            {count > 0 && (
                                                <Box
                                                    sx={{
                                                        minWidth: 18,
                                                        height: 18,
                                                        px: 0.5,
                                                        borderRadius: '999px',
                                                        bgcolor: '#ef4444',
                                                        color: '#ffffff',
                                                        fontSize: '10px',
                                                        fontWeight: 800,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    {count}
                                                </Box>
                                            )}
                                        </Box>
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 8, md: 4.5 }}>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Cari kode, nama guru, atau mapel..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        slotProps={{
                            input: {
                                startAdornment: <SearchIcon fontSize="small" sx={{ color: isDark ? '#71717a' : '#94a3b8', mr: 1 }} />,
                            },
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                bgcolor: isDark ? '#18181b' : '#ffffff',
                                color: isDark ? '#f4f4f5' : '#0f172a',
                            },
                        }}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 4, md: 2 }}>
                    <Button
                        fullWidth
                        variant="outlined"
                        size="small"
                        startIcon={<MeetingRoomIcon />}
                        onClick={() => setIsClassListModalOpen(true)}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 700,
                            borderRadius: 2,
                            minHeight: 40,
                            whiteSpace: 'nowrap',
                            borderColor: totalConflicts > 0 ? '#fca5a5' : (isDark ? '#3f3f46' : '#cbd5e1'),
                            color: totalConflicts > 0 ? '#dc2626' : (isDark ? '#e4e4e7' : '#334155'),
                            bgcolor: totalConflicts > 0 ? (isDark ? 'rgba(239, 68, 68, 0.15)' : '#fff5f5') : 'transparent',
                            '&:hover': {
                                borderColor: totalConflicts > 0 ? '#ef4444' : '#3b82f6',
                                bgcolor: totalConflicts > 0 ? '#fee2e2' : (isDark ? '#27272a' : '#f8fafc'),
                            },
                        }}
                    >
                        Daftar Kelas
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ScheduleControlBar;
