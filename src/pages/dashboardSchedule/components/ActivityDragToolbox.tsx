import React from 'react';
import {
    Box,
    Card,
    Chip,
    Divider,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import FlagIcon from '@mui/icons-material/Flag';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CoffeeIcon from '@mui/icons-material/Coffee';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import StarIcon from '@mui/icons-material/Star';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import TerminalIcon from '@mui/icons-material/Terminal';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ChurchIcon from '@mui/icons-material/Church';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useScheduleStore } from '../store/useScheduleStore';
import type { ActivityCategory, DragPayload } from '../types';

interface ActivityItem {
    type: ActivityCategory;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    borderColor: string;
}

const ACTIVITIES: ActivityItem[] = [
    {
        type: 'UPACARA',
        title: 'UPACARA / PEMBINAAN',
        subtitle: 'Full 12 Kelas • Lapangan Utama',
        icon: <FlagIcon fontSize="small" />,
        color: '#6d28d9',
        bgColor: '#ede9fe',
        borderColor: '#c4b5fd',
    },
    {
        type: 'SENAM',
        title: 'SENAM BERSAMA',
        subtitle: 'Full 12 Kelas • Kebugaran Jasmani',
        icon: <FitnessCenterIcon fontSize="small" />,
        color: '#0369a1',
        bgColor: '#e0f2fe',
        borderColor: '#bae6fd',
    },
    {
        type: 'LITERASI',
        title: 'LITERASI & KEAGAMAAN',
        subtitle: 'Full 12 Kelas • Pembiasaan Pagi',
        icon: <MenuBookIcon fontSize="small" />,
        color: '#854d0e',
        bgColor: '#fef9c3',
        borderColor: '#fef08a',
    },
    {
        type: 'ISTIRAHAT',
        title: 'ISTIRAHAT',
        subtitle: 'Jeda Pembelajaran • Full 12 Kelas',
        icon: <CoffeeIcon fontSize="small" />,
        color: '#92400e',
        bgColor: '#fef3c7',
        borderColor: '#fde68a',
    },
    {
        type: 'PRAMUKA',
        title: 'PRAMUKA GUGUS DEPAN',
        subtitle: 'Kepanduan Wajib • Kelas X & XI',
        icon: <MilitaryTechIcon fontSize="small" />,
        color: '#991b1b',
        bgColor: '#fef2f2',
        borderColor: '#fecaca',
    },
    {
        type: 'EKSTRA_WAJIB',
        title: 'EKSTRA WAJIB',
        subtitle: 'Budaya Kerja & Karakter Siswa',
        icon: <StarIcon fontSize="small" />,
        color: '#166534',
        bgColor: '#dcfce7',
        borderColor: '#bbf7d0',
    },
    {
        type: 'EKSTRA_PILIHAN_XI',
        title: 'EKSTRA PILIHAN Kelas XI',
        subtitle: 'Minat Bakat Khusus Kelas XI',
        icon: <SportsSoccerIcon fontSize="small" />,
        color: '#9a3412',
        bgColor: '#ffedd5',
        borderColor: '#fed7aa',
    },
    {
        type: 'EKSTRA_PILIHAN_X_XI',
        title: 'EKSTRA PILIHAN Kelas X dan XI',
        subtitle: 'Gabungan Minat Bakat X & XI',
        icon: <SportsBasketballIcon fontSize="small" />,
        color: '#c2410c',
        bgColor: '#ffedd5',
        borderColor: '#fdba74',
    },
    {
        type: 'P1_P5',
        title: 'P1 / PROJEK PANCASILA (P5)',
        subtitle: 'Kokurikuler Penguatan Karakter',
        icon: <AutoAwesomeIcon fontSize="small" />,
        color: '#7e22ce',
        bgColor: '#f3e8ff',
        borderColor: '#d8b4fe',
    },
    {
        type: 'FUTSAL',
        title: 'FUTSAL & SEPAK BOLA',
        subtitle: 'Olahraga Prestasi Lapangan',
        icon: <SportsSoccerIcon fontSize="small" />,
        color: '#15803d',
        bgColor: '#dcfce7',
        borderColor: '#86efac',
    },
    {
        type: 'BASKET',
        title: 'BOLA BASKET',
        subtitle: 'Tim Basket Putra & Putri',
        icon: <SportsBasketballIcon fontSize="small" />,
        color: '#ea580c',
        bgColor: '#ffedd5',
        borderColor: '#fed7aa',
    },
    {
        type: 'PADUAN_SUARA',
        title: 'PADUAN SUARA / CHOIR',
        subtitle: 'Vokal Padus Liturgi & Lomba',
        icon: <QueueMusicIcon fontSize="small" />,
        color: '#4338ca',
        bgColor: '#e0e7ff',
        borderColor: '#c7d2fe',
    },
    {
        type: 'MUSIK_BAND',
        title: 'MUSIK & BAND SEKOLAH',
        subtitle: 'Gitar, Keyboard, Drum & Vokal',
        icon: <MusicNoteIcon fontSize="small" />,
        color: '#be185d',
        bgColor: '#fce7f3',
        borderColor: '#fbcfe8',
    },
    {
        type: 'ROBOTIKA',
        title: 'IT & ROBOTIKA / CODING',
        subtitle: 'Software, IoT & Hardware',
        icon: <TerminalIcon fontSize="small" />,
        color: '#0369a1',
        bgColor: '#e0f2fe',
        borderColor: '#bae6fd',
    },
    {
        type: 'ENGLISH_CLUB',
        title: 'ENGLISH CLUB & DEBATE',
        subtitle: 'Public Speaking & TOEFL Prep',
        icon: <RecordVoiceOverIcon fontSize="small" />,
        color: '#b45309',
        bgColor: '#fef3c7',
        borderColor: '#fde68a',
    },
    {
        type: 'PMR',
        title: 'PALANG MERAH REMAJA (PMR)',
        subtitle: 'Pertolongan Pertama & Kemanusiaan',
        icon: <LocalHospitalIcon fontSize="small" />,
        color: '#dc2626',
        bgColor: '#fee2e2',
        borderColor: '#fca5a5',
    },
    {
        type: 'ROHANI',
        title: 'ROHANI & PENDALAMAN IMAN',
        subtitle: 'Ibadat, Legio Maria & Katese',
        icon: <ChurchIcon fontSize="small" />,
        color: '#475569',
        bgColor: '#f1f5f9',
        borderColor: '#cbd5e1',
    },
];

const ActivityDragToolbox: React.FC = () => {
    const { setDraggedItem, teachers } = useScheduleStore();

    const handleDragStartActivity = (
        e: React.DragEvent,
        activity: ActivityItem
    ) => {
        const payload: DragPayload = {
            type: 'SPECIAL_ACTIVITY',
            activityType: activity.type,
            activityTitle: activity.title,
        };
        e.dataTransfer.setData('text/plain', JSON.stringify(payload));
        e.dataTransfer.effectAllowed = 'copyMove';
        setDraggedItem(payload);
    };

    const handleDragStartTeacher = (
        e: React.DragEvent,
        teacher: (typeof teachers)[0]
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

    const handleDragEnd = () => {
        setDraggedItem(null);
    };

    return (
        <Card
            elevation={0}
            sx={{
                mb: 3,
                p: 2,
                borderRadius: 3,
                border: '1px solid #e2e8f0',
                bgcolor: '#fafafa',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 1.5,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DragIndicatorIcon sx={{ color: '#6366f1', fontSize: 20 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b' }}>
                        Toolbox Tarik-Pindah (Sistem Drag & Drop)
                    </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                    Tarik kotak aktivitas atau nomor guru langsung ke baris/sel pada tabel jadwal di bawah
                </Typography>
            </Box>

            {/* Special Activities Section */}
            <Typography
                variant="caption"
                sx={{
                    display: 'block',
                    fontWeight: 700,
                    color: '#475569',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    mb: 1,
                }}
            >
                1. Aktivitas Khusus & Jam Ekstra (Otomatis Full Seluruh Kelas)
            </Typography>

            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', mb: 2 }} useFlexGap>
                {ACTIVITIES.map((act) => (
                    <Tooltip
                        key={act.type}
                        title={`Tarik ke baris tabel untuk menjadikan baris tersebut ${act.title}`}
                    >
                        <Box
                            draggable
                            onDragStart={(e) => handleDragStartActivity(e, act)}
                            onDragEnd={handleDragEnd}
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 1,
                                px: 1.5,
                                py: 0.75,
                                borderRadius: 2,
                                bgcolor: act.bgColor,
                                border: `1px solid ${act.borderColor}`,
                                color: act.color,
                                cursor: 'grab',
                                userSelect: 'none',
                                transition: 'all 0.15s ease-in-out',
                                boxShadow: '0 1px 2px 0 rgba(0,0,0,0.04)',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                                },
                                '&:active': {
                                    cursor: 'grabbing',
                                    transform: 'scale(0.97)',
                                },
                            }}
                        >
                            <DragIndicatorIcon sx={{ fontSize: 16, opacity: 0.6 }} />
                            {act.icon}
                            <Box>
                                <Typography
                                    variant="caption"
                                    sx={{ fontWeight: 800, display: 'block', lineHeight: 1.1 }}
                                >
                                    {act.title}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{ fontSize: '10px', opacity: 0.8, display: 'block' }}
                                >
                                    {act.subtitle}
                                </Typography>
                            </Box>
                        </Box>
                    </Tooltip>
                ))}
            </Stack>

            <Divider sx={{ my: 1.5 }} />

            {/* Quick Draggable Teachers Section */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 1,
                }}
            >
                <Typography
                    variant="caption"
                    sx={{
                        fontWeight: 700,
                        color: '#475569',
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                    }}
                >
                    2. Tarik Cepat Nomor Guru Pengajar (Kode 1 - 25)
                </Typography>
                <Typography variant="caption" sx={{ color: '#3b82f6', fontWeight: 600 }}>
                    💡 Bisa juga klik langsung sel pada tabel di bawah
                </Typography>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 0.75,
                    maxHeight: 110,
                    overflowY: 'auto',
                    p: 1,
                    bgcolor: '#ffffff',
                    borderRadius: 2,
                    border: '1px solid #e2e8f0',
                }}
            >
                {teachers.map((teacher) => (
                    <Tooltip
                        key={teacher.code}
                        title={`Kode ${teacher.code}: ${teacher.name} (${teacher.subjectName}) - ${teacher.recommendedJp}`}
                    >
                        <Chip
                            draggable
                            onDragStart={(e) => handleDragStartTeacher(e, teacher)}
                            onDragEnd={handleDragEnd}
                            label={`#${teacher.code} ${teacher.name.split(' ')[0]}`}
                            size="small"
                            sx={{
                                cursor: 'grab',
                                bgcolor: teacher.category === 'KEJURUAN' ? '#fff7ed' : '#f0f9ff',
                                color: teacher.category === 'KEJURUAN' ? '#c2410c' : '#0369a1',
                                border: `1px solid ${
                                    teacher.category === 'KEJURUAN' ? '#fed7aa' : '#bae6fd'
                                }`,
                                fontWeight: 700,
                                fontSize: '11px',
                                '&:hover': {
                                    bgcolor: teacher.category === 'KEJURUAN' ? '#ffedd5' : '#e0f2fe',
                                    transform: 'scale(1.04)',
                                },
                                '&:active': {
                                    cursor: 'grabbing',
                                },
                            }}
                        />
                    </Tooltip>
                ))}
            </Box>
        </Card>
    );
};

export default ActivityDragToolbox;

