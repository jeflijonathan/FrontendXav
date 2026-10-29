import type { CreateMajorRequestModel } from "@api/major/model";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export const CreateMajorDefaultValues: CreateMajorRequestModel = {
    name: "",
    status: true,
};

export const CreateMajorValidations = zodResolver(
    z.object({
        name: z.string().min(1, { message: "Nama jurusan wajib diisi" }),
        status: z.boolean().default(true),
    })
);

export const CreateMajorDetailsFormatter = (data?: Partial<CreateMajorRequestModel>): CreateMajorRequestModel => ({
    name: data?.name || "",
    status: data?.status ?? true,
});
