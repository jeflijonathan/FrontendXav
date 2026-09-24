import { useEffect, useState } from "react";
import { Button, TextField, MenuItem } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import useCreateClass from "./hook/useCreateClass";
import MajorService from "@api/major/service";
import EmployeeService from "@api/employee/service";
import { type MajorResponseModel } from "@api/major/model";
import { type EmployeeResponseModel } from "@api/employee/model";

type FormData = {
    id_major: string;
    id_class_guardian: string;
    name: string;
    status: boolean;
};

const CreateClassFormCardDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const { handleCreate } = useCreateClass();
    const [majors, setMajors] = useState<MajorResponseModel[]>([]);
    const [employees, setEmployees] = useState<EmployeeResponseModel[]>([]);

    const { control, handleSubmit, reset } = useForm<FormData>({
        defaultValues: { id_major: "", id_class_guardian: "", name: "", status: true }
    });

    useEffect(() => {
        if (isOpen) {
            reset();
            new MajorService().getAll({
                onSuccess: (res: any) => setMajors(res.data || []),
                onError: () => { },
            }, { params: { page: 1, limit: 100 } });

            new EmployeeService().getEmployeeRequest({
                onSuccess: (res: any) => setEmployees(res.data || []),
                onError: () => { },
            }, { params: { page: 1, limit: 100 } });
        }
    }, [isOpen, reset]);

    const onSubmit = (data: FormData) => {
        handleCreate({
            id_major: data.id_major,
            id_class_guardian: data.id_class_guardian || null,
            name: data.name,
            status: data.status === "active",
        }, onClose);
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
                    <h2 className="text-xl font-bold text-primary-txt">Create Class (Kelas)</h2>
                    <button onClick={onClose} className="text-secondary-txt hover:text-primary-txt transition-colors">
                        <Close />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="contents">
                    <div className="p-6 space-y-4">
                        <Controller name="name" control={control} render={({ field }) => (
                            <TextField {...field} label="Class Name (e.g. X RPL 1)" fullWidth size="small" />
                        )} />

                        <Controller name="id_major" control={control} render={({ field }) => (
                            <TextField {...field} label="Major (Jurusan)" select fullWidth size="small">
                                {majors.map((m) => (
                                    <MenuItem key={m.id_major} value={m.id_major}>{m.name}</MenuItem>
                                ))}
                            </TextField>
                        )} />

                        <Controller name="id_class_guardian" control={control} render={({ field }) => (
                            <TextField {...field} label="Wali Kelas (optional)" select fullWidth size="small">
                                <MenuItem value="">— None —</MenuItem>
                                {employees.map((e) => (
                                    <MenuItem key={e.id} value={e.id}>{e.first_name} {e.last_name} ({e.niy})</MenuItem>
                                ))}
                            </TextField>
                        )} />

                        <Controller name="status" control={control} render={({ field }) => (
                            <TextField
                                {...field}
                                label="Status"
                                select
                                fullWidth
                                size="small"
                                value={field.value ? "true" : "false"}
                                onChange={(e) => field.onChange(e.target.value === "true")}
                            >
                                <MenuItem value="true">Active</MenuItem>
                                <MenuItem value="false">Inactive</MenuItem>
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

export default CreateClassFormCardDialog;
