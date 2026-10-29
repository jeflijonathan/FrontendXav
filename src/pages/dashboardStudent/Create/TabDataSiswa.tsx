import { useEffect } from "react";
import {
    MenuItem,
    TextField,
    Autocomplete,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import PhoneNumberInput from "@components/Input/PhoneNumberInput";
import UploadFileDropzone from "@components/Input/UploadFile";
import RoleSelect from "@components/Input/Select";
import { INDONESIAN_CITIES } from "@common/constants/indonesianCities";
import type { RoleStudentModel } from "@api/student/model";
import useDashboardStudentStore from "../store";
import useCreateStudent from "./hook/useCreateStudent";

const TabDataSiswa = () => {
    const {
        control,
        formState: { errors },
        setValue,
        watch,
    } = useFormContext();
    const { state, setState } = useDashboardStudentStore();
    const { FetchUserRole } = useCreateStudent();

    useEffect(() => {
        FetchUserRole();
    }, []);

    // Auto-select "Siswa" role when roles are loaded and no role is selected yet
    const currentRoleIds = watch("role_ids");
    useEffect(() => {
        if (state.roleStudent.length > 0 && (!currentRoleIds || currentRoleIds.length === 0)) {
            const siswaRole = state.roleStudent.find((r) => r.name === "siswa");
            if (siswaRole) {
                setValue("role_ids", [siswaRole.id]);
            }
        }
    }, [state.roleStudent]);

    const roleOptions: RoleStudentModel[] = (state.roleStudent || []).filter(
        (r) => r.name === "siswa" || r.name === "pengurus_kelas"
    );

    return (
        <div className="flex flex-col gap-4">
            {/* Foto Profil Siswa */}
            <Controller
                name="profile_url"
                control={control}
                render={() => (
                    <UploadFileDropzone
                        value={state.profileFile}
                        onFileChange={(file) => setState((prev) => ({ ...prev, profileFile: file }))}
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
                            label="NISN * (10 digit)"
                            fullWidth
                            size="small"
                            error={!!errors.nisn}
                            helperText={errors.nisn?.message as string || "NISN harus tepat 10 digit angka"}
                            slotProps={{
                                htmlInput: {
                                    maxLength: 10,
                                    inputMode: "numeric",
                                    pattern: "[0-9]*",
                                },
                            }}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                                field.onChange(val);
                            }}
                        />
                    )}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Email Siswa *"
                            type="email"
                            fullWidth
                            size="small"
                            error={!!errors.email}
                            helperText={errors.email?.message as string || "Email wajib diisi"}
                        />
                    )}
                />
                <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Password Akun Siswa *"
                            type="password"
                            fullWidth
                            size="small"
                            error={!!errors.password}
                            helperText={errors.password?.message as string}
                        />
                    )}
                />
            </div>

            {/* Reusable Role Select */}
            <Controller
                name="role_ids"
                control={control}
                render={({ field }) => (
                    <RoleSelect
                        options={roleOptions}
                        value={field.value || []}
                        onChange={field.onChange}
                        label="Peran Siswa (Role) *"
                        placeholder="Pilih role siswa..."
                        error={!!errors.role_ids}
                        helperText={
                            (errors.role_ids?.message as string) ||
                            "Role 'Siswa' wajib dipilih. Bisa menambahkan 'Pengurus Kelas'."
                        }
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
                            error={!!errors.gender}
                            helperText={errors.gender?.message as string}
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
                        <Autocomplete
                            options={INDONESIAN_CITIES}
                            value={field.value || null}
                            onChange={(_, newValue) => field.onChange(newValue || "")}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Tempat Lahir"
                                    fullWidth
                                    size="small"
                                    placeholder="Ketik untuk mencari kota/kabupaten..."
                                />
                            )}
                            freeSolo={false}
                            autoHighlight
                            openOnFocus
                        />
                    )}
                />
                <Controller
                    name="birth_date"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
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
                    <TextField {...field} label="Alamat Domisili" multiline rows={2} fullWidth size="small" />
                )}
            />

            <div className="grid grid-cols-3 gap-4">
                <Controller
                    name="rt"
                    control={control}
                    render={({ field }) => (
                        <TextField {...field} label="RT" fullWidth size="small" />
                    )}
                />
                <Controller
                    name="rw"
                    control={control}
                    render={({ field }) => (
                        <TextField {...field} label="RW" fullWidth size="small" />
                    )}
                />
                <Controller
                    name="zip_code"
                    control={control}
                    render={({ field }) => (
                        <TextField {...field} label="Kode Pos" fullWidth size="small" />
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
    );
};

export default TabDataSiswa;
