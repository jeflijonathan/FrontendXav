import React, { useState } from 'react';
import {
    Box,
    Button,
    Card,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import BadgeIcon from '@mui/icons-material/Badge';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { useScheduleStore } from '../store/useScheduleStore';
import type { DragPayload, TeacherCodeEntry } from '../types';

const TeacherCodeTable: React.FC = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const {
        teachers,
        rows,
        updateTeacher,
        addTeacher,
        deleteTeacher,
        setDraggedItem,
    } = useScheduleStore();

    const [editingTeacher, setEditingTeacher] = useState<TeacherCodeEntry | null>(
        null
    );
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newTeacherForm, setNewTeacherForm] = useState({
        name: '',
        subjectName: '',
        subjectCode: '',
        category: 'KEJURUAN' as 'KEJURUAN' | 'UMUM',
        recommendedJp: 'JP 6-8 (Blok Praktik Siang)',
        targetJp: 24,
    });

    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Calculate actual hours scheduled in matrix for each teacher
    const calculateScheduledJp = (teacherCode: number): number => {
        let count = 0;
        rows.forEach((r) => {
            if (r.specialActivity) return;
            Object.values(r.classCells).forEach((cell) => {
                if (cell.teacherCode === teacherCode) {
                    count++;
                }
            });
        });
        return count;
    };

    const handleDragStartTeacher = (
        e: React.DragEvent,
        teacher: TeacherCodeEntry
    ) => {
        const payload: DragPayload = {
            type: 'TEACHER_ITEM',
            teacherCode: teacher.code,
            teacherName: teacher.name,
            subjectName: teacher.subjectName,
        };
        e.dataTransfer.setData('text/plain', JSON.stringify(payload));
        e.dataTransfer.effectAllowed = 'copyMove';
        setDraggedItem(payload);
    };

    const handleSaveEdit = () => {
        if (editingTeacher) {
            updateTeacher(editingTeacher.code, editingTeacher);
            setEditingTeacher(null);
        }
    };

    const handleSaveNew = () => {
        if (!newTeacherForm.name.trim()) return;
        addTeacher({
            teacherId: `t-${Date.now()}`,
            name: newTeacherForm.name,
            subjectName: newTeacherForm.subjectName || 'Mata Pelajaran',
            subjectCode: newTeacherForm.subjectCode || 'MAPEL-01',
            category: newTeacherForm.category,
            recommendedJp: newTeacherForm.recommendedJp,
            totalJpAssigned: 0,
            targetJp: Number(newTeacherForm.targetJp) || 24,
        });
        setIsAddOpen(false);
        setNewTeacherForm({
            name: '',
            subjectName: '',
            subjectCode: '',
            category: 'KEJURUAN',
            recommendedJp: 'JP 6-8 (Blok Praktik Siang)',
            targetJp: 24,
        });
    };

    return (
        <Card
            id="daftar-guru-section"
            elevation={0}
            sx={{
                borderRadius: 3,
                border: isDark ? '1px solid #27272a' : '1px solid #cbd5e1',
                overflow: 'hidden',
                bgcolor: isDark ? '#141416' : '#ffffff',
                mb: 4,
                boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.5)' : '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
            }}
        >
            {/* Header Toolbar */}
            <Box
                sx={{
                    p: 2.5,
                    bgcolor: isDark ? '#18181b' : '#f8fafc',
                    borderBottom: isDark ? '2px solid #27272a' : '2px solid #e2e8f0',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                        sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 2,
                            bgcolor: isDark ? '#1e3a8a' : '#dbeafe',
                            color: isDark ? '#93c5fd' : '#1e40af',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <BadgeIcon fontSize="small" />
                    </Box>
                    <Box>
                        <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 800, color: isDark ? '#f4f4f5' : '#0f172a', letterSpacing: 0.5 }}
                        >
                            KODE & NAMA GURU PENGAJAR (LAMPIRAN RESMI)
                        </Typography>
                        <Typography variant="caption" sx={{ color: isDark ? '#a1a1aa' : '#64748b' }}>
                            Daftar nomor urut kode guru SMK Xaverius Palembang beserta mapel & rekomendasi JP
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<ArrowUpwardIcon />}
                        onClick={handleScrollToTop}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 700,
                            borderRadius: 2,
                            borderColor: '#cbd5e1',
                            color: '#334155',
                            '&:hover': { bgcolor: '#f1f5f9' },
                        }}
                    >
                        ⬆️ Kembali ke Tabel Jadwal
                    </Button>

                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => setIsAddOpen(true)}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 700,
                            borderRadius: 2,
                            bgcolor: '#2563eb',
                            boxShadow: 'none',
                            '&:hover': { bgcolor: '#1d4ed8' },
                        }}
                    >
                        Tambah Guru Baru
                    </Button>
                </Box>
            </Box>

            {/* Table Container */}
            <TableContainer sx={{ maxHeight: 520 }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell
                                sx={{
                                    bgcolor: '#1e293b',
                                    color: '#ffffff',
                                    fontWeight: 800,
                                    width: 80,
                                    textAlign: 'center',
                                }}
                            >
                                KODE
                            </TableCell>
                            <TableCell
                                sx={{
                                    bgcolor: '#1e293b',
                                    color: '#ffffff',
                                    fontWeight: 800,
                                    minWidth: 220,
                                }}
                            >
                                NAMA GURU
                            </TableCell>
                            <TableCell
                                sx={{
                                    bgcolor: '#1e293b',
                                    color: '#ffffff',
                                    fontWeight: 800,
                                    minWidth: 240,
                                }}
                            >
                                MATA PELAJARAN DIKEMPU
                            </TableCell>
                            <TableCell
                                sx={{
                                    bgcolor: '#1e293b',
                                    color: '#ffffff',
                                    fontWeight: 800,
                                    width: 120,
                                    textAlign: 'center',
                                }}
                            >
                                KATEGORI
                            </TableCell>
                            <TableCell
                                sx={{
                                    bgcolor: '#1e293b',
                                    color: '#ffffff',
                                    fontWeight: 800,
                                    minWidth: 200,
                                }}
                            >
                                REKOMENDASI WAKTU (JP)
                            </TableCell>
                            <TableCell
                                sx={{
                                    bgcolor: '#1e293b',
                                    color: '#ffffff',
                                    fontWeight: 800,
                                    width: 140,
                                    textAlign: 'center',
                                }}
                            >
                                JAM TERJADWAL
                            </TableCell>
                            <TableCell
                                sx={{
                                    bgcolor: '#1e293b',
                                    color: '#ffffff',
                                    fontWeight: 800,
                                    width: 90,
                                    textAlign: 'center',
                                }}
                            >
                                AKSI
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {teachers.map((t) => {
                            const scheduled = calculateScheduledJp(t.code);
                            const isFulfilled = scheduled >= t.targetJp;

                            return (
                                <TableRow
                                    key={t.code}
                                    id={`teacher-row-${t.code}`}
                                    sx={{
                                        '&:hover': { bgcolor: isDark ? '#1e1e24' : '#f8fafc' },
                                        transition: 'background-color 0.25s ease',
                                        borderBottom: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
                                    }}
                                >
                                    {/* Draggable Code Badge */}
                                    <TableCell sx={{ textAlign: 'center', borderBottom: isDark ? '1px solid #27272a' : undefined }}>
                                        <Tooltip title="Tarik nomor ini ke sel tabel jadwal di atas">
                                            <Chip
                                                draggable
                                                onDragStart={(e) => handleDragStartTeacher(e, t)}
                                                icon={<DragIndicatorIcon sx={{ fontSize: '14px !important' }} />}
                                                label={t.code}
                                                size="small"
                                                sx={{
                                                    fontWeight: 900,
                                                    fontSize: '13px',
                                                    cursor: 'grab',
                                                    bgcolor:
                                                        t.category === 'KEJURUAN'
                                                            ? (isDark ? 'rgba(234, 88, 12, 0.25)' : '#ffedd5')
                                                            : (isDark ? 'rgba(37, 99, 235, 0.25)' : '#dbeafe'),
                                                    color:
                                                        t.category === 'KEJURUAN'
                                                            ? (isDark ? '#fb923c' : '#c2410c')
                                                            : (isDark ? '#93c5fd' : '#1e40af'),
                                                    border: `1px solid ${
                                                        t.category === 'KEJURUAN'
                                                            ? (isDark ? 'rgba(234, 88, 12, 0.5)' : '#fed7aa')
                                                            : (isDark ? 'rgba(37, 99, 235, 0.5)' : '#bfdbfe')
                                                    }`,
                                                    '&:hover': {
                                                        transform: 'scale(1.1)',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                    },
                                                }}
                                            />
                                        </Tooltip>
                                    </TableCell>

                                    {/* Name */}
                                    <TableCell sx={{ fontWeight: 700, color: isDark ? '#f4f4f5' : '#0f172a', borderBottom: isDark ? '1px solid #27272a' : undefined }}>
                                        {t.name}
                                    </TableCell>

                                    {/* Subject */}
                                    <TableCell sx={{ borderBottom: isDark ? '1px solid #27272a' : undefined }}>
                                        <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#f4f4f5' : '#1e293b' }}>
                                            {t.subjectName}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: isDark ? '#a1a1aa' : '#64748b' }}>
                                            Kode: {t.subjectCode}
                                        </Typography>
                                    </TableCell>

                                    {/* Category */}
                                    <TableCell sx={{ textAlign: 'center', borderBottom: isDark ? '1px solid #27272a' : undefined }}>
                                        <Chip
                                            label={t.category}
                                            size="small"
                                            sx={{
                                                fontSize: '10px',
                                                fontWeight: 800,
                                                bgcolor:
                                                    t.category === 'KEJURUAN'
                                                        ? (isDark ? 'rgba(217, 119, 6, 0.25)' : '#fef3c7')
                                                        : (isDark ? 'rgba(2, 132, 199, 0.25)' : '#e0f2fe'),
                                                color:
                                                    t.category === 'KEJURUAN'
                                                        ? (isDark ? '#fcd34d' : '#92400e')
                                                        : (isDark ? '#7dd3fc' : '#0369a1'),
                                            }}
                                        />
                                    </TableCell>

                                    {/* Recommended JP */}
                                    <TableCell sx={{ borderBottom: isDark ? '1px solid #27272a' : undefined }}>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                fontWeight: 700,
                                                color:
                                                    t.category === 'KEJURUAN'
                                                        ? (isDark ? '#fbbf24' : '#b45309')
                                                        : (isDark ? '#38bdf8' : '#0284c7'),
                                                display: 'block',
                                            }}
                                        >
                                            💡 {t.recommendedJp}
                                        </Typography>
                                    </TableCell>

                                    {/* Scheduled hours vs Target */}
                                    <TableCell sx={{ textAlign: 'center', borderBottom: isDark ? '1px solid #27272a' : undefined }}>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontWeight: 800,
                                                color: isFulfilled
                                                    ? (isDark ? '#4ade80' : '#15803d')
                                                    : (isDark ? '#38bdf8' : '#0284c7'),
                                            }}
                                        >
                                            {scheduled} / {t.targetJp} JP
                                        </Typography>
                                    </TableCell>

                                    {/* Actions */}
                                    <TableCell sx={{ textAlign: 'center', borderBottom: isDark ? '1px solid #27272a' : undefined }}>
                                        <Tooltip title="Edit data guru">
                                            <IconButton
                                                size="small"
                                                onClick={() => setEditingTeacher(t)}
                                                sx={{ color: isDark ? '#a1a1aa' : '#64748b', '&:hover': { color: '#2563eb' } }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Hapus guru">
                                            <IconButton
                                                size="small"
                                                onClick={() => deleteTeacher(t.code)}
                                                sx={{ color: isDark ? '#71717a' : '#94a3b8', '&:hover': { color: '#ef4444' } }}
                                            >
                                                <DeleteOutlineIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Edit Teacher Dialog */}
            <Dialog
                open={Boolean(editingTeacher)}
                onClose={() => setEditingTeacher(null)}
                maxWidth="sm"
                fullWidth
                slotProps={{
                    paper: {
                        sx: {
                            bgcolor: isDark ? '#18181b' : '#ffffff',
                            color: isDark ? '#f4f4f5' : '#0f172a',
                            border: isDark ? '1px solid #27272a' : undefined,
                            borderRadius: 3,
                        },
                    },
                }}
            >
                <DialogTitle sx={{ fontWeight: 800, color: isDark ? '#f4f4f5' : '#0f172a' }}>
                    Edit Nomor & Data Guru #{editingTeacher?.code}
                </DialogTitle>
                <DialogContent>
                    {editingTeacher && (
                        <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Nomor Urut Kode Guru"
                                type="number"
                                fullWidth
                                size="small"
                                value={editingTeacher.code}
                                onChange={(e) =>
                                    setEditingTeacher({
                                        ...editingTeacher,
                                        code: Number(e.target.value),
                                    })
                                }
                            />
                            <TextField
                                label="Nama Lengkap Guru Beserta Gelar"
                                fullWidth
                                size="small"
                                value={editingTeacher.name}
                                onChange={(e) =>
                                    setEditingTeacher({
                                        ...editingTeacher,
                                        name: e.target.value,
                                    })
                                }
                            />
                            <TextField
                                label="Mata Pelajaran yang Diampu"
                                fullWidth
                                size="small"
                                value={editingTeacher.subjectName}
                                onChange={(e) =>
                                    setEditingTeacher({
                                        ...editingTeacher,
                                        subjectName: e.target.value,
                                    })
                                }
                            />
                            <FormControl fullWidth size="small">
                                <InputLabel>Kategori Mapel</InputLabel>
                                <Select
                                    label="Kategori Mapel"
                                    value={editingTeacher.category}
                                    onChange={(e) =>
                                        setEditingTeacher({
                                            ...editingTeacher,
                                            category: e.target.value as any,
                                        })
                                    }
                                >
                                    <MenuItem value="KEJURUAN">KEJURUAN (Vokasi / Praktikum)</MenuItem>
                                    <MenuItem value="UMUM">UMUM (Normatif / Adaptif)</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                label="Rekomendasi Waktu Belajar (JP)"
                                fullWidth
                                size="small"
                                value={editingTeacher.recommendedJp}
                                onChange={(e) =>
                                    setEditingTeacher({
                                        ...editingTeacher,
                                        recommendedJp: e.target.value,
                                    })
                                }
                            />
                            <TextField
                                label="Target Alokasi Jam (JP)"
                                type="number"
                                fullWidth
                                size="small"
                                value={editingTeacher.targetJp}
                                onChange={(e) =>
                                    setEditingTeacher({
                                        ...editingTeacher,
                                        targetJp: Number(e.target.value),
                                    })
                                }
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button
                        onClick={() => setEditingTeacher(null)}
                        sx={{ textTransform: 'none', color: '#64748b' }}
                    >
                        Batal
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSaveEdit}
                        sx={{
                            bgcolor: '#2563eb',
                            textTransform: 'none',
                            fontWeight: 700,
                            borderRadius: 2,
                        }}
                    >
                        Simpan Perubahan
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add New Teacher Dialog */}
            <Dialog
                open={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                maxWidth="sm"
                fullWidth
                slotProps={{
                    paper: {
                        sx: {
                            bgcolor: isDark ? '#18181b' : '#ffffff',
                            color: isDark ? '#f4f4f5' : '#0f172a',
                            border: isDark ? '1px solid #27272a' : undefined,
                            borderRadius: 3,
                        },
                    },
                }}
            >
                <DialogTitle sx={{ fontWeight: 800, color: isDark ? '#f4f4f5' : '#0f172a' }}>
                    Tambah Guru Pengajar Baru
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Nama Lengkap Guru Beserta Gelar"
                            placeholder="Contoh: Budi Santoso, S.Kom."
                            fullWidth
                            size="small"
                            value={newTeacherForm.name}
                            onChange={(e) =>
                                setNewTeacherForm({ ...newTeacherForm, name: e.target.value })
                            }
                        />
                        <TextField
                            label="Mata Pelajaran"
                            placeholder="Contoh: Pemrograman Berorientasi Objek"
                            fullWidth
                            size="small"
                            value={newTeacherForm.subjectName}
                            onChange={(e) =>
                                setNewTeacherForm({
                                    ...newTeacherForm,
                                    subjectName: e.target.value,
                                })
                            }
                        />
                        <TextField
                            label="Kode Mapel"
                            placeholder="Contoh: RPL-03"
                            fullWidth
                            size="small"
                            value={newTeacherForm.subjectCode}
                            onChange={(e) =>
                                setNewTeacherForm({
                                    ...newTeacherForm,
                                    subjectCode: e.target.value,
                                })
                            }
                        />
                        <FormControl fullWidth size="small">
                            <InputLabel>Kategori Mapel</InputLabel>
                            <Select
                                label="Kategori Mapel"
                                value={newTeacherForm.category}
                                onChange={(e) =>
                                    setNewTeacherForm({
                                        ...newTeacherForm,
                                        category: e.target.value as any,
                                    })
                                }
                            >
                                <MenuItem value="KEJURUAN">KEJURUAN (Praktik / Lab)</MenuItem>
                                <MenuItem value="UMUM">UMUM (Teori / Normatif)</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="Rekomendasi Waktu KBM (JP)"
                            fullWidth
                            size="small"
                            value={newTeacherForm.recommendedJp}
                            onChange={(e) =>
                                setNewTeacherForm({
                                    ...newTeacherForm,
                                    recommendedJp: e.target.value,
                                })
                            }
                        />
                        <TextField
                            label="Target Beban JP"
                            type="number"
                            fullWidth
                            size="small"
                            value={newTeacherForm.targetJp}
                            onChange={(e) =>
                                setNewTeacherForm({
                                    ...newTeacherForm,
                                    targetJp: Number(e.target.value),
                                })
                            }
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button
                        onClick={() => setIsAddOpen(false)}
                        sx={{ textTransform: 'none', color: '#64748b' }}
                    >
                        Batal
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSaveNew}
                        disabled={!newTeacherForm.name.trim()}
                        sx={{
                            bgcolor: '#2563eb',
                            textTransform: 'none',
                            fontWeight: 700,
                            borderRadius: 2,
                        }}
                    >
                        Tambahkan Guru
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

export default TeacherCodeTable;

