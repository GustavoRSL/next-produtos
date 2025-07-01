"use client";

import { Card, CardBody } from "@heroui/react";
import {
  CubeIcon,
  TruckIcon,
  ArchiveBoxIcon,
  ClipboardDocumentListIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

import { DashboardLayout } from "@/components/layout";
import { DonutChart, BarChart } from "@/components/charts";

export default function DashboardPage() {
  // Estado para o tamanho dos gráficos
  const [chartSize, setChartSize] = useState({
    donutSize: 120,
    donutSizeLarge: 160,
    isMobile: false,
  });

  // Verificar se estamos no navegador
  const [isBrowser, setIsBrowser] = useState(false);

  // Verificar se estamos no navegador
  useEffect(() => {
    setIsBrowser(true);
  }, []);

  // Detectar tamanho da tela quando o componente montar (apenas no navegador)
  useEffect(() => {
    if (!isBrowser) return;
    
    const handleResize = () => {
      const isMobileView = window.innerWidth < 640;
      
      setChartSize({
        donutSize: isMobileView ? 100 : 120,
        donutSizeLarge: isMobileView ? 140 : 160,
        isMobile: isMobileView,
      });
    };
    
    // Inicializar
    handleResize();
    
    // Adicionar listener para redimensionamento
    window.addEventListener("resize", handleResize);
    
    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, [isBrowser]);
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
    <DashboardLayout title="Dashboard">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6 mb-8">
        <Card className="bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800">
          <CardBody className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-orange-600 dark:text-orange-300">
                  Total Produtos
                </p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-orange-900 dark:text-orange-100">
                  2.543
                </p>
              </div>
              <CubeIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-orange-600" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800">
          <CardBody className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-300">
                  Em Estoque
                </p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-blue-900 dark:text-blue-100">
                  1.890
                </p>
              </div>
              <ArchiveBoxIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-600" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900 dark:to-green-800">
          <CardBody className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-green-600 dark:text-green-300">
                  Entregas Hoje
                </p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-900 dark:text-green-100">
                  127
                </p>
              </div>
              <TruckIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-green-600" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800">
          <CardBody className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-purple-600 dark:text-purple-300">
                  Pedidos
                </p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-purple-900 dark:text-purple-100">
                  89
                </p>
              </div>
              <ClipboardDocumentListIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-purple-600" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-r from-indigo-100 to-indigo-200 dark:from-indigo-900 dark:to-indigo-800">
          <CardBody className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-indigo-600 dark:text-indigo-300">
                  Vendas Mês
                </p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                  R$ 45.2k
                </p>
              </div>
              <ShoppingBagIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-indigo-600" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900 dark:to-red-800">
          <CardBody className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-red-600 dark:text-red-300">
                  Baixo Estoque
                </p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-red-900 dark:text-red-100">
                  34
                </p>
              </div>
              <ArchiveBoxIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-red-600" />
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
              <div className="text-center flex flex-col items-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Total de Produtos
                </p>
                <DonutChart
                  centerValue="576"
                  data={produtosPorCategoriaData}
                  size={120}
                />
              </div>
              <div className="text-center flex flex-col items-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Status do Estoque
                </p>
                <DonutChart
                  centerValue="2.007"
                  data={estoqueStatusData}
                  size={120}
                />
              </div>
            </div>
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Categoria</th>
                    <th className="py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Produtos</th>
                    <th className="py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Em Estoque</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="py-2">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-cyan-500 rounded-full mr-2" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Eletrônicos</span>
                      </div>
                    </td>
                    <td className="py-2 text-right text-sm font-medium">245</td>
                    <td className="py-2 text-right text-sm font-medium">1.450</td>
                  </tr>
                  <tr>
                    <td className="py-2">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Roupas</span>
                      </div>
                    </td>
                    <td className="py-2 text-right text-sm font-medium">132</td>
                    <td className="py-2 text-right text-sm font-medium">234</td>
                  </tr>
                  <tr>
                    <td className="py-2">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-amber-500 rounded-full mr-2" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Casa</span>
                      </div>
                    </td>
                    <td className="py-2 text-right text-sm font-medium">89</td>
                    <td className="py-2 text-right text-sm font-medium">89</td>
                  </tr>
                  <tr>
                    <td className="py-2">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Esporte</span>
                      </div>
                    </td>
                    <td className="py-2 text-right text-sm font-medium">67</td>
                    <td className="py-2 text-right text-sm font-medium">156</td>
                  </tr>
                  <tr>
                    <td className="py-2">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-purple-500 rounded-full mr-2" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Livros</span>
                      </div>
                    </td>
                    <td className="py-2 text-right text-sm font-medium">43</td>
                    <td className="py-2 text-right text-sm font-medium">78</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>

        {/* Entregas Mensais */}
        <Card>
          <CardBody className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Entregas Mensais
            </h3>
            <BarChart data={entregasMensaisData} height={180} />
            <div className="flex flex-wrap justify-center mt-4 gap-3 sm:gap-0 sm:space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-cyan-500 rounded-full mr-2" />
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Entregues
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2" />
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Pendentes
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-amber-500 rounded-full mr-2" />
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Atrasadas
                </span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Bottom Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Vendas Trimestrais */}
        <Card>
          <CardBody className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Vendas e Devoluções por Trimestre
            </h3>
            <BarChart data={vendasTrimestralData} height={chartSize.isMobile ? 200 : 250} />
            <div className="flex flex-wrap justify-center mt-4 space-x-0 sm:space-x-4 gap-y-2 gap-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-cyan-500 rounded-full mr-2" />
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Vendidos
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Devoluções
                </span>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Relatório de Estoque */}
        <Card>
          <CardBody className="p-4 sm:p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                Status do Estoque
              </h3>
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
                size={chartSize.donutSizeLarge}
              />
            </div>
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Quantidade
                    </th>
                    <th className="py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Percentual
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="py-2">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-cyan-500 rounded-full mr-2" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Em Estoque
                        </span>
                      </div>
                    </td>
                    <td className="py-2 text-right text-sm font-medium">1.450</td>
                    <td className="py-2 text-right text-sm font-medium">72,2%</td>
                  </tr>
                  <tr>
                    <td className="py-2">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-amber-500 rounded-full mr-2" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Baixo Estoque
                        </span>
                      </div>
                    </td>
                    <td className="py-2 text-right text-sm font-medium">234</td>
                    <td className="py-2 text-right text-sm font-medium">11,7%</td>
                  </tr>
                  <tr>
                    <td className="py-2">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Sem Estoque
                        </span>
                      </div>
                    </td>
                    <td className="py-2 text-right text-sm font-medium">323</td>
                    <td className="py-2 text-right text-sm font-medium">16,1%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
