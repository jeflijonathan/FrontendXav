import { useEffect } from "react";
import { Button, TextField, MenuItem, CircularProgress } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useUpdateCategoryScheduleTime from "./hook/useUpdateCategoryScheduleTime";

const schema = yup.object({
    name: yup.string().required("Category name is required"),
    status: yup.string().required("Status is required"),
}).required();

type FormData = yup.InferType<typeof schema>;

const UpdateCategoryScheduleTimeFormCardDialog = ({ id, isOpen, onClose }: { id: string; isOpen: boolean; onClose: () => void }) => {
    const { detail, isLoadingDetail, fetchDetail, handleUpdate } = useUpdateCategoryScheduleTime(id);

    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            name: "",
            status: "active",
        }
    });

    useEffect(() => {
        if (isOpen && id) {
            fetchDetail();
        }
    }, [isOpen, id]);

    useEffect(() => {
        if (detail) {
            reset({
                name: detail.name || "",
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
                    <h2 className="text-xl font-bold text-primary-txt">Edit Category Schedule Time</h2>
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
                            <Controller name="name" control={control} render={({ field }) => (
                                <TextField {...field} label="Category Name" fullWidth size="small" error={!!errors.name} helperText={errors.name?.message} />
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

export default UpdateCategoryScheduleTimeFormCardDialog;
