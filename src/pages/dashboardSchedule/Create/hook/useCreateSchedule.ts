import ScheduleService from "@api/schedule/service";
import type { CreateScheduleRequest } from "@api/schedule/model";
import { useSnackbar } from "notistack";

const useCreateSchedule = () => {
    const { enqueueSnackbar } = useSnackbar();

    const handleCreate = async (payload: CreateScheduleRequest, onSuccess?: () => void) => {
        await new ScheduleService().create(payload, { onSuccess: () => {
                        enqueueSnackbar("Schedule created successfully", { variant: "success" });
                        if (onSuccess) onSuccess();
                    }, onError: (err: any) => {
                        enqueueSnackbar(err.message || "Failed to create schedule", { variant: "error" });
                    } });
    };

    return { handleCreate };
};

export default useCreateSchedule;
