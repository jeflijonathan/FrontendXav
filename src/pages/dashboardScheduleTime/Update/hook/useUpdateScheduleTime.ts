import { useState } from "react";
import { ScheduleTimeService } from "@api/schedule/service";
import { type ScheduleTimeResponseModel, type UpdateScheduleTimeRequest } from "@api/schedule/model";
import { useSnackbar } from "notistack";

const useUpdateScheduleTime = (id: string) => {
    const { enqueueSnackbar } = useSnackbar();
    const [detail, setDetail] = useState<ScheduleTimeResponseModel | null>(null);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);

    const fetchDetail = async () => {
        if (!id) return;
        setIsLoadingDetail(true);
        await new ScheduleTimeService().getById(id, { onSuccess: (res: any) => {
                        setDetail(res.data);
                        setIsLoadingDetail(false);
                    }, onError: (err: any) => {
                        enqueueSnackbar(err.message || "Failed to fetch details", { variant: "error" });
                        setIsLoadingDetail(false);
                    } });
    };

    const handleUpdate = async (payload: UpdateScheduleTimeRequest, onSuccess?: () => void) => {
        await new ScheduleTimeService().update(id, payload, { onSuccess: () => {
                        enqueueSnackbar("Schedule time updated successfully", { variant: "success" });
                        if (onSuccess) onSuccess();
                    }, onError: (err: any) => {
                        enqueueSnackbar(err.message || "Failed to update schedule time", { variant: "error" });
                    } });
    };

    return {
        detail,
        isLoadingDetail,
        fetchDetail,
        handleUpdate,
    };
};

export default useUpdateScheduleTime;
