import SubjectService from "@api/subject/service";
import useDashboardSubjectStore from "../../store";
import useNotificationStore from "@common/store/useNotificationStore";

const useUpdateSubject = () => {
    const service = new SubjectService();
    const { setState } = useDashboardSubjectStore();
    const addNotification = useNotificationStore((s) => s.addNotification);

    const handleUpdate = async (id: string, data: any, onSuccessCallback?: () => void) => {
        setState({ isLoading: true });
        await service.updateSubjectRequest(id, data, {
            onSuccess: () => {
                addNotification("Subject updated successfully!", "success");
                if(onSuccessCallback) onSuccessCallback();
            },
            onError: (err: any) => {
                addNotification("Failed to update Subject.", "error");
                console.error(err);
            },
            onFullfilled: () => {
                setState({ isLoading: false });
            }
        });
    };

    return { handleUpdate };
};

export default useUpdateSubject;
