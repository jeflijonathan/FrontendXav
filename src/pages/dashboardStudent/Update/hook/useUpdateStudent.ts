import StudentService from "@api/student/service";
import useDashboardStudentStore from "../../store";
import useNotificationStore from "@common/store/useNotificationStore";

const useUpdateStudent = () => {
    const service = new StudentService();
    const { setState } = useDashboardStudentStore();
    const addNotification = useNotificationStore((s) => s.addNotification);

    const handleUpdate = async (id: string, data: any, onSuccessCallback?: () => void) => {
        setState({ isLoading: true });
        await service.updateStudentRequest(id, data, {
            onSuccess: () => {
                addNotification("Student updated successfully!", "success");
                if(onSuccessCallback) onSuccessCallback();
            },
            onError: (err) => {
                addNotification("Failed to update Student.", "error");
                console.error(err);
            },
            onFullfilled: () => {
                setState({ isLoading: false });
            }
        });
    };

    return { handleUpdate };
};

export default useUpdateStudent;
