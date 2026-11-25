import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Pembersihan total localStorage browser client:
// Sesuai instruksi: Token auth (accessToken, refreshToken), active_role, dan profil user
// disimpan murni di COOKIES, bukan di localStorage.
// Seluruh data domain (kalender, jadwal matriks, roster, pengumuman, dsb.) sepenuhnya tersimpan di database backend.
// Satu-satunya yang diperbolehkan di localStorage hanyalah preferensi tema UI (theme).
const ALLOWED_STORAGE_KEYS = new Set([
  "theme",
  "theme_mode",
  "theme_name",
]);

try {
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && !ALLOWED_STORAGE_KEYS.has(key)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key));
} catch {
  // ignore
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
