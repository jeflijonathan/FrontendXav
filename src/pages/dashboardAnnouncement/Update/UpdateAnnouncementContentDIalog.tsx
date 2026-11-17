import React, { useEffect } from "react";
import { DialogBody } from "@components/Dialog";
import { Box, CircularProgress, TextField, Typography, MenuItem } from "@mui/material";
import { useFormContext, Controller } from "react-hook-form";
import useDashboardAnnouncementStore from "../store";
import GoogleDrivePreview from "@components/GoogleDrivePreview/GoogleDrivePreview";
import WordDescriptionEditor from "@components/WordEditor/WordDescriptionEditor";
import useAnnouncementUpdate from "./hooks/useAnnouncementUpdate";
import type { UpdateAnnouncementFormValues } from "./utils/updateAnnouncementForm";

type Props = {
    announcementId: string | null;
    isOpen: boolean;
};

const UpdateAnnouncementContentDialog: React.FC<Props> = ({
    announcementId,
    isOpen,
}) => {
    const { state } = useDashboardAnnouncementStore();
    const { updateAnnouncementReqDetails } = state;
    const { fetchAnnouncementById, isLoading } = useAnnouncementUpdate();

    const {
        control,
        watch,
        formState: { errors },
    } = useFormContext<UpdateAnnouncementFormValues>();

    useEffect(() => {
        if (isOpen && announcementId) {
            fetchAnnouncementById(announcementId);
        }
    }, [isOpen, announcementId]);

    const watchedUrlDrive = watch("url_drive");

    if (isLoading && !updateAnnouncementReqDetails) {
        return (
            <DialogBody>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        py: 8,
                        gap: 1.5,
                        alignItems: "center",
                    }}
                >
                    <CircularProgress size={30} />
                    <Typography variant="body2" color="text.secondary">
                        Memuat data pengumuman...
                    </Typography>
                </Box>
            </DialogBody>
        );
    }

    return (
        <DialogBody>
            <Box
                sx={{
                    py: 1,
                    px: { xs: 0.5, sm: 1 },
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2.5,
                    overflowX: "hidden",
                }}
            >
                <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Judul Pengumuman"
                            variant="outlined"
                            fullWidth
                            required
                            error={Boolean(errors.title)}
                            helperText={errors.title?.message}
                        />
                    )}
                />

                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <WordDescriptionEditor
                            value={field.value}
                            onChange={field.onChange}
                            label="Deskripsi / Isi Pengumuman"
                            rows={5}
                            required
                            placeholder="Tuliskan isi pengumuman secara rinci dengan tool Word..."
                            error={Boolean(errors.description)}
                            helperText={errors.description?.message}
                        />
                    )}
                />

                <Controller
                    name="url_drive"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="URL Dokumen Google Drive"
                            variant="outlined"
                            fullWidth
                            placeholder="https://drive.google.com/file/d/.../view atau https://docs.google.com/document/d/..."
                            error={Boolean(errors.url_drive)}
                            helperText={
                                errors.url_drive?.message ||
                                "Masukkan link dokumen baru atau ubah dokumen yang sudah ada."
                            }
                        />
                    )}
                />

                <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            select
                            label="Status Pengumuman"
                            variant="outlined"
                            fullWidth
                            helperText="Draft = belum tampil di Dashboard, Published = tampil di Dashboard"
                        >
                            <MenuItem value={0}>Draft</MenuItem>
                            <MenuItem value={1}>Published (Aktif)</MenuItem>
                            <MenuItem value={2}>Archived (Arsip)</MenuItem>
                        </TextField>
                    )}
                />

                {/* Live Review Google Drive Document Preview */}
                {watchedUrlDrive && watchedUrlDrive.trim() !== "" && (
                    <Box sx={{ mt: 1 }}>
                        <Typography
                            variant="caption"
                            sx={{ fontWeight: 700, color: "#1e293b", mb: 1, display: "block" }}
                        >
                            REVIEW DOKUMEN GOOGLE DRIVE:
                        </Typography>
                        <GoogleDrivePreview
                            url={watchedUrlDrive}
                            height={280}
                            title="Pratinjau Dokumen Google Drive"
                        />
                    </Box>
                )}
            </Box>
        </DialogBody>
    );
};

export default UpdateAnnouncementContentDialog;
