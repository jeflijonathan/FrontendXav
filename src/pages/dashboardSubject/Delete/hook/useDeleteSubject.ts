import SubjectService from "@api/subject/service";
import useDashboardSubjectStore from "../../store";
import useNotificationStore from "@common/store/useNotificationStore";

const useDeleteSubject = () => {
    const service = new SubjectService();
    const { setState } = useDashboardSubjectStore();
    const addNotification = useNotificationStore((s) => s.addNotification);

    const handleDelete = async (id: string, onSuccessCallback?: () => void) => {
        if(!window.confirm("Are you sure you want to delete this Subject?")) return;
        
        setState({ isLoading: true });
        await service.deleteSubjectRequest(id, {
            onSuccess: () => {
                addNotification("Subject deleted successfully!", "success");
                if(onSuccessCallback) onSuccessCallback();
            },
            onError: (err) => {
                addNotification("Failed to delete Subject.", "error");
                console.error(err);
            },
            onFullfilled: () => {
                setState({ isLoading: false });
            }
        });
    };

    return { handleDelete };
};

export default useDeleteSubject;
