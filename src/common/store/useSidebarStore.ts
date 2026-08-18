import { create, useStore } from "zustand";

type SidebarStore = {
  isSidebarOpen: boolean;
  handleSidebarToggle: () => void;
};

const initialState = {
  isSidebarOpen: true,
};

const useSidebarStore = create<SidebarStore>((set) => ({
  ...initialState,
  handleSidebarToggle: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));

export default useSidebarStore;
export { type SidebarStore };
