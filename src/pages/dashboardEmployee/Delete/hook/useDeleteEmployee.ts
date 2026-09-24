import EmployeeService from "@api/employee/service";
import useDashboardEmployeeStore from "../../store";
import { useSnackbar } from "notistack";

const useDeleteEmployee = () => {
    const service = new EmployeeService();
    const { setState } = useDashboardEmployeeStore();
    const { enqueueSnackbar } = useSnackbar();

    const handleDelete = async (id: string, onSuccessCallback?: () => void) => {
        if(!window.confirm("Are you sure you want to delete this Employee?")) return;
        
        setState({ isLoading: true });
        await service.deleteEmployeeRequest(id, {
            onSuccess: () => {
                enqueueSnackbar("Employee deleted successfully!", { variant: "success" });
                if(onSuccessCallback) onSuccessCallback();
            },
            onError: (err: any) => {
                enqueueSnackbar("Failed to delete Employee.", { variant: "error" });
                console.error(err);
            },
            onFullfilled: () => {
                setState({ isLoading: false });
            }
        });
    };

    return { handleDelete };
};

export default useDeleteEmployee;
