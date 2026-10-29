import type { API } from "@api/index";

const VALID_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"];
const VALID_IMAGE_EXTS = ["jpg", "jpeg", "png"];

export type UploadResult =
    | { success: true; id: string }
    | { success: false; message: string };


export async function validateAndUploadFile(
    file: File,
    apiService: API
): Promise<UploadResult> {
    const ext = file.name.split(".").pop()?.toLowerCase();
    const isTypeValid = VALID_IMAGE_TYPES.includes(file.type);
    const isExtValid = ext != null && VALID_IMAGE_EXTS.includes(ext);

    if (!isTypeValid && !isExtValid) {
        return {
            success: false,
            message: "File profil harus berupa gambar (jpg, jpeg, png)",
        };
    }

    try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await apiService.POSTFORMDATA("/upload", formData);
        if (res.data?.id) {
            return { success: true, id: res.data.id };
        }
        return { success: false, message: "Upload berhasil tapi tidak mendapat ID file" };
    } catch (err: any) {
        const detail = err?.response?.data?.detail;
        const msg =
            typeof detail === "string"
                ? detail
                : detail?.message || err?.message || "Failed to upload image";
        return { success: false, message: msg };
    }
}
