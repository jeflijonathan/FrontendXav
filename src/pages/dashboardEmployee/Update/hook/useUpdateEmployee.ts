import EmployeeService from "@api/employee/service";
import type { UpdateEmployeeRequestModel } from "@api/employee/model";
import { useFormContext } from "react-hook-form";
import useDashboardEmployeeStore from "@pages/dashboardEmployee/store";
import useEmployeeList from "@pages/dashboardEmployee/List/hook/useEmployeeList";
import { snackbar } from "@utils/snackbar";
import { filterEmployeeMapper } from "@pages/dashboardEmployee/List/utils/FilterEmployeeMapper";

const useUpdateEmployee = () => {
    const { handleSubmit, setError } = useFormContext<UpdateEmployeeRequestModel>();
    const { state, setState } = useDashboardEmployeeStore();
    const { fetchEmployeeList } = useEmployeeList();
    const service = new EmployeeService();

    const fetchDetail = async (id: string) => {
        const employee = state.data.find(emp => emp.id === id);
        if (employee) {
            setState((prev) => ({ ...prev, updateEmployeeReqDetails: employee }));
        }
        await service.getById(id, {
            onSuccess: (res: any) => {
                const empData = res?.data || res;
                if (empData && empData.id) {
                    setState((prev) => ({ ...prev, updateEmployeeReqDetails: empData }));
                }
            },
            onError: ({ message }) => {
                snackbar.error(message)
            },
        });

    };
    const handleUploadFile = async () => {
        const payload = handleSubmit(async (payload) => {
            const formData = new FormData();
            formData.append("file", state.profileFile);
            const uploadRes = await service.service.POSTFORMDATA("/upload", formData);
            if (uploadRes.data?.id) {
                payload.profile_url = uploadRes.data.id;
            }
        })()
    }
    const handleUpdate = (id: string, onSuccessCallback?: () => void) => {
        return handleSubmit(
            async (payload) => {
                setState((prev) => ({ ...prev, isUpdateLoading: true }));

                const clientErrors: string[] = [];

                if (!payload.niy || !payload.niy.trim()) {
                    clientErrors.push("NIY tidak boleh kosong");
                }

                if (!payload.username || !payload.username.trim()) {
                    clientErrors.push("Username tidak boleh kosong");
                }

                if (!payload.first_name || !payload.first_name.trim()) {
                    clientErrors.push("First name tidak boleh kosong");
                }

                if (!payload.email || !payload.email.trim()) {
                    clientErrors.push("Email tidak boleh kosong");
                }

                // Validasi tipe file gambar
                let imageInvalid = false;
                if (state.profileFile) {
                    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
                    const ext = state.profileFile.name.split('.').pop()?.toLowerCase();
                    const isExtValid = ext && ["jpg", "jpeg", "png"].includes(ext);
                    if (!validTypes.includes(state.profileFile.type) && !isExtValid) {
                        clientErrors.push("File profil harus berupa gambar (jpg, jpeg, png)");
                        imageInvalid = true;
                    }
                }

                if (clientErrors.length > 0) {
                    setState((prev) => ({ ...prev, isUpdateLoading: false }));
                    setError("root.serverError", {
                        type: "server",
                        message: clientErrors.join("\n"),
                    });
                    snackbar.error(clientErrors[0]);
                    return;
                }

                // ── Step 2: Upload gambar ────────────────────
                if (state.profileFile && !imageInvalid) {
                    try {
                        const formData = new FormData();
                        formData.append("file", state.profileFile);
                        const uploadRes = await service.service.POSTFORMDATA("/upload", formData);
                        if (uploadRes.data?.id) {
                            payload.profile_url = uploadRes.data.id;
                        }
                    } catch (err: any) {
                        setState((prev) => ({ ...prev, isUpdateLoading: false }));
                        const detail = err?.response?.data?.detail;
                        const msg = typeof detail === "string" ? detail : (detail?.message || err?.message || "Failed to upload image");
                        setError("root.serverError", { type: "server", message: msg });
                        snackbar.error(msg);
                        return;
                    }
                }

                // ── Step 3: Sanitize & kirim ke backend ─────────────────────────
                const finalPayload = { ...payload };
                if (finalPayload.niy) {
                    finalPayload.niy = finalPayload.niy.trim();
                }
                if (finalPayload.username) {
                    finalPayload.username = finalPayload.username.trim();
                }
                if (finalPayload.first_name) {
                    finalPayload.first_name = finalPayload.first_name.trim();
                }
                if (!finalPayload.password || !finalPayload.password.trim()) {
                    delete finalPayload.password;
                }
                if (finalPayload.detail) {
                    const sanitized = { ...finalPayload.detail };
                    for (const key of Object.keys(sanitized) as Array<keyof typeof sanitized>) {
                        if (sanitized[key] === "") {
                            (sanitized as any)[key] = null;
                        }
                    }
                    finalPayload.detail = sanitized;
                }

                service.update(id, finalPayload, {
                    onSuccess: (res: any) => {
                        const updated = res?.data || res;
                        setState((prev) => ({
                            ...prev,
                            isUpdateLoading: false,
                            profileFile: null,
                            updateEmployeeReqDetails: updated,
                            detailError: { ...prev.detailError, update: [] },
                        }));
                        fetchEmployeeList(filterEmployeeMapper(state));
                        snackbar.success("Employee updated successfully");
                        onSuccessCallback?.();
                    },
                    onError: ({ message, detail }: { message: string; detail?: any }) => {
                        // Parse detail errors dari backend → simpan ke state
                        let parsedErrors: { field?: string; message: string }[] = [];

                        if (Array.isArray(detail) && detail.length > 0) {
                            parsedErrors = detail.map((d: any) => {
                                if (typeof d.message === "string") {
                                    return { field: d.field || undefined, message: d.message };
                                } else if (d.msg) {
                                    const loc = Array.isArray(d.loc) ? d.loc.filter((l: any) => l !== "body").join(" → ") : undefined;
                                    return { field: loc || undefined, message: d.msg };
                                }
                                return { message: JSON.stringify(d) };
                            });
                        } else if (typeof detail === "string") {
                            parsedErrors = [{ message: detail }];
                        } else if (detail && typeof detail.message === "string") {
                            parsedErrors = [{ message: detail.message }];
                        } else {
                            parsedErrors = [{ message: message || "Failed to update employee" }];
                        }

                        setState((prev) => ({
                            ...prev,
                            isUpdateLoading: false,
                            detailError: { ...prev.detailError, update: parsedErrors },
                        }));

                        const firstMsg = parsedErrors[0]?.message || "Failed to update employee";
                        setError("root.serverError", { type: "server", message: parsedErrors.map((e) => (e.field ? `${e.field}: ${e.message}` : e.message)).join("\n") });
                        snackbar.error(firstMsg);
                    },
                });
            },
            (validationErrors) => {
                setState((prev) => ({ ...prev, isUpdateLoading: false }));
                console.error("Form validation errors:", validationErrors);
                const firstKey = Object.keys(validationErrors)[0];
                const err = validationErrors[firstKey as keyof typeof validationErrors];
                const message = (err as any)?.message || "Mohon periksa data formulir";
                snackbar.error(message);
            }
        )();
    };

    return { fetchDetail, handleUpdate };
};

export default useUpdateEmployee;
