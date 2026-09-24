import ClassroomService from "@api/classroom/service";
import type { CreateClassroomRequest } from "@api/classroom/model";
import { useSnackbar } from "notistack";

const useCreateClassroom = () => {
    const { enqueueSnackbar } = useSnackbar();

    const handleCreate = async (payload: CreateClassroomRequest, onSuccess?: () => void) => {
        await new ClassroomService().create(payload, { onSuccess: () => {
                        enqueueSnackbar("Classroom created successfully", { variant: "success" });
                        if (onSuccess) onSuccess();
                    }, onError: (err: any) => {
                        enqueueSnackbar(err.message || "Failed to create classroom", { variant: "error" });
                    } });
    };

    return { handleCreate };
};

export default useCreateClassroom;
