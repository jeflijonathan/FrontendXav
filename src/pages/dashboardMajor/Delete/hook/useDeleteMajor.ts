import MajorService from "@api/major/service";
import { useSnackbar } from "notistack";

const useDeleteMajor = () => {
    const { enqueueSnackbar } = useSnackbar();

    const handleDelete = async (id: string, onSuccess?: () => void) => {
        if (window.confirm("Are you sure you want to delete this major?")) {
            const svc = new MajorService();
            await svc.delete(id, {
                onSuccess: () => {
                    enqueueSnackbar("Major deleted successfully", { variant: "success" });
                    if (onSuccess) onSuccess();
                },
                onError: (err: any) => {
                    enqueueSnackbar(typeof err === 'string' ? err : "Failed to delete major", { variant: "error" });
                },
            });
        }
    };

    return { handleDelete };
};

export default useDeleteMajor;
