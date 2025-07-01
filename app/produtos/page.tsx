"use client";

import type { Product } from "@/lib/services/products";

import { useEffect, useState } from "react";
import { Button, useDisclosure } from "@heroui/react";
import { PlusIcon, CubeIcon } from "@heroicons/react/24/outline";

import { DashboardLayout } from "@/components/layout";
import ProductFormModal from "@/components/produtos/ProductFormModal";
import ProductsTable from "@/components/produtos/ProductsTable";
import StatCard from "@/components/ui/StatCard";
import SearchFilter from "@/components/ui/SearchFilter";
import Pagination from "@/components/ui/Pagination";
import { useProductStore } from "@/lib/stores/products";

export default function ProdutosPage() {
  const {
    products,
    pagination,
    isLoading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    updateProductThumbnail,
    clearError,
  } = useProductStore();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">(
    "create",
  );
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: true,
  });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Estados dos filtros e paginação
  const [nameFilter, setNameFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Função para buscar produtos
  const handleSearch = () => {
    const params: any = {
      page: 1, // Volta para a primeira página ao fazer uma nova busca
      pageSize: 10,
    };

    if (nameFilter.trim()) {
      params.filter = nameFilter.trim();
    }

    setSearchTerm(nameFilter.trim());
    setCurrentPage(1); // Reinicia a paginação
    fetchProducts(params);
  };

  // Busca imediata ao mudar página
  useEffect(() => {
    const params: any = {
      page: currentPage,
      pageSize: 10,
    };

    if (searchTerm) {
      params.filter = searchTerm;
    }

    fetchProducts(params);
  }, [fetchProducts, searchTerm, currentPage]);

  // Debounce para busca automática ao digitar
  useEffect(() => {
    // Não executar o efeito quando o componente é montado pela primeira vez
    if (nameFilter === "") return;

    const timeoutId = setTimeout(() => {
      handleSearch();
    }, 500); // Debounce de 500ms

    return () => clearTimeout(timeoutId);
  }, [nameFilter]);

  // Limpar erro quando fechar modal
  useEffect(() => {
    if (!isOpen) {
      clearError();
    }
  }, [isOpen, clearError]);

  const handleOpenModal = (
    mode: "create" | "edit" | "view",
    product?: Product,
  ) => {
    setModalMode(mode);
    setSelectedProduct(product || null);

    if (mode === "create") {
      setFormData({
        title: "",
        description: "",
        status: true,
      });
      setThumbnailFile(null);
      setImagePreview(null);
    } else if (product) {
      setFormData({
        title: product.title,
        description: product.description,
        status: product.status,
      });
      // Limpar seleção de nova imagem para edição
      setThumbnailFile(null);
      setImagePreview(null);
    }

    onOpen();
  };

  const handleCreateProduct = async () => {
    try {
      if (!thumbnailFile) {
        alert("Por favor, selecione uma imagem para o produto");

        return;
      }

      await createProduct({
        title: formData.title,
        description: formData.description,
        thumbnail: thumbnailFile,
      });

      onClose();
      setFormData({ title: "", description: "", status: true });
      setThumbnailFile(null);
      setImagePreview(null);

      // Recarregar a primeira página após criar
      setCurrentPage(1);

      // Recarregar produtos com filtros atuais
      const params: any = {
        page: 1,
        pageSize: 10,
      };

      if (searchTerm) {
        params.filter = searchTerm;
      }

      await fetchProducts(params);
    } catch {
      // Error handled by store
    }
  };

  const handleUpdateProduct = async () => {
    if (!selectedProduct) return;

    try {
      await updateProduct(selectedProduct.id, {
        title: formData.title,
        description: formData.description,
        status: formData.status,
      });

      // Recarregar produtos na página atual
      const params: any = {
        page: currentPage,
        pageSize: 10,
      };

      if (searchTerm) {
        params.filter = searchTerm;
      }

      await fetchProducts(params);

      onClose();
    } catch {
      // Error handled by store
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        await deleteProduct(productId);

        // Recarregar produtos na página atual (ou anterior se a página atual ficar vazia)
        let page = currentPage;

        // Se excluiu o último item da página atual, voltar para a página anterior (exceto se já estiver na primeira página)
        if (products.length === 1 && currentPage > 1) {
          page = currentPage - 1;
          setCurrentPage(page);
        }

        const params: any = {
          page,
          pageSize: 10,
        };

        if (searchTerm) {
          params.filter = searchTerm;
        }

        await fetchProducts(params);
      } catch {
        // Error handled by store
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setThumbnailFile(file);
      createImagePreview(file);
    }
  };

  const createImagePreview = (file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);

    const files = event.dataTransfer.files;

    if (files.length > 0) {
      const file = files[0];

      if (file.type.startsWith("image/")) {
        setThumbnailFile(file);
        createImagePreview(file);
      } else {
        alert("Por favor, selecione apenas arquivos de imagem.");
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const removeSelectedFile = () => {
    setThumbnailFile(null);
    setImagePreview(null);
  };

  const handleUpdateProductThumbnail = async () => {
    if (!selectedProduct || !thumbnailFile) return;

    try {
      await updateProductThumbnail(selectedProduct.id, thumbnailFile);

      // Recarregar produtos na página atual
      const params: any = {
        page: currentPage,
        pageSize: 10,
      };

      if (searchTerm) {
        params.filter = searchTerm;
      }

      await fetchProducts(params);

      // Limpar seleção de arquivo
      setThumbnailFile(null);
      setImagePreview(null);
    } catch {
      // Error handled by store
    }
  };

  return (
    <DashboardLayout title="Produtos">
      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Gerenciar Produtos
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {products.length} produtos cadastrados
          </p>
        </div>
        <Button
          className="w-full sm:w-auto"
          color="primary"
          startContent={<PlusIcon className="w-4 h-4" />}
          onPress={() => handleOpenModal("create")}
        >
          Novo Produto
        </Button>
      </div>

      {/* Filtros */}
      <SearchFilter
        handleSearch={handleSearch}
        nameFilter={nameFilter}
        searchTerm={searchTerm}
        setCurrentPage={setCurrentPage}
        setNameFilter={setNameFilter}
        setSearchTerm={setSearchTerm}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        <StatCard
          gradient="from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800"
          icon={<CubeIcon className="w-6 h-6" />}
          iconColor="text-blue-600"
          textColor="text-blue-600 dark:text-blue-300"
          title="Total Produtos"
          value={products.length}
        />
        <StatCard
          gradient="from-green-50 to-green-100 dark:from-green-900 dark:to-green-800"
          icon={
            <div className="w-6 h-6 rounded-full bg-green-200 flex items-center justify-center">
              <span className="text-green-700 text-xs">✓</span>
            </div>
          }
          iconColor=""
          textColor="text-green-600 dark:text-green-300"
          title="Produtos Ativos"
          value={products.filter((p: Product) => p.status === true).length}
        />
        <StatCard
          gradient="from-red-50 to-red-100 dark:from-red-900 dark:to-red-800 xs:col-span-2 md:col-span-1"
          icon={
            <div className="w-6 h-6 rounded-full bg-red-200 flex items-center justify-center">
              <span className="text-red-700 text-xs">×</span>
            </div>
          }
          iconColor=""
          textColor="text-red-600 dark:text-red-300"
          title="Produtos Inativos"
          value={products.filter((p: Product) => p.status === false).length}
        />
      </div>

      {/* Products Table */}
      <ProductsTable
        products={products}
        onDelete={(productId) => handleDeleteProduct(productId)}
        onEdit={(product) => handleOpenModal("edit", product)}
        onView={(product) => handleOpenModal("view", product)}
      />

      {/* Paginação */}
      <Pagination
        currentPage={currentPage}
        totalPages={pagination.totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Modal */}
      <ProductFormModal
        formData={formData}
        handleCreateProduct={handleCreateProduct}
        handleDragLeave={handleDragLeave}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        handleFileChange={handleFileChange}
        handleUpdateProduct={handleUpdateProduct}
        handleUpdateProductThumbnail={handleUpdateProductThumbnail}
        imagePreview={imagePreview}
        isDragOver={isDragOver}
        isLoading={isLoading}
        isOpen={isOpen}
        modalMode={modalMode}
        removeSelectedFile={removeSelectedFile}
        selectedProduct={selectedProduct}
        setFormData={setFormData}
        thumbnailFile={thumbnailFile}
        onClose={onClose}
      />
    </DashboardLayout>
  );
}
