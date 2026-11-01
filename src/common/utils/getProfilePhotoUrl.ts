/**
 * getProfilePhotoUrl — Utility function to resolve user profile photo URL
 *
 * Resolves full backend stream URL for uploaded files (UUIDs)
 * or returns direct URL if already an absolute/blob link.
 */
export const getProfilePhotoUrl = (profileUrl?: string | null): string | undefined => {
  if (!profileUrl || profileUrl.trim() === "") return undefined;
  
  const trimmed = profileUrl.trim();
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("blob:") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }

  const backendUrl = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/+$/, "");
  return `${backendUrl}/api/upload/${trimmed}`;
};

export default getProfilePhotoUrl;

