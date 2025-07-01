"use client";

import { useEffect, useState } from "react";
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
  Select,
  SelectItem,
} from "@heroui/react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

import { DashboardLayout } from "@/components/layout";
import { useProductStore } from "@/lib/stores/products";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  description?: string;
  status: "active" | "inactive";
  createdAt: string;
}

const categories = ["Eletrônicos", "Roupas", "Casa", "Esporte", "Livros"];

export default function ProdutosPage() {
  const { fetchProducts } = useProductStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">(
    "create",
  );

  // Mock data - substituir pela integração real
  const mockProducts: Product[] = [
    {
      id: "1",
      name: "iPhone 15 Pro",
      price: 8999.99,
      stock: 15,
      category: "Eletrônicos",
      description: "Smartphone Apple iPhone 15 Pro 256GB",
      status: "active",
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      name: "Camiseta Básica",
      price: 49.99,
      stock: 150,
      category: "Roupas",
      description: "Camiseta 100% algodão",
      status: "active",
      createdAt: "2024-01-10",
    },
    {
      id: "3",
      name: "Notebook Dell",
      price: 3499.99,
      stock: 5,
      category: "Eletrônicos",
      description: "Notebook Dell Inspiron 15 3000",
      status: "active",
      createdAt: "2024-01-08",
    },
    {
      id: "4",
      name: "Mesa de Jantar",
      price: 899.99,
      stock: 0,
      category: "Casa",
      description: "Mesa de jantar 6 lugares",
      status: "inactive",
      createdAt: "2024-01-05",
    },
  ];

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleOpenModal = (
    mode: "create" | "edit" | "view",
    product?: Product,
  ) => {
    setModalMode(mode);
    setSelectedProduct(product || null);
    onOpen();
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { color: "danger" as const, text: "Sem estoque" };
    if (stock < 10) return { color: "warning" as const, text: "Baixo estoque" };

    return { color: "success" as const, text: "Em estoque" };
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  return (
    <DashboardLayout title="Produtos">
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Gerenciar Produtos
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {mockProducts.length} produtos cadastrados
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
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card>
          <CardBody className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {mockProducts.length}
              </p>
              <p className="text-sm text-gray-600">Total de Produtos</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {mockProducts.filter((p) => p.status === "active").length}
              </p>
              <p className="text-sm text-gray-600">Produtos Ativos</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {mockProducts.filter((p) => p.stock === 0).length}
              </p>
              <p className="text-sm text-gray-600">Sem Estoque</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {mockProducts.filter((p) => p.stock < 10 && p.stock > 0).length}
              </p>
              <p className="text-sm text-gray-600">Baixo Estoque</p>
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
              <TableColumn>CATEGORIA</TableColumn>
              <TableColumn>PREÇO</TableColumn>
              <TableColumn>ESTOQUE</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>AÇÕES</TableColumn>
            </TableHeader>
            <TableBody>
              {mockProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock);

                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">
                          {product.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{formatPrice(product.price)}</TableCell>
                    <TableCell>
                      <Chip color={stockStatus.color} size="sm" variant="flat">
                        {product.stock} unidades
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={
                          product.status === "active" ? "success" : "danger"
                        }
                        size="sm"
                        variant="flat"
                      >
                        {product.status === "active" ? "Ativo" : "Inativo"}
                      </Chip>
                    </TableCell>
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
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
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
                label="Nome do Produto"
                placeholder="Digite o nome do produto"
                value={selectedProduct?.name || ""}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  isReadOnly={modalMode === "view"}
                  label="Preço"
                  placeholder="0,00"
                  startContent="R$"
                  type="number"
                  value={selectedProduct?.price?.toString() || ""}
                />
                <Input
                  isReadOnly={modalMode === "view"}
                  label="Estoque"
                  placeholder="0"
                  type="number"
                  value={selectedProduct?.stock?.toString() || ""}
                />
              </div>
              <Select
                isDisabled={modalMode === "view"}
                label="Categoria"
                placeholder="Selecione uma categoria"
                selectedKeys={
                  selectedProduct?.category ? [selectedProduct.category] : []
                }
              >
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </Select>
              <Input
                isReadOnly={modalMode === "view"}
                label="Descrição"
                placeholder="Descrição do produto"
                value={selectedProduct?.description || ""}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              {modalMode === "view" ? "Fechar" : "Cancelar"}
            </Button>
            {modalMode !== "view" && (
              <Button color="primary" onPress={onClose}>
                {modalMode === "create" ? "Criar" : "Salvar"}
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </DashboardLayout>
  );
}
