import { useEffect, useState } from "react";
import { Button, TextField, MenuItem } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useCreateSchedule from "./hook/useCreateSchedule";
import CategorySubjectService from "@api/categorysubject/service";
import { type CategorySubjectResponseModel } from "@api/categorysubject/model";
import EmployeeService from "@api/employee/service";
import { type EmployeeResponseModel } from "@api/employee/model";
import ClassService from "@api/class/service";
import { type ClassResponseModel } from "@api/class/model";
import { ScheduleTimeService } from "@api/schedule/service";
import { type ScheduleTimeResponseModel } from "@api/schedule/model";

const schema = yup.object({
    id_category_subject: yup.string().required("Category Subject is required"),
    id_duty_teacher: yup.string().required("Duty Teacher is required"),
    id_class: yup.string().required("Class is required"),
    id_schendule_time: yup.string().required("Schedule Time Slot is required"),
    status: yup.string().required("Status is required"),
}).required();

type FormData = yup.InferType<typeof schema>;

const CreateScheduleFormCardDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const { handleCreate } = useCreateSchedule();
    const [categories, setCategories] = useState<CategorySubjectResponseModel[]>([]);
    const [employees, setEmployees] = useState<EmployeeResponseModel[]>([]);
    const [classes, setClasses] = useState<ClassResponseModel[]>([]);
    const [timeSlots, setTimeSlots] = useState<ScheduleTimeResponseModel[]>([]);

    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            id_category_subject: "",
            id_duty_teacher: "",
            id_class: "",
            id_schendule_time: "",
            status: "active",
        }
    });

    useEffect(() => {
        if (isOpen) {
            reset();
            new CategorySubjectService().getCategorySubjectRequest({
                onSuccess: (res: any) => setCategories(res.data || []),
                onError: () => { }
            }, { params: { page: 1, limit: 100 } });

            new EmployeeService().getEmployeeRequest({
                onSuccess: (res: any) => setEmployees(res.data || []),
                onError: () => { }
            }, { params: { page: 1, limit: 100 } });

            new ClassService().getAll({ onSuccess: (res: any) => setClasses(res.data || []) , onError: () => {} }, { params: { page: 1, limit: 100 } });
            new ScheduleTimeService().getAll({ onSuccess: (res: any) => setTimeSlots(res.data || []) , onError: () => {} }, { params: { page: 1, limit: 100 } });
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
                    <h2 className="text-xl font-bold text-primary-txt">Create Schedule Entry</h2>
                    <button onClick={onClose} className="text-secondary-txt hover:text-primary-txt transition-colors">
                        <Close />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="contents">
                    <div className="p-6 space-y-4">
                        <Controller name="id_class" control={control} render={({ field }) => (
                            <TextField {...field} label="Class (Kelas)" select fullWidth size="small" error={!!errors.id_class} helperText={errors.id_class?.message}>
                                {classes.map((c) => (
                                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                                ))}
                            </TextField>
                        )} />

                        <Controller name="id_category_subject" control={control} render={({ field }) => (
                            <TextField {...field} label="Category Subject" select fullWidth size="small" error={!!errors.id_category_subject} helperText={errors.id_category_subject?.message}>
                                {categories.map((cat) => (
                                    <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                                ))}
                            </TextField>
                        )} />

                        <Controller name="id_duty_teacher" control={control} render={({ field }) => (
                            <TextField {...field} label="Duty Teacher (Guru Piket)" select fullWidth size="small" error={!!errors.id_duty_teacher} helperText={errors.id_duty_teacher?.message}>
                                {employees.map((e) => (
                                    <MenuItem key={e.id} value={e.id}>{e.first_name} {e.last_name} ({e.niy})</MenuItem>
                                ))}
                            </TextField>
                        )} />

                        <Controller name="id_schendule_time" control={control} render={({ field }) => (
                            <TextField {...field} label="Schedule Time Slot (Waktu)" select fullWidth size="small" error={!!errors.id_schendule_time} helperText={errors.id_schendule_time?.message}>
                                {timeSlots.map((ts) => (
                                    <MenuItem key={ts.id} value={ts.id}>
                                        {ts.hari}: {ts.jam_awal} - {ts.jam_akhir} ({ts.category_schendule_time?.name || ''})
                                    </MenuItem>
                                ))}
                            </TextField>
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

export default CreateScheduleFormCardDialog;
