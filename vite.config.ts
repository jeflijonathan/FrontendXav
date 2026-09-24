import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    tsconfigPaths: true,
    alias: {
      "@components": path.resolve(__dirname, "src/common/components"),
      "@hooks": path.resolve(__dirname, "src/common/hooks"),
      "@utils": path.resolve(__dirname, "src/common/utils"),
      "@types": path.resolve(__dirname, "src/common/types"),
      "@api": path.resolve(__dirname, "src/api"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@common": path.resolve(__dirname, "src/common"),
    },
  },
});

