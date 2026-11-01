import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface Props {
  portalType: "pegawai" | "siswa";
}

export const AuthBrandPanel: React.FC<Props> = ({ portalType }) => {
  const isPegawai = portalType === "pegawai";

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 480,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        zIndex: 2,
      }}
    >
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: 3,
            bgcolor: "primary.main",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 10px 25px rgba(59, 130, 246, 0.4)",
          }}
        >
          <SchoolIcon sx={{ fontSize: 32 }} />
        </Box>
        <div>
          <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: -0.5, color: "white" }}>
            SMK XAVERIUS
          </Typography>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)", letterSpacing: 1 }}>
            PALEMBANG
          </Typography>
        </div>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Chip
          icon={<ShieldOutlinedIcon sx={{ "&&": { color: "#93c5fd" } }} />}
          label={isPegawai ? "Portal Layanan Pegawai & Guru" : "Portal Layanan Siswa"}
          sx={{
            bgcolor: "rgba(59, 130, 246, 0.15)",
            color: "#bfdbfe",
            border: "1px solid rgba(147, 197, 253, 0.25)",
            fontWeight: 600,
            mb: 2,
          }}
        />

        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            color: "white",
            lineHeight: 1.2,
            mb: 2,
            fontSize: { xs: "2rem", md: "2.5rem" },
          }}
        >
          {isPegawai ? (
            <>
              Sistem Manajemen <br />
              <span className="text-blue-400">Pendidikan & Staff</span>
            </>
          ) : (
            <>
              Portal Belajar & <br />
              <span className="text-cyan-400">Presensi Siswa</span>
            </>
          )}
        </Typography>

        <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>
          {isPegawai
            ? "Akses modul akademik, kurikulum, manajemen siswa, jadwal mengajar, dan administrasi sekolah secara terpadu dan aman."
            : "Pantau kehadiran, jadwal pelajaran, pengumuman sekolah, dan aktivitas belajar Anda dengan mudah dan transparan."}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {[
          isPegawai ? "Autentikasi aman berbasis NIY" : "Akses cepat menggunakan NIS",
          "Dual Token (Access & Refresh) terenkripsi di Cookies",
          "Multi-role switcher & hak akses terproteksi",
        ].map((feat, idx) => (
          <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <CheckCircleIcon sx={{ color: "#34d399", fontSize: 20 }} />
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>
              {feat}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default AuthBrandPanel;
