import { MenuItem, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import useDashboardSchoolInformationStore from "../store";
import { DialogBody } from "@components/Dialog";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const UpdateSchoolInfoFormDialog = () => {
    const { control, formState: { errors }, setValue, watch, trigger } = useFormContext();
    const { state } = useDashboardSchoolInformationStore();

    const periodeValue = watch("periode") || "";
    const [startYear, endYear] = periodeValue.split("/");

    const handleYearChange = (type: "start" | "end", val: string) => {
        const currentStart = type === "start" ? val : (startYear || "");
        const currentEnd = type === "end" ? val : (endYear || "");

        if (currentStart && currentEnd) {
            setValue("periode", `${currentStart}/${currentEnd}`, { shouldValidate: true });
        } else if (currentStart) {
            setValue("periode", `${currentStart}/`, { shouldValidate: true });
        } else if (currentEnd) {
            setValue("periode", `/${currentEnd}`, { shouldValidate: true });
        } else {
            setValue("periode", "", { shouldValidate: true });
        }
        trigger("periode");
    };

    return (
        <DialogBody>
            <div className="flex flex-col gap-4">
                <Controller
                    name="name_school"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="School Name"
                            fullWidth
                            size="small"
                            error={!!errors.name_school}
                            helperText={errors.name_school?.message as string}
                        />
                    )}
                />

                <div className="flex flex-col gap-1">
                    <div className="grid grid-cols-2 gap-4">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                views={['year']}
                                label="Tahun Mulai"
                                value={startYear ? dayjs(`${startYear}-01-01`) : null}
                                onChange={(date) => handleYearChange("start", date ? date.year().toString() : "")}
                                slotProps={{
                                    textField: {
                                        size: "small",
                                        fullWidth: true,
                                        error: !!errors.periode,
                                    }
                                }}
                            />
                            <DatePicker
                                views={['year']}
                                label="Tahun Selesai"
                                value={endYear ? dayjs(`${endYear}-01-01`) : null}
                                onChange={(date) => handleYearChange("end", date ? date.year().toString() : "")}
                                slotProps={{
                                    textField: {
                                        size: "small",
                                        fullWidth: true,
                                        error: !!errors.periode,
                                    }
                                }}
                            />
                        </LocalizationProvider>
                    </div>

                    {errors.periode && (
                        <span className="text-xs text-red-500 mt-1 ml-1">
                            {errors.periode.message as string}
                        </span>
                    )}
                </div>

                <Controller
                    name="periode"
                    control={control}
                    render={({ field }) => <input type="hidden" {...field} />}
                />

                <Controller
                    name="NPSN"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="NPSN"
                            fullWidth
                            size="small"
                            error={!!errors.NPSN}
                            helperText={errors.NPSN?.message as string}
                        />
                    )}
                />

                <Controller
                    name="id_headmaster"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            value={field.value ?? ""}
                            label="Headmaster (Kepala Sekolah)"
                            select
                            fullWidth
                            size="small"
                            error={!!errors.id_headmaster}
                            helperText={errors.id_headmaster?.message as string}
                        >
                            {state.employees?.map((e: any) => (
                                <MenuItem key={e.id} value={e.id}>
                                    {e.first_name} {e.last_name} ({e.niy})
                                </MenuItem>
                            ))}
                        </TextField>
                    )}
                />

                <Controller
                    name="alamat"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Address (Alamat)"
                            multiline
                            rows={2}
                            fullWidth
                            size="small"
                            error={!!errors.alamat}
                            helperText={errors.alamat?.message as string}
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
                            value={field.value !== undefined ? String(field.value) : "true"}
                            label="Status"
                            select
                            fullWidth
                            size="small"
                            error={!!errors.status}
                            helperText={errors.status?.message as string}
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

export default UpdateSchoolInfoFormDialog;
