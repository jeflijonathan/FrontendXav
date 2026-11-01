import React from "react";
import useAuthStore from "@common/store/useAuthStore";

interface RoleGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * RoleGuard — Representation Logic Wrapper
 *
 * Wraps buttons, sections, or table columns that require specific roles to view/interact.
 * E.g., <RoleGuard allowedRoles={["TU", "kurikulum"]}><Button>Tambah</Button></RoleGuard>
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({
  allowedRoles,
  children,
  fallback = null,
}) => {
  const { user, activeRole, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <>{fallback}</>;
  }

  const allowedLower = allowedRoles.map((r) => r.toLowerCase().trim());
  const activeRoleLower = activeRole ? activeRole.toLowerCase().trim() : "";

  // User has access if their active role matches
  const hasActiveRoleAccess = activeRoleLower ? allowedLower.includes(activeRoleLower) : false;

  // Fallback check if activeRole not set yet but user owns the role
  const hasUserRoleAccess = user.roles.some((r) =>
    allowedLower.includes(r.name.toLowerCase().trim())
  );

  if (hasActiveRoleAccess || (!activeRole && hasUserRoleAccess)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

export default RoleGuard;

