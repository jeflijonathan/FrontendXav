import { TextField, MenuItem, Chip } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { DialogBody } from "@components/Dialog";
import useDashboardSubjectStore from "../store";
import { calculateFase, getFaseChipConfig, normalizeGrade } from "../List/utils/subjectHelper";
import type { UpdateSubjectRequestModel } from "@api/subject/model";
import UpdateSubjectSkeleton from "./UpdateSubjectSkeleton";

const KELAS_OPTIONS = [
    { label: "Grade 10 (Fase E)", value: "10" },
    { label: "Grade 11 (Fase F)", value: "11" },
    { label: "Grade 12 (Fase F)", value: "12" },
];

const UpdateSubjectFormDialog = () => {
    const {
        control,
        formState: { errors },
        watch,
        setValue,
    } = useFormContext<UpdateSubjectRequestModel>();
    const { state } = useDashboardSubjectStore();

    if (state.isDetailLoading) {
        return <UpdateSubjectSkeleton />;
    }

    const rawKelasValue = watch("kelas");
    const selectedKelas = normalizeGrade(rawKelasValue) || "10";
    const derivedFase = calculateFase(selectedKelas);
    const faseChip = getFaseChipConfig(derivedFase, selectedKelas);

    const serverErrorMessage = (
        errors.root as { serverError?: { message?: string } } | undefined
    )?.serverError?.message;

    return (
        <DialogBody>
            <div className="flex flex-col gap-4 py-1">
                {serverErrorMessage && (
                    <div className="rounded-lg border-2 border-red-500 bg-red-50 dark:bg-red-950/40 dark:border-red-600 p-3 shadow-sm">
                        <span className="text-red-700 dark:text-red-300 font-bold text-sm block mb-1">
                            Failed to Save:
                        </span>
                        <p className="text-xs sm:text-sm font-medium text-red-700 dark:text-red-200">
                            {serverErrorMessage}
                        </p>
                    </div>
                )}

                {/* Subject Name */}
                <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Subject Name"
                            fullWidth
                            size="small"
                            error={!!errors.name}
                            helperText={errors.name?.message}
                        />
                    )}
                />

                {/* Row: Grade (10, 11, 12) & Phase Auto-Preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    <Controller
                        name="kelas"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                select
                                label="Grade"
                                fullWidth
                                size="small"
                                value={normalizeGrade(field.value) || "10"}
                                error={!!errors.kelas}
                                helperText={errors.kelas?.message}
                                onChange={(e) => {
                                    field.onChange(e.target.value);
                                    const nextFase = calculateFase(e.target.value);
                                    setValue("fase", nextFase);
                                }}
                            >
                                {KELAS_OPTIONS.map((opt) => (
                                    <MenuItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />

                    {/* Phase Preview (Automatic: E for Grade 10, F for Grade 11-12) */}
                    <div className="flex items-center justify-between p-2.5 rounded-lg border border-gray-200 bg-gray-50/80 dark:bg-gray-800/40 dark:border-gray-700">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                Curriculum Phase (Auto)
                            </p>
                            <p className="text-sm font-bold text-primary-txt">
                                {faseChip.label}
                            </p>
                        </div>
                        <Chip
                            label={faseChip.label}
                            color={faseChip.color}
                            size="small"
                            sx={{ fontWeight: 600 }}
                        />
                    </div>
                </div>

                {/* Category */}
                <Controller
                    name="id_category_subject"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            select
                            label="Category"
                            fullWidth
                            size="small"
                            error={!!errors.id_category_subject}
                            helperText={errors.id_category_subject?.message}
                        >
                            <MenuItem value="">
                                <em>Select Category</em>
                            </MenuItem>
                            {state.categories.map((c) => {
                                const cId = c.id || c.id_category_subject || "";
                                return (
                                    <MenuItem key={cId} value={cId}>
                                        {c.name}
                                    </MenuItem>
                                );
                            })}
                        </TextField>
                    )}
                />

                {/* Status */}
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
                            onChange={(e) => field.onChange(e.target.value === "true")}
                        >
                            <MenuItem value="true">Active</MenuItem>
                            <MenuItem value="false">Inactive</MenuItem>
                        </TextField>
                    )}
                />
            </div>
        </DialogBody>
    );
};

export default UpdateSubjectFormDialog;
