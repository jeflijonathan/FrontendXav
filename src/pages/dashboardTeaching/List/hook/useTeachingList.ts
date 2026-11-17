import { useDashboardTeachingStore } from "../../store";
import TeachingService from "@api/teaching/service";
import EmployeeService from "@api/employee/service";
import SubjectService from "@api/subject/service";
import ClassService from "@api/class/service";
import SchoolInformationService from "@api/schoolinformation/service";
import EffectiveWeekService from "@api/effectiveweek/service";
import { snackbar } from "@utils/snackbar";
import type { FilterParams, SortOptionType } from "@common/types";
import type { TableHeaderType } from "@components/Table/TableBody";
import type { TeachingPeriodModel } from "@api/teaching/model";
import type { EmployeeResponseModel } from "@api/employee/model";
import type { SubjectResponseModel } from "@api/subject/model";
import type { ClassResponseModel } from "@api/class/model";

export const teachingHeaders: TableHeaderType[] = [
    { label: "Nama Guru", width: "200px" },
    { label: "Mata Pelajaran", width: "220px" },
    { label: "Jumlah JP", width: "110px" },
    { label: "Kelas Diampu", width: "180px" },
    { label: "Periode", width: "110px" },
    { label: "Total JP yang Diambil", width: "150px" },
];

export const teachingSortOptions: SortOptionType[] = [
    { label: "Nama Guru", value: "first_name" },
    { label: "NIY", value: "niy" },
    { label: "Jumlah Mapel", value: "total_subjects" },
];

const isGuru = (employee: EmployeeResponseModel): boolean =>
    (employee.user?.roles ?? []).some(
        (role) => (role.name || "").toLowerCase() === "guru"
    );

const useTeachingList = () => {
    const { state, setState } = useDashboardTeachingStore();
    const teachingService = new TeachingService();
    const employeeService = new EmployeeService();
    const subjectService = new SubjectService();
    const classService = new ClassService();
    const schoolInformationService = new SchoolInformationService();
    const effectiveWeekService = new EffectiveWeekService();

    const fetchTeachingList = async (filterParams: FilterParams) => {
        setState((prev) => ({ ...prev, isLoading: true }));
        await teachingService.getAll(
            {
                onSuccess: (res) => {
                    setState((prev) => ({
                        ...prev,
                        data: res.data || [],
                        pagination: res.pagination,
                        isLoading: false,
                    }));
                },
                onError: (err) => {
                    snackbar.error(err.message || "Gagal memuat data pengajar");
                    setState((prev) => ({ ...prev, isLoading: false }));
                },
            },
            filterParams
        );
    };

    const fetchDropdownOptions = async () => {
        teachingService.getPeriods({
            onSuccess: (periods: TeachingPeriodModel[]) => {
                setState((prev) => ({ ...prev, periods }));
            },
            onError: () => {},
        });

        schoolInformationService.getAll(
            {
                onSuccess: (res) => {
                    setState((prev) => ({
                        ...prev,
                        schoolInformations: res.data || [],
                    }));
                },
                onError: () => {},
            },
            { params: { page: 1, limit: 100 } }
        );

        employeeService.getAll(
            {
                onSuccess: (res) => {
                    const list = res.data || [];
                    const guruList = list.filter(isGuru);
                    setState((prev) => ({
                        ...prev,
                        // Kalau role "guru" belum diisi di data, tetap tampilkan semua pegawai.
                        employees: guruList.length > 0 ? guruList : list,
                    }));
                },
                onError: () => {},
            },
            { params: { page: 1, limit: 100 } }
        );

        subjectService.getAll(
            {
                onSuccess: (res) => {
                    const list: SubjectResponseModel[] = res.data || [];
                    setState((prev) => ({
                        ...prev,
                        subjects: [...list].sort((a, b) =>
                            (a.name || "").localeCompare(b.name || "")
                        ),
                    }));
                },
                onError: () => {},
            },
            { params: { page: 1, limit: 100 } }
        );

        classService.getAll(
            {
                onSuccess: (res) => {
                    const list: ClassResponseModel[] = res.data || [];
                    setState((prev) => ({
                        ...prev,
                        classes: [...list].sort((a, b) =>
                            (a.name || "").localeCompare(b.name || "")
                        ),
                    }));
                },
                onError: () => {},
            },
            { params: { page: 1, limit: 100 } }
        );

        effectiveWeekService.getAll(
            {
                onSuccess: (res) => {
                    setState((prev) => ({
                        ...prev,
                        effectiveWeeks: res.data || [],
                    }));
                },
                onError: () => {},
            },
            { params: { page: 1, limit: 100 } }
        );
    };

    return {
        state,
        teachingHeaders,
        sortOptions: teachingSortOptions,
        fetchTeachingList,
        fetchDropdownOptions,
    };
};

export default useTeachingList;
