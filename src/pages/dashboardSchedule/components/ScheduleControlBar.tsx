import React from 'react';
import {
    Box,
    Button,
    Chip,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
    Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TableChartIcon from '@mui/icons-material/TableChart';
import RefreshIcon from '@mui/icons-material/Refresh';
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
        selectedClassForInput,
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

    // Total conflicts across all classes
    const totalConflicts = conflicts.length;

    // Helper to get conflict count for a specific class
    const getClassConflictCount = (className: string) => {
        return conflicts.filter((c) => c.conflictedClasses.includes(className)).length;
    };

    return (
        <Box
            sx={{
                mb: 3,
                p: { xs: 2, md: 2.5 },
                bgcolor: isDark ? '#141416' : '#ffffff',
                borderRadius: 3,
                border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
                boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.5)' : '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
            }}
        >
            {/* Row 1: View Switcher (Versi 1 vs Versi 2) & Quick Class Selector if in Versi 2 */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { xs: 'stretch', md: 'center' },
                    justifyContent: 'space-between',
                    gap: 2,
                    pb: 2,
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
                        '& .MuiToggleButton-root': {
                            border: 'none',
                            borderRadius: 1.5,
                            textTransform: 'none',
                            fontWeight: 700,
                            px: 2,
                            py: 0.8,
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
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                            <TableChartIcon fontSize="small" sx={{ color: isDark ? '#60a5fa' : '#2563eb' }} />
                            <span>Versi 1 (Matriks Sheet Asli)</span>
                        </Stack>
                    </ToggleButton>
                    <ToggleButton value="per_class">
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                            <CalendarMonthIcon fontSize="small" sx={{ color: isDark ? '#a1a1aa' : '#475569' }} />
                            <span>Versi 2 (Per Hari & Paginasi Kelas)</span>
                        </Stack>
                    </ToggleButton>
                </ToggleButtonGroup>

                {/* KPI Status Chips */}
                <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap', alignItems: 'center' }}>
                    <Chip
                        icon={<TableChartIcon sx={{ fontSize: '16px !important' }} />}
                        label={`${classes.length} Kelas Rombel Database`}
                        size="small"
                        sx={{
                            bgcolor: isDark ? '#1e1e24' : '#f1f5f9',
                            color: isDark ? '#cbd5e1' : '#334155',
                            fontWeight: 600,
                            border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
                        }}
                    />

                    <Chip
                        icon={<RefreshIcon sx={{ fontSize: '16px !important' }} />}
                        label={`${teachers.length} Guru Pengajar`}
                        size="small"
                        sx={{
                            bgcolor: isDark ? 'rgba(22, 101, 52, 0.2)' : '#f0fdf4',
                            color: isDark ? '#86efac' : '#166534',
                            fontWeight: 600,
                            border: isDark ? '1px solid rgba(22, 101, 52, 0.4)' : '1px solid #bbf7d0',
                        }}
                    />

                    {totalConflicts === 0 ? (
                        <Chip
                            icon={<CheckCircleOutlineIcon sx={{ fontSize: '16px !important' }} />}
                            label="Status Jadwal: Sempurna (0 Bentrok)"
                            size="small"
                            sx={{
                                bgcolor: isDark ? 'rgba(4, 120, 87, 0.2)' : '#ecfdf5',
                                color: isDark ? '#6ee7b7' : '#047857',
                                fontWeight: 700,
                                border: isDark ? '1px solid rgba(4, 120, 87, 0.4)' : '1px solid #a7f3d0',
                            }}
                        />
                    ) : (
                        <Chip
                            icon={<ErrorOutlineIcon sx={{ fontSize: '16px !important' }} />}
                            label={`Peringatan: ${totalConflicts} Slot Bentrok Terdeteksi!`}
                            size="small"
                            sx={{
                                bgcolor: isDark ? 'rgba(185, 28, 28, 0.2)' : '#fef2f2',
                                color: isDark ? '#fca5a5' : '#b91c1c',
                                fontWeight: 700,
                                border: isDark ? '1px solid rgba(185, 28, 28, 0.4)' : '1px solid #fecaca',
                            }}
                        />
                    )}
                </Stack>
            </Box>

            {/* Row 2: Filter Controls (Hari, Ruang Kelas, Tombol Pop-up Kelas & Search) */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { xs: 'stretch', md: 'center' },
                    gap: 1.5,
                    pt: 2,
                    pb: 1.5,
                }}
            >
                {/* Day Filter */}
                <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 160 } }}>
                    <InputLabel id="day-filter-label">Filter Hari</InputLabel>
                    <Select
                        labelId="day-filter-label"
                        value={selectedDayFilter}
                        label="Filter Hari"
                        onChange={(e) => setSelectedDayFilter(e.target.value as any)}
                    >
                        <MenuItem value="Semua">Semua Hari (Senin - Sabtu)</MenuItem>
                        {DAYS.map((d) => (
                            <MenuItem key={d} value={d}>
                                Hari {d}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Filter Ruangan Kelas (Rombel) dari Database */}
                <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 200 } }}>
                    <InputLabel id="class-filter-label">Ruang Kelas (Rombel)</InputLabel>
                    <Select
                        labelId="class-filter-label"
                        value={selectedClassFilter}
                        label="Ruang Kelas (Rombel)"
                        onChange={(e) => {
                            const val = e.target.value;
                            setSelectedClassFilter(val);
                            if (val !== 'Semua') {
                                setSelectedClassForInput(val);
                            }
                        }}
                    >
                        <MenuItem value="Semua">
                            Semua Ruang Kelas ({classes.length} Rombel)
                        </MenuItem>
                        {classes.map((cls) => {
                            const count = getClassConflictCount(cls.name);
                            return (
                                <MenuItem key={cls.id || cls.name} value={cls.name}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 1 }}>
                                        <span>{cls.name} {cls.major ? `(${cls.major})` : ''}</span>
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

                {/* Tombol Pop-up Modal Daftar Kelas & Bentrok */}
                <Button
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>Daftar Kelas (Pop-up)</span>
                        {totalConflicts > 0 && (
                            <Box
                                sx={{
                                    minWidth: 20,
                                    height: 20,
                                    px: 0.5,
                                    borderRadius: '999px',
                                    bgcolor: '#ef4444',
                                    color: '#ffffff',
                                    fontSize: '11px',
                                    fontWeight: 900,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                {totalConflicts}
                            </Box>
                        )}
                    </Box>
                </Button>

                {/* Search box for teacher or subject */}
                <TextField
                    size="small"
                    placeholder="Cari nomor kode guru, nama guru, atau mapel..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: <SearchIcon fontSize="small" sx={{ color: isDark ? '#71717a' : '#94a3b8', mr: 1 }} />,
                        },
                    }}
                    sx={{
                        flex: 1,
                        minWidth: 240,
                        '& .MuiOutlinedInput-root': {
                            bgcolor: isDark ? '#18181b' : '#ffffff',
                            color: isDark ? '#f4f4f5' : '#0f172a',
                        },
                    }}
                />
            </Box>

            {/* Row 3: Interactive Kotak Grid / Pills Per-Kelas dengan Lingkaran Merah Bentrok */}
            {classes.length > 0 && (
                <Box
                    sx={{
                        pt: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        overflowX: 'auto',
                        pb: 0.5,
                        '&::-webkit-scrollbar': { height: 4 },
                        '&::-webkit-scrollbar-thumb': { bgcolor: '#cbd5e1', borderRadius: 4 },
                    }}
                >
                    <Typography variant="caption" sx={{ color: isDark ? '#a1a1aa' : '#64748b', fontWeight: 700, flexShrink: 0, mr: 0.5 }}>
                        Pilih Grid Kelas:
                    </Typography>

                    {/* Tombol Semua Kelas */}
                    <Chip
                        clickable
                        label={`Semua (${classes.length})`}
                        onClick={() => setSelectedClassFilter('Semua')}
                        size="small"
                        color={selectedClassFilter === 'Semua' ? 'primary' : 'default'}
                        variant={selectedClassFilter === 'Semua' ? 'filled' : 'outlined'}
                        sx={{
                            fontWeight: 700,
                            borderRadius: 1.5,
                            flexShrink: 0,
                        }}
                    />

                    {/* List Pills Ruang Kelas dari Database dengan Lingkaran Merah Hitungan Bentrok */}
                    {classes.map((cls) => {
                        const count = getClassConflictCount(cls.name);
                        const isSelected = selectedClassFilter === cls.name;

                        return (
                            <Chip
                                key={cls.id || cls.name}
                                clickable
                                onClick={() => {
                                    if (selectedClassFilter === cls.name) {
                                        setSelectedClassFilter('Semua');
                                    } else {
                                        setSelectedClassFilter(cls.name);
                                        setSelectedClassForInput(cls.name);
                                    }
                                }}
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                        <span>{cls.name}</span>
                                        {/* Lingkaran Merah Count Bentrok */}
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
                                                    fontWeight: 900,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    boxShadow: '0 1px 3px rgba(239, 68, 68, 0.4)',
                                                }}
                                            >
                                                {count}
                                            </Box>
                                        )}
                                    </Box>
                                }
                                size="small"
                                color={isSelected ? 'primary' : 'default'}
                                variant={isSelected ? 'filled' : 'outlined'}
                                sx={{
                                    fontWeight: isSelected ? 800 : 600,
                                    borderRadius: 1.5,
                                    flexShrink: 0,
                                    borderColor: count > 0 && !isSelected ? '#fca5a5' : undefined,
                                    bgcolor: count > 0 && !isSelected ? '#fff5f5' : undefined,
                                }}
                            />
                        );
                    })}
                </Box>
            )}
        </Box>
    );
};

export default ScheduleControlBar;

