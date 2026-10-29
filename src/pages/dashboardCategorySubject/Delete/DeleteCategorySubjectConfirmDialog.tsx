/**
 * DeleteCategorySubjectConfirmDialog — Representation Logic
 *
 * BaseDialog confirmation for deleting a category subject.
 * Replaces window.confirm with a beautiful, themed dialog.
 *
 * Layer: Representation Logic
 */
import { Button, Typography, Box } from "@mui/material";
import { WarningAmber } from "@mui/icons-material";
import { BaseDialog, DialogHeader, DialogBody, DialogFooter } from "@components/Dialog";
import useDeleteCategorySubject from "./hook/useDeleteCategorySubject";
import type { CategorySubjectResponseModel } from "@api/categorysubject/model";

interface Props {
    target: CategorySubjectResponseModel | null;
    isOpen: boolean;
    onClose: () => void;
    onDeleted: () => void;
}

const DeleteCategorySubjectConfirmDialog = ({
    target,
    isOpen,
    onClose,
    onDeleted,
}: Props) => {
    const { handleDelete, isLoading } = useDeleteCategorySubject();

    if (!target) return null;

    const targetId = target.id || target.id_category_subject || "";

    const handleConfirm = () => {
        handleDelete(targetId, () => {
            onDeleted();
            onClose();
        });
    };

    return (
        <BaseDialog isOpen={isOpen} onClose={onClose} maxWidth="xs">
            <DialogHeader title="Hapus Kategori Mata Pelajaran" onClose={onClose} />
            <DialogBody>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", py: 2 }}>
                    <Box
                        sx={{
                            width: 60,
                            height: 60,
                            borderRadius: "50%",
                            bgcolor: "error.light",
                            color: "error.main",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 2,
                            opacity: 0.9,
                        }}
                    >
                        <WarningAmber sx={{ fontSize: 36 }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                        Konfirmasi Hapus
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Apakah Anda yakin ingin menghapus kategori{" "}
                        <strong className="text-primary-txt">"{target.name}"</strong>?
                    </Typography>
                    <Typography variant="caption" color="error.main" sx={{ mt: 1 }}>
                        Tindakan ini tidak dapat dibatalkan.
                    </Typography>
                </Box>
            </DialogBody>
            <DialogFooter>
                <Button
                    variant="outlined"
                    onClick={onClose}
                    disabled={isLoading}
                    sx={{ borderRadius: "8px", textTransform: "none" }}
                >
                    Batal
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    onClick={handleConfirm}
                    loading={isLoading}
                    sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 600 }}
                >
                    Ya, Hapus Kategori
                </Button>
            </DialogFooter>
        </BaseDialog>
    );
};

export default DeleteCategorySubjectConfirmDialog;

