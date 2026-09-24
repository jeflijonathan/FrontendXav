import CategorySubjectService from "@api/categorysubject/service";
import useDashboardCategorySubjectStore from "../../store";
import { useSnackbar } from "notistack";

const useDeleteCategorySubject = () => {
    const service = new CategorySubjectService();
    const { setState } = useDashboardCategorySubjectStore();
    const { enqueueSnackbar } = useSnackbar();

    const handleDelete = async (id: string, onSuccessCallback?: () => void) => {
        if(!window.confirm("Are you sure you want to delete this Category Subject?")) return;
        setState({ isLoading: true });
        await service.deleteCategorySubjectRequest(id, {
            onSuccess: () => {
                enqueueSnackbar("Category Subject deleted successfully!", { variant: "success" });
                if(onSuccessCallback) onSuccessCallback();
            },
            onError: (err: any) => {
                enqueueSnackbar("Failed to delete Category Subject.", { variant: "error" });
                console.error(err);
            },
            onFullfilled: () => setState({ isLoading: false })
        });
    };
    return { handleDelete };
};
export default useDeleteCategorySubject;
