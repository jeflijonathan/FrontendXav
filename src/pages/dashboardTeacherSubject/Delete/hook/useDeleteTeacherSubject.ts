import TeacherSubjectService from "@api/teachersubject/service";
import { useSnackbar } from "notistack";

const useDeleteTeacherSubject = () => {
    const { enqueueSnackbar } = useSnackbar();

    const handleDelete = async (id: string, onSuccess?: () => void) => {
        if (window.confirm("Are you sure you want to delete this teacher subject?")) {
            await new TeacherSubjectService().delete(id, { onSuccess: () => {
                                enqueueSnackbar("Teacher Subject deleted successfully", { variant: "success" });
                                if (onSuccess) onSuccess();
                            }, onError: (err: any) => {
                                enqueueSnackbar(err.message || "Failed to delete teacher subject", { variant: "error" });
                            } });
        }
    };

    return { handleDelete };
};

export default useDeleteTeacherSubject;
