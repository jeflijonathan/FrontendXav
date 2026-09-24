import useDashboardTeacherSubjectStore from "../../store";
import TeacherSubjectService from "@api/teachersubject/service";
import { useSnackbar } from "notistack";
import { filterMapper } from "@common/utils/filterMapper";

const useTeacherSubjectList = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { state, setState } = useDashboardTeacherSubjectStore();

    const fetchList = async () => {
        setState((prev) => ({ ...prev, isLoading: true }));
        const filterParams = filterMapper(state);
        await new TeacherSubjectService().getAll({ onSuccess: (res: any) => {
                        setState((prev) => ({
                            ...prev,
                            data: res.data || [],
                            pagination: {
                                total_data: res.pagination?.total_data || 0,
                                total_pages: res.pagination?.total_pages || 1,
                                page: res.pagination?.page || 1,
                                limit: res.pagination?.limit || 10,
                            },
                            isLoading: false,
                        }));
                    }, onError: (err: any) => {
                        enqueueSnackbar(err.message || "Failed to fetch teacher subjects", { variant: "error" });
                        setState((prev) => ({ ...prev, isLoading: false }));
                    } }, { params: filterParams });
    };

    const tableHeader = [
        { label: "Teacher (Guru)", key: "teacher" },
        { label: "Subject (Mata Pelajaran)", key: "subject" },
        { label: "Category", key: "category" },
        { label: "JP Amount", key: "jp_amount" },
        { label: "Status", key: "status" },
        { label: "Created At", key: "created_at" },
        { label: "Action", key: "action" },
    ];

    return {
        tableData: state.data,
        tableHeader,
        fetchList,
    };
};

export default useTeacherSubjectList;
