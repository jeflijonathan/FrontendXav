import { useEffect, useState } from "react";
import EmployeeService from "@api/employee/service";
import type { AcademicTitleModel } from "@api/employee/model";

export const DEFAULT_TITLES_DEPAN = [
    "Drs.", "Dra.", "Dr.", "Prof.", "Ir.", "H.", "Hj.", 
    "K.H.", "Ust.", "Usth.", "Br.", "Fr.", "Sr.", "Rm.", "Pdt.", "R."
];

export const DEFAULT_TITLES_BELAKANG = [
    "S.Pd.", "S.Kom.", "S.T.", "S.Si.", "S.E.", "S.Sos.", "S.Ag.", "S.H.", "S.Psi.",
    "S.Stat.", "S.Tr.Kom.", "S.Tr.T.", "S.Ds.", "S.Sn.", "S.S.",
    "M.Pd.", "M.Kom.", "M.T.", "M.Si.", "M.M.", "M.Sc.", "M.Eng.", "M.A.", "M.B.A.",
    "M.Sn.", "M.Ag.", "M.H.", "Ph.D.", "Ed.D.", "D.Eng.", "Gr.", "Kons.",
    "B.A.", "B.Sc.", "B.Eng.", "A.Md.", "A.Md.Kom.", "A.Md.T."
];

export interface TitleOption {
    name: string;
    description?: string | null;
}

export const useAcademicTitles = () => {
    const [titles, setTitles] = useState<AcademicTitleModel[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const service = new EmployeeService();
        service.getAcademicTitles({
            onSuccess: (data) => {
                if (Array.isArray(data) && data.length > 0) {
                    setTitles(data);
                }
            },
            onError: (err) => {
                console.warn("Gagal memuat gelar akademik dari server, menggunakan daftar default", err);
            },
            onFullfilled: () => setIsLoading(false)
        });
    }, []);

    const depanFromApi = titles.filter(t => t.type === "depan").map(t => t.name);
    const belakangFromApi = titles.filter(t => t.type === "belakang").map(t => t.name);

    const titlesDepanOptions: string[] = Array.from(
        new Set([...depanFromApi, ...DEFAULT_TITLES_DEPAN])
    );

    const titlesBelakangOptions: string[] = Array.from(
        new Set([...belakangFromApi, ...DEFAULT_TITLES_BELAKANG])
    );

    const getTitleDescription = (name: string): string | undefined => {
        const found = titles.find(t => t.name.toLowerCase() === name.toLowerCase());
        return found?.description || undefined;
    };

    return {
        titles,
        titlesDepanOptions,
        titlesBelakangOptions,
        getTitleDescription,
        isLoading
    };
};
