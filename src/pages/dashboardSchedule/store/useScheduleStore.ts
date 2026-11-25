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
    scheduleClassExtraService,
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

export const DEFAULT_TEACHER_REQUESTS: TeacherScheduleRequest[] = [];

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
    clearScheduleSlots: (targetClassName?: string) => Promise<void>;
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
        // Check XII/12 first to avoid matching X/10 prefix
        if (g === 'XII' || g === '12' || n.startsWith('12 ') || n.startsWith('12-') || n.startsWith('XII ') || n.startsWith('XII-') || n === '12' || n === 'XII') return 12;
        if (g === 'XI' || g === '11' || n.startsWith('11 ') || n.startsWith('11-') || n.startsWith('XI ') || n.startsWith('XI-') || n === '11' || n === 'XI') return 11;
        if (g === 'X' || g === '10' || n.startsWith('10 ') || n.startsWith('10-') || n.startsWith('X ') || n.startsWith('X-') || n === '10' || n === 'X') return 10;
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
                    const isPiketSlot = matchingPiket.slots && matchingPiket.slots.length > 0
                        ? matchingPiket.slots.includes(rowJpNum)
                        : rowJpNum <= (Number(matchingPiket.jumlahJp) || 4);

                    if (isPiketSlot) {
                        const slotDesc = matchingPiket.slots && matchingPiket.slots.length > 0
                            ? `Jam Ke-${matchingPiket.slots.join(', ')}`
                            : `Slot KBM 1-${Number(matchingPiket.jumlahJp) || 4}`;

                        conflicts.push({
                            day: row.day,
                            jp: row.jp,
                            timeRange: row.timeRange,
                            teacherCode: code,
                            teacherName,
                            conflictedClasses: classList,
                            conflictType: 'PIKET_CONFLICT',
                            conflictReason: `Bentrok Tugas Piket: ${teacherName} bertugas piket hari ${row.day} (${slotDesc}), tidak dapat mengajar di ${classList.join(', ')} pada Jam Ke-${rowJpNum}`,
                        });
                    }
                }
            }
        });
    });

    // 3. Validasi 1 Mapel = 1 Guru per Kelas (SUBJECT_MULTI_TEACHER)
    // Kumpulkan semua assignment subjectCode -> teacherCode per kelas
    const classSubjectTeacherMap: Record<string, Record<string, Set<number>>> = {};
    rows.forEach((row) => {
        if (row.specialActivity) return;
        Object.entries(row.classCells).forEach(([className, cell]) => {
            if (!cell.teacherCode || !cell.subjectCode) return;
            if (!classSubjectTeacherMap[className]) classSubjectTeacherMap[className] = {};
            if (!classSubjectTeacherMap[className][cell.subjectCode]) {
                classSubjectTeacherMap[className][cell.subjectCode] = new Set();
            }
            classSubjectTeacherMap[className][cell.subjectCode].add(cell.teacherCode);
        });
    });

    // Untuk setiap kelas + mapel yang diajar oleh > 1 guru, buat conflict di setiap cell terkait
    Object.entries(classSubjectTeacherMap).forEach(([className, subjectMap]) => {
        Object.entries(subjectMap).forEach(([subjectCode, teacherCodes]) => {
            if (teacherCodes.size <= 1) return; // OK, hanya 1 guru

            const teacherCodeArr = Array.from(teacherCodes);
            const teacherNames = teacherCodeArr.map((code) => {
                const t = findTeacherByCode(teachers, code);
                return t ? `#${code} ${t.name}` : `#${code}`;
            });

            // Cari baris mana saja yang terlibat
            rows.forEach((row) => {
                if (row.specialActivity) return;
                const cell = row.classCells[className];
                if (!cell || !cell.teacherCode || cell.subjectCode !== subjectCode) return;

                const teacher = findTeacherByCode(teachers, cell.teacherCode);
                conflicts.push({
                    day: row.day,
                    jp: row.jp,
                    timeRange: row.timeRange,
                    teacherCode: cell.teacherCode,
                    teacherName: teacher?.name || `Guru #${cell.teacherCode}`,
                    conflictedClasses: [className],
                    conflictType: 'SUBJECT_MULTI_TEACHER',
                    conflictReason: `Pelanggaran 1 Mapel = 1 Guru: Mapel ${cell.subjectName || subjectCode} di kelas ${className} diajar oleh ${teacherNames.join(' & ')}. Satu mapel hanya boleh diajar 1 guru per kelas.`,
                });
            });
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

let autoSaveScheduleTimer: any = null;

const mapTeachingStaffToTeacherEntries = (staffList: TeachingTeacherRowModel[]): TeacherCodeEntry[] => {
    const result: TeacherCodeEntry[] = [];
    let codeCounter = 1;

    staffList.forEach((teacher) => {
        const fullName = `${teacher.first_name || ''} ${teacher.last_name || ''}`.trim() || 'Guru Pengajar';

        // Filter: HANYA mapel yang benar-benar aktif dan memiliki alokasi kelas di periode ini
        const validSubjects = (teacher.subjects || []).filter((subj) => {
            const hasSubject = Boolean(subj.id_subject || subj.subject_name);
            const hasClasses = Array.isArray(subj.classes) && subj.classes.length > 0;
            return hasSubject && hasClasses;
        });

        // JIKA GURU BELUM DIINPUT MATA PELAJARAN / KELASNYA PADA PERIODE INI, JANGAN TAMPILKAN!
        if (validSubjects.length === 0) {
            return;
        }

        const allAssignedClasses: string[] = [];
        const allAllowedMajors = new Set<string>();
        const allAllowedGrades = new Set<string>();

        // Petakan semua mapel yang diajar guru ini dari menu Pengajaran
        const teacherSubjects: TeacherSubjectOption[] = validSubjects.map((subj, sIdx) => {
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

        const primarySubj = teacherSubjects[0];
        if (!primarySubj) return;

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
            roles: teacher.roles || [],
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
        teacherRequests: [],
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
                // 1 Hari diawasi 1 Guru Piket: gantikan jika hari tersebut sudah ada guru piket
                const filtered = state.guruPiket.filter((p) => p.hari !== entry.hari);
                const updated = [...filtered, newEntry];
                return {
                    guruPiket: updated,
                    conflicts: calculateConflicts(state.rows, state.teachers, updated),
                };
            });
            get().triggerAutoSave();
        },

        updateGuruPiket: (index, updates) => {
            set((state) => {
                const current = state.guruPiket[index];
                if (!current) return state;
                const newEntry = { ...current, ...updates };

                // Jika hari berubah dan bentrok dengan hari lain, pastikan 1 hari hanya 1 guru piket
                let updated = state.guruPiket.map((p, i) => (i === index ? newEntry : p));
                if (updates.hari && updates.hari !== current.hari) {
                    updated = updated.filter((p, i) => i === index || p.hari !== updates.hari);
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

                    // Simpan data pilihan ekstra per kelas ke tabel khusus schedule_class_extras
                    const extraItems: any[] = [];
                    state.rows.forEach((row) => {
                        const isEkstra = Boolean(
                            row.specialActivity && (
                                row.specialActivity.activityType.toString().includes('EKSTRA') ||
                                row.specialActivity.activityType === 'PRAMUKA' ||
                                row.specialActivity.title.toUpperCase().includes('EKSTRA')
                            )
                        );
                        if (isEkstra) {
                            const activities = row.classExtraActivities || {};
                            state.classes.forEach((cls) => {
                                const rawVal = activities[cls.name] !== undefined
                                    ? activities[cls.name]
                                    : (cls.id && activities[cls.id] !== undefined ? activities[cls.id] : undefined);
                                const extraVal = rawVal !== undefined ? rawVal : (row.specialActivity?.subtitle || '');
                                extraItems.push({
                                    id_school_information: schoolInfoId,
                                    row_id: row.id,
                                    day: row.day,
                                    jp: String(row.jp),
                                    time_range: row.timeRange,
                                    class_name: cls.name,
                                    id_class: cls.id,
                                    extra_name: extraVal,
                                });
                            });
                        }
                    });

                    if (extraItems.length > 0) {
                        scheduleClassExtraService.batchSave({
                            id_school_information: schoolInfoId,
                            items: extraItems,
                        });
                    }
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

                const resolvedSubjCode = chosenSubj?.subjectCode || teacher?.subjectCode;

                // Validasi 1 Mapel = 1 Guru per Kelas
                if (teacherCode && resolvedSubjCode) {
                    const existingTeacherForSubject = new Set<number>();
                    state.rows.forEach((r) => {
                        if (r.specialActivity) return;
                        if (r.id === rowId) return; // skip the row being edited
                        const c = r.classCells[className];
                        if (c && c.teacherCode && c.subjectCode === resolvedSubjCode) {
                            existingTeacherForSubject.add(c.teacherCode);
                        }
                    });
                    // Jika ada guru lain yang sudah mengajar mapel ini di kelas ini
                    const otherTeachers = Array.from(existingTeacherForSubject).filter((tc) => tc !== teacherCode);
                    if (otherTeachers.length > 0) {
                        const otherNames = otherTeachers.map((tc) => {
                            const t = findTeacherByCode(state.teachers, tc);
                            return t ? `#${tc} ${t.name}` : `#${tc}`;
                        });
                        snackbar.error(
                            `Mapel ${chosenSubj?.subjectName || resolvedSubjCode} di kelas ${className} sudah diajar oleh guru ${otherNames.join(', ')}. Satu mapel hanya boleh diajar 1 guru per kelas.`
                        );
                    }
                }

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
                const clsObj = state.classes.find((c) => c.name === className || c.id === className);
                const newRows = state.rows.map((row) => {
                    if (row.id !== rowId) return row;
                    const updated = {
                        ...(row.classExtraActivities || {}),
                        [className]: extraName,
                    };
                    if (clsObj) {
                        if (clsObj.name) updated[clsObj.name] = extraName;
                        if (clsObj.id) updated[clsObj.id] = extraName;
                    }
                    return {
                        ...row,
                        classExtraActivities: updated,
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

        clearScheduleSlots: async (targetClassName?: string) => {
            const state = get();
            const isSpecificClass = Boolean(targetClassName && targetClassName !== 'Semua');

            const newRows = state.rows.map((row) => {
                const newClassCells = { ...row.classCells };
                if (isSpecificClass && targetClassName) {
                    newClassCells[targetClassName] = { teacherCode: null };
                } else {
                    Object.keys(newClassCells).forEach((cls) => {
                        newClassCells[cls] = { teacherCode: null };
                    });
                }
                return {
                    ...row,
                    classCells: newClassCells,
                };
            });

            const newConflicts = calculateConflicts(newRows, state.teachers, state.guruPiket);
            set({
                rows: newRows,
                conflicts: newConflicts,
            });

            await get().saveSchedule();
            if (isSpecificClass && targetClassName) {
                snackbar.success(`Seluruh slot KBM kelas ${targetClassName} berhasil dikosongkan!`);
            } else {
                snackbar.success('Seluruh slot KBM di semua kelas berhasil dikosongkan!');
            }
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
                        ? { params: { id_school_information: schoolInfoId, limit: 100 } }
                        : { params: { limit: 100 } }
                );
            } catch (err) {
                console.error('Error fetching effective week allocations:', err);
            }
        },

        fetchClassesFromDatabase: async (schoolInfoId?: string) => {
            try {
                const targetSchoolInfoId = schoolInfoId || get().selectedSchoolInfoId || get().idSchoolInformation;
                await classService.getAll(
                    {
                        onSuccess: (res) => {
                            const rawList: any[] = Array.isArray(res.data)
                                ? res.data
                                : Array.isArray((res.data as any)?.data)
                                ? (res.data as any).data
                                : [];

                            // Filter strictly by targetSchoolInfoId if available
                            const filteredBySchool = targetSchoolInfoId
                                ? rawList.filter((c: any) => c.id_school_information === targetSchoolInfoId || c.school_information?.id_school_information === targetSchoolInfoId)
                                : rawList;
                            const classList = filteredBySchool.length > 0 ? filteredBySchool : rawList;

                            const dbClasses: ClassColumn[] = classList.map((c: any) => {
                                let grade: 'X' | 'XI' | 'XII' = 'X';
                                const k = (c.kelas || '').trim().toUpperCase();
                                const n = (c.name || '').trim().toUpperCase();
                                // Check XII first to avoid false match on X prefix
                                if (k === '12' || k === 'XII' || n.startsWith('12 ') || n.startsWith('12-') || n.startsWith('XII ') || n.startsWith('XII-')) grade = 'XII';
                                else if (k === '11' || k === 'XI' || n.startsWith('11 ') || n.startsWith('11-') || n.startsWith('XI ') || n.startsWith('XI-')) grade = 'XI';
                                else grade = 'X';

                                return {
                                    id: c.id_class,
                                    name: c.name || `${grade} ${c.major?.name || ''}`.trim(),
                                    grade,
                                    major: c.major?.name || '',
                                };
                            });

                            // Deduplicate classes by name so duplicate periods don't pollute matrix columns
                            const seenNames = new Set<string>();
                            const uniqueClasses: ClassColumn[] = [];
                            for (const cls of dbClasses) {
                                if (!seenNames.has(cls.name)) {
                                    seenNames.add(cls.name);
                                    uniqueClasses.push(cls);
                                }
                            }

                            // Urutkan kelas sesuai kaidah pedagogik: Kelas X -> XI -> XII, lalu menurut jurusan
                            uniqueClasses.sort(sortClassesByGradeAndName);

                            set({ classes: uniqueClasses });
                            if (!uniqueClasses.some((m) => m.name === get().selectedClassForInput)) {
                                set({ selectedClassForInput: uniqueClasses[0]?.name || '' });
                            }
                            if (get().selectedClassFilter !== 'Semua' && !uniqueClasses.some((m) => m.name === get().selectedClassFilter)) {
                                set({ selectedClassFilter: 'Semua' });
                            }
                        },
                        onError: () => {},
                    },
                    targetSchoolInfoId
                        ? { params: { id_school_information: targetSchoolInfoId, limit: 100 } }
                        : { params: { limit: 100 } }
                );
            } catch {
                // Ignore
            }
        },

        setSchoolInformationId: async (id: string) => {
            set({ idSchoolInformation: id, selectedSchoolInfoId: id, selectedClassFilter: 'Semua', teacherRequests: [] });
            await get().loadScheduleFromDatabase(id);
        },

        syncFromDatabaseTeachingStaff: async (customSchoolInfoId?: string) => {
            try {
                const schoolInfoId = customSchoolInfoId || get().idSchoolInformation;
                if (!schoolInfoId) {
                    set({ teachingStaff: [], teachers: [] });
                    return;
                }
                await teachingService.getAll(
                    {
                        onSuccess: (res) => {
                            const staffList = res.data || [];
                            set({ teachingStaff: staffList });

                            // Selalu map guru sesuai periode. Jika periode belum ada guru, teachers jadi []
                            const mappedTeachers = mapTeachingStaffToTeacherEntries(staffList);
                            set((prev) => ({
                                teachers: mappedTeachers,
                                conflicts: calculateConflicts(prev.rows, mappedTeachers),
                            }));
                        },
                        onError: () => {
                            set({ teachingStaff: [], teachers: [] });
                        },
                    },
                    { params: { id_school_information: schoolInfoId, limit: 100 } }
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
                schoolInfoId = customSchoolInfoId || get().idSchoolInformation;

                // 2. Ambil data kelas murni dari database MySQL (classes table)
                await get().fetchClassesFromDatabase(schoolInfoId);
                const currentClasses = get().classes;

                // 3. Ambil data guru & penugasan mengajar murni dari database MySQL (teacher_subjects & employees)
                await get().syncFromDatabaseTeachingStaff(schoolInfoId);
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

                // Bangun baris jadwal bersih berdasarkan roster jam belajar dan kelas riil
                const baseRows = buildScheduleRowsFromRoster(rosterData, currentClasses);

                // 5. Ambil data matriks jadwal dari database MySQL
                let savedRows: ScheduleRow[] | null = null;
                if (schoolInfoId) {
                    await matrixService.getBySchoolInformation(schoolInfoId, {
                        onSuccess: (res) => {
                            if (res && res.matrix_data && Array.isArray(res.matrix_data) && res.matrix_data.length > 0) {
                                savedRows = res.matrix_data;
                            }
                            let piketList: GuruPiketEntry[] = [];
                            if (res && res.guru_piket_data) {
                                piketList = typeof res.guru_piket_data === 'string'
                                    ? JSON.parse(res.guru_piket_data)
                                    : res.guru_piket_data;
                            }
                            set({ guruPiket: Array.isArray(piketList) ? piketList : [] });
                            if (res && res.approval_data) {
                                set({ approvalData: res.approval_data });
                            }
                        },
                        onError: () => {},
                    });
                }

                // Ambil data ekstra per kelas langsung dari tabel database khusus schedule_class_extras
                let tableExtras: any[] = [];
                if (schoolInfoId) {
                    await scheduleClassExtraService.getBySchoolInformation(schoolInfoId, {
                        onSuccess: (list) => {
                            if (Array.isArray(list) && list.length > 0) {
                                tableExtras = list;
                            }
                        },
                        onError: () => {},
                    });
                }

                const initialMerged = (savedRows && Array.isArray(savedRows) && savedRows.length > 0)
                    ? baseRows.map((bRow) => {
                        // Pencocokan presisi: ID persis, atau Hari + Waktu (timeRange), atau Hari + JP (hanya untuk KBM)
                        const matchedSaved = savedRows!.find((s) => {
                            if (s.id && bRow.id && s.id === bRow.id) return true;
                            if (s.day === bRow.day && s.timeRange && bRow.timeRange && s.timeRange.trim() === bRow.timeRange.trim()) return true;
                            if (bRow.jp !== '-' && s.jp !== '-' && s.day === bRow.day && String(s.jp) === String(bRow.jp)) return true;
                            return false;
                        });

                        if (matchedSaved) {
                            // Jaga integritas jenis aktivitas dari Roster Jam Belajar (Roster adalah source-of-truth)
                            // Jika bRow dari roster adalah EKSTRA, jangan pernah tertimpa menjadi ISTIRAHAT
                            let resolvedSpecialActivity = bRow.specialActivity;
                            if (!resolvedSpecialActivity && matchedSaved.specialActivity) {
                                resolvedSpecialActivity = matchedSaved.specialActivity;
                            } else if (resolvedSpecialActivity && matchedSaved.specialActivity) {
                                const isBaseEkstra = resolvedSpecialActivity.activityType.toString().includes('EKSTRA') ||
                                    resolvedSpecialActivity.activityType === 'PRAMUKA' ||
                                    resolvedSpecialActivity.title.toUpperCase().includes('EKSTRA');
                                if (isBaseEkstra) {
                                    resolvedSpecialActivity = {
                                        ...resolvedSpecialActivity,
                                        subtitle: matchedSaved.specialActivity.subtitle || resolvedSpecialActivity.subtitle,
                                    };
                                }
                            }

                            return {
                                ...bRow,
                                specialActivity: resolvedSpecialActivity,
                                ...(matchedSaved.classExtraActivities ? { classExtraActivities: { ...matchedSaved.classExtraActivities } } : {}),
                                classCells: {
                                    ...bRow.classCells,
                                    ...(matchedSaved.classCells || {}),
                                },
                            };
                        }
                        return bRow;
                    })
                    : baseRows;

                // Terapkan data dari tabel khusus schedule_class_extras jika ada
                const mergedRows = initialMerged.map((row) => {
                    const isEkstra = Boolean(
                        row.specialActivity && (
                            row.specialActivity.activityType.toString().includes('EKSTRA') ||
                            row.specialActivity.activityType === 'PRAMUKA' ||
                            row.specialActivity.title.toUpperCase().includes('EKSTRA')
                        )
                    );
                    if (!isEkstra) {
                        if (row.classExtraActivities) {
                            const { classExtraActivities, ...rest } = row;
                            return rest;
                        }
                        return row;
                    }

                    const matchingExtras = tableExtras.filter(
                        (te) => te.row_id === row.id || (
                            te.day === row.day &&
                            te.time_range &&
                            row.timeRange &&
                            te.time_range.trim() === row.timeRange.trim()
                        )
                    );
                    if (matchingExtras.length > 0) {
                        const updatedActivities = { ...(row.classExtraActivities || {}) };
                        matchingExtras.forEach((te) => {
                            const val = te.extra_name ?? '';
                            if (te.class_name) {
                                updatedActivities[te.class_name] = val;
                            }
                            if (te.id_class) {
                                updatedActivities[te.id_class] = val;
                            }
                        });
                        return {
                            ...row,
                            classExtraActivities: updatedActivities,
                        };
                    }
                    return row;
                });

                set({
                    rows: mergedRows,
                    conflicts: calculateConflicts(mergedRows, currentTeachers),
                });

                // Sinkronkan daftar request jadwal pengajar sesuai guru aktif pada periode ini
                await get().fetchTeacherRequests();
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
                    // 1. Simpan matriks ke school_matrix_schedules (juga otomatis sync backend ke schedule_class_extras)
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
                            onSuccess: () => {},
                            onError: (err) => {
                                console.warn('Matrix save warning:', err);
                            },
                        }
                    );

                    // 2. Simpan secara eksplisit ke tabel khusus schedule_class_extras
                    const extraItems: any[] = [];
                    state.rows.forEach((row) => {
                        const isEkstra = Boolean(
                            row.specialActivity && (
                                row.specialActivity.activityType.toString().includes('EKSTRA') ||
                                row.specialActivity.activityType === 'PRAMUKA' ||
                                row.specialActivity.title.toUpperCase().includes('EKSTRA')
                            )
                        );
                        if (isEkstra) {
                            const activities = row.classExtraActivities || {};
                            state.classes.forEach((cls) => {
                                const rawVal = activities[cls.name] !== undefined
                                    ? activities[cls.name]
                                    : (cls.id && activities[cls.id] !== undefined ? activities[cls.id] : undefined);
                                const extraVal = rawVal !== undefined ? rawVal : (row.specialActivity?.subtitle || '');
                                extraItems.push({
                                    id_school_information: schoolInfoId,
                                    row_id: row.id,
                                    day: row.day,
                                    jp: String(row.jp),
                                    time_range: row.timeRange,
                                    class_name: cls.name,
                                    id_class: cls.id,
                                    extra_name: extraVal,
                                });
                            });
                        }
                    });

                    if (extraItems.length > 0) {
                        try {
                            await scheduleClassExtraService.batchSave({
                                id_school_information: schoolInfoId,
                                items: extraItems,
                            });
                        } catch (err) {
                            console.warn('Batch save extra error:', err);
                        }
                    }

                    snackbar.success('Jadwal pelajaran & data ekstra per kelas berhasil disimpan ke database MySQL!');
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
                const activeTeachers = get().teachers;

                // Jika pada periode ini belum ada guru yang terdaftar, kosongkan request
                if (!schoolInfoId || activeTeachers.length === 0) {
                    set({ teacherRequests: [] });
                    return;
                }

                await teacherRequestService.getAll(
                    {
                        onSuccess: (dataList) => {
                            if (Array.isArray(dataList) && dataList.length > 0) {
                                const formatted: TeacherScheduleRequest[] = dataList
                                    .map((item) => ({
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
                                    }))
                                    // Pastikan hanya request untuk guru yang terdaftar di periode aktif
                                    .filter((req) =>
                                        activeTeachers.some(
                                            (t) =>
                                                t.code === req.teacherCode ||
                                                (t.name && req.teacherName && t.name.trim().toLowerCase() === req.teacherName.trim().toLowerCase())
                                        )
                                    );
                                set({ teacherRequests: formatted });
                            } else {
                                set({ teacherRequests: [] });
                            }
                        },
                        onError: () => {
                            set({ teacherRequests: [] });
                        },
                    },
                    schoolInfoId || undefined
                );
            } catch {
                set({ teacherRequests: [] });
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
            // Tracking jam per mata pelajaran per kelas secara MINGGUAN: classSubjectAssigned[className][subjectCode] = jam
            const classSubjectAssigned: Record<string, Record<string, number>> = {};
            // Tracking jam per mata pelajaran per kelas PER HARI (maksimal 4 JP per hari): classSubjectDailyAssigned[className][day][subjectCode] = jam
            const classSubjectDailyAssigned: Record<string, Record<string, Record<string, number>>> = {};
            // Tracking 1 mapel = 1 guru per kelas: classSubjectTeacher[className][subjectCode] = teacherCode
            const classSubjectTeacher: Record<string, Record<string, number>> = {};

            currentTeachers.forEach((t) => {
                teacherAssignedHours[t.code] = 0;
            });
            classNames.forEach((cn) => {
                classSubjectAssigned[cn] = {};
                classSubjectDailyAssigned[cn] = {};
                classSubjectTeacher[cn] = {};
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

            // Helper penugasan sel dengan update kuota mingguan dan harian
            const assignCell = (
                row: ScheduleRow,
                className: string,
                teacher: TeacherCodeEntry,
                subjCode: string,
                subjectName?: string
            ) => {
                row.classCells[className] = {
                    teacherCode: teacher.code,
                    teacherName: teacher.name,
                    subjectName: subjectName || teacher.subjectName,
                    subjectCode: subjCode,
                    category: teacher.category || 'UMUM',
                };
                slotTeacherOccupied[row.id].add(teacher.code);
                teacherAssignedHours[teacher.code] = (teacherAssignedHours[teacher.code] || 0) + 1;
                classSubjectAssigned[className][subjCode] = (classSubjectAssigned[className][subjCode] || 0) + 1;
                if (!classSubjectDailyAssigned[className][row.day]) {
                    classSubjectDailyAssigned[className][row.day] = {};
                }
                classSubjectDailyAssigned[className][row.day][subjCode] =
                    (classSubjectDailyAssigned[className][row.day][subjCode] || 0) + 1;
                // Track 1 mapel = 1 guru per kelas
                classSubjectTeacher[className][subjCode] = teacher.code;
            };

            let requestsFulfilled = 0;

            // Step 1: Rekomendasi Request Pengajar (Maksimal target JP per minggu dan 4 JP per hari)
            if (prioritizeRequests && requests.length > 0) {
                requests.forEach((req) => {
                    if (req.status !== 'CONFLICT' && req.preferredSlots && req.preferredSlots.length > 0) {
                        const teacherInfo = currentTeachers.find((t) => t.code === req.teacherCode);
                        if (!teacherInfo) return;
                        const subjCode = teacherInfo.subjectCode || `SUBJ-${req.teacherCode}`;
                        const targetJp = getSubjectTargetJp(teacherInfo, subjCode);

                        // Cari kelas yang alokasi mapel ini masih kurang dari target JP dan sesuai jurusannya
                        let candidateClasses = classNames.filter((cn) => {
                            const classObj = currentClasses.find((c) => c.name === cn);
                            if (!classObj) return false;
                            return isTeacherEligibleForClass(teacherInfo, classObj, effectiveAllocations, subjCode);
                        });

                        // Filter berdasarkan recommendedClasses dari request (jika ada)
                        if (req.recommendedClasses && req.recommendedClasses.length > 0) {
                            const recommended = candidateClasses.filter((cn) =>
                                req.recommendedClasses!.includes(cn)
                            );
                            if (recommended.length > 0) candidateClasses = recommended;
                        }

                        let fulfilledForThisTeacher = false;

                        req.preferredSlots.forEach((slot) => {
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
                                // Jika guru sudah terpakai di slot ini pada kelas lain, jangan bentrok
                                if (slotTeacherOccupied[row.id].has(req.teacherCode)) return;

                                // Cari kelas yang belum terisi di jam ini, belum tembus target mingguan, dan belum 4 JP hari ini
                                const availableClass = candidateClasses.find((cn) => {
                                    const existingCell = row.classCells[cn];
                                    if (existingCell && existingCell.teacherCode) return false;
                                    const weeklyCount = classSubjectAssigned[cn][subjCode] || 0;
                                    const dailyCount = classSubjectDailyAssigned[cn]?.[row.day]?.[subjCode] || 0;
                                    if (weeklyCount >= targetJp || dailyCount >= 4) return false;
                                    // 1 Mapel = 1 Guru per Kelas
                                    const existingTeacher = classSubjectTeacher[cn]?.[subjCode];
                                    if (existingTeacher !== undefined && existingTeacher !== req.teacherCode) return false;
                                    return true;
                                });

                                if (availableClass) {
                                    assignCell(row, availableClass, teacherInfo, subjCode, req.subjectName);
                                    fulfilledForThisTeacher = true;
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
                    // 1. Jurusan & tingkat kelas sesuai aturan Alokasi JP
                    // 2. Belum bentrok mengajar di kelas lain pada jam/slot yang sama
                    // 3. Tidak sedang bertugas piket (KBM 1 s/d jumlahJp piket)
                    // 4. Batasan harian: MAKSIMAL 4 JP per hari untuk mapel ini di kelas ini
                    // 5. Batasan mingguan: BELUM memenuhi kuota target JP (misal 4 JP per minggu)
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
                            return p.slots && p.slots.length > 0
                                ? p.slots.includes(jpNum)
                                : jpNum <= (Number(p.jumlahJp) || 4);
                        });
                        if (isPiketBusy) return false;

                        // 4. Batasan harian: maksimal 4 JP per hari
                        const dailyCount = classSubjectDailyAssigned[className]?.[row.day]?.[subjCode] || 0;
                        if (dailyCount >= 4) return false;

                        // 5. Cek pemenuhan target JP mingguan (TIDAK BOLEH LEBIH dari targetJp)
                        const targetJp = getSubjectTargetJp(t, subjCode);
                        const assignedJpInThisClass = classSubjectAssigned[className][subjCode] || 0;

                        if (assignedJpInThisClass >= targetJp) return false;

                        // 6. Validasi 1 Mapel = 1 Guru per Kelas
                        // Jika mapel ini sudah diajar guru lain di kelas ini, tolak
                        const existingTeacher = classSubjectTeacher[className]?.[subjCode];
                        if (existingTeacher !== undefined && existingTeacher !== t.code) return false;

                        return true;
                    });

                    // Urutkan prioritas:
                    // - Rekomendasi slot request pengajar
                    // - Kesinambungan jam (chaining 2-4 JP berurutan)
                    // - Siang prioritaskan kejuruan, pagi prioritaskan umum
                    // - Keseimbangan beban jam mengajar guru
                    let candidatePool = [...eligibleCandidates];

                    if (candidatePool.length === 0) {
                        // Jika semua mapel di kelas ini sudah mencapai target JP, cari guru yang jurusannya cocok
                        // dan tidak bentrok (sebagai rekomendasi pengisi slot sisa) dengan tetap taat batas 4 JP/hari
                        const nonConflictTeachers = currentTeachers.filter((t) => {
                            const subjCode = t.subjectCode || `SUBJ-${t.code}`;
                            if (classObj && !isTeacherEligibleForClass(t, classObj, effectiveAllocations, subjCode)) {
                                return false;
                            }
                            if (slotTeacherOccupied[row.id].has(t.code)) return false;
                            const dailyCount = classSubjectDailyAssigned[className]?.[row.day]?.[subjCode] || 0;
                            if (dailyCount >= 4) return false;

                            const isPiketBusy = currentGuruPiket.some((p) => {
                                if (p.hari !== row.day) return false;
                                const matches =
                                    (p.teacherCode && p.teacherCode === t.code) ||
                                    (p.name &&
                                        (p.name.toLowerCase().includes(t.name.toLowerCase()) ||
                                            t.name.toLowerCase().includes(p.name.toLowerCase())));
                                if (!matches) return false;
                                return p.slots && p.slots.length > 0
                                    ? p.slots.includes(jpNum)
                                    : jpNum <= (Number(p.jumlahJp) || 4);
                            });
                            if (isPiketBusy) return false;

                            // Validasi 1 Mapel = 1 Guru per Kelas (fallback pool)
                            const existingTeacher = classSubjectTeacher[className]?.[subjCode];
                            if (existingTeacher !== undefined && existingTeacher !== t.code) return false;

                            return true;
                        });

                        candidatePool = nonConflictTeachers;
                    }

                    if (candidatePool.length > 0) {
                        // Prioritaskan guru yang merekomendasikan slot ini pada request jadwal
                        const isRequested = (t: TeacherCodeEntry): boolean => {
                            return requests.some((req) => {
                                if (req.teacherCode !== t.code || req.status === 'CONFLICT') return false;
                                return (req.preferredSlots || []).some((ps) => {
                                    if (ps.day !== row.day) return false;
                                    if (ps.jpStart && ps.jpEnd) {
                                        return jpNum >= ps.jpStart && jpNum <= ps.jpEnd;
                                    }
                                    if (ps.timeRange && row.timeRange.includes(ps.timeRange.split(' - ')[0])) {
                                        return true;
                                    }
                                    return false;
                                });
                            });
                        };

                        // Prioritaskan kesinambungan jam pelajaran di kelas ini (blok 2-4 JP berurutan)
                        const isChainedWithPreviousJp = (t: TeacherCodeEntry): boolean => {
                            const prevRow = generatedRows.find(
                                (r) => r.day === row.day && Number(r.jp) === jpNum - 1
                            );
                            return prevRow?.classCells[className]?.teacherCode === t.code;
                        };

                        candidatePool.sort((a, b) => {
                            const reqA = isRequested(a) ? 1 : 0;
                            const reqB = isRequested(b) ? 1 : 0;
                            if (reqB !== reqA) return reqB - reqA;

                            const chainA = isChainedWithPreviousJp(a) ? 1 : 0;
                            const chainB = isChainedWithPreviousJp(b) ? 1 : 0;
                            if (chainB !== chainA) return chainB - chainA;

                            return 0;
                        });

                        if (randomizeTeachers) {
                            candidatePool.sort((a, b) => {
                                if (isRequested(a) || isRequested(b)) return 0;
                                if (isChainedWithPreviousJp(a) || isChainedWithPreviousJp(b)) return 0;
                                return Math.random() - 0.5;
                            });
                        }

                        if (balanceDistribution) {
                            candidatePool.sort((a, b) => {
                                if (isRequested(a) || isRequested(b)) return 0;
                                const diffA = (a.targetJp || 24) - (teacherAssignedHours[a.code] || 0);
                                const diffB = (b.targetJp || 24) - (teacherAssignedHours[b.code] || 0);
                                return diffB - diffA;
                            });
                        }

                        // Preferensi jam: kejuruan di jam siang, umum di jam pagi
                        if (isAfternoonSlot) {
                            candidatePool.sort((a, b) => {
                                if (isRequested(a) || isRequested(b)) return 0;
                                return (b.category === 'KEJURUAN' ? 1 : 0) - (a.category === 'KEJURUAN' ? 1 : 0);
                            });
                        } else {
                            candidatePool.sort((a, b) => {
                                if (isRequested(a) || isRequested(b)) return 0;
                                return (b.category === 'UMUM' ? 1 : 0) - (a.category === 'UMUM' ? 1 : 0);
                            });
                        }

                        const chosenTeacher = candidatePool[0];
                        if (chosenTeacher) {
                            const subjCode = chosenTeacher.subjectCode || `SUBJ-${chosenTeacher.code}`;
                            assignCell(row, className, chosenTeacher, subjCode);
                        }
                    }
                });
            });

            // Step 3: Enrich Extracurriculars and Special Activities (HANYA untuk baris yang berjenis EKSTRA)
            if (includeSpecialActivities) {
                generatedRows.forEach((row) => {
                    if (row.specialActivity) {
                        const isEkstra = Boolean(
                            row.specialActivity.activityType.toString().includes('EKSTRA') ||
                            row.specialActivity.activityType === 'PRAMUKA' ||
                            row.specialActivity.title.toUpperCase().includes('EKSTRA')
                        );
                        if (isEkstra) {
                            if (row.day === 'Senin') {
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
