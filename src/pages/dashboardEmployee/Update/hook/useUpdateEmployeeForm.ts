import { useForm, type Resolver, type UseFormReturn } from "react-hook-form";
import useDashboardEmployeeStore from "../../store";
import type { UpdateEmployeeRequestModel } from "@api/employee/model";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const UpdateEmployeeValidations = zodResolver(z.object({
    niy: z.string().min(1, { message: "NIY tidak boleh kosong" }),
    username: z.string().min(1, { message: "Username tidak boleh kosong" }),
    email: z.string().email({ message: "Format email tidak valid" }).min(1, { message: "Email tidak boleh kosong" }),
    password: z.string().optional().nullable(),
    first_name: z.string().min(1, { message: "First name tidak boleh kosong" }),
    last_name: z.string().optional().nullable(),
    profile_url: z.string().optional().nullable(),
    status: z.boolean().optional(),
    role_ids: z.array(z.string()).optional(),
    detail: z.object({
        phone_number: z.string().optional().nullable(),
        gender: z.enum(["L", "P"]).optional(),
        birth_place: z.string().optional().nullable(),
        birth_date: z.string().optional().nullable(),
        address: z.string().optional().nullable(),
        RT: z.string().optional().nullable(),
        RW: z.string().optional().nullable(),
        zip_code: z.string().optional().nullable(),
        description: z.string().optional().nullable(),
    }).optional()
}));

const useUpdateEmployeeForm = (): { updateEmployeeForm: UseFormReturn<UpdateEmployeeRequestModel> } => {
    const { state } = useDashboardEmployeeStore();
    const d = state.updateEmployeeReqDetails;
    const updateEmployeeForm = useForm<UpdateEmployeeRequestModel>({
        values: {
            niy: d?.niy || "",
            username: d?.user?.username || "",
            email: d?.email || "",
            password: "",
            first_name: d?.first_name || "",
            last_name: d?.last_name || "",
            profile_url: d?.profile_url || "",
            status: d?.status ?? true,
            role_ids: d?.user?.roles?.map(r => r.id) || [],
            detail: {
                gender: d?.detail?.gender || "L",
                phone_number: d?.detail?.phone_number || "",
                birth_place: d?.detail?.birth_place || "",
                address: d?.detail?.address || "",
                birth_date: d?.detail?.birth_date || "",
                RT: d?.detail?.RT || "",
                RW: d?.detail?.RW || "",
                zip_code: d?.detail?.zip_code || "",
                description: d?.detail?.description || "",
            }
        },
        resolver: UpdateEmployeeValidations as Resolver<UpdateEmployeeRequestModel>,
    });
    return { updateEmployeeForm };
};

export default useUpdateEmployeeForm;
