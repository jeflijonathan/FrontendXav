import ScheduleService from "@api/schedule/service";
import { useSnackbar } from "notistack";

const useDeleteSchedule = () => {
    const { enqueueSnackbar } = useSnackbar();

    const handleDelete = async (id: string, onSuccess?: () => void) => {
        if (window.confirm("Are you sure you want to delete this schedule?")) {
            await new ScheduleService().delete(id, { onSuccess: () => {
                                enqueueSnackbar("Schedule deleted successfully", { variant: "success" });
                                if (onSuccess) onSuccess();
                            }, onError: (err: any) => {
                                enqueueSnackbar(err.message || "Failed to delete schedule", { variant: "error" });
                            } });
        }
    };

    return { handleDelete };
};

export default useDeleteSchedule;
