import type { SchoolInformationResponseModel } from "@api/schoolinformation/model";

export type SchoolInformationMappedTable = {
    id: string;
    name_school: string;
    periode: string;
    NPSN: string;
    alamat: string;
    id_headmaster: string;
    status: boolean;
    created_at: string;
    updated_at: string;
    headmaster: {
        id: string;
        user_id: string;
        first_name: string;
        last_name: string;
        name: string;
        niy: string;
        email: string;
        profile_url: string | null;
        status: boolean;
        updated_at: string;
    };
};

export function listTableMapper(data: SchoolInformationResponseModel[]): SchoolInformationMappedTable[] {
    return data.map((item) => ({
        id: item.id_school_information,
        name_school: item.name_school,
        periode: item.periode,
        NPSN: item.NPSN,
        alamat: item.alamat,
        id_headmaster: item.id_headmaster,
        status: item.status,
        created_at: item.created_at,
        updated_at: item.updated_at,
        headmaster: {
            id: item.headmaster?.id ?? "",
            user_id: item.headmaster?.user_id ?? "",
            first_name: item.headmaster?.first_name ?? "",
            last_name: item.headmaster?.last_name ?? "",
            name: `${item.headmaster?.first_name ?? ""} ${item.headmaster?.last_name ?? ""}`.trim(),
            niy: item.headmaster?.niy ?? "",
            email: item.headmaster?.email ?? "",
            profile_url: item.headmaster?.profile_url ?? null,
            status: item.headmaster?.status ?? false,
            updated_at: item.headmaster?.updated_at ?? "",
        },
    }));
}