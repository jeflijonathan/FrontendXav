import type { AnnouncementUpdateModel, AnnouncementResponseModel } from "@api/announcement/model";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export const updateAnnouncementSchema = z.object({
    id_announcement: z.string(),
    title: z.string().min(1, { message: "Judul pengumuman wajib diisi" }),
    description: z.string().min(1, { message: "Deskripsi pengumuman wajib diisi" }),
    url_drive: z.string(),
    status: z.number().min(0).max(2),
});

export type UpdateAnnouncementFormValues = z.infer<typeof updateAnnouncementSchema>;

export const UpdateAnnouncementValidations = zodResolver(updateAnnouncementSchema);

export const UpdateAnnouncementDefaultValues: UpdateAnnouncementFormValues = {
    id_announcement: "",
    title: "",
    description: "",
    url_drive: "",
    status: 0,
};

export const UpdateAnnouncementDetailsFormatter = (
    data?: Partial<AnnouncementResponseModel | AnnouncementUpdateModel> | null
): UpdateAnnouncementFormValues => {
    return {
        id_announcement: data?.id_announcement || "",
        title: data?.title || "",
        description: data?.description || "",
        url_drive: data?.url_drive || "",
        status: (data as any)?.status ?? 0,
    };
};

