import { useCallback } from "react";
import useDashboardEffectiveHoursStore from "../../store";

export const useAllocationFilters = () => {
  const { setState } = useDashboardEffectiveHoursStore();

  const handleSearch = useCallback(
    (value: string) => {
      setState((prev) => ({
        ...prev,
        search: { value },
        pagination: { ...prev.pagination, page: 1 },
      }));
    },
    [setState]
  );

  const handleFaseChange = useCallback(
    (fase: "all" | "E" | "F") => {
      setState((prev) => ({
        ...prev,
        filters: { ...prev.filters, fase },
        pagination: { ...prev.pagination, page: 1 },
      }));
    },
    [setState]
  );

  const handleKelasChange = useCallback(
    (kelas: string) => {
      setState((prev) => ({
        ...prev,
        filters: { ...prev.filters, kelas },
        pagination: { ...prev.pagination, page: 1 },
      }));
    },
    [setState]
  );

  const handleMajorChange = useCallback(
    (major: string) => {
      setState((prev) => ({
        ...prev,
        filters: { ...prev.filters, major },
        pagination: { ...prev.pagination, page: 1 },
      }));
    },
    [setState]
  );

  const handleCategoryChange = useCallback(
    (category: string) => {
      setState((prev) => ({
        ...prev,
        filters: { ...prev.filters, category },
        pagination: { ...prev.pagination, page: 1 },
      }));
    },
    [setState]
  );

  const handleSort = useCallback(
    (sort: string) => {
      setState((prev) => ({
        ...prev,
        filters: { ...prev.filters, sort },
      }));
    },
    [setState]
  );

  const handleOrder = useCallback(
    (order_by: "asc" | "desc") => {
      setState((prev) => ({
        ...prev,
        filters: { ...prev.filters, order_by },
      }));
    },
    [setState]
  );

  const handleChangePage = useCallback(
    (page: number) => {
      setState((prev) => ({
        ...prev,
        pagination: { ...prev.pagination, page },
      }));
    },
    [setState]
  );

  return {
    handleSearch,
    handleFaseChange,
    handleKelasChange,
    handleMajorChange,
    handleCategoryChange,
    handleSort,
    handleOrder,
    handleChangePage,
  };
};

export default useAllocationFilters;
