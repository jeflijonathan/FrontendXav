/**
 * CreateClassFormDialog — Representation Logic
 *
 * Form fields for creating a new class. All layout and field rendering only.
 * Business logic (auto-name generation, guardian assignment check) is delegated
 * to classNameHelper (Business Logic). Framework logic lives in useCreateClassForm.
 *
 * Layer: Representation Logic (JSX, styling, Controller wiring)
 */
import { MenuItem, TextField, Autocomplete, Chip } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { DialogBody } from "@components/Dialog";
import useDashboardClassStore from "../store";
import type { CreateClassRequestModel } from "@api/class/model";
import { generateClassName } from "../utils/classNameHelper";
import { findGuardianAssignedClass } from "../List/utils/classTableHelper";

const KELAS_OPTIONS = ["10", "11", "12"];

const CreateClassFormDialog = () => {
    const { control, formState: { errors }, setValue, watch } = useFormContext<CreateClassRequestModel>();
    // Server error is stored under root.serverError by useCreateClass hook
    const serverErrorMessage = (errors.root as { serverError?: { message?: string } } | undefined)
        ?.serverError?.message;

    const { state } = useDashboardClassStore();

    const selectedPeriodId = watch("id_school_information") || state.filters.id_school_information;
    const activePeriod =
        state.schoolInformations.find((s) => s.id_school_information === selectedPeriodId) ||
        state.schoolInformations.find((s) => s.status) ||
        state.schoolInformations[0];

    const currentKelas = watch("kelas");
    const currentMajorId = watch("id_major");
    const majorObj = state.majors.find((m) => m.id_major === currentMajorId);

    // Auto-generated class name (business logic via util)
    const autoName = majorObj
        ? generateClassName(currentKelas || "10", majorObj.name, state.data, majorObj.id_major)
        : currentKelas || "10";

    // Update name field when kelas or major changes
    const updateAutoName = (kelas: string, majorId: string) => {
        const major = state.majors.find((m) => m.id_major === majorId);
        if (major) {
            setValue("name", generateClassName(kelas, major.name, state.data, major.id_major));
        }
    };

    return (
        <DialogBody>
            <div className="flex flex-col gap-4">
                {/* Server Error Banner */}
                {serverErrorMessage && (
                    <div className="rounded-lg border-2 border-red-500 bg-red-50 dark:bg-red-950/40 dark:border-red-600 p-3 shadow-sm">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-red-700 dark:text-red-300 font-bold text-sm">
                                Gagal Menyimpan Data:
                            </span>
                        </div>
                        <ul className="list-disc list-inside space-y-1">
                            {serverErrorMessage.split("\n").map((msg, i) => (
                                <li key={i} className="text-xs sm:text-sm font-medium text-red-700 dark:text-red-200">
                                    {msg}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Periode Info Banner */}
                <div className="flex items-center justify-between p-3 rounded-lg border border-blue-200 bg-blue-50/70 dark:bg-blue-950/20 dark:border-blue-900">
                    <div>
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                            Periode Sekolah
                        </p>
                        <p className="text-sm font-semibold text-primary-txt">
                            {activePeriod?.periode
                                ? `Tahun Ajaran ${activePeriod.periode}`
                                : "Periode Default"}
                        </p>
                    </div>
                    <Chip label="Auto" color="info" size="small" variant="outlined" />
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 bg-gray-50/70 dark:bg-gray-900/20 dark:border-gray-700">
                    <div className="flex-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            Nama Kelas
                        </p>
                        <p className="text-base font-bold text-primary-txt">{autoName}</p>
                    </div>
                    <Chip label="Auto" color="info" size="small" variant="outlined" />
                </div>

                {/* Tingkat Kelas */}
                <Controller
                    name="kelas"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            select
                            label="Tingkat Kelas"
                            fullWidth
                            size="small"
                            error={!!errors.kelas}
                            helperText={errors.kelas?.message}
                            onChange={(e) => {
                                field.onChange(e);
                                updateAutoName(e.target.value, currentMajorId);
                            }}
                        >
                            {KELAS_OPTIONS.map((opt) => (
                                <MenuItem key={opt} value={opt}>
                                    {opt}
                                </MenuItem>
                            ))}
                        </TextField>
                    )}
                />

                {/* Jurusan */}
                <Controller
                    name="id_major"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            select
                            label="Jurusan"
                            fullWidth
                            size="small"
                            error={!!errors.id_major}
                            helperText={errors.id_major?.message}
                            onChange={(e) => {
                                field.onChange(e);
                                updateAutoName(currentKelas || "10", e.target.value);
                            }}
                        >
                            <MenuItem value="" disabled>
                                -- Pilih Jurusan --
                            </MenuItem>
                            {state.majors.map((m) => (
                                <MenuItem key={m.id_major} value={m.id_major}>
                                    {m.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    )}
                />



                {/* Wali Kelas */}
                <Controller
                    name="id_class_guardian"
                    control={control}
                    render={({ field }) => {
                        const selectedEmp = state.employees.find((e) => e.id === field.value) || null;
                        return (
                            <Autocomplete
                                options={state.employees}
                                getOptionLabel={(option) =>
                                    `${option.first_name} ${option.last_name || ""} (${option.niy || "-"})`
                                }
                                value={selectedEmp}
                                onChange={(_, newVal) => {
                                    field.onChange(newVal ? newVal.id : null);
                                }}
                                isOptionEqualToValue={(option, val) => option.id === val.id}
                                renderOption={(props, option) => {
                                    // Business logic: check if employee already assigned as guardian
                                    const assignedClassName = findGuardianAssignedClass(
                                        option.id,
                                        state.data,
                                        selectedPeriodId
                                    );
                                    return (
                                        <li {...props} key={option.id}>
                                            <div className="flex items-center justify-between w-full py-0.5">
                                                <span>
                                                    {option.first_name} {option.last_name || ""} ({option.niy || "-"})
                                                </span>
                                                {assignedClassName && (
                                                    <Chip
                                                        size="small"
                                                        color="warning"
                                                        variant="outlined"
                                                        label={`Wali ${assignedClassName}`}
                                                        sx={{ fontSize: "0.7rem", height: 20 }}
                                                    />
                                                )}
                                            </div>
                                        </li>
                                    );
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Wali Kelas"
                                        placeholder="Pilih atau cari nama guru/karyawan"
                                        size="small"
                                        fullWidth
                                        error={!!errors.id_class_guardian}
                                        helperText={
                                            errors.id_class_guardian?.message || "Opsional - dapat diisi nanti"
                                        }
                                    />
                                )}
                            />
                        );
                    }}
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
                            <MenuItem value="true">Aktif</MenuItem>
                            <MenuItem value="false">Non Aktif</MenuItem>
                        </TextField>
                    )}
                />
            </div>
        </DialogBody>
    );
};

export default CreateClassFormDialog;
