"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, Button, Spinner, Input } from "@heroui/react";
import {
  ChartBarIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  CubeIcon,
  TruckIcon,
  ArchiveBoxIcon,
  MagnifyingGlassIcon,
  BellIcon,
  Cog6ToothIcon,
  ClipboardDocumentListIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";

import { useAuthStore } from "@/lib/stores/auth";
import { DonutChart, BarChart } from "@/components/charts";

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Dados mockados baseados no contexto de produtos, entregas e estoque
  const produtosPorCategoriaData = {
    labels: ["Eletrônicos", "Roupas", "Casa", "Esporte", "Livros"],
    datasets: [
      {
        data: [245, 132, 89, 67, 43],
        backgroundColor: [
          "#06B6D4",
          "#10B981",
          "#F59E0B",
          "#EF4444",
          "#8B5CF6",
        ],
        borderWidth: 0,
      },
    ],
  };

  const estoqueStatusData = {
    labels: [
      "Em Estoque",
      "Baixo Estoque",
      "Sem Estoque",
      "Reservado",
      "Pendente",
    ],
    datasets: [
      {
        data: [1450, 234, 89, 156, 78],
        backgroundColor: [
          "#06B6D4",
          "#10B981",
          "#F59E0B",
          "#EF4444",
          "#8B5CF6",
        ],
        borderWidth: 0,
      },
    ],
  };

  const entregasMensaisData = {
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai"],
    datasets: [
      {
        label: "Entregues",
        data: [456, 589, 432, 678, 523],
        backgroundColor: "#06B6D4",
        borderRadius: 4,
      },
      {
        label: "Pendentes",
        data: [123, 234, 189, 298, 167],
        backgroundColor: "#10B981",
        borderRadius: 4,
      },
      {
        label: "Atrasadas",
        data: [45, 67, 23, 89, 34],
        backgroundColor: "#F59E0B",
        borderRadius: 4,
      },
    ],
  };

  const vendasTrimestralData = {
    labels: ["Q1 2023", "Q2 2023", "Q3 2023", "Q4 2023", "Q1 2024"],
    datasets: [
      {
        label: "Produtos Vendidos",
        data: [2450, 3200, 2890, 4100, 3650],
        backgroundColor: "#06B6D4",
        borderRadius: 4,
      },
      {
        label: "Devoluções",
        data: [245, 320, 289, 410, 365],
        backgroundColor: "#EF4444",
        borderRadius: 4,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-xl border-r border-gray-200 dark:border-gray-700 z-50">
        <div className="p-6">
          <div className="flex items-center mb-8">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">PS</span>
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">
              ProdStock
            </span>
          </div>

          <nav className="space-y-2">
            <div className="flex items-center px-4 py-3 bg-blue-50 dark:bg-blue-900 rounded-lg border-l-4 border-blue-500">
              <ChartBarIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" />
              <span className="text-blue-600 dark:text-blue-400 font-medium">
                Dashboard
              </span>
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Dashboard
                </h1>
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Input
                    className="w-80"
                    placeholder="Buscar produtos..."
                    startContent={
                      <MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />
                    }
                    variant="bordered"
                  />
                </div>
                <Button isIconOnly variant="ghost">
                  <BellIcon className="w-5 h-5 text-gray-600" />
                </Button>
                <Button isIconOnly variant="ghost">
                  <Cog6ToothIcon className="w-5 h-5 text-gray-600" />
                </Button>
                <div className="flex items-center space-x-2">
                  <UserIcon className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {user?.name}
                  </span>
                </div>
                <Button isIconOnly variant="ghost" onClick={handleLogout}>
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-6 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800">
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-600 dark:text-orange-300">
                      Total Produtos
                    </p>
                    <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                      2.543
                    </p>
                  </div>
                  <CubeIcon className="w-8 h-8 text-orange-600" />
                </div>
              </CardBody>
            </Card>

            <Card className="bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800">
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 dark:text-blue-300">
                      Em Estoque
                    </p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                      1.890
                    </p>
                  </div>
                  <ArchiveBoxIcon className="w-8 h-8 text-blue-600" />
                </div>
              </CardBody>
            </Card>

            <Card className="bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900 dark:to-green-800">
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 dark:text-green-300">
                      Entregas Hoje
                    </p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                      127
                    </p>
                  </div>
                  <TruckIcon className="w-8 h-8 text-green-600" />
                </div>
              </CardBody>
            </Card>

            <Card className="bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800">
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 dark:text-purple-300">
                      Pedidos
                    </p>
                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                      89
                    </p>
                  </div>
                  <ClipboardDocumentListIcon className="w-8 h-8 text-purple-600" />
                </div>
              </CardBody>
            </Card>

            <Card className="bg-gradient-to-r from-indigo-100 to-indigo-200 dark:from-indigo-900 dark:to-indigo-800">
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-indigo-600 dark:text-indigo-300">
                      Vendas Mês
                    </p>
                    <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                      R$ 45.2k
                    </p>
                  </div>
                  <ShoppingBagIcon className="w-8 h-8 text-indigo-600" />
                </div>
              </CardBody>
            </Card>

            <Card className="bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900 dark:to-red-800">
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-600 dark:text-red-300">
                      Baixo Estoque
                    </p>
                    <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                      34
                    </p>
                  </div>
                  <ArchiveBoxIcon className="w-8 h-8 text-red-600" />
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Produtos por Categoria */}
            <Card>
              <CardBody className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Produtos por Categoria
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Total de Produtos
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                      576
                    </p>
                    <DonutChart
                      centerValue="576"
                      data={produtosPorCategoriaData}
                      size={120}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Status do Estoque
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                      2.007
                    </p>
                    <DonutChart
                      centerValue="2.007"
                      data={estoqueStatusData}
                      size={120}
                    />
                  </div>
                </div>
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-cyan-500 rounded-full mr-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Eletrônicos
                      </span>
                    </div>
                    <div className="flex space-x-8">
                      <span className="text-sm font-medium">245</span>
                      <span className="text-sm font-medium">1.450</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Roupas
                      </span>
                    </div>
                    <div className="flex space-x-8">
                      <span className="text-sm font-medium">132</span>
                      <span className="text-sm font-medium">234</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-amber-500 rounded-full mr-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Casa
                      </span>
                    </div>
                    <div className="flex space-x-8">
                      <span className="text-sm font-medium">89</span>
                      <span className="text-sm font-medium">89</span>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Entregas Mensais */}
            <Card>
              <CardBody className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Entregas Mensais
                </h3>
                <BarChart data={entregasMensaisData} height={200} />
                <div className="flex justify-center mt-4 space-x-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-cyan-500 rounded-full mr-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Entregues
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Pendentes
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-amber-500 rounded-full mr-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Atrasadas
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Bottom Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Vendas Trimestrais */}
            <Card>
              <CardBody className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Vendas e Devoluções por Trimestre
                </h3>
                <BarChart data={vendasTrimestralData} height={250} />
                <div className="flex justify-center mt-4 space-x-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-cyan-500 rounded-full mr-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Vendidos
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Devoluções
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Relatório de Estoque */}
            <Card>
              <CardBody className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Status do Estoque
                  </h3>
                  <Button className="text-xs" size="sm" variant="bordered">
                    Novo Produto
                  </Button>
                </div>
                <div className="flex justify-center mb-4">
                  <DonutChart
                    centerLabel="Total em Estoque"
                    centerValue="2.007"
                    data={{
                      labels: ["Em Estoque", "Baixo Estoque", "Sem Estoque"],
                      datasets: [
                        {
                          data: [1450, 234, 323],
                          backgroundColor: ["#06B6D4", "#F59E0B", "#EF4444"],
                          borderWidth: 0,
                        },
                      ],
                    }}
                    size={160}
                  />
                </div>
                <div className="text-center">
                  <Button className="text-blue-600" size="sm" variant="ghost">
                    Ver Todos os Produtos →
                  </Button>
                  <Button
                    className="text-blue-600 ml-4"
                    size="sm"
                    variant="ghost"
                  >
                    Relatório de Entregas →
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
