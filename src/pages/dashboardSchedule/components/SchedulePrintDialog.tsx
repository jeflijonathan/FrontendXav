import React from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PrintIcon from '@mui/icons-material/Print';
import { useScheduleStore } from '../store/useScheduleStore';

const SchedulePrintDialog: React.FC = () => {
    const {
        isPrintDialogOpen,
        setPrintDialogOpen,
        rows,
        classes,
        teachers,
        guruPiket,
    } = useScheduleStore();

    const handlePrint = () => {
        window.print();
    };

    return (
        <Dialog
            open={isPrintDialogOpen}
            onClose={() => setPrintDialogOpen(false)}
            maxWidth="xl"
            fullWidth
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    bgcolor: '#1e293b',
                    color: '#ffffff',
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Pratinjau Format Cetak Resmi (Sesuai Lampiran Dokumen)
                </Typography>
                <IconButton
                    onClick={() => setPrintDialogOpen(false)}
                    sx={{ color: '#ffffff' }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f8fafc' }}>
                {/* Printable Document Sheet */}
                <Box
                    id="printable-schedule-sheet"
                    sx={{
                        bgcolor: '#ffffff',
                        p: 4,
                        borderRadius: 2,
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                        border: '1px solid #e2e8f0',
                        maxWidth: 1200,
                        mx: 'auto',
                        color: '#000000',
                        '@media print': {
                            boxShadow: 'none',
                            p: 0,
                            m: 0,
                            border: 'none',
                        },
                    }}
                >
                    {/* Header Document */}
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 900,
                                letterSpacing: 0.5,
                                fontSize: '18px',
                                textTransform: 'uppercase',
                            }}
                        >
                            JADWAL PELAJARAN SEMESTER GANJIL
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontWeight: 800,
                                fontSize: '15px',
                                textTransform: 'uppercase',
                            }}
                        >
                            SMK XAVERIUS PALEMBANG, TAHUN PELAJARAN 2026 - 2027
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                display: 'block',
                                textAlign: 'right',
                                fontWeight: 700,
                                mt: -2,
                                fontSize: '11px',
                                fontStyle: 'italic',
                            }}
                        >
                            Lampiran 3 Nomor : 1003/SMK.XAV/VII/2026
                        </Typography>
                    </Box>

                    {/* Table Matrix */}
                    <table
                        style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            fontSize: '10.5px',
                            textAlign: 'center',
                        }}
                    >
                        <thead>
                            <tr style={{ backgroundColor: '#f1f5f9' }}>
                                <th
                                    rowSpan={2}
                                    style={{
                                        border: '1px solid #000',
                                        padding: '4px',
                                        width: '60px',
                                    }}
                                >
                                    HARI
                                </th>
                                <th
                                    rowSpan={2}
                                    style={{
                                        border: '1px solid #000',
                                        padding: '4px',
                                        width: '40px',
                                    }}
                                >
                                    JAM KE
                                </th>
                                <th
                                    rowSpan={2}
                                    style={{
                                        border: '1px solid #000',
                                        padding: '4px',
                                        width: '90px',
                                    }}
                                >
                                    WAKTU
                                </th>
                                <th
                                    colSpan={classes.length}
                                    style={{
                                        border: '1px solid #000',
                                        padding: '4px',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    KELAS
                                </th>
                            </tr>
                            <tr style={{ backgroundColor: '#f8fafc' }}>
                                {classes.map((cls) => (
                                    <th
                                        key={cls.name}
                                        style={{
                                            border: '1px solid #000',
                                            padding: '4px',
                                            fontWeight: 'bold',
                                            fontSize: '9.5px',
                                        }}
                                    >
                                        {cls.name}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, index) => {
                                const isNewDay =
                                    index === 0 || rows[index - 1].day !== row.day;
                                const sameDayCount = rows.filter(
                                    (r) => r.day === row.day
                                ).length;

                                return (
                                    <tr key={row.id}>
                                        {isNewDay && (
                                            <td
                                                rowSpan={sameDayCount}
                                                style={{
                                                    border: '1px solid #000',
                                                    fontWeight: 'bold',
                                                    verticalAlign: 'middle',
                                                    letterSpacing: '1px',
                                                    fontSize: '11px',
                                                }}
                                            >
                                                {row.day.toUpperCase()}
                                            </td>
                                        )}
                                        <td style={{ border: '1px solid #000', padding: '3px', fontWeight: 'bold' }}>
                                            {row.jp}
                                        </td>
                                        <td style={{ border: '1px solid #000', padding: '3px', fontSize: '9.5px' }}>
                                            {row.timeRange}
                                        </td>

                                        {row.specialActivity ? (
                                            <td
                                                colSpan={classes.length}
                                                style={{
                                                    border: '1px solid #000',
                                                    fontWeight: 'bold',
                                                    letterSpacing: '1px',
                                                    padding: '4px',
                                                    backgroundColor: '#f1f5f9',
                                                    fontSize: '10px',
                                                }}
                                            >
                                                {row.specialActivity.title}
                                            </td>
                                        ) : (
                                            classes.map((cls) => {
                                                const cell = row.classCells[cls.name];
                                                return (
                                                    <td
                                                        key={cls.name}
                                                        style={{
                                                            border: '1px solid #000',
                                                            padding: '2px',
                                                            fontWeight: 'bold',
                                                            fontSize: '11px',
                                                        }}
                                                    >
                                                        {cell?.teacherCode || ''}
                                                    </td>
                                                );
                                            })
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {/* Bottom Tables: Kode Guru & Guru Piket */}
                    <Grid container spacing={3} sx={{ mt: 3 }}>
                        {/* Kode Guru */}
                        <Grid size={{ xs: 12, md: 8 }}>
                            <Box sx={{ border: '1px solid #000', p: 1.5 }}>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        fontWeight: 900,
                                        display: 'block',
                                        textAlign: 'center',
                                        mb: 1,
                                        borderBottom: '1px solid #000',
                                        pb: 0.5,
                                    }}
                                >
                                    KODE & NAMA GURU
                                </Typography>
                                <Grid container spacing={1}>
                                    <Grid size={{ xs: 6 }}>
                                        {teachers.slice(0, 13).map((t) => (
                                            <Typography
                                                key={t.code}
                                                variant="caption"
                                                sx={{ display: 'block', fontSize: '10px', lineHeight: 1.4 }}
                                            >
                                                <b>{t.code}.</b> {t.name}
                                            </Typography>
                                        ))}
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        {teachers.slice(13).map((t) => (
                                            <Typography
                                                key={t.code}
                                                variant="caption"
                                                sx={{ display: 'block', fontSize: '10px', lineHeight: 1.4 }}
                                            >
                                                <b>{t.code}.</b> {t.name}
                                            </Typography>
                                        ))}
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>

                        {/* Guru Piket & Tanda Tangan */}
                        <Grid size={{ xs: 12, md: 4 }}>
                            {/* Guru Piket Table */}
                            <Box sx={{ border: '1px solid #000', p: 1, mb: 2 }}>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        fontWeight: 900,
                                        display: 'block',
                                        textAlign: 'center',
                                        mb: 0.5,
                                        borderBottom: '1px solid #000',
                                        pb: 0.5,
                                    }}
                                >
                                    DAFTAR GURU PIKET
                                </Typography>
                                {guruPiket.map((p, idx) => (
                                    <Typography
                                        key={idx}
                                        variant="caption"
                                        sx={{ display: 'block', fontSize: '10px', lineHeight: 1.3 }}
                                    >
                                        {p.name}
                                    </Typography>
                                ))}
                            </Box>

                            {/* Kepala Sekolah */}
                            <Box sx={{ textAlign: 'center', mt: 2 }}>
                                <Typography variant="caption" sx={{ display: 'block', fontSize: '10px' }}>
                                    Palembang, 10 Juli 2026
                                </Typography>
                                <Typography variant="caption" sx={{ fontWeight: 800, display: 'block', mb: 5, fontSize: '10.5px' }}>
                                    Kepala Sekolah
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        fontWeight: 900,
                                        textDecoration: 'underline',
                                        display: 'block',
                                        fontSize: '11px',
                                    }}
                                >
                                    Merly Puspita, S.Pd.
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2, bgcolor: '#f1f5f9' }}>
                <Button
                    onClick={() => setPrintDialogOpen(false)}
                    sx={{ textTransform: 'none', color: '#64748b' }}
                >
                    Tutup Pratinjau
                </Button>
                <Button
                    variant="contained"
                    startIcon={<PrintIcon />}
                    onClick={handlePrint}
                    sx={{
                        bgcolor: '#1e293b',
                        textTransform: 'none',
                        fontWeight: 700,
                        borderRadius: 2,
                        '&:hover': { bgcolor: '#0f172a' },
                    }}
                >
                    Cetak Dokumen (Print / PDF)
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SchedulePrintDialog;

