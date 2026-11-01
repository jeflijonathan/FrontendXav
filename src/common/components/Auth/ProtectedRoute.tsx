import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "@common/store/useAuthStore";
import UnauthorizedPage from "./UnauthorizedPage";
import RoleSelectionDialog from "./RoleSelectionDialog";
import { Box, CircularProgress } from "@mui/material";

interface ProtectedRouteProps {
  children?: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, isLoading, user, activeRole } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
        }}
      >
        <CircularProgress size={36} />
      </Box>
    );
  }

  // 1. Check Authentication
  if (!isAuthenticated || !user) {
    // Redirect to login page preserving the requested pathname
    return <Navigate to="/login/pegawai" state={{ from: location }} replace />;
  }

  // 2. Check Role Selection
  if (!activeRole) {
    return (
      <>
        <RoleSelectionDialog />
        <Box
          sx={{
            minHeight: "80vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={32} />
        </Box>
      </>
    );
  }

  // 3. Check Allowed Roles (if specified)
  if (allowedRoles && allowedRoles.length > 0) {
    const allowedLower = allowedRoles.map((r) => r.toLowerCase().trim());
    const currentLower = activeRole.toLowerCase().trim();

    if (!allowedLower.includes(currentLower)) {
      return (
        <>
          <RoleSelectionDialog />
          <UnauthorizedPage allowedRoles={allowedRoles} />
        </>
      );
    }
  }

  return (
    <>
      <RoleSelectionDialog />
      {children}
    </>
  );
};

export default ProtectedRoute;

