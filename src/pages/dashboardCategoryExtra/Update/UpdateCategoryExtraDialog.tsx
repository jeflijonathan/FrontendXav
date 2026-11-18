import React, { useState, useEffect } from "react";
import {
    Button,
    TextField,
    MenuItem,
    Box,
    Alert,
} from "@mui/material";
import { BaseDialog, DialogHeader, DialogBody, DialogFooter } from "@components/Dialog";
import { CategoryExtraService, type CategoryExtraResponseModel } from "@api/schedule/service";
import { snackbar } from "@utils/snackbar";

interface UpdateCategoryExtraDialogProps {
    data: CategoryExtraResponseModel | null;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (updatedRecord?: CategoryExtraResponseModel) => void;
}

export const UpdateCategoryExtraDialog: React.FC<UpdateCategoryExtraDialogProps> = ({
    data,
    isOpen,
    onClose,
    onSuccess,
}) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        if (data && isOpen) {
            setName(data.name || "");
            setDescription(data.description || "");
            setStatus(data.status !== false);
            setErrorMsg(null);
        }
    }, [data, isOpen]);

    const handleClose = () => {
        setErrorMsg(null);
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!data) return;
        if (!name.trim()) {
            setErrorMsg("Nama kategori ekstrakurikuler wajib diisi!");
            return;
        }

        const id = data.id_category_extra || data.id;
        if (!id) {
            setErrorMsg("ID Kategori tidak valid");
            return;
        }

        setIsLoading(true);
        setErrorMsg(null);

        const service = new CategoryExtraService();
        await service.update(
            id,
            {
                name: name.trim(),
                description: description.trim() || undefined,
                status,
            },
            {
                onSuccess: (resData) => {
                    snackbar.success("Kategori ekstrakurikuler berhasil diperbarui!");
                    handleClose();
                    onSuccess(resData);
                },
                onError: (err: any) => {
                    setErrorMsg(String(err) || "Gagal memperbarui kategori ekstra");
                    setIsLoading(false);
                },
                onFullfilled: () => {
                    setIsLoading(false);
                },
            }
        );
    };

    return (
        <BaseDialog isOpen={isOpen} onClose={handleClose} maxWidth="sm">
            <DialogHeader title="Edit Kategori Ekstrakurikuler" onClose={handleClose} />
            <form onSubmit={handleSubmit}>
                <DialogBody>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, py: 1 }}>
                        {errorMsg && (
                            <Alert severity="error" onClose={() => setErrorMsg(null)}>
                                {errorMsg}
                            </Alert>
                        )}

                        <TextField
                            label="ID Kategori"
                            value={data ? (data.id_category_extra || data.id || "-") : "-"}
                            disabled
                            fullWidth
                            size="small"
                            sx={{ bgcolor: "action.hover", borderRadius: 1 }}
                        />

                        <TextField
                            label="Nama Kategori Ekstra *"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            fullWidth
                            size="small"
                            required
                        />

                        <TextField
                            label="Deskripsi Kegiatan (Opsional)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            fullWidth
                            multiline
                            rows={3}
                            size="small"
                        />

                        <TextField
                            select
                            label="Status Kategori"
                            value={status ? "true" : "false"}
                            onChange={(e) => setStatus(e.target.value === "true")}
                            fullWidth
                            size="small"
                            helperText="Jika non-aktif, kategori tidak akan muncul di opsi jadwal"
                        >
                            <MenuItem value="true">
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "success.main" }} />
                                    <span>Aktif (Tampil di Opsi Jadwal)</span>
                                </Box>
                            </MenuItem>
                            <MenuItem value="false">
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "error.main" }} />
                                    <span>Non-Aktif (Disembunyikan)</span>
                                </Box>
                            </MenuItem>
                        </TextField>
                    </Box>
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="outlined"
                        onClick={handleClose}
                        disabled={isLoading}
                        sx={{ borderRadius: "8px", textTransform: "none" }}
                    >
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        loading={isLoading}
                        sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 600, px: 2.5 }}
                    >
                        Simpan Perubahan
                    </Button>
                </DialogFooter>
            </form>
        </BaseDialog>
    );
};

export default UpdateCategoryExtraDialog;
