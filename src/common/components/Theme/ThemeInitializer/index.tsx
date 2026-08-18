import React, { useEffect, useMemo } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useThemeStore } from "../../../store/useThemeStore";

const ThemeInitializer = ({ children }: { children: React.ReactNode }) => {
  const { initTheme, theme } = useThemeStore();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: theme,
          primary: {
            main: theme === "dark" ? "#3b82f6" : "#2563eb",
          },
          background: {
            default: theme === "dark" ? "#09090b" : "#ffffff",
            paper: theme === "dark" ? "#09090b" : "#ffffff",
          },
          text: {
            primary: theme === "dark" ? "#fafafa" : "#09090b",
            secondary: theme === "dark" ? "#a1a1aa" : "#71717a",
          },
          divider: theme === "dark" ? "#18181b" : "#e4e4e7",
        },
        components: {
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                borderRadius: "10px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme === "dark" ? "#27272a" : "#e4e4e7",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme === "dark" ? "#3b82f6" : "#2563eb",
                },
              },
            },
          },
          MuiInputLabel: {
            styleOverrides: {
              root: {
                color: theme === "dark" ? "#a1a1aa" : "#71717a",
              },
            },
          },
          MuiSelect: {
            styleOverrides: {
              icon: {
                color: theme === "dark" ? "#a1a1aa" : "#71717a",
              },
            },
          },
          MuiMenuItem: {
            styleOverrides: {
              root: {
                "&:hover": {
                  backgroundColor: theme === "dark" ? "#27272a" : "#e4e4e7",
                },
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
                backgroundColor: theme === "dark" ? "#141416" : "#ffffff",
                border: `1px solid ${theme === "dark" ? "#18181b" : "#e4e4e7"}`,
              },
            },
          },
        },
      }),
    [theme],
  );

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  );
};

export default ThemeInitializer;
