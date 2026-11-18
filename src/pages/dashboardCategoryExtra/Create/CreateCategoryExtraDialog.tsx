import React, { useState } from "react";
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

interface CreateCategoryExtraDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (newRecord?: CategoryExtraResponseModel) => void;
}

export const CreateCategoryExtraDialog: React.FC<CreateCategoryExtraDialogProps> = ({
    isOpen,
    onClose,
    onSuccess,
}) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleReset = () => {
        setName("");
        setDescription("");
        setStatus(true);
        setErrorMsg(null);
        setIsLoading(false);
    };

    const handleClose = () => {
        handleReset();
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setErrorMsg("Nama kategori ekstrakurikuler wajib diisi!");
            return;
        }

        setIsLoading(true);
        setErrorMsg(null);

        const service = new CategoryExtraService();
        await service.create(
            {
                name: name.trim(),
                description: description.trim() || undefined,
                status,
            },
            {
                onSuccess: (data) => {
                    snackbar.success("Kategori ekstrakurikuler berhasil ditambahkan!");
                    handleClose();
                    onSuccess(data);
                },
                onError: (err) => {
                    setErrorMsg(err || "Gagal menambahkan kategori ekstra");
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
            <DialogHeader title="Tambah Kategori Ekstrakurikuler" onClose={handleClose} />
            <form onSubmit={handleSubmit}>
                <DialogBody>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, py: 1 }}>
                        {errorMsg && (
                            <Alert severity="error" onClose={() => setErrorMsg(null)}>
                                {errorMsg}
                            </Alert>
                        )}

                        <TextField
                            label="Nama Kategori Ekstra *"
                            placeholder="Contoh: Pramuka, PMR, Paskibra, Tari, Futsal"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            fullWidth
                            size="small"
                            required
                            autoFocus
                        />

                        <TextField
                            label="Deskripsi Kegiatan (Opsional)"
                            placeholder="Deskripsi singkat kegiatan ekstrakurikuler..."
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
                            helperText="Status non-aktif otomatis disembunyikan dari pilihan jadwal pelajaran"
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
                        Simpan Kategori
                    </Button>
                </DialogFooter>
            </form>
        </BaseDialog>
    );
};

export default CreateCategoryExtraDialog;
