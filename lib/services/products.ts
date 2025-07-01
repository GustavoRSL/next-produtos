import { httpClient } from "@/lib/http-client";

// Types para produtos baseados na API
export interface Product {
  id: string;
  title: string;
  description: string;
  status: boolean;
  thumbnail: {
    url: string;
    type: string;
    originalName: string;
    size?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  title: string;
  description: string;
  thumbnail: File; // arquivo de imagem
}

export interface UpdateProductData {
  title: string;
  description: string;
  status: boolean;
}

export interface ProductsResponse {
  data: Product[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ProductsQueryParams {
  page?: number;
  pageSize?: number;
  filter?: string;
}

export interface ApiSuccessResponse {
  codeIntern: string;
  message: string;
  id?: string;
}

export interface ApiErrorResponse {
  codeIntern: string;
  message: string;
}

// Serviços de produtos conforme API especificada
export const productService = {
  // GET /products - Buscar lista de produtos
  async getProducts(params?: ProductsQueryParams): Promise<ProductsResponse> {
    const searchParams = new URLSearchParams();

    if (params) {
      if (params.page) searchParams.append("page", String(params.page));
      if (params.pageSize)
        searchParams.append("pageSize", String(params.pageSize));
      if (params.filter) searchParams.append("filter", params.filter);
    }

    const endpoint = `/products${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

    return httpClient.get<ProductsResponse>(endpoint);
  },

  // GET /products/{id} - Buscar produto específico
  async getProduct(id: string): Promise<Product> {
    return httpClient.get<Product>(`/products/${id}`);
  },

  // POST /products - Criar novo produto
  async createProduct(data: CreateProductData): Promise<ApiSuccessResponse> {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("thumbnail", data.thumbnail);

    return httpClient.upload<ApiSuccessResponse>("/products", formData);
  },

  // PUT /products/{id} - Atualizar produto
  async updateProduct(
    id: string,
    data: UpdateProductData,
  ): Promise<ApiSuccessResponse> {
    return httpClient.put<ApiSuccessResponse>(`/products/${id}`, data);
  },

  // DELETE /products/{id} - Deletar produto
  async deleteProduct(id: string): Promise<ApiSuccessResponse> {
    return httpClient.delete<ApiSuccessResponse>(`/products/${id}`);
  },

  // PATCH /products/thumbnail/{id} - Atualizar thumbnail do produto
  async updateProductThumbnail(
    id: string,
    thumbnail: string,
  ): Promise<ApiSuccessResponse> {
    return httpClient.patch<ApiSuccessResponse>(`/products/thumbnail/${id}`, {
      thumbnail,
    });
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
    updateProductThumbnail: productService.updateProductThumbnail,
  };
}
