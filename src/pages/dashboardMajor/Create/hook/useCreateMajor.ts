import MajorService from "@api/major/service";
import { type CreateMajorRequest } from "@api/major/model";
import { useSnackbar } from "notistack";

const useCreateMajor = () => {
    const { enqueueSnackbar } = useSnackbar();

    const handleCreate = async (payload: CreateMajorRequest, onSuccess?: () => void) => {
        const svc = new MajorService();
        await svc.create(payload, {
            onSuccess: () => {
                enqueueSnackbar("Major created successfully", { variant: "success" });
                if (onSuccess) onSuccess();
            },
            onError: (err: any) => {
                enqueueSnackbar(typeof err === 'string' ? err : "Failed to create major", { variant: "error" });
            },
        });
    };

    return { handleCreate };
};

export default useCreateMajor;
