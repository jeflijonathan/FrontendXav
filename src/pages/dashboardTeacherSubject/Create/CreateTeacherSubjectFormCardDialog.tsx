import { useEffect, useState } from "react";
import { Button, TextField, MenuItem } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useCreateTeacherSubject from "./hook/useCreateTeacherSubject";
import EmployeeService from "@api/employee/service";
import type { EmployeeResponseModel } from "@api/employee/model";
import SubjectService from "@api/subject/service";
import type { SubjectResponseModel } from "@api/subject/model";
import CategorySubjectService from "@api/categorysubject/service";
import type { CategorySubjectResponseModel } from "@api/categorysubject/model";

const schema = yup.object({
    id_teacher: yup.string().required("Teacher is required"),
    id_subject: yup.string().required("Subject is required"),
    id_category_subject: yup.string().required("Category Subject is required"),
    jp_amount: yup.number().typeError("JP amount must be a number").required("JP amount is required").positive().integer(),
    status: yup.string().required("Status is required"),
}).required();

type FormData = yup.InferType<typeof schema>;

const CreateTeacherSubjectFormCardDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const { handleCreate } = useCreateTeacherSubject();
    const [teachers, setTeachers] = useState<EmployeeResponseModel[]>([]);
    const [subjects, setSubjects] = useState<SubjectResponseModel[]>([]);
    const [categories, setCategories] = useState<CategorySubjectResponseModel[]>([]);

    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            id_teacher: "",
            id_subject: "",
            id_category_subject: "",
            jp_amount: 2,
            status: "active",
        }
    });

    useEffect(() => {
        if (isOpen) {
            reset();
            new EmployeeService().getEmployeeRequest({
                onSuccess: (res: any) => setTeachers(res.data || []),
                onError: () => {}
            }, { params: { page: 1, limit: 100 } });

            new SubjectService().getSubjectRequest({
                onSuccess: (res: any) => setSubjects(res.data || []),
                onError: () => {}
            }, { params: { page: 1, limit: 100 } });

            new CategorySubjectService().getCategorySubjectRequest({
                onSuccess: (res: any) => setCategories(res.data || []),
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
                    <h2 className="text-xl font-bold text-primary-txt">Create Teacher Subject Assignment</h2>
                    <button onClick={onClose} className="text-secondary-txt hover:text-primary-txt transition-colors">
                        <Close />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="contents">
                    <div className="p-6 space-y-4">
                        <Controller name="id_teacher" control={control} render={({ field }) => (
                            <TextField {...field} label="Teacher (Guru)" select fullWidth size="small" error={!!errors.id_teacher} helperText={errors.id_teacher?.message}>
                                {teachers.map((t) => (
                                    <MenuItem key={t.id} value={t.id}>{t.first_name} {t.last_name} ({t.niy})</MenuItem>
                                ))}
                            </TextField>
                        )} />

                        <Controller name="id_subject" control={control} render={({ field }) => (
                            <TextField {...field} label="Subject (Mata Pelajaran)" select fullWidth size="small" error={!!errors.id_subject} helperText={errors.id_subject?.message}>
                                {subjects.map((s) => (
                                    <MenuItem key={s.id} value={s.id}>{s.name} ({s.code})</MenuItem>
                                ))}
                            </TextField>
                        )} />

                        <Controller name="id_category_subject" control={control} render={({ field }) => (
                            <TextField {...field} label="Category Subject" select fullWidth size="small" error={!!errors.id_category_subject} helperText={errors.id_category_subject?.message}>
                                {categories.map((c) => (
                                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                                ))}
                            </TextField>
                        )} />

                        <Controller name="jp_amount" control={control} render={({ field }) => (
                            <TextField {...field} label="JP Amount (Jumlah Jam)" type="number" fullWidth size="small" error={!!errors.jp_amount} helperText={errors.jp_amount?.message} />
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

export default CreateTeacherSubjectFormCardDialog;
