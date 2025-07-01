"use client";

import { useState } from "react";
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
  Pagination,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ShoppingBagIcon,
  ClockIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

import { DashboardLayout } from "@/components/layout";

// Dados mockados
// Interface para o objeto de pedido
interface Order {
  id: string;
  customer: string;
  total: number;
  items: number;
  date: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  avatar: string;
}

const mockOrders: Order[] = [
  {
    id: "ORD001",
    customer: "João Silva",
    total: 1250.9,
    items: 3,
    date: "2025-06-25T10:30:00",
    status: "completed",
    paymentStatus: "paid",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: "ORD002",
    customer: "Maria Santos",
    total: 789.5,
    items: 2,
    date: "2025-06-26T14:45:00",
    status: "processing",
    paymentStatus: "paid",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: "ORD003",
    customer: "Pedro Almeida",
    total: 459.99,
    items: 1,
    date: "2025-06-27T09:15:00",
    status: "shipped",
    paymentStatus: "paid",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: "ORD004",
    customer: "Ana Costa",
    total: 2344.75,
    items: 5,
    date: "2025-06-28T16:20:00",
    status: "pending",
    paymentStatus: "pending",
    avatar: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: "ORD005",
    customer: "Lucas Ferreira",
    total: 589.9,
    items: 2,
    date: "2025-06-29T11:05:00",
    status: "cancelled",
    paymentStatus: "refunded",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: "ORD006",
    customer: "Juliana Lima",
    total: 1745.0,
    items: 4,
    date: "2025-06-30T13:40:00",
    status: "completed",
    paymentStatus: "paid",
    avatar: "https://i.pravatar.cc/150?img=6",
  },
  {
    id: "ORD007",
    customer: "Rafael Oliveira",
    total: 890.25,
    items: 3,
    date: "2025-07-01T08:50:00",
    status: "processing",
    paymentStatus: "paid",
    avatar: "https://i.pravatar.cc/150?img=7",
  },
  {
    id: "ORD008",
    customer: "Camila Rodrigues",
    total: 345.8,
    items: 1,
    date: "2025-07-01T09:30:00",
    status: "shipped",
    paymentStatus: "paid",
    avatar: "https://i.pravatar.cc/150?img=8",
  },
];

// Define os tipos de status possíveis
type OrderStatus =
  | "completed"
  | "processing"
  | "shipped"
  | "pending"
  | "cancelled";
type PaymentStatus = "paid" | "pending" | "refunded";

// Define valores válidos para a propriedade color do Chip
type ChipColor =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger";

const statusColorMap: Record<OrderStatus, ChipColor> = {
  completed: "success",
  processing: "primary",
  shipped: "secondary",
  pending: "warning",
  cancelled: "danger",
};

const paymentStatusColorMap: Record<PaymentStatus, ChipColor> = {
  paid: "success",
  pending: "warning",
  refunded: "danger",
};

export default function PedidosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const itemsPerPage = 5;

  // Filtragem de pedidos
  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    const matchesPayment =
      paymentFilter === "all" || order.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Paginação
  const totalOrders = filteredOrders.length;
  const totalPages = Math.ceil(totalOrders / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Formatação de data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Formatação de moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <DashboardLayout title="Pedidos">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Gerenciar Pedidos
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {totalOrders} pedidos encontrados
          </p>
        </div>
        <Button
          className="w-full sm:w-auto"
          color="primary"
          startContent={<ShoppingBagIcon className="w-4 h-4" />}
        >
          Novo Pedido
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800">
          <CardBody className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-600 dark:text-blue-300">
                  Total de Pedidos
                </p>
                <p className="text-lg sm:text-xl font-bold text-blue-900 dark:text-blue-100">
                  {mockOrders.length}
                </p>
              </div>
              <ShoppingBagIcon className="w-6 h-6 text-blue-600" />
            </div>
          </CardBody>
        </Card>
        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900 dark:to-yellow-800">
          <CardBody className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-yellow-600 dark:text-yellow-300">
                  Em Processamento
                </p>
                <p className="text-lg sm:text-xl font-bold text-yellow-900 dark:text-yellow-100">
                  {
                    mockOrders.filter(
                      (order) =>
                        order.status === "processing" ||
                        order.status === "pending",
                    ).length
                  }
                </p>
              </div>
              <ClockIcon className="w-6 h-6 text-yellow-600" />
            </div>
          </CardBody>
        </Card>
        <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900 dark:to-green-800">
          <CardBody className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-green-600 dark:text-green-300">
                  Concluídos
                </p>
                <p className="text-lg sm:text-xl font-bold text-green-900 dark:text-green-100">
                  {
                    mockOrders.filter((order) => order.status === "completed")
                      .length
                  }
                </p>
              </div>
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
          </CardBody>
        </Card>
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800">
          <CardBody className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-purple-600 dark:text-purple-300">
                  Faturamento Total
                </p>
                <p className="text-lg sm:text-xl font-bold text-purple-900 dark:text-purple-100">
                  {formatCurrency(
                    mockOrders.reduce((acc, order) => acc + order.total, 0),
                  )}
                </p>
              </div>
              <CurrencyDollarIcon className="w-6 h-6 text-purple-600" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardBody className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="w-full md:flex-1">
              <Input
                fullWidth
                isClearable
                endContent={
                  <Button
                    isIconOnly
                    color="primary"
                    size="sm"
                    onPress={() => {}}
                  >
                    <MagnifyingGlassIcon className="w-4 h-4" />
                  </Button>
                }
                label="Buscar pedido"
                placeholder="Digite nome do cliente ou número do pedido..."
                size="lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClear={() => setSearchTerm("")}
              />
            </div>
            <div className="flex flex-col xs:flex-row gap-2 w-full md:w-auto">
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    className="w-full xs:w-auto"
                    size="lg"
                    startContent={<FunnelIcon className="w-4 h-4" />}
                    variant="flat"
                  >
                    Status:{" "}
                    {statusFilter === "all"
                      ? "Todos"
                      : statusFilter === "completed"
                        ? "Concluído"
                        : statusFilter === "processing"
                          ? "Em processamento"
                          : statusFilter === "shipped"
                            ? "Enviado"
                            : statusFilter === "pending"
                              ? "Pendente"
                              : "Cancelado"}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Filtrar por status"
                  onAction={(key) => setStatusFilter(key.toString())}
                >
                  <DropdownItem key="all">Todos</DropdownItem>
                  <DropdownItem key="completed">Concluído</DropdownItem>
                  <DropdownItem key="processing">Em processamento</DropdownItem>
                  <DropdownItem key="shipped">Enviado</DropdownItem>
                  <DropdownItem key="pending">Pendente</DropdownItem>
                  <DropdownItem key="cancelled">Cancelado</DropdownItem>
                </DropdownMenu>
              </Dropdown>

              <Dropdown>
                <DropdownTrigger>
                  <Button
                    className="w-full xs:w-auto"
                    size="lg"
                    startContent={<CurrencyDollarIcon className="w-4 h-4" />}
                    variant="flat"
                  >
                    Pagamento:{" "}
                    {paymentFilter === "all"
                      ? "Todos"
                      : paymentFilter === "paid"
                        ? "Pago"
                        : paymentFilter === "pending"
                          ? "Pendente"
                          : "Reembolsado"}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Filtrar por pagamento"
                  onAction={(key) => setPaymentFilter(key.toString())}
                >
                  <DropdownItem key="all">Todos</DropdownItem>
                  <DropdownItem key="paid">Pago</DropdownItem>
                  <DropdownItem key="pending">Pendente</DropdownItem>
                  <DropdownItem key="refunded">Reembolsado</DropdownItem>
                </DropdownMenu>
              </Dropdown>

              <Button
                className="w-full xs:w-auto"
                size="lg"
                variant="flat"
                onPress={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setPaymentFilter("all");
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Orders Table */}
      <Card className="mb-6 overflow-hidden">
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <Table
              removeWrapper
              aria-label="Tabela de pedidos"
              classNames={{
                wrapper: "min-h-[400px]",
              }}
            >
              <TableHeader>
                <TableColumn>CLIENTE</TableColumn>
                <TableColumn>PEDIDO</TableColumn>
                <TableColumn className="hidden md:table-cell">DATA</TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn className="hidden md:table-cell">
                  PAGAMENTO
                </TableColumn>
                <TableColumn className="hidden lg:table-cell">
                  VALOR
                </TableColumn>
                <TableColumn className="w-[100px]">AÇÕES</TableColumn>
              </TableHeader>
              <TableBody emptyContent="Nenhum pedido encontrado">
                {paginatedOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-100 rounded-full overflow-hidden">
                          <Image
                            alt={order.customer}
                            className="w-full h-full object-cover"
                            height={32}
                            src={order.avatar}
                            width={32}
                          />
                        </div>
                        <div className="flex flex-col">
                          <p className="font-medium text-sm">
                            {order.customer}
                          </p>
                          <p className="text-xs text-gray-500 md:hidden">
                            {formatDate(order.date)}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <p className="font-semibold text-sm">{order.id}</p>
                        <p className="text-xs text-gray-500">
                          {order.items} {order.items > 1 ? "itens" : "item"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(order.date)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={statusColorMap[order.status]}
                        size="sm"
                        variant="flat"
                      >
                        {order.status === "completed" && "Concluído"}
                        {order.status === "processing" && "Em processamento"}
                        {order.status === "shipped" && "Enviado"}
                        {order.status === "pending" && "Pendente"}
                        {order.status === "cancelled" && "Cancelado"}
                      </Chip>
                      <p className="text-xs text-gray-500 mt-1 lg:hidden">
                        {formatCurrency(order.total)}
                      </p>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Chip
                        color={paymentStatusColorMap[order.paymentStatus]}
                        size="sm"
                        variant="flat"
                      >
                        {order.paymentStatus === "paid" && "Pago"}
                        {order.paymentStatus === "pending" && "Pendente"}
                        {order.paymentStatus === "refunded" && "Reembolsado"}
                      </Chip>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <p className="font-medium">
                        {formatCurrency(order.total)}
                      </p>
                    </TableCell>
                    <TableCell className="w-[100px] p-0 pr-2">
                      <div className="flex flex-wrap gap-0.5 sm:gap-1 justify-end">
                        <Button
                          isIconOnly
                          className="min-w-0 w-6 h-6 sm:w-7 sm:h-7 bg-blue-100 dark:bg-blue-900 text-blue-600"
                          size="sm"
                          title="Ver detalhes"
                        >
                          <svg
                            className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                            <path
                              clipRule="evenodd"
                              d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                              fillRule="evenodd"
                            />
                          </svg>
                        </Button>
                        <Button
                          isIconOnly
                          className="min-w-0 w-6 h-6 sm:w-7 sm:h-7 bg-amber-100 dark:bg-amber-900 text-amber-600"
                          size="sm"
                          title="Editar pedido"
                        >
                          <svg
                            className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                            <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                          </svg>
                        </Button>
                        <Button
                          isIconOnly
                          className="min-w-0 w-6 h-6 sm:w-7 sm:h-7 bg-red-100 dark:bg-red-900 text-red-600"
                          size="sm"
                          title="Cancelar pedido"
                        >
                          <svg
                            className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              clipRule="evenodd"
                              d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                              fillRule="evenodd"
                            />
                          </svg>
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

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex justify-center py-4 sm:py-6 sticky bottom-0 bg-gradient-to-t from-blue-50 to-transparent dark:from-gray-900 dark:to-transparent">
          <Pagination
            showControls
            showShadow
            className="sm:scale-110"
            classNames={{
              wrapper: "gap-0 xs:gap-1 sm:gap-2",
              item: "w-8 h-8 sm:w-10 sm:h-10",
              cursor: "bg-primary text-white font-semibold",
            }}
            color="primary"
            page={currentPage}
            size="sm"
            total={totalPages}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </DashboardLayout>
  );
}
