import { useState } from "react";
import TeacherSubjectService from "@api/teachersubject/service";
import type { TeacherSubjectResponseModel, UpdateTeacherSubjectRequest } from "@api/teachersubject/model";
import { useSnackbar } from "notistack";

const useUpdateTeacherSubject = (id: string) => {
    const { enqueueSnackbar } = useSnackbar();
    const [detail, setDetail] = useState<TeacherSubjectResponseModel | null>(null);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);

    const fetchDetail = async () => {
        if (!id) return;
        setIsLoadingDetail(true);
        await new TeacherSubjectService().getById(id, { onSuccess: (res: any) => {
                        setDetail(res.data);
                        setIsLoadingDetail(false);
                    }, onError: (err: any) => {
                        enqueueSnackbar(err.message || "Failed to fetch details", { variant: "error" });
                        setIsLoadingDetail(false);
                    } });
    };

    const handleUpdate = async (payload: UpdateTeacherSubjectRequest, onSuccess?: () => void) => {
        await new TeacherSubjectService().update(id, payload, { onSuccess: () => {
                        enqueueSnackbar("Teacher Subject updated successfully", { variant: "success" });
                        if (onSuccess) onSuccess();
                    }, onError: (err: any) => {
                        enqueueSnackbar(err.message || "Failed to update teacher subject", { variant: "error" });
                    } });
    };

    return {
        detail,
        isLoadingDetail,
        fetchDetail,
        handleUpdate,
    };
};

export default useUpdateTeacherSubject;
