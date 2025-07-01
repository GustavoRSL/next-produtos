import type {
  Product,
  CreateProductData,
  UpdateProductData,
  ProductsQueryParams,
  ApiSuccessResponse,
} from "@/lib/services/products";

import { create } from "zustand";

import { productService } from "@/lib/services/products";

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchProducts: (params?: ProductsQueryParams) => Promise<void>;
  fetchProduct: (id: string) => Promise<void>;
  createProduct: (data: CreateProductData) => Promise<ApiSuccessResponse>;
  updateProduct: (
    id: string,
    data: UpdateProductData,
  ) => Promise<ApiSuccessResponse>;
  deleteProduct: (id: string) => Promise<void>;
  updateProductThumbnail: (
    id: string,
    thumbnailFile: File,
  ) => Promise<ApiSuccessResponse>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  clearCurrentProduct: () => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  currentProduct: null,
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  },
  isLoading: false,
  error: null,

  fetchProducts: async (params?: ProductsQueryParams) => {
    try {
      set({ isLoading: true, error: null });
      const response = await productService.getProducts(params);

      set({
        products: response.data,
        pagination: response.meta,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao carregar produtos";

      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  fetchProduct: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const product = await productService.getProduct(id);

      set({ currentProduct: product, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao carregar produto";

      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  createProduct: async (data: CreateProductData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await productService.createProduct(data);

      // Recarregar lista de produtos após criar
      await get().fetchProducts();

      set({ isLoading: false });

      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao criar produto";

      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  updateProduct: async (id: string, data: UpdateProductData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await productService.updateProduct(id, data);

      // Atualizar produto na lista se existir
      const { products } = get();
      const updatedProducts = products.map((product) =>
        product.id === id ? { ...product, ...data } : product,
      );

      set({ products: updatedProducts, isLoading: false });

      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao atualizar produto";

      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  deleteProduct: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await productService.deleteProduct(id);
      const { products } = get();
      const filteredProducts = products.filter((product) => product.id !== id);

      set({ products: filteredProducts, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao excluir produto";

      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  updateProductThumbnail: async (id: string, thumbnailFile: File) => {
    try {
      set({ isLoading: true, error: null });
      const response = await productService.updateProductThumbnail(
        id,
        thumbnailFile,
      );

      // Recarregar produto atual se for o mesmo ID
      const { currentProduct } = get();

      if (currentProduct && currentProduct.id === id) {
        await get().fetchProduct(id);
      }

      set({ isLoading: false });

      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao atualizar thumbnail";

      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },

  clearCurrentProduct: () => {
    set({ currentProduct: null });
  },
}));
