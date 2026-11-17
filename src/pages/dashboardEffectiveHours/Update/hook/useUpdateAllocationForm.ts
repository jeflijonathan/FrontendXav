import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import useDashboardEffectiveHoursStore from "../../store";
import {
  UpdateAllocationValidationSchema,
  updateAllocationDetailsFormatter,
  type UpdateAllocationFormData,
} from "../utils/updateAllocationForm";

export const useUpdateAllocationForm = () => {
  const { state } = useDashboardEffectiveHoursStore();

  const initialValues = useMemo(
    () => updateAllocationDetailsFormatter(state.updateDetails),
    [state.updateDetails]
  );

  const methods = useForm<UpdateAllocationFormData>({
    resolver: UpdateAllocationValidationSchema,
    defaultValues: initialValues,
    values: initialValues,
    mode: "onChange",
  });

  useEffect(() => {
    if (state.updateDetails) {
      methods.reset(updateAllocationDetailsFormatter(state.updateDetails));
    }
  }, [state.updateDetails, methods]);

  return methods;
};

export default useUpdateAllocationForm;

