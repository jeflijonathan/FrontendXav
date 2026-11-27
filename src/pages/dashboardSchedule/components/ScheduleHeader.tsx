import React, { useState, useMemo } from 'react';
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
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
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useScheduleStore } from '../store/useScheduleStore';
import { useSchedulePermissions } from '../utils/permissions';
import { parseGoogleDriveUrl } from '@utils/googleDrive';

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
        clearScheduleSlots,
        classes,
        selectedClassFilter,
        rows,
        approvalData,
    } = useScheduleStore();
    const { canEditSchedule } = useSchedulePermissions();

    const isScheduleApproved = Boolean(approvalData?.isApproved);
    const parsedDrive = useMemo(
        () => parseGoogleDriveUrl(approvalData?.googleDriveUrl),
        [approvalData?.googleDriveUrl]
    );

    const handleDownloadApprovedSchedule = () => {
        if (!isScheduleApproved) return;
        if (parsedDrive.isValid && parsedDrive.id && parsedDrive.type === 'file') {
            window.open(`https://drive.google.com/uc?export=download&id=${parsedDrive.id}`, '_blank');
            return;
        }
        if (parsedDrive.isValid && parsedDrive.originalUrl) {
            window.open(parsedDrive.originalUrl, '_blank');
            return;
        }
        setPrintDialogOpen(true);
    };

    const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
    const [selectedScope, setSelectedScope] = useState<string>('ALL');
    const [isClearing, setIsClearing] = useState(false);

    // Hitung jumlah slot KBM yang sudah terisi pengajar
    const filledSlotsCount = useMemo(() => {
        let count = 0;
        rows.forEach((r) => {
            if (r.specialActivity) return;
            Object.values(r.classCells || {}).forEach((c) => {
                if (c?.teacherCode) count++;
            });
        });
        return count;
    }, [rows]);

    const handleOpenClearDialog = () => {
        if (selectedClassFilter && selectedClassFilter !== 'Semua') {
            setSelectedScope(selectedClassFilter);
        } else {
            setSelectedScope('ALL');
        }
        setIsClearDialogOpen(true);
    };

    const handleConfirmClear = async () => {
        setIsClearing(true);
        try {
            await clearScheduleSlots(selectedScope === 'ALL' ? undefined : selectedScope);
            setIsClearDialogOpen(false);
        } finally {
            setIsClearing(false);
        }
    };

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

                    {!canEditSchedule && (
                        <Chip
                            icon={<VisibilityOutlinedIcon sx={{ fontSize: '15px !important' }} />}
                            label="Mode Lihat (Read-Only)"
                            size="small"
                            color="info"
                            variant="outlined"
                            sx={{ fontWeight: 700 }}
                        />
                    )}

                    {canEditSchedule && (
                        <>
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

                            <Tooltip title={filledSlotsCount > 0 ? "Kosongkan seluruh atau sebagian slot jadwal KBM" : "Belum ada slot KBM yang terisi"}>
                                <span>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        color="error"
                                        disabled={filledSlotsCount === 0}
                                        startIcon={<DeleteSweepOutlinedIcon />}
                                        onClick={handleOpenClearDialog}
                                        sx={{
                                            borderColor: isDark ? 'rgba(239, 68, 68, 0.4)' : '#fca5a5',
                                            color: isDark ? '#f87171' : '#dc2626',
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            borderRadius: 2,
                                            '&:hover': {
                                                bgcolor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2',
                                                borderColor: '#ef4444',
                                            },
                                            '&.Mui-disabled': {
                                                borderColor: isDark ? '#27272a' : '#e2e8f0',
                                                color: isDark ? '#52525b' : '#94a3b8',
                                            },
                                        }}
                                    >
                                        Kosongkan Slot
                                    </Button>
                                </span>
                            </Tooltip>
                        </>
                    )}

                    {canEditSchedule ? (
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
                    ) : isScheduleApproved ? (
                        <Button
                            variant="contained"
                            size="small"
                            color="success"
                            startIcon={<DownloadIcon />}
                            onClick={handleDownloadApprovedSchedule}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 700,
                                borderRadius: 2,
                            }}
                        >
                            Download Jadwal Sah
                        </Button>
                    ) : (
                        <Tooltip title="Jadwal baru dapat didownload setelah dicetak, ditandatangani, dan disahkan oleh Kepala Sekolah">
                            <span>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    disabled
                                    startIcon={<LockIcon />}
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        borderRadius: 2,
                                    }}
                                >
                                    Download Jadwal (Belum Disahkan)
                                </Button>
                            </span>
                        </Tooltip>
                    )}

                    {canEditSchedule && (
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
                    )}
                </Stack>
            </Box>

            {/* Dialog Konfirmasi Kosongkan Slot Jadwal */}
            <Dialog
                open={isClearDialogOpen}
                onClose={() => !isClearing && setIsClearDialogOpen(false)}
                maxWidth="xs"
                fullWidth
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: 3,
                            bgcolor: isDark ? '#18181b' : '#ffffff',
                            color: isDark ? '#f4f4f5' : '#0f172a',
                        },
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        p: 2.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        borderBottom: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
                    }}
                >
                    <Box
                        sx={{
                            width: 38,
                            height: 38,
                            borderRadius: 2,
                            bgcolor: isDark ? 'rgba(239, 68, 68, 0.2)' : '#fee2e2',
                            color: '#ef4444',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <DeleteSweepOutlinedIcon />
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '17px' }}>
                            Kosongkan Slot Jadwal
                        </Typography>
                        <Typography variant="caption" sx={{ color: isDark ? '#a1a1aa' : '#64748b' }}>
                            Hapus input nomor kode guru pada slot KBM
                        </Typography>
                    </Box>
                </DialogTitle>

                <DialogContent sx={{ p: 2.5 }}>
                    <Stack spacing={2} sx={{ pt: 1 }}>
                        <Alert severity="warning" sx={{ fontSize: '12.5px' }}>
                            Tindakan ini akan <strong>mengosongkan nomor kode guru pengajar</strong> pada slot jam pelajaran yang dipilih dan langsung menyinkronkan ke database.
                        </Alert>

                        <Box
                            sx={{
                                p: 1.5,
                                bgcolor: isDark ? '#27272a' : '#f8fafc',
                                borderRadius: 2,
                                border: isDark ? '1px solid #3f3f46' : '1px solid #e2e8f0',
                            }}
                        >
                            <Typography variant="caption" sx={{ color: isDark ? '#a1a1aa' : '#64748b', fontWeight: 600, display: 'block' }}>
                                Slot KBM Terisi Saat Ini:
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 800, color: '#ef4444' }}>
                                {filledSlotsCount} slot KBM terisi pengajar
                            </Typography>
                        </Box>

                        {classes.length > 0 && (
                            <FormControl fullWidth size="small">
                                <Typography variant="caption" sx={{ fontWeight: 700, color: isDark ? '#cbd5e1' : '#334155', mb: 0.75 }}>
                                    Pilih Lingkup Kelas yang Ingin Dikosongkan:
                                </Typography>
                                <Select
                                    value={selectedScope}
                                    onChange={(e) => setSelectedScope(e.target.value)}
                                    size="small"
                                >
                                    <MenuItem value="ALL">
                                        Seluruh Ruang Kelas ({classes.length} Rombel)
                                    </MenuItem>
                                    {classes.map((c) => (
                                        <MenuItem key={c.id || c.name} value={c.name}>
                                            Hanya Kelas {c.name} {c.major ? `(${c.major})` : ''}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ p: 2, borderTop: isDark ? '1px solid #27272a' : '1px solid #e2e8f0' }}>
                    <Button
                        onClick={() => setIsClearDialogOpen(false)}
                        disabled={isClearing}
                        sx={{ textTransform: 'none', color: isDark ? '#a1a1aa' : '#64748b', fontWeight: 600 }}
                    >
                        Batal
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        disabled={isClearing || filledSlotsCount === 0}
                        onClick={handleConfirmClear}
                        startIcon={isClearing ? <CircularProgress size={16} color="inherit" /> : <DeleteSweepOutlinedIcon />}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 700,
                            borderRadius: 2,
                            px: 2.5,
                        }}
                    >
                        {isClearing ? 'Mengosongkan...' : 'Kosongkan Sekarang'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ScheduleHeader;
