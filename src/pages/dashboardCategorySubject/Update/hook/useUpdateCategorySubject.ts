import CategorySubjectService from "@api/categorysubject/service";
import useDashboardCategorySubjectStore from "../../store";
import { useSnackbar } from "notistack";

const useUpdateCategorySubject = () => {
    const service = new CategorySubjectService();
    const { setState } = useDashboardCategorySubjectStore();
    const { enqueueSnackbar } = useSnackbar();

    const handleUpdate = async (id: string, data: any, onSuccessCallback?: () => void) => {
        setState({ isLoading: true });
        await service.updateCategorySubjectRequest(id, data, {
            onSuccess: () => {
                enqueueSnackbar("Category Subject updated successfully!", { variant: "success" });
                if(onSuccessCallback) onSuccessCallback();
            },
            onError: (err: any) => {
                enqueueSnackbar(err || "Failed to update Category Subject.", { variant: "error" });
                console.error(err);
            },
            onFullfilled: () => setState({ isLoading: false })
        });
    };
    return { handleUpdate };
};
export default useUpdateCategorySubject;
