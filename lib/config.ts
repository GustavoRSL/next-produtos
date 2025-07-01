// Configurações da aplicação
export const config = {
  // API
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "/api",
    timeout: 30000, // 30 segundos
  },

  // Autenticação
  auth: {
    tokenKey: "authToken",
    refreshTokenKey: "refreshToken",
    tokenExpiration: 24 * 60 * 60 * 1000, // 24 horas em ms
  },

  // Paginação
  pagination: {
    defaultLimit: 10,
    maxLimit: 100,
  },

  // Upload de arquivos
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedImageTypes: ["image/jpeg", "image/png", "image/webp"],
    allowedFileTypes: [
      "application/pdf",
      "text/csv",
      "application/vnd.ms-excel",
    ],
  },

  // Produtos
  products: {
    lowStockThreshold: 10,
    categories: [
      "Eletrônicos",
      "Roupas",
      "Casa e Jardim",
      "Esportes",
      "Livros",
      "Beleza",
      "Automóveis",
      "Outros",
    ],
  },

  // Formatação
  format: {
    currency: "BRL",
    locale: "pt-BR",
    dateFormat: "dd/MM/yyyy",
    timeFormat: "HH:mm",
  },

  // Validação
  validation: {
    password: {
      minLength: 6,
      requireUppercase: false,
      requireNumbers: false,
      requireSpecialChars: false,
    },
    product: {
      nameMinLength: 2,
      nameMaxLength: 100,
      descriptionMaxLength: 500,
      skuMinLength: 3,
      skuMaxLength: 50,
      minPrice: 0.01,
      maxPrice: 999999.99,
    },
  },

  // Ambiente
  env: {
    isDevelopment: process.env.NODE_ENV === "development",
    isProduction: process.env.NODE_ENV === "production",
    isTest: process.env.NODE_ENV === "test",
  },

  // URLs externas
  externalUrls: {
    documentation: "https://docs.example.com",
    support: "https://support.example.com",
    github: "https://github.com/example/repo",
  },
} as const;

// Helper functions para configurações
export const getApiUrl = (endpoint: string): string => {
  return `${config.api.baseUrl}${endpoint}`;
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat(config.format.locale, {
    style: "currency",
    currency: config.format.currency,
  }).format(value);
};

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return new Intl.DateTimeFormat(config.format.locale).format(dateObj);
};

export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return new Intl.DateTimeFormat(config.format.locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj);
};

export const isValidFileType = (
  file: File,
  type: "image" | "file",
): boolean => {
  const allowedTypes =
    type === "image"
      ? config.upload.allowedImageTypes
      : config.upload.allowedFileTypes;

  return allowedTypes.includes(file.type);
};

export const isValidFileSize = (file: File): boolean => {
  return file.size <= config.upload.maxFileSize;
};

export const getFileErrorMessage = (
  file: File,
  type: "image" | "file",
): string | null => {
  if (!isValidFileSize(file)) {
    const maxSizeMB = config.upload.maxFileSize / (1024 * 1024);

    return `Arquivo muito grande. Tamanho máximo: ${maxSizeMB}MB`;
  }

  if (!isValidFileType(file, type)) {
    const allowedTypes =
      type === "image"
        ? config.upload.allowedImageTypes
        : config.upload.allowedFileTypes;

    return `Tipo de arquivo não permitido. Tipos aceitos: ${allowedTypes.join(", ")}`;
  }

  return null;
};
