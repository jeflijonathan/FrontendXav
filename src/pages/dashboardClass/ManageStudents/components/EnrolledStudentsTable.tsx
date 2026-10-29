import React from "react";
import {
    Box,
    Typography,
    Chip,
    Avatar,
    IconButton,
    TextField,
    InputAdornment,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
} from "@mui/material";
import { Close, Search, PersonRemove, Groups, Add } from "@mui/icons-material";
import { LoadingSpinner } from "@components/feedback";
import type { StudentInClassModel } from "@api/class/model";
import {
    getGenderChipConfig,
    getStudentPhotoUrl,
    formatStudentFullName,
} from "../utils/manageStudentsHelper";

interface EnrolledStudentsTableProps {
    students: StudentInClassModel[];
    isLoading: boolean;
    searchQuery: string;
    onSearchChange: (value: string) => void;
    onOpenAddModal: () => void;
    onRequestRemove: (student: StudentInClassModel) => void;
}

export const EnrolledStudentsTable: React.FC<EnrolledStudentsTableProps> = ({
    students,
    isLoading,
    searchQuery,
    onSearchChange,
    onOpenAddModal,
    onRequestRemove,
}) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    return (
        <>
            {/* Toolbar: Pencarian & Tombol Tambah Peserta Didik */}
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    mb: 2,
                }}
            >
                <TextField
                    size="small"
                    placeholder="Cari siswa di kelas (Nama, NIS, NISN)..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    sx={{ minWidth: { xs: "100%", sm: 320 } }}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search fontSize="small" sx={{ color: "text.secondary" }} />
                                </InputAdornment>
                            ),
                            endAdornment: searchQuery ? (
                                <InputAdornment position="end">
                                    <IconButton size="small" onClick={() => onSearchChange("")}>
                                        <Close fontSize="small" />
                                    </IconButton>
                                </InputAdornment>
                            ) : null,
                        },
                    }}
                />

                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={onOpenAddModal}
                    sx={{
                        borderRadius: "10px",
                        textTransform: "none",
                        fontWeight: 600,
                        px: 2,
                        py: 0.85,
                    }}
                >
                    Tambah Peserta Didik
                </Button>
            </Box>

            {/* Konten Tabel / Loading / Empty State */}
            {isLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                    <LoadingSpinner isLoading={isLoading} />
                </Box>
            ) : students.length > 0 ? (
                <Box
                    sx={{
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 2,
                        overflow: "hidden",
                        maxHeight: 420,
                        overflowY: "auto",
                    }}
                >
                    <Table size="small" stickyHeader>
                        <TableHead>
                            <TableRow sx={{ bgcolor: "background.default" }}>
                                <TableCell sx={{ fontWeight: 700, width: 45 }}>No</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Foto & Nama Siswa</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>NIS / NISN</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Jenis Kelamin</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>No. Telepon</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 700, textAlign: "center", width: 130 }}>
                                    Aksi
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {students.map((student, idx) => {
                                const photo = getStudentPhotoUrl(backendUrl, student.profile_url);
                                const genderConfig = getGenderChipConfig(student.gender);
                                const fullName = formatStudentFullName(student);

                                return (
                                    <TableRow key={student.id} hover>
                                        <TableCell>{idx + 1}</TableCell>
                                        <TableCell>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                <Avatar
                                                    src={photo || undefined}
                                                    sx={{
                                                        width: 36,
                                                        height: 36,
                                                        bgcolor: "primary.main",
                                                        fontWeight: 600,
                                                        fontSize: "0.85rem",
                                                    }}
                                                >
                                                    {student.first_name?.[0]?.toUpperCase() || "?"}
                                                </Avatar>
                                                <div>
                                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                        {fullName}
                                                    </Typography>
                                                    {student.email && (
                                                        <Typography variant="caption" color="text.secondary">
                                                            {student.email}
                                                        </Typography>
                                                    )}
                                                </div>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                NIS: {student.nis}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                NISN: {student.nisn || "-"}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={genderConfig.label}
                                                size="small"
                                                variant="outlined"
                                                color={genderConfig.color}
                                                sx={{ fontSize: "0.75rem" }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {student.phone_number || "-"}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={student.status ? "Aktif" : "Non Aktif"}
                                                size="small"
                                                color={student.status ? "success" : "default"}
                                                sx={{ fontSize: "0.75rem" }}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ textAlign: "center", width: 130 }}>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                color="error"
                                                startIcon={<PersonRemove sx={{ fontSize: 16 }} />}
                                                onClick={() => onRequestRemove(student)}
                                                sx={{
                                                    borderRadius: "6px",
                                                    textTransform: "none",
                                                    fontSize: "0.75rem",
                                                    fontWeight: 600,
                                                    py: 0.35,
                                                    px: 1.25,
                                                    whiteSpace: "nowrap",
                                                    borderColor: "rgba(239, 68, 68, 0.35)",
                                                    color: "error.main",
                                                    "&:hover": {
                                                        bgcolor: "rgba(239, 68, 68, 0.08)",
                                                        borderColor: "error.main",
                                                    },
                                                }}
                                            >
                                                Keluarkan
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Box>
            ) : (
                <Box
                    sx={{
                        py: 8,
                        textAlign: "center",
                        border: "1px dashed",
                        borderColor: "divider",
                        borderRadius: 3,
                        bgcolor: (theme) =>
                            theme.palette.mode === "dark" ? "grey.900" : "#f8fafc",
                    }}
                >
                    <Groups sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
                    <Typography variant="body1" sx={{ fontWeight: 600 }} color="text.secondary" gutterBottom>
                        {searchQuery
                            ? "Tidak ada siswa yang cocok dengan pencarian"
                            : "Belum Ada Siswa di Kelas Ini"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                        {searchQuery
                            ? "Coba kata kunci lain atau bersihkan pencarian."
                            : 'Gunakan tombol "Tambah Peserta Didik" di atas untuk menambahkan anggota kelas ini.'}
                    </Typography>
                </Box>
            )}
        </>
    );
};

export default EnrolledStudentsTable;

