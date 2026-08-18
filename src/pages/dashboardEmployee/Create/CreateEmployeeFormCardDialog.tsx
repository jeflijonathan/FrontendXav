import { useEffect } from "react";
import { Button, TextField, MenuItem } from "@mui/material";
import { Close } from "@mui/icons-material";
import { MuiTelInput } from "mui-tel-input";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useCreateEmployee from "./hook/useCreateEmployee";

const schema = yup.object({
    username: yup.string().required("Username is required"),
    password: yup.string().required("Password is required"),
    first_name: yup.string().required("First Name is required"),
    last_name: yup.string().required("Last Name is required"),
    niy: yup.string().required("NIY is required"),
    gender: yup.string().required("Gender is required"),
    birth_place: yup.string().nullable().transform((v) => (v === "" ? null : v)),
    birth_date: yup.string().nullable().transform((v) => (v === "" ? null : v)),
    email: yup.string().nullable().transform((v) => (v === "" ? null : v)).email("Must be a valid email"),
    address: yup.string().nullable().transform((v) => (v === "" ? null : v)),
    phone_number: yup.string().nullable().transform((v) => (v === "" ? null : v)),
}).required();

type FormData = yup.InferType<typeof schema>;

const CreateEmployeeFormCardDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const { handleCreate } = useCreateEmployee();
    
    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            username: "",
            password: "",
            first_name: "",
            last_name: "",
            niy: "",
            gender: "L",
            birth_place: "",
            birth_date: "",
            email: "",
            address: "",
            phone_number: "",
        }
    });

    useEffect(() => {
        if (isOpen) {
            reset();
        }
    }, [isOpen, reset]);

    const onSubmit = (data: FormData) => {
        const payload = {
            user: { username: data.username, password: data.password },
            profile: {
                first_name: data.first_name,
                last_name: data.last_name,
                niy: data.niy,
                gender: data.gender,
                birth_place: data.birth_place,
                birth_date: data.birth_date,
                email: data.email,
                address: data.address,
                phone_number: data.phone_number,
            },
        };
        handleCreate(payload, onClose);
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", backgroundColor: "rgba(0,0,0,0.4)" }}
            onClick={onClose}
        >
            <div
                className="bg-theme-primary border border-light-dark rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-light-dark">
                    <h2 className="text-xl font-bold text-primary-txt">Create Employee</h2>
                    <button onClick={onClose} className="text-secondary-txt hover:text-primary-txt transition-colors">
                        <Close />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit(onSubmit)} className="contents">
                    <div className="p-6 space-y-5">
                        <p className="text-sm text-secondary-txt font-medium uppercase tracking-wider">Account Information</p>
                        <div className="grid grid-cols-2 gap-4">
                            <Controller name="username" control={control} render={({ field }) => (
                                <TextField {...field} label="Username" fullWidth size="small" error={!!errors.username} helperText={errors.username?.message} />
                            )} />
                            <Controller name="password" control={control} render={({ field }) => (
                                <TextField {...field} label="Password" type="password" fullWidth size="small" error={!!errors.password} helperText={errors.password?.message} />
                            )} />
                        </div>

                        <p className="text-sm text-secondary-txt font-medium uppercase tracking-wider pt-2">Profile Information</p>
                        <div className="grid grid-cols-2 gap-4">
                            <Controller name="first_name" control={control} render={({ field }) => (
                                <TextField {...field} label="First Name" fullWidth size="small" error={!!errors.first_name} helperText={errors.first_name?.message} />
                            )} />
                            <Controller name="last_name" control={control} render={({ field }) => (
                                <TextField {...field} label="Last Name" fullWidth size="small" error={!!errors.last_name} helperText={errors.last_name?.message} />
                            )} />
                            <Controller name="niy" control={control} render={({ field }) => (
                                <TextField {...field} label="NIY" fullWidth size="small" error={!!errors.niy} helperText={errors.niy?.message} />
                            )} />
                            <Controller name="gender" control={control} render={({ field }) => (
                                <TextField {...field} label="Gender" select fullWidth size="small" error={!!errors.gender} helperText={errors.gender?.message}>
                                    <MenuItem value="L">Laki-laki</MenuItem>
                                    <MenuItem value="P">Perempuan</MenuItem>
                                </TextField>
                            )} />
                            <Controller name="birth_place" control={control} render={({ field }) => (
                                <TextField {...field} label="Birth Place" fullWidth size="small" error={!!errors.birth_place} helperText={errors.birth_place?.message} />
                            )} />
                            <Controller name="birth_date" control={control} render={({ field }) => (
                                <TextField {...field} label="Birth Date" type="date" slotProps={{ inputLabel: { shrink: true } }} fullWidth size="small" error={!!errors.birth_date} helperText={errors.birth_date?.message} />
                            )} />
                            <Controller name="email" control={control} render={({ field }) => (
                                <TextField {...field} label="Email" type="email" fullWidth size="small" error={!!errors.email} helperText={errors.email?.message} />
                            )} />
                            <Controller name="phone_number" control={control} render={({ field: { onChange, value, ...field } }) => (
                                <MuiTelInput {...field} value={value ?? ""} onChange={onChange} defaultCountry="ID" label="Phone Number" fullWidth size="small" error={!!errors.phone_number} helperText={errors.phone_number?.message} />
                            )} />
                        </div>
                        <Controller name="address" control={control} render={({ field }) => (
                            <TextField {...field} label="Address" multiline rows={2} fullWidth size="small" error={!!errors.address} helperText={errors.address?.message} />
                        )} />
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 p-6 border-t border-light-dark">
                        <Button type="button" variant="outlined" onClick={onClose} sx={{ borderRadius: "10px", textTransform: "none" }}>Cancel</Button>
                        <Button type="submit" variant="contained" color="primary" sx={{ borderRadius: "10px", textTransform: "none" }}>Submit</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateEmployeeFormCardDialog;
