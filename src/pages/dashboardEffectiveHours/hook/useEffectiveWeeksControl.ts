import { useCallback } from "react";
import useDashboardEffectiveHoursStore from "../store";
import { NATIONAL_REGULATION } from "../utils/allocationBusinessLogic";

export const useEffectiveWeeksControl = () => {
  const { state, setState } = useDashboardEffectiveHoursStore();

  const setWeeks = useCallback(
    (newVal: number) => {
      const clamped = Math.max(
        NATIONAL_REGULATION.MIN_EFFECTIVE_WEEKS,
        Math.min(NATIONAL_REGULATION.MAX_EFFECTIVE_WEEKS, newVal)
      );
      setState((prev) => ({ ...prev, effectiveWeeks: clamped }));
    },
    [setState]
  );

  const incrementWeeks = useCallback(() => {
    setState((prev) => {
      if (prev.effectiveWeeks >= NATIONAL_REGULATION.MAX_EFFECTIVE_WEEKS) return prev;
      return { ...prev, effectiveWeeks: prev.effectiveWeeks + 1 };
    });
  }, [setState]);

  const decrementWeeks = useCallback(() => {
    setState((prev) => {
      if (prev.effectiveWeeks <= NATIONAL_REGULATION.MIN_EFFECTIVE_WEEKS) return prev;
      return { ...prev, effectiveWeeks: prev.effectiveWeeks - 1 };
    });
  }, [setState]);

  return {
    effectiveWeeks: state.effectiveWeeks,
    minWeeks: NATIONAL_REGULATION.MIN_EFFECTIVE_WEEKS,
    maxWeeks: NATIONAL_REGULATION.MAX_EFFECTIVE_WEEKS,
    nationalDivider: NATIONAL_REGULATION.NATIONAL_DIVIDER,
    academicYear: state.academicYear,
    setWeeks,
    incrementWeeks,
    decrementWeeks,
  };
};

export default useEffectiveWeeksControl;

