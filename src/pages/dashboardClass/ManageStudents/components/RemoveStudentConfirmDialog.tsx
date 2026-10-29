import React from "react";
import { Box, Typography, Avatar, Button } from "@mui/material";
import { PersonRemove } from "@mui/icons-material";
import { BaseDialog, DialogHeader, DialogBody, DialogFooter } from "@components/Dialog";
import type { StudentInClassModel } from "@api/class/model";
import { formatStudentFullName } from "../utils/manageStudentsHelper";

interface RemoveStudentConfirmDialogProps {
    isOpen: boolean;
    student: StudentInClassModel | null;
    classNameDisplay: string;
    isRemoving: boolean;
    onClose: () => void;
    onConfirmRemove: () => void;
}

export const RemoveStudentConfirmDialog: React.FC<RemoveStudentConfirmDialogProps> = ({
    isOpen,
    student,
    classNameDisplay,
    isRemoving,
    onClose,
    onConfirmRemove,
}) => {
    const studentName = formatStudentFullName(student);

    return (
        <BaseDialog
            isOpen={isOpen}
            onClose={() => !isRemoving && onClose()}
            maxWidth="xs"
        >
            <DialogHeader
                title="Konfirmasi Keluarkan Siswa"
                onClose={() => !isRemoving && onClose()}
            />
            <DialogBody>
                <Box sx={{ textAlign: "center", py: 2 }}>
                    <Avatar
                        sx={{
                            width: 56,
                            height: 56,
                            bgcolor: "rgba(239, 68, 68, 0.1)",
                            color: "error.main",
                            mx: "auto",
                            mb: 2,
                            border: "1.5px solid",
                            borderColor: "error.light",
                        }}
                    >
                        <PersonRemove sx={{ fontSize: 30 }} />
                    </Avatar>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }} gutterBottom>
                        Keluarkan Siswa dari Kelas?
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Apakah Anda yakin ingin mengeluarkan siswa{" "}
                        <strong>"{studentName}"</strong> dari{" "}
                        <strong>{classNameDisplay}</strong>?
                    </Typography>
                </Box>
            </DialogBody>
            <DialogFooter>
                <Button
                    onClick={onClose}
                    color="inherit"
                    disabled={isRemoving}
                    sx={{ textTransform: "none", borderRadius: "8px" }}
                >
                    Batal
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    onClick={onConfirmRemove}
                    disabled={isRemoving}
                    sx={{ borderRadius: "8px", textTransform: "none", px: 2.5, fontWeight: 600 }}
                >
                    {isRemoving ? "Mengeluarkan..." : "Ya, Keluarkan"}
                </Button>
            </DialogFooter>
        </BaseDialog>
    );
};

export default RemoveStudentConfirmDialog;

