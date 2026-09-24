import { useState } from "react";
import ClassroomService from "@api/classroom/service";
import type { ClassroomResponseModel, UpdateClassroomRequest } from "@api/classroom/model";
import { useSnackbar } from "notistack";

const useUpdateClassroom = (id: string) => {
    const { enqueueSnackbar } = useSnackbar();
    const [detail, setDetail] = useState<ClassroomResponseModel | null>(null);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);

    const fetchDetail = async () => {
        if (!id) return;
        setIsLoadingDetail(true);
        await new ClassroomService().getById(id, { onSuccess: (res: any) => {
                        setDetail(res.data);
                        setIsLoadingDetail(false);
                    }, onError: (err: any) => {
                        enqueueSnackbar(err.message || "Failed to fetch classroom details", { variant: "error" });
                        setIsLoadingDetail(false);
                    } });
    };

    const handleUpdate = async (payload: UpdateClassroomRequest, onSuccess?: () => void) => {
        await new ClassroomService().update(id, payload, { onSuccess: () => {
                        enqueueSnackbar("Classroom updated successfully", { variant: "success" });
                        if (onSuccess) onSuccess();
                    }, onError: (err: any) => {
                        enqueueSnackbar(err.message || "Failed to update classroom", { variant: "error" });
                    } });
    };

    return {
        detail,
        isLoadingDetail,
        fetchDetail,
        handleUpdate,
    };
};

export default useUpdateClassroom;
