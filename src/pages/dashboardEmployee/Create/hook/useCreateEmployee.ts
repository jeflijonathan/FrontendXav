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

            // Pastikan user.full_name terisi format lengkap gelar
            const baseName = [payload.profile.first_name, payload.profile.last_name].filter(Boolean).join(" ").trim();
            const depanStr = payload.titles_depan && payload.titles_depan.length > 0 ? `${payload.titles_depan.join(" ")} ` : "";
            const belakangStr = payload.titles_belakang && payload.titles_belakang.length > 0 ? `, ${payload.titles_belakang.join(", ")}` : "";
            payload.user.full_name = `${depanStr}${baseName}${belakangStr}`.trim() || baseName;

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
        }, (validationErrors) => {
            // Scroll ke field pertama yang error agar user bisa melihatnya
            const firstErrorKey = Object.keys(validationErrors)[0];
            if (firstErrorKey) {
                const errorMessages: string[] = [];
                const collectErrors = (obj: any, prefix = '') => {
                    Object.entries(obj).forEach(([key, val]: [string, any]) => {
                        if (val?.message) {
                            errorMessages.push(val.message);
                        } else if (typeof val === 'object' && val !== null) {
                            collectErrors(val, `${prefix}${key}.`);
                        }
                    });
                };
                collectErrors(validationErrors);
                if (errorMessages.length > 0) {
                    snackbar.error(`Validasi gagal: ${errorMessages.join(', ')}`);
                }

                // Scroll to first error element
                setTimeout(() => {
                    const errorEl = document.querySelector('[class*="Mui-error"], .text-red-600, [aria-invalid="true"]');
                    if (errorEl) {
                        errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 100);
            }
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
            params || { params: {} }
        )
    }

    return { handleCreate, FetchUserRole };
};

export default useCreateEmployee;
