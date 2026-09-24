import EmployeeService from "@api/employee/service";
import useDashboardEmployeeStore from "../../store";
import { useSnackbar } from "notistack";

const useUpdateEmployee = () => {
    const service = new EmployeeService();
    const { setState } = useDashboardEmployeeStore();
    const { enqueueSnackbar } = useSnackbar();

    const handleUpdate = async (id: string, data: any, onSuccessCallback?: () => void) => {
        setState({ isLoading: true });
        await service.updateEmployeeRequest(id, data, {
            onSuccess: () => {
                enqueueSnackbar("Employee updated successfully!", { variant: "success" });
                if(onSuccessCallback) onSuccessCallback();
            },
            onError: (err: any) => {
                enqueueSnackbar("Failed to update Employee.", { variant: "error" });
                console.error(err);
            },
            onFullfilled: () => {
                setState({ isLoading: false });
            }
        });
    };

    return { handleUpdate };
};

export default useUpdateEmployee;
