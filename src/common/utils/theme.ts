import definitions from "./definitions.json" with { type: "json" };

export const THEMES = {
  Theme1: "theme1",
  Theme2: "theme2",
} as const;

export type THEMES_TYPE = (typeof THEMES)[keyof typeof THEMES];
export const DEFAULT_THEME: THEMES_TYPE = THEMES.Theme1;

const typedDefinitions: { [theme: string]: { [key: string]: string } } =
  definitions;

export function ResolveThemeProperty(
  property_name: string,
  property_holder: HTMLElement,
): string {
  let parsed: string | undefined;

  for (const defGroup of Object.values(typedDefinitions)) {
    if (defGroup[property_name]) {
      parsed = defGroup[property_name];
      break;
    }
  }

  if (!parsed) {
    throw new Error(`Theme token '${property_name}' could not be found.`);
  }

  if (parsed.startsWith("var(") && parsed.endsWith(")")) {
    parsed = parsed.slice(4, -1).trim();
  }

  const resolvedValue = window
    .getComputedStyle(property_holder)
    .getPropertyValue(parsed)
    .trim();
  if (!resolvedValue) {
    throw new Error(
      `Resolved value for '${property_name}' is empty or invalid.`,
    );
  }

  return resolvedValue;
}

export function ResolveThemePropertyRoot(property_name: string): string {
  return ResolveThemeProperty(property_name, document.documentElement);
}

export const UpdateRootClassTheme = (isDark: boolean) => {
  try {
    const root = document.documentElement;
    root.classList.remove("light-theme");
    root.classList.remove("dark");
    root.classList.remove("dark-theme");
    root.classList.remove("invisible");

    if (isDark) {
      root.classList.add("dark");
      root.classList.add("dark-theme");
    } else {
      root.classList.add("light-theme");
    }
  } catch (err) {
    console.log({ err }, "Error: Failed to switch themes.");
  }
};
