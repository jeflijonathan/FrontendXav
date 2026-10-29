import { DialogBody } from "@components/Dialog"
import type { AnnouncementTableItem } from "../LIst/utils/listTableMapper";
import { Box, Chip, Divider, List, ListItem, ListItemIcon, ListItemText, Paper, Typography } from "@mui/material";

const DetailAnnouncementCardDialog = (item: AnnouncementTableItem) => {
    return (
        <DialogBody>
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
                    <Typography variant="h6">Log Perubahan</Typography>
                </Box>

                <List sx={{ bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                    {item.mockLogs.map((log, index) => (
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
                                        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
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
        </DialogBody>
    )
}
export default DetailAnnouncementCardDialog;