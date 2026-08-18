import { useEffect } from "react";
import { Button, TextField, MenuItem } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useCreateCategorySubject from "./hook/useCreateCategorySubject";

const schema = yup.object({
    name: yup.string().required("Category Name is required"),
    status: yup.string().required("Status is required"),
}).required();

type FormData = yup.InferType<typeof schema>;

const CreateCategorySubjectFormCardDialog = ({ isOpen, onClose, onSuccess }: { isOpen: boolean, onClose: () => void, onSuccess?: () => void }) => {
    const { handleCreate } = useCreateCategorySubject();
    
    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            name: "",
            status: "true"
        }
    });

    useEffect(() => {
        if (isOpen) {
            reset();
        }
    }, [isOpen, reset]);

    const onSubmit = (data: FormData) => {
        const payload = {
            ...data,
            status: data.status === "true"
        };
        handleCreate(payload, () => {
            if (onSuccess) onSuccess();
            onClose();
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", backgroundColor: "rgba(0,0,0,0.4)" }} onClick={onClose}>
            <div className="bg-theme-primary border border-light-dark rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto mx-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-6 border-b border-light-dark">
                    <h2 className="text-xl font-bold text-primary-txt">Create Category Subject</h2>
                    <button onClick={onClose} className="text-secondary-txt hover:text-primary-txt transition-colors"><Close /></button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="contents">
                    <div className="p-6 space-y-7">
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <TextField 
                                    {...field}
                                    label="Category Name" 
                                    fullWidth 
                                    size="small" 
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                />
                            )}
                        />
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <TextField 
                                    {...field}
                                    label="Status" 
                                    fullWidth 
                                    size="small" 
                                    select 
                                    error={!!errors.status}
                                    helperText={errors.status?.message}
                                >
                                    <MenuItem value="true">Aktif</MenuItem>
                                    <MenuItem value="false">Tidak Aktif</MenuItem>
                                </TextField>
                            )}
                        />
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
export default CreateCategorySubjectFormCardDialog;
