import SubjectService from "@api/subject/service";
import useDashboardSubjectStore from "../../store";
import useNotificationStore from "@common/store/useNotificationStore";

const useCreateSubject = () => {
    const service = new SubjectService();
    const { setState } = useDashboardSubjectStore();
    const addNotification = useNotificationStore((s) => s.addNotification);

    const handleCreate = async (data: any, onSuccessCallback?: () => void) => {
        setState({ isLoading: true });
        await service.createSubjectRequest(data, {
            onSuccess: () => {
                addNotification("Subject created successfully!", "success");
                if(onSuccessCallback) onSuccessCallback();
            },
            onError: (err) => {
                addNotification("Failed to create Subject.", "error");
                console.error(err);
            },
            onFullfilled: () => {
                setState({ isLoading: false });
            }
        });
    };

    return { handleCreate };
};

export default useCreateSubject;
