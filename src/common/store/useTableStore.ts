import { create } from "zustand";

interface TableStoreState {
    isCompact: boolean;
    setIsCompact: (isCompact: boolean) => void;
}

export const useTableStore = create<TableStoreState>((set) => ({
    isCompact: false,
    setIsCompact: (isCompact) => set({ isCompact }),
}));