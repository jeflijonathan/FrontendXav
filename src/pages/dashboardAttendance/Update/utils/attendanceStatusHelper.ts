import type { AttendanceStatus } from '@api/attendance/model';

export const ATTENDANCE_STATUS_OPTIONS: {
    value: AttendanceStatus;
    label: string;
    activeBg: string;
    hoverBg: string;
    lightColor: string;
    darkColor: string;
    lightBorder: string;
    darkBorder: string;
}[] = [
    {
        value: 'HADIR',
        label: 'Hadir',
        activeBg: '#16a34a',
        hoverBg: '#15803d',
        lightColor: '#16a34a',
        darkColor: '#86efac',
        lightBorder: '#86efac',
        darkBorder: '#16a34a',
    },
    {
        value: 'IZIN',
        label: 'Izin',
        activeBg: '#ca8a04',
        hoverBg: '#a16207',
        lightColor: '#ca8a04',
        darkColor: '#fde047',
        lightBorder: '#fde047',
        darkBorder: '#ca8a04',
    },
    {
        value: 'SAKIT',
        label: 'Sakit',
        activeBg: '#2563eb',
        hoverBg: '#1d4ed8',
        lightColor: '#2563eb',
        darkColor: '#93c5fd',
        lightBorder: '#bfdbfe',
        darkBorder: '#2563eb',
    },
    {
        value: 'ALPA',
        label: 'Alpa',
        activeBg: '#dc2626',
        hoverBg: '#b91c1c',
        lightColor: '#dc2626',
        darkColor: '#fca5a5',
        lightBorder: '#fecaca',
        darkBorder: '#dc2626',
    },
];
