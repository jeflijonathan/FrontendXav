import { useEffect, useState } from "react";
import { Button, TextField, MenuItem, CircularProgress } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useUpdateScheduleTime from "./hook/useUpdateScheduleTime";
import { CategoryScheduleTimeService } from "@api/schedule/service";
import { type CategoryScheduleTimeResponseModel } from "@api/schedule/model";

const schema = yup.object({
    hari: yup.string().required("Day is required"),
    jam_awal: yup.string().required("Start time is required"),
    jam_akhir: yup.string().required("End time is required"),
    id_category_schendule_time: yup.string().required("Category is required"),
}).required();

type FormData = yup.InferType<typeof schema>;

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

const UpdateScheduleTimeFormCardDialog = ({ id, isOpen, onClose }: { id: string; isOpen: boolean; onClose: () => void }) => {
    const { detail, isLoadingDetail, fetchDetail, handleUpdate } = useUpdateScheduleTime(id);
    const [categories, setCategories] = useState<CategoryScheduleTimeResponseModel[]>([]);

    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            hari: "Senin",
            jam_awal: "07:00",
            jam_akhir: "07:45",
            id_category_schendule_time: "",
        }
    });

    useEffect(() => {
        if (isOpen && id) {
            fetchDetail();
            const svc = new CategoryScheduleTimeService();
            svc.getAll(
                {
                    onSuccess: (res: any) => setCategories(res.data || []),
                    onError: () => { }
                },
                { params: { page: 1, limit: 100 } }
            );
        }
    }, [isOpen, id]);

    useEffect(() => {
        if (detail) {
            reset({
                hari: detail.hari || "Senin",
                jam_awal: detail.jam_awal || "",
                jam_akhir: detail.jam_akhir || "",
                id_category_schendule_time: detail.id_category_schendule_time || "",
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
                    <h2 className="text-xl font-bold text-primary-txt">Edit Schedule Time Slot</h2>
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
                            <Controller name="hari" control={control} render={({ field }) => (
                                <TextField {...field} label="Hari" select fullWidth size="small" error={!!errors.hari} helperText={errors.hari?.message}>
                                    {DAYS.map((day) => (
                                        <MenuItem key={day} value={day}>{day}</MenuItem>
                                    ))}
                                </TextField>
                            )} />

                            <div className="grid grid-cols-2 gap-4">
                                <Controller name="jam_awal" control={control} render={({ field }) => (
                                    <TextField {...field} label="Jam Awal" fullWidth size="small" error={!!errors.jam_awal} helperText={errors.jam_awal?.message} />
                                )} />
                                <Controller name="jam_akhir" control={control} render={({ field }) => (
                                    <TextField {...field} label="Jam Akhir" fullWidth size="small" error={!!errors.jam_akhir} helperText={errors.jam_akhir?.message} />
                                )} />
                            </div>

                            <Controller name="id_category_schendule_time" control={control} render={({ field }) => (
                                <TextField {...field} label="Category Schedule Time" select fullWidth size="small" error={!!errors.id_category_schendule_time} helperText={errors.id_category_schendule_time?.message}>
                                    {categories.map((c) => (
                                        <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                                    ))}
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

export default UpdateScheduleTimeFormCardDialog;
