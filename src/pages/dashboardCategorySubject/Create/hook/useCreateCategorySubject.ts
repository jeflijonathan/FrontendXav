import CategorySubjectService from "@api/categorysubject/service";
import useDashboardCategorySubjectStore from "../../store";
import { useSnackbar } from "notistack";

const useCreateCategorySubject = () => {
    const service = new CategorySubjectService();
    const { setState } = useDashboardCategorySubjectStore();
    const { enqueueSnackbar } = useSnackbar();

    const handleCreate = async (data: any, onSuccessCallback?: () => void) => {
        setState({ isLoading: true });
        await service.createCategorySubjectRequest(data, {
            onSuccess: () => {
                enqueueSnackbar("Category Subject created successfully!", { variant: "success" });
                if(onSuccessCallback) onSuccessCallback();
            },
            onError: (err: any) => {
                enqueueSnackbar(err || "Failed to create Category Subject.", { variant: "error" });
                console.error(err);
            },
            onFullfilled: () => setState({ isLoading: false })
        });
    };
    return { handleCreate };
};
export default useCreateCategorySubject;
