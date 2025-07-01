import type { User, LoginData, RegisterData } from "@/lib/services/auth";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { useAuth } from "@/lib/services/auth";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshSession: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

// eslint-disable-next-line react-hooks/rules-of-hooks
const auth = useAuth();

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (data: LoginData) => {
        try {
          set({ isLoading: true });
          const response = await auth.login(data);

          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        try {
          set({ isLoading: true });
          await auth.register(data);

          // Não fazer login automático após registro
          // O usuário deve fazer login manualmente
          set({
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        auth.logout();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      refreshSession: async () => {
        try {
          const { token } = get();

          if (!token) return;

          const user = await auth.getSession();

          set({ user, isAuthenticated: true });
        } catch (error) {
          // Se falhar ao renovar a sessão, fazer logout
          get().logout();
          throw error;
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
