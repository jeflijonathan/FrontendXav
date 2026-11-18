import React from "react";
import {
    Button,
    Box,
    Typography,
    Chip,
    Grid,
    Divider,
} from "@mui/material";
import { BaseDialog, DialogHeader, DialogBody, DialogFooter } from "@components/Dialog";
import type { CategoryExtraResponseModel } from "@api/schedule/service";

interface DetailCategoryExtraDialogProps {
    data: CategoryExtraResponseModel | null;
    isOpen: boolean;
    onClose: () => void;
}

export const DetailCategoryExtraDialog: React.FC<DetailCategoryExtraDialogProps> = ({
    data,
    isOpen,
    onClose,
}) => {
    if (!data) return null;

    const formatDate = (dateStr?: string | null) => {
        if (!dateStr) return "-";
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <BaseDialog isOpen={isOpen} onClose={onClose} maxWidth="sm">
            <DialogHeader title="Detail Kategori Ekstrakurikuler" onClose={onClose} />
            <DialogBody>
                <Box sx={{ py: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Status Kategori
                        </Typography>
                        <Chip
                            label={data.status ? "Aktif (Tampil di Jadwal)" : "Non Aktif (Disembunyikan)"}
                            color={data.status ? "success" : "error"}
                            size="small"
                            sx={{ fontWeight: 700 }}
                        />
                    </Box>

                    <Divider />

                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                                ID Kategori (UUID)
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontFamily: "monospace",
                                    bgcolor: "action.hover",
                                    p: 1,
                                    borderRadius: 1,
                                    wordBreak: "break-all",
                                }}
                            >
                                {data.id_category_extra || data.id || "-"}
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                                Nama Kategori Ekstrakurikuler
                            </Typography>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                {data.name}
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                                Deskripsi Kegiatan
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {data.description || "Tidak ada deskripsi tambahan"}
                            </Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                                Dibuat Pada
                            </Typography>
                            <Typography variant="body2">
                                {formatDate(data.created_at)}
                            </Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                                Terakhir Diperbarui
                            </Typography>
                            <Typography variant="body2">
                                {formatDate(data.updated_at)}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </DialogBody>
            <DialogFooter>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onClose}
                    sx={{ borderRadius: "8px", textTransform: "none", px: 3 }}
                >
                    Tutup
                </Button>
            </DialogFooter>
        </BaseDialog>
    );
};

export default DetailCategoryExtraDialog;
