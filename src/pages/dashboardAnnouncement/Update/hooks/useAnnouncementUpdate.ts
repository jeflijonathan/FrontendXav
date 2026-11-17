import AnnouncementService from "@api/announcement";
import { snackbar } from "@utils/snackbar";
import useAnnouncementList from "../../LIst/hooks/useAnnouncementList";
import type { AnnouncementUpdateModel } from "@api/announcement/model";
import { useFormContext } from "react-hook-form";
import useDashboardAnnouncementStore from "@pages/dashboardAnnouncement/store";
import useAuthStore from "@common/store/useAuthStore";
import type { UpdateAnnouncementFormValues } from "../utils/updateAnnouncementForm";

type HookReturn = {
    fetchAnnouncementById: (id: string) => void;
    handleUpdateAnnouncement: (id: string, onSuccess?: () => void) => void;
    isLoading: boolean;
};

const useAnnouncementUpdate = (): HookReturn => {
    const { state, setState } = useDashboardAnnouncementStore();
    const { isUpdateLoading } = state;
    const service = new AnnouncementService();
    const { fetchAnnouncementList } = useAnnouncementList();
    const { handleSubmit, setValue } = useFormContext<UpdateAnnouncementFormValues>();
    const { user } = useAuthStore();

    const fetchAnnouncementById = (id: string) => {
        setState((prev) => ({
            ...prev,
            isUpdateLoading: true,
        }));
        service.fetchAnnouncementByIdRequest(id, {
            onSuccess: (data: any) => {
                const item = data?.data || data;
                setValue("id_announcement", item.id_announcement || id);
                setValue("title", item.title || "");
                setValue("description", item.description || "");
                setValue("url_drive", item.url_drive || "");
                setValue("status", item.status ?? 0);
                setState((prev) => ({
                    ...prev,
                    updateAnnouncementReqDetails: item,
                }));
            },
            onError: (err: any) => {
                const message = err.message || "Gagal memuat data pengumuman";
                snackbar.error(message);
                setState((prev) => ({
                    ...prev,
                    errorUpdateDetail: [message],
                }));
            },
            onFullfilled: () => {
                setState((prev) => ({
                    ...prev,
                    isUpdateLoading: false,
                }));
            },
        });
    };

    const handleUpdateAnnouncement = (id: string, onSuccess?: () => void) => {
        handleSubmit((values: UpdateAnnouncementFormValues) => {
            setState((prev) => ({
                ...prev,
                isUpdateLoading: true,
            }));

            const payload: Partial<AnnouncementUpdateModel> & { id_user?: string } = {
                id_announcement: id,
                title: values.title.trim(),
                description: values.description.trim(),
                url_drive: values.url_drive?.trim() || "",
                status: values.status ?? 0,
                id_user: user?.id || "",
            };

            service.updateAnnouncementRequest(id, payload, {
                onSuccess: () => {
                    snackbar.success("Pengumuman berhasil diperbarui!");
                    fetchAnnouncementList();
                    if (onSuccess) onSuccess();
                },
                onError: (err: any) => {
                    snackbar.error(err.message || "Gagal memperbarui pengumuman");
                },
                onFullfilled: () => {
                    setState((prev) => ({
                        ...prev,
                        isUpdateLoading: false,
                    }));
                },
            });
        })();
    };

    return {
        fetchAnnouncementById,
        handleUpdateAnnouncement,
        isLoading: isUpdateLoading,
    };
};

export default useAnnouncementUpdate;
