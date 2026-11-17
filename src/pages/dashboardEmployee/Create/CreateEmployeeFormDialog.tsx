import { useEffect } from "react";
import { MenuItem, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { DialogBody } from "@components/Dialog";
import useDashboardEmployeeStore from "../store";
import UploadFileDropzone from "@components/Input/UploadFile";
import useCreateEmployee from "./hook/useCreateEmployee";
import type { CreateEmployeeRequestModel } from "@api/employee/model";
import PhoneNumberInput from "@components/Input/PhoneNumberInput";
import RoleSelect from "@components/Input/Select";
import AcademicTitleSelect from "../components/AcademicTitleSelect";
import { useAcademicTitles } from "../hook/useAcademicTitles";

const CreateEmployeeFormDialog = () => {
    const { control, formState: { errors }, setValue, watch } = useFormContext<CreateEmployeeRequestModel>();
    const serverErrors = (errors as any)?.root?.serverError?.message as string | undefined;
    const { state, setState } = useDashboardEmployeeStore();
    const { FetchUserRole } = useCreateEmployee();
    const { titlesDepanOptions, titlesBelakangOptions, getTitleDescription } = useAcademicTitles();

    const firstName = watch("profile.first_name") || "";
    const lastName = watch("profile.last_name") || "";
    const titlesDepan = watch("titles_depan") || [];
    const titlesBelakang = watch("titles_belakang") || [];

    // Hitung pratinjau nama lengkap bergelar secara realtime
    const baseName = [firstName, lastName].filter(Boolean).join(" ").trim();
    const depanStr = titlesDepan.length > 0 ? `${titlesDepan.join(" ")} ` : "";
    const belakangStr = titlesBelakang.length > 0 ? `, ${titlesBelakang.join(", ")}` : "";
    const formattedPreview = baseName ? `${depanStr}${baseName}${belakangStr}`.trim() : "";

    useEffect(function loadDataOption() {
        FetchUserRole({ params: {} });
    }, []);

    // Sinkronkan nama lengkap ke form user.full_name saat nama atau gelar berubah
    useEffect(() => {
        if (formattedPreview) {
            setValue("user.full_name", formattedPreview);
        }
    }, [formattedPreview, setValue]);

    return (
        <DialogBody>
            <div className="flex flex-col gap-4">
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
                <div className="grid grid-cols-2 gap-4">
                    <Controller name="user.username" control={control} render={({ field }) => (
                        <TextField {...field} label="Username" fullWidth size="small"
                            autoComplete="off"
                            error={!!errors.user?.username}
                            helperText={errors.user?.username?.message as string} />
                    )} />
                    <Controller name="user.password" control={control} render={({ field }) => (
                        <TextField {...field} label="Password" type="password" fullWidth size="small"
                            autoComplete="new-password"
                            error={!!errors.user?.password}
                            helperText={errors.user?.password?.message as string} />
                    )} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Controller name="profile.first_name" control={control} render={({ field }) => (
                        <TextField {...field} label="First Name" fullWidth size="small"
                            error={!!errors.profile?.first_name}
                            helperText={errors.profile?.first_name?.message as string}
                            onChange={(e) => field.onChange(e)} />
                    )} />
                    <Controller name="profile.last_name" control={control} render={({ field }) => (
                        <TextField {...field} label="Last Name" fullWidth size="small"
                            error={!!errors.profile?.last_name}
                            helperText={errors.profile?.last_name?.message as string}
                            onChange={(e) => field.onChange(e)} />
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
                {/* NIY & Profile URL */}
                <div className="grid grid-cols-2 gap-4">
                    <Controller name="profile.niy" control={control} render={({ field }) => (
                        <TextField {...field} label="NIY" fullWidth size="small"
                            error={!!errors.profile?.niy}
                            helperText={errors.profile?.niy?.message as string} />
                    )} />
                    <Controller name="profile.profile_url" control={control} render={() => (
                        <div className="col-span-2">
                            <UploadFileDropzone
                                value={state.profileFile}
                                onFileChange={(file) => setState(prev => ({ ...prev, profileFile: file }))}
                                label="Profile Image"
                            />
                        </div>
                    )} />
                </div>
                {/* Email */}
                <Controller name="profile.email" control={control} render={({ field }) => (
                    <TextField {...field} label="Email" type="email" fullWidth size="small"
                        autoComplete="email"
                        error={!!errors.profile?.email}
                        helperText={errors.profile?.email?.message as string} />
                )} />
                {/* Phone Number */}
                <Controller name="detail.phone_number" control={control} render={({ field }) => (
                    <PhoneNumberInput
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        label="Nomor Telepon"
                        fullWidth
                        size="small"
                        error={!!errors.detail?.phone_number}
                        helperText={errors.detail?.phone_number?.message as string}
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
                    <TextField {...field} value={field.value ?? "L"} label="Jenis Kelamin" select fullWidth size="small"
                        error={!!errors.detail?.gender}
                        helperText={errors.detail?.gender?.message as string}>
                        <MenuItem value="L">Laki-laki</MenuItem>
                        <MenuItem value="P">Perempuan</MenuItem>
                    </TextField>
                )} />
                {/* Birth Place & Birth Date */}
                <div className="grid grid-cols-2 gap-4">
                    <Controller name="detail.birth_place" control={control} render={({ field }) => (
                        <TextField {...field} label="Tempat Lahir" fullWidth size="small"
                            error={!!errors.detail?.birth_place}
                            helperText={errors.detail?.birth_place?.message as string} />
                    )} />
                    <Controller name="detail.birth_date" control={control} render={({ field }) => (
                        <TextField {...field} label="Tanggal Lahir" type="date" fullWidth size="small"
                            error={!!errors.detail?.birth_date}
                            helperText={errors.detail?.birth_date?.message as string}
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }} />
                    )} />
                </div>
                {/* Address */}
                <Controller name="detail.address" control={control} render={({ field }) => (
                    <TextField {...field} label="Alamat" multiline rows={2} fullWidth size="small"
                        error={!!errors.detail?.address}
                        helperText={errors.detail?.address?.message as string} />
                )} />
                {/* RT, RW, ZIP Code */}
                <div className="grid grid-cols-3 gap-4">
                    <Controller name="detail.RT" control={control} render={({ field }) => (
                        <TextField {...field} label="RT" fullWidth size="small"
                            error={!!errors.detail?.RT}
                            helperText={errors.detail?.RT?.message as string} />
                    )} />
                    <Controller name="detail.RW" control={control} render={({ field }) => (
                        <TextField {...field} label="RW" fullWidth size="small"
                            error={!!errors.detail?.RW}
                            helperText={errors.detail?.RW?.message as string} />
                    )} />
                    <Controller name="detail.zip_code" control={control} render={({ field }) => (
                        <TextField {...field} label="Kode Pos" fullWidth size="small"
                            error={!!errors.detail?.zip_code}
                            helperText={errors.detail?.zip_code?.message as string} />
                    )} />
                </div>
                {/* Description */}
                <Controller name="detail.description" control={control} render={({ field }) => (
                    <TextField {...field} label="Deskripsi" multiline rows={2} fullWidth size="small"
                        error={!!errors.detail?.description}
                        helperText={errors.detail?.description?.message as string} />
                )} />
                {/* Status */}
                <Controller name="profile.status" control={control} render={({ field }) => (
                    <TextField {...field} value={field.value !== undefined ? String(field.value) : "true"} label="Status" select fullWidth size="small"
                        error={!!errors.profile?.status}
                        helperText={errors.profile?.status?.message as string}
                        onChange={(e) => field.onChange(e.target.value === "true")}>
                        <MenuItem value="true">Active</MenuItem>
                        <MenuItem value="false">Inactive</MenuItem>
                    </TextField>
                )} />
            </div>
        </DialogBody>
    );
};

export default CreateEmployeeFormDialog;