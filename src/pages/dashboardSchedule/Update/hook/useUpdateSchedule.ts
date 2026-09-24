import { useState } from "react";
import ScheduleService from "@api/schedule/service";
import { type ScheduleResponseModel, type UpdateScheduleRequest } from "@api/schedule/model";
import { useSnackbar } from "notistack";

const useUpdateSchedule = (id: string) => {
    const { enqueueSnackbar } = useSnackbar();
    const [detail, setDetail] = useState<ScheduleResponseModel | null>(null);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);

    const fetchDetail = async () => {
        if (!id) return;
        setIsLoadingDetail(true);
        const svc = new ScheduleService();
        await svc.getAll(
            {
                onSuccess: (res: any) => {
                    const found = (res.data || []).find((m: ScheduleResponseModel) => m.id_schendule === id);
                    setDetail(found || null);
                    setIsLoadingDetail(false);
                }, onError: (err: any) => {
                    enqueueSnackbar(typeof err === 'string' ? err : "Failed to fetch details", { variant: "error" });
                    setIsLoadingDetail(false);
                }
            },
            { params: { page: 1, limit: 1000 } }
        );
    };

    const handleUpdate = async (payload: UpdateScheduleRequest, onSuccess?: () => void) => {
        await new ScheduleService().update(id, payload, { onSuccess: () => {
                        enqueueSnackbar("Schedule updated successfully", { variant: "success" });
                        if (onSuccess) onSuccess();
                    }, onError: (err: any) => {
                        enqueueSnackbar(err.message || "Failed to update schedule", { variant: "error" });
                    } });
    };

    return {
        detail,
        isLoadingDetail,
        fetchDetail,
        handleUpdate,
    };
};

export default useUpdateSchedule;
