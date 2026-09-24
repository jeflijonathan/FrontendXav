import ClassroomService from "@api/classroom/service";
import { useSnackbar } from "notistack";

const useDeleteClassroom = () => {
    const { enqueueSnackbar } = useSnackbar();

    const handleDelete = async (id: string, onSuccess?: () => void) => {
        if (window.confirm("Are you sure you want to delete this classroom?")) {
            await new ClassroomService().delete(id, { onSuccess: () => {
                                enqueueSnackbar("Classroom deleted successfully", { variant: "success" });
                                if (onSuccess) onSuccess();
                            }, onError: (err: any) => {
                                enqueueSnackbar(err.message || "Failed to delete classroom", { variant: "error" });
                            } });
        }
    };

    return { handleDelete };
};

export default useDeleteClassroom;
