import { create } from "zustand";
import type { AnnouncementResponseModel } from "@api/announcement/model";
import moment from "moment";

export type NotificationType = "success" | "error" | "warning" | "info";

export interface Notification {
    id: string;
    message: string;
    type: NotificationType;
}

export interface SystemNotificationItem {
    id: string;
    title: string;
    message: string;
    type: "email" | "announcement" | "system" | "info";
    timestamp: string;
    read: boolean;
    announcementId?: string;
    url_drive?: string;
}

interface NotificationStore {
    // Toast snackbars
    notifications: Notification[];
    addNotification: (message: string, type: NotificationType) => void;
    removeNotification: (id: string) => void;

    // Persistent Notification Menu / Dropdown Items
    systemNotifications: SystemNotificationItem[];
    addSystemNotification: (item: Omit<SystemNotificationItem, "id" | "read">) => void;
    markSystemNotificationAsRead: (id: string) => void;
    markAllSystemNotificationsAsRead: () => void;
    syncAnnouncementsToNotifications: (announcements: AnnouncementResponseModel[]) => void;
    clearSystemNotifications: () => void;
}

const STORAGE_KEY = "smk_xaverius_system_notifications";

const getSavedNotifications = (): SystemNotificationItem[] => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            return JSON.parse(raw);
        }
    } catch {
        // fallback
    }
    return [];
};

const saveNotifications = (items: SystemNotificationItem[]) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
        // ignore
    }
};

const useNotificationStore = create<NotificationStore>((set, get) => ({
    notifications: [],
    addNotification: (message, type) => {
        const id = Date.now().toString();
        set((state) => ({
            notifications: [...state.notifications, { id, message, type }],
        }));
        setTimeout(() => {
            set((state) => ({
                notifications: state.notifications.filter((n) => n.id !== id),
            }));
        }, 4000);
    },
    removeNotification: (id) => {
        set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
        }));
    },

    systemNotifications: getSavedNotifications(),

    addSystemNotification: (item) => {
        const newItem: SystemNotificationItem = {
            ...item,
            id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            read: false,
        };
        const updated = [newItem, ...get().systemNotifications];
        saveNotifications(updated);
        set({ systemNotifications: updated });
    },

    markSystemNotificationAsRead: (id) => {
        const updated = get().systemNotifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
        );
        saveNotifications(updated);
        set({ systemNotifications: updated });
    },

    markAllSystemNotificationsAsRead: () => {
        const updated = get().systemNotifications.map((n) => ({ ...n, read: true }));
        saveNotifications(updated);
        set({ systemNotifications: updated });
    },

    clearSystemNotifications: () => {
        saveNotifications([]);
        set({ systemNotifications: [] });
    },

    syncAnnouncementsToNotifications: (announcements: AnnouncementResponseModel[]) => {
        const current = get().systemNotifications;
        const currentIds = new Set(current.map((c) => c.id));
        const newItems: SystemNotificationItem[] = [];

        announcements.forEach((item) => {
            const dateStr = item.created_at
                ? moment(item.created_at).isValid()
                    ? moment(item.created_at).format("D MMM YYYY, HH:mm")
                    : "Hari ini"
                : "Hari ini";

            // 1. Announcement Notification
            const notifId = `announcement-${item.id_announcement}`;
            if (!currentIds.has(notifId)) {
                newItems.push({
                    id: notifId,
                    title: `📢 Pengumuman: ${item.title}`,
                    message: item.description
                        ? item.description.length > 90
                            ? item.description.substring(0, 90) + "..."
                            : item.description
                        : "Pengumuman baru telah diterbitkan untuk seluruh civitas akademika.",
                    type: "announcement",
                    timestamp: dateStr,
                    read: false,
                    announcementId: item.id_announcement,
                    url_drive: item.url_drive,
                });
            }

            // 2. Email Broadcast Notification
            const emailNotifId = `email-${item.id_announcement}`;
            if (!currentIds.has(emailNotifId)) {
                newItems.push({
                    id: emailNotifId,
                    title: `📧 Notifikasi Email Terkirim`,
                    message: `Email broadcast pengumuman "${item.title}" telah disiarkan ke seluruh email Siswa & Guru.`,
                    type: "email",
                    timestamp: dateStr,
                    read: false,
                    announcementId: item.id_announcement,
                    url_drive: item.url_drive,
                });
            }
        });

        if (newItems.length > 0) {
            const merged = [...newItems, ...current];
            saveNotifications(merged);
            set({ systemNotifications: merged });
        }
    },
}));

export default useNotificationStore;
