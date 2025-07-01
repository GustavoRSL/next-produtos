import React from "react";
import {
  Card,
  CardBody,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
} from "@heroui/react";
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

import { formatDate } from "@/lib/utils/format";
import { Product } from "@/lib/services/products";

interface ProductsTableProps {
  products: Product[];
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <Card className="mb-6 overflow-hidden">
      <CardBody className="p-0">
        <div className="overflow-x-auto">
          <Table
            removeWrapper
            aria-label="Tabela de produtos"
            classNames={{
              wrapper: "min-h-[400px]",
            }}
          >
            <TableHeader>
              <TableColumn>PRODUTO</TableColumn>
              <TableColumn className="hidden md:table-cell">
                THUMBNAIL
              </TableColumn>
              <TableColumn className="hidden md:table-cell">STATUS</TableColumn>
              <TableColumn className="hidden lg:table-cell">
                CRIADO EM
              </TableColumn>
              <TableColumn className="w-[100px]">AÇÕES</TableColumn>
            </TableHeader>
            <TableBody emptyContent="Nenhum produto encontrado">
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 justify-between sm:justify-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium text-sm sm:text-base">
                              {product.title}
                            </p>
                            <div className="sm:hidden">
                              <Chip
                                color={product.status ? "success" : "danger"}
                                size="sm"
                                variant="flat"
                              >
                                {product.status ? "Ativo" : "Inativo"}
                              </Chip>
                            </div>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-500 max-w-[200px] sm:max-w-xs truncate">
                            {product.description}
                          </p>
                        </div>
                        {/* Miniatura para mobile (direita) */}
                        <div className="md:hidden flex items-center">
                          <div className="w-9 h-9 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                            {product.thumbnail?.url ? (
                              <Image
                                alt="Mini thumbnail"
                                className="w-full h-full object-cover"
                                height={36}
                                src={product.thumbnail.url}
                                width={36}
                              />
                            ) : (
                              <PhotoIcon className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </div>
                      {/* Data para mobile */}
                      <div className="md:hidden flex items-center">
                        <p className="text-xs text-gray-500">
                          {formatDate(product.createdAt)}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {product.thumbnail?.url ? (
                          <Image
                            alt={product.thumbnail.originalName}
                            className="w-full h-full object-cover"
                            height={48}
                            src={product.thumbnail.url}
                            width={48}
                          />
                        ) : (
                          <PhotoIcon className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
                        )}
                      </div>
                      <div className="text-sm">
                        <p className="text-gray-600 text-xs md:text-sm max-w-[120px] lg:max-w-full truncate">
                          {product.thumbnail?.originalName || "Sem imagem"}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {product.thumbnail?.size
                            ? formatFileSize(product.thumbnail.size)
                            : ""}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Chip
                      color={product.status ? "success" : "danger"}
                      size="sm"
                      variant="flat"
                    >
                      {product.status ? "Ativo" : "Inativo"}
                    </Chip>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {formatDate(product.createdAt)}
                  </TableCell>
                  <TableCell className="w-[100px] p-0 pr-2">
                    <div className="flex flex-wrap gap-0.5 sm:gap-1 justify-end">
                      <Button
                        isIconOnly
                        className="min-w-0 w-6 h-6 sm:w-7 sm:h-7 bg-blue-100 dark:bg-blue-900 text-blue-600"
                        size="sm"
                        title="Ver detalhes"
                        onPress={() => onView(product)}
                      >
                        <EyeIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </Button>
                      <Button
                        isIconOnly
                        className="min-w-0 w-6 h-6 sm:w-7 sm:h-7 bg-amber-100 dark:bg-amber-900 text-amber-600"
                        size="sm"
                        title="Editar produto"
                        onPress={() => onEdit(product)}
                      >
                        <PencilIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </Button>
                      <Button
                        isIconOnly
                        className="min-w-0 w-6 h-6 sm:w-7 sm:h-7 bg-red-100 dark:bg-red-900 text-red-600"
                        size="sm"
                        title="Excluir produto"
                        onPress={() => onDelete(product.id)}
                      >
                        <TrashIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardBody>
    </Card>
  );
};

// Função auxiliar para formatação de tamanho de arquivo
const formatFileSize = (bytes: number) => {
  const sizes = ["Bytes", "KB", "MB", "GB"];

  if (bytes === 0) return "0 Bytes";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
};

export default ProductsTable;
