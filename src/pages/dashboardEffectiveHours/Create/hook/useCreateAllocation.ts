import { useFormContext } from "react-hook-form";
import useDashboardEffectiveHoursStore from "../../store";
import EffectiveWeekService from "@api/effectiveweek/service";
import { snackbar } from "@utils/snackbar";
import type { CreateAllocationFormData } from "../utils/createAllocationForm";

export const useCreateAllocation = () => {
  const { handleSubmit, reset } = useFormContext<CreateAllocationFormData>();
  const { state, setState } = useDashboardEffectiveHoursStore();
  const service = new EffectiveWeekService();

  const handleCreate = (onSuccessCallback?: () => void) => {
    return handleSubmit(
      async (payload) => {
        if (!payload.id_majors || payload.id_majors.length === 0) {
          snackbar.error("Minimal 1 jurusan harus dipilih");
          return;
        }

        const selectedMajors = payload.id_majors;

        // Cek duplikat: subject yang sama + kelas yang sama
        const existing = state.data.find(
          (d) =>
            d.id_subject === payload.id_subject &&
            (d.kelas || "").toUpperCase().trim() === (payload.kelas || "").toUpperCase().trim()
        );

        if (existing) {
          const subjectName =
            state.subjectsList.find((s) => s.id === payload.id_subject)?.name ||
            "Mata pelajaran ini";
          snackbar.error(
            `${subjectName} di Kelas ${payload.kelas} sudah ada dalam alokasi. Gunakan tabel untuk mengubah alokasinya.`
          );
          return;
        }

        setState((prev) => ({ ...prev, isCreateLoading: true }));

        try {
          const reqData = {
            id_subject: payload.id_subject,
            id_school_information: state.selectedSchoolInfoId || undefined,
            id_major: selectedMajors[0] || null,
            id_majors: selectedMajors,
            Alokasi_Intrakurikuler: Number(payload.Alokasi_Intrakurikuler ?? 0),
            Alokasi_Kokurikuler: Number(payload.Alokasi_Kokurikuler ?? 0),
            rombel: `Kelas ${payload.kelas}`,
          };

          await new Promise<void>((resolve, reject) => {
            service.create(reqData, {
              onSuccess: () => resolve(),
              onError: (err: any) => reject(new Error(err.message || "Gagal menyimpan alokasi")),
            });
          });

          // Refresh data dari backend
          service.getAll(
            {
              onSuccess: (res: any) => {
                setState((prev) => ({
                  ...prev,
                  data: res?.data || [],
                  isCreateLoading: false,
                }));
              },
              onError: () => {
                setState((prev) => ({ ...prev, isCreateLoading: false }));
              },
            },
            { params: state.selectedSchoolInfoId ? { id_school_information: state.selectedSchoolInfoId } : {} }
          );

          snackbar.success("Alokasi beban mengajar berhasil ditambahkan");
          reset();
          onSuccessCallback?.();
        } catch (err: any) {
          setState((prev) => ({ ...prev, isCreateLoading: false }));
          snackbar.error(err.message || "Gagal menambahkan alokasi beban mengajar");
        }
      },
      (errors) => {
        const firstError = Object.values(errors)[0]?.message;
        snackbar.error((firstError as string) || "Mohon lengkapi formulir alokasi dengan benar.");
      }
    )();
  };

  return { handleCreate };
};

export default useCreateAllocation;
