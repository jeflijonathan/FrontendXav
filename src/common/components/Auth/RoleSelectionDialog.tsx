
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Card,
  CardActionArea,
  Chip,
  CircularProgress,
} from "@mui/material";

import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SchoolIcon from "@mui/icons-material/School";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import BadgeIcon from "@mui/icons-material/Badge";

import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

import useAuthStore from "@common/store/useAuthStore";
import AuthService from "@api/auth/service";

// ============================================
// ROLE ICON
// ============================================

const getRoleIcon = (roleName: string) => {
  const role = roleName.toLowerCase();

  if (role.includes("siswa")) {
    return <SchoolIcon color="primary" />;
  }

  if (role.includes("admin") || role.includes("kepala")) {
    return <AdminPanelSettingsIcon color="error" />;
  }

  if (role.includes("kurikulum") || role.includes("tu")) {
    return <VerifiedUserIcon color="success" />;
  }

  if (role.includes("guru") || role.includes("wali")) {
    return <SupervisorAccountIcon color="secondary" />;
  }

  return <BadgeIcon color="action" />;
};

// ============================================
// ROLE LABEL
// ============================================

const formatRoleLabel = (roleName: string) => {
  const role = roleName.toLowerCase();

  const roleLabels: Record<string, string> = {
    tu: "Tata Usaha (TU)",
    kurikulum: "Bidang Kurikulum",
    guru_piket: "Guru Piket",
    wali_kelas: "Wali Kelas",
    pengurus_kelas: "Pengurus Kelas",
    pembimbing_pkl: "Pembimbing PKL",
    bidang_keuangan: "Bidang Keuangan",
  };

  if (roleLabels[role]) {
    return roleLabels[role];
  }

  return roleName.charAt(0).toUpperCase() + roleName.slice(1);
};

// ============================================
// ROLE SELECTION DIALOG
// ============================================

export const RoleSelectionDialog: React.FC = () => {
  const {
    user,
    activeRole,
    isRoleModalOpen,
    setIsRoleModalOpen,
    setActiveRole,
  } = useAuthStore();

  const [selectedRole, setSelectedRole] = useState<string>(
    activeRole || ""
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const authService = new AuthService();

  // ============================================
  // SYNC SELECTED ROLE
  // ============================================

  useEffect(() => {
    setSelectedRole(activeRole || "");
  }, [activeRole, isRoleModalOpen]);

  // ============================================
  // VALIDATION
  // ============================================

  if (!user || !user.roles || user.roles.length === 0) {
    return null;
  }

  // Role wajib dipilih jika belum memiliki activeRole
  const isMandatory = !activeRole;

  // ============================================
  // HANDLE SELECT ROLE
  // ============================================

  const handleSelectRole = async (roleName: string) => {
    // Mencegah request berulang
    if (isSubmitting) return;

    // Jika role yang dipilih sudah aktif, tidak perlu request ulang
    if (roleName.toLowerCase() === activeRole?.toLowerCase()) {
      setIsRoleModalOpen(false);
      return;
    }

    setSelectedRole(roleName);
    setIsSubmitting(true);

    try {
      await authService.selectRole(
        {
          role_name: roleName,
        },
        {
          onSuccess: (res) => {
            setActiveRole(res.active_role);
            setSelectedRole(res.active_role);
            setIsRoleModalOpen(false);

            enqueueSnackbar(
              `Role aktif: ${formatRoleLabel(res.active_role)}`,
              {
                variant: "success",
              }
            );

            navigate("/dashboard");
          },

          onError: (err) => {
            enqueueSnackbar(
              err?.message || "Gagal mengatur role aktif",
              {
                variant: "error",
              }
            );
          },
        }
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengatur role aktif";

      enqueueSnackbar(message, {
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <Dialog
      open={isRoleModalOpen}
      onClose={(_, reason) => {
        if (isMandatory || isSubmitting) return;

        if (reason === "backdropClick" || reason === "escapeKeyDown") {
          setIsRoleModalOpen(false);
        }
      }}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3.5,
            p: 1.5,
            bgcolor: "background.paper",
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
          },
        },
      }}
    >
      {/* HEADER */}

      <DialogTitle
        component="div"
        sx={{
          pb: 1,
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            bgcolor: "primary.light",
            color: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 1.5,
          }}
        >
          <VerifiedUserIcon sx={{ fontSize: 32 }} />
        </Box>

        <Typography
          component="div"
          variant="h6"
          sx={{
            fontWeight: 700,
          }}
        >
          Pilih Role untuk Masuk
        </Typography>

        <Typography
          component="p"
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 0.5,
            mb: 0,
          }}
        >
          Selamat datang, <strong>{user.full_name}</strong> (
          {user.identifier}).
          Pilih salah satu hak akses untuk memulai sesi Anda.
        </Typography>
      </DialogTitle>

      {/* ROLE LIST */}

      <DialogContent sx={{ py: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          {user.roles.map((role) => {
            const isCurrent =
              (selectedRole || activeRole)?.toLowerCase() ===
              role.name.toLowerCase();

            return (
              <Card
                key={role.id}
                variant="outlined"
                sx={{
                  borderRadius: 2.5,
                  borderColor: isCurrent
                    ? "primary.main"
                    : "divider",
                  borderWidth: isCurrent ? 2 : 1,
                  bgcolor: isCurrent
                    ? "primary.50"
                    : "background.paper",
                  transition: "all 0.2s ease-in-out",

                  "&:hover": {
                    borderColor: "primary.main",
                    transform: "translateY(-1px)",
                    boxShadow: 2,
                  },
                }}
              >
                <CardActionArea
                  onClick={() => handleSelectRole(role.name)}
                  disabled={isSubmitting}
                  sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {/* ROLE INFORMATION */}

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        bgcolor: isCurrent
                          ? "primary.light"
                          : "action.hover",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {getRoleIcon(role.name)}
                    </Box>

                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        {formatRoleLabel(role.name)}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        Role ID: {role.name}
                      </Typography>
                    </Box>
                  </Box>

                  {/* ACTIVE ROLE INDICATOR */}

                  {isCurrent && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Chip
                        label="Aktif"
                        color="primary"
                        size="small"
                        sx={{
                          fontWeight: 600,
                        }}
                      />

                      <CheckCircleIcon
                        color="primary"
                        fontSize="small"
                      />
                    </Box>
                  )}
                </CardActionArea>
              </Card>
            );
          })}
        </Box>
      </DialogContent>

      {/* FOOTER */}

      <DialogActions
        sx={{
          px: 3,
          pb: 2,
          justifyContent: "space-between",
        }}
      >
        {!isMandatory ? (
          <Button
            variant="text"
            color="inherit"
            onClick={() => setIsRoleModalOpen(false)}
            disabled={isSubmitting}
            sx={{
              textTransform: "none",
            }}
          >
            Tutup
          </Button>
        ) : (
          <Typography
            variant="caption"
            color="text.secondary"
          >
            * Pilih salah satu role untuk melanjutkan
          </Typography>
        )}

        {isSubmitting && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <CircularProgress size={18} />

            <Typography variant="caption">
              Mengatur role...
            </Typography>
          </Box>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default RoleSelectionDialog;
