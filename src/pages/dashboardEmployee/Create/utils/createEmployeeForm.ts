import type { CreateEmployeeRequestModel } from "@api/employee/model";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export const CreateEmployeeDefaultValues: CreateEmployeeRequestModel = {
    user: { full_name: "", username: "", password: "" },
    profile: { first_name: "", last_name: "", niy: "", email: "", profile_url: "", status: true },
    detail: { gender: "L", birth_place: "", birth_date: "", address: "", RT: "", RW: "", zip_code: "", phone_number: "", description: "" },
    titles_depan: [],
    titles_belakang: [],
    role_ids: []
};

/** Helper: transform empty string ke null untuk field opsional */
const optionalStringToNull = z.string().optional().transform((val) => val === "" ? null : val);

export const CreateEmployeeValidations = zodResolver(
    z.object({
        user: z.object({
            username: z.string().min(3, { message: "Username minimal 3 karakter" }),
            password: z.string().min(6, { message: "Password minimal 6 karakter" }),
            full_name: z.string().min(3, { message: "Nama lengkap minimal 3 karakter" }),
        }),
        profile: z.object({
            first_name: z.string().min(1, { message: "Nama depan tidak boleh kosong" }),
            last_name: z.string().optional(),
            niy: z.string().min(1, { message: "NIY tidak boleh kosong" }),
            email: z.string().min(1, { message: "Email tidak boleh kosong" }).email({ message: "Format email tidak valid" }),
            profile_url: z.string().optional().transform((val) => val === "" ? undefined : val),
            status: z.boolean().optional(),
        }),
        detail: z.object({
            gender: z.enum(["L", "P"], { message: "Jenis kelamin wajib dipilih" }),
            birth_place: z.string().min(1, { message: "Tempat lahir tidak boleh kosong" }),
            birth_date: z.string().refine((val) => {
                if (!val) return true;
                const date = new Date(val);
                return !isNaN(date.getTime());
            }, { message: "Format tanggal tidak valid" }),
            address: optionalStringToNull,
            RT: optionalStringToNull,
            RW: optionalStringToNull,
            zip_code: optionalStringToNull,
            phone_number: optionalStringToNull,
            description: optionalStringToNull,
        }),
        role_ids: z.array(z.string()).optional(),
        titles_depan: z.array(z.string()).optional(),
        titles_belakang: z.array(z.string()).optional(),
    })
);

export const CreateEmployeeDetailsFormatter = (data: CreateEmployeeRequestModel): CreateEmployeeRequestModel => ({
    user: {
        username: data?.user?.username || "",
        password: data?.user?.password || "",
        full_name: data?.user?.full_name || "",
    },
    profile: {
        first_name: data?.profile?.first_name || "",
        last_name: data?.profile?.last_name || "",
        niy: data?.profile?.niy || "",
        email: data?.profile?.email || "",
        profile_url: data?.profile?.profile_url || "",
        status: data?.profile?.status ?? true
    },
    detail: {
        gender: data?.detail?.gender || "L",
        birth_place: data?.detail?.birth_place || "",
        birth_date: data?.detail?.birth_date || "",
        address: data?.detail?.address || "",
        RT: data?.detail?.RT || "",
        RW: data?.detail?.RW || "",
        zip_code: data?.detail?.zip_code || "",
        phone_number: data?.detail?.phone_number || "",
        description: data?.detail?.description || ""
    },
    role_ids: data?.role_ids || [],
    titles_depan: data?.titles_depan || [],
    titles_belakang: data?.titles_belakang || []
});