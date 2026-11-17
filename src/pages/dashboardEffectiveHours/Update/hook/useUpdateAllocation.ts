import { useFormContext } from "react-hook-form";
import useDashboardEffectiveHoursStore from "../../store";
import EffectiveWeekService from "@api/effectiveweek/service";
import { snackbar } from "@utils/snackbar";
import type { UpdateAllocationFormData } from "../utils/updateAllocationForm";

export const useUpdateAllocation = () => {
  const { handleSubmit } = useFormContext<UpdateAllocationFormData>();
  const { state, setState } = useDashboardEffectiveHoursStore();
  const service = new EffectiveWeekService();

  const handleUpdate = (id: string, onSuccessCallback?: () => void) => {
    return handleSubmit(
      async (payload) => {
        const idMajors =
          payload.id_majors && payload.id_majors.length > 0
            ? payload.id_majors
            : payload.id_major
            ? [payload.id_major]
            : [];

        if (idMajors.length === 0) {
          snackbar.error("Minimal 1 jurusan harus dipilih");
          return;
        }

        setState((prev) => ({ ...prev, isUpdateLoading: true }));

        const reqData = {
          id_subject: payload.id_subject,
          id_major: idMajors[0] || null,
          id_majors: idMajors,
          Alokasi_Intrakurikuler: Number(payload.Alokasi_Intrakurikuler || 0),
          Alokasi_Kokurikuler: Number(payload.Alokasi_Kokurikuler || 0),
          rombel: `Kelas ${payload.kelas}`,
        };

        service.update(id, reqData, {
          onSuccess: () => {
            // Refresh data dari backend agar tampilan terupdate
            service.getAll(
              {
                onSuccess: (res: any) => {
                  setState((prev) => ({
                    ...prev,
                    data: res?.data || [],
                    isUpdateLoading: false,
                    updateDetails: null,
                  }));
                },
                onError: () => {
                  setState((prev) => ({ ...prev, isUpdateLoading: false }));
                },
              },
              { params: state.selectedSchoolInfoId ? { id_school_information: state.selectedSchoolInfoId } : {} }
            );
            snackbar.success("Alokasi beban mengajar berhasil diperbarui");
            onSuccessCallback?.();
          },
          onError: (err: any) => {
            setState((prev) => ({ ...prev, isUpdateLoading: false }));
            snackbar.error(err.message || "Gagal memperbarui alokasi beban mengajar");
          },
        });
      },
      (errors) => {
        const firstError = Object.values(errors)[0]?.message;
        snackbar.error((firstError as string) || "Mohon periksa kolom formulir yang belum sesuai.");
      }
    )();
  };

  return { handleUpdate };
};

export default useUpdateAllocation;

