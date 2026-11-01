import React from "react";
import { Box, Button, Typography, Chip, Paper } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@common/store/useAuthStore";

interface Props {
  allowedRoles?: string[];
  pageName?: string;
}

export const UnauthorizedPage: React.FC<Props> = ({
  allowedRoles = ["TU", "kurikulum"],
  pageName = "Halaman ini",
}) => {
  const navigate = useNavigate();
  const { user, activeRole, setIsRoleModalOpen } = useAuthStore();

  const formattedAllowed = allowedRoles
    .map((r) => r.toUpperCase())
    .join(", ");

  const hasEligibleRole = user?.roles.some((r) =>
    allowedRoles.map((a) => a.toLowerCase()).includes(r.name.toLowerCase())
  );

  return (
    <Box
      sx={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 520,
          width: "100%",
          p: 4,
          borderRadius: 4,
          textAlign: "center",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            bgcolor: "error.light",
            color: "error.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 2.5,
          }}
        >
          <LockOutlinedIcon sx={{ fontSize: 36 }} />
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          Akses Terbatas
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {pageName} hanya dapat diakses oleh akun dengan role{" "}
          <strong>{formattedAllowed}</strong>.
        </Typography>

        <Box
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 2,
            bgcolor: "action.hover",
            display: "flex",
            flexDirection: "column",
            gap: 1,
            alignItems: "center",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Role Aktif Anda Saat Ini:
          </Typography>
          <Chip
            label={activeRole ? activeRole.toUpperCase() : "Belum Memilih Role"}
            color="primary"
            variant="outlined"
            size="small"
            sx={{ fontWeight: 600, fontSize: "0.85rem" }}
          />

          {hasEligibleRole && (
            <Typography variant="caption" color="success.main" sx={{ mt: 0.5, fontWeight: 500 }}>
              Akun Anda memiliki role yang memenuhi syarat! Silakan ganti role aktif Anda di bawah.
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", gap: 1.5, justifyContent: "center", flexWrap: "wrap" }}>
          {hasEligibleRole && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<SwitchAccountIcon />}
              onClick={() => setIsRoleModalOpen(true)}
              sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
            >
              Ganti Role Aktif
            </Button>
          )}

          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/dashboard")}
            sx={{ borderRadius: 2, textTransform: "none" }}
          >
            Ke Dashboard
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default UnauthorizedPage;

