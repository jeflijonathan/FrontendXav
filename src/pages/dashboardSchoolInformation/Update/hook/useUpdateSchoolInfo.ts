import { useState } from "react";
import SchoolInformationService from "@api/schoolinformation/service";
import type { SchoolInformationResponseModel, UpdateSchoolInformationRequest } from "@api/schoolinformation/model";
import { useSnackbar } from "notistack";

const useUpdateSchoolInfo = (id: string) => {
    const { enqueueSnackbar } = useSnackbar();
    const [detail, setDetail] = useState<SchoolInformationResponseModel | null>(null);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);

    const fetchDetail = async () => {
        if (!id) return;
        setIsLoadingDetail(true);
        await new SchoolInformationService().getById(id, { onSuccess: (res: any) => {
                        setDetail(res.data);
                        setIsLoadingDetail(false);
                    }, onError: (err: any) => {
                        enqueueSnackbar(err.message || "Failed to fetch details", { variant: "error" });
                        setIsLoadingDetail(false);
                    } });
    };

    const handleUpdate = async (payload: UpdateSchoolInformationRequest, onSuccess?: () => void) => {
        await new SchoolInformationService().update(id, payload, { onSuccess: () => {
                        enqueueSnackbar("School information updated successfully", { variant: "success" });
                        if (onSuccess) onSuccess();
                    }, onError: (err: any) => {
                        enqueueSnackbar(err.message || "Failed to update school information", { variant: "error" });
                    } });
    };

    return {
        detail,
        isLoadingDetail,
        fetchDetail,
        handleUpdate,
    };
};

export default useUpdateSchoolInfo;
