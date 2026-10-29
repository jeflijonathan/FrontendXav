import { useState } from "react";
import AnnouncementService from "@api/announcement";
import { snackbar } from "@utils/snackbar";
import useAnnouncementList from "../../LIst/hooks/useAnnouncementList";

const useAnnouncementDelete = () => {
    const [isLoading, setIsLoading] = useState(false);
    const service = new AnnouncementService();
    const { fetchAnnouncementList } = useAnnouncementList();

    const deleteAnnouncement = (
        id: string,
        onSuccess?: () => void
    ) => {
        setIsLoading(true);
        service.deleteAnnouncementRequest(id, {
            onSuccess: () => {
                snackbar.success("Pengumuman berhasil dihapus!");
                fetchAnnouncementList();
                if (onSuccess) onSuccess();
            },
            onError: (err: any) => {
                snackbar.error(err.message || "Gagal menghapus pengumuman");
            },
            onFullfilled: () => {
                setIsLoading(false);
            }
        });
    };

    return { deleteAnnouncement, isLoading };
};

export default useAnnouncementDelete;
