import React, { useMemo, useState } from 'react';
import {
    Box,
    Card,
    Typography,
    Stack,
    TextField,
    MenuItem,
    Chip,
    CircularProgress,
    Button,
    InputAdornment,
} from '@mui/material';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import RefreshIcon from '@mui/icons-material/Refresh';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TuneIcon from '@mui/icons-material/Tune';
import SaveIcon from '@mui/icons-material/Save';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useTheme } from '@mui/material/styles';
import useDashboardAttendanceStore from './store';
import useAttendanceList from './List/hook/useAttendanceList';
import useCreateAttendance from './Create/hook/useCreateAttendance';
import useUpdateAttendance from './Update/hook/useUpdateAttendance';
import { computeAttendanceRecap } from './List/utils/attendanceFormatter';
import AttendanceApprovalAlert from './components/AttendanceApprovalAlert';
import AttendanceSessionFilter from './components/AttendanceSessionFilter';
import AttendanceCreateToolbar from './Create/AttendanceCreateToolbar';
import AttendanceStudentTable from './List/AttendanceStudentTable';
import ScanAttendanceDialog from './Scan/ScanAttendanceDialog';
import AttendanceSettingsDialog from './Settings/AttendanceSettingsDialog';
import ShowAttendanceBarcodeDialog from './ShowBarcode/ShowAttendanceBarcodeDialog';
import StudentAttendanceScanView from './StudentScan/StudentAttendanceScanView';
import StudentAttendanceMatrixView from './StudentMatrix/StudentAttendanceMatrixView';
import { BaseDialog, DialogHeader, DialogBody } from '@components/Dialog';
import { WordDescriptionEditor } from '@common/components/WordEditor/WordDescriptionEditor';
import attendanceService from '@api/attendance/service';
import { snackbar } from '@utils/snackbar';
import useAuthStore from '../../common/store/useAuthStore';

export const DashboardAttendance: React.FC = () => {
    const { user, activeRole } = useAuthStore();

    const isStudent =
        activeRole === 'student' ||
        activeRole === 'siswa' ||
        user?.user_type === 'student' ||
        user?.roles?.some((r: any) => {
            const roleName = (typeof r === 'string' ? r : r.name || '').toLowerCase();
            return roleName === 'student' || roleName === 'siswa';
        });

    const [isStudentScanOpen, setIsStudentScanOpen] = useState(false);
    const [studentMatrixRefreshKey, setStudentMatrixRefreshKey] = useState(0);

    if (isStudent) {
        return (
            <>
                <StudentAttendanceMatrixView
                    onOpenScan={() => setIsStudentScanOpen(true)}
                    refreshTrigger={studentMatrixRefreshKey}
                />

                <BaseDialog
                    isOpen={isStudentScanOpen}
                    onClose={() => setIsStudentScanOpen(false)}
                    maxWidth="md"
                    fullScreenOnMobile
                >
                    <DialogHeader
                        title="Scan Presensi Mandiri"
                        description="Tahap 1: Scan Barcode Guru → Tahap 2: Verifikasi Wajah (Anti-Spoofing) → Tahap 3: Hasil"
                        onClose={() => setIsStudentScanOpen(false)}
                    />
                    <DialogBody sx={{ p: { xs: 1.5, sm: 3 } }}>
                        <StudentAttendanceScanView
                            onScanSuccess={() => setStudentMatrixRefreshKey((k) => k + 1)}
                            onClose={() => setIsStudentScanOpen(false)}
                        />
                    </DialogBody>
                </BaseDialog>
            </>
        );
    }

    return <TeacherAttendanceView />;
};

const TeacherAttendanceView: React.FC = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const {
        state,
        setState,
        resetSelectionOnPeriodChange,
        resetSelectionOnClassChange,
    } = useDashboardAttendanceStore();

    const {
        schoolInfos,
        selectedSchoolInfoId,
        isLoadingSchoolInfo,
        isApproved,
        approvalData,
        hasCalendar,
        isAdminView,
        teacherDisplayName,
        isLoadingMeetings,
        classes,
        selectedClassId,
        selectedSubject,
        meetings,
        selectedMeeting,
        students,
        isLoadingSheet,
        isSaving,
        sessionOpenStatus,
        isUpdatingSessionStatus,
        teachingAgenda,
        isSavingAgenda,
    } = state;

    const { fetchMeetings, loadAttendanceSheet } = useAttendanceList();

    const refreshAfterSave = async () => {
        await fetchMeetings();
        await loadAttendanceSheet();
    };

    const { handleMarkAllHadir, handleMarkAllAlpa, handleSaveBatch } = useCreateAttendance(refreshAfterSave);
    const { handleStatusChange, handleNotesChange } = useUpdateAttendance();

    const activeSchoolInfo = useMemo(() => {
        return schoolInfos.find((s) => s.id_school_information === selectedSchoolInfoId);
    }, [schoolInfos, selectedSchoolInfoId]);

    const handleSubjectChange = (newSubject: string) => {
        if (!newSubject) {
            setState({ selectedSubject: '', selectedMeeting: null, students: [] });
            return;
        }
        const subList = meetings.filter((m) => m.subject_name === newSubject);
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const nearest = subList.find((m) => m.date >= todayStr) || subList[0] || null;
        setState({ selectedSubject: newSubject, selectedMeeting: nearest });
    };

    const liveRecap = useMemo(() => computeAttendanceRecap(students), [students]);

    const handleToggleSessionStatus = async (action: 'OPEN' | 'CLOSE') => {
        if (!selectedSchoolInfoId || !selectedClassId || !selectedMeeting) return;
        setState({ isUpdatingSessionStatus: true });
        try {
            const res = await attendanceService.updateSessionStatus({
                id_school_information: selectedSchoolInfoId,
                id_class: selectedClassId,
                date: selectedMeeting.date,
                jp: String(selectedMeeting.jp),
                subject_name: selectedSubject || selectedMeeting.subject_name || '',
                action,
            });
            setState({
                sessionOpenStatus: res.status,
                sessionToken: res.session_token || null,
            });
            if (action === 'OPEN') {
                snackbar.success('Presensi dibuka dengan barcode baru.');
            } else {
                snackbar.info('Presensi ditutup. Barcode sebelumnya tidak dapat digunakan lagi.');
            }
        } catch (err: any) {
            snackbar.error(err?.message || 'Gagal memperbarui status pembukaan presensi.');
        } finally {
            setState({ isUpdatingSessionStatus: false });
        }
    };

    const handleSaveAgenda = async () => {
        if (!selectedSchoolInfoId || !selectedClassId || !selectedMeeting) return;
        setState({ isSavingAgenda: true });
        try {
            await attendanceService.updateSessionAgenda({
                id_school_information: selectedSchoolInfoId,
                id_class: selectedClassId,
                date: selectedMeeting.date,
                jp: String(selectedMeeting.jp),
                subject_name: selectedSubject || selectedMeeting.subject_name || '',
                teaching_agenda: teachingAgenda,
            });
            snackbar.success('Keterangan agenda mengajar berhasil disimpan.');
        } catch (err: any) {
            snackbar.error(err?.message || 'Gagal menyimpan keterangan agenda mengajar.');
        } finally {
            setState({ isSavingAgenda: false });
        }
    };

    const canShowAttendanceTable =
        isApproved && selectedSubject !== '' && selectedMeeting !== null && classes.length > 0;

    return (
        <Box sx={{ p: { xs: 1.5, sm: 2.5, md: 3 }, maxWidth: '100%', overflowX: 'hidden' }}>
            {/* Header Title & Step 1: Pilih Tahun Pelajaran (TA) */}
            <Box
                sx={{
                    mb: 2.5,
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { md: 'center' },
                    justifyContent: 'space-between',
                    gap: 2,
                }}
            >
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                    <Box
                        sx={{
                            width: 44,
                            height: 44,
                            borderRadius: 2.5,
                            bgcolor: '#2563eb',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                        }}
                    >
                        <FactCheckIcon />
                    </Box>
                    <Box>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 900,
                                fontSize: { xs: '1.15rem', sm: '1.4rem' },
                                color: isDark ? '#f4f4f5' : '#0f172a',
                            }}
                        >
                            Presensi Kehadiran Siswa
                        </Typography>
                        <Typography variant="caption" sx={{ color: isDark ? '#a1a1aa' : '#64748b', display: 'block' }}>
                            Berbasis jadwal pelajaran resmi, mata pelajaran yang diampu guru, kalender akademik, & scan barcode.
                        </Typography>
                    </Box>
                </Stack>

                {/* Step 1: Tahun Pelajaran Selector, Settings & Refresh */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} sx={{ alignItems: { sm: 'center' } }}>
                    <TextField
                        select
                        size="small"
                        disabled={isLoadingSchoolInfo}
                        label="Tahun Pelajaran"
                        value={selectedSchoolInfoId}
                        onChange={(e) => resetSelectionOnPeriodChange(e.target.value)}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountBalanceIcon sx={{ fontSize: 18, color: isDark ? '#94a3b8' : '#64748b' }} />
                                    </InputAdornment>
                                ),
                            },
                        }}
                        sx={{
                            minWidth: { xs: '100%', sm: 230 },
                            '& .MuiInputBase-root': {
                                bgcolor: isDark ? '#18181b' : '#ffffff',
                                borderRadius: 2,
                            },
                        }}
                    >
                        {schoolInfos.map((info) => (
                            <MenuItem key={info.id_school_information} value={info.id_school_information}>
                                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                    <span>{info.periode || info.name_school}</span>
                                    {info.status && (
                                        <Chip label="Aktif" size="small" color="primary" sx={{ height: 18, fontSize: '10px' }} />
                                    )}
                                </Stack>
                            </MenuItem>
                        ))}
                    </TextField>

                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<TuneIcon />}
                        onClick={() => setState({ isSettingsDialogOpen: true })}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 700,
                            borderRadius: 2,
                            height: 40,
                            px: 2,
                            whiteSpace: 'nowrap',
                        }}
                    >
                        Pengaturan
                    </Button>

                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={isLoadingMeetings ? <CircularProgress size={16} /> : <RefreshIcon />}
                        onClick={() => {
                            fetchMeetings();
                            loadAttendanceSheet();
                        }}
                        disabled={isLoadingMeetings}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 700,
                            borderRadius: 2,
                            height: 40,
                            px: 2,
                            whiteSpace: 'nowrap',
                        }}
                    >
                        Refresh
                    </Button>
                </Stack>
            </Box>

            {/* Approval Status Banner (Strict Gate) */}
            <AttendanceApprovalAlert
                isApproved={isApproved}
                approvalData={approvalData}
                periodeName={activeSchoolInfo?.periode || activeSchoolInfo?.name_school}
            />

            {/* Only Render Filters, Summary, and Student Table if Schedule is Approved */}
            {isApproved && (
                <>
                    <AttendanceSessionFilter
                        isAdminView={isAdminView}
                        teacherName={teacherDisplayName}
                        hasCalendar={hasCalendar}
                        classes={classes}
                        selectedClassId={selectedClassId}
                        onSelectClassId={resetSelectionOnClassChange}
                        selectedSubject={selectedSubject}
                        onSelectSubject={handleSubjectChange}
                        meetings={meetings}
                        selectedMeeting={selectedMeeting}
                        onSelectMeeting={(m) => setState({ selectedMeeting: m })}
                        disabled={!isApproved || isLoadingMeetings}
                        sessionOpenStatus={sessionOpenStatus}
                    />

                    {canShowAttendanceTable && (
                        <>
                            <AttendanceCreateToolbar
                                recap={liveRecap}
                                sessionOpenStatus={sessionOpenStatus}
                                isUpdatingSessionStatus={isUpdatingSessionStatus}
                                onToggleSessionStatus={handleToggleSessionStatus}
                                onMarkAllHadir={handleMarkAllHadir}
                                onMarkAllAlpa={handleMarkAllAlpa}
                                onSave={handleSaveBatch}
                                onOpenBarcode={() => setState({ isBarcodeDialogOpen: true })}
                                onOpenScan={() => setState({ isScanDialogOpen: true })}
                                onOpenSettings={() => setState({ isSettingsDialogOpen: true })}
                                isSaving={isSaving}
                                disabled={!canShowAttendanceTable || isLoadingSheet}
                            />

                            <AttendanceStudentTable
                                students={students}
                                onStatusChange={handleStatusChange}
                                onNotesChange={handleNotesChange}
                                isLoading={isLoadingSheet}
                                disabled={!canShowAttendanceTable || isSaving}
                            />

                            {/* Keterangan Agenda Mengajar (Word Text Box) */}
                            <Card
                                variant="outlined"
                                sx={{
                                    mt: 2.5,
                                    p: { xs: 2, sm: 2.5 },
                                    borderRadius: 3,
                                    bgcolor: isDark ? '#18181b' : '#ffffff',
                                    borderColor: isDark ? '#27272a' : '#e2e8f0',
                                }}
                            >
                                <Stack
                                    direction={{ xs: 'column', sm: 'row' }}
                                    spacing={1.5}
                                    sx={{
                                        alignItems: { sm: 'center' },
                                        justifyContent: 'space-between',
                                        mb: 1.5,
                                    }}
                                >
                                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                                        <MenuBookIcon sx={{ fontSize: 20, color: '#2563eb' }} />
                                        <Box>
                                            <Typography
                                                variant="subtitle2"
                                                sx={{ fontWeight: 800, color: isDark ? '#f4f4f5' : '#0f172a' }}
                                            >
                                                Keterangan Agenda Mengajar
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: isDark ? '#a1a1aa' : '#64748b' }}>
                                                Catat pokok bahasan, materi yang disampaikan, atau catatan KBM pertemuan ini.
                                            </Typography>
                                        </Box>
                                    </Stack>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        startIcon={
                                            isSavingAgenda ? (
                                                <CircularProgress size={16} color="inherit" />
                                            ) : (
                                                <SaveIcon />
                                            )
                                        }
                                        disabled={isSavingAgenda || isLoadingSheet}
                                        onClick={handleSaveAgenda}
                                        sx={{
                                            textTransform: 'none',
                                            fontWeight: 700,
                                            borderRadius: 2,
                                            bgcolor: '#2563eb',
                                            '&:hover': { bgcolor: '#1d4ed8' },
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {isSavingAgenda ? 'Menyimpan...' : 'Simpan Agenda'}
                                    </Button>
                                </Stack>
                                <WordDescriptionEditor
                                    label="Agenda Mengajar / Materi Pertemuan"
                                    value={teachingAgenda}
                                    onChange={(val) => setState({ teachingAgenda: val })}
                                    rows={5}
                                    placeholder="Tuliskan materi pokok, kegiatan pembelajaran, tugas siswa, atau catatan agenda mengajar pada pertemuan ini..."
                                />
                            </Card>
                        </>
                    )}
                </>
            )}

            {/* Dialogs */}
            <ShowAttendanceBarcodeDialog />
            <ScanAttendanceDialog onScanSuccessRefresh={refreshAfterSave} />
            <AttendanceSettingsDialog />
        </Box>
    );
};

export default DashboardAttendance;
