import React, { useState, useEffect } from "react";
import {
    MenuItem,
    TextField,
    Tabs,
    Tab,
    Box,
    Typography,
    Badge,
    Autocomplete,
} from "@mui/material";
import { Person, People } from "@mui/icons-material";
import { Controller, useFormContext } from "react-hook-form";
import { DialogBody } from "@components/Dialog";
import useDashboardStudentStore from "../store";
import useUpdateStudent from "./hook/useUpdateStudent";
import PhoneNumberInput from "@components/Input/PhoneNumberInput";
import RoleSelect from "@components/Input/Select";
import UploadFileDropzone from "@components/Input/UploadFile";

const INCOME_OPTIONS = [
    "< Rp 1.000.000",
    "Rp 1.000.000 - Rp 3.000.000",
    "Rp 3.000.000 - Rp 5.000.000",
    "Rp 5.000.000 - Rp 10.000.000",
    "> Rp 10.000.000",
];

const UpdateStudentFormDialog = () => {
    const [currentTab, setCurrentTab] = useState(0);
    const {
        control,
        formState: { errors },
    } = useFormContext();
    const { state, setState } = useDashboardStudentStore();
    const { FetchUserRole } = useUpdateStudent();

    useEffect(() => {
        FetchUserRole();
    }, []);

    const studentErrorCount = [
        errors.first_name,
        errors.last_name,
        errors.nis,
        errors.nisn,
        errors.password,
        errors.gender,
        errors.phone_number,
    ].filter(Boolean).length;

    const parentErrorCount = [
        errors.parent_email,
        errors.mother_email,
    ].filter(Boolean).length;

    const roleOptions = (state.roleStudent || []).filter(
        (r) => r.name === "siswa" || r.name === "pengurus_kelas"
    );

    return (
        <DialogBody>
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
                <Tabs
                    value={currentTab}
                    onChange={(_, val) => setCurrentTab(val)}
                    textColor="primary"
                    indicatorColor="primary"
                >
                    <Tab
                        icon={<Badge color="error" badgeContent={studentErrorCount}><Person /></Badge>}
                        iconPosition="start"
                        label="Data Siswa"
                        sx={{ textTransform: "none", fontWeight: 600 }}
                    />
                    <Tab
                        icon={<Badge color="error" badgeContent={parentErrorCount}><People /></Badge>}
                        iconPosition="start"
                        label="Data Orang Tua"
                        sx={{ textTransform: "none", fontWeight: 600 }}
                    />
                </Tabs>
            </Box>

            {/* TAB 0: DATA SISWA */}
            {currentTab === 0 && (
                <div className="flex flex-col gap-4">
                    {/* Foto Profil Siswa */}
                    <Controller
                        name="profile_url"
                        control={control}
                        render={({ field }) => (
                            <UploadFileDropzone
                                value={state.profileFile}
                                onFileChange={(file) => {
                                    setState((prev) => ({ ...prev, profileFile: file }));
                                    if (!file) {
                                        field.onChange("");
                                    }
                                }}
                                initialUrl={field.value}
                                label="Foto Profil Siswa"
                            />
                        )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Controller
                            name="first_name"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    value={field.value ?? ""}
                                    label="Nama Depan *"
                                    fullWidth
                                    size="small"
                                    error={!!errors.first_name}
                                    helperText={errors.first_name?.message as string}
                                />
                            )}
                        />
                        <Controller
                            name="last_name"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    value={field.value ?? ""}
                                    label="Nama Belakang *"
                                    fullWidth
                                    size="small"
                                    error={!!errors.last_name}
                                    helperText={errors.last_name?.message as string}
                                />
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Controller
                            name="nis"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    value={field.value ?? ""}
                                    label="NIS *"
                                    fullWidth
                                    size="small"
                                    error={!!errors.nis}
                                    helperText={errors.nis?.message as string}
                                />
                            )}
                        />
                        <Controller
                            name="nisn"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    value={field.value ?? ""}
                                    label="NISN *"
                                    fullWidth
                                    size="small"
                                    error={!!errors.nisn}
                                    helperText={errors.nisn?.message as string}
                                />
                            )}
                        />
                    </div>

                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                value={field.value ?? ""}
                                label="Password Baru (Kosongkan jika tidak ingin mengubah)"
                                type="password"
                                fullWidth
                                size="small"
                                error={!!errors.password}
                                helperText={errors.password?.message as string}
                            />
                        )}
                    />

                    {/* Role Multi-Select (siswa / pengurus_kelas) */}
                    <Controller
                        name="role_ids"
                        control={control}
                        render={({ field }) => (
                            <RoleSelect
                                options={roleOptions}
                                value={field.value || []}
                                onChange={field.onChange}
                                label="Peran Siswa (Role)"
                                placeholder="Pilih role siswa (bisa 1 atau 2 role)..."
                                helperText="Pilihan peran: Siswa, Pengurus Kelas (Bisa memilih keduanya)"
                                requiredRoleName="siswa"
                            />
                        )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Controller
                            name="gender"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    value={field.value ?? "L"}
                                    label="Jenis Kelamin *"
                                    select
                                    fullWidth
                                    size="small"
                                >
                                    <MenuItem value="L">Laki-laki</MenuItem>
                                    <MenuItem value="P">Perempuan</MenuItem>
                                </TextField>
                            )}
                        />
                        <Controller
                            name="phone_number"
                            control={control}
                            render={({ field }) => (
                                <PhoneNumberInput
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                    label="Nomor Telepon Siswa"
                                    fullWidth
                                    size="small"
                                    error={!!errors.phone_number}
                                    helperText={errors.phone_number?.message as string}
                                />
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Controller
                            name="birth_place"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    value={field.value ?? ""}
                                    label="Tempat Lahir"
                                    fullWidth
                                    size="small"
                                />
                            )}
                        />
                        <Controller
                            name="birth_date"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    value={field.value ?? ""}
                                    label="Tanggal Lahir"
                                    type="date"
                                    fullWidth
                                    size="small"
                                    slotProps={{ inputLabel: { shrink: true } }}
                                />
                            )}
                        />
                    </div>

                    <Controller
                        name="address"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                value={field.value ?? ""}
                                label="Alamat Domisili"
                                multiline
                                rows={2}
                                fullWidth
                                size="small"
                            />
                        )}
                    />

                    <div className="grid grid-cols-3 gap-4">
                        <Controller
                            name="rt"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} value={field.value ?? ""} label="RT" fullWidth size="small" />
                            )}
                        />
                        <Controller
                            name="rw"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} value={field.value ?? ""} label="RW" fullWidth size="small" />
                            )}
                        />
                        <Controller
                            name="zip_code"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} value={field.value ?? ""} label="Kode Pos" fullWidth size="small" />
                            )}
                        />
                    </div>

                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                value={field.value !== undefined ? String(field.value) : "true"}
                                label="Status Siswa"
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
                </div>
            )}

            {/* TAB 1: DATA ORANG TUA */}
            {currentTab === 1 && (
                <div className="flex flex-col gap-5">
                    {/* Data Ayah / Wali */}
                    <Box sx={{ p: 2, borderRadius: 2, bgcolor: "background.default", border: 1, borderColor: "divider" }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }} color="primary" gutterBottom>
                            Data Ayah / Wali
                        </Typography>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                            <Controller
                                name="parent_name"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        value={field.value ?? ""}
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
                                    <TextField
                                        {...field}
                                        value={field.value ?? ""}
                                        label="NIK Ayah / Wali"
                                        fullWidth
                                        size="small"
                                    />
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
                                        value={field.value ?? ""}
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
                                    <TextField
                                        {...field}
                                        value={field.value ?? ""}
                                        label="Pekerjaan"
                                        fullWidth
                                        size="small"
                                    />
                                )}
                            />
                            <Controller
                                name="parent_income"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        value={field.value ?? ""}
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

                    {/* Data Ibu */}
                    <Box sx={{ p: 2, borderRadius: 2, bgcolor: "background.default", border: 1, borderColor: "divider" }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }} color="secondary" gutterBottom>
                            Data Ibu (Opsional)
                        </Typography>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                            <Controller
                                name="mother_name"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        value={field.value ?? ""}
                                        label="Nama Lengkap Ibu"
                                        fullWidth
                                        size="small"
                                    />
                                )}
                            />
                            <Controller
                                name="mother_nik"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        value={field.value ?? ""}
                                        label="NIK Ibu"
                                        fullWidth
                                        size="small"
                                    />
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
                                        value={field.value ?? ""}
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
                                    <TextField
                                        {...field}
                                        value={field.value ?? ""}
                                        label="Pekerjaan Ibu"
                                        fullWidth
                                        size="small"
                                    />
                                )}
                            />
                            <Controller
                                name="mother_income"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        value={field.value ?? ""}
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
            )}
        </DialogBody>
    );
};

export default UpdateStudentFormDialog;
