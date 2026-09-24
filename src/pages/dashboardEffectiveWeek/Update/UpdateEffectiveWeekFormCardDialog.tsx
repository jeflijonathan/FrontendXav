import { useEffect, useState } from "react";
import { Button, TextField, MenuItem, CircularProgress } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useUpdateEffectiveWeek from "./hook/useUpdateEffectiveWeek";
import SubjectService from "@api/subject/service";
import type { SubjectResponseModel } from "@api/subject/model";

const schema = yup.object({
    id_subject: yup.string().required("Subject is required"),
    Alokasi_Intrakurikuler: yup.number().typeError("Intrakurikuler allocation must be a number").required("Intrakurikuler allocation is required").min(0),
    Alokasi_Kokurikuler: yup.number().typeError("Kokurikuler allocation must be a number").required("Kokurikuler allocation is required").min(0),
}).required();

type FormData = yup.InferType<typeof schema>;

const UpdateEffectiveWeekFormCardDialog = ({ id, isOpen, onClose }: { id: string; isOpen: boolean; onClose: () => void }) => {
    const { detail, isLoadingDetail, fetchDetail, handleUpdate } = useUpdateEffectiveWeek(id);
    const [subjects, setSubjects] = useState<SubjectResponseModel[]>([]);

    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            id_subject: "",
            Alokasi_Intrakurikuler: 36,
            Alokasi_Kokurikuler: 4,
        }
    });

    useEffect(() => {
        if (isOpen && id) {
            fetchDetail();
            new SubjectService().getSubjectRequest({
                onSuccess: (res: any) => setSubjects(res.data || []),
                onError: () => {}
            }, { params: { page: 1, limit: 100 } });
        }
    }, [isOpen, id]);

    useEffect(() => {
        if (detail) {
            reset({
                id_subject: detail.id_subject || "",
                Alokasi_Intrakurikuler: detail.Alokasi_Intrakurikuler || 0,
                Alokasi_Kokurikuler: detail.Alokasi_Kokurikuler || 0,
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
                    <h2 className="text-xl font-bold text-primary-txt">Edit Effective Week Allocation</h2>
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
                            <Controller name="id_subject" control={control} render={({ field }) => (
                                <TextField {...field} label="Subject (Mata Pelajaran)" select fullWidth size="small" error={!!errors.id_subject} helperText={errors.id_subject?.message}>
                                    {subjects.map((s) => (
                                        <MenuItem key={s.id} value={s.id}>{s.name} ({s.code})</MenuItem>
                                    ))}
                                </TextField>
                            )} />

                            <Controller name="Alokasi_Intrakurikuler" control={control} render={({ field }) => (
                                <TextField {...field} label="Alokasi Intrakurikuler (Jam)" type="number" fullWidth size="small" error={!!errors.Alokasi_Intrakurikuler} helperText={errors.Alokasi_Intrakurikuler?.message} />
                            )} />

                            <Controller name="Alokasi_Kokurikuler" control={control} render={({ field }) => (
                                <TextField {...field} label="Alokasi Kokurikuler (Jam)" type="number" fullWidth size="small" error={!!errors.Alokasi_Kokurikuler} helperText={errors.Alokasi_Kokurikuler?.message} />
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

export default UpdateEffectiveWeekFormCardDialog;
