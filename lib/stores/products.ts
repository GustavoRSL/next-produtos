import type {
  Product,
  CreateProductData,
  UpdateProductData,
} from "@/lib/services/products";

import { create } from "zustand";

import { productService } from "@/lib/services/products";

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchProducts: () => Promise<void>;
  createProduct: (data: CreateProductData) => Promise<Product>;
  updateProduct: (id: string, data: UpdateProductData) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    try {
      set({ isLoading: true, error: null });
      const products = await productService.getProducts();

      set({ products, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao carregar produtos";

      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  createProduct: async (data: CreateProductData) => {
    try {
      set({ isLoading: true, error: null });
      const newProduct = await productService.createProduct(data);
      const { products } = get();

      set({ products: [...products, newProduct], isLoading: false });

      return newProduct;
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
      const updatedProduct = await productService.updateProduct(id, data);
      const { products } = get();
      const updatedProducts = products.map((product) =>
        product.id === id ? updatedProduct : product,
      );

      set({ products: updatedProducts, isLoading: false });

      return updatedProduct;
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

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },
}));
