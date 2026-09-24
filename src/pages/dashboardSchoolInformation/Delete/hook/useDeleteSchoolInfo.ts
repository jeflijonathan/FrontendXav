import SchoolInformationService from "@api/schoolinformation/service";
import { useSnackbar } from "notistack";

const useDeleteSchoolInfo = () => {
    const { enqueueSnackbar } = useSnackbar();

    const handleDelete = async (id: string, onSuccess?: () => void) => {
        if (window.confirm("Are you sure you want to delete this school information?")) {
            await new SchoolInformationService().delete(id, { onSuccess: () => {
                                enqueueSnackbar("School information deleted successfully", { variant: "success" });
                                if (onSuccess) onSuccess();
                            }, onError: (err: any) => {
                                enqueueSnackbar(err.message || "Failed to delete school information", { variant: "error" });
                            } });
        }
    };

    return { handleDelete };
};

export default useDeleteSchoolInfo;
