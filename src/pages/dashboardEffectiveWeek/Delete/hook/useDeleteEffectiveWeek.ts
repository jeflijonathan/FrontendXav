import EffectiveWeekService from "@api/effectiveweek/service";
import { useSnackbar } from "notistack";

const useDeleteEffectiveWeek = () => {
    const { enqueueSnackbar } = useSnackbar();

    const handleDelete = async (id: string, onSuccess?: () => void) => {
        if (window.confirm("Are you sure you want to delete this effective week?")) {
            await new EffectiveWeekService().delete(id, { onSuccess: () => {
                                enqueueSnackbar("Effective Week deleted successfully", { variant: "success" });
                                if (onSuccess) onSuccess();
                            }, onError: (err: any) => {
                                enqueueSnackbar(err.message || "Failed to delete effective week", { variant: "error" });
                            } });
        }
    };

    return { handleDelete };
};

export default useDeleteEffectiveWeek;
