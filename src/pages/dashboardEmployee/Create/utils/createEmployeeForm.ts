import type { CreateEmployeeRequestModel } from "@api/employee/model";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export const CreateEmployeeDefaultValues: CreateEmployeeRequestModel = {
    user: { full_name: "", username: "", password: "" },
    profile: { first_name: "", last_name: "", niy: "", email: "", profile_url: "", status: true },
    detail: { gender: "L", birth_place: "", birth_date: "", address: "", RT: "", RW: "", zip_code: "", phone_number: "", description: "" }
};

/** Helper: transform empty string ke null untuk field opsional */
const optionalStringToNull = z.string().optional().transform((val) => val === "" ? null : val);

export const CreateEmployeeValidations = zodResolver(
    z.object({
        user: z.object({
            username: z.string().min(1, { message: "Username tidak boleh kosong" }),
            password: z.string().min(6, { message: "Password min 6 chars" }),
            full_name: z.string().optional(),
        }),
        profile: z.object({
            first_name: z.string().min(1, { message: "First name is required" }),
            last_name: z.string().optional(),
            niy: z.string().min(1, { message: "NIY is required" }),
            email: z.email(),
            profile_url: z.string().optional().transform((val) => val === "" ? undefined : val),
            status: z.boolean().optional(),
        }),
        detail: z.object({
            gender: z.enum(["L", "P"], { message: "Gender is required" }),
            birth_place: z.string().min(1, { message: "Birth place is required" }),
            birth_date: z.string().refine((val) => {
                if (!val) return true;
                const date = new Date(val);
                return !isNaN(date.getTime());
            }, { message: "Invalid date" }),
            address: optionalStringToNull,
            RT: optionalStringToNull,
            RW: optionalStringToNull,
            zip_code: optionalStringToNull,
            phone_number: optionalStringToNull,
            description: optionalStringToNull,
        })
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
    }
});