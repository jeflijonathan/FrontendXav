import type { AnnouncementCreateModel } from "@api/announcement/model";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export const announcementSchema = z.object({
    title: z.string().min(1, { message: "Judul pengumuman wajib diisi" }),
    description: z.string().min(1, { message: "Deskripsi pengumuman wajib diisi" }),
    url_drive: z.string(),
    status: z.number().min(0).max(2),
});

export type AnnouncementFormValues = z.infer<typeof announcementSchema>;

export const CreateAnnouncementReqDefaultValues: AnnouncementFormValues = {
    title: "",
    description: "",
    url_drive: "",
    status: 0,
};

export const CreateAnnouncementValidations = zodResolver(announcementSchema);

export const CreateAnnouncementDetailsFormatter = (
    data?: Partial<AnnouncementCreateModel>
): AnnouncementCreateModel => {
    return {
        title: data?.title || "",
        description: data?.description || "",
        url_drive: data?.url_drive || "",
        status: data?.status ?? 0,
    };
};
