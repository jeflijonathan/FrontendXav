import type { AnnouncementResponseModel, AnnouncementUserLogModel } from "@api/announcement/model";
import { parseDateTime } from "@utils/dateParse";
import type { Moment } from "moment";
import moment from "moment";

export type AnnouncementTableItem = {
    id: string;
    title: string;
    description: string;
    url_drive: string;
    status: boolean;
    logs: {
        id_log: string;
        action: string;
        created_at: Moment;
        id_announcement: string;
        id_user: string;
    }[];
    created_at: Moment;
    updated_at: Moment;
}

const listTableAnnouncementMapper = (
    data: AnnouncementResponseModel[]
): AnnouncementTableItem[] => {
    return data.map((item) => {
        return {
            id: item.id_announcement,
            title: item.title,
            description: item.description,
            url_drive: item.url_drive,
            status: Boolean(item.status),
            logs: item.user_logs.map((log) => ({
                id_log: log.id_log,
                action: log.action,
                created_at: moment(parseDateTime(log.created_at)) || moment(),
                id_announcement: item.id_announcement,
                id_user: log.id_user,
            })),
            created_at: moment(parseDateTime(item.created_at)) || moment(),
            updated_at: moment(parseDateTime(item.updated_at)) || moment(),
        }
    });
}

export default listTableAnnouncementMapper;