import React, { useMemo, useState } from "react";
import {
    Box,
    Grid,
    TextField,
    MenuItem,
    Typography,
    Stack,
    Chip,
    Alert,
    AlertTitle,
    Button,
    Tabs,
    Tab,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import TodayIcon from "@mui/icons-material/Today";
import { useTheme } from "@mui/material/styles";
import { BaseDialog, DialogHeader, DialogBody, DialogFooter } from "@components/Dialog";
import type { DailyMeetingItem } from "@api/dailyAttendance/model";

interface DailyMeetingSelectorDialogProps {
    open: boolean;
    onClose: () => void;
    meetings: DailyMeetingItem[];
    selectedDate: string;
    onSelectDate: (date: string) => void;
    disabled?: boolean;
}

const formatDisplayDate = (dateStr: string) => {
    try {
        const d = new Date(dateStr + "T00:00:00");
        return d.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    } catch {
        return dateStr;
    }
};

export const DailyMeetingSelectorDialog: React.FC<DailyMeetingSelectorDialogProps> = ({
    open,
    onClose,
    meetings,
    selectedDate,
    onSelectDate,
    disabled = false,
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const [semesterFilter, setSemesterFilter] = useState<string>("ALL");
    const [statusFilter, setStatusFilter] = useState<"ALL" | "RECORDED" | "UNRECORDED">("ALL");

    const todayStr = useMemo(() => {
        const t = new Date();
        return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(
            t.getDate()
        ).padStart(2, "0")}`;
    }, []);

    const uniqueSemesters = useMemo(() => {
        const sems = new Set<string>();
        meetings.forEach((m) => {
            if (m.semester) sems.add(m.semester);
        });
        return Array.from(sems);
    }, [meetings]);

    const filteredMeetings = useMemo(() => {
        return meetings.filter((m) => {
            if (semesterFilter !== "ALL" && m.semester !== semesterFilter) return false;
            if (statusFilter === "RECORDED" && !m.is_recorded) return false;
            if (statusFilter === "UNRECORDED" && m.is_recorded) return false;
            return true;
        });
    }, [meetings, semesterFilter, statusFilter]);

    const handlePickDate = (date: string) => {
        if (disabled) return;
        onSelectDate(date);
        onClose();
    };

    const handleJumpToNearest = () => {
        const source = filteredMeetings.length > 0 ? filteredMeetings : meetings;
        if (source.length === 0) return;
        const nearest = source.find((m) => m.date >= todayStr) || source[source.length - 1];
        if (nearest) {
            onSelectDate(nearest.date);
            onClose();
        }
    };

    return (
        <BaseDialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogHeader
                title="Pilih Pertemuan Harian (Kalender Akademik)"
                subtitle={`${filteredMeetings.length} Pertemuan Efektif — Hari Libur Kalender Akademik Tidak Dihitung`}
                onClose={onClose}
            />

            <DialogBody>
                <Stack spacing={1.5}>
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1.5}
                        sx={{
                            alignItems: { sm: "center" },
                            justifyContent: "space-between",
                            borderBottom: isDark ? "1px solid #27272a" : "1px solid #e2e8f0",
                            pb: 1.25,
                        }}
                    >
                        <Tabs
                            value={semesterFilter}
                            onChange={(_, val) => setSemesterFilter(val)}
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{ minHeight: 36 }}
                        >
                            <Tab
                                label={`Semua (${meetings.length})`}
                                value="ALL"
                                sx={{ minHeight: 36, textTransform: "none", fontWeight: 700, fontSize: "12.5px" }}
                            />
                            {uniqueSemesters.map((sem) => (
                                <Tab
                                    key={sem}
                                    label={sem}
                                    value={sem}
                                    sx={{ minHeight: 36, textTransform: "none", fontWeight: 700, fontSize: "12.5px" }}
                                />
                            ))}
                        </Tabs>

                        <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ alignItems: { sm: "center" } }}>
                            <TextField
                                select
                                size="small"
                                label="Filter Status"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as any)}
                                sx={{
                                    minWidth: { xs: "100%", sm: 200 },
                                    "& .MuiInputBase-root": {
                                        bgcolor: isDark ? "#27272a" : "#ffffff",
                                        borderRadius: 2,
                                    },
                                }}
                            >
                                <MenuItem value="ALL">Semua Pertemuan ({meetings.length})</MenuItem>
                                <MenuItem value="UNRECORDED">Belum Diisi</MenuItem>
                                <MenuItem value="RECORDED">Sudah Diisi</MenuItem>
                            </TextField>

                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<TodayIcon sx={{ fontSize: 16 }} />}
                                onClick={handleJumpToNearest}
                                disabled={meetings.length === 0}
                                sx={{
                                    textTransform: "none",
                                    fontWeight: 700,
                                    borderRadius: 2,
                                    fontSize: "12px",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                Pertemuan Terdekat
                            </Button>
                        </Stack>
                    </Stack>

                    {filteredMeetings.length === 0 ? (
                        <Alert
                            severity="info"
                            sx={{
                                borderRadius: 2.5,
                                bgcolor: isDark ? "rgba(37, 99, 235, 0.1)" : "#eff6ff",
                                border: isDark ? "1px solid #1d4ed8" : "1px solid #bfdbfe",
                            }}
                        >
                            <AlertTitle sx={{ fontWeight: 800 }}>Tidak Ada Pertemuan</AlertTitle>
                            <Typography variant="body2">
                                Tidak ditemukan pertemuan pada filter semester/status ini.
                            </Typography>
                        </Alert>
                    ) : (
                        <Box
                            sx={{
                                maxHeight: "55vh",
                                overflowY: "auto",
                                pr: 0.5,
                            }}
                        >
                            <Grid container spacing={1.25}>
                                {filteredMeetings.map((m) => {
                                    const isSelected = selectedDate === m.date;
                                    const isToday = m.date === todayStr;

                                    return (
                                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={m.date}>
                                            <Box
                                                onClick={() => handlePickDate(m.date)}
                                                sx={{
                                                    p: 1.5,
                                                    borderRadius: 2.5,
                                                    cursor: disabled ? "not-allowed" : "pointer",
                                                    transition: "all 0.15s ease",
                                                    border: isSelected
                                                        ? "2px solid #2563eb"
                                                        : isToday
                                                        ? "1.5px solid #16a34a"
                                                        : isDark
                                                        ? "1px solid #27272a"
                                                        : "1px solid #e2e8f0",
                                                    bgcolor: isSelected
                                                        ? isDark
                                                            ? "rgba(37, 99, 235, 0.18)"
                                                            : "#eff6ff"
                                                        : isDark
                                                        ? "#27272a"
                                                        : "#ffffff",
                                                    "&:hover": disabled
                                                        ? {}
                                                        : {
                                                              borderColor: "#2563eb",
                                                              boxShadow: isDark
                                                                  ? "0 4px 12px rgba(0,0,0,0.35)"
                                                                  : "0 4px 12px rgba(37, 99, 235, 0.1)",
                                                          },
                                                }}
                                            >
                                                <Stack
                                                    direction="row"
                                                    sx={{ alignItems: "center", justifyContent: "space-between", mb: 0.75 }}
                                                >
                                                    <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                                                        <Chip
                                                            label={`Pertemuan ${m.pertemuan_ke}`}
                                                            size="small"
                                                            color={isSelected ? "primary" : "default"}
                                                            sx={{ fontWeight: 800, fontSize: "10.5px", height: 20 }}
                                                        />
                                                        {isToday && (
                                                            <Chip
                                                                label="Hari Ini"
                                                                size="small"
                                                                color="success"
                                                                sx={{ fontWeight: 800, fontSize: "10px", height: 20 }}
                                                            />
                                                        )}
                                                    </Stack>

                                                    {isSelected ? (
                                                        <CheckCircleIcon sx={{ fontSize: 17, color: "#2563eb" }} />
                                                    ) : (
                                                        <RadioButtonUncheckedIcon
                                                            sx={{ fontSize: 17, color: isDark ? "#52525b" : "#cbd5e1" }}
                                                        />
                                                    )}
                                                </Stack>

                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontWeight: 800,
                                                        fontSize: "12.5px",
                                                        color: isDark ? "#f4f4f5" : "#0f172a",
                                                    }}
                                                >
                                                    {m.day}, {formatDisplayDate(m.date)}
                                                </Typography>

                                                <Stack
                                                    direction="row"
                                                    sx={{ alignItems: "center", justifyContent: "space-between", mt: 0.75 }}
                                                >
                                                    <Typography
                                                        variant="caption"
                                                        sx={{ fontSize: "10px", color: isDark ? "#a1a1aa" : "#64748b" }}
                                                    >
                                                        {m.semester}
                                                    </Typography>
                                                    <Chip
                                                        label={
                                                            !m.is_recorded
                                                                ? "Belum Diisi"
                                                                : m.is_nihil
                                                                ? "Nihil"
                                                                : `${m.absent_students.length} Tidak Hadir`
                                                        }
                                                        size="small"
                                                        color={
                                                            !m.is_recorded
                                                                ? "default"
                                                                : m.is_nihil
                                                                ? "success"
                                                                : "warning"
                                                        }
                                                        variant={m.is_recorded ? "filled" : "outlined"}
                                                        sx={{ fontWeight: 800, fontSize: "10px", height: 19 }}
                                                    />
                                                </Stack>
                                            </Box>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </Box>
                    )}
                </Stack>
            </DialogBody>

            <DialogFooter>
                <Button onClick={onClose} color="inherit" sx={{ textTransform: "none", fontWeight: 700 }}>
                    Tutup
                </Button>
            </DialogFooter>
        </BaseDialog>
    );
};

export default DailyMeetingSelectorDialog;
