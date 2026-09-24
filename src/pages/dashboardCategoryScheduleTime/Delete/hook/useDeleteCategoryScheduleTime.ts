import { CategoryScheduleTimeService } from "@api/schedule/service";
import { useSnackbar } from "notistack";

const useDeleteCategoryScheduleTime = () => {
    const { enqueueSnackbar } = useSnackbar();

    const handleDelete = async (id: string, onSuccess?: () => void) => {
        if (window.confirm("Are you sure you want to delete this category schedule time?")) {
            await new CategoryScheduleTimeService().delete(id, { onSuccess: () => {
                                enqueueSnackbar("Category schedule time deleted successfully", { variant: "success" });
                                if (onSuccess) onSuccess();
                            }, onError: (err: any) => {
                                enqueueSnackbar(err.message || "Failed to delete category schedule time", { variant: "error" });
                            } });
        }
    };

    return { handleDelete };
};

export default useDeleteCategoryScheduleTime;
