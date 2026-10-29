import type { Moment } from "moment";

export type AnnouncementUserLogModel = {
    id_log: string;
    action: string;
    created_at: Moment;
    id_user: string;
}

export type AnnouncementResponseModel = {
    id_announcement: string;
    title: string;
    description: string;
    url_drive: string;
    user_logs: AnnouncementUserLogModel[];
    status: string;
    created_at: Moment;
    updated_at: Moment;
}

export type AnnouncementCreateModel = {
    title: string;
    description: string;
    url_drive: string;
}

export type AnnouncementUpdateModel = {
    id_announcement: string;
    title: string;
    description: string;
    url_drive: string;
}
