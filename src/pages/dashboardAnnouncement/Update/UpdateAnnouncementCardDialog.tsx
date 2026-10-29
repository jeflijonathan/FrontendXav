import { Box, TextField, Typography, Button, DialogActions } from "@mui/material";
import { BaseDialog } from "@components/Dialog";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    announcementId: string | null;
};

const UpdateAnnouncementCardDialog = ({ isOpen, onClose, announcementId }: Props) => {
    return (
        <BaseDialog
            isOpen={isOpen}
            onClose={onClose}
        >
            <Box sx={{ p: 3, minWidth: 400 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Edit Pengumuman</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* Placeholder inputs, you can replace with react-hook-form or state */}
                    <TextField 
                        label="Judul" 
                        variant="outlined" 
                        fullWidth 
                        required 
                        defaultValue="Informasi Contoh" // Fetch by announcementId
                    />
                    <TextField 
                        label="Deskripsi" 
                        variant="outlined" 
                        multiline 
                        rows={4} 
                        fullWidth 
                        defaultValue="Deskripsi pengumuman..."
                    />
                    <TextField 
                        label="URL Drive (Opsional)" 
                        variant="outlined" 
                        fullWidth 
                    />
                </Box>
            </Box>
            <DialogActions sx={{ p: 2, pt: 0 }}>
                <Button onClick={onClose} color="inherit">Batal</Button>
                <Button onClick={onClose} variant="contained" color="primary">Simpan Perubahan</Button>
            </DialogActions>
        </BaseDialog>
    );
};

export default UpdateAnnouncementCardDialog;
