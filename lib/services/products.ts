import { httpClient, apiRequest } from "@/lib/http-client";

// Types para produtos
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
  sku: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
  sku: string;
  isActive?: boolean;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: "name" | "price" | "stock" | "createdAt";
  sortOrder?: "asc" | "desc";
}

// Serviços de produtos
export const productService = {
  // Listar produtos com filtros
  async getProducts(filters?: ProductFilters): Promise<ProductsResponse> {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const endpoint = `/products${params.toString() ? `?${params.toString()}` : ""}`;

    return apiRequest(() => httpClient.get<ProductsResponse>(endpoint));
  },

  // Obter produto por ID
  async getProduct(id: string): Promise<Product> {
    return apiRequest(() => httpClient.get<Product>(`/products/${id}`));
  },

  // Criar produto
  async createProduct(data: CreateProductRequest): Promise<Product> {
    return apiRequest(() => httpClient.post<Product>("/products", data));
  },

  // Atualizar produto
  async updateProduct(
    id: string,
    data: Partial<CreateProductRequest>,
  ): Promise<Product> {
    return apiRequest(() => httpClient.put<Product>(`/products/${id}`, data));
  },

  // Deletar produto
  async deleteProduct(id: string): Promise<void> {
    return apiRequest(() => httpClient.delete<void>(`/products/${id}`));
  },

  // Upload de imagem do produto
  async uploadProductImage(
    productId: string,
    file: File,
  ): Promise<{ imageUrl: string }> {
    const formData = new FormData();

    formData.append("image", file);

    return apiRequest(() =>
      httpClient.upload<{ imageUrl: string }>(
        `/products/${productId}/image`,
        formData,
      ),
    );
  },

  // Obter estatísticas dos produtos
  async getProductStats(): Promise<{
    total: number;
    inStock: number;
    lowStock: number;
    outOfStock: number;
    categories: Array<{ name: string; count: number }>;
  }> {
    return apiRequest(() => httpClient.get("/products/stats"));
  },

  // Buscar produtos por categoria
  async getProductsByCategory(category: string): Promise<Product[]> {
    return apiRequest(() =>
      httpClient.get<Product[]>(
        `/products/category/${encodeURIComponent(category)}`,
      ),
    );
  },

  // Buscar produtos em baixo estoque
  async getLowStockProducts(threshold: number = 10): Promise<Product[]> {
    return apiRequest(() =>
      httpClient.get<Product[]>(`/products/low-stock?threshold=${threshold}`),
    );
  },

  // Atualizar estoque do produto
  async updateProductStock(id: string, quantity: number): Promise<Product> {
    return apiRequest(() =>
      httpClient.patch<Product>(`/products/${id}/stock`, { quantity }),
    );
  },

  // Ativar/Desativar produto
  async toggleProductStatus(id: string): Promise<Product> {
    return apiRequest(() =>
      httpClient.patch<Product>(`/products/${id}/toggle-status`),
    );
  },
};

// Hook personalizado para gerenciar produtos
export function useProducts() {
  return {
    getProducts: productService.getProducts,
    getProduct: productService.getProduct,
    createProduct: productService.createProduct,
    updateProduct: productService.updateProduct,
    deleteProduct: productService.deleteProduct,
    uploadProductImage: productService.uploadProductImage,
    getProductStats: productService.getProductStats,
    getProductsByCategory: productService.getProductsByCategory,
    getLowStockProducts: productService.getLowStockProducts,
    updateProductStock: productService.updateProductStock,
    toggleProductStatus: productService.toggleProductStatus,
  };
}
