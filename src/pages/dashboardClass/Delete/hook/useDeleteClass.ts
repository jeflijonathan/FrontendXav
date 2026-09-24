import ClassService from "@api/class/service";
import { useSnackbar } from "notistack";

const useDeleteClass = () => {
    const { enqueueSnackbar } = useSnackbar();

    const handleDelete = async (id: string, onSuccess?: () => void) => {
        if (window.confirm("Are you sure you want to delete this class?")) {
            const svc = new ClassService();
            await svc.delete(id, {
                onSuccess: () => {
                    enqueueSnackbar("Class deleted successfully", { variant: "success" });
                    if (onSuccess) onSuccess();
                },
                onError: (err: any) => {
                    enqueueSnackbar(typeof err === 'string' ? err : "Failed to delete class", { variant: "error" });
                },
            });
        }
    };

    return { handleDelete };
};

export default useDeleteClass;
