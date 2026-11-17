import type { EmployeeResponseModel } from "@api/employee/model";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import * as z from "zod";

export interface EmployeeProfileFormValues {
    first_name: string;
    last_name: string;
    email: string;
    new_password?: string;
    gender?: "L" | "P";
    phone_number?: string;
    birth_place?: string;
    birth_date?: string;
    address?: string;
    RT?: string;
    RW?: string;
    zip_code?: string;
    description?: string;
}

export const EmployeeProfileDefaultValues: EmployeeProfileFormValues = {
    first_name: "",
    last_name: "",
    email: "",
    new_password: "",
    gender: "L",
    phone_number: "",
    birth_place: "",
    birth_date: "",
    address: "",
    RT: "",
    RW: "",
    zip_code: "",
    description: "",
};

const indonesianPhoneRegex = /^$|^(?:\+62|62|0)8[0-9]{7,12}$/;

export const EmployeeProfileSchema = z.object({
    first_name: z.string().min(1, "Nama depan wajib diisi"),
    last_name: z.string().optional().default(""),
    email: z.string().email("Format email tidak valid").min(1, "Email wajib diisi"),
    new_password: z
        .string()
        .refine((val) => !val || val.length >= 6, {
            message: "Kata sandi baru minimal 6 karakter",
        })
        .optional()
        .or(z.literal("")),
    gender: z.enum(["L", "P"]).optional(),
    phone_number: z
        .string()
        .regex(indonesianPhoneRegex, "Format nomor telepon tidak valid")
        .optional()
        .nullable()
        .or(z.literal("")),
    birth_place: z.string().optional().nullable().or(z.literal("")),
    birth_date: z.string().optional().nullable().or(z.literal("")),
    address: z.string().optional().nullable().or(z.literal("")),
    RT: z.string().optional().nullable().or(z.literal("")),
    RW: z.string().optional().nullable().or(z.literal("")),
    zip_code: z.string().optional().nullable().or(z.literal("")),
    description: z.string().optional().nullable().or(z.literal("")),
});

export const EmployeeProfileValidations: Resolver<EmployeeProfileFormValues> = zodResolver(EmployeeProfileSchema) as unknown as Resolver<EmployeeProfileFormValues>;

export const mapEmployeeResponseToForm = (
    emp?: EmployeeResponseModel | null
): EmployeeProfileFormValues => {
    if (!emp) return { ...EmployeeProfileDefaultValues };

    return {
        first_name: emp.first_name || "",
        last_name: emp.last_name || "",
        email: emp.email || "",
        new_password: "",
        gender: emp.detail?.gender === "P" ? "P" : "L",
        phone_number: emp.detail?.phone_number || "",
        birth_place: emp.detail?.birth_place || "",
        birth_date: emp.detail?.birth_date ? String(emp.detail.birth_date).split("T")[0] : "",
        address: emp.detail?.address || "",
        RT: emp.detail?.RT || "",
        RW: emp.detail?.RW || "",
        zip_code: emp.detail?.zip_code || "",
        description: emp.detail?.description || "",
    };
};
