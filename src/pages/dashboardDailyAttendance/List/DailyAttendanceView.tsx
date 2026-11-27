import React, { useMemo, useState } from "react";
import {
    Box,
    Card,
    Stack,
    TextField,
    MenuItem,
    Typography,
    Chip,
    Tabs,
    Tab,
    Button,
    CircularProgress,
    InputAdornment,
    Alert,
} from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SchoolIcon from "@mui/icons-material/School";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import RefreshIcon from "@mui/icons-material/Refresh";
import ViewAgendaIcon from "@mui/icons-material/ViewAgenda";
import TableChartIcon from "@mui/icons-material/TableChart";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import SaveIcon from "@mui/icons-material/Save";
import { useTheme } from "@mui/material/styles";
import useDashboardDailyAttendanceStore, {
    type DailyAttendanceTab,
} from "../store";
import useDailyAttendanceList from "./hook/useDailyAttendanceList";
import useSaveDailyAttendance from "../Update/hook/useSaveDailyAttendance";
import {
    computeDailySheetRecap,
    extractMonthOptionsFromMeetings,
    filterMeetingsBySemesterAndMonth,
    formatIndonesianShortDate,
} from "./utils/dailyAttendanceMapper";
import DailyStudentTable from "./DailyStudentTable";
import DailyMeetingSelectorDialog from "../components/DailyMeetingSelector";
import DailySummaryCards from "./DailySummaryCards";
import DailyLedgerTable from "./DailyLedgerTable";
import DailyAttendanceEditDialog from "../Update/DailyAttendanceEditDialog";

export const DailyAttendanceView: React.FC = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [isMeetingPickerOpen, setIsMeetingPickerOpen] = useState(false);

    const { state, setState, resetOnPeriodChange, resetOnClassChange } =
        useDashboardDailyAttendanceStore();
    const { fetchDailyMeetings, fetchMonthlyLedger, fetchDailySheet } =
        useDailyAttendanceList();

    const refreshAll = async () => {
        await fetchDailyMeetings();
        await fetchMonthlyLedger();
        await fetchDailySheet();
    };

    const {
        openEditDialog,
        closeEditDialog,
        handleStudentStatusChange,
        handleStudentNotesChange,
        handleMarkAllHadir,
        handleSaveDaily,
    } = useSaveDailyAttendance(refreshAll);

    const monthOptions = useMemo(
        () => extractMonthOptionsFromMeetings(state.meetings),
        [state.meetings]
    );

    const filteredMeetings = useMemo(
        () =>
            filterMeetingsBySemesterAndMonth(
                state.meetings,
                state.semesterFilter,
                state.selectedMonthKey
            ),
        [state.meetings, state.semesterFilter, state.selectedMonthKey]
    );

    const canEdit = state.isPiketOrStaff || state.isPengurusKelas;

    const inputMeetingOptions = useMemo(
        () => (filteredMeetings.length > 0 ? filteredMeetings : state.meetings),
        [filteredMeetings, state.meetings]
    );

    const activeInputMeeting = useMemo(
        () =>
            state.meetings.find((m) => m.date === state.selectedMeetingDate) ||
            inputMeetingOptions[0] ||
            null,
        [state.meetings, state.selectedMeetingDate, inputMeetingOptions]
    );

    const sheetRecap = useMemo(
        () => computeDailySheetRecap(state.sheetStudents),
        [state.sheetStudents]
    );

    return (
        <Box sx={{ p: { xs: 1.5, sm: 2.5 }, maxWidth: "100%", overflowX: "hidden" }}>
            {/* Filter Controls Card */}
            <Card
                variant="outlined"
                sx={{
                    p: { xs: 2, sm: 2.5 },
                    mb: 2.5,
                    borderRadius: 3,
                    bgcolor: isDark ? "#18181b" : "#ffffff",
                    borderColor: isDark ? "#27272a" : "#e2e8f0",
                }}
            >
                <Stack spacing={2}>
                    <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={1.5}
                        sx={{ alignItems: { md: "center" }, justifyContent: "space-between" }}
                    >
                        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                            {state.isPengurusKelas && (
                                <Chip
                                    label="Mode Pengurus Kelas (Input 1x/Hari)"
                                    size="small"
                                    color="primary"
                                    sx={{ fontWeight: 800 }}
                                />
                            )}
                            {state.isPiketOrStaff && (
                                <Chip
                                    label="Mode Guru Piket / Staff (Dapat Mengedit Semua Kelas)"
                                    size="small"
                                    color="success"
                                    sx={{ fontWeight: 800 }}
                                />
                            )}
                            <Chip
                                icon={<CalendarMonthIcon sx={{ fontSize: "14px !important" }} />}
                                label={
                                    state.hasCalendar
                                        ? `Kalender Akademik Aktif (${state.meetings.length} Hari Efektif)`
                                        : `Hari Efektif Default (${state.meetings.length} Hari)`
                                }
                                size="small"
                                variant="outlined"
                                sx={{ fontWeight: 700 }}
                            />
                        </Stack>

                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={
                                state.isLoadingMeetings ? (
                                    <CircularProgress size={16} />
                                ) : (
                                    <RefreshIcon />
                                )
                            }
                            onClick={refreshAll}
                            disabled={state.isLoadingMeetings}
                            sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2 }}
                        >
                            Refresh
                        </Button>
                    </Stack>

                    {/* Dropdown Filter */}
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                        <TextField
                            select
                            size="small"
                            label="Tahun Pelajaran"
                            disabled={state.isLoadingSchoolInfo}
                            value={state.selectedSchoolInfoId}
                            onChange={(e) => resetOnPeriodChange(e.target.value)}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccountBalanceIcon sx={{ fontSize: 18 }} />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            sx={{ minWidth: { xs: "100%", sm: 220 } }}
                        >
                            {state.schoolInfos.map((s) => (
                                <MenuItem key={s.id_school_information} value={s.id_school_information}>
                                    {s.periode || s.name_school}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            size="small"
                            label="Kelas"
                            disabled={state.isLoadingMeetings || state.classes.length === 0}
                            value={state.selectedClassId}
                            onChange={(e) => resetOnClassChange(e.target.value)}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SchoolIcon sx={{ fontSize: 18 }} />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            sx={{ minWidth: { xs: "100%", sm: 200 } }}
                        >
                            {state.classes.map((c) => (
                                <MenuItem key={c.id_class} value={c.id_class}>
                                    {c.name}
                                </MenuItem>
                            ))}
                        </TextField>

                        {state.activeTab !== "input" && (
                            <>
                                <TextField
                                    select
                                    size="small"
                                    label="Semester"
                                    value={state.semesterFilter}
                                    onChange={(e) =>
                                        setState({ semesterFilter: e.target.value as "ALL" | "GANJIL" | "GENAP" })
                                    }
                                    sx={{ minWidth: { xs: "100%", sm: 160 } }}
                                >
                                    <MenuItem value="ALL">Semua Semester</MenuItem>
                                    <MenuItem value="GANJIL">Semester Ganjil</MenuItem>
                                    <MenuItem value="GENAP">Semester Genap</MenuItem>
                                </TextField>

                                <TextField
                                    select
                                    size="small"
                                    label="Bulan"
                                    value={state.selectedMonthKey}
                                    onChange={(e) => setState({ selectedMonthKey: e.target.value })}
                                    sx={{ minWidth: { xs: "100%", sm: 190 } }}
                                >
                                    {monthOptions.map((m) => (
                                        <MenuItem key={m.key} value={m.key}>
                                            {m.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </>
                        )}
                    </Stack>
                </Stack>
            </Card>

            {state.classes.length === 0 && !state.isLoadingMeetings && (
                <Alert severity="warning" sx={{ mb: 2.5, borderRadius: 2 }}>
                    Tidak ada kelas yang dapat diakses untuk akun ini.
                </Alert>
            )}

            {/* Tabs Switcher: Gambar 1 (Kartu S/I/A) & Gambar 2 (Buku Induk Bulanan) */}
            {state.selectedClassId && (
                <>
                    <Box sx={{ mb: 2 }}>
                        <Tabs
                            value={state.activeTab}
                            onChange={(_, val) =>
                                setState({ activeTab: val as DailyAttendanceTab })
                            }
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{
                                bgcolor: isDark ? "#18181b" : "#f1f5f9",
                                borderRadius: 2,
                                p: 0.5,
                                display: "inline-flex",
                                maxWidth: "100%",
                                minHeight: 40,
                                "& .MuiTabs-indicator": { display: "none" },
                                "& .MuiTab-root": {
                                    minHeight: 34,
                                    borderRadius: 1.5,
                                    textTransform: "none",
                                    fontWeight: 800,
                                    px: 2,
                                },
                                "& .Mui-selected": {
                                    bgcolor: isDark ? "#2563eb" : "#ffffff",
                                    color: isDark ? "#ffffff !important" : "#1d4ed8 !important",
                                    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                                },
                            }}
                        >
                            <Tab
                                value="input"
                                icon={<HowToRegIcon sx={{ fontSize: 17 }} />}
                                iconPosition="start"
                                label="Input Kehadiran Harian"
                            />
                            <Tab
                                value="cards"
                                icon={<ViewAgendaIcon sx={{ fontSize: 17 }} />}
                                iconPosition="start"
                                label="Daftar Absensi Harian (S / I / Alpa)"
                            />
                            <Tab
                                value="ledger"
                                icon={<TableChartIcon sx={{ fontSize: 17 }} />}
                                iconPosition="start"
                                label="Buku Induk Kehadiran (Tgl 1–31)"
                            />
                        </Tabs>
                    </Box>

                    {state.activeTab === "input" ? (
                        <Stack spacing={2}>
                            <Card
                                variant="outlined"
                                sx={{
                                    p: { xs: 1.75, sm: 2 },
                                    borderRadius: 2.5,
                                    bgcolor: isDark ? "#18181b" : "#ffffff",
                                    borderColor: isDark ? "#27272a" : "#e2e8f0",
                                }}
                            >
                                <Stack spacing={1.5}>
                                    <Stack
                                        direction={{ xs: "column", md: "row" }}
                                        spacing={1.5}
                                        sx={{
                                            alignItems: { md: "center" },
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ alignItems: { sm: "center" } }}>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<CalendarMonthIcon />}
                                                onClick={() => setIsMeetingPickerOpen(true)}
                                                disabled={state.isLoadingMeetings || state.meetings.length === 0}
                                                sx={{
                                                    textTransform: "none",
                                                    fontWeight: 800,
                                                    borderRadius: 2,
                                                    px: 1.75,
                                                    py: 0.75,
                                                }}
                                            >
                                                Pilih Pertemuan
                                            </Button>

                                            <Box>
                                                <Stack direction="row" spacing={0.75} sx={{ alignItems: "center", flexWrap: "wrap" }}>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>
                                                        {activeInputMeeting
                                                            ? `Pertemuan ${activeInputMeeting.pertemuan_ke} — ${activeInputMeeting.day}, ${formatIndonesianShortDate(
                                                                  activeInputMeeting.date
                                                              )}`
                                                            : "Pilih Pertemuan"}
                                                    </Typography>
                                                    {activeInputMeeting && (
                                                        <Chip
                                                            label={
                                                                !activeInputMeeting.is_recorded
                                                                    ? "Belum Diisi"
                                                                    : activeInputMeeting.is_nihil
                                                                    ? "Nihil"
                                                                    : `${activeInputMeeting.absent_students.length} Tidak Hadir`
                                                            }
                                                            size="small"
                                                            color={
                                                                !activeInputMeeting.is_recorded
                                                                    ? "default"
                                                                    : activeInputMeeting.is_nihil
                                                                    ? "success"
                                                                    : "warning"
                                                            }
                                                            variant={activeInputMeeting.is_recorded ? "filled" : "outlined"}
                                                            sx={{ fontWeight: 800, fontSize: "10.5px", height: 20 }}
                                                        />
                                                    )}
                                                </Stack>
                                                {(state.sheetRecordedBy || state.sheetUpdatedBy) && (
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            color: isDark ? "#a1a1aa" : "#64748b",
                                                            fontWeight: 700,
                                                        }}
                                                    >
                                                        {state.sheetRecordedBy ? `Diinput oleh: ${state.sheetRecordedBy}` : ""}
                                                        {state.sheetRecordedBy && state.sheetUpdatedBy ? " · " : ""}
                                                        {state.sheetUpdatedBy ? `Terakhir diperbarui: ${state.sheetUpdatedBy}` : ""}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Stack>

                                        {canEdit && (
                                            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    color="success"
                                                    startIcon={<DoneAllIcon />}
                                                    onClick={handleMarkAllHadir}
                                                    disabled={
                                                        state.isLoadingSheet ||
                                                        state.sheetStudents.length === 0
                                                    }
                                                    sx={{
                                                        textTransform: "none",
                                                        fontWeight: 700,
                                                        borderRadius: 2,
                                                    }}
                                                >
                                                    Semua Hadir (Nihil)
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    startIcon={
                                                        state.isSaving ? (
                                                            <CircularProgress size={16} color="inherit" />
                                                        ) : (
                                                            <SaveIcon />
                                                        )
                                                    }
                                                    onClick={() => handleSaveDaily(activeInputMeeting)}
                                                    disabled={
                                                        state.isLoadingSheet ||
                                                        state.isSaving ||
                                                        !activeInputMeeting ||
                                                        state.sheetStudents.length === 0
                                                    }
                                                    sx={{
                                                        textTransform: "none",
                                                        fontWeight: 800,
                                                        borderRadius: 2,
                                                    }}
                                                >
                                                    {state.isSaving
                                                        ? "Menyimpan..."
                                                        : "Simpan Buku Induk"}
                                                </Button>
                                            </Stack>
                                        )}
                                    </Stack>

                                    <Stack direction="row" spacing={0.75} sx={{ flexWrap: "wrap", gap: 0.75 }}>
                                        <Chip label={`Total: ${sheetRecap.TOTAL}`} size="small" sx={{ fontWeight: 800 }} />
                                        <Chip label={`Hadir: ${sheetRecap.HADIR}`} size="small" color="success" sx={{ fontWeight: 800 }} />
                                        <Chip label={`Izin: ${sheetRecap.IZIN}`} size="small" color="info" sx={{ fontWeight: 800 }} />
                                        <Chip label={`Sakit: ${sheetRecap.SAKIT}`} size="small" color="warning" sx={{ fontWeight: 800 }} />
                                        <Chip label={`Alpa: ${sheetRecap.ALPA}`} size="small" color="error" sx={{ fontWeight: 800 }} />
                                    </Stack>
                                </Stack>
                            </Card>

                            <DailyStudentTable
                                students={state.sheetStudents}
                                onStatusChange={handleStudentStatusChange}
                                onNotesChange={handleStudentNotesChange}
                                isLoading={state.isLoadingSheet}
                                disabled={!canEdit || state.isSaving}
                            />

                            <DailyMeetingSelectorDialog
                                open={isMeetingPickerOpen}
                                onClose={() => setIsMeetingPickerOpen(false)}
                                meetings={state.meetings}
                                selectedDate={activeInputMeeting?.date || ""}
                                onSelectDate={(date) => setState({ selectedMeetingDate: date })}
                                disabled={state.isLoadingMeetings}
                            />
                        </Stack>
                    ) : state.activeTab === "cards" ? (
                        <DailySummaryCards meetings={filteredMeetings} />
                    ) : (
                        <DailyLedgerTable
                            ledger={state.monthlyLedger}
                            isLoading={state.isLoadingLedger}
                            meetings={state.meetings}
                            canEdit={canEdit}
                            onSelectDateToEdit={openEditDialog}
                        />
                    )}
                </>
            )}

            {/* Dialog Input / Edit Buku Induk Harian */}
            <DailyAttendanceEditDialog
                open={state.isEditDialogOpen}
                meeting={state.editingMeeting}
                students={state.sheetStudents}
                recordedBy={state.sheetRecordedBy}
                updatedBy={state.sheetUpdatedBy}
                isLoading={state.isLoadingSheet}
                isSaving={state.isSaving}
                onClose={closeEditDialog}
                onStatusChange={handleStudentStatusChange}
                onNotesChange={handleStudentNotesChange}
                onMarkAllHadir={handleMarkAllHadir}
                onSave={() => handleSaveDaily()}
            />
        </Box>
    );
};

export default DailyAttendanceView;
