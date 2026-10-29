import { create } from 'zustand';
import type { JenisJamResponseModel } from '@api/jenisJam/model';

export interface ScheduleSlot {
    id: string;
    jp: string | number;
    jam: string; // e.g. "07:45 - 08:00"
    jenisJam: string; // 'Upacara' | 'KBM' | 'Istirahat' | 'Ekstra' | custom
    isEffective?: boolean;
}

export type DayName = 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';

export interface RosterJamState {
    periode: string;
    hariKerja: string;
    jpDuration: number;
    isSynced: boolean;
    jenisJamList: JenisJamResponseModel[];
    isLoading: boolean;
    isSaving: boolean;
    schedules: Record<DayName, ScheduleSlot[]>;
    // Dialog state
    isAddDialogOpen: boolean;
    selectedDayForAdd: DayName | null;
}

export interface RosterJamStore {
    state: RosterJamState;
    setState: (fn: (prev: RosterJamState) => RosterJamState) => void;
    deleteSlot: (day: DayName, slotId: string) => void;
    moveSlotUp: (day: DayName, slotId: string) => void;
    moveSlotDown: (day: DayName, slotId: string) => void;
    addSlot: (day: DayName, slot: Omit<ScheduleSlot, 'id'>) => void;
    openAddDialog: (day: DayName) => void;
    closeAddDialog: () => void;
}

const initialSchedules: Record<DayName, ScheduleSlot[]> = {
    Senin: [
        { id: 'senin-1', jp: 0, jam: '07:45 - 08:00', jenisJam: 'Upacara', isEffective: false },
        { id: 'senin-2', jp: 1, jam: '08:00 - 08:45', jenisJam: 'KBM', isEffective: true },
        { id: 'senin-3', jp: 2, jam: '08:45 - 09:30', jenisJam: 'KBM', isEffective: true },
        { id: 'senin-4', jp: '-', jam: '09:30 - 10:00', jenisJam: 'Istirahat', isEffective: false },
        { id: 'senin-5', jp: 3, jam: '10:00 - 10:45', jenisJam: 'KBM', isEffective: true },
        { id: 'senin-6', jp: 4, jam: '10:45 - 11:30', jenisJam: 'KBM', isEffective: true },
        { id: 'senin-7', jp: '-', jam: '11:30 - 12:15', jenisJam: 'Ekstra', isEffective: false },
    ],
    Selasa: [
        { id: 'selasa-1', jp: '-', jam: '07:45 - 08:00', jenisJam: 'Upacara', isEffective: false },
        { id: 'selasa-2', jp: 0, jam: '08:00 - 08:45', jenisJam: 'KBM', isEffective: true },
        { id: 'selasa-3', jp: 1, jam: '08:45 - 09:30', jenisJam: 'KBM', isEffective: true },
        { id: 'selasa-4', jp: 2, jam: '09:30 - 10:00', jenisJam: 'Istirahat', isEffective: false },
        { id: 'selasa-5', jp: '-', jam: '10:00 - 10:45', jenisJam: 'KBM', isEffective: true },
        { id: 'selasa-6', jp: 3, jam: '10:45 - 11:30', jenisJam: 'KBM', isEffective: true },
        { id: 'selasa-7', jp: 4, jam: '11:30 - 12:15', jenisJam: 'Ekstra', isEffective: false },
    ],
    Rabu: [
        { id: 'rabu-1', jp: '-', jam: '07:45 - 08:00', jenisJam: 'Upacara', isEffective: false },
        { id: 'rabu-2', jp: 0, jam: '08:00 - 08:45', jenisJam: 'KBM', isEffective: true },
        { id: 'rabu-3', jp: 1, jam: '08:45 - 09:30', jenisJam: 'KBM', isEffective: true },
        { id: 'rabu-4', jp: 2, jam: '09:30 - 10:00', jenisJam: 'Istirahat', isEffective: false },
        { id: 'rabu-5', jp: '-', jam: '10:00 - 10:45', jenisJam: 'KBM', isEffective: true },
        { id: 'rabu-6', jp: 3, jam: '10:45 - 11:30', jenisJam: 'KBM', isEffective: true },
        { id: 'rabu-7', jp: 4, jam: '11:30 - 12:15', jenisJam: 'Ekstra', isEffective: false },
    ],
    Kamis: [
        { id: 'kamis-1', jp: '-', jam: '07:45 - 08:00', jenisJam: 'Upacara', isEffective: false },
        { id: 'kamis-2', jp: 0, jam: '08:00 - 08:45', jenisJam: 'KBM', isEffective: true },
        { id: 'kamis-3', jp: 1, jam: '08:45 - 09:30', jenisJam: 'KBM', isEffective: true },
        { id: 'kamis-4', jp: 2, jam: '09:30 - 10:00', jenisJam: 'Istirahat', isEffective: false },
        { id: 'kamis-5', jp: '-', jam: '10:00 - 10:45', jenisJam: 'KBM', isEffective: true },
        { id: 'kamis-6', jp: 3, jam: '10:45 - 11:30', jenisJam: 'KBM', isEffective: true },
        { id: 'kamis-7', jp: 4, jam: '11:30 - 12:15', jenisJam: 'Ekstra', isEffective: false },
    ],
    Jumat: [
        { id: 'jumat-1', jp: '-', jam: '07:45 - 08:00', jenisJam: 'Upacara', isEffective: false },
        { id: 'jumat-2', jp: 0, jam: '08:00 - 08:45', jenisJam: 'KBM', isEffective: true },
        { id: 'jumat-3', jp: 1, jam: '08:45 - 09:30', jenisJam: 'KBM', isEffective: true },
        { id: 'jumat-4', jp: 2, jam: '09:30 - 10:00', jenisJam: 'Istirahat', isEffective: false },
        { id: 'jumat-5', jp: '-', jam: '10:00 - 10:45', jenisJam: 'KBM', isEffective: true },
        { id: 'jumat-6', jp: 3, jam: '10:45 - 11:30', jenisJam: 'KBM', isEffective: true },
        { id: 'jumat-7', jp: 4, jam: '11:30 - 12:15', jenisJam: 'Ekstra', isEffective: false },
    ],
    Sabtu: [
        { id: 'sabtu-1', jp: '-', jam: '07:45 - 08:00', jenisJam: 'Upacara', isEffective: false },
        { id: 'sabtu-2', jp: 0, jam: '08:00 - 08:45', jenisJam: 'KBM', isEffective: true },
        { id: 'sabtu-3', jp: 1, jam: '08:45 - 09:30', jenisJam: 'KBM', isEffective: true },
        { id: 'sabtu-4', jp: 2, jam: '09:30 - 10:00', jenisJam: 'Istirahat', isEffective: false },
        { id: 'sabtu-5', jp: '-', jam: '10:00 - 10:45', jenisJam: 'KBM', isEffective: true },
        { id: 'sabtu-6', jp: 3, jam: '10:45 - 11:30', jenisJam: 'KBM', isEffective: true },
        { id: 'sabtu-7', jp: 4, jam: '11:30 - 12:15', jenisJam: 'Ekstra', isEffective: false },
    ],
};

export const useRosterJamStore = create<RosterJamStore>((set) => ({
    state: {
        periode: '2026/2027 (Ganjil)',
        hariKerja: '6 hari (Senin - Sabtu)',
        jpDuration: 45,
        isSynced: true,
        jenisJamList: [],
        isLoading: false,
        isSaving: false,
        schedules: initialSchedules,
        isAddDialogOpen: false,
        selectedDayForAdd: null,
    },
    setState: (fn) => set((prev) => ({ state: fn(prev.state) })),

    deleteSlot: (day, slotId) => {
        set((prev) => {
            const currentList = prev.state.schedules[day] || [];
            const updated = currentList.filter((s) => s.id !== slotId);
            return {
                state: {
                    ...prev.state,
                    schedules: {
                        ...prev.state.schedules,
                        [day]: updated,
                    },
                },
            };
        });
    },

    moveSlotUp: (day, slotId) => {
        set((prev) => {
            const list = [...(prev.state.schedules[day] || [])];
            const index = list.findIndex((s) => s.id === slotId);
            if (index <= 0) return prev; // already at the top

            const temp = list[index];
            list[index] = list[index - 1];
            list[index - 1] = temp;

            return {
                state: {
                    ...prev.state,
                    schedules: {
                        ...prev.state.schedules,
                        [day]: list,
                    },
                },
            };
        });
    },

    moveSlotDown: (day, slotId) => {
        set((prev) => {
            const list = [...(prev.state.schedules[day] || [])];
            const index = list.findIndex((s) => s.id === slotId);
            if (index === -1 || index >= list.length - 1) return prev; // already at bottom

            const temp = list[index];
            list[index] = list[index + 1];
            list[index + 1] = temp;

            return {
                state: {
                    ...prev.state,
                    schedules: {
                        ...prev.state.schedules,
                        [day]: list,
                    },
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
            return {
                state: {
                    ...prev.state,
                    schedules: {
                        ...prev.state.schedules,
                        [day]: list,
                    },
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
}));
