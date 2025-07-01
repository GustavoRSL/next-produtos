import type { RegisterFormData, LoginFormData } from "@/lib/validations/auth";

import { httpClient } from "@/lib/http-client";

// Re-export validation types for convenience
export type LoginData = LoginFormData;
export type RegisterData = RegisterFormData;

// Types para autenticação
export interface User {
  id: string;
  name: string;
  email: string;
  number: string;
  phone: {
    country: string;
    ddd: string;
    number: string;
  };
  avatar: Array<{
    id: string;
    url: string;
  }>;
  platformRole: "USER" | "ADMIN";
  status: "ACTIVE" | "INACTIVE";
  emailStatus: "VERIFIED" | "PENDING";
  createdAt: string;
  updatedAt: string;
  street: string;
  complement: string;
  district: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  renewalsNumber: number;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  codeIntern: string;
  message: string;
  token: string;
  user: User;
}

export interface ApiError {
  codeIntern: string;
  message: string;
}

// Serviços de autenticação
export const authService = {
  // Login - rota de auth (não precisa de token)
  async login(data: LoginFormData): Promise<LoginResponse> {
    return httpClient.post<LoginResponse>("/auth/login", data);
  },

  // Registro - rota de auth (não precisa de token)
  async register(data: RegisterFormData): Promise<RegisterResponse> {
    return httpClient.post<RegisterResponse>("/users", data);
  },

  // Gerar novo token (refresh) - precisa de autenticação
  async refreshToken(): Promise<LoginResponse> {
    return httpClient.post<LoginResponse>("/auth/session");
  },
};

// Hook personalizado para gerenciar o estado de autenticação
export function useAuth() {
  const login = async (data: LoginFormData) => {
    try {
      const response = await authService.login(data);

      httpClient.setAuthToken(response.token);

      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterFormData) => {
    try {
      const response = await authService.register(data);

      httpClient.setAuthToken(response.token);

      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    httpClient.removeAuthToken();
  };

  const refreshToken = async () => {
    try {
      const response = await authService.refreshToken();

      httpClient.setAuthToken(response.token);

      return response;
    } catch (error) {
      httpClient.removeAuthToken();
      throw error;
    }
  };

  const getSession = async (): Promise<User> => {
    try {
      const response = await httpClient.get<User>("/auth/session");

      return response;
    } catch (error) {
      throw error;
    }
  };

  return {
    login,
    register,
    logout,
    refreshToken,
    getSession,
  };
}
