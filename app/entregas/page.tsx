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
  Progress,
} from "@heroui/react";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  TruckIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

import { DashboardLayout } from "@/components/layout";

// Interface para o objeto de entrega
interface Delivery {
  id: string;
  orderId: string;
  customer: string;
  address: string;
  date: string;
  estimatedDelivery: string;
  status: DeliveryStatus;
  trackingCode: string;
  courier: string;
  avatar: string;
  progress: number;
}

// Dados mockados
const mockDeliveries: Delivery[] = [
  {
    id: "DEL001",
    orderId: "ORD001",
    customer: "João Silva",
    address: "Rua das Flores, 123 - São Paulo, SP",
    date: "2025-06-25T10:30:00",
    estimatedDelivery: "2025-07-02T10:30:00",
    status: "delivered",
    trackingCode: "BR1234567890XX",
    courier: "SEDEX",
    avatar: "https://i.pravatar.cc/150?img=1",
    progress: 100,
  },
  {
    id: "DEL002",
    orderId: "ORD002",
    customer: "Maria Santos",
    address: "Av. Paulista, 1000 - São Paulo, SP",
    date: "2025-06-26T14:45:00",
    estimatedDelivery: "2025-07-03T14:45:00",
    status: "in_transit",
    trackingCode: "BR0987654321YY",
    courier: "PAC",
    avatar: "https://i.pravatar.cc/150?img=2",
    progress: 60,
  },
  {
    id: "DEL003",
    orderId: "ORD003",
    customer: "Pedro Almeida",
    address: "Rua dos Pinheiros, 500 - São Paulo, SP",
    date: "2025-06-27T09:15:00",
    estimatedDelivery: "2025-07-04T09:15:00",
    status: "processing",
    trackingCode: "BR5678901234ZZ",
    courier: "SEDEX",
    avatar: "https://i.pravatar.cc/150?img=3",
    progress: 25,
  },
  {
    id: "DEL004",
    orderId: "ORD004",
    customer: "Ana Costa",
    address: "Rua Augusta, 200 - São Paulo, SP",
    date: "2025-06-28T16:20:00",
    estimatedDelivery: "2025-07-05T16:20:00",
    status: "pending",
    trackingCode: "BR2345678901AA",
    courier: "PAC",
    avatar: "https://i.pravatar.cc/150?img=4",
    progress: 0,
  },
  {
    id: "DEL005",
    orderId: "ORD005",
    customer: "Lucas Ferreira",
    address: "Av. Rebouças, 300 - São Paulo, SP",
    date: "2025-06-29T11:05:00",
    estimatedDelivery: "2025-07-06T11:05:00",
    status: "cancelled",
    trackingCode: "BR3456789012BB",
    courier: "SEDEX",
    avatar: "https://i.pravatar.cc/150?img=5",
    progress: 0,
  },
  {
    id: "DEL006",
    orderId: "ORD006",
    customer: "Juliana Lima",
    address: "Rua Oscar Freire, 400 - São Paulo, SP",
    date: "2025-06-30T13:40:00",
    estimatedDelivery: "2025-07-07T13:40:00",
    status: "delivered",
    trackingCode: "BR4567890123CC",
    courier: "SEDEX",
    avatar: "https://i.pravatar.cc/150?img=6",
    progress: 100,
  },
  {
    id: "DEL007",
    orderId: "ORD007",
    customer: "Rafael Oliveira",
    address: "Av. Brigadeiro Faria Lima, 1500 - São Paulo, SP",
    date: "2025-07-01T08:50:00",
    estimatedDelivery: "2025-07-08T08:50:00",
    status: "in_transit",
    trackingCode: "BR5678901234DD",
    courier: "PAC",
    avatar: "https://i.pravatar.cc/150?img=7",
    progress: 75,
  },
  {
    id: "DEL008",
    orderId: "ORD008",
    customer: "Camila Rodrigues",
    address: "Rua Haddock Lobo, 600 - São Paulo, SP",
    date: "2025-07-01T09:30:00",
    estimatedDelivery: "2025-07-08T09:30:00",
    status: "processing",
    trackingCode: "BR6789012345EE",
    courier: "SEDEX",
    avatar: "https://i.pravatar.cc/150?img=8",
    progress: 15,
  },
];

// Define os tipos de status possíveis
type DeliveryStatus =
  | "delivered"
  | "in_transit"
  | "processing"
  | "pending"
  | "cancelled";

// Define valores válidos para a propriedade color do Chip
type ChipColor =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger";

// Define o mapeamento de status para cores
const statusColorMap: Record<DeliveryStatus, ChipColor> = {
  delivered: "success",
  in_transit: "primary",
  processing: "secondary",
  pending: "warning",
  cancelled: "danger",
};

export default function EntregasPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [courierFilter, setCourierFilter] = useState("all");

  const itemsPerPage = 5;

  // Filtragem de entregas
  const filteredDeliveries = mockDeliveries.filter((delivery) => {
    const matchesSearch =
      delivery.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.trackingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.orderId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || delivery.status === statusFilter;
    const matchesCourier =
      courierFilter === "all" || delivery.courier === courierFilter;

    return matchesSearch && matchesStatus && matchesCourier;
  });

  // Paginação
  const totalDeliveries = filteredDeliveries.length;
  const totalPages = Math.ceil(totalDeliveries / itemsPerPage);
  const paginatedDeliveries = filteredDeliveries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Formatação de data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Cálculo de dias restantes
  const getDaysRemaining = (estimatedDate: string) => {
    const today = new Date();
    const estDate = new Date(estimatedDate);
    const diffTime = estDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  // Status de entrega em texto
  const getStatusText = (status: string) => {
    switch (status) {
      case "delivered":
        return "Entregue";
      case "in_transit":
        return "Em trânsito";
      case "processing":
        return "Em processamento";
      case "pending":
        return "Pendente";
      case "cancelled":
        return "Cancelada";
      default:
        return status;
    }
  };

  return (
    <DashboardLayout title="Entregas">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Gerenciar Entregas
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {totalDeliveries} entregas encontradas
          </p>
        </div>
        <Button
          className="w-full sm:w-auto"
          color="primary"
          startContent={<TruckIcon className="w-4 h-4" />}
        >
          Nova Entrega
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800">
          <CardBody className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-600 dark:text-blue-300">
                  Total de Entregas
                </p>
                <p className="text-lg sm:text-xl font-bold text-blue-900 dark:text-blue-100">
                  {mockDeliveries.length}
                </p>
              </div>
              <TruckIcon className="w-6 h-6 text-blue-600" />
            </div>
          </CardBody>
        </Card>
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800">
          <CardBody className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-purple-600 dark:text-purple-300">
                  Em Trânsito
                </p>
                <p className="text-lg sm:text-xl font-bold text-purple-900 dark:text-purple-100">
                  {
                    mockDeliveries.filter(
                      (delivery) => delivery.status === "in_transit",
                    ).length
                  }
                </p>
              </div>
              <ArrowPathIcon className="w-6 h-6 text-purple-600" />
            </div>
          </CardBody>
        </Card>
        <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900 dark:to-green-800">
          <CardBody className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-green-600 dark:text-green-300">
                  Entregues
                </p>
                <p className="text-lg sm:text-xl font-bold text-green-900 dark:text-green-100">
                  {
                    mockDeliveries.filter(
                      (delivery) => delivery.status === "delivered",
                    ).length
                  }
                </p>
              </div>
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
          </CardBody>
        </Card>
        <Card className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900 dark:to-red-800">
          <CardBody className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-red-600 dark:text-red-300">
                  Canceladas
                </p>
                <p className="text-lg sm:text-xl font-bold text-red-900 dark:text-red-100">
                  {
                    mockDeliveries.filter(
                      (delivery) => delivery.status === "cancelled",
                    ).length
                  }
                </p>
              </div>
              <XCircleIcon className="w-6 h-6 text-red-600" />
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
                label="Rastreamento"
                placeholder="Digite nome, código de rastreio ou número do pedido..."
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
                      : getStatusText(statusFilter)}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Filtrar por status"
                  onAction={(key) => setStatusFilter(key.toString())}
                >
                  <DropdownItem key="all">Todos</DropdownItem>
                  <DropdownItem key="delivered">Entregue</DropdownItem>
                  <DropdownItem key="in_transit">Em trânsito</DropdownItem>
                  <DropdownItem key="processing">Em processamento</DropdownItem>
                  <DropdownItem key="pending">Pendente</DropdownItem>
                  <DropdownItem key="cancelled">Cancelada</DropdownItem>
                </DropdownMenu>
              </Dropdown>

              <Dropdown>
                <DropdownTrigger>
                  <Button
                    className="w-full xs:w-auto"
                    size="lg"
                    startContent={<TruckIcon className="w-4 h-4" />}
                    variant="flat"
                  >
                    Transportadora:{" "}
                    {courierFilter === "all" ? "Todas" : courierFilter}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Filtrar por transportadora"
                  onAction={(key) => setCourierFilter(key.toString())}
                >
                  <DropdownItem key="all">Todas</DropdownItem>
                  <DropdownItem key="SEDEX">SEDEX</DropdownItem>
                  <DropdownItem key="PAC">PAC</DropdownItem>
                </DropdownMenu>
              </Dropdown>

              <Button
                className="w-full xs:w-auto"
                size="lg"
                variant="flat"
                onPress={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setCourierFilter("all");
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Deliveries Table */}
      <Card className="mb-6 overflow-hidden">
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <Table
              removeWrapper
              aria-label="Tabela de entregas"
              classNames={{
                wrapper: "min-h-[400px]",
              }}
            >
              <TableHeader>
                <TableColumn>CLIENTE/PEDIDO</TableColumn>
                <TableColumn className="hidden md:table-cell">
                  ENDEREÇO
                </TableColumn>
                <TableColumn>RASTREIO</TableColumn>
                <TableColumn className="hidden md:table-cell">
                  PROGRESSO
                </TableColumn>
                <TableColumn className="hidden lg:table-cell">
                  PREVISÃO
                </TableColumn>
                <TableColumn className="w-[100px]">AÇÕES</TableColumn>
              </TableHeader>
              <TableBody emptyContent="Nenhuma entrega encontrada">
                {paginatedDeliveries.map((delivery) => (
                  <TableRow key={delivery.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-100 rounded-full overflow-hidden">
                          <Image
                            alt={delivery.customer}
                            className="w-full h-full object-cover"
                            height={32}
                            src={delivery.avatar}
                            width={32}
                          />
                        </div>
                        <div className="flex flex-col">
                          <p className="font-medium text-sm">
                            {delivery.customer}
                          </p>
                          <p className="text-xs text-gray-500">
                            {delivery.orderId}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-start gap-2">
                        <MapPinIcon className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm line-clamp-2">
                          {delivery.address}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <Chip
                            color={statusColorMap[delivery.status]}
                            size="sm"
                            variant="flat"
                          >
                            {getStatusText(delivery.status)}
                          </Chip>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <p className="text-xs font-mono text-gray-500">
                            {delivery.trackingCode}
                          </p>
                          <span className="text-xs text-gray-400">
                            ({delivery.courier})
                          </span>
                        </div>
                        <div className="md:hidden mt-1">
                          <Progress
                            className="max-w-[100px]"
                            color={
                              delivery.status === "cancelled"
                                ? "danger"
                                : delivery.status === "delivered"
                                  ? "success"
                                  : "primary"
                            }
                            size="sm"
                            value={delivery.progress}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="w-full max-w-[180px]">
                        <Progress
                          color={
                            delivery.status === "cancelled"
                              ? "danger"
                              : delivery.status === "delivered"
                                ? "success"
                                : "primary"
                          }
                          label={`${delivery.progress}%`}
                          showValueLabel={true}
                          size="md"
                          value={delivery.progress}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {delivery.status === "delivered" ? (
                        <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                          <CheckCircleIcon className="w-4 h-4" />
                          Entregue em {formatDate(delivery.estimatedDelivery)}
                        </span>
                      ) : delivery.status === "cancelled" ? (
                        <span className="text-red-600 dark:text-red-400 flex items-center gap-1">
                          <XCircleIcon className="w-4 h-4" />
                          Cancelada
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <ClockIcon className="w-4 h-4 text-gray-400" />
                          {formatDate(delivery.estimatedDelivery)}
                          <span className="text-xs text-gray-500">
                            {getDaysRemaining(delivery.estimatedDelivery) > 0
                              ? `(${getDaysRemaining(delivery.estimatedDelivery)} dias)`
                              : "(Hoje)"}
                          </span>
                        </span>
                      )}
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
                          title="Atualizar status"
                        >
                          <svg
                            className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              clipRule="evenodd"
                              d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z"
                              fillRule="evenodd"
                            />
                          </svg>
                        </Button>
                        <Button
                          isIconOnly
                          className="min-w-0 w-6 h-6 sm:w-7 sm:h-7 bg-red-100 dark:bg-red-900 text-red-600"
                          size="sm"
                          title="Cancelar entrega"
                        >
                          <svg
                            className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
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
