import React, { useMemo } from "react";
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Stack,
    TextField,
    Typography,
    ToggleButton,
    ToggleButtonGroup,
    Alert,
} from "@mui/material";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import SaveIcon from "@mui/icons-material/Save";
import { useTheme } from "@mui/material/styles";
import { BaseDialog, DialogHeader, DialogBody, DialogFooter } from "@components/Dialog";
import type {
    DailyAttendanceStatus,
    DailyMeetingItem,
    DailyStudentSheetItem,
} from "@api/dailyAttendance/model";
import {
    computeDailySheetRecap,
    formatIndonesianShortDate,
} from "../List/utils/dailyAttendanceMapper";

interface DailyAttendanceEditDialogProps {
    open: boolean;
    meeting: DailyMeetingItem | null;
    students: DailyStudentSheetItem[];
    recordedBy: string | null;
    updatedBy: string | null;
    isLoading: boolean;
    isSaving: boolean;
    onClose: () => void;
    onStatusChange: (idStudent: string, status: DailyAttendanceStatus) => void;
    onNotesChange: (idStudent: string, notes: string) => void;
    onMarkAllHadir: () => void;
    onSave: () => void;
}

export const DailyAttendanceEditDialog: React.FC<DailyAttendanceEditDialogProps> = ({
    open,
    meeting,
    students,
    recordedBy,
    updatedBy,
    isLoading,
    isSaving,
    onClose,
    onStatusChange,
    onNotesChange,
    onMarkAllHadir,
    onSave,
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const recap = useMemo(() => computeDailySheetRecap(students), [students]);

    return (
        <BaseDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogHeader
                title={
                    meeting
                        ? `Buku Induk Harian — ${meeting.day}, ${formatIndonesianShortDate(meeting.date)}`
                        : "Buku Induk Harian"
                }
                subtitle={
                    meeting
                        ? `Pertemuan #${meeting.pertemuan_ke} · ${meeting.semester}`
                        : undefined
                }
                onClose={onClose}
            />

            <DialogBody>
                {isLoading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Stack spacing={2}>
                        {(recordedBy || updatedBy) && (
                            <Alert severity="info" sx={{ borderRadius: 2 }}>
                                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                    {recordedBy ? `Diinput oleh: ${recordedBy}` : ""}
                                    {recordedBy && updatedBy ? " · " : ""}
                                    {updatedBy ? `Terakhir diperbarui: ${updatedBy}` : ""}
                                </Typography>
                            </Alert>
                        )}

                        {/* Rekap & Quick Action */}
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={1}
                            sx={{ alignItems: { sm: "center" }, justifyContent: "space-between" }}
                        >
                            <Stack direction="row" spacing={0.75} sx={{ flexWrap: "wrap", gap: 0.75 }}>
                                <Chip label={`Total: ${recap.TOTAL}`} size="small" sx={{ fontWeight: 800 }} />
                                <Chip label={`Hadir: ${recap.HADIR}`} size="small" color="success" sx={{ fontWeight: 800 }} />
                                <Chip label={`Sakit: ${recap.SAKIT}`} size="small" color="warning" sx={{ fontWeight: 800 }} />
                                <Chip label={`Izin: ${recap.IZIN}`} size="small" color="info" sx={{ fontWeight: 800 }} />
                                <Chip label={`Alpa: ${recap.ALPA}`} size="small" color="error" sx={{ fontWeight: 800 }} />
                            </Stack>

                            <Button
                                size="small"
                                variant="outlined"
                                color="success"
                                startIcon={<DoneAllIcon />}
                                onClick={onMarkAllHadir}
                                sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2 }}
                            >
                                Semua Hadir (Nihil)
                            </Button>
                        </Stack>

                        {/* List Siswa */}
                        <Box
                            sx={{
                                border: `1px solid ${isDark ? "#27272a" : "#e2e8f0"}`,
                                borderRadius: 2,
                                overflow: "hidden",
                            }}
                        >
                            {students.map((st, idx) => (
                                <Box
                                    key={st.id_student}
                                    sx={{
                                        px: 2,
                                        py: 1.25,
                                        display: "flex",
                                        flexDirection: { xs: "column", md: "row" },
                                        alignItems: { md: "center" },
                                        justifyContent: "space-between",
                                        gap: 1.5,
                                        borderBottom:
                                            idx < students.length - 1
                                                ? `1px solid ${isDark ? "#27272a" : "#e2e8f0"}`
                                                : "none",
                                        bgcolor:
                                            st.status !== "HADIR"
                                                ? isDark
                                                    ? "rgba(234, 179, 8, 0.06)"
                                                    : "#fffbeb"
                                                : "transparent",
                                    }}
                                >
                                    <Box sx={{ minWidth: 200 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 800 }}>
                                            {idx + 1}. {st.name}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: isDark ? "#a1a1aa" : "#64748b" }}>
                                            NIS: {st.nis || "-"}
                                        </Typography>
                                    </Box>

                                    <Stack
                                        direction={{ xs: "column", sm: "row" }}
                                        spacing={1}
                                        sx={{ alignItems: { sm: "center" }, flex: 1, justifyContent: "flex-end" }}
                                    >
                                        <ToggleButtonGroup
                                            exclusive
                                            size="small"
                                            value={st.status}
                                            onChange={(_, val) => {
                                                if (val) onStatusChange(st.id_student, val);
                                            }}
                                        >
                                            <ToggleButton value="HADIR" color="success" sx={{ fontWeight: 800, px: 1.5 }}>
                                                Hadir
                                            </ToggleButton>
                                            <ToggleButton value="SAKIT" color="warning" sx={{ fontWeight: 800, px: 1.5 }}>
                                                Sakit
                                            </ToggleButton>
                                            <ToggleButton value="IZIN" color="info" sx={{ fontWeight: 800, px: 1.5 }}>
                                                Izin
                                            </ToggleButton>
                                            <ToggleButton value="ALPA" color="error" sx={{ fontWeight: 800, px: 1.5 }}>
                                                Alpa
                                            </ToggleButton>
                                        </ToggleButtonGroup>

                                        <TextField
                                            size="small"
                                            placeholder="Keterangan..."
                                            value={st.notes || ""}
                                            onChange={(e) => onNotesChange(st.id_student, e.target.value)}
                                            sx={{ minWidth: { xs: "100%", sm: 180 } }}
                                        />
                                    </Stack>
                                </Box>
                            ))}
                        </Box>
                    </Stack>
                )}
            </DialogBody>

            <DialogFooter>
                <Button onClick={onClose} color="inherit" disabled={isSaving} sx={{ textTransform: "none", fontWeight: 700 }}>
                    Batal
                </Button>
                <Button
                    variant="contained"
                    onClick={onSave}
                    disabled={isLoading || isSaving || students.length === 0}
                    startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                    sx={{ textTransform: "none", fontWeight: 800, borderRadius: 2 }}
                >
                    {isSaving ? "Menyimpan..." : "Simpan Buku Induk"}
                </Button>
            </DialogFooter>
        </BaseDialog>
    );
};

export default DailyAttendanceEditDialog;
