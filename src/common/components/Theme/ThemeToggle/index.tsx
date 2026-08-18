import { useThemeStore } from "../../../store/useThemeStore";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

const THEME_CONFIG = {
  light: {
    icon: <DarkModeIcon fontSize="small" />,
    label: "Switch to Dark Mode",
  },
  dark: {
    icon: <LightModeIcon fontSize="small" />,
    label: "Switch to Light Mode",
  },
} as const;

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();
  const currentConfig = THEME_CONFIG[theme];

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="p-2 rounded-xl transition-all text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
      title={currentConfig.label}
      aria-label={currentConfig.label}
    >
      {currentConfig.icon}
    </button>
  );
}
