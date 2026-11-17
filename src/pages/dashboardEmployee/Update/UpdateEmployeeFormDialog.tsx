import { useEffect, useState } from "react";
import { MenuItem, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { DialogBody } from "@components/Dialog";
import useDashboardEmployeeStore from "../store";
import UploadFileDropzone from "@components/Input/UploadFile";
import RoleService from "@api/role/service";
import type { UpdateEmployeeRequestModel } from "@api/employee/model";
import PhoneNumberInput from "@components/Input/PhoneNumberInput";
import RoleSelect from "@components/Input/Select";
import AcademicTitleSelect from "../components/AcademicTitleSelect";
import { useAcademicTitles } from "../hook/useAcademicTitles";

const UpdateEmployeeFormDialog = () => {
    const { control, formState: { errors }, watch } = useFormContext<UpdateEmployeeRequestModel>();
    const serverErrors = (errors as any)?.root?.serverError?.message as string | undefined;
    const { state, setState } = useDashboardEmployeeStore();
    const [search] = useState<string>("");
    const { titlesDepanOptions, titlesBelakangOptions, getTitleDescription } = useAcademicTitles();

    const firstName = watch("first_name") || "";
    const lastName = watch("last_name") || "";
    const titlesDepan = watch("titles_depan") || [];
    const titlesBelakang = watch("titles_belakang") || [];

    // Hitung pratinjau nama lengkap bergelar secara realtime
    const baseName = [firstName, lastName].filter(Boolean).join(" ").trim();
    const depanStr = titlesDepan.length > 0 ? `${titlesDepan.join(" ")} ` : "";
    const belakangStr = titlesBelakang.length > 0 ? `, ${titlesBelakang.join(", ")}` : "";
    const formattedPreview = baseName ? `${depanStr}${baseName}${belakangStr}`.trim() : "";

    useEffect(() => {
        new RoleService().getAll(
            {
                onSuccess: (data) => setState(prev => ({ ...prev, roleUser: data })),
                onError: (err) => console.error(err),
            },
            { params: { search } }
        );
    }, [search]);


    return (
        <DialogBody>
            <div className="flex flex-col gap-4">
                {/* Server Error Banner */}
                {serverErrors && (
                    <div className="rounded-md border border-red-300 bg-red-50 p-3">
                        <p className="text-sm font-semibold text-red-700 mb-1">Gagal menyimpan data:</p>
                        <ul className="list-disc list-inside space-y-0.5">
                            {serverErrors.split("\n").map((msg, i) => (
                                <li key={i} className="text-sm text-red-600">{msg}</li>
                            ))}
                        </ul>
                    </div>
                )}
                {/* Name */}
                <div className="grid grid-cols-2 gap-4">
                    <Controller name="first_name" control={control} render={({ field }) => (
                        <TextField {...field} value={field.value ?? ""} label="First Name" fullWidth size="small" error={!!errors.first_name} helperText={errors.first_name?.message as string} />
                    )} />
                    <Controller name="last_name" control={control} render={({ field }) => (
                        <TextField {...field} value={field.value ?? ""} label="Last Name" fullWidth size="small" error={!!errors.last_name} helperText={errors.last_name?.message as string} />
                    )} />
                </div>

                {/* Gelar Depan & Gelar Belakang Multi-Select */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Controller
                        name="titles_depan"
                        control={control}
                        render={({ field }) => (
                            <AcademicTitleSelect
                                label="Gelar / Jabatan Depan"
                                placeholder="Pilih gelar depan (Drs., Dr., Prof., Ir., H., dll)"
                                options={titlesDepanOptions}
                                value={field.value || []}
                                onChange={field.onChange}
                                type="depan"
                                getDescription={getTitleDescription}
                                helperText="Pilih satu atau lebih gelar depan"
                            />
                        )}
                    />
                    <Controller
                        name="titles_belakang"
                        control={control}
                        render={({ field }) => (
                            <AcademicTitleSelect
                                label="Gelar / Jabatan Belakang"
                                placeholder="Pilih gelar belakang (S.Pd., S.Kom., M.M., Gr., dll)"
                                options={titlesBelakangOptions}
                                value={field.value || []}
                                onChange={field.onChange}
                                type="belakang"
                                getDescription={getTitleDescription}
                                helperText="Pilih satu atau lebih gelar belakang"
                            />
                        )}
                    />
                </div>

                {/* Pratinjau Nama Lengkap Bergelar */}
                <div className="rounded-lg border border-indigo-200 bg-indigo-50/70 p-3">
                    <div className="text-xs font-semibold text-indigo-700 uppercase tracking-wide mb-0.5">
                        Pratinjau Format Nama Lengkap:
                    </div>
                    <div className="text-sm sm:text-base font-bold text-slate-900">
                        {formattedPreview || <span className="font-normal italic text-slate-400">(Ketik nama depan & pilih gelar untuk melihat pratinjau)</span>}
                    </div>
                </div>
                {/* NIY & Username */}
                <div className="grid grid-cols-2 gap-4">
                    <Controller name="niy" control={control} render={({ field }) => (
                        <TextField {...field} value={field.value ?? ""} label="NIY" fullWidth size="small" error={!!errors.niy} helperText={errors.niy?.message as string} />
                    )} />
                    <Controller name="username" control={control} render={({ field }) => (
                        <TextField {...field} value={field.value ?? ""} label="Username" fullWidth size="small" error={!!errors.username} helperText={errors.username?.message as string} />
                    )} />
                </div>
                {/* Email */}
                <Controller name="email" control={control} render={({ field }) => (
                    <TextField {...field} value={field.value ?? ""} label="Email" type="email" fullWidth size="small" error={!!errors.email} helperText={errors.email?.message as string} />
                )} />
                {/* Password */}
                <Controller name="password" control={control} render={({ field }) => (
                    <TextField {...field} value={field.value ?? ""} label="Password Baru (Kosongkan jika tidak diubah)" type="password" fullWidth size="small" />
                )} />
                {/* Profile URL */}
                <Controller name="profile_url" control={control} render={({ field }) => (
                    <div className="w-full">
                        <UploadFileDropzone
                            value={state.profileFile}
                            onFileChange={(file) => setState(prev => ({ ...prev, profileFile: file }))}
                            label="Profile Image"
                            initialUrl={field.value}
                        />
                    </div>
                )} />
                {/* Phone Number */}
                <Controller name="detail.phone_number" control={control} render={({ field }) => (
                    <PhoneNumberInput
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        label="Nomor Telepon"
                        fullWidth
                        size="small"
                    />
                )} />
                {/* Roles - Multi Select */}
                <Controller name="role_ids" control={control} render={({ field }) => (
                    <RoleSelect
                        options={state.roleUser || []}
                        value={field.value || []}
                        onChange={field.onChange}
                        label="Roles"
                        placeholder="Pilih role..."
                    />
                )} />
                {/* Gender */}
                <Controller name="detail.gender" control={control} render={({ field }) => (
                    <TextField {...field} value={field.value ?? "L"} label="Jenis Kelamin" select fullWidth size="small">
                        <MenuItem value="L">Laki-laki</MenuItem>
                        <MenuItem value="P">Perempuan</MenuItem>
                    </TextField>
                )} />
                {/* Birth Place & Birth Date */}
                <div className="grid grid-cols-2 gap-4">
                    <Controller name="detail.birth_place" control={control} render={({ field }) => (
                        <TextField {...field} value={field.value ?? ""} label="Tempat Lahir" fullWidth size="small" />
                    )} />
                    <Controller name="detail.birth_date" control={control} render={({ field }) => (
                        <TextField {...field} value={field.value ?? ""} label="Tanggal Lahir" type="date" fullWidth size="small" slotProps={{
                            inputLabel: { shrink: true }
                        }} />
                    )} />
                </div>
                {/* Address */}
                <Controller name="detail.address" control={control} render={({ field }) => (
                    <TextField {...field} value={field.value ?? ""} label="Alamat" multiline rows={2} fullWidth size="small" />
                )} />
                {/* RT, RW, ZIP Code */}
                <div className="grid grid-cols-3 gap-4">
                    <Controller name="detail.RT" control={control} render={({ field }) => (
                        <TextField {...field} value={field.value ?? ""} label="RT" fullWidth size="small" />
                    )} />
                    <Controller name="detail.RW" control={control} render={({ field }) => (
                        <TextField {...field} value={field.value ?? ""} label="RW" fullWidth size="small" />
                    )} />
                    <Controller name="detail.zip_code" control={control} render={({ field }) => (
                        <TextField {...field} value={field.value ?? ""} label="Kode Pos" fullWidth size="small" />
                    )} />
                </div>
                {/* Description */}
                <Controller name="detail.description" control={control} render={({ field }) => (
                    <TextField {...field} value={field.value ?? ""} label="Deskripsi" multiline rows={2} fullWidth size="small" />
                )} />
                {/* Status */}
                <Controller name="status" control={control} render={({ field }) => (
                    <TextField {...field} value={field.value !== undefined ? String(field.value) : "true"} label="Status" select fullWidth size="small"
                        onChange={(e) => field.onChange(e.target.value === "true")}>
                        <MenuItem value="true">Active</MenuItem>
                        <MenuItem value="false">Inactive</MenuItem>
                    </TextField>
                )} />
            </div>
        </DialogBody>
    );
};

export default UpdateEmployeeFormDialog;
