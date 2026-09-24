import TeacherSubjectService from "@api/teachersubject/service";
import type { CreateTeacherSubjectRequest } from "@api/teachersubject/model";
import { useSnackbar } from "notistack";

const useCreateTeacherSubject = () => {
    const { enqueueSnackbar } = useSnackbar();

    const handleCreate = async (payload: CreateTeacherSubjectRequest, onSuccess?: () => void) => {
        await new TeacherSubjectService().create(payload, { onSuccess: () => {
                        enqueueSnackbar("Teacher Subject created successfully", { variant: "success" });
                        if (onSuccess) onSuccess();
                    }, onError: (err: any) => {
                        enqueueSnackbar(err.message || "Failed to create teacher subject", { variant: "error" });
                    } });
    };

    return { handleCreate };
};

export default useCreateTeacherSubject;
