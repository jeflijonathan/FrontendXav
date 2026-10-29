import type { AnnouncementCreateModel } from "@api/announcement/model";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export const CreateAnnouncementReqDefaultValues: AnnouncementCreateModel = {
    title: "",
    description: "",
    url_drive: "",
};

export const CreateAnnouncementValidations = zodResolver(
    z.object({
        title: z.string().min(1, { message: "Title is required" }),
        description: z.string().min(1, { message: "Description is required" }),
        url_drive: z.string().min(1, { message: "URL Drive is required" }),
    })
);

export const CreateAnnouncementDetailsFormatter = (
    data: AnnouncementCreateModel
): AnnouncementCreateModel => {
    return {
        title: data?.title || "",
        description: data?.description || "",
        url_drive: data?.url_drive || "",
    };
};