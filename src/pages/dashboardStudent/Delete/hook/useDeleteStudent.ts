import StudentService from "@api/student/service";
import useDashboardStudentStore from "../../store";
import useNotificationStore from "@common/store/useNotificationStore";

const useDeleteStudent = () => {
    const service = new StudentService();
    const { setState } = useDashboardStudentStore();
    const addNotification = useNotificationStore((s) => s.addNotification);

    const handleDelete = async (id: string, onSuccessCallback?: () => void) => {
        if(!window.confirm("Are you sure you want to delete this Student?")) return;
        
        setState({ isLoading: true });
        await service.deleteStudentRequest(id, {
            onSuccess: () => {
                addNotification("Student deleted successfully!", "success");
                if(onSuccessCallback) onSuccessCallback();
            },
            onError: (err: any) => {
                addNotification("Failed to delete Student.", "error");
                console.error(err);
            },
            onFullfilled: () => {
                setState({ isLoading: false });
            }
        });
    };

    return { handleDelete };
};

export default useDeleteStudent;
