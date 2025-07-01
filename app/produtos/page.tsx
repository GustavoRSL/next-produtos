"use client";

import type { Product } from "@/lib/services/products";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Card,
  CardBody,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Switch,
  Textarea,
} from "@heroui/react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

import { DashboardLayout } from "@/components/layout";
import { useProductStore } from "@/lib/stores/products";

export default function ProdutosPage() {
  const {
    products,
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

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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

      onClose();
    } catch {
      // Error handled by store
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        await deleteProduct(productId);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ["Bytes", "KB", "MB", "GB"];

    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));

    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleUpdateProductThumbnail = async () => {
    if (!selectedProduct || !thumbnailFile) return;

    try {
      await updateProductThumbnail(selectedProduct.id, thumbnailFile);
      
      // Recarregar produtos para mostrar a nova thumbnail
      await fetchProducts();
      
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Gerenciar Produtos
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {products.length} produtos cadastrados
          </p>
        </div>
        <Button
          color="primary"
          startContent={<PlusIcon className="w-4 h-4" />}
          onPress={() => handleOpenModal("create")}
        >
          Novo Produto
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardBody className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {products.length}
              </p>
              <p className="text-sm text-gray-600">Total de Produtos</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {products.filter((p: Product) => p.status === true).length}
              </p>
              <p className="text-sm text-gray-600">Produtos Ativos</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {products.filter((p: Product) => p.status === false).length}
              </p>
              <p className="text-sm text-gray-600">Produtos Inativos</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Products Table */}
      <Card>
        <CardBody>
          <Table aria-label="Tabela de produtos">
            <TableHeader>
              <TableColumn>PRODUTO</TableColumn>
              <TableColumn>THUMBNAIL</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>CRIADO EM</TableColumn>
              <TableColumn>AÇÕES</TableColumn>
            </TableHeader>
            <TableBody emptyContent="Nenhum produto encontrado">
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{product.title}</p>
                      <p className="text-sm text-gray-500 max-w-xs truncate">
                        {product.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {product.thumbnail?.url ? (
                          <Image
                            alt={product.thumbnail.originalName}
                            className="w-full h-full object-cover"
                            height={48}
                            src={product.thumbnail.url}
                            width={48}
                          />
                        ) : (
                          <PhotoIcon className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div className="text-sm">
                        <p className="text-gray-600">
                          {product.thumbnail?.originalName || "Sem imagem"}
                        </p>
                        <p className="text-gray-400">
                          {product.thumbnail?.size
                            ? formatFileSize(product.thumbnail.size)
                            : ""}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={product.status ? "success" : "danger"}
                      size="sm"
                      variant="flat"
                    >
                      {product.status ? "Ativo" : "Inativo"}
                    </Chip>
                  </TableCell>
                  <TableCell>{formatDate(product.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => handleOpenModal("view", product)}
                      >
                        <EyeIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => handleOpenModal("edit", product)}
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        isIconOnly
                        color="danger"
                        size="sm"
                        variant="light"
                        onPress={() => handleDeleteProduct(product.id)}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Modal */}
      <Modal isOpen={isOpen} size="2xl" onClose={onClose}>
        <ModalContent>
          <ModalHeader>
            {modalMode === "create" && "Novo Produto"}
            {modalMode === "edit" && "Editar Produto"}
            {modalMode === "view" && "Detalhes do Produto"}
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                isReadOnly={modalMode === "view"}
                label="Título"
                placeholder="Digite o título do produto"
                value={
                  modalMode === "view"
                    ? selectedProduct?.title || ""
                    : formData.title
                }
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
              <Textarea
                isReadOnly={modalMode === "view"}
                label="Descrição"
                minRows={3}
                placeholder="Digite a descrição do produto"
                value={
                  modalMode === "view"
                    ? selectedProduct?.description || ""
                    : formData.description
                }
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
              {modalMode === "edit" && (
                <>
                  <Switch
                    isSelected={formData.status}
                    onValueChange={(isSelected) =>
                      setFormData({ ...formData, status: isSelected })
                    }
                  >
                    Produto Ativo
                  </Switch>
                  
                  <div className="space-y-2">
                    <p className="block text-sm font-medium text-gray-700">
                      Atualizar Thumbnail
                    </p>
                    <div
                      className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                        isDragOver
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300"
                      }`}
                      onDragLeave={handleDragLeave}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      {imagePreview ? (
                        <div className="space-y-2">
                          <div className="relative inline-block">
                            <Image
                              alt="Preview"
                              className="max-w-32 max-h-32 object-cover rounded-lg"
                              height={128}
                              src={imagePreview}
                              width={128}
                            />
                            <button
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 text-xs"
                              type="button"
                              onClick={removeSelectedFile}
                            >
                              ×
                            </button>
                          </div>
                          <p className="text-xs text-gray-600">
                            {thumbnailFile?.name}
                          </p>
                          <Button
                            color="primary"
                            isLoading={isLoading}
                            size="sm"
                            onPress={handleUpdateProductThumbnail}
                          >
                            Atualizar Thumbnail
                          </Button>
                        </div>
                      ) : (
                        <>
                          <PhotoIcon className="mx-auto h-8 w-8 text-gray-400" />
                          <p className="mt-1 text-xs text-gray-600">
                            Nova imagem (opcional)
                          </p>
                          <input
                            accept="image/*"
                            className="hidden"
                            id="thumbnail-upload-edit"
                            type="file"
                            onChange={handleFileChange}
                          />
                          <label
                            className="cursor-pointer inline-block mt-1 px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                            htmlFor="thumbnail-upload-edit"
                          >
                            Selecionar
                          </label>
                        </>
                      )}
                    </div>
                    
                    {selectedProduct?.thumbnail && (
                      <div className="text-xs text-gray-500">
                        <p>
                          Thumbnail atual:{" "}
                          {selectedProduct.thumbnail.originalName}
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
              {modalMode === "view" && (
                <div className="space-y-2">
                  <p>
                    <strong>Status:</strong>{" "}
                    {selectedProduct?.status ? "Ativo" : "Inativo"}
                  </p>
                  <p>
                    <strong>Criado em:</strong>{" "}
                    {selectedProduct
                      ? formatDate(selectedProduct.createdAt)
                      : ""}
                  </p>
                  <p>
                    <strong>Atualizado em:</strong>{" "}
                    {selectedProduct
                      ? formatDate(selectedProduct.updatedAt)
                      : ""}
                  </p>
                  {selectedProduct?.thumbnail && (
                    <div>
                      <strong>Thumbnail:</strong>
                      <p className="text-sm text-gray-600">
                        {selectedProduct.thumbnail.originalName} (
                        {formatFileSize(selectedProduct.thumbnail.size || 0)})
                      </p>
                    </div>
                  )}
                </div>
              )}
              {modalMode === "create" && (
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    isDragOver
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300"
                  }`}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {imagePreview ? (
                    <div className="space-y-4">
                      <div className="relative inline-block">
                        <Image
                          alt="Preview"
                          className="max-w-48 max-h-48 object-cover rounded-lg"
                          height={192}
                          src={imagePreview}
                          width={192}
                        />
                        <button
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                          type="button"
                          onClick={removeSelectedFile}
                        >
                          ×
                        </button>
                      </div>
                      <p className="text-sm text-gray-600">
                        {thumbnailFile?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Clique no X para remover ou arraste uma nova imagem
                      </p>
                    </div>
                  ) : (
                    <>
                      <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        Clique para adicionar uma imagem ou arraste aqui
                      </p>
                      <input
                        accept="image/*"
                        className="hidden"
                        id="thumbnail-upload"
                        type="file"
                        onChange={handleFileChange}
                      />
                      <label
                        className="cursor-pointer inline-block mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        htmlFor="thumbnail-upload"
                      >
                        Selecionar Arquivo
                      </label>
                    </>
                  )}
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              {modalMode === "view" ? "Fechar" : "Cancelar"}
            </Button>
            {modalMode === "create" && (
              <Button
                color="primary"
                isLoading={isLoading}
                onPress={handleCreateProduct}
              >
                Criar
              </Button>
            )}
            {modalMode === "edit" && (
              <Button
                color="primary"
                isLoading={isLoading}
                onPress={handleUpdateProduct}
              >
                Salvar
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </DashboardLayout>
  );
}
