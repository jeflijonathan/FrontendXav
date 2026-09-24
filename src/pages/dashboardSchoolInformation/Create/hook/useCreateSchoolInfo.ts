import SchoolInformationService from "@api/schoolinformation/service";
import { type CreateSchoolInformationRequest } from "@api/schoolinformation/model";
import { useSnackbar } from "notistack";

const useCreateSchoolInfo = () => {
    const { enqueueSnackbar } = useSnackbar();

    const handleCreate = async (payload: CreateSchoolInformationRequest, onSuccess?: () => void) => {
        await new SchoolInformationService().create(payload, { onSuccess: () => {
                        enqueueSnackbar("School information created successfully", { variant: "success" });
                        if (onSuccess) onSuccess();
                    }, onError: (err: any) => {
                        enqueueSnackbar(err.message || "Failed to create school information", { variant: "error" });
                    } });
    };

    return { handleCreate };
};

export default useCreateSchoolInfo;
