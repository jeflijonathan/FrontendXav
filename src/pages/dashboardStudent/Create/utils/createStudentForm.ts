import type { CreateStudentRequestModel } from "@api/student/model";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export const CreateStudentDefaultValues: CreateStudentRequestModel = {
    nis: "",
    nisn: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone_number: "",
    gender: "L",
    birth_place: "",
    birth_date: "",
    address: "",
    rt: "",
    rw: "",
    zip_code: "",
    status: true,
    role_ids: [],

    // Data Orang Tua
    parent_name: "",
    parent_nik: "",
    parent_phone_number: "",
    parent_email: "",
    parent_occupation: "",
    parent_income: "",

    mother_name: "",
    mother_nik: "",
    mother_phone_number: "",
    mother_email: "",
    mother_occupation: "",
    mother_income: "",
};

export const CreateStudentValidations = zodResolver(
    z.object({
        nis: z.string().min(1, { message: "NIS wajib diisi" }),
        nisn: z.string()
            .min(1, { message: "NISN wajib diisi" })
            .length(10, { message: "NISN harus tepat 10 digit" })
            .regex(/^\d{10}$/, { message: "NISN harus berupa 10 digit angka" }),
        first_name: z.string().min(1, { message: "Nama depan wajib diisi" }),
        last_name: z.string().min(1, { message: "Nama belakang wajib diisi" }),
        email: z.string()
            .min(1, { message: "Email siswa wajib diisi" })
            .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: "Format email tidak valid" }),
        password: z.string().min(6, { message: "Password minimal 6 karakter" }),
        phone_number: z.string().optional(),
        gender: z.enum(["L", "P"], { message: "Jenis kelamin wajib dipilih" }),
        birth_place: z.string().optional(),
        birth_date: z.string().optional(),
        address: z.string().optional(),
        rt: z.string().optional(),
        rw: z.string().optional(),
        zip_code: z.string().optional(),
        status: z.boolean().optional(),
        role_ids: z.array(z.string()).min(1, { message: "Minimal harus memilih 1 role (Siswa)" }),

        // Data Orang Tua
        parent_name: z.string().optional(),
        parent_nik: z.string().optional(),
        parent_phone_number: z.string().optional(),
        parent_email: z.string().optional().refine(val => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
            message: "Format email orang tua tidak valid",
        }),
        parent_occupation: z.string().optional(),
        parent_income: z.string().optional(),

        mother_name: z.string().optional(),
        mother_nik: z.string().optional(),
        mother_phone_number: z.string().optional(),
        mother_email: z.string().optional().refine(val => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
            message: "Format email ibu tidak valid",
        }),
        mother_occupation: z.string().optional(),
        mother_income: z.string().optional(),
    })
);

export const CreateStudentDetailsFormatter = (data?: Partial<CreateStudentRequestModel>): CreateStudentRequestModel => ({
    nis: data?.nis || "",
    nisn: data?.nisn || "",
    first_name: data?.first_name || "",
    last_name: data?.last_name || "",
    email: data?.email || "",
    password: data?.password || "",
    phone_number: data?.phone_number || "",
    gender: data?.gender || "L",
    birth_place: data?.birth_place || "",
    birth_date: data?.birth_date || "",
    address: data?.address || "",
    rt: data?.rt || "",
    rw: data?.rw || "",
    zip_code: data?.zip_code || "",
    status: data?.status ?? true,
    role_ids: data?.role_ids || [],

    parent_name: data?.parent_name || "",
    parent_nik: data?.parent_nik || "",
    parent_phone_number: data?.parent_phone_number || "",
    parent_email: data?.parent_email || "",
    parent_occupation: data?.parent_occupation || "",
    parent_income: data?.parent_income || "",

    mother_name: data?.mother_name || "",
    mother_nik: data?.mother_nik || "",
    mother_phone_number: data?.mother_phone_number || "",
    mother_email: data?.mother_email || "",
    mother_occupation: data?.mother_occupation || "",
    mother_income: data?.mother_income || "",
});
