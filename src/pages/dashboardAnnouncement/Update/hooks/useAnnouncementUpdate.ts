import { useState } from "react";
import AnnouncementService from "@api/announcement";
import { snackbar } from "@utils/snackbar";
import useAnnouncementList from "../../LIst/hooks/useAnnouncementList";
import type { AnnouncementUpdateModel } from "@api/announcement/model";

const useAnnouncementUpdate = () => {
    const [isLoading, setIsLoading] = useState(false);
    const service = new AnnouncementService();
    const { fetchAnnouncementList } = useAnnouncementList();

    const updateAnnouncement = (
        id: string,
        payload: Partial<AnnouncementUpdateModel> & { id_user?: string },
        onSuccess?: () => void
    ) => {
        setIsLoading(true);
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
                setIsLoading(false);
            }
        });
    };

    return { updateAnnouncement, isLoading };
};

export default useAnnouncementUpdate;
