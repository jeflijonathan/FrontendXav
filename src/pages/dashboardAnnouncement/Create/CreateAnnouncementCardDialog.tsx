import React from "react";
import { Box, TextField, Typography, MenuItem } from "@mui/material";
import { BaseDialog, DialogHeader, DialogBody } from "@components/Dialog";
import CreateAnnouncementFooterDialog from "./CreateAnnouncementFooterDialog";
import useAnnouncementCreate from "./hooks/useAnnouncementCreate";
import GoogleDrivePreview from "@components/GoogleDrivePreview/GoogleDrivePreview";
import WordDescriptionEditor from "@components/WordEditor/WordDescriptionEditor";
import { useForm, Controller } from "react-hook-form";
import {
    CreateAnnouncementReqDefaultValues,
    CreateAnnouncementValidations,
    type AnnouncementFormValues,
} from "./utils/createAnnouncementForm";

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

const CreateAnnouncementCardDialog: React.FC<Props> = ({ isOpen, onClose }) => {
    const { createAnnouncement, isLoading } = useAnnouncementCreate();

    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<AnnouncementFormValues>({
        resolver: CreateAnnouncementValidations,
        defaultValues: CreateAnnouncementReqDefaultValues,
        mode: "onTouched",
    });

    const watchedUrlDrive = watch("url_drive");

    const handleFormSubmit = (data: AnnouncementFormValues) => {
        createAnnouncement(data, () => {
            reset(CreateAnnouncementReqDefaultValues);
            onClose();
        });
    };

    const handleClose = () => {
        reset(CreateAnnouncementReqDefaultValues);
        onClose();
    };

    return (
        <BaseDialog isOpen={isOpen} onClose={handleClose} maxWidth="md">
            <DialogHeader
                title="Buat Pengumuman Baru"
                description="Isi informasi pengumuman sekolah dan sertakan link dokumen Google Drive jika ada."
                onClose={handleClose}
            />
            <DialogBody>
                <Box
                    component="form"
                    id="create-announcement-form"
                    onSubmit={handleSubmit(handleFormSubmit)}
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
                                placeholder="Contoh: Jadwal Ujian Akhir Semester Ganjil 2026/2027"
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
                                placeholder="Tuliskan isi detail pengumuman dengan tool Word..."
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
                                label="URL Dokumen Google Drive (Opsional)"
                                variant="outlined"
                                fullWidth
                                placeholder="https://drive.google.com/file/d/.../view atau https://docs.google.com/document/d/..."
                                error={Boolean(errors.url_drive)}
                                helperText={
                                    errors.url_drive?.message ||
                                    "Tempelkan link file, dokumen docs, sheet, slide, atau folder Google Drive."
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
                                LIVE REVIEW DOKUMEN GOOGLE DRIVE:
                            </Typography>
                            <GoogleDrivePreview
                                url={watchedUrlDrive}
                                height={260}
                                title="Review Dokumen Sebelum Disimpan"
                            />
                        </Box>
                    )}
                </Box>
            </DialogBody>
            <CreateAnnouncementFooterDialog
                onClose={handleClose}
                onSubmit={handleSubmit(handleFormSubmit)}
                isLoading={isLoading}
            />
        </BaseDialog>
    );
};

export default CreateAnnouncementCardDialog;
