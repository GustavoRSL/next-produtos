import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  Button,
  Switch,
} from "@heroui/react";
import { PhotoIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

import { formatFileSize, formatDate } from "@/lib/utils/format";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalMode: "create" | "edit" | "view";
  selectedProduct: any | null;
  formData: any;
  setFormData: (data: any) => void;
  imagePreview: string | null;
  thumbnailFile: File | null;
  isDragOver: boolean;
  isLoading: boolean;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeSelectedFile: () => void;
  handleCreateProduct: () => void;
  handleUpdateProduct: () => void;
  handleUpdateProductThumbnail: () => void;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  modalMode,
  selectedProduct,
  formData,
  setFormData,
  imagePreview,
  thumbnailFile,
  isDragOver,
  isLoading,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleFileChange,
  removeSelectedFile,
  handleCreateProduct,
  handleUpdateProduct,
  handleUpdateProductThumbnail,
}) => {
  return (
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
                  {selectedProduct ? formatDate(selectedProduct.createdAt) : ""}
                </p>
                <p>
                  <strong>Atualizado em:</strong>{" "}
                  {selectedProduct ? formatDate(selectedProduct.updatedAt) : ""}
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
                  isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"
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
  );
};

export default ProductFormModal;
