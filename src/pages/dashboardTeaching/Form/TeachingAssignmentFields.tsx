import { useEffect, useMemo } from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
    Autocomplete,
    Box,
    Chip,
    Divider,
    MenuItem,
    TextField,
    Typography,
} from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CalculateOutlinedIcon from "@mui/icons-material/CalculateOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import { DialogBody } from "@components/Dialog";
import { MAX_SUBJECTS_PER_TEACHER } from "@api/teaching/model";
import useDashboardTeachingStore from "../store";
import {
    getSubjectJpFromEffectiveWeeks,
    formatJpLabel,
    calculateTeacherTotalJp,
} from "../utils/teachingBusinessLogic";
import type { TeachingAssignmentFormValues } from "./utils/teachingAssignmentForm";

const TeachingAssignmentFields = () => {
    const {
        control,
        formState: { errors },
        setValue,
        watch,
    } = useFormContext<TeachingAssignmentFormValues>();
    const { state } = useDashboardTeachingStore();

    const serverErrorMessage = (
        errors.root as { serverError?: { message?: string } } | undefined
    )?.serverError?.message;

    const selectedTeacherId = watch("id_teacher");
    const selectedSubjectId = watch("id_subject");
    const selectedSubjectIds = watch("id_subjects") || [];
    const selectedPeriodId = watch("id_school_information");

    const selectedTeacher =
        state.employees.find((employee) => employee.id === selectedTeacherId) || null;

    const teacherGroup = state.data.find(
        (group) => group.id_teacher === selectedTeacherId
    );
    const teacherExistingSubjects = teacherGroup?.subjects || [];
    const teacherCurrentTotalJp =
        teacherGroup?.total_jp ?? calculateTeacherTotalJp(teacherExistingSubjects);

    // Filter available subjects: HANYA mata pelajaran yang sudah terdaftar di alokasi minggu efektif!
    const availableSubjects = useMemo(() => {
        const subjectsWithAllocation = new Set(
            state.effectiveWeeks
                .filter(
                    (ew) =>
                        !selectedPeriodId ||
                        !ew.id_school_information ||
                        ew.id_school_information === selectedPeriodId
                )
                .map((ew) => ew.id_subject)
        );

        return state.subjects.filter((s) => {
            const id = s.id_subject || s.id;
            return subjectsWithAllocation.has(id);
        });
    }, [state.subjects, state.effectiveWeeks, selectedPeriodId]);

    // Multiple subjects resolution
    const activeSelectedSubjectIds = useMemo(() => {
        if (selectedSubjectIds.length > 0) return selectedSubjectIds;
        if (selectedSubjectId) return [selectedSubjectId];
        return [];
    }, [selectedSubjectIds, selectedSubjectId]);

    const selectedSubjectsObjects = useMemo(() => {
        return state.subjects.filter((s) => {
            const id = s.id_subject || s.id;
            return activeSelectedSubjectIds.includes(id);
        });
    }, [state.subjects, activeSelectedSubjectIds]);

    // Calculate details for each selected subject (JP is auto from allocation, non-editable)
    const subjectJpDetails = useMemo(() => {
        return selectedSubjectsObjects.map((subject) => {
            const id = subject.id_subject || subject.id;
            const jp = getSubjectJpFromEffectiveWeeks(
                state.effectiveWeeks,
                id,
                selectedPeriodId
            );

            // Cari kelas-kelas yang terdaftar untuk mapel ini di alokasi
            const matchingAllocs = state.effectiveWeeks.filter(
                (ew) =>
                    ew.id_subject === id &&
                    (!selectedPeriodId ||
                        !ew.id_school_information ||
                        ew.id_school_information === selectedPeriodId)
            );

            const registeredClasses = Array.from(
                new Set(
                    matchingAllocs.map((a) => a.rombel || `Kelas ${a.kelas || "X"}`).filter(Boolean)
                )
            );

            return {
                subject,
                id,
                name: subject.name,
                code: subject.code_subject,
                jp,
                classes: registeredClasses,
            };
        });
    }, [selectedSubjectsObjects, state.effectiveWeeks, selectedPeriodId]);

    const totalJpSelected = useMemo(() => {
        const sum = subjectJpDetails.reduce((acc, curr) => acc + (Number(curr.jp) || 0), 0);
        return Math.round(sum * 10) / 10;
    }, [subjectJpDetails]);

    // Total JP akumulasi guru setelah penugasan ini
    const totalAccumulatedJp = Math.round((teacherCurrentTotalJp + totalJpSelected) * 10) / 10;

    // Sync total JP ke form value jp_amount
    useEffect(() => {
        setValue("jp_amount", totalJpSelected, { shouldValidate: true });
    }, [totalJpSelected, setValue]);

    return (
        <DialogBody>
            <div className="flex flex-col gap-4">
                {serverErrorMessage && (
                    <div className="rounded-lg border-2 border-red-500 bg-red-50 dark:bg-red-950/40 dark:border-red-600 p-3 shadow-sm">
                        <p className="text-red-700 dark:text-red-300 font-bold text-sm mb-1">
                            Gagal Menyimpan Data:
                        </p>
                        <ul className="list-disc list-inside space-y-1">
                            {serverErrorMessage.split("\n").map((msg, i) => (
                                <li
                                    key={i}
                                    className="text-xs sm:text-sm font-medium text-red-700 dark:text-red-200"
                                >
                                    {msg}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* 1. Guru */}
                <Controller
                    name="id_teacher"
                    control={control}
                    render={({ field }) => (
                        <Autocomplete
                            options={state.employees}
                            getOptionLabel={(option) =>
                                `${option.first_name} ${option.last_name || ""} (${
                                    option.niy || "-"
                                })`
                            }
                            value={selectedTeacher}
                            onChange={(_, newValue) => {
                                field.onChange(newValue ? newValue.id : "");
                            }}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Guru"
                                    placeholder="Cari nama atau NIY guru"
                                    size="small"
                                    fullWidth
                                    error={!!errors.id_teacher}
                                    helperText={errors.id_teacher?.message}
                                />
                            )}
                        />
                    )}
                />

                {/* 2. Periode */}
                <Controller
                    name="id_school_information"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            select
                            label="Periode"
                            fullWidth
                            size="small"
                            error={!!errors.id_school_information}
                            helperText={errors.id_school_information?.message}
                            onChange={(event) => {
                                field.onChange(event.target.value);
                            }}
                        >
                            <MenuItem value="" disabled>
                                -- Pilih Periode --
                            </MenuItem>
                            {state.schoolInformations.map((school) => (
                                <MenuItem
                                    key={school.id_school_information}
                                    value={school.id_school_information}
                                >
                                    {school.periode || "Tanpa periode"}
                                    {school.name_school ? ` — ${school.name_school}` : ""}
                                    {school.status ? " (Aktif)" : ""}
                                </MenuItem>
                            ))}
                        </TextField>
                    )}
                />

                {/* 3. Mata Pelajaran (Multi-select: Hanya mapel yang sudah diinput di alokasi) */}
                <Controller
                    name="id_subjects"
                    control={control}
                    render={({ field }) => (
                        <Autocomplete
                            multiple
                            options={availableSubjects}
                            getOptionLabel={(option) =>
                                `${option.name}${
                                    option.code_subject ? ` (${option.code_subject})` : ""
                                }`
                            }
                            value={selectedSubjectsObjects}
                            isOptionEqualToValue={(option, val) =>
                                (option.id_subject || option.id) ===
                                (val.id_subject || val.id)
                            }
                            onChange={(_, newValues) => {
                                if (newValues.length > MAX_SUBJECTS_PER_TEACHER) {
                                    return; // Batasi maksimal 4 mata pelajaran
                                }
                                const ids = newValues.map((v) => v.id_subject || v.id);
                                field.onChange(ids);
                                setValue("id_subject", ids[0] || "");
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Mata Pelajaran (Maksimal 4)"
                                    placeholder={
                                        selectedSubjectsObjects.length < MAX_SUBJECTS_PER_TEACHER
                                            ? "Pilih mata pelajaran yang sudah ada di alokasi..."
                                            : ""
                                    }
                                    size="small"
                                    error={!!errors.id_subject || !!errors.id_subjects}
                                    helperText={
                                        errors.id_subject?.message ||
                                        errors.id_subjects?.message ||
                                        (availableSubjects.length === 0
                                            ? "Belum ada mata pelajaran yang dialokasikan pada periode ini."
                                            : `Maksimal 4 mata pelajaran. Terpilih: ${selectedSubjectsObjects.length}/4 mapel.`)
                                    }
                                />
                            )}
                        />
                    )}
                />

                {/* 4. Detail Alokasi JP & Kelas Terdaftar (Read-Only dari Hasil Alokasi Waktu) */}
                {subjectJpDetails.length > 0 && (
                    <Box
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            border: "1px solid",
                            borderColor: "primary.200",
                            backgroundColor: (theme) =>
                                theme.palette.mode === "dark" ? "grey.900" : "#f0fdf4",
                            display: "flex",
                            flexDirection: "column",
                            gap: 1.5,
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <CalculateOutlinedIcon sx={{ color: "primary.main", fontSize: 20 }} />
                                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "text.primary" }}>
                                    Detail Alokasi JP (Hasil Alokasi Minggu Efektif)
                                </Typography>
                            </Box>
                            <Chip
                                icon={<CheckCircleOutlinedIcon sx={{ fontSize: 14 }} />}
                                label="Otomatis dari Alokasi"
                                size="small"
                                color="success"
                                sx={{ fontSize: "0.68rem", fontWeight: 700, height: 22 }}
                            />
                        </Box>

                        <Divider />

                        {/* List per subject */}
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
                            {subjectJpDetails.map((item) => (
                                <Box
                                    key={item.id}
                                    sx={{
                                        display: "flex",
                                        flexDirection: { xs: "column", sm: "row" },
                                        alignItems: { xs: "flex-start", sm: "center" },
                                        justifyContent: "space-between",
                                        p: 1.25,
                                        borderRadius: 1.5,
                                        backgroundColor: (theme) =>
                                            theme.palette.mode === "dark" ? "grey.800" : "#ffffff",
                                        border: "1px solid #e2e8f0",
                                        gap: 1,
                                    }}
                                >
                                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                                        <MenuBookIcon sx={{ color: "primary.main", fontSize: 20, mt: 0.3 }} />
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 700, fontSize: "0.84rem" }}>
                                                {item.name}
                                            </Typography>
                                            {item.code && (
                                                <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.7rem", mr: 1 }}>
                                                    Kode: {item.code}
                                                </Typography>
                                            )}

                                            {/* Kelas yang terdaftar dari hasil alokasi */}
                                            {item.classes.length > 0 && (
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexWrap: "wrap", mt: 0.5 }}>
                                                    <ClassOutlinedIcon sx={{ fontSize: 13, color: "text.secondary" }} />
                                                    <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.7rem", fontWeight: 600 }}>
                                                        Kelas:
                                                    </Typography>
                                                    {item.classes.map((cls) => (
                                                        <Chip
                                                            key={cls}
                                                            label={cls}
                                                            size="small"
                                                            variant="outlined"
                                                            color="primary"
                                                            sx={{ height: 18, fontSize: "0.65rem", fontWeight: 700 }}
                                                        />
                                                    ))}
                                                </Box>
                                            )}
                                        </Box>
                                    </Box>

                                    {/* Non-editable JP Display */}
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, alignSelf: { xs: "flex-end", sm: "center" } }}>
                                        <Chip
                                            label={`${item.jp} JP / Minggu`}
                                            color="primary"
                                            variant="filled"
                                            size="small"
                                            sx={{ fontWeight: 800, fontSize: "0.78rem", height: 26 }}
                                        />
                                    </Box>
                                </Box>
                            ))}
                        </Box>

                        <Divider />

                        {/* Total Summary */}
                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 1,
                                pt: 0.5,
                            }}
                        >
                            <Box>
                                <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                                    Total JP yang Diambil:
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 800, color: "primary.main", lineHeight: 1.1 }}>
                                    {formatJpLabel(totalJpSelected)}
                                </Typography>
                            </Box>

                            {selectedTeacher && (
                                <Box sx={{ textAlign: "right" }}>
                                    <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                                        Total JP Terakhir Diampu Guru:
                                    </Typography>
                                    <Chip
                                        label={`${teacherCurrentTotalJp} JP + ${totalJpSelected} JP = ${totalAccumulatedJp} JP`}
                                        size="small"
                                        color="primary"
                                        variant="filled"
                                        sx={{ fontWeight: 800, fontSize: "0.74rem" }}
                                    />
                                </Box>
                            )}
                        </Box>
                    </Box>
                )}

                {/* 5. Status */}
                <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            select
                            label="Status"
                            fullWidth
                            size="small"
                            value={field.value ? "true" : "false"}
                            onChange={(event) =>
                                field.onChange(event.target.value === "true")
                            }
                        >
                            <MenuItem value="true">Aktif</MenuItem>
                            <MenuItem value="false">Non Aktif</MenuItem>
                        </TextField>
                    )}
                />
            </div>
        </DialogBody>
    );
};

export default TeachingAssignmentFields;
