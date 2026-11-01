import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Alert,
  Divider,
} from "@mui/material";
import { Visibility, VisibilityOff, Badge, Lock, School } from "@mui/icons-material";
import { Link } from "react-router-dom";
import AuthLayout from "@common/layouts/AuthLayout";
import AuthBrandPanel from "../components/AuthBrandPanel";
import useLoginPegawai from "./hook/useLoginPegawai";
import RoleSelectionDialog from "@components/Auth/RoleSelectionDialog";

export const LoginPegawai: React.FC = () => {
  const {
    form: {
      register,
      formState: { errors },
    },
    isLoading,
    serverError,
    showPassword,
    toggleShowPassword,
    onSubmit,
  } = useLoginPegawai();

  const formContent = (
    <Box sx={{ width: "100%", maxWidth: 440, mx: "auto" }}>
      {/* Portal Switcher Navigation */}
      <Box
        sx={{
          display: "flex",
          p: 0.5,
          mb: 4,
          borderRadius: 2.5,
          bgcolor: "grey.100",
          border: "1px solid",
          borderColor: "grey.200",
        }}
      >
        <Button
          fullWidth
          variant="contained"
          size="small"
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 700,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          Pegawai & Guru
        </Button>
        <Button
          fullWidth
          component={Link}
          to="/login/siswa"
          size="small"
          color="inherit"
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 500,
            color: "text.secondary",
          }}
        >
          Siswa
        </Button>
      </Box>

      {/* Header */}
      <Box sx={{ mb: 3.5 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: "text.primary", mb: 1 }}>
          Masuk Akun Pegawai
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Masukkan <strong>Nomor Induk Yayasan (NIY)</strong> dan kata sandi Anda untuk mengakses dashboard manajemen.
        </Typography>
      </Box>

      {serverError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {serverError}
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={onSubmit} noValidate>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          <TextField
            {...register("niy")}
            label="NIY (Nomor Induk Yayasan)"
            placeholder="Contoh: 123456"
            fullWidth
            size="medium"
            error={Boolean(errors.niy)}
            helperText={errors.niy?.message}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Badge color="action" />
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            {...register("password")}
            type={showPassword ? "text" : "password"}
            label="Kata Sandi"
            placeholder="Masukkan kata sandi akun"
            fullWidth
            size="medium"
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={toggleShowPassword} edge="end" size="small">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={isLoading}
            sx={{
              py: 1.4,
              borderRadius: 2.5,
              textTransform: "none",
              fontWeight: 700,
              fontSize: "1rem",
              boxShadow: "0 6px 20px rgba(59, 130, 246, 0.35)",
            }}
          >
            {isLoading ? "Memproses Masuk..." : "Masuk ke Dashboard Pegawai"}
          </Button>
        </Box>
      </form>

      <Divider sx={{ my: 4 }}>
        <Typography variant="caption" color="text.secondary">
          Bukan Pegawai?
        </Typography>
      </Divider>

      <Box sx={{ textAlign: "center" }}>
        <Button
          component={Link}
          to="/login/siswa"
          variant="outlined"
          color="inherit"
          fullWidth
          startIcon={<School color="primary" />}
          sx={{
            py: 1.2,
            borderRadius: 2.5,
            textTransform: "none",
            fontWeight: 600,
            borderColor: "divider",
          }}
        >
          Masuk Melalui Portal Siswa (NIS)
        </Button>
      </Box>

      {/* Role Selection Modal on Login */}
      <RoleSelectionDialog />
    </Box>
  );

  return (
    <AuthLayout
      brandContent={<AuthBrandPanel portalType="pegawai" />}
      formContent={formContent}
    />
  );
};

export default LoginPegawai;

