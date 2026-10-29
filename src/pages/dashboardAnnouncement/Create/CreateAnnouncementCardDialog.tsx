import { Box, TextField, Typography } from "@mui/material";
import { BaseDialog } from "@components/Dialog";
import CreateAnnouncementFooterDialog from "./CreateAnnouncementFooterDialog";
import { useState } from "react";
import useAnnouncementCreate from "./hooks/useAnnouncementCreate";

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

const CreateAnnouncementCardDialog = ({ isOpen, onClose }: Props) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [urlDrive, setUrlDrive] = useState("");
    const { createAnnouncement, isLoading } = useAnnouncementCreate();

    const handleSubmit = () => {
        // Dummy id_user for now, replace with actual logged in user
        const dummyUserId = "96225b16-6218-4a94-bd57-ebf8cb0f9f30"; 
        createAnnouncement(
            { title, description, url_drive: urlDrive, id_user: dummyUserId },
            () => {
                setTitle("");
                setDescription("");
                setUrlDrive("");
                onClose();
            }
        );
    };

    return (
        <BaseDialog
            isOpen={isOpen}
            onClose={onClose}
        >
            <Box sx={{ p: 3, minWidth: 400 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Buat Pengumuman Baru</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField 
                        label="Judul" 
                        variant="outlined" 
                        fullWidth 
                        required 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <TextField 
                        label="Deskripsi" 
                        variant="outlined" 
                        multiline 
                        rows={4} 
                        fullWidth 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <TextField 
                        label="URL Drive (Opsional)" 
                        variant="outlined" 
                        fullWidth 
                        value={urlDrive}
                        onChange={(e) => setUrlDrive(e.target.value)}
                    />
                </Box>
            </Box>
            <CreateAnnouncementFooterDialog 
                onCancel={onClose} 
                onSubmit={handleSubmit} 
                isLoading={isLoading} 
            />
        </BaseDialog>
    );
};

export default CreateAnnouncementCardDialog;