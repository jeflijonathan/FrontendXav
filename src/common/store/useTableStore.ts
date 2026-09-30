import { create } from "zustand";

interface TableStoreState {
    isCompact: boolean;
    containerWidth: number;
    setIsCompact: (isCompact: boolean) => void;
    setContainerWidth: (width: number) => void;
}

export const useTableStore = create<TableStoreState>((set) => ({
    isCompact: false,
    containerWidth: 1000,
    setIsCompact: (isCompact) => set({ isCompact }),
    setContainerWidth: (containerWidth) => set({ containerWidth }),
}));