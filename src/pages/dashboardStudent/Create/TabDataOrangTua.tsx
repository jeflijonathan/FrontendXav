import {
    MenuItem,
    TextField,
    Box,
    Typography,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import PhoneNumberInput from "@components/Input/PhoneNumberInput";

const INCOME_OPTIONS = [
    "Rp 0",
    "< Rp 1.000.000",
    "Rp 1.000.000 - Rp 3.000.000",
    "Rp 3.000.000 - Rp 5.000.000",
    "Rp 5.000.000 - Rp 10.000.000",
    "> Rp 10.000.000",
];

const TabDataOrangTua = () => {
    const {
        control,
        formState: { errors },
    } = useFormContext();

    return (
        <div className="flex flex-col gap-5">
            <Box sx={{ p: 2, borderRadius: 2, bgcolor: "background.default", border: 1, borderColor: "divider" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }} color="primary" gutterBottom>
                    Data Ayah
                </Typography>
                <div className="grid grid-cols-2 gap-4 mt-2">
                    <Controller
                        name="parent_name"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Nama Lengkap Ayah / Wali"
                                fullWidth
                                size="small"
                            />
                        )}
                    />
                    <Controller
                        name="parent_nik"
                        control={control}
                        render={({ field }) => (
                            <TextField {...field} label="NIK Ayah / Wali" fullWidth size="small" />
                        )}
                    />
                    <Controller
                        name="parent_phone_number"
                        control={control}
                        render={({ field }) => (
                            <PhoneNumberInput
                                value={field.value ?? ""}
                                onChange={field.onChange}
                                label="No. Telepon / WhatsApp Ayah"
                                fullWidth
                                size="small"
                            />
                        )}
                    />
                    <Controller
                        name="parent_email"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Email Ayah / Wali"
                                type="email"
                                fullWidth
                                size="small"
                                error={!!errors.parent_email}
                                helperText={errors.parent_email?.message as string}
                            />
                        )}
                    />
                    <Controller
                        name="parent_occupation"
                        control={control}
                        render={({ field }) => (
                            <TextField {...field} label="Pekerjaan" fullWidth size="small" />
                        )}
                    />
                    <Controller
                        name="parent_income"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Penghasilan"
                                select
                                fullWidth
                                size="small"
                            >
                                <MenuItem value="">Pilih Penghasilan</MenuItem>
                                {INCOME_OPTIONS.map((inc) => (
                                    <MenuItem key={inc} value={inc}>
                                        {inc}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />
                </div>
            </Box>

            <Box sx={{ p: 2, borderRadius: 2, bgcolor: "background.default", border: 1, borderColor: "divider" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }} color="secondary" gutterBottom>
                    Data Ibu
                </Typography>
                <div className="grid grid-cols-2 gap-4 mt-2">
                    <Controller
                        name="mother_name"
                        control={control}
                        render={({ field }) => (
                            <TextField {...field} label="Nama Lengkap Ibu" fullWidth size="small" />
                        )}
                    />
                    <Controller
                        name="mother_nik"
                        control={control}
                        render={({ field }) => (
                            <TextField {...field} label="NIK Ibu" fullWidth size="small" />
                        )}
                    />
                    <Controller
                        name="mother_phone_number"
                        control={control}
                        render={({ field }) => (
                            <PhoneNumberInput
                                value={field.value ?? ""}
                                onChange={field.onChange}
                                label="No. Telepon / WhatsApp Ibu"
                                fullWidth
                                size="small"
                            />
                        )}
                    />
                    <Controller
                        name="mother_email"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Email Ibu"
                                type="email"
                                fullWidth
                                size="small"
                                error={!!errors.mother_email}
                                helperText={errors.mother_email?.message as string}
                            />
                        )}
                    />
                    <Controller
                        name="mother_occupation"
                        control={control}
                        render={({ field }) => (
                            <TextField {...field} label="Pekerjaan Ibu" fullWidth size="small" />
                        )}
                    />
                    <Controller
                        name="mother_income"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Penghasilan Ibu"
                                select
                                fullWidth
                                size="small"
                            >
                                <MenuItem value="">Pilih Penghasilan</MenuItem>
                                {INCOME_OPTIONS.map((inc) => (
                                    <MenuItem key={inc} value={inc}>
                                        {inc}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />
                </div>
            </Box>
        </div>
    );
};

export default TabDataOrangTua;

