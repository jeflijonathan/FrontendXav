import type { UpdateMajorRequestModel } from "@api/major/model";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export const UpdateMajorValidations = zodResolver(
    z.object({
        name: z.string().min(1, { message: "Nama jurusan wajib diisi" }),
        status: z.boolean().default(true),
    })
);

export const UpdateMajorDetailsFormatter = (
    data?: Partial<UpdateMajorRequestModel> | null
): UpdateMajorRequestModel => ({
    name: data?.name || "",
    status: data?.status ?? true,
});
