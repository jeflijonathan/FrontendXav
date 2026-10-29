import React from "react";
import { Box, Typography, Chip, Avatar, Button, CircularProgress } from "@mui/material";
import { SwapHoriz } from "@mui/icons-material";
import { BaseDialog, DialogHeader, DialogBody, DialogFooter } from "@components/Dialog";
import type { StudentInClassModel } from "@api/class/model";
import { formatStudentFullName } from "../utils/manageStudentsHelper";

interface TransferConfirmDialogProps {
    isOpen: boolean;
    conflicts: StudentInClassModel[];
    classNameDisplay: string;
    isSubmitting: boolean;
    onClose: () => void;
    onConfirmTransfer: () => void;
}

export const TransferConfirmDialog: React.FC<TransferConfirmDialogProps> = ({
    isOpen,
    conflicts,
    classNameDisplay,
    isSubmitting,
    onClose,
    onConfirmTransfer,
}) => {
    return (
        <BaseDialog
            isOpen={isOpen}
            onClose={() => !isSubmitting && onClose()}
            maxWidth="sm"
        >
            <DialogHeader
                title="Konfirmasi Pemindahan Kelas"
                onClose={() => !isSubmitting && onClose()}
            />
            <DialogBody>
                <Box sx={{ textAlign: "center", py: 1.5 }}>
                    <Avatar
                        sx={{
                            width: 56,
                            height: 56,
                            bgcolor: "warning.lighter",
                            color: "warning.main",
                            mx: "auto",
                            mb: 2,
                            border: "1.5px solid",
                            borderColor: "warning.light",
                        }}
                    >
                        <SwapHoriz sx={{ fontSize: 32 }} />
                    </Avatar>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }} gutterBottom>
                        Pindahkan Peserta Didik ke Kelas Ini?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        1 peserta didik hanya diizinkan terdaftar di{" "}
                        <strong>1 kelas pada periode yang sama</strong>.
                        Peserta didik berikut saat ini telah terdaftar di kelas lain pada periode yang sama:
                    </Typography>

                    {/* List Siswa yang Konflik */}
                    <Box
                        sx={{
                            p: 1.5,
                            borderRadius: 2,
                            border: 1,
                            borderColor: "warning.light",
                            bgcolor: "rgba(245, 158, 11, 0.06)",
                            textAlign: "left",
                            maxHeight: 150,
                            overflowY: "auto",
                            mb: 2,
                        }}
                    >
                        {conflicts.map((s) => {
                            const fullName = formatStudentFullName(s);
                            const classLabel = `Terdaftar di: ${s.current_class?.name || "Kelas Lain"}${
                                s.current_class?.periode ? ` (${s.current_class.periode})` : ""
                            }`;

                            return (
                                <Box
                                    key={s.id}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        py: 0.5,
                                    }}
                                >
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        • {fullName}
                                    </Typography>
                                    <Chip
                                        label={classLabel}
                                        size="small"
                                        color="warning"
                                        variant="filled"
                                        sx={{ fontSize: "0.75rem", fontWeight: 600 }}
                                    />
                                </Box>
                            );
                        })}
                    </Box>

                    <Typography variant="body2" color="text.secondary">
                        Jika dipindahkan, peserta didik akan{" "}
                        <strong>otomatis dikeluarkan dari kelas lamanya pada periode ini</strong> dan
                        dimasukkan ke <strong>{classNameDisplay}</strong>. (Data kelas pada periode
                        berbeda tetap dipertahankan).
                    </Typography>
                </Box>
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
                    onClick={onConfirmTransfer}
                    disabled={isSubmitting}
                    startIcon={
                        isSubmitting ? (
                            <CircularProgress size={16} color="inherit" />
                        ) : (
                            <SwapHoriz />
                        )
                    }
                    sx={{ borderRadius: "8px", textTransform: "none", px: 3, fontWeight: 600 }}
                >
                    {isSubmitting ? "Memindahkan..." : "Ya, Pindahkan Siswa"}
                </Button>
            </DialogFooter>
        </BaseDialog>
    );
};

export default TransferConfirmDialog;

