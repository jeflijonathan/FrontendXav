import { useState } from "react";
import AnnouncementService from "@api/announcement";
import { snackbar } from "@utils/snackbar";
import useAnnouncementList from "../../LIst/hooks/useAnnouncementList";

const useAnnouncementCreate = () => {
    const [isLoading, setIsLoading] = useState(false);
    const service = new AnnouncementService();
    const { fetchAnnouncementList } = useAnnouncementList();

    const createAnnouncement = (
        payload: { title: string; description: string; url_drive: string; id_user: string },
        onSuccess?: () => void
    ) => {
        setIsLoading(true);
        service.createAnnouncementRequest(payload, {
            onSuccess: () => {
                snackbar.success("Pengumuman berhasil dibuat!");
                fetchAnnouncementList();
                if (onSuccess) onSuccess();
            },
            onError: (err: any) => {
                snackbar.error(err.message || "Gagal membuat pengumuman");
            },
            onFullfilled: () => {
                setIsLoading(false);
            }
        });
    };

    return { createAnnouncement, isLoading };
};

export default useAnnouncementCreate;
