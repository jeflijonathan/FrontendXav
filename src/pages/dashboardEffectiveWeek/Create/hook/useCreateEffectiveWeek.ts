import EffectiveWeekService from "@api/effectiveweek/service";
import type { CreateEffectiveWeekRequest } from "@api/effectiveweek/model";
import { useSnackbar } from "notistack";

const useCreateEffectiveWeek = () => {
    const { enqueueSnackbar } = useSnackbar();

    const handleCreate = async (payload: CreateEffectiveWeekRequest, onSuccess?: () => void) => {
        await new EffectiveWeekService().create(payload, { onSuccess: () => {
                        enqueueSnackbar("Effective Week created successfully", { variant: "success" });
                        if (onSuccess) onSuccess();
                    }, onError: (err: any) => {
                        enqueueSnackbar(err.message || "Failed to create effective week", { variant: "error" });
                    } });
    };

    return { handleCreate };
};

export default useCreateEffectiveWeek;
