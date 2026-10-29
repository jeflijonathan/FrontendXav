import EmployeeService from "@api/employee/service";
import type { CreateEmployeeRequestModel } from "@api/employee/model";
import { useFormContext } from "react-hook-form";
import useDashboardEmployeeStore from "@pages/dashboardEmployee/store";
import useEmployeeList from "@pages/dashboardEmployee/List/hook/useEmployeeList";
import { snackbar } from "@utils/snackbar";
import { filterEmployeeMapper } from "@pages/dashboardEmployee/List/utils/FilterEmployeeMapper";
import RoleService from "@api/role/service";
import type { FilterParams } from "@common/types/index";
import { parseErrorDetails, formatErrorDetails } from "@utils/parseErrorDetails";
import { validateAndUploadFile } from "@utils/uploadFile";

const useCreateEmployee = () => {
    const { handleSubmit, setError } = useFormContext<CreateEmployeeRequestModel>();
    const { state, setState } = useDashboardEmployeeStore();
    const { fetchEmployeeList } = useEmployeeList();
    const service = new EmployeeService();
    const roleService = new RoleService();

    const handleCreate = () => {
        return handleSubmit(async (payload) => {
            setState((prev) => ({ ...prev, isCreateLoading: true }));

            if (state.profileFile) {
                const uploadResult = await validateAndUploadFile(state.profileFile, service.service);
                if (!uploadResult.success) {
                    setState((prev) => ({ ...prev, isCreateLoading: false }));
                    setError("root.serverError", { type: "server", message: "ini" });
                    return;
                }
                payload.profile.profile_url = uploadResult.id;
            }

            service.create(payload, {
                onSuccess: () => {
                    setState((prev) => ({
                        ...prev,
                        isCreateLoading: false,
                        profileFile: null,
                        detailError: { ...prev.detailError, create: [] },
                    }));
                    fetchEmployeeList(filterEmployeeMapper(state));
                    snackbar.success("Employee created successfully");
                },
                onError: (err) => {
                    const { detail } = err;
                    const parsedErrors = parseErrorDetails(detail);

                    setState((prev) => ({
                        ...prev,
                        isCreateLoading: false,
                        detailError: { ...prev.detailError, create: parsedErrors },
                    }));

                    setError("root.serverError", {
                        type: "server",
                        message: formatErrorDetails(parsedErrors),
                    });
                },
            });
        })();
    };

    const FetchUserRole = (params?: FilterParams) => {
        return roleService.getAll(
            {
                onSuccess: (data) => {
                    setState((prev) => ({ ...prev, roleUser: data }));
                },
                onError: (err: any) => {
                    console.log(err);
                },
            },
            params
        )
    }

    return { handleCreate, FetchUserRole };
};

export default useCreateEmployee;
