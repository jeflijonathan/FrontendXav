import { useStore } from "zustand";
import type { SidebarStore } from "../store/useSidebarStore";
import useSidebarStore from "../store/useSidebarStore";

const useSidebarActions = () => {
  const isSidebarOpen = useStore(
    useSidebarStore,
    (state: SidebarStore) => state.isSidebarOpen,
  );

  const handleMenu = useStore(
    useSidebarStore,
    (state: SidebarStore) => state.handleSidebarToggle,
  );

  return { isSidebarOpen, handleMenu };
};

export default useSidebarActions;
