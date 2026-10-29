import AnnouncementService from "@api/announcement";
import { snackbar } from "@utils/snackbar";
import { useFormContext } from "react-hook-form";
import { useDashboardAnnouncementStore } from "../../store";

const useDashboardAnnouncementCreate = () => {
    const { handleSubmit } = useFormContext();
    const service = new AnnouncementService();
    const { setState } = useDashboardAnnouncementStore();

    const handleCreate = (onClose: () => void, onRefresh: () => void) => {
        handleSubmit(
            (playload) => {
                setState((prev) => ({
                    ...prev,
                    isCreateLoading: true,
                }));

                const data = {
                    title: playload.title,
                    description: playload.description,
                    url_drive: playload.url_drive,
                }

                service.createAnnouncementRequest(data, {
                    onSuccess: () => {
                        snackbar.success("Announcement created successfully");
                    },
                    onError: (err) => {
                        snackbar.error(err.message);
                    },
                    onFullfilled: () => {
                        setState((prev) => ({
                            ...prev,
                            isCreateLoading: false,
                        }));
                        onRefresh();
                        onClose();
                    }
                });
            }
        )();
    }
    return { handleCreate }
}
export default useDashboardAnnouncementCreate;