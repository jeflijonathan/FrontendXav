import React from "react";
import {
    Box,
    Button,
    Chip,
    Divider,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from "@mui/material";
import { Add, Delete, MenuBook, Person } from "@mui/icons-material";
import { BaseDialog, DialogHeader, DialogBody } from "@components/Dialog";
import type { TeachingTeacherRowModel, TeachingSubjectRowModel, TeachingClassRowModel } from "@api/teaching/model";
import {
    calculateTeacherTotalJp,
    formatClassLabel,
    formatJpLabel,
    formatSubjectDisplay,
    formatTeacherFullName,
    MAX_SUBJECTS_PER_TEACHER,
} from "../utils/teachingBusinessLogic";
import useDeleteTeachingAssignment from "../Delete/hook/useDeleteTeachingAssignment";

interface Props {
    teacher: TeachingTeacherRowModel | null;
    isOpen: boolean;
    onClose: () => void;
    onOpenAdd: (teacherId: string) => void;
}

interface FlatAssignmentItem {
    subject: TeachingSubjectRowModel;
    placement: TeachingClassRowModel;
}

const UpdateTeachingAssignmentCardDialog: React.FC<Props> = ({
    teacher,
    isOpen,
    onClose,
    onOpenAdd,
}) => {
    const { handleDelete } = useDeleteTeachingAssignment();

    if (!teacher) return null;

    const subjects = teacher.subjects || [];
    const totalJp = teacher.total_jp ?? calculateTeacherTotalJp(subjects);
    const teacherName = formatTeacherFullName(teacher);

    // Flatten all subject + class assignments for table display
    const flatAssignments: FlatAssignmentItem[] = [];
    subjects.forEach((subject) => {
        if (!subject.classes || subject.classes.length === 0) {
            flatAssignments.push({
                subject,
                placement: {
                    id_class_room: null,
                    id_class: null,
                    class_name: null,
                    kelas: null,
                    id_school_information: null,
                    periode: null,
                    status: true,
                },
            });
        } else {
            subject.classes.forEach((placement) => {
                flatAssignments.push({ subject, placement });
            });
        }
    });

    const canAddSubject = subjects.length < MAX_SUBJECTS_PER_TEACHER;

    return (
        <BaseDialog isOpen={isOpen} onClose={onClose} maxWidth="md">
            <DialogHeader
                title={`Kelola & Detail Penugasan Pengajar`}
                onClose={onClose}
            />

            <DialogBody>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, py: 1 }}>
                    {/* 1. Profil Guru & Ringkasan Pengambilan */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            borderRadius: 2.5,
                            border: 1,
                            borderColor: "primary.200",
                            bgcolor: (theme) =>
                                theme.palette.mode === "dark" ? "grey.900" : "#eff6ff",
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            alignItems: { xs: "flex-start", sm: "center" },
                            justifyContent: "space-between",
                            gap: 1.5,
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Box
                                sx={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: "50%",
                                    bgcolor: "primary.main",
                                    color: "#fff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                }}
                            >
                                <Person sx={{ fontSize: 26 }} />
                            </Box>
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                                    {teacherName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    NIY: {teacher.niy || "-"}
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                            <Chip
                                label={`${subjects.length}/${MAX_SUBJECTS_PER_TEACHER} Mapel`}
                                color="primary"
                                variant="outlined"
                                size="small"
                                sx={{ fontWeight: 700, fontSize: "0.75rem" }}
                            />
                            <Chip
                                label={`${teacher.total_classes || 0} Kelas`}
                                variant="outlined"
                                size="small"
                                sx={{ fontWeight: 700, fontSize: "0.75rem" }}
                            />
                            <Chip
                                label={`Total: ${formatJpLabel(totalJp)}`}
                                color={totalJp > 0 ? "success" : "default"}
                                variant="filled"
                                size="small"
                                sx={{ fontWeight: 800, fontSize: "0.78rem" }}
                            />
                        </Box>
                    </Paper>

                    {/* 2. Toolbar di atas tabel: Judul & Tombol Tambah */}
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "text.primary" }}>
                            Tabel Detail Pengambilan Mata Pelajaran & Jam
                        </Typography>

                        <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            startIcon={<Add />}
                            disabled={!canAddSubject}
                            onClick={() => {
                                onClose();
                                onOpenAdd(teacher.id_teacher);
                            }}
                            sx={{
                                textTransform: "none",
                                fontWeight: 700,
                                borderRadius: "8px",
                                fontSize: "0.78rem",
                            }}
                        >
                            + Tambah Mapel / Kelas
                        </Button>
                    </Box>

                    {/* 3. Tabel Detail Pengambilan Penugasan */}
                    <TableContainer
                        component={Paper}
                        elevation={0}
                        sx={{
                            border: 1,
                            borderColor: "divider",
                            borderRadius: 2,
                            maxHeight: 380,
                        }}
                    >
                        <Table size="small" stickyHeader>
                            <TableHead>
                                <TableRow sx={{ bgcolor: "action.hover" }}>
                                    <TableCell sx={{ fontWeight: 800, fontSize: "0.75rem", width: 45 }}>
                                        No
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 800, fontSize: "0.75rem" }}>
                                        Mata Pelajaran
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 800, fontSize: "0.75rem" }}>
                                        Kelas Diampu
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 800, fontSize: "0.75rem" }}>
                                        Periode
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 800, fontSize: "0.75rem", textAlign: "center" }}>
                                        Beban JP
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 800, fontSize: "0.75rem", textAlign: "center" }}>
                                        Status
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 800, fontSize: "0.75rem", textAlign: "center", width: 70 }}>
                                        Aksi
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {flatAssignments.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} sx={{ py: 4, textAlign: "center", color: "text.secondary" }}>
                                            <MenuBook sx={{ fontSize: 32, color: "text.disabled", mb: 1, display: "block", mx: "auto" }} />
                                            Belum ada mata pelajaran atau kelas yang diambil oleh guru ini.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    flatAssignments.map((item, idx) => {
                                        const { name, code } = formatSubjectDisplay(item.subject);
                                        const classText = formatClassLabel(item.placement);
                                        const periodText = item.placement.periode || "-";
                                        const jpAmount = item.subject.jp_amount;
                                        const seed = {
                                            teacher,
                                            subject: item.subject,
                                            placement: item.placement,
                                        };

                                        return (
                                            <TableRow
                                                key={
                                                    item.placement.id_class_room ||
                                                    `${item.subject.id_subject}-${idx}`
                                                }
                                                hover
                                                sx={{
                                                    "&:last-child td, &:last-child th": { border: 0 },
                                                }}
                                            >
                                                <TableCell sx={{ fontSize: "0.78rem", fontWeight: 700, color: "text.secondary" }}>
                                                    {idx + 1}
                                                </TableCell>
                                                <TableCell sx={{ py: 1 }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 700, fontSize: "0.82rem" }}>
                                                        {name}
                                                    </Typography>
                                                    {code && (
                                                        <Typography variant="caption" color="text.secondary">
                                                            {code}
                                                        </Typography>
                                                    )}
                                                </TableCell>
                                                <TableCell sx={{ py: 1 }}>
                                                    <Chip
                                                        label={classText}
                                                        size="small"
                                                        variant="outlined"
                                                        color="primary"
                                                        sx={{ fontWeight: 700, fontSize: "0.73rem" }}
                                                    />
                                                </TableCell>
                                                <TableCell sx={{ fontSize: "0.78rem", py: 1, color: "text.secondary" }}>
                                                    {periodText}
                                                </TableCell>
                                                <TableCell sx={{ textAlign: "center", py: 1 }}>
                                                    <Chip
                                                        label={formatJpLabel(jpAmount)}
                                                        size="small"
                                                        color="primary"
                                                        variant="filled"
                                                        sx={{ fontWeight: 800, fontSize: "0.75rem", height: 24 }}
                                                    />
                                                </TableCell>
                                                <TableCell sx={{ textAlign: "center", py: 1 }}>
                                                    <Chip
                                                        label={item.placement.status ? "Aktif" : "Non Aktif"}
                                                        size="small"
                                                        color={item.placement.status ? "success" : "default"}
                                                        variant="outlined"
                                                        sx={{ fontSize: "0.7rem", height: 22 }}
                                                    />
                                                </TableCell>
                                                <TableCell sx={{ textAlign: "center", py: 1 }}>
                                                    {item.placement.id_class_room && (
                                                        <Tooltip title="Hapus Penugasan ini">
                                                            <IconButton
                                                                size="small"
                                                                color="error"
                                                                onClick={() => handleDelete(seed)}
                                                                sx={{
                                                                    p: 0.5,
                                                                    borderRadius: 1.5,
                                                                    "&:hover": { bgcolor: "error.50" },
                                                                }}
                                                            >
                                                                <Delete fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Divider />

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="caption" color="text.secondary">
                            Maksimal {MAX_SUBJECTS_PER_TEACHER} mata pelajaran per guru. Penugasan dapat dihapus langsung pada tabel di atas.
                        </Typography>
                        <Button
                            variant="outlined"
                            onClick={onClose}
                            size="small"
                            sx={{ borderRadius: "8px", textTransform: "none", px: 2.5 }}
                        >
                            Tutup
                        </Button>
                    </Box>
                </Box>
            </DialogBody>
        </BaseDialog>
    );
};

export default UpdateTeachingAssignmentCardDialog;
