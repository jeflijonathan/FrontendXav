/**
 * UpdateCategorySubjectFormDialog — Representation Logic
 *
 * Form fields for editing a Category Subject.
 *
 * Layer: Representation Logic
 */
import { TextField, MenuItem } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { DialogBody } from "@components/Dialog";
import useDashboardCategorySubjectStore from "../store";
import type { UpdateCategorySubjectRequestModel } from "@api/categorysubject/model";
import UpdateCategorySubjectSkeleton from "./UpdateCategorySubjectSkeleton";

const UpdateCategorySubjectFormDialog = () => {
    const {
        control,
        formState: { errors },
    } = useFormContext<UpdateCategorySubjectRequestModel>();
    const { state } = useDashboardCategorySubjectStore();

    if (state.isDetailLoading) {
        return <UpdateCategorySubjectSkeleton />;
    }

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

                {/* Nama Kategori */}
                <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Nama Kategori Mata Pelajaran"
                            fullWidth
                            size="small"
                            error={!!errors.name}
                            helperText={errors.name?.message}
                        />
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

export default UpdateCategorySubjectFormDialog;
