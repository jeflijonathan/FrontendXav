import { useForm, type Resolver, type UseFormReturn } from "react-hook-form";
import useDashboardStudentStore from "../../store";
import type { UpdateStudentRequestModel } from "@api/student/model";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const UpdateStudentValidations = zodResolver(
    z.object({
        nis: z.string().optional(),
        nisn: z.string().optional(),
        first_name: z.string().optional(),
        last_name: z.string().optional(),
        email: z.string().optional().refine(val => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
            message: "Format email tidak valid",
        }),
        password: z.string().optional().refine(val => !val || val.length >= 6, {
            message: "Password minimal 6 karakter",
        }),
        phone_number: z.string().optional().nullable(),
        gender: z.enum(["L", "P"]).optional(),
        birth_place: z.string().optional().nullable(),
        birth_date: z.string().optional().nullable(),
        address: z.string().optional().nullable(),
        rt: z.string().optional().nullable(),
        rw: z.string().optional().nullable(),
        zip_code: z.string().optional().nullable(),
        status: z.boolean().optional(),
        role_ids: z.array(z.string()).optional(),
        profile_url: z.string().optional().nullable(),

        // Data Orang Tua
        parent_name: z.string().optional(),
        parent_nik: z.string().optional(),
        parent_phone_number: z.string().optional().nullable(),
        parent_email: z.string().optional().refine(val => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
            message: "Format email orang tua tidak valid",
        }),
        parent_occupation: z.string().optional(),
        parent_income: z.string().optional(),

        mother_name: z.string().optional(),
        mother_nik: z.string().optional(),
        mother_phone_number: z.string().optional().nullable(),
        mother_email: z.string().optional().refine(val => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
            message: "Format email ibu tidak valid",
        }),
        mother_occupation: z.string().optional(),
        mother_income: z.string().optional(),
    })
);

const useUpdateStudentForm = (): { updateStudentForm: UseFormReturn<UpdateStudentRequestModel> } => {
    const { state } = useDashboardStudentStore();
    const d = state.updateStudentReqDetails;
    const parent1 = d?.parents?.[0];
    const parent2 = d?.parents?.[1];

    const updateStudentForm = useForm<UpdateStudentRequestModel>({
        values: {
            nis: d?.nis || "",
            nisn: d?.nisn || "",
            first_name: d?.first_name || "",
            last_name: d?.last_name || "",
            email: (d as any)?.email || "",
            password: "",
            phone_number: d?.phone_number || "",
            gender: d?.gender || "L",
            birth_place: d?.birth_place || "",
            birth_date: d?.birth_date || "",
            address: d?.address || "",
            rt: d?.rt || "",
            rw: d?.rw || "",
            zip_code: d?.zip_code || "",
            status: d?.status ?? true,
            role_ids: d?.role_ids || d?.roles?.map((r) => r.id) || [],
            profile_url: d?.profile_url || "",

            // Data Orang Tua
            parent_name: parent1?.name || "",
            parent_nik: parent1?.nik || "",
            parent_phone_number: parent1?.phone_number || "",
            parent_email: parent1?.email || "",
            parent_occupation: parent1?.occupation || "",
            parent_income: parent1?.income || "",

            mother_name: parent2?.name || "",
            mother_nik: parent2?.nik || "",
            mother_phone_number: parent2?.phone_number || "",
            mother_email: parent2?.email || "",
            mother_occupation: parent2?.occupation || "",
            mother_income: parent2?.income || "",
        },
        resolver: UpdateStudentValidations as Resolver<UpdateStudentRequestModel>,
    });
    return { updateStudentForm };
};

export default useUpdateStudentForm;
