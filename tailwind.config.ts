import type { Config } from "tailwindcss";
import definitions from "./src/common/utils/definitions.json";

export default {
  safelist: [{ pattern: /bg-+/ }],
  darkMode: "selector",
  content: ["./index.html", "./src/**/*.{html,js,ts,jsx,tsx,json}"],
  theme: {
    extend: {
      ...definitions,
      fontFamily: {
        sans: ["sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/container-queries")],
} as Config;
