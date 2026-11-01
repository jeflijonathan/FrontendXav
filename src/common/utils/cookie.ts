/**
 * cookie.ts — Cookie Management Utility
 *
 * Provides functions for reading, writing, and clearing cookies.
 */

export interface CookieOptions {
  days?: number;
  maxAge?: number; // in seconds
  path?: string;
  sameSite?: "Lax" | "Strict" | "None";
  secure?: boolean;
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const nameEQ = encodeURIComponent(name) + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }
  return null;
}

export function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {}
): void {
  if (typeof document === "undefined") return;

  const {
    days,
    maxAge,
    path = "/",
    sameSite = "Lax",
    secure = false,
  } = options;

  let cookieStr = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=${path}; SameSite=${sameSite}`;

  if (maxAge !== undefined) {
    cookieStr += `; max-age=${maxAge}`;
  } else if (days !== undefined) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    cookieStr += `; expires=${d.toUTCString()}`;
  }

  if (secure) {
    cookieStr += "; Secure";
  }

  document.cookie = cookieStr;
}

export function deleteCookie(name: string, path = "/"): void {
  if (typeof document === "undefined") return;
  document.cookie = `${encodeURIComponent(name)}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; SameSite=Lax`;
}

export const CookieUtil = {
  get: getCookie,
  set: setCookie,
  delete: deleteCookie,
};

export default CookieUtil;

