import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    Chip,
    Avatar,
    TextField,
    CircularProgress,
    Stack,
    useMediaQuery,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import { useTheme } from "@mui/material/styles";
import type { DailyStudentSheetItem, DailyAttendanceStatus } from "@api/dailyAttendance/model";
import AttendanceStatusControl from "@pages/dashboardAttendance/Update/AttendanceStatusControl";

interface DailyStudentTableProps {
    students: DailyStudentSheetItem[];
    onStatusChange: (studentId: string, status: DailyAttendanceStatus) => void;
    onNotesChange: (studentId: string, notes: string) => void;
    isLoading: boolean;
    disabled?: boolean;
}

const normalizeGenderShort = (gender?: string | null): "L" | "P" | "-" => {
    const g = (gender || "").trim().toUpperCase();
    if (g.startsWith("L") || g === "MALE") return "L";
    if (g.startsWith("P") || g === "FEMALE") return "P";
    return "-";
};

export const DailyStudentTable: React.FC<DailyStudentTableProps> = ({
    students,
    onStatusChange,
    onNotesChange,
    isLoading,
    disabled = false,
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    if (isLoading) {
        return (
            <Box
                sx={{
                    p: 5,
                    textAlign: "center",
                    bgcolor: isDark ? "#18181b" : "#ffffff",
                    borderRadius: 3,
                    border: isDark ? "1px solid #27272a" : "1px solid #e2e8f0",
                }}
            >
                <CircularProgress size={36} color="primary" sx={{ mb: 2 }} />
                <Typography variant="body2" sx={{ color: isDark ? "#a1a1aa" : "#64748b" }}>
                    Memuat daftar siswa & lembar buku induk harian...
                </Typography>
            </Box>
        );
    }

    if (students.length === 0) {
        return (
            <Box
                sx={{
                    p: { xs: 4, sm: 6 },
                    textAlign: "center",
                    bgcolor: isDark ? "#18181b" : "#ffffff",
                    borderRadius: 3,
                    border: isDark ? "1px solid #27272a" : "1px solid #e2e8f0",
                }}
            >
                <PeopleIcon sx={{ fontSize: 48, color: isDark ? "#52525b" : "#cbd5e1", mb: 1.5 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: isDark ? "#f4f4f5" : '#1e293b' }}>
                    Tidak Ada Data Siswa
                </Typography>
                <Typography variant="body2" sx={{ color: isDark ? "#a1a1aa" : "#64748b", maxWidth: 450, mx: "auto", mt: 0.5 }}>
                    Belum ada siswa yang terdaftar pada kelas ini, atau silakan pilih pertemuan/tanggal yang valid di atas.
                </Typography>
            </Box>
        );
    }

    if (isMobile) {
        return (
            <Stack spacing={1.5}>
                {students.map((student, idx) => {
                    const isIzin = student.status === "IZIN";
                    const isSakit = student.status === "SAKIT";
                    const isAlpa = student.status === "ALPA";
                    const gShort = normalizeGenderShort(student.gender);

                    return (
                        <Paper
                            key={student.id_student}
                            variant="outlined"
                            sx={{
                                p: 2,
                                borderRadius: 2.5,
                                borderColor: isDark ? "#27272a" : "#e2e8f0",
                                bgcolor: isDark
                                    ? isAlpa
                                        ? "rgba(220, 38, 38, 0.1)"
                                        : isSakit
                                        ? "rgba(37, 99, 235, 0.08)"
                                        : isIzin
                                        ? "rgba(202, 138, 4, 0.08)"
                                        : "#18181b"
                                    : isAlpa
                                    ? "#fef2f2"
                                    : isSakit
                                    ? "#eff6ff"
                                    : isIzin
                                    ? "#fefce8"
                                    : "#ffffff",
                            }}
                        >
                            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                                <Stack direction="row" spacing={1.25} sx={{ alignItems: "center", minWidth: 0 }}>
                                    <Typography variant="caption" sx={{ fontWeight: 800, color: isDark ? "#a1a1aa" : "#64748b", minWidth: 20 }}>
                                        #{idx + 1}
                                    </Typography>
                                    <Avatar
                                        src={
                                            student.profile_url
                                                ? `${import.meta.env.VITE_BACKEND_URL}/api/upload/${student.profile_url}`
                                                : undefined
                                        }
                                        sx={{
                                            width: 36,
                                            height: 36,
                                            bgcolor: isDark ? "#3b82f6" : "#2563eb",
                                            fontSize: "13px",
                                            fontWeight: 800,
                                        }}
                                    >
                                        {student.name.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <Box sx={{ minWidth: 0 }}>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontWeight: 800,
                                                color: isDark ? "#f4f4f5" : "#0f172a",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {student.name}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: isDark ? "#a1a1aa" : "#64748b", display: "block" }}>
                                            NIS: {student.nis || "-"} • NISN: {student.nisn || "-"}
                                        </Typography>
                                    </Box>
                                </Stack>

                                <Chip
                                    size="small"
                                    label={gShort}
                                    sx={{
                                        fontWeight: 800,
                                        fontSize: "11px",
                                        flexShrink: 0,
                                        bgcolor:
                                            gShort === "L"
                                                ? isDark
                                                    ? "rgba(37, 99, 235, 0.2)"
                                                    : "#dbeafe"
                                                : isDark
                                                ? "rgba(236, 72, 153, 0.2)"
                                                : "#fce7f3",
                                        color:
                                            gShort === "L"
                                                ? isDark
                                                    ? "#93c5fd"
                                                    : "#1d4ed8"
                                                : isDark
                                                ? "#f472b6"
                                                : "#be185d",
                                    }}
                                />
                            </Stack>

                            <AttendanceStatusControl
                                status={student.status}
                                notes={student.notes}
                                onStatusChange={(newStatus) => onStatusChange(student.id_student, newStatus)}
                                onNotesChange={(newNotes) => onNotesChange(student.id_student, newNotes)}
                                disabled={disabled}
                                fullWidthButtons
                                showNotesInline
                            />
                        </Paper>
                    );
                })}
            </Stack>
        );
    }

    return (
        <TableContainer
            component={Paper}
            variant="outlined"
            sx={{
                borderRadius: 3,
                overflowX: "auto",
                bgcolor: isDark ? "#18181b" : "#ffffff",
                borderColor: isDark ? "#27272a" : "#e2e8f0",
            }}
        >
            <Table size="small">
                <TableHead sx={{ bgcolor: isDark ? "#1f2937" : "#f8fafc" }}>
                    <TableRow>
                        <TableCell sx={{ width: 48, fontWeight: 800, color: isDark ? "#f4f4f5" : "#0f172a", textAlign: "center", py: 1.5 }}>
                            NO
                        </TableCell>
                        <TableCell sx={{ minWidth: 210, fontWeight: 800, color: isDark ? "#f4f4f5" : "#0f172a", py: 1.5 }}>
                            NAMA & DATA SISWA
                        </TableCell>
                        <TableCell sx={{ width: 72, fontWeight: 800, color: isDark ? "#f4f4f5" : "#0f172a", textAlign: "center", py: 1.5 }}>
                            L/P
                        </TableCell>
                        <TableCell sx={{ width: 290, fontWeight: 800, color: isDark ? "#f4f4f5" : "#0f172a", textAlign: "center", py: 1.5 }}>
                            STATUS KEHADIRAN (H / I / S / A)
                        </TableCell>
                        <TableCell sx={{ minWidth: 180, fontWeight: 800, color: isDark ? "#f4f4f5" : "#0f172a", py: 1.5 }}>
                            CATATAN / KETERANGAN
                        </TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {students.map((student, idx) => {
                        const isHadir = student.status === "HADIR";
                        const isIzin = student.status === "IZIN";
                        const isSakit = student.status === "SAKIT";
                        const isAlpa = student.status === "ALPA";
                        const gShort = normalizeGenderShort(student.gender);

                        return (
                            <TableRow
                                key={student.id_student}
                                sx={{
                                    bgcolor: isDark
                                        ? isAlpa
                                            ? "rgba(220, 38, 38, 0.1)"
                                            : isSakit
                                            ? "rgba(37, 99, 235, 0.08)"
                                            : isIzin
                                            ? "rgba(202, 138, 4, 0.08)"
                                            : "inherit"
                                        : isAlpa
                                        ? "#fef2f2"
                                        : isSakit
                                        ? "#eff6ff"
                                        : isIzin
                                        ? "#fefce8"
                                        : "inherit",
                                    "&:hover": {
                                        bgcolor: isDark ? "#27272a" : "#f8fafc",
                                    },
                                    borderBottom: isDark ? "1px solid #27272a" : "1px solid #f1f5f9",
                                }}
                            >
                                <TableCell sx={{ textAlign: "center", fontWeight: 700, color: isDark ? "#a1a1aa" : "#64748b", py: 1.25 }}>
                                    {idx + 1}
                                </TableCell>

                                <TableCell sx={{ py: 1.25 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                                        <Avatar
                                            src={
                                                student.profile_url
                                                    ? `${import.meta.env.VITE_BACKEND_URL}/api/upload/${student.profile_url}`
                                                    : undefined
                                            }
                                            sx={{
                                                width: 34,
                                                height: 34,
                                                bgcolor: isDark ? "#3b82f6" : "#2563eb",
                                                fontSize: "12px",
                                                fontWeight: 800,
                                            }}
                                        >
                                            {student.name.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 800, color: isDark ? "#f4f4f5" : "#0f172a" }}>
                                                {student.name}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: isDark ? "#a1a1aa" : "#64748b", display: "block" }}>
                                                NIS: {student.nis || "-"} • NISN: {student.nisn || "-"}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>

                                <TableCell sx={{ textAlign: "center", py: 1.25 }}>
                                    <Chip
                                        size="small"
                                        label={gShort}
                                        sx={{
                                            fontWeight: 800,
                                            fontSize: "11px",
                                            bgcolor:
                                                gShort === "L"
                                                    ? isDark
                                                        ? "rgba(37, 99, 235, 0.2)"
                                                        : "#dbeafe"
                                                    : isDark
                                                    ? "rgba(236, 72, 153, 0.2)"
                                                    : "#fce7f3",
                                            color:
                                                gShort === "L"
                                                    ? isDark
                                                        ? "#93c5fd"
                                                        : "#1d4ed8"
                                                    : isDark
                                                    ? "#f472b6"
                                                    : "#be185d",
                                        }}
                                    />
                                </TableCell>

                                <TableCell sx={{ textAlign: "center", py: 1.25 }}>
                                    <AttendanceStatusControl
                                        status={student.status}
                                        onStatusChange={(newStatus) => onStatusChange(student.id_student, newStatus)}
                                        onNotesChange={() => {}}
                                        disabled={disabled}
                                    />
                                </TableCell>

                                <TableCell sx={{ py: 1.25 }}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        disabled={disabled}
                                        placeholder={isHadir ? "Catatan opsional..." : "Alasan / keterangan..."}
                                        value={student.notes || ""}
                                        onChange={(e) => onNotesChange(student.id_student, e.target.value)}
                                        sx={{
                                            "& .MuiInputBase-root": {
                                                fontSize: "12px",
                                                bgcolor: isDark ? "#27272a" : "#ffffff",
                                                borderRadius: 1.5,
                                            },
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default DailyStudentTable;
