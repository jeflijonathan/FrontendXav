import { create } from "zustand";
import type { AuthUserModel } from "@api/auth/model";
import AuthService from "@api/auth/service";
import { getCookie, setCookie } from "@utils/cookie";
import LocalStorage from "@utils/localStorage";

interface AuthStore {
  user: AuthUserModel | null;
  activeRole: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isRoleModalOpen: boolean;
  setUser: (user: AuthUserModel | null) => void;
  setActiveRole: (role: string | null) => void;
  setIsRoleModalOpen: (open: boolean) => void;
  setLoginSuccess: (user: AuthUserModel) => void;
  updateUser: (partial: Partial<AuthUserModel>) => void;
  logout: (navigate?: (path: string) => void) => Promise<void>;
  initAuth: () => Promise<void>;
}

const authService = new AuthService();

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: LocalStorage().getItem<AuthUserModel>("user") || null,
  activeRole:
    getCookie("active_role") ||
    LocalStorage().getItem<string>("active_role") ||
    null,
  isAuthenticated: Boolean(
    getCookie("access_token") || LocalStorage().getItem<string>("accessToken")
  ),
  isLoading: true,
  isRoleModalOpen: false,

  setUser: (user) => {
    if (user) {
      LocalStorage().setItem("user", user);
    } else {
      LocalStorage().removeItem("user");
    }
    set({ user, isAuthenticated: Boolean(user) });
  },

  setActiveRole: (role) => {
    if (role) {
      setCookie("active_role", role, { maxAge: 7 * 24 * 3600 });
      LocalStorage().setItem("active_role", role);
    } else {
      LocalStorage().removeItem("active_role");
    }
    set({ activeRole: role });
  },

  setIsRoleModalOpen: (open) => set({ isRoleModalOpen: open }),

  updateUser: (partial) => {
    const current = get().user;
    if (current) {
      const updated = { ...current, ...partial };
      LocalStorage().setItem("user", updated);
      set({ user: updated });
    }
  },

  setLoginSuccess: (user) => {
    LocalStorage().setItem("user", user);
    const existingActiveRole =
      getCookie("active_role") || LocalStorage().getItem<string>("active_role");
    
    // If user has only 1 role, set it directly or let them choose
    const hasSingleRole = user.roles && user.roles.length === 1;
    const determinedRole = existingActiveRole || (hasSingleRole ? user.roles[0].name : null);

    if (determinedRole) {
      setCookie("active_role", determinedRole, { maxAge: 7 * 24 * 3600 });
      LocalStorage().setItem("active_role", determinedRole);
    }

    set({
      user,
      isAuthenticated: true,
      activeRole: determinedRole,
      isRoleModalOpen: !determinedRole, // Open role selection if active role is not yet selected
    });
  },

  logout: async (navigate) => {
    set({ isLoading: true });
    await authService.logout({
      onSuccess: () => {
        set({
          user: null,
          activeRole: null,
          isAuthenticated: false,
          isLoading: false,
          isRoleModalOpen: false,
        });
        if (navigate) {
          navigate("/login/pegawai");
        }
      },
      onError: () => {
        set({
          user: null,
          activeRole: null,
          isAuthenticated: false,
          isLoading: false,
          isRoleModalOpen: false,
        });
        if (navigate) {
          navigate("/login/pegawai");
        }
      },
    });
  },

  initAuth: async () => {
    const hasToken = Boolean(
      getCookie("access_token") || LocalStorage().getItem<string>("accessToken")
    );
    if (!hasToken) {
      set({ isLoading: false, isAuthenticated: false, user: null, activeRole: null });
      return;
    }

    await authService.getMe({
      onSuccess: (userData) => {
        const storedRole =
          getCookie("active_role") ||
          LocalStorage().getItem<string>("active_role") ||
          userData.active_role ||
          (userData.roles.length === 1 ? userData.roles[0].name : null);

        set({
          user: userData,
          activeRole: storedRole,
          isAuthenticated: true,
          isLoading: false,
          isRoleModalOpen: !storedRole,
        });
      },
      onError: () => {
        set({
          user: null,
          activeRole: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },
    });
  },
}));

export default useAuthStore;

