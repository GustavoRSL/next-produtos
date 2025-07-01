class HttpClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || "/api") {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
      ...options,
    };

    // Verificar se é uma rota de autenticação (login/registro)
    const isAuthRoute = this.isAuthenticationRoute(endpoint);

    // Adicionar token de autenticação se existir e não for rota de auth
    if (!isAuthRoute) {
      const token = this.getAuthToken();

      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: response.statusText,
        }));

        throw new Error(error.message || `HTTP Error: ${response.status}`);
      }

      // Verificar se a resposta tem conteúdo
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        return response.json();
      }

      return response.text() as unknown as T;
    } catch (error) {
      throw error;
    }
  }

  private getAuthToken(): string | null {
    if (typeof window !== "undefined") {
      try {
        // Tentar obter do store Zustand primeiro
        const authStorage = localStorage.getItem("auth-storage");

        if (authStorage) {
          const parsed = JSON.parse(authStorage);

          return parsed.state?.token || null;
        }
      } catch {
        // Error parsing auth storage - fallback silently
      }

      // Fallback para localStorage direto
      return localStorage.getItem("authToken");
    }

    return null;
  }

  public setAuthToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("authToken", token);
    }
  }

  public removeAuthToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
    }
  }

  // GET request
  public async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "GET",
    });
  }

  // POST request
  public async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  public async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PATCH request
  public async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  public async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "DELETE",
    });
  }

  // Upload de arquivos
  public async upload<T>(endpoint: string, formData: FormData): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();
    const headers: Record<string, string> = {};

    // Adicionar token de autenticação se existir
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // NÃO definir Content-Type para FormData - o browser define automaticamente
    const config: RequestInit = {
      method: "POST",
      body: formData,
      headers,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: response.statusText,
        }));

        throw new Error(error.message || `HTTP Error: ${response.status}`);
      }

      // Verificar se a resposta tem conteúdo
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        return response.json();
      }

      return response.text() as unknown as T;
    } catch (error) {
      throw error;
    }
  }

  // Upload de arquivos com PATCH
  public async uploadPatch<T>(
    endpoint: string,
    formData: FormData,
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();
    const headers: Record<string, string> = {};

    // Adicionar token de autenticação se existir
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // NÃO definir Content-Type para FormData - o browser define automaticamente
    const config: RequestInit = {
      method: "PATCH",
      body: formData,
      headers,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: response.statusText,
        }));

        throw new Error(error.message || `HTTP Error: ${response.status}`);
      }

      // Verificar se a resposta tem conteúdo
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        return response.json();
      }

      return response.text() as unknown as T;
    } catch (error) {
      throw error;
    }
  }

  private isAuthenticationRoute(endpoint: string): boolean {
    // Lista de rotas que não precisam de autenticação
    const authRoutes = [
      "/auth/login",
      "/auth/register",
      "/auth/signin",
      "/auth/signup",
      "/login",
      "/register",
      "/signin",
      "/signup",
    ];

    return authRoutes.some((route) => endpoint.includes(route));
  }
}

// Instância singleton do cliente HTTP
export const httpClient = new HttpClient();

// Types para respostas da API
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// Wrapper para lidar com respostas padronizadas da API
export async function apiRequest<T>(
  request: () => Promise<ApiResponse<T>>,
): Promise<T> {
  try {
    const response = await request();

    if (!response.success) {
      throw new Error(response.message || "Erro na requisição");
    }

    return response.data;
  } catch (error) {
    // Re-throw error for caller to handle
    throw error;
  }
}
