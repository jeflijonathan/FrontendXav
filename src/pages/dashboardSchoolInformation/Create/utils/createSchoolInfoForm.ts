import type { CreateSchoolInformationRequest, SchoolInformationResponseModel } from "@api/schoolinformation/model";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export const CreateSchoolInformationReqDefaultValues: CreateSchoolInformationRequest = {
    name_school: "",
    periode: "",
    NPSN: "",
    id_headmaster: "",
    alamat: "",
    status: true,
};

export const CreateSchoolInfoValidations = zodResolver(
    z.object({
        name_school: z.string().min(1, { message: "School name is required" }),
        periode: z.string().min(1, { message: "Tahun ajaran is required" }).refine((val) => {
            const [start, end] = val.split("/");
            if (!start || !end) return false;
            return parseInt(end) > parseInt(start);
        }, { message: "Tahun selesai harus lebih besar dari tahun mulai" }),
        NPSN: z.string().min(1, { message: "NPSN is required" }),
        id_headmaster: z.string().min(1, { message: "Kepala sekolah is required" }),
        alamat: z.string().min(1, { message: "Alamat is required" }),
        status: z.preprocess((val) => {
            if (typeof val === "string") {
                return val === "true";
            }
            return val;
        }, z.boolean({ message: "Status is required" })),
    })
);

export const CreateSchoolInfoDetailsFormatter = (
    data: CreateSchoolInformationRequest
): CreateSchoolInformationRequest => {
    return {
        name_school: data?.name_school || "",
        periode: data?.periode || "",
        NPSN: data?.NPSN || "",
        id_headmaster: data?.id_headmaster || "",
        alamat: data?.alamat || "",
        status: data?.status ?? true,
    };
};