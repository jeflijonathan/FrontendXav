import React from 'react';
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import SaveIcon from '@mui/icons-material/Save';
import TableChartIcon from '@mui/icons-material/TableChart';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { useScheduleStore } from '../store/useScheduleStore';

const ScheduleHeader: React.FC = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const {
        schoolInformations,
        selectedSchoolInfoId,
        setSchoolInformationId,
        isLoadingDatabase,
        isSaving,
        saveSchedule,
        generateTableFromRosterJam,
        setRecommendationModalOpen,
        setPrintDialogOpen,
        setIsGenerateScheduleDialogOpen,
    } = useScheduleStore();

    return (
        <Box
            sx={{
                p: { xs: 2.5, md: 3 },
                mb: 3,
                bgcolor: isDark ? '#141416' : '#ffffff',
                borderRadius: 3,
                border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
                boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.5)' : '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
            }}
        >
            {/* Top row: Title, Period Selector and Primary Actions */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', lg: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', lg: 'center' },
                    gap: 2,
                }}
            >
                <Box>
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 0.5 }}>
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 2,
                                bgcolor: isDark ? 'rgba(79, 70, 229, 0.2)' : '#e0e7ff',
                                color: isDark ? '#818cf8' : '#4338ca',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <CalendarMonthIcon />
                        </Box>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 800, color: isDark ? '#f4f4f5' : '#0f172a' }}>
                                Jadwal Pelajaran (Matrix KBM)
                            </Typography>
                            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                                <Typography variant="body2" sx={{ color: isDark ? '#a1a1aa' : '#64748b' }}>
                                    SMK Xaverius Palembang
                                </Typography>
                                {isLoadingDatabase && (
                                    <Chip
                                        icon={<CircularProgress size={12} color="inherit" />}
                                        label="Memuat Database..."
                                        size="small"
                                        sx={{
                                            height: 20,
                                            fontSize: '10px',
                                            bgcolor: isDark ? 'rgba(2, 132, 199, 0.2)' : '#e0f2fe',
                                            color: isDark ? '#38bdf8' : '#0284c7',
                                        }}
                                    />
                                )}
                            </Stack>
                        </Box>
                    </Stack>
                </Box>

                {/* Primary Action Buttons */}
                <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap', alignItems: 'center' }}>
                    {/* Period Selector from Database */}
                    {schoolInformations.length > 0 && (
                        <FormControl size="small" sx={{ minWidth: 170 }}>
                            <InputLabel id="school-info-select-label">Tahun Pelajaran</InputLabel>
                            <Select
                                labelId="school-info-select-label"
                                value={selectedSchoolInfoId || ''}
                                label="Tahun Pelajaran"
                                onChange={(e) => setSchoolInformationId(e.target.value)}
                                startAdornment={<AccountBalanceIcon fontSize="small" sx={{ color: isDark ? '#a1a1aa' : '#64748b', mr: 0.5 }} />}
                            >
                                {schoolInformations.map((info) => (
                                    <MenuItem key={info.id_school_information} value={info.id_school_information}>
                                        TP {info.periode || info.name_school}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}

                    <Tooltip title="Petunjuk & rekomendasi penempatan JP terbaik (Kejuruan di JP 6-8 vs Teori di JP 1-3)">
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<LightbulbOutlinedIcon />}
                            onClick={() => setRecommendationModalOpen(true)}
                            sx={{
                                borderColor: isDark ? '#3f3f46' : '#e2e8f0',
                                color: isDark ? '#cbd5e1' : '#475569',
                                textTransform: 'none',
                                fontWeight: 600,
                                borderRadius: 2,
                                '&:hover': { bgcolor: isDark ? '#27272a' : '#f8fafc', borderColor: isDark ? '#52525b' : '#cbd5e1' },
                            }}
                        >
                            Rekomendasi JP
                        </Button>
                    </Tooltip>

                    <Tooltip title="Sinkronkan struktur tabel dari settingan Roster Jam Belajar">
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<TableChartIcon />}
                            onClick={generateTableFromRosterJam}
                            sx={{
                                borderColor: isDark ? '#3f3f46' : '#e2e8f0',
                                color: isDark ? '#e4e4e7' : '#334155',
                                textTransform: 'none',
                                fontWeight: 600,
                                borderRadius: 2,
                                '&:hover': { bgcolor: isDark ? '#27272a' : '#f1f5f9' },
                            }}
                        >
                            Generate Tabel
                        </Button>
                    </Tooltip>

                    <Tooltip title="Isi jadwal otomatis tanpa bentrok dengan preferensi guru & ragam macam ekstra">
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<AutoAwesomeIcon />}
                            onClick={() => setIsGenerateScheduleDialogOpen(true)}
                            sx={{
                                bgcolor: '#0284c7',
                                color: '#ffffff',
                                textTransform: 'none',
                                fontWeight: 700,
                                borderRadius: 2,
                                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
                                '&:hover': { bgcolor: '#0369a1' },
                            }}
                        >
                            Generate Jadwal Acak
                        </Button>
                    </Tooltip>

                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<PrintOutlinedIcon />}
                        onClick={() => setPrintDialogOpen(true)}
                        sx={{
                            borderColor: isDark ? '#3f3f46' : '#e2e8f0',
                            color: isDark ? '#f4f4f5' : '#0f172a',
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: 2,
                            '&:hover': { bgcolor: isDark ? '#27272a' : '#f8fafc' },
                        }}
                    >
                        Cetak / Ekspor
                    </Button>

                    <Button
                        variant="contained"
                        size="small"
                        startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                        onClick={saveSchedule}
                        disabled={isSaving}
                        sx={{
                            bgcolor: '#4f46e5',
                            color: '#ffffff',
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: 2,
                            boxShadow: 'none',
                            '&:hover': { bgcolor: '#4338ca' },
                        }}
                    >
                        {isSaving ? 'Menyimpan...' : 'Simpan Jadwal'}
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
};

export default ScheduleHeader;
