import { create } from 'zustand';
import type { JenisJamResponseModel } from '@api/jenisJam/model';
import type { SchoolInformationResponseModel } from '@api/schoolinformation/model';

export type DayName = 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';

export interface ScheduleSlot {
    id: string;
    jp: string | number; // 0 for Upacara/Senam/Literasi; 1..N for KBM; '-' for Istirahat/Ekstra
    jam: string; // e.g. "07:00 - 07:45"
    durasiMenit: number; // e.g. 45, 40, 35, 30, etc.
    jenisJam: string; // 'Upacara' | 'Senam' | 'Literasi' | 'KBM' | 'Istirahat' | 'Ekstra' | custom
    isEffective: boolean;
}

export interface RosterJamState {
    // School information link
    selectedSchoolInfoId: string;
    schoolInfoList: SchoolInformationResponseModel[];
    periode: string;
    hariKerja: string;
    jpDuration: number;
    showSabtu: boolean;
    isSynced: boolean;
    jenisJamList: JenisJamResponseModel[];
    isLoading: boolean;
    isSaving: boolean;
    schedules: Record<DayName, ScheduleSlot[]>;
    // Multi-period schedule storage keyed by id_school_information or period name
    periodSchedules: Record<string, Record<DayName, ScheduleSlot[]>>;
    // Dialog state
    isAddDialogOpen: boolean;
    selectedDayForAdd: DayName | null;
    editingSlot: { day: DayName; slot: ScheduleSlot } | null;
}

export interface RosterJamStore {
    state: RosterJamState;
    setState: (fn: (prev: RosterJamState) => RosterJamState) => void;
    setSchoolInfoList: (list: SchoolInformationResponseModel[]) => void;
    selectPeriod: (idSchoolInfo: string) => void;
    setPeriode: (periode: string) => void;
    deleteSlot: (day: DayName, slotId: string) => void;
    moveSlotUp: (day: DayName, slotId: string) => void;
    moveSlotDown: (day: DayName, slotId: string) => void;
    addSlot: (day: DayName, slot: Omit<ScheduleSlot, 'id'>) => void;
    updateSlot: (day: DayName, slotId: string, updates: Partial<Omit<ScheduleSlot, 'id'>>) => void;
    updateSlotDuration: (day: DayName, slotId: string, minutes: number) => void;
    updateSlotCategory: (day: DayName, slotId: string, category: string) => void;
    setDayStartTime: (day: DayName, startTime: string) => void;
    setDayAllKbmDuration: (day: DayName, minutes: number) => void;
    openAddDialog: (day: DayName) => void;
    closeAddDialog: () => void;
    openEditDialog: (day: DayName, slot: ScheduleSlot) => void;
    closeEditDialog: () => void;
    applyXaveriusTemplate: () => void;
    applyFlatTemplate: (duration?: number) => void;
    clearCurrentSchedule: () => void;
    adjustAssemblyReduction: () => void;
    toggleShowSabtu: () => void;
}

// ── TIME UTILITIES ───────────────────────────────────────────
export const timeToMinutes = (timeStr: string): number => {
    if (!timeStr) return 420; // 07:00
    const parts = timeStr.trim().split(':');
    const h = parseInt(parts[0], 10) || 0;
    const m = parseInt(parts[1], 10) || 0;
    return h * 60 + m;
};

export const minutesToTime = (totalMins: number): string => {
    const norm = ((totalMins % 1440) + 1440) % 1440;
    const h = Math.floor(norm / 60);
    const m = norm % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

export const parseStartTimeFromRange = (rangeStr: string): string => {
    if (!rangeStr) return '07:00';
    const parts = rangeStr.split('-');
    return parts[0]?.trim() || '07:00';
};

/**
 * Otomatis menghitung ulang penomoran JP dan membuat urutan jam (jam_awal - jam_akhir)
 * saling menyambung secara konsisten tanpa celah atau tumpang tindih.
 */
export const resequenceAndCascadeSlots = (
    slots: ScheduleSlot[],
    customStartHour?: string
): ScheduleSlot[] => {
    if (!slots || slots.length === 0) return [];

    let kbmCounter = 1;
    const initialStart = customStartHour || parseStartTimeFromRange(slots[0]?.jam) || '07:00';
    let currentMins = timeToMinutes(initialStart);

    return slots.map((slot, index) => {
        const lower = (slot.jenisJam || '').toLowerCase();
        let jp: string | number = '-';
        let isEffective = false;

        if (
            lower.includes('upacara') ||
            lower.includes('senam') ||
            lower.includes('literasi') ||
            lower.includes('pembinaan') ||
            lower.includes('apel')
        ) {
            jp = 0;
            isEffective = false;
        } else if (lower.includes('kbm') || lower.includes('belajar')) {
            jp = kbmCounter++;
            isEffective = true;
        } else if (lower.includes('ekstra') || lower.includes('pramuka')) {
            jp = '-';
            isEffective = false;
        } else if (lower.includes('istirahat') || lower.includes('ishoma')) {
            jp = '-';
            isEffective = false;
        } else {
            if (index === 0) {
                jp = 0;
                isEffective = false;
            } else {
                jp = '-';
                isEffective = false;
            }
        }

        const durasi = Number(slot.durasiMenit) || 45;
        const startStr = minutesToTime(currentMins);
        const endMins = currentMins + durasi;
        const endStr = minutesToTime(endMins);
        currentMins = endMins;

        return {
            ...slot,
            jp,
            isEffective,
            durasiMenit: durasi,
            jam: `${startStr} - ${endStr}`,
        };
    });
};

/**
 * Buat jadwal kosong (Setiap periode baru yang belum dibuat harus KOSONG)
 */
export const createEmptySchedule = (): Record<DayName, ScheduleSlot[]> => ({
    Senin: [],
    Selasa: [],
    Rabu: [],
    Kamis: [],
    Jumat: [],
    Sabtu: [],
});

/**
 * Jadwal Riil SMK Xaverius Palembang (Sesuai Foto Roster Asli Sekolah)
 */
export const createXaveriusRealSchedule = (): Record<DayName, ScheduleSlot[]> => ({
    Senin: resequenceAndCascadeSlots([
        { id: 'sen-0', jp: 0, jam: '07:00 - 07:45', durasiMenit: 45, jenisJam: 'Upacara', isEffective: false },
        { id: 'sen-1', jp: 1, jam: '07:45 - 08:20', durasiMenit: 35, jenisJam: 'KBM', isEffective: true },
        { id: 'sen-2', jp: 2, jam: '08:20 - 08:55', durasiMenit: 35, jenisJam: 'KBM', isEffective: true },
        { id: 'sen-3', jp: 3, jam: '08:55 - 09:30', durasiMenit: 35, jenisJam: 'KBM', isEffective: true },
        { id: 'sen-4', jp: 4, jam: '09:30 - 10:05', durasiMenit: 35, jenisJam: 'KBM', isEffective: true },
        { id: 'sen-ist1', jp: '-', jam: '10:05 - 10:20', durasiMenit: 15, jenisJam: 'Istirahat', isEffective: false },
        { id: 'sen-5', jp: 5, jam: '10:20 - 11:00', durasiMenit: 40, jenisJam: 'KBM', isEffective: true },
        { id: 'sen-6', jp: 6, jam: '11:00 - 11:40', durasiMenit: 40, jenisJam: 'KBM', isEffective: true },
        { id: 'sen-7', jp: 7, jam: '11:40 - 12:20', durasiMenit: 40, jenisJam: 'KBM', isEffective: true },
        { id: 'sen-ist2', jp: '-', jam: '12:20 - 12:45', durasiMenit: 25, jenisJam: 'Istirahat', isEffective: false },
        { id: 'sen-8', jp: 8, jam: '12:45 - 13:30', durasiMenit: 45, jenisJam: 'KBM', isEffective: true },
        { id: 'sen-9', jp: 9, jam: '13:30 - 14:10', durasiMenit: 40, jenisJam: 'KBM', isEffective: true },
        { id: 'sen-10', jp: 10, jam: '14:10 - 14:50', durasiMenit: 40, jenisJam: 'KBM', isEffective: true },
        { id: 'sen-ekstra', jp: '-', jam: '15:10 - 16:40', durasiMenit: 90, jenisJam: 'Ekstra', isEffective: false },
    ], '07:00'),
    Selasa: resequenceAndCascadeSlots([
        { id: 'sel-1', jp: 1, jam: '07:00 - 07:45', durasiMenit: 45, jenisJam: 'KBM', isEffective: true },
        { id: 'sel-2', jp: 2, jam: '07:45 - 08:30', durasiMenit: 45, jenisJam: 'KBM', isEffective: true },
        { id: 'sel-3', jp: 3, jam: '08:30 - 09:15', durasiMenit: 45, jenisJam: 'KBM', isEffective: true },
        { id: 'sel-4', jp: 4, jam: '09:15 - 10:00', durasiMenit: 45, jenisJam: 'KBM', isEffective: true },
        { id: 'sel-ist1', jp: '-', jam: '10:00 - 10:15', durasiMenit: 15, jenisJam: 'Istirahat', isEffective: false },
        { id: 'sel-5', jp: 5, jam: '10:15 - 11:00', durasiMenit: 45, jenisJam: 'KBM', isEffective: true },
        { id: 'sel-6', jp: 6, jam: '11:00 - 11:45', durasiMenit: 45, jenisJam: 'KBM', isEffective: true },
        { id: 'sel-7', jp: 7, jam: '11:45 - 12:25', durasiMenit: 40, jenisJam: 'KBM', isEffective: true },
        { id: 'sel-ist2', jp: '-', jam: '12:25 - 12:50', durasiMenit: 25, jenisJam: 'Istirahat', isEffective: false },
        { id: 'sel-8', jp: 8, jam: '12:50 - 13:30', durasiMenit: 40, jenisJam: 'KBM', isEffective: true },
        { id: 'sel-9', jp: 9, jam: '13:30 - 14:10', durasiMenit: 40, jenisJam: 'KBM', isEffective: true },
        { id: 'sel-10', jp: 10, jam: '14:10 - 14:50', durasiMenit: 40, jenisJam: 'KBM', isEffective: true },
        { id: 'sel-ekstra', jp: '-', jam: '15:10 - 16:40', durasiMenit: 90, jenisJam: 'Ekstra', isEffective: false },
    ], '07:00'),
    Rabu: resequenceAndCascadeSlots([
        { id: 'rab-0', jp: 0, jam: '06:40 - 07:45', durasiMenit: 65, jenisJam: 'Senam', isEffective: false },
        { id: 'rab-1', jp: 1, jam: '07:45 - 08:25', durasiMenit: 40, jenisJam: 'KBM', isEffective: true },
        { id: 'rab-2', jp: 2, jam: '08:25 - 09:05', durasiMenit: 40, jenisJam: 'KBM', isEffective: true },
        { id: 'rab-3', jp: 3, jam: '09:05 - 09:45', durasiMenit: 40, jenisJam: 'KBM', isEffective: true },
        { id: 'rab-ist1', jp: '-', jam: '09:45 - 10:00', durasiMenit: 15, jenisJam: 'Istirahat', isEffective: false },
        { id: 'rab-4', jp: 4, jam: '10:00 - 10:40', durasiMenit: 40, jenisJam: 'KBM', isEffective: true },
        { id: 'rab-5', jp: 5, jam: '10:40 - 11:20', durasiMenit: 40, jenisJam: 'KBM', isEffective: true },
        { id: 'rab-6', jp: 6, jam: '11:20 - 12:00', durasiMenit: 40, jenisJam: 'KBM', isEffective: true },
        { id: 'rab-7', jp: 7, jam: '12:00 - 12:35', durasiMenit: 35, jenisJam: 'KBM', isEffective: true },
        { id: 'rab-ist2', jp: '-', jam: '12:35 - 13:00', durasiMenit: 25, jenisJam: 'Istirahat', isEffective: false },
        { id: 'rab-8', jp: 8, jam: '13:00 - 13:35', durasiMenit: 35, jenisJam: 'KBM', isEffective: true },
        { id: 'rab-9', jp: 9, jam: '13:35 - 14:10', durasiMenit: 35, jenisJam: 'KBM', isEffective: true },
        { id: 'rab-10', jp: 10, jam: '14:10 - 14:50', durasiMenit: 40, jenisJam: 'KBM', isEffective: true },
        { id: 'rab-ekstra', jp: '-', jam: '15:10 - 16:40', durasiMenit: 90, jenisJam: 'Ekstra', isEffective: false },
    ], '06:40'),
    Kamis: resequenceAndCascadeSlots([
        { id: 'kam-1', jp: 1, jam: '07:00 - 07:45', durasiMenit: 45, jenisJam: 'KBM', isEffective: true },
        { id: 'kam-2', jp: 2, jam: '07:45 - 08:30', durasiMenit: 45, jenisJam: 'KBM', isEffective: true },
        { id: 'kam-3', jp: 3, jam: '08:30 - 09:15', durasiMenit: 45, jenisJam: 'KBM', isEffective: true },
        { id: 'kam-4', jp: 4, jam: '09:15 - 10:00', durasiMenit: 45, jenisJam: 'KBM', isEffective: true },
        { id: 'kam-ist1', jp: '-', jam: '10:00 - 10:15', durasiMenit: 15, jenisJam: 'Istirahat', isEffective: false },
        { id: 'kam-5', jp: 5, jam: '10:15 - 11:00', durasiMenit: 45, jenisJam: 'KBM', isEffective: true },
        { id: 'kam-6', jp: 6, jam: '11:00 - 11:45', durasiMenit: 45, jenisJam: 'KBM', isEffective: true },
        { id: 'kam-7', jp: 7, jam: '11:45 - 12:25', durasiMenit: 40, jenisJam: 'KBM', isEffective: true },
        { id: 'kam-ist2', jp: '-', jam: '12:25 - 12:50', durasiMenit: 25, jenisJam: 'Istirahat', isEffective: false },
        { id: 'kam-8', jp: 8, jam: '12:50 - 13:30', durasiMenit: 40, jenisJam: 'KBM', isEffective: true },
        { id: 'kam-9', jp: 9, jam: '13:30 - 14:10', durasiMenit: 40, jenisJam: 'KBM', isEffective: true },
        { id: 'kam-ekstra1', jp: '-', jam: '14:25 - 15:55', durasiMenit: 90, jenisJam: 'Ekstra', isEffective: false },
        { id: 'kam-ekstra2', jp: '-', jam: '16:00 - 17:30', durasiMenit: 90, jenisJam: 'Ekstra', isEffective: false },
    ], '07:00'),
    Jumat: resequenceAndCascadeSlots([
        { id: 'jum-0', jp: 0, jam: '07:00 - 07:45', durasiMenit: 45, jenisJam: 'Literasi', isEffective: false },
        { id: 'jum-1', jp: 1, jam: '07:45 - 08:20', durasiMenit: 35, jenisJam: 'KBM', isEffective: true },
        { id: 'jum-2', jp: 2, jam: '08:20 - 08:55', durasiMenit: 35, jenisJam: 'KBM', isEffective: true },
        { id: 'jum-3', jp: 3, jam: '08:55 - 09:30', durasiMenit: 35, jenisJam: 'KBM', isEffective: true },
        { id: 'jum-4', jp: 4, jam: '09:30 - 10:05', durasiMenit: 35, jenisJam: 'KBM', isEffective: true },
        { id: 'jum-ist1', jp: '-', jam: '10:05 - 10:20', durasiMenit: 15, jenisJam: 'Istirahat', isEffective: false },
        { id: 'jum-5', jp: 5, jam: '10:20 - 10:50', durasiMenit: 30, jenisJam: 'KBM', isEffective: true },
        { id: 'jum-6', jp: 6, jam: '10:50 - 11:20', durasiMenit: 30, jenisJam: 'KBM', isEffective: true },
        { id: 'jum-7', jp: 7, jam: '11:20 - 11:50', durasiMenit: 30, jenisJam: 'KBM', isEffective: true },
        { id: 'jum-ist2', jp: '-', jam: '11:50 - 12:30', durasiMenit: 40, jenisJam: 'Istirahat', isEffective: false },
        { id: 'jum-8', jp: 8, jam: '12:30 - 13:10', durasiMenit: 40, jenisJam: 'KBM', isEffective: true },
        { id: 'jum-9', jp: 9, jam: '13:10 - 13:50', durasiMenit: 40, jenisJam: 'KBM', isEffective: true },
        { id: 'jum-pramuka', jp: '-', jam: '14:05 - 15:35', durasiMenit: 90, jenisJam: 'Ekstra', isEffective: false },
        { id: 'jum-ekstra', jp: '-', jam: '15:50 - 17:20', durasiMenit: 90, jenisJam: 'Ekstra', isEffective: false },
    ], '07:00'),
    Sabtu: resequenceAndCascadeSlots([
        { id: 'sab-1', jp: 1, jam: '07:00 - 07:45', durasiMenit: 45, jenisJam: 'KBM', isEffective: true },
        { id: 'sab-2', jp: 2, jam: '07:45 - 08:30', durasiMenit: 45, jenisJam: 'KBM', isEffective: true },
        { id: 'sab-3', jp: 3, jam: '08:30 - 09:15', durasiMenit: 45, jenisJam: 'KBM', isEffective: true },
        { id: 'sab-ist', jp: '-', jam: '09:15 - 09:30', durasiMenit: 15, jenisJam: 'Istirahat', isEffective: false },
        { id: 'sab-4', jp: 4, jam: '09:30 - 10:15', durasiMenit: 45, jenisJam: 'KBM', isEffective: true },
        { id: 'sab-5', jp: 5, jam: '10:15 - 11:00', durasiMenit: 45, jenisJam: 'KBM', isEffective: true },
        { id: 'sab-6', jp: 6, jam: '11:00 - 11:45', durasiMenit: 45, jenisJam: 'KBM', isEffective: true },
    ], '07:00'),
});

/**
 * Jadwal Standar Flat (Durasi Seragam)
 */
export const createFlat45Schedule = (kbmMinutes: number = 45): Record<DayName, ScheduleSlot[]> => ({
    Senin: resequenceAndCascadeSlots([
        { id: 'sen-flat-0', jp: 0, jam: '07:00 - 07:45', durasiMenit: 45, jenisJam: 'Upacara', isEffective: false },
        { id: 'sen-flat-1', jp: 1, jam: '07:45 - 08:30', durasiMenit: kbmMinutes, jenisJam: 'KBM', isEffective: true },
        { id: 'sen-flat-2', jp: 2, jam: '08:30 - 09:15', durasiMenit: kbmMinutes, jenisJam: 'KBM', isEffective: true },
        { id: 'sen-flat-3', jp: 3, jam: '09:15 - 10:00', durasiMenit: kbmMinutes, jenisJam: 'KBM', isEffective: true },
        { id: 'sen-flat-ist1', jp: '-', jam: '10:00 - 10:20', durasiMenit: 20, jenisJam: 'Istirahat', isEffective: false },
        { id: 'sen-flat-4', jp: 4, jam: '10:20 - 11:05', durasiMenit: kbmMinutes, jenisJam: 'KBM', isEffective: true },
        { id: 'sen-flat-5', jp: 5, jam: '11:05 - 11:50', durasiMenit: kbmMinutes, jenisJam: 'KBM', isEffective: true },
        { id: 'sen-flat-6', jp: 6, jam: '11:50 - 12:35', durasiMenit: kbmMinutes, jenisJam: 'KBM', isEffective: true },
        { id: 'sen-flat-ist2', jp: '-', jam: '12:35 - 13:15', durasiMenit: 40, jenisJam: 'Istirahat', isEffective: false },
        { id: 'sen-flat-7', jp: 7, jam: '13:15 - 14:00', durasiMenit: kbmMinutes, jenisJam: 'KBM', isEffective: true },
        { id: 'sen-flat-8', jp: 8, jam: '14:00 - 14:45', durasiMenit: kbmMinutes, jenisJam: 'KBM', isEffective: true },
        { id: 'sen-flat-9', jp: 9, jam: '14:45 - 15:30', durasiMenit: kbmMinutes, jenisJam: 'KBM', isEffective: true },
    ], '07:00'),
    Selasa: resequenceAndCascadeSlots([
        { id: 'sel-flat-1', jp: 1, jam: '07:00 - 07:45', durasiMenit: kbmMinutes, jenisJam: 'KBM', isEffective: true },
        { id: 'sel-flat-2', jp: 2, jam: '07:45 - 08:30', durasiMenit: kbmMinutes, jenisJam: 'KBM', isEffective: true },
        { id: 'sel-flat-3', jp: 3, jam: '08:30 - 09:15', durasiMenit: kbmMinutes, jenisJam: 'KBM', isEffective: true },
        { id: 'sel-flat-4', jp: 4, jam: '09:15 - 10:00', durasiMenit: kbmMinutes, jenisJam: 'KBM', isEffective: true },
        { id: 'sel-flat-ist1', jp: '-', jam: '10:00 - 10:20', durasiMenit: 20, jenisJam: 'Istirahat', isEffective: false },
        { id: 'sel-flat-5', jp: 5, jam: '10:20 - 11:05', durasiMenit: kbmMinutes, jenisJam: 'KBM', isEffective: true },
        { id: 'sel-flat-6', jp: 6, jam: '11:05 - 11:50', durasiMenit: kbmMinutes, jenisJam: 'KBM', isEffective: true },
        { id: 'sel-flat-7', jp: 7, jam: '11:50 - 12:35', durasiMenit: kbmMinutes, jenisJam: 'KBM', isEffective: true },
        { id: 'sel-flat-ist2', jp: '-', jam: '12:35 - 13:15', durasiMenit: 40, jenisJam: 'Istirahat', isEffective: false },
        { id: 'sel-flat-8', jp: 8, jam: '13:15 - 14:00', durasiMenit: kbmMinutes, jenisJam: 'KBM', isEffective: true },
        { id: 'sel-flat-9', jp: 9, jam: '14:00 - 14:45', durasiMenit: kbmMinutes, jenisJam: 'KBM', isEffective: true },
        { id: 'sel-flat-10', jp: 10, jam: '14:45 - 15:30', durasiMenit: kbmMinutes, jenisJam: 'KBM', isEffective: true },
    ], '07:00'),
    Rabu: resequenceAndCascadeSlots([
        { id: 'rab-flat-0', jp: 0, jam: '06:45 - 07:30', durasiMenit: 45, jenisJam: 'Senam', isEffective: false },
        { id: 'rab-flat-1', jp: 1, jam: '07:30 - 08:15', durasiMenit: kbmMinutes, jenisJam: 'KBM', isEffective: true },
        { id: 'rab-flat-2', jp: 2, jam: '08:15 - 09:00', durasiMenit: kbmMinutes, jenisJam: 'KBM', isEffective: true },
        { id: 'rab-flat-3', jp: 3, jam: '09:00 - 09:45', durasiMenit: kbmMinutes, jenisJam: 'KBM', isEffective: true },
        { id: 'rab-flat-ist1', jp: '-', jam: '09:45 - 10:05', durasiMenit: 20, jenisJam: 'Istirahat', isEffective: false },
        { id: 'rab-flat-4', jp: 4, jam: '10:05 - 10:50', durasiMenit: kbmMinutes, jenisJam: 'KBM', isEffective: true },
        { id: 'rab-flat-5', jp: 5, jam: '10:50 - 11:35', durasiMenit: kbmMinutes, jenisJam: 'KBM', isEffective: true },
        { id: 'rab-flat-6', jp: 6, jam: '11:35 - 12:20', durasiMenit: kbmMinutes, jenisJam: 'KBM', isEffective: true },
        { id: 'rab-flat-ist2', jp: '-', jam: '12:20 - 13:00', durasiMenit: 40, jenisJam: 'Istirahat', isEffective: false },
        { id: 'rab-flat-7', jp: 7, jam: '13:00 - 13:45', durasiMenit: kbmMinutes, jenisJam: 'KBM', isEffective: true },
        { id: 'rab-flat-8', jp: 8, jam: '13:45 - 14:30', durasiMenit: kbmMinutes, jenisJam: 'KBM', isEffective: true },
        { id: 'rab-flat-9', jp: 9, jam: '14:30 - 15:15', durasiMenit: kbmMinutes, jenisJam: 'KBM', isEffective: true },
    ], '06:45'),
    Kamis: resequenceAndCascadeSlots([
        { id: 'kam-flat-1', jp: 1, jam: '07:00 - 07:45', durasiMenit: kbmMinutes, jenisJam: 'KBM', isEffective: true },
        { id: 'kam-flat-2', jp: 2, jam: '07:45 - 08:30', durasiMenit: kbmMinutes, jenisJam: 'KBM', isEffective: true },
        { id: 'kam-flat-3', jp: 3, jam: '08:30 - 09:15', durasiMenit: kbmMinutes, jenisJam: 'KBM', isEffective: true },
        { id: 'kam-flat-4', jp: 4, jam: '09:15 - 10:00', durasiMenit: kbmMinutes, jenisJam: 'KBM', isEffective: true },
        { id: 'kam-flat-ist1', jp: '-', jam: '10:00 - 10:20', durasiMenit: 20, jenisJam: 'Istirahat', isEffective: false },
        { id: 'kam-flat-5', jp: 5, jam: '10:20 - 11:05', durasiMenit: kbmMinutes, jenisJam: 'KBM', isEffective: true },
        { id: 'kam-flat-6', jp: 6, jam: '11:05 - 11:50', durasiMenit: kbmMinutes, jenisJam: 'KBM', isEffective: true },
        { id: 'kam-flat-7', jp: 7, jam: '11:50 - 12:35', durasiMenit: kbmMinutes, jenisJam: 'KBM', isEffective: true },
        { id: 'kam-flat-ist2', jp: '-', jam: '12:35 - 13:15', durasiMenit: 40, jenisJam: 'Istirahat', isEffective: false },
        { id: 'kam-flat-8', jp: 8, jam: '13:15 - 14:00', durasiMenit: kbmMinutes, jenisJam: 'KBM', isEffective: true },
        { id: 'kam-flat-9', jp: 9, jam: '14:00 - 14:45', durasiMenit: kbmMinutes, jenisJam: 'KBM', isEffective: true },
    ], '07:00'),
    Jumat: resequenceAndCascadeSlots([
        { id: 'jum-flat-0', jp: 0, jam: '07:00 - 07:45', durasiMenit: 45, jenisJam: 'Literasi', isEffective: false },
        { id: 'jum-flat-1', jp: 1, jam: '07:45 - 08:30', durasiMenit: kbmMinutes, jenisJam: 'KBM', isEffective: true },
        { id: 'jum-flat-2', jp: 2, jam: '08:30 - 09:15', durasiMenit: kbmMinutes, jenisJam: 'KBM', isEffective: true },
        { id: 'jum-flat-3', jp: 3, jam: '09:15 - 10:00', durasiMenit: kbmMinutes, jenisJam: 'KBM', isEffective: true },
        { id: 'jum-flat-ist1', jp: '-', jam: '10:00 - 10:20', durasiMenit: 20, jenisJam: 'Istirahat', isEffective: false },
        { id: 'jum-flat-4', jp: 4, jam: '10:20 - 11:05', durasiMenit: kbmMinutes, jenisJam: 'KBM', isEffective: true },
        { id: 'jum-flat-5', jp: 5, jam: '11:05 - 11:50', durasiMenit: kbmMinutes, jenisJam: 'KBM', isEffective: true },
        { id: 'jum-flat-ist2', jp: '-', jam: '11:50 - 13:00', durasiMenit: 70, jenisJam: 'Istirahat', isEffective: false },
        { id: 'jum-flat-6', jp: 6, jam: '13:00 - 13:45', durasiMenit: kbmMinutes, jenisJam: 'KBM', isEffective: true },
        { id: 'jum-flat-7', jp: 7, jam: '13:45 - 14:30', durasiMenit: kbmMinutes, jenisJam: 'KBM', isEffective: true },
    ], '07:00'),
    Sabtu: resequenceAndCascadeSlots([
        { id: 'sab-flat-1', jp: 1, jam: '07:00 - 07:45', durasiMenit: kbmMinutes, jenisJam: 'KBM', isEffective: true },
        { id: 'sab-flat-2', jp: 2, jam: '07:45 - 08:30', durasiMenit: kbmMinutes, jenisJam: 'KBM', isEffective: true },
        { id: 'sab-flat-3', jp: 3, jam: '08:30 - 09:15', durasiMenit: kbmMinutes, jenisJam: 'KBM', isEffective: true },
        { id: 'sab-flat-ist', jp: '-', jam: '09:15 - 09:35', durasiMenit: 20, jenisJam: 'Istirahat', isEffective: false },
        { id: 'sab-flat-4', jp: 4, jam: '09:35 - 10:20', durasiMenit: kbmMinutes, jenisJam: 'KBM', isEffective: true },
        { id: 'sab-flat-5', jp: 5, jam: '10:20 - 11:05', durasiMenit: kbmMinutes, jenisJam: 'KBM', isEffective: true },
        { id: 'sab-flat-6', jp: 6, jam: '11:05 - 11:50', durasiMenit: kbmMinutes, jenisJam: 'KBM', isEffective: true },
    ], '07:00'),
});

const loadStoredPeriods = (): Record<string, Record<DayName, ScheduleSlot[]>> => {
    try {
        const stored = localStorage.getItem('smk_roster_period_schedules');
        if (stored) {
            return JSON.parse(stored);
        }
    } catch {
        // ignore
    }
    return {};
};

const initialPeriodSchedules = loadStoredPeriods();

export const useRosterJamStore = create<RosterJamStore>((set, get) => ({
    state: {
        selectedSchoolInfoId: '',
        schoolInfoList: [],
        periode: '',
        hariKerja: '5 hari (Senin - Jumat)',
        jpDuration: 45,
        showSabtu: false,
        isSynced: true,
        jenisJamList: [],
        isLoading: true,
        isSaving: false,
        schedules: createEmptySchedule(),
        periodSchedules: initialPeriodSchedules,
        isAddDialogOpen: false,
        selectedDayForAdd: null,
        editingSlot: null,
    },

    setState: (fn) => set((prev) => ({ state: fn(prev.state) })),

    setSchoolInfoList: (list: SchoolInformationResponseModel[]) => {
        const { state } = get();
        if (!list || list.length === 0) return;

        // Cari item aktif atau item pertama
        const activeItem = list.find((s) => s.status) || list[0];
        const activeId = state.selectedSchoolInfoId || activeItem.id_school_information;
        const currentItem = list.find((s) => s.id_school_information === activeId) || activeItem;

        const periodeName = currentItem.periode || '2026/2027';
        const workDays = currentItem.work_days || 5;
        const lessonDur = currentItem.lesson_duration || 45;

        // Ambil jadwal tersimpan untuk periode ini (dari storage/state)
        // JIKA BELUM DIBUAT -> HARUS KOSONG (createEmptySchedule)!
        const targetSchedule =
            state.periodSchedules[activeId] ||
            state.periodSchedules[periodeName] ||
            createEmptySchedule();

        set((prev) => ({
            state: {
                ...prev.state,
                schoolInfoList: list,
                selectedSchoolInfoId: currentItem.id_school_information,
                periode: periodeName,
                hariKerja: workDays === 6 ? '6 hari (Senin - Sabtu)' : '5 hari (Senin - Jumat)',
                showSabtu: workDays === 6,
                jpDuration: lessonDur,
                schedules: targetSchedule,
            },
        }));
    },

    selectPeriod: (idSchoolInfo: string) => {
        const { state } = get();
        const currentKey = state.selectedSchoolInfoId || state.periode;

        // Simpan state saat ini ke periodSchedules terlebih dahulu
        const updatedPeriods = {
            ...state.periodSchedules,
            [currentKey]: state.schedules,
        };

        const targetSchool = state.schoolInfoList.find((s) => s.id_school_information === idSchoolInfo);
        const targetPeriodeName = targetSchool?.periode || idSchoolInfo;
        const workDays = targetSchool?.work_days || 5;
        const lessonDur = targetSchool?.lesson_duration || 45;

        // JIKA BELUM ADA DI DATABASE / STORAGE -> KOSONGKAN JADWAL
        const targetSchedule =
            updatedPeriods[idSchoolInfo] ||
            updatedPeriods[targetPeriodeName] ||
            createEmptySchedule();

        try {
            localStorage.setItem('smk_roster_period_schedules', JSON.stringify(updatedPeriods));
        } catch {
            // ignore
        }

        set((prev) => ({
            state: {
                ...prev.state,
                selectedSchoolInfoId: idSchoolInfo,
                periode: targetPeriodeName,
                hariKerja: workDays === 6 ? '6 hari (Senin - Sabtu)' : '5 hari (Senin - Jumat)',
                showSabtu: workDays === 6,
                jpDuration: lessonDur,
                schedules: targetSchedule,
                periodSchedules: updatedPeriods,
            },
        }));
    },

    setPeriode: (periode: string) => {
        // Fallback backward compatible
        const { state, selectPeriod } = get();
        const match = state.schoolInfoList.find((s) => s.periode === periode || s.id_school_information === periode);
        if (match) {
            selectPeriod(match.id_school_information);
        } else {
            set((prev) => ({ state: { ...prev.state, periode } }));
        }
    },

    deleteSlot: (day, slotId) => {
        set((prev) => {
            const currentList = prev.state.schedules[day] || [];
            const filtered = currentList.filter((s) => s.id !== slotId);
            const updated = resequenceAndCascadeSlots(filtered);
            const newSchedules = { ...prev.state.schedules, [day]: updated };
            const key = prev.state.selectedSchoolInfoId || prev.state.periode;
            const newPeriods = { ...prev.state.periodSchedules, [key]: newSchedules };
            try {
                localStorage.setItem('smk_roster_period_schedules', JSON.stringify(newPeriods));
            } catch {
                // ignore
            }
            return {
                state: {
                    ...prev.state,
                    schedules: newSchedules,
                    periodSchedules: newPeriods,
                },
            };
        });
    },

    moveSlotUp: (day, slotId) => {
        set((prev) => {
            const list = [...(prev.state.schedules[day] || [])];
            const index = list.findIndex((s) => s.id === slotId);
            if (index <= 0) return prev;

            const temp = list[index];
            list[index] = list[index - 1];
            list[index - 1] = temp;

            const updated = resequenceAndCascadeSlots(list);
            const newSchedules = { ...prev.state.schedules, [day]: updated };
            const key = prev.state.selectedSchoolInfoId || prev.state.periode;
            const newPeriods = { ...prev.state.periodSchedules, [key]: newSchedules };
            try {
                localStorage.setItem('smk_roster_period_schedules', JSON.stringify(newPeriods));
            } catch {
                // ignore
            }
            return {
                state: {
                    ...prev.state,
                    schedules: newSchedules,
                    periodSchedules: newPeriods,
                },
            };
        });
    },

    moveSlotDown: (day, slotId) => {
        set((prev) => {
            const list = [...(prev.state.schedules[day] || [])];
            const index = list.findIndex((s) => s.id === slotId);
            if (index === -1 || index >= list.length - 1) return prev;

            const temp = list[index];
            list[index] = list[index + 1];
            list[index + 1] = temp;

            const updated = resequenceAndCascadeSlots(list);
            const newSchedules = { ...prev.state.schedules, [day]: updated };
            const key = prev.state.selectedSchoolInfoId || prev.state.periode;
            const newPeriods = { ...prev.state.periodSchedules, [key]: newSchedules };
            try {
                localStorage.setItem('smk_roster_period_schedules', JSON.stringify(newPeriods));
            } catch {
                // ignore
            }
            return {
                state: {
                    ...prev.state,
                    schedules: newSchedules,
                    periodSchedules: newPeriods,
                },
            };
        });
    },

    addSlot: (day, slot) => {
        set((prev) => {
            const list = [...(prev.state.schedules[day] || [])];
            const newSlot: ScheduleSlot = {
                ...slot,
                id: `${day.toLowerCase()}-${Date.now()}`,
            };
            list.push(newSlot);
            const updated = resequenceAndCascadeSlots(list);
            const newSchedules = { ...prev.state.schedules, [day]: updated };
            const key = prev.state.selectedSchoolInfoId || prev.state.periode;
            const newPeriods = { ...prev.state.periodSchedules, [key]: newSchedules };
            try {
                localStorage.setItem('smk_roster_period_schedules', JSON.stringify(newPeriods));
            } catch {
                // ignore
            }
            return {
                state: {
                    ...prev.state,
                    schedules: newSchedules,
                    periodSchedules: newPeriods,
                },
            };
        });
    },

    updateSlot: (day, slotId, updates) => {
        set((prev) => {
            const list = [...(prev.state.schedules[day] || [])];
            const index = list.findIndex((s) => s.id === slotId);
            if (index === -1) return prev;

            list[index] = {
                ...list[index],
                ...updates,
            };

            const updated = resequenceAndCascadeSlots(list);
            const newSchedules = { ...prev.state.schedules, [day]: updated };
            const key = prev.state.selectedSchoolInfoId || prev.state.periode;
            const newPeriods = { ...prev.state.periodSchedules, [key]: newSchedules };
            try {
                localStorage.setItem('smk_roster_period_schedules', JSON.stringify(newPeriods));
            } catch {
                // ignore
            }
            return {
                state: {
                    ...prev.state,
                    schedules: newSchedules,
                    periodSchedules: newPeriods,
                },
            };
        });
    },

    updateSlotDuration: (day, slotId, minutes) => {
        const { updateSlot } = get();
        const validMins = Math.max(5, Math.min(240, Number(minutes) || 45));
        updateSlot(day, slotId, { durasiMenit: validMins });
    },

    updateSlotCategory: (day, slotId, category) => {
        const { updateSlot } = get();
        updateSlot(day, slotId, { jenisJam: category });
    },

    setDayStartTime: (day, startTime) => {
        set((prev) => {
            const list = [...(prev.state.schedules[day] || [])];
            if (list.length === 0) return prev;
            const updated = resequenceAndCascadeSlots(list, startTime);
            const newSchedules = { ...prev.state.schedules, [day]: updated };
            const key = prev.state.selectedSchoolInfoId || prev.state.periode;
            const newPeriods = { ...prev.state.periodSchedules, [key]: newSchedules };
            try {
                localStorage.setItem('smk_roster_period_schedules', JSON.stringify(newPeriods));
            } catch {
                // ignore
            }
            return {
                state: {
                    ...prev.state,
                    schedules: newSchedules,
                    periodSchedules: newPeriods,
                },
            };
        });
    },

    setDayAllKbmDuration: (day, minutes) => {
        set((prev) => {
            const list = [...(prev.state.schedules[day] || [])];
            if (list.length === 0) return prev;
            const validMins = Math.max(5, Math.min(180, Number(minutes) || 45));
            const updatedList = list.map((s) => {
                const lower = (s.jenisJam || '').toLowerCase();
                if (lower.includes('kbm') || lower.includes('belajar')) {
                    return { ...s, durasiMenit: validMins };
                }
                return s;
            });
            const updated = resequenceAndCascadeSlots(updatedList);
            const newSchedules = { ...prev.state.schedules, [day]: updated };
            const key = prev.state.selectedSchoolInfoId || prev.state.periode;
            const newPeriods = { ...prev.state.periodSchedules, [key]: newSchedules };
            try {
                localStorage.setItem('smk_roster_period_schedules', JSON.stringify(newPeriods));
            } catch {
                // ignore
            }
            return {
                state: {
                    ...prev.state,
                    schedules: newSchedules,
                    periodSchedules: newPeriods,
                },
            };
        });
    },

    openAddDialog: (day) => {
        set((prev) => ({
            state: {
                ...prev.state,
                isAddDialogOpen: true,
                selectedDayForAdd: day,
                editingSlot: null,
            },
        }));
    },

    closeAddDialog: () => {
        set((prev) => ({
            state: {
                ...prev.state,
                isAddDialogOpen: false,
                selectedDayForAdd: null,
            },
        }));
    },

    openEditDialog: (day, slot) => {
        set((prev) => ({
            state: {
                ...prev.state,
                editingSlot: { day, slot },
            },
        }));
    },

    closeEditDialog: () => {
        set((prev) => ({
            state: {
                ...prev.state,
                editingSlot: null,
            },
        }));
    },

    applyXaveriusTemplate: () => {
        const sched = createXaveriusRealSchedule();
        const { state } = get();
        const key = state.selectedSchoolInfoId || state.periode;
        set((prev) => {
            const newPeriods = { ...prev.state.periodSchedules, [key]: sched };
            try {
                localStorage.setItem('smk_roster_period_schedules', JSON.stringify(newPeriods));
            } catch {
                // ignore
            }
            return {
                state: {
                    ...prev.state,
                    schedules: sched,
                    periodSchedules: newPeriods,
                },
            };
        });
    },

    applyFlatTemplate: (duration = 45) => {
        const sched = createFlat45Schedule(duration);
        const { state } = get();
        const key = state.selectedSchoolInfoId || state.periode;
        set((prev) => {
            const newPeriods = { ...prev.state.periodSchedules, [key]: sched };
            try {
                localStorage.setItem('smk_roster_period_schedules', JSON.stringify(newPeriods));
            } catch {
                // ignore
            }
            return {
                state: {
                    ...prev.state,
                    jpDuration: duration,
                    schedules: sched,
                    periodSchedules: newPeriods,
                },
            };
        });
    },

    clearCurrentSchedule: () => {
        const empty = createEmptySchedule();
        const { state } = get();
        const key = state.selectedSchoolInfoId || state.periode;
        set((prev) => {
            const newPeriods = { ...prev.state.periodSchedules, [key]: empty };
            try {
                localStorage.setItem('smk_roster_period_schedules', JSON.stringify(newPeriods));
            } catch {
                // ignore
            }
            return {
                state: {
                    ...prev.state,
                    schedules: empty,
                    periodSchedules: newPeriods,
                },
            };
        });
    },

    adjustAssemblyReduction: () => {
        get().applyXaveriusTemplate();
    },

    toggleShowSabtu: () => {
        set((prev) => ({
            state: {
                ...prev.state,
                showSabtu: !prev.state.showSabtu,
            },
        }));
    },
}));
