// Utilitário para debug e teste das requisições HTTP
export class HttpDebugger {
  private static instance: HttpDebugger;
  private isEnabled: boolean = false;

  private constructor() {}

  public static getInstance(): HttpDebugger {
    if (!this.instance) {
      this.instance = new HttpDebugger();
    }

    return this.instance;
  }

  public enable(): void {
    this.isEnabled = true;
  }

  public disable(): void {
    this.isEnabled = false;
  }

  public logRequest(url: string, config: RequestInit): void {
    if (!this.isEnabled) return;

    console.group("🔍 HTTP Request");
    console.log("URL:", url);
    console.log("Method:", config.method || "GET");
    console.log("Headers:", config.headers);
    if (config.body) {
      console.log("Body:", config.body);
    }
    console.groupEnd();
  }

  public logResponse(url: string, response: Response, data?: any): void {
    if (!this.isEnabled) return;

    console.group("📡 HTTP Response");
    console.log("URL:", url);
    console.log("Status:", response.status, response.statusText);
    console.log("Headers:", Object.fromEntries(response.headers.entries()));
    if (data) {
      console.log("Data:", data);
    }
    console.groupEnd();
  }

  public logError(url: string, error: any): void {
    if (!this.isEnabled) return;

    console.group("❌ HTTP Error");
    console.log("URL:", url);
    console.error("Error:", error);
    console.groupEnd();
  }
}

// Exportar instância singleton para uso fácil
export const httpDebugger = HttpDebugger.getInstance();

// Funções utilitárias para testar requisições
export const testUtils = {
  // Testar se o token está sendo adicionado corretamente
  checkAuthHeader: (headers: Headers | Record<string, string>): boolean => {
    const authHeader =
      headers instanceof Headers
        ? headers.get("Authorization")
        : headers["Authorization"];

    return !!authHeader && authHeader.startsWith("Bearer ");
  },

  // Verificar se é uma rota de autenticação
  isAuthRoute: (url: string): boolean => {
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

    return authRoutes.some((route) => url.includes(route));
  },

  // Mock de token JWT para testes
  generateMockToken: (payload: Record<string, any> = {}): string => {
    const header = { alg: "HS256", typ: "JWT" };
    const defaultPayload = {
      sub: "user123",
      name: "Test User",
      email: "test@example.com",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hora
    };

    const finalPayload = { ...defaultPayload, ...payload };

    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(finalPayload));
    const signature = "mock-signature";

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  },
};

// Para desenvolvimento - habilitar debug no console do browser
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  (window as any).httpDebugger = httpDebugger;
  (window as any).enableHttpDebug = () => httpDebugger.enable();
  (window as any).disableHttpDebug = () => httpDebugger.disable();
}
