import { CategoryScheduleTimeService } from "@api/schedule/service";
import type { CreateCategoryScheduleTimeRequest } from "@api/schedule/model";
import { useSnackbar } from "notistack";

const useCreateCategoryScheduleTime = () => {
    const { enqueueSnackbar } = useSnackbar();

    const handleCreate = async (payload: CreateCategoryScheduleTimeRequest, onSuccess?: () => void) => {
        await new CategoryScheduleTimeService().create(payload, { onSuccess: () => {
                        enqueueSnackbar("Category schedule time created successfully", { variant: "success" });
                        if (onSuccess) onSuccess();
                    }, onError: (err: any) => {
                        enqueueSnackbar(err.message || "Failed to create category schedule time", { variant: "error" });
                    } });
    };

    return { handleCreate };
};

export default useCreateCategoryScheduleTime;
