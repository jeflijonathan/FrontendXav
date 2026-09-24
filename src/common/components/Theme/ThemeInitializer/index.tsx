import React, { useEffect, useMemo } from "react";
import { createTheme, ThemeProvider, type PaletteMode } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useThemeStore } from "../../../store/useThemeStore";
import muiTheme from "@common/consts/themeColor";

const ThemeInitializer = ({ children }: { children: React.ReactNode }) => {
  const { initTheme, theme } = useThemeStore();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  // Pastikan mode bernilai 'light' atau 'dark' untuk TypeScript
  const mode: PaletteMode = theme === "dark" ? "dark" : "light";

  const customMuiTheme = useMemo(() => {
    const currentTheme = muiTheme[mode] || muiTheme.light;
    const isDark = mode === "dark";

    return createTheme({
      palette: {
        mode: mode,
        primary: {
          main: currentTheme.primary || "#2563eb",
        },
        background: {
          default: currentTheme.background || (isDark ? "#09090b" : "#ffffff"),
          paper: isDark ? "#141416" : "#ffffff",
        },
        text: {
          primary: currentTheme.text || (isDark ? "#f4f4f5" : "#09090b"),
          secondary: isDark ? "#a1a1aa" : "#71717a",
        },
        divider: currentTheme.divider || (isDark ? "#27272a" : "#e4e4e7"),
      },
      components: {
        MuiOutlinedInput: {
          styleOverrides: {
            root: {
              borderRadius: "10px",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: isDark ? "#27272a" : "#e4e4e7",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: isDark ? "#3b82f6" : "#2563eb",
              },
            },
          },
        },
        MuiInputLabel: {
          styleOverrides: {
            root: {
              color: isDark ? "#a1a1aa" : "#71717a",
            },
          },
        },
        MuiSelect: {
          styleOverrides: {
            icon: {
              color: isDark ? "#a1a1aa" : "#71717a",
            },
          },
        },
        MuiMenuItem: {
          styleOverrides: {
            root: {
              "&:hover": {
                backgroundColor: isDark ? "#27272a" : "#e4e4e7",
              },
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: "none",
              borderStyle: "solid",
              borderWidth: "1px",
              borderColor: isDark ? "#18181b" : "#e4e4e7",
            },
          },
        },
      },
    });
  }, [mode]);

  return (
    <ThemeProvider theme={customMuiTheme}>
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  );
};

export default ThemeInitializer;