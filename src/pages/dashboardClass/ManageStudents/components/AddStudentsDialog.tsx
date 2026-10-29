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
    Checkbox,
    Button,
    CircularProgress,
    Alert,
} from "@mui/material";
import { Close, Search, Add, School } from "@mui/icons-material";
import { BaseDialog, DialogHeader, DialogBody, DialogFooter } from "@components/Dialog";
import type { StudentInClassModel } from "@api/class/model";
import { getStudentPhotoUrl, formatStudentFullName } from "../utils/manageStudentsHelper";

interface AddStudentsDialogProps {
    isOpen: boolean;
    classNameDisplay: string;
    students: StudentInClassModel[];
    selectedStudentIds: string[];
    isLoading: boolean;
    searchQuery: string;
    errorMessage: string | null;
    isSubmitting: boolean;
    onClose: () => void;
    onSearchChange: (value: string) => void;
    onToggleSelect: (id: string) => void;
    onToggleSelectAll: () => void;
    onSubmit: () => void;
    onClearError: () => void;
}

export const AddStudentsDialog: React.FC<AddStudentsDialogProps> = ({
    isOpen,
    classNameDisplay,
    students,
    selectedStudentIds,
    isLoading,
    searchQuery,
    errorMessage,
    isSubmitting,
    onClose,
    onSearchChange,
    onToggleSelect,
    onToggleSelectAll,
    onSubmit,
    onClearError,
}) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const isAllSelected =
        students.length > 0 && students.every((s) => selectedStudentIds.includes(s.id));
    const isIndeterminate =
        selectedStudentIds.length > 0 && selectedStudentIds.length < students.length;

    return (
        <BaseDialog
            isOpen={isOpen}
            onClose={() => !isSubmitting && onClose()}
            maxWidth="md"
        >
            <DialogHeader
                title={`Tambah Peserta Didik ke ${classNameDisplay}`}
                onClose={() => !isSubmitting && onClose()}
            />
            <DialogBody>
                {/* Error Banner jika ada pesan error dari backend */}
                {errorMessage && (
                    <Alert
                        severity="error"
                        sx={{ mb: 2, borderRadius: 2 }}
                        onClose={onClearError}
                    >
                        {errorMessage}
                    </Alert>
                )}

                <Box sx={{ mb: 2.5, display: "flex", alignItems: "center", gap: 2 }}>
                    <TextField
                        size="small"
                        placeholder="Cari siswa (Nama, NIS, NISN, atau Kelas)..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        fullWidth
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

                    {selectedStudentIds.length > 0 && (
                        <Chip
                            label={`${selectedStudentIds.length} Siswa Dipilih`}
                            color="primary"
                            sx={{ fontWeight: 600, minWidth: "fit-content" }}
                        />
                    )}
                </Box>

                {isLoading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                        <CircularProgress size={36} />
                    </Box>
                ) : students.length > 0 ? (
                    <Box
                        sx={{
                            border: 1,
                            borderColor: "divider",
                            borderRadius: 2,
                            maxHeight: 350,
                            overflowY: "auto",
                        }}
                    >
                        <Table size="small" stickyHeader>
                            <TableHead>
                                <TableRow sx={{ bgcolor: "background.default" }}>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            size="small"
                                            indeterminate={isIndeterminate}
                                            checked={isAllSelected}
                                            onChange={onToggleSelectAll}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Foto & Nama Siswa</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>NIS / NISN</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Status Kelas Saat Ini</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Status Akun</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {students.map((student) => {
                                    const isSelected = selectedStudentIds.includes(student.id);
                                    const photo = getStudentPhotoUrl(backendUrl, student.profile_url);
                                    const fullName = formatStudentFullName(student);
                                    const hasOtherClass = Boolean(student.current_class);

                                    return (
                                        <TableRow
                                            key={student.id}
                                            hover
                                            onClick={() => onToggleSelect(student.id)}
                                            sx={{ cursor: "pointer" }}
                                            selected={isSelected}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    size="small"
                                                    checked={isSelected}
                                                    onChange={() => onToggleSelect(student.id)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                    <Avatar
                                                        src={photo || undefined}
                                                        sx={{
                                                            width: 32,
                                                            height: 32,
                                                            bgcolor: "primary.main",
                                                            fontSize: "0.8rem",
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
                                                <Typography variant="body2">NIS: {student.nis}</Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    NISN: {student.nisn || "-"}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                {hasOtherClass ? (
                                                    <Chip
                                                        icon={<School sx={{ fontSize: 14 }} />}
                                                        label={`Kelas: ${student.current_class?.name}${
                                                            student.current_class?.periode
                                                                ? ` (${student.current_class.periode})`
                                                                : ""
                                                        }`}
                                                        color="warning"
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{ fontSize: "0.75rem", fontWeight: 600 }}
                                                    />
                                                ) : (
                                                    <Chip
                                                        label="Tersedia"
                                                        size="small"
                                                        variant="outlined"
                                                        color="success"
                                                        sx={{ fontSize: "0.75rem", fontWeight: 500 }}
                                                    />
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={student.status ? "Aktif" : "Non Aktif"}
                                                    size="small"
                                                    color={student.status ? "success" : "default"}
                                                    sx={{ fontSize: "0.75rem" }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Box>
                ) : (
                    <Box sx={{ py: 6, textAlign: "center" }}>
                        <Typography variant="body2" color="text.secondary">
                            {searchQuery
                                ? "Tidak ada peserta didik yang sesuai pencarian"
                                : "Semua peserta didik yang terdaftar sudah berada di dalam kelas ini."}
                        </Typography>
                    </Box>
                )}
            </DialogBody>
            <DialogFooter>
                <Button
                    onClick={onClose}
                    color="inherit"
                    disabled={isSubmitting}
                    sx={{ textTransform: "none", borderRadius: "8px" }}
                >
                    Batal
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={selectedStudentIds.length === 0 || isSubmitting}
                    onClick={onSubmit}
                    startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : <Add />}
                    sx={{ borderRadius: "8px", textTransform: "none", px: 3, fontWeight: 600 }}
                >
                    {isSubmitting
                        ? "Menambahkan..."
                        : `Tambahkan (${selectedStudentIds.length} Siswa)`}
                </Button>
            </DialogFooter>
        </BaseDialog>
    );
};

export default AddStudentsDialog;

