import { create } from 'zustand';
import {
    DEFAULT_GURU_PIKET,
    JP_RECOMMENDATION_RULES,
} from '../constants/defaultData';
import type {
    ActivityCategory,
    ClassColumn,
    DayName,
    DragPayload,
    GuruPiketEntry,
    JpRecommendationRule,
    ScheduleApprovalData,
    ScheduleCell,
    ScheduleConflict,
    ScheduleRow,
    ScheduleViewMode,
    TeacherCodeEntry,
    TeacherScheduleRequest,
    PreferredScheduleSlot,
    TeacherSubjectOption,
} from '../types';
import {
    MatrixScheduleService,
    TeacherScheduleRequestService,
    RosterScheduleService,
    CategoryExtraService,
    type CategoryExtraResponseModel,
} from '@api/schedule/service';
import TeachingService from '@api/teaching/service';
import type { TeachingTeacherRowModel } from '@api/teaching/model';
import SchoolInformationService from '@api/schoolinformation/service';
import type { SchoolInformationResponseModel } from '@api/schoolinformation/model';
import ClassService from '@api/class/service';
import EffectiveWeekService from '@api/effectiveweek/service';
import type { EffectiveWeekResponseModel } from '@api/effectiveweek/model';
import { snackbar } from '@utils/snackbar';

const matrixService = new MatrixScheduleService();
const teacherRequestService = new TeacherScheduleRequestService();
const rosterScheduleService = new RosterScheduleService();
const categoryExtraService = new CategoryExtraService();
const teachingService = new TeachingService();
const schoolInfoService = new SchoolInformationService();
const classService = new ClassService();
const effectiveWeekService = new EffectiveWeekService();

export const DEFAULT_TEACHER_REQUESTS: TeacherScheduleRequest[] = [
    {
        id: 'req-1',
        teacherCode: 1,
        teacherName: 'Admin Xaverius',
        subjectName: 'Bahasa Indonesia (IND-03)',
        preferredSlots: [
            { day: 'Senin', jam: 'Jam ke 1-3 (07:45 - 09:30)', timeRange: '07:45 - 09:30', jpStart: 1, jpEnd: 3 },
        ],
        status: 'VALID',
        statusText: '✓ Tersedia & Bebas Bentrok',
        notes: 'Preferensi jam mengajar sesi pagi',
    },
    {
        id: 'req-2',
        teacherCode: 2,
        teacherName: 'Jefli Jonathan',
        subjectName: 'Matematika (MAT-04)',
        preferredSlots: [
            { day: 'Senin', jam: 'Jam ke 4-6 (09:45 - 11:50)', timeRange: '09:45 - 11:50', jpStart: 4, jpEnd: 6 },
        ],
        status: 'VALID',
        statusText: '✓ Tersedia & Bebas Bentrok',
        notes: 'Preferensi blok jam setelah istirahat',
    },
];

export interface ScheduleState {
    classes: ClassColumn[];
    teachers: TeacherCodeEntry[];
    rows: ScheduleRow[];
    guruPiket: GuruPiketEntry[];
    approvalData: ScheduleApprovalData;
    recommendations: JpRecommendationRule[];

    // View mode: Matriks Semua Kelas vs Input Per-Kelas
    viewMode: ScheduleViewMode;
    selectedClassForInput: string;

    // Database syncing
    schoolInformations: SchoolInformationResponseModel[];
    selectedSchoolInfoId: string;
    idSchoolInformation: string;
    teachingStaff: TeachingTeacherRowModel[];
    isLoadingDatabase: boolean;

    // Filters & Search
    selectedDayFilter: 'Semua' | DayName;
    selectedGradeFilter: 'Semua' | 'X' | 'XI' | 'XII';
    selectedClassFilter: string;
    isClassListModalOpen: boolean;
    searchQuery: string;

    // Computed Conflicts
    conflicts: ScheduleConflict[];

    // Drag and Drop active item
    draggedItem: DragPayload | null;

    // Popover / Dialog state
    quickEditCell: {
        rowId: string;
        className: string;
        cell: ScheduleCell;
    } | null;
    isRecommendationModalOpen: boolean;
    isPrintDialogOpen: boolean;
    isSaving: boolean;

    // Teacher Schedule Requests
    teacherRequests: TeacherScheduleRequest[];
    isLoadingRequests: boolean;
    isRequestDialogOpen: boolean;
    editingRequest: TeacherScheduleRequest | null;
    isGenerateScheduleDialogOpen: boolean;

    // Category Extras
    categoryExtras: CategoryExtraResponseModel[];

    // Alokasi Jam & JP Berbasis Jurusan dari Kurikulum (Effective Weeks)
    effectiveWeekAllocations: EffectiveWeekResponseModel[];
}

export interface ScheduleActions {
    setViewMode: (mode: ScheduleViewMode) => void;
    setSelectedClassForInput: (className: string) => void;
    setSelectedDayFilter: (day: 'Semua' | DayName) => void;
    setSelectedGradeFilter: (grade: 'Semua' | 'X' | 'XI' | 'XII') => void;
    setSelectedClassFilter: (className: string) => void;
    setIsClassListModalOpen: (open: boolean) => void;
    setSearchQuery: (q: string) => void;
    setDraggedItem: (item: DragPayload | null) => void;
    setQuickEditCell: (
        cell: { rowId: string; className: string; cell: ScheduleCell } | null
    ) => void;
    setRecommendationModalOpen: (open: boolean) => void;
    setPrintDialogOpen: (open: boolean) => void;

    // Guru Piket Actions
    setGuruPiket: (guruPiket: GuruPiketEntry[]) => void;
    addGuruPiket: (entry: Omit<GuruPiketEntry, 'id'>) => void;
    updateGuruPiket: (index: number, entry: Partial<GuruPiketEntry>) => void;
    deleteGuruPiket: (index: number) => void;

    // Approval / Pengesahan Kepala Sekolah Actions
    setApprovalData: (data: Partial<ScheduleApprovalData>) => void;
    confirmApproval: (googleDriveUrl: string, notes?: string) => Promise<boolean>;
    revokeApproval: () => Promise<boolean>;

    // Request Dialog Actions
    setIsRequestDialogOpen: (open: boolean) => void;
    setEditingRequest: (req: TeacherScheduleRequest | null) => void;
    setIsGenerateScheduleDialogOpen: (open: boolean) => void;
    fetchTeacherRequests: () => Promise<void>;
    createTeacherRequest: (req: Omit<TeacherScheduleRequest, 'id'>) => Promise<boolean>;
    updateTeacherRequest: (id: string, updates: Partial<TeacherScheduleRequest>) => Promise<boolean>;
    deleteTeacherRequest: (id: string) => Promise<boolean>;
    validateTeacherRequest: (
        teacherCode: number,
        slots: PreferredScheduleSlot[]
    ) => { isValid: boolean; conflictReason?: string };

    // Advanced Random Conflict-Free Generator
    generateRandomConflictFreeSchedule: (options: {
        prioritizeRequests: boolean;
        includeSpecialActivities: boolean;
        balanceDistribution: boolean;
        randomizeTeachers: boolean;
    }) => {
        success: boolean;
        totalFilled: number;
        conflictsCount: number;
        requestsFulfilled: number;
        generatedRows: ScheduleRow[];
    };
    applyGeneratedRows: (rows: ScheduleRow[]) => Promise<void>;

    // Cell Operations
    setCellTeacher: (
        rowId: string,
        className: string,
        teacherCode: number | null,
        subjectCode?: string
    ) => void;
    setBatchCellTeacher: (
        rowIds: string[],
        className: string,
        teacherCode: number | null,
        subjectCode?: string
    ) => void;
    triggerAutoSave: () => void;
    swapCells: (
        fromRowId: string,
        fromClassName: string,
        toRowId: string,
        toClassName: string
    ) => void;

    // Row Operations
    applySpecialActivityToRow: (
        rowId: string,
        activityType: ActivityCategory,
        title: string
    ) => void;
    removeSpecialActivityFromRow: (rowId: string) => void;
    updateRowExtraCategory: (rowId: string, extraName: string) => void;
    setClassExtraActivity: (rowId: string, className: string, extraName: string) => void;

    // Teacher Operations
    updateTeacher: (code: number, updates: Partial<TeacherCodeEntry>) => void;
    addTeacher: (newTeacher: Omit<TeacherCodeEntry, 'code'> & { code?: number }) => void;
    deleteTeacher: (code: number) => void;

    // Generator & Database Integration
    setSchoolInformationId: (id: string) => Promise<void>;
    fetchSchoolInformations: () => Promise<void>;
    fetchCategoryExtras: () => Promise<void>;
    fetchEffectiveWeekAllocations: () => Promise<void>;
    fetchClassesFromDatabase: (schoolInfoId?: string) => Promise<void>;
    loadScheduleFromDatabase: (customSchoolInfoId?: string) => Promise<void>;
    syncFromDatabaseTeachingStaff: () => Promise<void>;
    generateTableFromRosterJam: () => Promise<void>;
    autoScheduleSmart: () => void;
    resetToOfficialTemplate: () => Promise<void>;
    saveSchedule: () => Promise<void>;
}

/**
 * Helper untuk mengurutkan kelas secara logis dan standar:
 * 1. Urutan Tingkat / Kelas: X (10) -> XI (11) -> XII (12)
 * 2. Urutan Jurusan / Nama: AKL -> DKV -> MP -> TKJT, dsb.
 */
export const sortClassesByGradeAndName = (a: ClassColumn, b: ClassColumn): number => {
    const getGradeWeight = (cls: ClassColumn): number => {
        const g = (cls.grade || '').trim().toUpperCase();
        const n = (cls.name || '').trim().toUpperCase();
        if (g === 'X' || g === '10' || n.startsWith('10') || n.startsWith('X ') || n.startsWith('X-')) return 10;
        if (g === 'XI' || g === '11' || n.startsWith('11') || n.startsWith('XI ') || n.startsWith('XI-')) return 11;
        if (g === 'XII' || g === '12' || n.startsWith('12') || n.startsWith('XII ') || n.startsWith('XII-')) return 12;
        return 99;
    };

    const weightA = getGradeWeight(a);
    const weightB = getGradeWeight(b);
    if (weightA !== weightB) return weightA - weightB;

    return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
};

const findTeacherByCode = (
    teachers: TeacherCodeEntry[],
    code: number | null
): TeacherCodeEntry | undefined => {
    if (!code) return undefined;
    return teachers.find((t) => t.code === code);
};

const calculateConflicts = (
    rows: ScheduleRow[],
    teachers: TeacherCodeEntry[],
    guruPiket?: GuruPiketEntry[]
): ScheduleConflict[] => {
    const conflicts: ScheduleConflict[] = [];
    const activeGuruPiket = guruPiket ?? (useScheduleStore?.getState ? useScheduleStore.getState().guruPiket : []);

    rows.forEach((row) => {
        if (row.specialActivity) return;

        const teacherClassesMap: Record<number, string[]> = {};

        Object.entries(row.classCells).forEach(([className, cell]) => {
            if (cell.teacherCode) {
                if (!teacherClassesMap[cell.teacherCode]) {
                    teacherClassesMap[cell.teacherCode] = [];
                }
                teacherClassesMap[cell.teacherCode].push(className);
            }
        });

        Object.entries(teacherClassesMap).forEach(([codeStr, classList]) => {
            const code = Number(codeStr);
            const teacher = findTeacherByCode(teachers, code);
            const teacherName = teacher?.name || `Guru #${code}`;

            // 1. Bentrok Mengajar Ganda (Double Booking)
            if (classList.length > 1) {
                conflicts.push({
                    day: row.day,
                    jp: row.jp,
                    timeRange: row.timeRange,
                    teacherCode: code,
                    teacherName,
                    conflictedClasses: classList,
                    conflictType: 'TEACHER_DOUBLE_BOOKING',
                    conflictReason: `Bentrok Mengajar Ganda: Guru #${code} (${teacherName}) mengajar bersamaan di kelas ${classList.join(' & ')}`,
                });
            }

            // 2. Bentrok Tugas Piket (Piket Conflict)
            // Aturan user: misal 4 JP berarti slot KBM 1-4 bentrok jika mengajar.
            // Sisanya (> 4 JP) TIDAK BENTROK jika dia guru.
            const rowJpNum = typeof row.jp === 'number' ? row.jp : parseInt(String(row.jp), 10);
            if (!isNaN(rowJpNum) && rowJpNum > 0 && activeGuruPiket && activeGuruPiket.length > 0) {
                const matchingPiket = activeGuruPiket.find((p) => {
                    if (p.hari !== row.day) return false;
                    if (p.teacherCode && p.teacherCode === code) return true;
                    if (teacher?.name && p.name) {
                        const pClean = p.name.toLowerCase().trim();
                        const tClean = teacher.name.toLowerCase().trim();
                        return pClean.includes(tClean) || tClean.includes(pClean);
                    }
                    return false;
                });

                if (matchingPiket) {
                    const piketMaxJp = Number(matchingPiket.jumlahJp) || 4;
                    // Bentrok hanya jika mengajar di slot KBM 1 s/d piketMaxJp
                    if (rowJpNum <= piketMaxJp) {
                        conflicts.push({
                            day: row.day,
                            jp: row.jp,
                            timeRange: row.timeRange,
                            teacherCode: code,
                            teacherName,
                            conflictedClasses: classList,
                            conflictType: 'PIKET_CONFLICT',
                            conflictReason: `Bentrok Tugas Piket: ${teacherName} bertugas piket hari ${row.day} (Slot KBM 1-${piketMaxJp}), tidak dapat mengajar di ${classList.join(', ')}`,
                        });
                    }
                    // Jika rowJpNum > piketMaxJp: TIDAK BENTROK (sisanya bebas mengajar)
                }
            }
        });
    });

    return conflicts;
};

const buildEmptyClassCells = (classes: ClassColumn[]): Record<string, ScheduleCell> => {
    const cells: Record<string, ScheduleCell> = {};
    classes.forEach((c) => {
        cells[c.name] = { teacherCode: null };
    });
    return cells;
};

const getStoredRosterData = (schoolInfoId?: string, periode?: string) => {
    try {
        const raw = localStorage.getItem('smk_roster_period_schedules');
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (schoolInfoId && parsed[schoolInfoId]) return parsed[schoolInfoId];
        if (periode && parsed[periode]) return parsed[periode];
        const keys = Object.keys(parsed);
        if (keys.length > 0) return parsed[keys[0]];
        return null;
    } catch {
        return null;
    }
};

const buildScheduleRowsFromRoster = (
    rosterData: Record<string, any[]> | null,
    classes: ClassColumn[]
): ScheduleRow[] => {
    const daysOrder: DayName[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const rows: ScheduleRow[] = [];

    const specialColorMap: Record<string, { bg: string; text: string; border: string }> = {
        UPACARA: { bg: '#ede9fe', text: '#5b21b6', border: '#c4b5fd' },
        SENAM: { bg: '#e0f2fe', text: '#075985', border: '#bae6fd' },
        LITERASI: { bg: '#fef9c3', text: '#854d0e', border: '#fef08a' },
        ISTIRAHAT: { bg: '#fef3c7', text: '#92400e', border: '#fde68a' },
        EKSTRA_WAJIB: { bg: '#dcfce7', text: '#166534', border: '#bbf7d0' },
        EKSTRA_PILIHAN: { bg: '#ffedd5', text: '#9a3412', border: '#fed7aa' },
        PRAMUKA: { bg: '#fef2f2', text: '#991b1b', border: '#fecaca' },
        KBM: { bg: '#ffffff', text: '#0f172a', border: '#e2e8f0' },
    };

    if (rosterData && typeof rosterData === 'object' && Object.keys(rosterData).length > 0) {
        daysOrder.forEach((day) => {
            const slots = rosterData[day];
            if (Array.isArray(slots) && slots.length > 0) {
                slots.forEach((slot: any, idx: number) => {
                    const rowId = `row-${day.toLowerCase()}-${slot.jp ?? idx}-${idx}`;
                    const jenisRaw = (slot.jenisJam || slot.activityType || 'KBM').toString().trim().toUpperCase();
                    const isKbm = jenisRaw === 'KBM' || jenisRaw.includes('KBM');

                    let specialActivity = null;
                    if (!isKbm) {
                        let activityType: ActivityCategory = 'UPACARA';
                        if (jenisRaw.includes('SENAM')) activityType = 'SENAM';
                        else if (jenisRaw.includes('LITERASI')) activityType = 'LITERASI';
                        else if (jenisRaw.includes('ISTIRAHAT')) activityType = 'ISTIRAHAT';
                        else if (jenisRaw.includes('PRAMUKA')) activityType = 'PRAMUKA';
                        else if (jenisRaw.includes('PILIHAN')) activityType = 'EKSTRA_PILIHAN';
                        else if (jenisRaw.includes('EKSTRA')) activityType = 'EKSTRA_WAJIB';

                        const isEkstra = activityType === 'EKSTRA_WAJIB' || activityType === 'EKSTRA_PILIHAN' || activityType === 'PRAMUKA';
                        specialActivity = {
                            isSpecial: true as const,
                            activityType,
                            title: isEkstra ? 'EKSTRA' : (slot.jenisJam || jenisRaw),
                            subtitle: isEkstra ? (slot.extraCategory || slot.kategoriEkstra || (jenisRaw.includes('PRAMUKA') ? 'Pramuka' : 'Pramuka')) : undefined,
                            fullSpan: true,
                            colorScheme: specialColorMap[activityType] || specialColorMap.UPACARA,
                        };
                    }

                    rows.push({
                        id: rowId,
                        day,
                        jp: slot.jp !== undefined ? slot.jp : idx + 1,
                        timeRange: slot.jam || slot.timeRange || '07:00 - 07:45',
                        durasiMenit: Number(slot.durasiMenit || 45),
                        specialActivity,
                        classCells: buildEmptyClassCells(classes),
                    });
                });
            }
        });
    }

    // Jika roster jam belajar belum diisi sama sekali, biarkan kosong murni (tidak membuat baris fiktif)
    return rows;
};

const saveMatrixToLocalStorage = (schoolInfoId: string, rows: ScheduleRow[]) => {
    try {
        if (!schoolInfoId) return;
        localStorage.setItem(`smk_matrix_schedule_${schoolInfoId}`, JSON.stringify(rows));
    } catch (e) {
        console.warn('Gagal simpan matriks ke local storage:', e);
    }
};

const getMatrixFromLocalStorage = (schoolInfoId: string): ScheduleRow[] | null => {
    try {
        if (!schoolInfoId) return null;
        const raw = localStorage.getItem(`smk_matrix_schedule_${schoolInfoId}`);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

let autoSaveScheduleTimer: any = null;

const mapTeachingStaffToTeacherEntries = (staffList: TeachingTeacherRowModel[]): TeacherCodeEntry[] => {
    const result: TeacherCodeEntry[] = [];
    let codeCounter = 1;

    staffList.forEach((teacher) => {
        const fullName = `${teacher.first_name || ''} ${teacher.last_name || ''}`.trim() || 'Guru Pengajar';

        const allAssignedClasses: string[] = [];
        const allAllowedMajors = new Set<string>();
        const allAllowedGrades = new Set<string>();

        // Petakan semua mapel yang diajar guru ini dari menu Pengajaran
        const teacherSubjects: TeacherSubjectOption[] = (teacher.subjects || []).map((subj, sIdx) => {
            const isKejuruan =
                ((subj as any).category_name || '').toLowerCase().includes('kejuruan') ||
                (subj.subject_name || '').toLowerCase().includes('akuntansi') ||
                (subj.subject_name || '').toLowerCase().includes('jaringan') ||
                (subj.subject_name || '').toLowerCase().includes('komputer') ||
                (subj.subject_name || '').toLowerCase().includes('dkv') ||
                (subj.subject_name || '').toLowerCase().includes('tkj');

            const assignedClassNames: string[] = (subj.classes || [])
                .map((c) => c.class_name || '')
                .filter(Boolean);

            const allowedMajorsSet = new Set<string>();
            const allowedGradesSet = new Set<string>();

            assignedClassNames.forEach((cn) => {
                allAssignedClasses.push(cn);
                const parts = cn.trim().split(/\s+/);
                if (parts.length > 1) {
                    allowedGradesSet.add(parts[0].toUpperCase());
                    allAllowedGrades.add(parts[0].toUpperCase());
                    const m = parts.slice(1).join(' ').toUpperCase();
                    allowedMajorsSet.add(m);
                    allAllowedMajors.add(m);
                } else if (parts.length === 1) {
                    allowedMajorsSet.add(parts[0].toUpperCase());
                    allAllowedGrades.add(parts[0].toUpperCase());
                }
            });

            return {
                idSubject: subj.id_subject || subj.id_teacher_subject,
                subjectName: subj.subject_name || 'Mata Pelajaran',
                subjectCode: subj.code_subject || `MP-${sIdx + 1}`,
                category: isKejuruan ? 'KEJURUAN' : 'UMUM',
                targetJp: subj.jp_amount || 4,
                assignedClassNames,
                allowedMajors: Array.from(allowedMajorsSet),
                allowedGrades: Array.from(allowedGradesSet),
            };
        });

        const primarySubj = teacherSubjects[0] || {
            subjectName: 'Mata Pelajaran',
            subjectCode: `MP-${codeCounter}`,
            category: 'UMUM' as const,
            targetJp: 24,
        };

        const totalTargetJp = teacherSubjects.reduce((acc, s) => acc + (s.targetJp || 0), 0) || 24;

        // Setiap guru HANYA memiliki SATU nomor kode urut unik (#1, #2, dst.)
        result.push({
            code: codeCounter++,
            teacherId: teacher.id_teacher,
            name: fullName,
            niy: teacher.niy || undefined,
            subjectName: primarySubj.subjectName,
            subjectCode: primarySubj.subjectCode,
            subjects: teacherSubjects,
            assignedClassNames: allAssignedClasses,
            allowedMajors: Array.from(allAllowedMajors),
            allowedGrades: Array.from(allAllowedGrades),
            category: primarySubj.category,
            recommendedJp: primarySubj.category === 'KEJURUAN' ? 'JP 6-8 (Blok Praktik Siang)' : 'JP 1-3 (Pagi)',
            recommendedJpRange: primarySubj.category === 'KEJURUAN' ? [6, 8] : [1, 3],
            totalJpAssigned: 0,
            targetJp: totalTargetJp,
            color: primarySubj.category === 'KEJURUAN' ? '#ea580c' : '#2563eb',
        });
    });

    return result;
};

export const useScheduleStore = create<ScheduleState & ScheduleActions>(
    (set, get) => ({
        classes: [],
        teachers: [],
        rows: [],
        guruPiket: DEFAULT_GURU_PIKET,
        approvalData: {
            isApproved: false,
            googleDriveUrl: '',
            approvedBy: 'Merly Puspita, S.Pd.',
            headmasterNiy: '19840214 200801 2 001',
            approvedAt: '',
            notes: 'Lampiran Roster Jam Belajar & Jadwal Pelajaran Resmi SMK Xaverius Palembang',
        },
        recommendations: JP_RECOMMENDATION_RULES,

        viewMode: 'matrix',
        selectedClassForInput: '',

        schoolInformations: [],
        selectedSchoolInfoId: '',
        idSchoolInformation: '',
        teachingStaff: [],
        isLoadingDatabase: false,

        selectedDayFilter: 'Semua',
        selectedGradeFilter: 'Semua',
        selectedClassFilter: 'Semua',
        isClassListModalOpen: false,
        searchQuery: '',

        conflicts: [],
        draggedItem: null,
        quickEditCell: null,
        isRecommendationModalOpen: false,
        isPrintDialogOpen: false,
        isSaving: false,

        // Teacher Schedule Requests Initial State
        teacherRequests: DEFAULT_TEACHER_REQUESTS,
        isLoadingRequests: false,
        isRequestDialogOpen: false,
        editingRequest: null,
        isGenerateScheduleDialogOpen: false,

        // Category Extras Initial State
        categoryExtras: [],
        effectiveWeekAllocations: [],

        setViewMode: (viewMode) => set({ viewMode }),
        setSelectedClassForInput: (selectedClassForInput) => set({ selectedClassForInput }),
        setSelectedDayFilter: (day) => set({ selectedDayFilter: day }),
        setSelectedGradeFilter: (grade) => set({ selectedGradeFilter: grade }),
        setSelectedClassFilter: (selectedClassFilter) => set({ selectedClassFilter }),
        setIsClassListModalOpen: (isClassListModalOpen) => set({ isClassListModalOpen }),
        setSearchQuery: (searchQuery) => set({ searchQuery }),
        setDraggedItem: (draggedItem) => set({ draggedItem }),
        setQuickEditCell: (quickEditCell) => set({ quickEditCell }),
        setRecommendationModalOpen: (isRecommendationModalOpen) =>
            set({ isRecommendationModalOpen }),
        setPrintDialogOpen: (isPrintDialogOpen) => set({ isPrintDialogOpen }),

        // Request Dialog Actions
        setIsRequestDialogOpen: (isRequestDialogOpen) => set({ isRequestDialogOpen }),
        setEditingRequest: (editingRequest) => set({ editingRequest }),
        setIsGenerateScheduleDialogOpen: (isGenerateScheduleDialogOpen) => set({ isGenerateScheduleDialogOpen }),

        // Guru Piket Actions
        setGuruPiket: (guruPiket) => {
            set((state) => ({
                guruPiket,
                conflicts: calculateConflicts(state.rows, state.teachers, guruPiket),
            }));
            get().triggerAutoSave();
        },

        addGuruPiket: (entry) => {
            set((state) => {
                const newEntry: GuruPiketEntry = {
                    ...entry,
                    id: `piket-${Date.now()}`,
                };
                const updated = [...state.guruPiket, newEntry];
                return {
                    guruPiket: updated,
                    conflicts: calculateConflicts(state.rows, state.teachers, updated),
                };
            });
            get().triggerAutoSave();
        },

        updateGuruPiket: (index, updates) => {
            set((state) => {
                const updated = [...state.guruPiket];
                if (updated[index]) {
                    updated[index] = { ...updated[index], ...updates };
                }
                return {
                    guruPiket: updated,
                    conflicts: calculateConflicts(state.rows, state.teachers, updated),
                };
            });
            get().triggerAutoSave();
        },

        deleteGuruPiket: (index) => {
            set((state) => {
                const updated = state.guruPiket.filter((_, i) => i !== index);
                return {
                    guruPiket: updated,
                    conflicts: calculateConflicts(state.rows, state.teachers, updated),
                };
            });
            get().triggerAutoSave();
        },

        // Approval / Pengesahan Kepala Sekolah Actions
        setApprovalData: (data) => {
            set((state) => ({
                approvalData: { ...state.approvalData, ...data },
            }));
            get().triggerAutoSave();
        },

        confirmApproval: async (googleDriveUrl, notes) => {
            const state = get();
            const schoolInfoId = state.idSchoolInformation;
            const updatedApproval: ScheduleApprovalData = {
                ...state.approvalData,
                isApproved: true,
                googleDriveUrl: googleDriveUrl || state.approvalData.googleDriveUrl,
                approvedAt: new Date().toISOString(),
                notes: notes || state.approvalData.notes || 'Disahkan oleh Kepala Sekolah SMK Xaverius Palembang',
            };

            set({ approvalData: updatedApproval });

            if (schoolInfoId) {
                await matrixService.saveBySchoolInformation(
                    schoolInfoId,
                    {
                        matrix_data: state.rows,
                        teachers_data: state.teachers,
                        guru_piket_data: state.guruPiket,
                        classes_data: state.classes,
                        approval_data: updatedApproval,
                        is_synced: true,
                    },
                    {
                        onSuccess: () => {
                            snackbar.success('Dokumen jadwal resmi berhasil dikonfirmasi & disahkan oleh Kepala Sekolah!');
                        },
                        onError: (err) => {
                            snackbar.error(err.message || 'Gagal menyimpan pengesahan ke database.');
                        },
                    }
                );
            }
            return true;
        },

        revokeApproval: async () => {
            const state = get();
            const schoolInfoId = state.idSchoolInformation;
            const updatedApproval: ScheduleApprovalData = {
                ...state.approvalData,
                isApproved: false,
                approvedAt: '',
            };

            set({ approvalData: updatedApproval });

            if (schoolInfoId) {
                await matrixService.saveBySchoolInformation(
                    schoolInfoId,
                    {
                        matrix_data: state.rows,
                        teachers_data: state.teachers,
                        guru_piket_data: state.guruPiket,
                        classes_data: state.classes,
                        approval_data: updatedApproval,
                        is_synced: true,
                    },
                    {
                        onSuccess: () => {
                            snackbar.info('Status pengesahan dokumen jadwal berhasil dibatalkan.');
                        },
                        onError: (err) => {
                            snackbar.error(err.message || 'Gagal memperbarui status pengesahan.');
                        },
                    }
                );
            }
            return true;
        },

        triggerAutoSave: () => {
            if (autoSaveScheduleTimer) clearTimeout(autoSaveScheduleTimer);
            autoSaveScheduleTimer = setTimeout(() => {
                const state = get();
                const schoolInfoId = state.idSchoolInformation;
                if (schoolInfoId && state.rows.length > 0) {
                    matrixService.saveBySchoolInformation(
                        schoolInfoId,
                        {
                            matrix_data: state.rows,
                            teachers_data: state.teachers,
                            guru_piket_data: state.guruPiket,
                            classes_data: state.classes,
                            approval_data: state.approvalData,
                            is_synced: true,
                        },
                        {
                            onSuccess: () => {},
                            onError: () => {},
                        }
                    );
                }
            }, 1200);
        },

        setCellTeacher: (rowId, className, teacherCode, subjectCode) => {
            set((state) => {
                const teacher = findTeacherByCode(state.teachers, teacherCode);
                const chosenSubj =
                    teacher?.subjects?.find((s) => s.subjectCode === subjectCode) ||
                    teacher?.subjects?.find((s) => s.subjectName === subjectCode) ||
                    (teacher?.subjects && teacher.subjects.length > 0 ? teacher.subjects[0] : null);

                const newRows = state.rows.map((row) => {
                    if (row.id !== rowId) return row;

                    const currentCell = row.classCells[className] || {
                        teacherCode: null,
                    };
                    return {
                        ...row,
                        classCells: {
                            ...row.classCells,
                            [className]: {
                                ...currentCell,
                                teacherCode: teacherCode,
                                teacherName: teacher?.name,
                                subjectName: chosenSubj?.subjectName || teacher?.subjectName,
                                subjectCode: chosenSubj?.subjectCode || teacher?.subjectCode,
                                category: chosenSubj?.category || teacher?.category,
                            },
                        },
                    };
                });

                saveMatrixToLocalStorage(state.idSchoolInformation, newRows);

                return {
                    rows: newRows,
                    conflicts: calculateConflicts(newRows, state.teachers),
                };
            });

            get().triggerAutoSave();
        },

        setBatchCellTeacher: (rowIds, className, teacherCode, subjectCode) => {
            set((state) => {
                const teacher = findTeacherByCode(state.teachers, teacherCode);
                const chosenSubj =
                    teacher?.subjects?.find((s) => s.subjectCode === subjectCode) ||
                    teacher?.subjects?.find((s) => s.subjectName === subjectCode) ||
                    (teacher?.subjects && teacher.subjects.length > 0 ? teacher.subjects[0] : null);

                const rowIdSet = new Set(rowIds);

                const newRows = state.rows.map((row) => {
                    if (!rowIdSet.has(row.id)) return row;

                    const currentCell = row.classCells[className] || {
                        teacherCode: null,
                    };
                    return {
                        ...row,
                        classCells: {
                            ...row.classCells,
                            [className]: {
                                ...currentCell,
                                teacherCode: teacherCode,
                                teacherName: teacher?.name,
                                subjectName: chosenSubj?.subjectName || teacher?.subjectName,
                                subjectCode: chosenSubj?.subjectCode || teacher?.subjectCode,
                                category: chosenSubj?.category || teacher?.category,
                            },
                        },
                    };
                });

                saveMatrixToLocalStorage(state.idSchoolInformation, newRows);

                return {
                    rows: newRows,
                    conflicts: calculateConflicts(newRows, state.teachers),
                };
            });

            get().triggerAutoSave();
        },

        swapCells: (fromRowId, fromClassName, toRowId, toClassName) => {
            set((state) => {
                const fromRow = state.rows.find((r) => r.id === fromRowId);
                const toRow = state.rows.find((r) => r.id === toRowId);

                if (!fromRow || !toRow) return state;

                const fromCell = fromRow.classCells[fromClassName] || {
                    teacherCode: null,
                };
                const toCell = toRow.classCells[toClassName] || {
                    teacherCode: null,
                };

                const newRows = state.rows.map((row) => {
                    if (row.id === fromRowId && row.id === toRowId) {
                        return {
                            ...row,
                            classCells: {
                                ...row.classCells,
                                [fromClassName]: toCell,
                                [toClassName]: fromCell,
                            },
                        };
                    }
                    if (row.id === fromRowId) {
                        return {
                            ...row,
                            classCells: {
                                ...row.classCells,
                                [fromClassName]: toCell,
                            },
                        };
                    }
                    if (row.id === toRowId) {
                        return {
                            ...row,
                            classCells: {
                                ...row.classCells,
                                [toClassName]: fromCell,
                            },
                        };
                    }
                    return row;
                });

                saveMatrixToLocalStorage(state.idSchoolInformation, newRows);

                return {
                    rows: newRows,
                    conflicts: calculateConflicts(newRows, state.teachers),
                };
            });

            get().triggerAutoSave();
        },

        applySpecialActivityToRow: (rowId, activityType, title) => {
            set((state) => {
                const colors: Record<
                    string,
                    { bg: string; text: string; border: string }
                > = {
                    UPACARA: {
                        bg: '#ede9fe',
                        text: '#5b21b6',
                        border: '#c4b5fd',
                    },
                    SENAM: {
                        bg: '#e0f2fe',
                        text: '#075985',
                        border: '#bae6fd',
                    },
                    LITERASI: {
                        bg: '#fef9c3',
                        text: '#854d0e',
                        border: '#fef08a',
                    },
                    ISTIRAHAT: {
                        bg: '#fef3c7',
                        text: '#92400e',
                        border: '#fde68a',
                    },
                    EKSTRA_WAJIB: {
                        bg: '#dcfce7',
                        text: '#166534',
                        border: '#bbf7d0',
                    },
                    EKSTRA_PILIHAN: {
                        bg: '#ffedd5',
                        text: '#9a3412',
                        border: '#fed7aa',
                    },
                    PRAMUKA: {
                        bg: '#fef2f2',
                        text: '#991b1b',
                        border: '#fecaca',
                    },
                    KBM: {
                        bg: '#ffffff',
                        text: '#0f172a',
                        border: '#e2e8f0',
                    },
                };

                // Check if this is an EKSTRA type activity
                const isEkstraType = activityType.toString().includes('EKSTRA') ||
                    activityType === 'PRAMUKA' ||
                    title.toUpperCase().includes('EKSTRA');

                const newRows = state.rows.map((row) => {
                    if (row.id !== rowId) return row;

                    // For Ekstra: initialize per-class extra activities with default
                    let classExtraActivities: Record<string, string> | undefined;
                    if (isEkstraType) {
                        classExtraActivities = {};
                        const defaultExtra = state.categoryExtras.length > 0
                            ? state.categoryExtras[0].name
                            : 'Pramuka';
                        state.classes.forEach((cls) => {
                            classExtraActivities![cls.name] = defaultExtra;
                        });
                    }

                    return {
                        ...row,
                        specialActivity: {
                            isSpecial: true as const,
                            activityType,
                            title,
                            fullSpan: !isEkstraType, // Ekstra = per-class, NOT full span
                            colorScheme: colors[activityType] || colors.UPACARA,
                        },
                        ...(isEkstraType ? { classExtraActivities } : {}),
                    };
                });

                return {
                    rows: newRows,
                    conflicts: calculateConflicts(newRows, state.teachers),
                };
            });
        },

        removeSpecialActivityFromRow: (rowId) => {
            set((state) => {
                const newRows = state.rows.map((row) => {
                    if (row.id !== rowId) return row;
                    return {
                        ...row,
                        specialActivity: null,
                        classExtraActivities: undefined,
                    };
                });

                return {
                    rows: newRows,
                    conflicts: calculateConflicts(newRows, state.teachers, state.guruPiket),
                };
            });
            get().triggerAutoSave();
        },

        updateRowExtraCategory: (rowId, extraName) => {
            set((state) => {
                const newRows = state.rows.map((row) => {
                    if (row.id !== rowId) return row;
                    const existing = row.specialActivity;
                    // Update all classes to the same extra category
                    const classExtraActivities: Record<string, string> = {};
                    state.classes.forEach((cls) => {
                        classExtraActivities[cls.name] = extraName;
                    });
                    return {
                        ...row,
                        classExtraActivities,
                        specialActivity: existing
                            ? {
                                  ...existing,
                                  title: 'EKSTRA',
                                  subtitle: extraName,
                                  fullSpan: false,
                              }
                            : {
                                  isSpecial: true as const,
                                  activityType: 'EKSTRA_WAJIB' as const,
                                  title: 'EKSTRA',
                                  subtitle: extraName,
                                  fullSpan: false,
                                  colorScheme: {
                                      bg: '#dcfce7',
                                      text: '#15803d',
                                      border: '#bbf7d0',
                                  },
                              },
                    };
                });

                return {
                    rows: newRows,
                    conflicts: calculateConflicts(newRows, state.teachers, state.guruPiket),
                };
            });
            get().triggerAutoSave();
        },

        setClassExtraActivity: (rowId, className, extraName) => {
            set((state) => {
                const newRows = state.rows.map((row) => {
                    if (row.id !== rowId) return row;
                    return {
                        ...row,
                        classExtraActivities: {
                            ...(row.classExtraActivities || {}),
                            [className]: extraName,
                        },
                    };
                });

                return {
                    rows: newRows,
                    conflicts: calculateConflicts(newRows, state.teachers, state.guruPiket),
                };
            });
            get().triggerAutoSave();
        },

        updateTeacher: (code, updates) => {
            set((state) => {
                const newTeachers = state.teachers.map((t) =>
                    t.code === code ? { ...t, ...updates } : t
                );
                return {
                    teachers: newTeachers,
                    conflicts: calculateConflicts(state.rows, newTeachers),
                };
            });
        },

        addTeacher: (newTeacher) => {
            set((state) => {
                const nextCode =
                    newTeacher.code ||
                    (state.teachers.length > 0
                        ? Math.max(...state.teachers.map((t) => t.code)) + 1
                        : 1);

                const teacherEntry: TeacherCodeEntry = {
                    ...newTeacher,
                    code: nextCode,
                    totalJpAssigned: 0,
                    targetJp: newTeacher.targetJp || 24,
                    category: newTeacher.category || 'KEJURUAN',
                    recommendedJp:
                        newTeacher.recommendedJp ||
                        (newTeacher.category === 'UMUM'
                            ? 'JP 1-3 (Pagi)'
                            : 'JP 6-8 (Blok Praktik Siang)'),
                };

                const newTeachers = [...state.teachers, teacherEntry];
                return {
                    teachers: newTeachers,
                    conflicts: calculateConflicts(state.rows, newTeachers),
                };
            });
        },

        deleteTeacher: (code) => {
            set((state) => {
                const newTeachers = state.teachers.filter((t) => t.code !== code);
                const newRows = state.rows.map((row) => {
                    const newCells = { ...row.classCells };
                    let changed = false;
                    Object.entries(newCells).forEach(([cls, cell]) => {
                        if (cell.teacherCode === code) {
                            newCells[cls] = { teacherCode: null };
                            changed = true;
                        }
                    });
                    return changed ? { ...row, classCells: newCells } : row;
                });

                return {
                    teachers: newTeachers,
                    rows: newRows,
                    conflicts: calculateConflicts(newRows, newTeachers),
                };
            });
        },

        generateTableFromRosterJam: async () => {
            set({ isLoadingDatabase: true });
            try {
                let schoolInfoId = get().idSchoolInformation;
                if (!schoolInfoId) {
                    await get().fetchSchoolInformations();
                    schoolInfoId = get().idSchoolInformation;
                }

                let rosterData: any = null;
                if (schoolInfoId) {
                    await rosterScheduleService.getBySchoolInformation(schoolInfoId, {
                        onSuccess: (res) => {
                            if (res && res.schedules) {
                                rosterData = typeof res.schedules === 'string' ? JSON.parse(res.schedules) : res.schedules;
                            }
                        },
                        onError: () => {},
                    });
                }
                if (!rosterData) {
                    const activeInfo = get().schoolInformations.find((i) => i.id_school_information === schoolInfoId);
                    rosterData = getStoredRosterData(schoolInfoId, activeInfo?.periode || undefined);
                }

                const currentClasses = get().classes;
                const currentTeachers = get().teachers;
                const freshRows = buildScheduleRowsFromRoster(rosterData, currentClasses);

                // Pertahankan sel guru yang sudah diisi jika day dan jp cocok
                const existingRows = get().rows;
                const mergedRows = freshRows.map((fRow) => {
                    const matched = existingRows.find(
                        (e) => e.day === fRow.day && String(e.jp) === String(fRow.jp)
                    );
                    if (matched && matched.classCells) {
                        return {
                            ...fRow,
                            classCells: {
                                ...fRow.classCells,
                                ...matched.classCells,
                            },
                        };
                    }
                    return fRow;
                });

                // Simpan matriks yang sudah disinkronkan ke database
                if (schoolInfoId) {
                    await matrixService.saveBySchoolInformation(
                        schoolInfoId,
                        {
                            matrix_data: mergedRows,
                            teachers_data: currentTeachers,
                            classes_data: currentClasses,
                            is_synced: true,
                        },
                        {
                            onSuccess: () => {},
                            onError: () => {},
                        }
                    );
                }

                set({
                    rows: mergedRows,
                    conflicts: calculateConflicts(mergedRows, currentTeachers),
                    isLoadingDatabase: false,
                });

                snackbar.success(`Tabel berhasil disinkronkan (${mergedRows.length} slot waktu) sesuai Roster Jam Belajar!`);
            } catch (err: any) {
                set({ isLoadingDatabase: false });
                snackbar.error(`Gagal sinkronkan tabel: ${err.message || err}`);
            }
        },

        autoScheduleSmart: () => {
            const result = get().generateRandomConflictFreeSchedule({
                prioritizeRequests: true,
                includeSpecialActivities: true,
                balanceDistribution: true,
                randomizeTeachers: true,
            });
            if (result.success) {
                get().applyGeneratedRows(result.generatedRows);
            }
        },

        resetToOfficialTemplate: async () => {
            await get().loadScheduleFromDatabase();
            snackbar.info('Jadwal di-reset dan dimuat ulang dari Database MySQL.');
        },

        fetchSchoolInformations: async () => {
            try {
                await schoolInfoService.getAll(
                    {
                        onSuccess: (res) => {
                            const infoList = res.data || [];
                            set({ schoolInformations: infoList });
                            if (infoList.length > 0 && !get().idSchoolInformation) {
                                const activeInfo = infoList.find((i) => i.status) || infoList[0];
                                set({
                                    idSchoolInformation: activeInfo.id_school_information,
                                    selectedSchoolInfoId: activeInfo.id_school_information,
                                });
                            }
                        },
                        onError: () => {},
                    },
                    { params: { limit: 20 } }
                );
            } catch {
                // Ignore
            }
        },

        fetchCategoryExtras: async () => {
            try {
                await categoryExtraService.getAll({
                    onSuccess: (data) => {
                        set({ categoryExtras: data || [] });
                    },
                    onError: () => {},
                });
            } catch (err) {
                console.error('Error fetching category extras:', err);
            }
        },

        fetchEffectiveWeekAllocations: async () => {
            try {
                const schoolInfoId = get().idSchoolInformation;
                await effectiveWeekService.getAll(
                    {
                        onSuccess: (res) => {
                            const allocs = res.data || [];
                            set({ effectiveWeekAllocations: allocs });
                        },
                        onError: () => {},
                    },
                    schoolInfoId
                        ? { params: { id_school_information: schoolInfoId, limit: 200 } }
                        : { params: { limit: 200 } }
                );
            } catch (err) {
                console.error('Error fetching effective week allocations:', err);
            }
        },

        fetchClassesFromDatabase: async (schoolInfoId?: string) => {
            try {
                await classService.getAll(
                    {
                        onSuccess: (res) => {
                            const classList = res.data || [];
                            const dbClasses: ClassColumn[] = classList.map((c) => {
                                let grade: 'X' | 'XI' | 'XII' = 'X';
                                const k = (c.kelas || '').trim().toUpperCase();
                                const n = (c.name || '').trim().toUpperCase();
                                if (k === '12' || k === 'XII' || n.startsWith('12') || n.startsWith('XII')) grade = 'XII';
                                else if (k === '11' || k === 'XI' || n.startsWith('11') || n.startsWith('XI')) grade = 'XI';
                                else grade = 'X';

                                return {
                                    id: c.id_class,
                                    name: c.name || `${grade} ${c.major?.name || ''}`.trim(),
                                    grade,
                                    major: c.major?.name || '',
                                };
                            });

                            // Urutkan kelas sesuai kaidah pedagogik: Kelas X -> XI -> XII, lalu menurut jurusan
                            dbClasses.sort(sortClassesByGradeAndName);

                            set({ classes: dbClasses });
                            if (!dbClasses.some((m) => m.name === get().selectedClassForInput)) {
                                set({ selectedClassForInput: dbClasses[0]?.name || '' });
                            }
                            if (get().selectedClassFilter !== 'Semua' && !dbClasses.some((m) => m.name === get().selectedClassFilter)) {
                                set({ selectedClassFilter: 'Semua' });
                            }
                        },
                        onError: () => {},
                    },
                    schoolInfoId
                        ? { params: { id_school_information: schoolInfoId, limit: 100 } }
                        : { params: { limit: 100 } }
                );
            } catch {
                // Ignore
            }
        },

        setSchoolInformationId: async (id: string) => {
            set({ idSchoolInformation: id, selectedSchoolInfoId: id, selectedClassFilter: 'Semua' });
            await get().loadScheduleFromDatabase(id);
        },

        syncFromDatabaseTeachingStaff: async () => {
            try {
                const schoolInfoId = get().idSchoolInformation;
                await teachingService.getAll(
                    {
                        onSuccess: (res) => {
                            const staffList = res.data || [];
                            set({ teachingStaff: staffList });

                            if (staffList.length > 0) {
                                const mappedTeachers = mapTeachingStaffToTeacherEntries(staffList);
                                set((prev) => ({
                                    teachers: mappedTeachers,
                                    conflicts: calculateConflicts(prev.rows, mappedTeachers),
                                }));
                            }
                        },
                        onError: () => {},
                    },
                    schoolInfoId
                        ? { params: { id_school_information: schoolInfoId, limit: 100 } }
                        : { params: { limit: 100 } }
                );
            } catch {
                // Ignore silent sync
            }
        },

        loadScheduleFromDatabase: async (customSchoolInfoId?: string) => {
            set({ isLoadingDatabase: true });

            try {
                let schoolInfoId = customSchoolInfoId || get().idSchoolInformation;

                // 1. Ambil daftar informasi sekolah & kategori ekstra & alokasi mapel per-jurusan
                await get().fetchSchoolInformations();
                await get().fetchCategoryExtras();
                await get().fetchEffectiveWeekAllocations();
                schoolInfoId = get().idSchoolInformation;

                // 2. Ambil data kelas murni dari database MySQL (classes table)
                await get().fetchClassesFromDatabase(schoolInfoId);
                const currentClasses = get().classes;

                // 3. Ambil data guru & penugasan mengajar murni dari database MySQL (teacher_subjects & employees)
                await get().syncFromDatabaseTeachingStaff();
                const currentTeachers = get().teachers;

                // 4. Ambil struktur Roster Jam Belajar dari database MySQL (school_rosters)
                let rosterData: any = null;
                if (schoolInfoId) {
                    await rosterScheduleService.getBySchoolInformation(schoolInfoId, {
                        onSuccess: (res) => {
                            if (res && res.schedules) {
                                rosterData = typeof res.schedules === 'string' ? JSON.parse(res.schedules) : res.schedules;
                            }
                        },
                        onError: () => {},
                    });
                }

                // Fallback ke localStorage jika belum ada di database
                if (!rosterData) {
                    const activeInfo = get().schoolInformations.find((i) => i.id_school_information === schoolInfoId);
                    rosterData = getStoredRosterData(schoolInfoId, activeInfo?.periode || undefined);
                    if (rosterData && schoolInfoId) {
                        // Simpan ke database MySQL di background
                        rosterScheduleService.saveBySchoolInformation(
                            schoolInfoId,
                            { schedules: rosterData, is_synced: true },
                            { onSuccess: () => {}, onError: () => {} }
                        );
                    }
                }

                // Bangun baris jadwal bersih berdasarkan roster jam belajar dan kelas riil
                const baseRows = buildScheduleRowsFromRoster(rosterData, currentClasses);

                // 5. Ambil data matriks jadwal dari database MySQL (dengan fallback LocalStorage)
                let savedRows: ScheduleRow[] | null = null;
                if (schoolInfoId) {
                    await matrixService.getBySchoolInformation(schoolInfoId, {
                        onSuccess: (res) => {
                            if (res && res.matrix_data && Array.isArray(res.matrix_data) && res.matrix_data.length > 0) {
                                savedRows = res.matrix_data;
                            }
                            if (res && res.guru_piket_data && Array.isArray(res.guru_piket_data) && res.guru_piket_data.length > 0) {
                                set({ guruPiket: res.guru_piket_data });
                            }
                            if (res && res.approval_data) {
                                set({ approvalData: res.approval_data });
                            }
                        },
                        onError: () => {},
                    });
                }

                // Fallback ke LocalStorage jika database belum menyimpan
                if (!savedRows && schoolInfoId) {
                    savedRows = getMatrixFromLocalStorage(schoolInfoId);
                }

                if (savedRows && Array.isArray(savedRows) && savedRows.length > 0) {
                    const mergedRows = baseRows.map((bRow) => {
                        const matchedSaved = savedRows!.find(
                            (s) => s.day === bRow.day && String(s.jp) === String(bRow.jp)
                        );
                        if (matchedSaved && matchedSaved.classCells) {
                            return {
                                ...bRow, // Pertahankan struktur dari Roster Jam Belajar!
                                classCells: {
                                    ...bRow.classCells,
                                    ...matchedSaved.classCells,
                                },
                            };
                        }
                        return bRow;
                    });

                    if (schoolInfoId) {
                        saveMatrixToLocalStorage(schoolInfoId, mergedRows);
                    }

                    set({
                        rows: mergedRows,
                        conflicts: calculateConflicts(mergedRows, currentTeachers),
                    });
                } else {
                    set({
                        rows: baseRows,
                        conflicts: calculateConflicts(baseRows, currentTeachers),
                    });
                }
            } finally {
                set({ isLoadingDatabase: false });
            }
        },

        saveSchedule: async () => {
            set({ isSaving: true });
            try {
                const state = get();
                let schoolInfoId = state.idSchoolInformation;

                if (!schoolInfoId) {
                    await state.fetchSchoolInformations();
                    schoolInfoId = get().idSchoolInformation;
                }

                if (schoolInfoId) {
                    saveMatrixToLocalStorage(schoolInfoId, state.rows);
                    await matrixService.saveBySchoolInformation(
                        schoolInfoId,
                        {
                            matrix_data: state.rows,
                            teachers_data: state.teachers,
                            guru_piket_data: state.guruPiket,
                            classes_data: state.classes,
                            approval_data: state.approvalData,
                            is_synced: true,
                        },
                        {
                            onSuccess: () => {
                                snackbar.success('Jadwal pelajaran berhasil disimpan ke database MySQL & berelasi!');
                            },
                            onError: (err) => {
                                snackbar.error(err.message || 'Gagal menyimpan ke database MySQL.');
                            },
                        }
                    );
                } else {
                    snackbar.error('Pilih Periode / Tahun Ajaran terlebih dahulu!');
                }
            } finally {
                set({ isSaving: false });
            }
        },

        // ══════════════════════════════════════════════════════════════
        // TEACHER SCHEDULE REQUESTS (API & VALIDATION)
        // ══════════════════════════════════════════════════════════════
        fetchTeacherRequests: async () => {
            set({ isLoadingRequests: true });
            try {
                const schoolInfoId = get().idSchoolInformation || get().selectedSchoolInfoId;
                await teacherRequestService.getAll(
                    {
                        onSuccess: (dataList) => {
                            if (Array.isArray(dataList) && dataList.length > 0) {
                                const formatted: TeacherScheduleRequest[] = dataList.map((item) => ({
                                    id: item.id_schedule_request || item.id || `req-${item.teacher_code}`,
                                    id_schedule_request: item.id_schedule_request,
                                    id_school_information: item.id_school_information,
                                    teacherCode: item.teacher_code,
                                    teacherName: item.teacher_name,
                                    subjectName: item.subject_name,
                                    preferredSlots: Array.isArray(item.preferred_slots)
                                        ? item.preferred_slots
                                        : typeof item.preferred_slots === 'string'
                                        ? JSON.parse(item.preferred_slots)
                                        : [],
                                    status: (item.status as any) || 'VALID',
                                    statusText: item.status_text || '✓ Tersedia & Bebas Bentrok',
                                    conflictReason: item.conflict_reason,
                                    notes: item.notes,
                                    createdAt: item.created_at,
                                }));
                                set({ teacherRequests: formatted });
                            } else {
                                set({ teacherRequests: DEFAULT_TEACHER_REQUESTS });
                            }
                        },
                        onError: () => {
                            set({ teacherRequests: DEFAULT_TEACHER_REQUESTS });
                        },
                    },
                    schoolInfoId || undefined
                );
            } catch {
                set({ teacherRequests: DEFAULT_TEACHER_REQUESTS });
            } finally {
                set({ isLoadingRequests: false });
            }
        },

        createTeacherRequest: async (reqData) => {
            set({ isLoadingRequests: true });
            try {
                const schoolInfoId = get().idSchoolInformation || get().selectedSchoolInfoId;
                let createdSuccessfully = false;

                await teacherRequestService.create(
                    {
                        id_school_information: schoolInfoId || null,
                        teacher_code: reqData.teacherCode,
                        teacher_name: reqData.teacherName,
                        subject_name: reqData.subjectName,
                        preferred_slots: reqData.preferredSlots as any,
                        status: reqData.status || 'VALID',
                        status_text: reqData.statusText || '✓ Tersedia & Bebas Bentrok',
                        conflict_reason: reqData.conflictReason || null,
                        notes: reqData.notes || null,
                    },
                    {
                        onSuccess: (newItem) => {
                            const newRequest: TeacherScheduleRequest = {
                                id: newItem.id_schedule_request || `req-${Date.now()}`,
                                id_schedule_request: newItem.id_schedule_request,
                                id_school_information: newItem.id_school_information,
                                teacherCode: newItem.teacher_code,
                                teacherName: newItem.teacher_name,
                                subjectName: newItem.subject_name,
                                preferredSlots: reqData.preferredSlots,
                                status: newItem.status || 'VALID',
                                statusText: newItem.status_text || '✓ Tersedia & Bebas Bentrok',
                                conflictReason: newItem.conflict_reason,
                                notes: newItem.notes,
                            };
                            set((state) => ({
                                teacherRequests: [newRequest, ...state.teacherRequests],
                            }));
                            snackbar.success(`Request jadwal untuk ${reqData.teacherName} berhasil disimpan!`);
                            createdSuccessfully = true;
                        },
                        onError: (errMsg) => {
                            snackbar.error(`Gagal menyimpan request jadwal: ${errMsg || ''}`);
                        },
                    }
                );
                return createdSuccessfully;
            } finally {
                set({ isLoadingRequests: false });
            }
        },

        updateTeacherRequest: async (id, updates) => {
            set({ isLoadingRequests: true });
            try {
                let success = false;
                await teacherRequestService.update(
                    id,
                    {
                        teacher_code: updates.teacherCode,
                        teacher_name: updates.teacherName,
                        subject_name: updates.subjectName,
                        preferred_slots: updates.preferredSlots as any,
                        status: updates.status,
                        status_text: updates.statusText,
                        conflict_reason: updates.conflictReason,
                        notes: updates.notes,
                    },
                    {
                        onSuccess: () => {
                            set((state) => ({
                                teacherRequests: state.teacherRequests.map((r) =>
                                    r.id === id ? { ...r, ...updates } : r
                                ),
                            }));
                            snackbar.success('Request jadwal berhasil diperbarui!');
                            success = true;
                        },
                        onError: (err) => {
                            snackbar.error(`Gagal memperbarui request jadwal: ${err}`);
                        },
                    }
                );
                return success;
            } finally {
                set({ isLoadingRequests: false });
            }
        },

        deleteTeacherRequest: async (id) => {
            set({ isLoadingRequests: true });
            try {
                let success = false;
                await teacherRequestService.delete(id, {
                    onSuccess: () => {
                        set((state) => ({
                            teacherRequests: state.teacherRequests.filter((r) => r.id !== id),
                        }));
                        snackbar.success('Request jadwal berhasil dihapus!');
                        success = true;
                    },
                    onError: (err) => {
                        snackbar.error(`Gagal menghapus request: ${err}`);
                    },
                });
                return success;
            } finally {
                set({ isLoadingRequests: false });
            }
        },

        validateTeacherRequest: (teacherCode, slots) => {
            const existingRequests = get().teacherRequests;
            for (const other of existingRequests) {
                if (other.teacherCode === teacherCode) continue;
                for (const slot of slots) {
                    const found = other.preferredSlots.find(
                        (os) => os.day === slot.day && os.jam.split(' ')[0] === slot.jam.split(' ')[0]
                    );
                    if (found) {
                        return {
                            isValid: false,
                            conflictReason: `Bentrok dengan request Guru #${other.teacherCode} (${other.teacherName}) pada ${slot.day} - ${slot.jam}`,
                        };
                    }
                }
            }
            return { isValid: true };
        },

        // ══════════════════════════════════════════════════════════════
        // RANDOM CONFLICT-FREE SCHEDULE GENERATOR (BERBASIS DATA MYSQL RIIL)
        // ══════════════════════════════════════════════════════════════
        generateRandomConflictFreeSchedule: (options) => {
            const {
                prioritizeRequests = true,
                includeSpecialActivities = true,
                balanceDistribution = true,
                randomizeTeachers = true,
            } = options;

            const currentClasses = get().classes;
            const currentTeachers = get().teachers;
            const requests = get().teacherRequests;
            const effectiveAllocations = get().effectiveWeekAllocations || [];

            if (currentClasses.length === 0 || currentTeachers.length === 0) {
                snackbar.error('Data kelas atau pengajar dari database belum tersedia!');
                return {
                    success: false,
                    totalFilled: 0,
                    conflictsCount: 0,
                    requestsFulfilled: 0,
                    generatedRows: get().rows,
                };
            }

            // Helper validasi kecocokan jurusan & tingkat kelas
            const isTeacherEligibleForClass = (
                teacher: TeacherCodeEntry,
                targetClass: ClassColumn,
                allocations: EffectiveWeekResponseModel[],
                subjectCode?: string
            ): boolean => {
                const classRawName = (targetClass.name || '').trim().toUpperCase();
                const classMajor = (targetClass.major || '').trim().toUpperCase();
                const classGrade = (targetClass.grade || '').trim().toUpperCase(); // 'X', 'XI', 'XII'
                const classGradeNum = classGrade === 'X' ? '10' : classGrade === 'XI' ? '11' : '12';

                const nameParts = classRawName.split(/\s+/);
                const extractedMajorFromName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
                const effectiveClassMajors = [classMajor, extractedMajorFromName]
                    .map((m) => m.trim().toUpperCase())
                    .filter(Boolean);

                const subj = teacher.subjects?.find((s) => s.subjectCode === subjectCode) || teacher.subjects?.[0];
                const subjCodeToTest = subjectCode || teacher.subjectCode;
                const subjNameToTest = subj?.subjectName || teacher.subjectName;

                // 1. Cek penugasan spesifik dari database Pengajaran (Teaching Staff)
                if (subj?.assignedClassNames && subj.assignedClassNames.length > 0) {
                    const matchesAssigned = subj.assignedClassNames.some((assignedCn) => {
                        const cleanAssigned = assignedCn.trim().toUpperCase();
                        return (
                            cleanAssigned === classRawName ||
                            cleanAssigned.includes(classRawName) ||
                            classRawName.includes(cleanAssigned)
                        );
                    });
                    if (matchesAssigned) return true;
                    // Jika mapel guru ini sudah terdata kelas-kelas spesifik, jangan masuk ke kelas lain
                    return false;
                }

                // 2. Cek alokasi per-jurusan dari Alokasi Jam & JP (Kurikulum Effective Weeks)
                if (allocations && allocations.length > 0) {
                    const matchingAlloc = allocations.find((alloc) => {
                        const codeMatches =
                            alloc.code_subject &&
                            subjCodeToTest &&
                            alloc.code_subject.trim().toUpperCase() === subjCodeToTest.trim().toUpperCase();
                        const nameMatches =
                            alloc.subject_name &&
                            subjNameToTest &&
                            alloc.subject_name.trim().toLowerCase() === subjNameToTest.trim().toLowerCase();
                        return codeMatches || nameMatches;
                    });

                    if (matchingAlloc) {
                        // Cek tingkat kelas (X, XI, XII)
                        if (matchingAlloc.kelas) {
                            const allocKelas = matchingAlloc.kelas.trim().toUpperCase();
                            const gradeMatches =
                                allocKelas === classGrade ||
                                allocKelas === classGradeNum ||
                                allocKelas.includes(classGrade) ||
                                allocKelas.includes(classGradeNum) ||
                                classRawName.startsWith(allocKelas);
                            if (!gradeMatches) return false;
                        }

                        // Cek daftar jurusan (Misal: SMP saja, atau AKL/DKV/TKJT)
                        const allocMajors = (matchingAlloc.major_names || []).map((m) => m.trim().toUpperCase());
                        if (allocMajors.length > 0) {
                            // Wajib cocok dengan salah satu jurusan kelas target
                            const majorMatches = allocMajors.some((allocM) => {
                                return effectiveClassMajors.some(
                                    (cm) => cm === allocM || cm.includes(allocM) || allocM.includes(cm)
                                );
                            });
                            if (!majorMatches) return false;
                        }
                    }
                }

                // 3. Cek allowedMajors dari mapel guru jika ada
                if (subj?.allowedMajors && subj.allowedMajors.length > 0) {
                    const majorMatches = subj.allowedMajors.some((am) => {
                        return effectiveClassMajors.some(
                            (cm) => cm === am || cm.includes(am) || am.includes(cm)
                        );
                    });
                    if (!majorMatches) return false;
                }

                return true;
            };

            const classNames = currentClasses.map((c) => c.name);
            const sourceRows = get().rows;

            // Clone fresh rows based on active roster
            const generatedRows: ScheduleRow[] = sourceRows.map((r) => {
                const cellsCopy: Record<string, ScheduleCell> = {};
                classNames.forEach((cn) => {
                    cellsCopy[cn] = { teacherCode: null };
                });
                return {
                    ...r,
                    classCells: cellsCopy,
                };
            });

            // Tracking occupied teacher in each slot (baris) untuk mencegah bentrok double-booking
            const slotTeacherOccupied: Record<string, Set<number>> = {};
            const teacherAssignedHours: Record<number, number> = {};
            // Tracking jam per mata pelajaran per kelas: classSubjectAssigned[className][subjectCode] = jam
            const classSubjectAssigned: Record<string, Record<string, number>> = {};

            currentTeachers.forEach((t) => {
                teacherAssignedHours[t.code] = 0;
            });
            classNames.forEach((cn) => {
                classSubjectAssigned[cn] = {};
            });
            generatedRows.forEach((row) => {
                slotTeacherOccupied[row.id] = new Set<number>();
            });

            // Helper: Dapatkan target JP mingguan per kelas untuk mata pelajaran guru
            const getSubjectTargetJp = (t: TeacherCodeEntry, subjectCode?: string): number => {
                if (t.subjects && t.subjects.length > 0) {
                    const matched = t.subjects.find((s) => s.subjectCode === subjectCode);
                    if (matched && matched.targetJp) return matched.targetJp;
                    if (t.subjects[0]?.targetJp) return t.subjects[0].targetJp;
                }
                return 4; // Standar 4 JP per minggu per kelas
            };

            let requestsFulfilled = 0;

            // Step 1: Prioritas Request Pengajar dari Panel (Maksimal target JP per kelas)
            if (prioritizeRequests && requests.length > 0) {
                requests.forEach((req) => {
                    if (req.status !== 'CONFLICT' && req.preferredSlots && req.preferredSlots.length > 0) {
                        const teacherInfo = currentTeachers.find((t) => t.code === req.teacherCode);
                        const subjCode = teacherInfo?.subjectCode || `SUBJ-${req.teacherCode}`;
                        const targetJp = teacherInfo ? getSubjectTargetJp(teacherInfo, subjCode) : 4;

                        let fulfilledForThisTeacher = false;

                        // Cari kelas yang alokasi mapel ini masih kurang dari target JP dan sesuai jurusannya
                        const candidateClasses = classNames.filter((cn) => {
                            const classObj = currentClasses.find((c) => c.name === cn);
                            if (!classObj) return false;
                            if (teacherInfo && !isTeacherEligibleForClass(teacherInfo, classObj, effectiveAllocations, subjCode)) {
                                return false;
                            }
                            return (classSubjectAssigned[cn][subjCode] || 0) < targetJp;
                        });
                        if (candidateClasses.length === 0) return;

                        const targetClass = candidateClasses[Math.floor(Math.random() * candidateClasses.length)];

                        req.preferredSlots.forEach((slot) => {
                            // Cek jika kuota JP mapel ini di kelas target sudah penuh, stop alokasi
                            const currentClassJp = classSubjectAssigned[targetClass][subjCode] || 0;
                            if (currentClassJp >= targetJp) return;

                            const matchingRows = generatedRows.filter((r) => {
                                if (r.specialActivity) return false;
                                if (r.day !== slot.day) return false;
                                if (slot.jpStart && slot.jpEnd) {
                                    const jpNum = Number(r.jp);
                                    return jpNum >= slot.jpStart && jpNum <= slot.jpEnd;
                                }
                                if (slot.timeRange && r.timeRange.includes(slot.timeRange.split(' - ')[0])) {
                                    return true;
                                }
                                return false;
                            });

                            matchingRows.forEach((row) => {
                                const currentJpNow = classSubjectAssigned[targetClass][subjCode] || 0;
                                if (currentJpNow >= targetJp) return;

                                // Pastikan guru belum bentrok mengajar di kelas lain pada baris/slot ini
                                if (!slotTeacherOccupied[row.id].has(req.teacherCode)) {
                                    const existingCell = row.classCells[targetClass];
                                    if (!existingCell || !existingCell.teacherCode) {
                                        row.classCells[targetClass] = {
                                            teacherCode: req.teacherCode,
                                            teacherName: req.teacherName,
                                            subjectName: req.subjectName,
                                            subjectCode: subjCode,
                                            category: teacherInfo?.category || 'UMUM',
                                        };
                                        slotTeacherOccupied[row.id].add(req.teacherCode);
                                        teacherAssignedHours[req.teacherCode] = (teacherAssignedHours[req.teacherCode] || 0) + 1;
                                        classSubjectAssigned[targetClass][subjCode] = currentJpNow + 1;
                                        fulfilledForThisTeacher = true;
                                    }
                                }
                            });
                        });

                        if (fulfilledForThisTeacher) requestsFulfilled++;
                    }
                });
            }

            // Step 2: Strict Zero-Conflict & Target JP Enforcement Allocation untuk KBM slots
            const currentGuruPiket = get().guruPiket || [];

            generatedRows.forEach((row) => {
                if (row.specialActivity) return; // Non-KBM slot (Istirahat, Upacara, dll)

                const jpNum = Number(row.jp) || 1;
                const isAfternoonSlot = jpNum >= 5;

                const shuffledClassNames = randomizeTeachers
                    ? [...classNames].sort(() => Math.random() - 0.5)
                    : classNames;

                shuffledClassNames.forEach((className) => {
                    const existing = row.classCells[className];
                    if (existing && existing.teacherCode) return; // Slot ini sudah terisi

                    // Filter kandidat guru:
                    // 1. Jurusan & tingkat kelas sesuai aturan Alokasi JP (jangan masuk ke jurusan lain jika tidak tercantum)
                    // 2. Belum bentrok mengajar di kelas lain pada jam/slot yang sama
                    // 3. Tidak sedang bertugas piket (KBM 1 s/d jumlahJp piket)
                    // 4. Mapelnya di kelas ini BELUM memenuhi kuota target JP (misal 4 JP)
                    const classObj = currentClasses.find((c) => c.name === className);

                    const eligibleCandidates = currentTeachers.filter((t) => {
                        const subjCode = t.subjectCode || `SUBJ-${t.code}`;

                        // 1. Validasi kesesuaian jurusan & tingkat
                        if (classObj && !isTeacherEligibleForClass(t, classObj, effectiveAllocations, subjCode)) {
                            return false;
                        }

                        // 2. Cek bentrok slot
                        if (slotTeacherOccupied[row.id].has(t.code)) return false;

                        // 3. Cek bentrok tugas piket
                        const isPiketBusy = currentGuruPiket.some((p) => {
                            if (p.hari !== row.day) return false;
                            const matches =
                                (p.teacherCode && p.teacherCode === t.code) ||
                                (p.name &&
                                    (p.name.toLowerCase().includes(t.name.toLowerCase()) ||
                                        t.name.toLowerCase().includes(p.name.toLowerCase())));
                            if (!matches) return false;
                            const maxJp = Number(p.jumlahJp) || 4;
                            return jpNum <= maxJp;
                        });
                        if (isPiketBusy) return false;

                        // 4. Cek pemenuhan target JP mapel di kelas ini (TIDAK BOLEH LEBIH dari targetJp)
                        const targetJp = getSubjectTargetJp(t, subjCode);
                        const assignedJpInThisClass = classSubjectAssigned[className][subjCode] || 0;

                        return assignedJpInThisClass < targetJp;
                    });

                    // Urutkan prioritas:
                    // - Siang prioritaskan kejuruan, pagi prioritaskan umum
                    // - Prioritaskan mapel yang masih paling banyak sisa JP-nya
                    let candidatePool = [...eligibleCandidates];

                    if (candidatePool.length === 0) {
                        // Jika semua mapel di kelas ini sudah mencapai target JP, cari guru yang jurusannya cocok
                        // dan tidak bentrok (sebagai rekomendasi pengisi slot sisa)
                        const nonConflictTeachers = currentTeachers.filter((t) => {
                            const subjCode = t.subjectCode || `SUBJ-${t.code}`;
                            if (classObj && !isTeacherEligibleForClass(t, classObj, effectiveAllocations, subjCode)) {
                                return false;
                            }
                            if (slotTeacherOccupied[row.id].has(t.code)) return false;
                            const isPiketBusy = currentGuruPiket.some((p) => {
                                if (p.hari !== row.day) return false;
                                const matches =
                                    (p.teacherCode && p.teacherCode === t.code) ||
                                    (p.name &&
                                        (p.name.toLowerCase().includes(t.name.toLowerCase()) ||
                                            t.name.toLowerCase().includes(p.name.toLowerCase())));
                                if (!matches) return false;
                                return jpNum <= (Number(p.jumlahJp) || 4);
                            });
                            return !isPiketBusy;
                        });

                        candidatePool = nonConflictTeachers;
                    }

                    if (candidatePool.length > 0) {
                        if (randomizeTeachers) {
                            candidatePool.sort(() => Math.random() - 0.5);
                        }

                        if (balanceDistribution) {
                            candidatePool.sort((a, b) => {
                                const diffA = (a.targetJp || 24) - (teacherAssignedHours[a.code] || 0);
                                const diffB = (b.targetJp || 24) - (teacherAssignedHours[b.code] || 0);
                                return diffB - diffA;
                            });
                        }

                        // Preferensi jam: kejuruan di jam siang, umum di jam pagi
                        if (isAfternoonSlot) {
                            candidatePool.sort((a, b) => (b.category === 'KEJURUAN' ? 1 : 0) - (a.category === 'KEJURUAN' ? 1 : 0));
                        } else {
                            candidatePool.sort((a, b) => (b.category === 'UMUM' ? 1 : 0) - (a.category === 'UMUM' ? 1 : 0));
                        }

                        const chosenTeacher = candidatePool[0];
                        if (chosenTeacher) {
                            const subjCode = chosenTeacher.subjectCode || `SUBJ-${chosenTeacher.code}`;
                            row.classCells[className] = {
                                teacherCode: chosenTeacher.code,
                                teacherName: chosenTeacher.name,
                                subjectName: chosenTeacher.subjectName,
                                subjectCode: subjCode,
                                category: chosenTeacher.category,
                            };
                            slotTeacherOccupied[row.id].add(chosenTeacher.code);
                            teacherAssignedHours[chosenTeacher.code] = (teacherAssignedHours[chosenTeacher.code] || 0) + 1;
                            classSubjectAssigned[className][subjCode] = (classSubjectAssigned[className][subjCode] || 0) + 1;
                        }
                    }
                });
            });

            // Step 3: Enrich Extracurriculars and Special Activities
            if (includeSpecialActivities) {
                generatedRows.forEach((row) => {
                    if (row.specialActivity) {
                        if (row.day === 'Senin' && row.jp === '-') {
                            row.specialActivity.title = 'EKSTRA WAJIB KARAKTER & BUDAYA KERJA';
                        } else if (row.day === 'Kamis' && row.id.includes('ekstra-1')) {
                            row.specialActivity.title = 'EKSTRA PILIHAN: SENI MUSIK, BAND, FUTSAL, ROBOTIKA & PMR';
                        } else if (row.day === 'Kamis' && row.id.includes('ekstra-2')) {
                            row.specialActivity.title = 'EKSTRA PILIHAN KELAS XII & BOLA BASKET / DANCE';
                        } else if (row.day === 'Jumat' && row.id.includes('pramuka')) {
                            row.specialActivity.title = 'PRAMUKA GUGUS DEPAN (Wajib Kelas X & XI)';
                        } else if (row.day === 'Jumat' && row.id.includes('ekstra')) {
                            row.specialActivity.title = 'P1 / PROJEK PANCASILA (P5) & PADUAN SUARA / CHOIR';
                        }
                    }
                });
            }

            // Step 4: Verification
            const verifiedConflicts = calculateConflicts(generatedRows, currentTeachers);
            let totalFilled = 0;
            generatedRows.forEach((row) => {
                if (!row.specialActivity) {
                    Object.values(row.classCells).forEach((c) => {
                        if (c.teacherCode) totalFilled++;
                    });
                }
            });

            return {
                success: verifiedConflicts.length === 0,
                totalFilled,
                conflictsCount: verifiedConflicts.length,
                requestsFulfilled,
                generatedRows,
            };
        },

        applyGeneratedRows: async (generatedRows) => {
            const currentTeachers = get().teachers;
            const verifiedConflicts = calculateConflicts(generatedRows, currentTeachers);

            set({
                rows: generatedRows,
                conflicts: verifiedConflicts,
            });

            // Auto-save to database MySQL & sync relational schedules
            await get().saveSchedule();
            snackbar.success('Jadwal acak bebas bentrok berhasil diterapkan dan disimpan ke database MySQL!');
        },
    })
);
