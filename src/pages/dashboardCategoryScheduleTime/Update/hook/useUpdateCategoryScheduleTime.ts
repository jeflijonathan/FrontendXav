import { useState } from "react";
import { CategoryScheduleTimeService } from "@api/schedule/service";
import type { CategoryScheduleTimeResponseModel, UpdateCategoryScheduleTimeRequest } from "@api/schedule/model";
import { useSnackbar } from "notistack";

const useUpdateCategoryScheduleTime = (id: string) => {
    const { enqueueSnackbar } = useSnackbar();
    const [detail, setDetail] = useState<CategoryScheduleTimeResponseModel | null>(null);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);

    const fetchDetail = async () => {
        if (!id) return;
        setIsLoadingDetail(true);
        await new CategoryScheduleTimeService().getById(id, { onSuccess: (res: any) => {
                        setDetail(res.data);
                        setIsLoadingDetail(false);
                    }, onError: (err: any) => {
                        enqueueSnackbar(err.message || "Failed to fetch details", { variant: "error" });
                        setIsLoadingDetail(false);
                    } });
    };

    const handleUpdate = async (payload: UpdateCategoryScheduleTimeRequest, onSuccess?: () => void) => {
        await new CategoryScheduleTimeService().update(id, payload, { onSuccess: () => {
                        enqueueSnackbar("Category schedule time updated successfully", { variant: "success" });
                        if (onSuccess) onSuccess();
                    }, onError: (err: any) => {
                        enqueueSnackbar(err.message || "Failed to update category schedule time", { variant: "error" });
                    } });
    };

    return {
        detail,
        isLoadingDetail,
        fetchDetail,
        handleUpdate,
    };
};

export default useUpdateCategoryScheduleTime;
