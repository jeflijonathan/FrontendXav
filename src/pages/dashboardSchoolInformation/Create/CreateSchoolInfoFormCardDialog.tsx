import { useEffect, useState } from "react";
import { Button, TextField, MenuItem } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useCreateSchoolInfo from "./hook/useCreateSchoolInfo";
import EmployeeService from "@api/employee/service";
import type { EmployeeResponseModel } from "@api/employee/model";

const schema = yup.object({
    name_school: yup.string().required("School name is required"),
    periode: yup.string().required("Periode is required"),
    NPSN: yup.string().required("NPSN is required"),
    id_headmaster: yup.string().required("Headmaster is required"),
    alamat: yup.string().required("Address is required"),
    status: yup.string().required("Status is required"),
}).required();

type FormData = yup.InferType<typeof schema>;

const CreateSchoolInfoFormCardDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const { handleCreate } = useCreateSchoolInfo();
    const [employees, setEmployees] = useState<EmployeeResponseModel[]>([]);

    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            name_school: "SMK Xaverius Palembang",
            periode: "2024/2025 Ganjil",
            NPSN: "",
            id_headmaster: "",
            alamat: "",
            status: "active",
        }
    });

    useEffect(() => {
        if (isOpen) {
            reset();
            new EmployeeService().getEmployeeRequest({
                onSuccess: (res: any) => setEmployees(res.data || []),
                onError: () => {}
            }, { params: { page: 1, limit: 100 } });
        }
    }, [isOpen, reset]);

    const onSubmit = (data: FormData) => {
        handleCreate(data, onClose);
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", backgroundColor: "rgba(0,0,0,0.4)" }}
            onClick={onClose}
        >
            <div
                className="bg-theme-primary border border-light-dark rounded-2xl shadow-2xl w-full max-w-lg overflow-y-auto mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-6 border-b border-light-dark">
                    <h2 className="text-xl font-bold text-primary-txt">Create School Information</h2>
                    <button onClick={onClose} className="text-secondary-txt hover:text-primary-txt transition-colors">
                        <Close />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="contents">
                    <div className="p-6 space-y-4">
                        <Controller name="name_school" control={control} render={({ field }) => (
                            <TextField {...field} label="School Name" fullWidth size="small" error={!!errors.name_school} helperText={errors.name_school?.message} />
                        )} />

                        <div className="grid grid-cols-2 gap-4">
                            <Controller name="periode" control={control} render={({ field }) => (
                                <TextField {...field} label="Periode (e.g. 2024/2025 Ganjil)" fullWidth size="small" error={!!errors.periode} helperText={errors.periode?.message} />
                            )} />
                            <Controller name="NPSN" control={control} render={({ field }) => (
                                <TextField {...field} label="NPSN" fullWidth size="small" error={!!errors.NPSN} helperText={errors.NPSN?.message} />
                            )} />
                        </div>

                        <Controller name="id_headmaster" control={control} render={({ field }) => (
                            <TextField {...field} label="Headmaster (Kepala Sekolah)" select fullWidth size="small" error={!!errors.id_headmaster} helperText={errors.id_headmaster?.message}>
                                {employees.map((e) => (
                                    <MenuItem key={e.id} value={e.id}>{e.first_name} {e.last_name} ({e.niy})</MenuItem>
                                ))}
                            </TextField>
                        )} />

                        <Controller name="alamat" control={control} render={({ field }) => (
                            <TextField {...field} label="Address (Alamat)" multiline rows={2} fullWidth size="small" error={!!errors.alamat} helperText={errors.alamat?.message} />
                        )} />

                        <Controller name="status" control={control} render={({ field }) => (
                            <TextField {...field} label="Status" select fullWidth size="small" error={!!errors.status} helperText={errors.status?.message}>
                                <MenuItem value="active">Active</MenuItem>
                                <MenuItem value="inactive">Inactive</MenuItem>
                            </TextField>
                        )} />
                    </div>

                    <div className="flex justify-end gap-3 p-6 border-t border-light-dark">
                        <Button type="button" variant="outlined" onClick={onClose} sx={{ borderRadius: "10px", textTransform: "none" }}>Cancel</Button>
                        <Button type="submit" variant="contained" color="primary" sx={{ borderRadius: "10px", textTransform: "none" }}>Submit</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateSchoolInfoFormCardDialog;
