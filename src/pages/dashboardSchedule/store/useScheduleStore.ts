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
} from '@api/schedule/service';
import TeachingService from '@api/teaching/service';
import type { TeachingTeacherRowModel } from '@api/teaching/model';
import SchoolInformationService from '@api/schoolinformation/service';
import type { SchoolInformationResponseModel } from '@api/schoolinformation/model';
import ClassService from '@api/class/service';
import { snackbar } from '@utils/snackbar';

const matrixService = new MatrixScheduleService();
const teacherRequestService = new TeacherScheduleRequestService();
const rosterScheduleService = new RosterScheduleService();
const teachingService = new TeachingService();
const schoolInfoService = new SchoolInformationService();
const classService = new ClassService();

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

    // Teacher Operations
    updateTeacher: (code: number, updates: Partial<TeacherCodeEntry>) => void;
    addTeacher: (newTeacher: Omit<TeacherCodeEntry, 'code'> & { code?: number }) => void;
    deleteTeacher: (code: number) => void;

    // Generator & Database Integration
    setSchoolInformationId: (id: string) => Promise<void>;
    fetchSchoolInformations: () => Promise<void>;
    fetchClassesFromDatabase: (schoolInfoId?: string) => Promise<void>;
    loadScheduleFromDatabase: (customSchoolInfoId?: string) => Promise<void>;
    syncFromDatabaseTeachingStaff: () => Promise<void>;
    generateTableFromRosterJam: () => Promise<void>;
    autoScheduleSmart: () => void;
    resetToOfficialTemplate: () => Promise<void>;
    saveSchedule: () => Promise<void>;
}

const findTeacherByCode = (
    teachers: TeacherCodeEntry[],
    code: number | null
): TeacherCodeEntry | undefined => {
    if (!code) return undefined;
    return teachers.find((t) => t.code === code);
};

const calculateConflicts = (
    rows: ScheduleRow[],
    teachers: TeacherCodeEntry[]
): ScheduleConflict[] => {
    const conflicts: ScheduleConflict[] = [];

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
            if (classList.length > 1) {
                const code = Number(codeStr);
                const teacher = findTeacherByCode(teachers, code);
                conflicts.push({
                    day: row.day,
                    jp: row.jp,
                    timeRange: row.timeRange,
                    teacherCode: code,
                    teacherName: teacher?.name || `Guru #${code}`,
                    conflictedClasses: classList,
                });
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

                        specialActivity = {
                            isSpecial: true as const,
                            activityType,
                            title: slot.jenisJam || jenisRaw,
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

        // Petakan semua mapel yang diajar guru ini dari menu Pengajaran
        const teacherSubjects: TeacherSubjectOption[] = (teacher.subjects || []).map((subj, sIdx) => {
            const isKejuruan =
                ((subj as any).category_name || '').toLowerCase().includes('kejuruan') ||
                (subj.subject_name || '').toLowerCase().includes('akuntansi') ||
                (subj.subject_name || '').toLowerCase().includes('jaringan') ||
                (subj.subject_name || '').toLowerCase().includes('komputer') ||
                (subj.subject_name || '').toLowerCase().includes('dkv') ||
                (subj.subject_name || '').toLowerCase().includes('tkj');

            return {
                idSubject: subj.id_subject || subj.id_teacher_subject,
                subjectName: subj.subject_name || 'Mata Pelajaran',
                subjectCode: subj.code_subject || `MP-${sIdx + 1}`,
                category: isKejuruan ? 'KEJURUAN' : 'UMUM',
                targetJp: subj.jp_amount || 4,
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

                const newRows = state.rows.map((row) => {
                    if (row.id !== rowId) return row;
                    return {
                        ...row,
                        specialActivity: {
                            isSpecial: true as const,
                            activityType,
                            title,
                            fullSpan: true,
                            colorScheme: colors[activityType] || colors.UPACARA,
                        },
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
                    };
                });

                return {
                    rows: newRows,
                    conflicts: calculateConflicts(newRows, state.teachers),
                };
            });
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
                    rosterData = getStoredRosterData(schoolInfoId, activeInfo?.periode);
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

        fetchClassesFromDatabase: async (schoolInfoId?: string) => {
            try {
                await classService.getAll(
                    {
                        onSuccess: (res) => {
                            const classList = res.data || [];
                            const dbClasses: ClassColumn[] = classList.map((c) => {
                                let grade: 'X' | 'XI' | 'XII' = 'X';
                                const k = (c.kelas || '').trim().toUpperCase();
                                if (k === '11' || k === 'XI') grade = 'XI';
                                else if (k === '12' || k === 'XII') grade = 'XII';
                                else grade = 'X';

                                return {
                                    id: c.id_class,
                                    name: c.name || `${grade} ${c.major?.name || ''}`.trim(),
                                    grade,
                                    major: c.major?.name || '',
                                };
                            });

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

                // 1. Ambil daftar informasi sekolah
                await get().fetchSchoolInformations();
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
                    rosterData = getStoredRosterData(schoolInfoId, activeInfo?.periode);
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

            // Tracking occupied teacher in each slot
            const slotTeacherOccupied: Record<string, Set<number>> = {};
            const teacherAssignedHours: Record<number, number> = {};
            currentTeachers.forEach((t) => {
                teacherAssignedHours[t.code] = 0;
            });
            generatedRows.forEach((row) => {
                slotTeacherOccupied[row.id] = new Set<number>();
            });

            let requestsFulfilled = 0;

            // Step 1: Lock in Teacher Requests if enabled
            if (prioritizeRequests && requests.length > 0) {
                requests.forEach((req) => {
                    if (req.status !== 'CONFLICT' && req.preferredSlots) {
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

                            if (matchingRows.length > 0) {
                                const targetClass = classNames[Math.floor(Math.random() * classNames.length)];
                                matchingRows.forEach((row) => {
                                    if (!slotTeacherOccupied[row.id].has(req.teacherCode)) {
                                        const teacherInfo = currentTeachers.find((t) => t.code === req.teacherCode);
                                        row.classCells[targetClass] = {
                                            teacherCode: req.teacherCode,
                                            teacherName: req.teacherName,
                                            subjectName: req.subjectName,
                                            category: teacherInfo?.category || 'UMUM',
                                        };
                                        slotTeacherOccupied[row.id].add(req.teacherCode);
                                        teacherAssignedHours[req.teacherCode] = (teacherAssignedHours[req.teacherCode] || 0) + 1;
                                        fulfilledForThisTeacher = true;
                                    }
                                });
                            }
                        });
                        if (fulfilledForThisTeacher) requestsFulfilled++;
                    }
                });
            }

            // Step 2: Strict Zero-Conflict Allocation for KBM slots
            const kejuruanTeachers = currentTeachers.filter((t) => t.category === 'KEJURUAN');
            const umumTeachers = currentTeachers.filter((t) => t.category === 'UMUM');

            generatedRows.forEach((row) => {
                if (row.specialActivity) return; // Non-KBM slot

                const jpNum = Number(row.jp) || 1;
                const isAfternoonSlot = jpNum >= 5;

                const shuffledClassNames = randomizeTeachers
                    ? [...classNames].sort(() => Math.random() - 0.5)
                    : classNames;

                shuffledClassNames.forEach((className) => {
                    const existing = row.classCells[className];
                    if (existing && existing.teacherCode) return; // already locked

                    let candidatePool: TeacherCodeEntry[] = isAfternoonSlot
                        ? [...kejuruanTeachers, ...umumTeachers]
                        : [...umumTeachers, ...kejuruanTeachers];

                    if (candidatePool.length === 0) {
                        candidatePool = [...currentTeachers];
                    }

                    if (randomizeTeachers) {
                        candidatePool = [...candidatePool].sort(() => Math.random() - 0.5);
                    }

                    if (balanceDistribution) {
                        candidatePool.sort((a, b) => {
                            const diffA = (a.targetJp || 24) - (teacherAssignedHours[a.code] || 0);
                            const diffB = (b.targetJp || 24) - (teacherAssignedHours[b.code] || 0);
                            return diffB - diffA;
                        });
                    }

                    // Choose teacher who is NOT yet occupied in this row/slot
                    const chosenTeacher = candidatePool.find(
                        (t) => !slotTeacherOccupied[row.id].has(t.code)
                    );

                    if (chosenTeacher) {
                        row.classCells[className] = {
                            teacherCode: chosenTeacher.code,
                            teacherName: chosenTeacher.name,
                            subjectName: chosenTeacher.subjectName,
                            subjectCode: chosenTeacher.subjectCode,
                            category: chosenTeacher.category,
                        };
                        slotTeacherOccupied[row.id].add(chosenTeacher.code);
                        teacherAssignedHours[chosenTeacher.code] = (teacherAssignedHours[chosenTeacher.code] || 0) + 1;
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
