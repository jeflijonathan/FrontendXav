import ClassService from "@api/class/service";
import { useSnackbar } from "notistack";
import { type CreateClassRequest } from "@api/class/model";

const useCreateClass = () => {
    const { enqueueSnackbar } = useSnackbar();

    const handleCreate = async (payload: CreateClassRequest, onSuccess?: () => void) => {
        const svc = new ClassService();
        await svc.create(payload, {
            onSuccess: () => {
                enqueueSnackbar("Class created successfully", { variant: "success" });
                if (onSuccess) onSuccess();
            },
            onError: (err: any) => {
                enqueueSnackbar(typeof err === 'string' ? err : "Failed to create class", { variant: "error" });
            },
        });
    };

    return { handleCreate };
};

export default useCreateClass;
