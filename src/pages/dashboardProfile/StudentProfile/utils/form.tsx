import type { UpdateStudentProfileRequestType, StudentResponseModel } from "@api/student/model";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import * as z from "zod";

export const StudentProfileDefaultValues: UpdateStudentProfileRequestType = {
    first_name: "",
    last_name: "",
    NIK: "",
    email: "",
    new_password: "",
    phone_number: "",
    gender: "L",
    birth_place: "",
    birth_date: "",
    address: "",
    rt: "",
    rw: "",
    zip_code: "",

    parent_name: "",
    parent_nik: "",
    parent_phone_number: "",
    parent_email: "",
    parent_occupation: "",

    mother_name: "",
    mother_nik: "",
    mother_phone_number: "",
    mother_email: "",
    mother_occupation: "",
};

const indonesianPhoneRegex = /^$|^(?:\+62|62|0)8[0-9]{7,12}$/;

export const UpdateProfileStudentSchema = z.object({
    first_name: z.string().min(1, "Nama depan wajib diisi"),
    last_name: z.string().optional().default(""),
    NIK: z
        .string()
        .min(1, "NIK wajib diisi!")
        .min(16, "NIK minimal 16 digit angka")
        .max(20, "NIK maksimal 20 digit"),
    email: z
        .string()
        .email("Format email tidak valid")
        .or(z.literal(""))
        .optional(),
    new_password: z
        .string()
        .refine((val) => !val || val.length >= 6, {
            message: "Kata sandi baru minimal 6 karakter",
        })
        .optional()
        .or(z.literal("")),
    phone_number: z
        .string()
        .regex(indonesianPhoneRegex, "Format nomor telepon tidak valid")
        .optional()
        .nullable()
        .or(z.literal("")),
    gender: z.enum(["L", "P"], {
        message: "Pilih jenis kelamin",
    }),
    birth_place: z.string().optional().nullable().or(z.literal("")),
    birth_date: z.string().optional().nullable().or(z.literal("")),
    address: z.string().optional().nullable().or(z.literal("")),
    rt: z.string().optional().nullable().or(z.literal("")),
    rw: z.string().optional().nullable().or(z.literal("")),
    zip_code: z.string().optional().nullable().or(z.literal("")),

    parent_name: z.string().optional().nullable().or(z.literal("")),
    parent_nik: z.string().optional().nullable().or(z.literal("")),
    parent_phone_number: z.string().optional().nullable().or(z.literal("")),
    parent_email: z.string().email("Format email ayah tidak valid").optional().or(z.literal("")),
    parent_occupation: z.string().optional().nullable().or(z.literal("")),

    mother_name: z.string().optional().nullable().or(z.literal("")),
    mother_nik: z.string().optional().nullable().or(z.literal("")),
    mother_phone_number: z.string().optional().nullable().or(z.literal("")),
    mother_email: z.string().email("Format email ibu tidak valid").optional().or(z.literal("")),
    mother_occupation: z.string().optional().nullable().or(z.literal("")),
});

export const UpdateProfileStudentValidations: Resolver<UpdateStudentProfileRequestType> = zodResolver(UpdateProfileStudentSchema) as unknown as Resolver<UpdateStudentProfileRequestType>;

export const mapStudentResponseToForm = (
    student?: StudentResponseModel | null
): UpdateStudentProfileRequestType => {
    if (!student) return { ...StudentProfileDefaultValues };

    const father = student.parents?.find(
        (p) => !p.name?.toLowerCase().includes("ibu")
    ) || student.parents?.[0];

    const mother = student.parents?.find(
        (p) => p.name?.toLowerCase().includes("ibu")
    ) || (student.parents && student.parents.length > 1 ? student.parents[1] : undefined);

    return {
        first_name: student.first_name || "",
        last_name: student.last_name || "",
        NIK: student.nik || "",
        email: student.email || "",
        new_password: "",
        phone_number: student.phone_number || "",
        gender: student.gender || "L",
        birth_place: student.birth_place || "",
        birth_date: student.birth_date ? String(student.birth_date).split("T")[0] : "",
        address: student.address || "",
        rt: student.rt || "",
        rw: student.rw || "",
        zip_code: student.zip_code || "",

        parent_name: father?.name || "",
        parent_nik: father?.nik || "",
        parent_phone_number: father?.phone_number || "",
        parent_email: father?.email || "",
        parent_occupation: father?.occupation || "",

        mother_name: mother?.name || "",
        mother_nik: mother?.nik || "",
        mother_phone_number: mother?.phone_number || "",
        mother_email: mother?.email || "",
        mother_occupation: mother?.occupation || "",
    };
};
