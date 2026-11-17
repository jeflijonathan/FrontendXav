import type { Moment } from "moment";

export type AnnouncementUserLogModel = {
    id_log: string;
    action: string;
    created_at: Moment;
    id_user: string;
    user_name?: string;
    identifier?: string;
    profile_url?: string;
}

export type AnnouncementResponseModel = {
    id_announcement: string;
    title: string;
    description: string;
    url_drive: string;
    user_logs: AnnouncementUserLogModel[];
    status: number;
    created_at: Moment;
    updated_at: Moment;
}

export type AnnouncementCreateModel = {
    title: string;
    description: string;
    url_drive: string;
    status: number;
}

export type AnnouncementUpdateModel = {
    id_announcement: string;
    title: string;
    description: string;
    url_drive: string;
    status?: number;
    id_user: string;
}
