import { ScheduleTimeService } from "@api/schedule/service";
import { useSnackbar } from "notistack";

const useDeleteScheduleTime = () => {
    const { enqueueSnackbar } = useSnackbar();

    const handleDelete = async (id: string, onSuccess?: () => void) => {
        if (window.confirm("Are you sure you want to delete this schedule time?")) {
            await new ScheduleTimeService().delete(id, { onSuccess: () => {
                                enqueueSnackbar("Schedule time deleted successfully", { variant: "success" });
                                if (onSuccess) onSuccess();
                            }, onError: (err: any) => {
                                enqueueSnackbar(err.message || "Failed to delete schedule time", { variant: "error" });
                            } });
        }
    };

    return { handleDelete };
};

export default useDeleteScheduleTime;
