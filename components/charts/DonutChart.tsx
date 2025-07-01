"use client";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DonutChartProps {
  data: {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
      borderWidth?: number;
    }[];
  };
  centerValue?: string;
  centerLabel?: string;
  size?: number;
}

export const DonutChart = ({
  data,
  centerValue,
  centerLabel,
  size = 200,
}: DonutChartProps) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    cutout: "70%",
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <Doughnut data={data} options={options} />
      {centerValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {centerValue}
          </span>
          {centerLabel && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {centerLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
