import { Box, Typography, Button, DialogActions, Divider, List, ListItem, ListItemIcon, ListItemText, Paper, Chip } from "@mui/material";
import { BaseDialog, DialogBody, DialogHeader } from "@components/Dialog";
import HistoryIcon from '@mui/icons-material/History';
import EditIcon from '@mui/icons-material/Edit';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    announcementId: string | null;
};

const mockLogs = [
    { id: 1, action: "created", user_name: "Admin Sekolah", created_at: "2023-10-01 10:00" },
    { id: 2, action: "updated", user_name: "Kepala Sekolah", created_at: "2023-10-02 14:30" },
];

const DetailAnnouncementCardDialog = ({ isOpen, onClose, announcementId }: Props) => {
    return (
        <BaseDialog
            isOpen={isOpen}
            onClose={onClose}
        >
            <DialogHeader title="Detail Pengumuman" />
            <DialogBody

            >

            </DialogBody>
            <Box sx={{ p: 3, minWidth: 500, maxWidth: 600 }}>
                <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>
                    Detail Pengumuman
                </Typography>

                <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
                    <Typography variant="subtitle2" color="text.secondary">Judul</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>Informasi Ujian Semester</Typography>

                    <Typography variant="subtitle2" color="text.secondary">Deskripsi</Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Ujian akan dilaksanakan mulai tanggal 15 Oktober. Harap semua siswa bersiap.
                    </Typography>

                    <Typography variant="subtitle2" color="text.secondary">URL Drive</Typography>
                    <Typography variant="body2" color="primary" sx={{ wordBreak: 'break-all' }}>
                        https://drive.google.com/file/d/example
                    </Typography>
                </Paper>

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <HistoryIcon color="action" />
                    <Typography variant="h6">Log Perubahan</Typography>
                </Box>

                <List sx={{ bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                    {mockLogs.map((log, index) => (
                        <ListItem key={log.id} divider={index !== mockLogs.length - 1}>
                            <ListItemIcon>
                                {log.action === 'created' ? (
                                    <AddCircleOutlineIcon color="success" />
                                ) : (
                                    <EditIcon color="info" />
                                )}
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="body2" fontWeight="bold">
                                            {log.user_name}
                                        </Typography>
                                        <Chip
                                            label={log.action === 'created' ? 'Membuat' : 'Mengubah'}
                                            size="small"
                                            color={log.action === 'created' ? 'success' : 'info'}
                                            variant="outlined"
                                            sx={{ height: 20, fontSize: '0.7rem' }}
                                        />
                                    </Box>
                                }
                                secondary={log.created_at}
                            />
                        </ListItem>
                    ))}
                </List>
            </Box>

            <DialogActions sx={{ p: 2, pt: 0 }}>
                <Button onClick={onClose} variant="contained" color="inherit">Tutup</Button>
            </DialogActions>
        </BaseDialog>
    );
};

export default DetailAnnouncementCardDialog;
