import { useEffect, useState } from "react";
import { Button, TextField, MenuItem, CircularProgress } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useUpdateClassroom from "./hook/useUpdateClassroom";
import ClassService from "@api/class/service";
import type { ClassResponseModel } from "@api/class/model";
import TeacherSubjectService from "@api/teachersubject/service";
import type { TeacherSubjectResponseModel } from "@api/teachersubject/model";
import SchoolInformationService from "@api/schoolinformation/service";
import type { SchoolInformationResponseModel } from "@api/schoolinformation/model";

const schema = yup.object({
    id_class: yup.string().required("Class is required"),
    id_teacher_subject: yup.string().required("Teacher Subject is required"),
    id_school_information: yup.string().required("School Information is required"),
    status: yup.string().required("Status is required"),
}).required();

type FormData = yup.InferType<typeof schema>;

const UpdateClassroomFormCardDialog = ({ id, isOpen, onClose }: { id: string; isOpen: boolean; onClose: () => void }) => {
    const { detail, isLoadingDetail, fetchDetail, handleUpdate } = useUpdateClassroom(id);
    const [classes, setClasses] = useState<ClassResponseModel[]>([]);
    const [teacherSubjects, setTeacherSubjects] = useState<TeacherSubjectResponseModel[]>([]);
    const [schools, setSchools] = useState<SchoolInformationResponseModel[]>([]);

    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            id_class: "",
            id_teacher_subject: "",
            id_school_information: "",
            status: "active",
        }
    });

    useEffect(() => {
        if (isOpen && id) {
            fetchDetail();
            new ClassService().getAll({ onSuccess: (res: any) => setClasses(res.data || []) , onError: () => {} }, { params: { page: 1, limit: 100 } });
            new TeacherSubjectService().getAll({ onSuccess: (res: any) => setTeacherSubjects(res.data || []) , onError: () => {} }, { params: { page: 1, limit: 100 } });
            new SchoolInformationService().getAll({ onSuccess: (res: any) => setSchools(res.data || []) , onError: () => {} }, { params: { page: 1, limit: 100 } });
        }
    }, [isOpen, id]);

    useEffect(() => {
        if (detail) {
            reset({
                id_class: detail.id_class || "",
                id_teacher_subject: detail.id_teacher_subject || "",
                id_school_information: detail.id_school_information || "",
                status: detail.status ? "active" : "inactive",
            });
        }
    }, [detail, reset]);

    const onSubmit = (data: FormData) => {
        handleUpdate(data, onClose);
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
                    <h2 className="text-xl font-bold text-primary-txt">Edit Classroom Assignment</h2>
                    <button onClick={onClose} className="text-secondary-txt hover:text-primary-txt transition-colors">
                        <Close />
                    </button>
                </div>

                {isLoadingDetail ? (
                    <div className="p-12 text-center">
                        <CircularProgress />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="contents">
                        <div className="p-6 space-y-4">
                            <Controller name="id_class" control={control} render={({ field }) => (
                                <TextField {...field} label="Class (Kelas)" select fullWidth size="small" error={!!errors.id_class} helperText={errors.id_class?.message}>
                                    {classes.map((c) => (
                                        <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                                    ))}
                                </TextField>
                            )} />

                            <Controller name="id_teacher_subject" control={control} render={({ field }) => (
                                <TextField {...field} label="Teacher Subject (Pengampu)" select fullWidth size="small" error={!!errors.id_teacher_subject} helperText={errors.id_teacher_subject?.message}>
                                    {teacherSubjects.map((ts) => (
                                        <MenuItem key={ts.id} value={ts.id}>
                                            {ts.teacher ? `${ts.teacher.first_name} ${ts.teacher.last_name}` : ts.id_teacher} - {ts.subject?.name || ts.id_subject}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )} />

                            <Controller name="id_school_information" control={control} render={({ field }) => (
                                <TextField {...field} label="School Information" select fullWidth size="small" error={!!errors.id_school_information} helperText={errors.id_school_information?.message}>
                                    {schools.map((s) => (
                                        <MenuItem key={s.id} value={s.id}>{s.name_school} ({s.periode})</MenuItem>
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
                            <Button type="submit" variant="contained" color="primary" sx={{ borderRadius: "10px", textTransform: "none" }}>Update</Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default UpdateClassroomFormCardDialog;
