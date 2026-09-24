import { ScheduleTimeService } from "@api/schedule/service";
import type { CreateScheduleTimeRequest } from "@api/schedule/model";
import { useSnackbar } from "notistack";

const useCreateScheduleTime = () => {
    const { enqueueSnackbar } = useSnackbar();

    const handleCreate = async (payload: CreateScheduleTimeRequest, onSuccess?: () => void) => {
        await new ScheduleTimeService().create(payload, { onSuccess: () => {
                        enqueueSnackbar("Schedule time created successfully", { variant: "success" });
                        if (onSuccess) onSuccess();
                    }, onError: (err: any) => {
                        enqueueSnackbar(err.message || "Failed to create schedule time", { variant: "error" });
                    } });
    };

    return { handleCreate };
};

export default useCreateScheduleTime;
