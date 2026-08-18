import StudentService from "@api/student/service";
import useDashboardStudentStore from "../../store";
import useNotificationStore from "@common/store/useNotificationStore";

const useCreateStudent = () => {
    const service = new StudentService();
    const { setState } = useDashboardStudentStore();
    const addNotification = useNotificationStore((s) => s.addNotification);

    const handleCreate = async (data: any, onSuccessCallback?: () => void) => {
        setState({ isLoading: true });
        await service.createStudentRequest(data, {
            onSuccess: () => {
                addNotification("Student created successfully!", "success");
                if(onSuccessCallback) onSuccessCallback();
            },
            onError: (err) => {
                addNotification("Failed to create Student.", "error");
                console.error(err);
            },
            onFullfilled: () => {
                setState({ isLoading: false });
            }
        });
    };

    return { handleCreate };
};

export default useCreateStudent;
