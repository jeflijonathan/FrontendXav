import useDashboardEffectiveHoursStore from "../../store";
import EffectiveWeekService from "@api/effectiveweek/service";
import { snackbar } from "@utils/snackbar";

export const useDeleteAllocation = () => {
  const { setState } = useDashboardEffectiveHoursStore();
  const service = new EffectiveWeekService();

  const handleDelete = async (id: string, onSuccessCallback?: () => void) => {
    setState((prev) => ({ ...prev, isDeleteLoading: true }));

    await service.delete(id, {
      onSuccess: () => {
        setState((prev) => ({
          ...prev,
          isDeleteLoading: false,
          data: prev.data.filter((item) => item.id_effective_week !== id && item.id !== id),
        }));
        snackbar.success("Alokasi mapel berhasil dihapus");
        onSuccessCallback?.();
      },
      onError: (err: any) => {
        setState((prev) => ({ ...prev, isDeleteLoading: false }));
        snackbar.error(err.message || "Gagal menghapus alokasi mapel");
      },
    });
  };

  return { handleDelete };
};

export default useDeleteAllocation;

