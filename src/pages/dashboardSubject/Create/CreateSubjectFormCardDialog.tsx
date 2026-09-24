import { useEffect, useState } from "react";
import { Button, TextField, Autocomplete } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useCreateSubject from "./hook/useCreateSubject";
import CategorySubjectService from "@api/categorysubject/service";

const schema = yup.object({
    name: yup.string().required("Subject Name is required"),
    category_subject_id: yup.string().required("Category Subject is required").nullable(),
}).required();

type FormData = yup.InferType<typeof schema>;

const CreateSubjectFormCardDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const { handleCreate } = useCreateSubject();
    const [options, setOptions] = useState<{ id: string, name: string }[]>([]);
    
    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            name: "",
            category_subject_id: null
        }
    });

    useEffect(() => {
        if (isOpen) {
            reset();
            const service = new CategorySubjectService();
            service.getCategorySubjectOptionsRequest({
                onSuccess: (data) => setOptions(data),
                onError: (err: any) => console.error("Failed to load options", err)
            });
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
                className="bg-theme-primary border border-light-dark rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-6 border-b border-light-dark">
                    <h2 className="text-xl font-bold text-primary-txt">Create Subject</h2>
                    <button onClick={onClose} className="text-secondary-txt hover:text-primary-txt transition-colors">
                        <Close />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="contents">
                    <div className="p-6 space-y-5">
                        <div className="space-y-4">
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <TextField 
                                        {...field}
                                        label="Subject Name" 
                                        fullWidth 
                                        size="small" 
                                        error={!!errors.name}
                                        helperText={errors.name?.message}
                                    />
                                )}
                            />
                            <Controller
                                name="category_subject_id"
                                control={control}
                                render={({ field: { onChange, value, ref, ...field } }) => {
                                    const selectedOption = options.find(opt => opt.id === value) || null;
                                    return (
                                        <Autocomplete
                                            {...field}
                                            options={options}
                                            getOptionLabel={(option) => option.name}
                                            value={selectedOption}
                                            onChange={(_, newValue) => onChange(newValue ? newValue.id : null)}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Category Subject"
                                                    size="small"
                                                    error={!!errors.category_subject_id}
                                                    helperText={errors.category_subject_id?.message}
                                                    inputRef={ref}
                                                />
                                            )}
                                        />
                                    );
                                }}
                            />
                        </div>
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

export default CreateSubjectFormCardDialog;
