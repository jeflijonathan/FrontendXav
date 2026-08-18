import EmployeeService from "@api/employee/service";
import useDashboardEmployeeStore from "../../store";
import { useSnackbar } from "notistack";

const useCreateEmployee = () => {
    const service = new EmployeeService();
    const { setState } = useDashboardEmployeeStore();
    const { enqueueSnackbar } = useSnackbar();

    const handleCreate = async (data: any, onSuccessCallback?: () => void) => {
        setState({ isLoading: true });
        await service.createEmployeeRequest(data, {
            onSuccess: () => {
                enqueueSnackbar("Employee created successfully!", { variant: "success" });
                if(onSuccessCallback) onSuccessCallback();
            },
            onError: (err) => {
                enqueueSnackbar("Failed to create Employee.", { variant: "error" });
                console.error(err);
            },
            onFullfilled: () => {
                setState({ isLoading: false });
            }
        });
    };

    return { handleCreate };
};

export default useCreateEmployee;
