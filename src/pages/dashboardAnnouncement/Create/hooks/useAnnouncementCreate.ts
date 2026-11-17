import { useState } from "react";
import AnnouncementService from "@api/announcement";
import { snackbar } from "@utils/snackbar";
import useAnnouncementList from "../../LIst/hooks/useAnnouncementList";
import useAuthStore from "@common/store/useAuthStore";
import useNotificationStore from "@common/store/useNotificationStore";
import type { AnnouncementFormValues } from "../utils/createAnnouncementForm";

const useAnnouncementCreate = () => {
    const [isLoading, setIsLoading] = useState(false);
    const service = new AnnouncementService();
    const { fetchAnnouncementList } = useAnnouncementList();
    const { user } = useAuthStore();
    const { addSystemNotification } = useNotificationStore();

    const createAnnouncement = (
        values: AnnouncementFormValues,
        onSuccess?: () => void
    ) => {
        setIsLoading(true);
        const payload = {
            title: values.title.trim(),
            description: values.description.trim(),
            url_drive: values.url_drive?.trim() || "",
            status: values.status ?? 0,
            id_user: user?.id || "",
        };

        service.createAnnouncementRequest(payload, {
            onSuccess: () => {
                snackbar.success("Pengumuman berhasil dibuat & notifikasi email telah dikirim!");
                
                // Add real-time notifications to system notifications list
                addSystemNotification({
                    title: `📢 Pengumuman: ${payload.title}`,
                    message: payload.description || "Pengumuman baru telah dipublikasikan.",
                    type: "announcement",
                    timestamp: "Baru saja",
                    url_drive: payload.url_drive,
                });

                addSystemNotification({
                    title: `📧 Notifikasi Email Terkirim`,
                    message: `Notifikasi email untuk "${payload.title}" telah disiarkan ke seluruh civitas akademika (Siswa & Guru).`,
                    type: "email",
                    timestamp: "Baru saja",
                    url_drive: payload.url_drive,
                });

                fetchAnnouncementList();
                if (onSuccess) onSuccess();
            },
            onError: (err: any) => {
                snackbar.error(err.message || "Gagal membuat pengumuman");
            },
            onFullfilled: () => {
                setIsLoading(false);
            },
        });
    };

    return { createAnnouncement, isLoading };
};

export default useAnnouncementCreate;
