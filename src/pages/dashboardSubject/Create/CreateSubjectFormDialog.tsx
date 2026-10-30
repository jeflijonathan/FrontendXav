/**
 * CreateSubjectFormDialog — Representation Logic
 *
 * Form fields for creating a Subject.
 *
 * Layer: Representation Logic
 */
import { TextField, MenuItem } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { DialogBody } from "@components/Dialog";
import useDashboardSubjectStore from "../store";
import type { CreateSubjectRequestModel } from "@api/subject/model";

const CreateSubjectFormDialog = () => {
    const {
        control,
        formState: { errors },
    } = useFormContext<CreateSubjectRequestModel>();
    const { state } = useDashboardSubjectStore();

    const serverErrorMessage = (
        errors.root as { serverError?: { message?: string } } | undefined
    )?.serverError?.message;

    return (
        <DialogBody>
            <div className="flex flex-col gap-4 py-1">
                {serverErrorMessage && (
                    <div className="rounded-lg border-2 border-red-500 bg-red-50 dark:bg-red-950/40 dark:border-red-600 p-3 shadow-sm">
                        <span className="text-red-700 dark:text-red-300 font-bold text-sm block mb-1">
                            Gagal Menyimpan Data:
                        </span>
                        <p className="text-xs sm:text-sm font-medium text-red-700 dark:text-red-200">
                            {serverErrorMessage}
                        </p>
                    </div>
                )}

                {/* Nama Mata Pelajaran */}
                <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Nama Mata Pelajaran"
                            placeholder="Contoh: Matematika, Bahasa Indonesia"
                            fullWidth
                            size="small"
                            error={!!errors.name}
                            helperText={errors.name?.message}
                        />
                    )}
                />

                {/* Kategori Mata Pelajaran (FK: id_category_subject) */}
                <Controller
                    name="id_category_subject"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            select
                            label="Kategori Mata Pelajaran (FK)"
                            fullWidth
                            size="small"
                            error={!!errors.id_category_subject}
                            helperText={
                                errors.id_category_subject?.message ||
                                "Pilih kategori mata pelajaran yang sesuai"
                            }
                        >
                            <MenuItem value="" disabled>
                                -- Pilih Kategori --
                            </MenuItem>
                            {state.categories.map((c) => {
                                const catId = c.id || c.id_category_subject || "";
                                return (
                                    <MenuItem key={catId} value={catId}>
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
                            <MenuItem value="true">Aktif</MenuItem>
                            <MenuItem value="false">Non Aktif</MenuItem>
                        </TextField>
                    )}
                />
            </div>
        </DialogBody>
    );
};

export default CreateSubjectFormDialog;

