import { create } from "zustand";
import {
  DEFAULT_THEME,
  UpdateRootClassTheme,
  type THEMES_TYPE,
} from "../utils/theme";

type Theme = "light" | "dark";

type ThemeState = {
  theme: Theme;
  themeToUse: string;
  toggleTheme: () => void;
  applyTheme: (newTheme: string) => void;
  initTheme: () => void;
};

const applyDOMChanges = (theme: Theme, themeToUse: string) => {
  UpdateRootClassTheme(theme === "dark");

  const themeLink = document.getElementById(
    "theme-link",
  ) as HTMLLinkElement | null;
  if (themeLink) {
    themeLink.href = `src/styles/themes/${themeToUse}.css`;
  }
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: "light",
  themeToUse: DEFAULT_THEME,

  initTheme: () => {
    if (typeof window === "undefined") return;

    const storedTheme =
      (window.localStorage.getItem("theme") as THEMES_TYPE) || DEFAULT_THEME;

    const initialTheme: Theme = storedTheme.includes("dark") ? "dark" : "light";

    set({ theme: initialTheme, themeToUse: storedTheme });
    applyDOMChanges(initialTheme, storedTheme);
  },

  toggleTheme: () => {
    const nextTheme: Theme = get().theme === "light" ? "dark" : "light";
    set({ theme: nextTheme });

    applyDOMChanges(nextTheme, get().themeToUse);
  },

  applyTheme: (newTheme: string) => {
    set({ themeToUse: newTheme });
    if (typeof window !== "undefined") {
      window.localStorage.setItem("theme", newTheme);
    }

    // Sinkronisasi ke DOM
    applyDOMChanges(get().theme, newTheme);
  },
}));
