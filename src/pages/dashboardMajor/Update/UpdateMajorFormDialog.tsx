import { MenuItem, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { DialogBody } from "@components/Dialog";
import type { UpdateMajorRequestModel } from "@api/major/model";

const UpdateMajorFormDialog = () => {
    const { control, formState: { errors } } = useFormContext<UpdateMajorRequestModel>();

    return (
        <DialogBody>
            <div className="flex flex-col gap-4 py-2">
                <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Nama Jurusan"
                            placeholder="Contoh: Rekayasa Perangkat Lunak"
                            fullWidth
                            size="small"
                            error={!!errors.name}
                            helperText={errors.name?.message}
                        />
                    )}
                />

                <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            value={field.value !== undefined ? String(field.value) : "true"}
                            label="Status"
                            select
                            fullWidth
                            size="small"
                            onChange={(e) => field.onChange(e.target.value === "true")}
                        >
                            <MenuItem value="true">Aktif</MenuItem>
                            <MenuItem value="false">Non Aktif</MenuItem>
                        </TextField>
                    )}
                />

                {errors.root?.serverError && (
                    <p className="text-sm text-red-500">{errors.root.serverError.message}</p>
                )}
            </div>
        </DialogBody>
    );
};

export default UpdateMajorFormDialog;
