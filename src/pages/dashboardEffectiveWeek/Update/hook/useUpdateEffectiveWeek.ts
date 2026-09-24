import { useState } from "react";
import EffectiveWeekService from "@api/effectiveweek/service";
import type { EffectiveWeekResponseModel, UpdateEffectiveWeekRequest } from "@api/effectiveweek/model";
import { useSnackbar } from "notistack";

const useUpdateEffectiveWeek = (id: string) => {
    const { enqueueSnackbar } = useSnackbar();
    const [detail, setDetail] = useState<EffectiveWeekResponseModel | null>(null);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);

    const fetchDetail = async () => {
        if (!id) return;
        setIsLoadingDetail(true);
        await new EffectiveWeekService().getById(id, { onSuccess: (res: any) => {
                        setDetail(res.data);
                        setIsLoadingDetail(false);
                    }, onError: (err: any) => {
                        enqueueSnackbar(err.message || "Failed to fetch details", { variant: "error" });
                        setIsLoadingDetail(false);
                    } });
    };

    const handleUpdate = async (payload: UpdateEffectiveWeekRequest, onSuccess?: () => void) => {
        await new EffectiveWeekService().update(id, payload, { onSuccess: () => {
                        enqueueSnackbar("Effective Week updated successfully", { variant: "success" });
                        if (onSuccess) onSuccess();
                    }, onError: (err: any) => {
                        enqueueSnackbar(err.message || "Failed to update effective week", { variant: "error" });
                    } });
    };

    return {
        detail,
        isLoadingDetail,
        fetchDetail,
        handleUpdate,
    };
};

export default useUpdateEffectiveWeek;
