// src/components/dashboard/OrdersChart.tsx - MEJORADO
'use client';
import {
  ArcElement,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  Tooltip,
} from 'chart.js';
import { useTheme } from 'next-themes';
import { Pie } from 'react-chartjs-2';

// Registrar componentes de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

interface OrdersChartProps {
  data: { name: string; count: number }[];
}

const LIGHT_COLORS = [
  'rgba(99, 102, 241, 0.8)', // Indigo
  'rgba(16, 185, 129, 0.8)', // Green
  'rgba(251, 146, 60, 0.8)', // Orange
  'rgba(139, 92, 246, 0.8)', // Purple
  'rgba(236, 72, 153, 0.8)', // Pink
];

const DARK_COLORS = [
  'rgba(129, 140, 248, 0.8)', // Indigo
  'rgba(52, 211, 153, 0.8)', // Green
  'rgba(251, 191, 36, 0.8)', // Orange
  'rgba(167, 139, 250, 0.8)', // Purple
  'rgba(244, 114, 182, 0.8)', // Pink
];

export function OrdersChart({ data }: OrdersChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const COLORS = isDark ? DARK_COLORS : LIGHT_COLORS;
  try {
    // Verificar si hay datos
    if (!data || data.length === 0) {
      return (
        <div className="h-80 flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-2xl p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              No hay datos de pedidos disponibles
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Agrega pedidos para ver la distribución
            </p>
          </div>
        </div>
      );
    }

    // Calcular el total para los porcentajes
    const total = data.reduce((sum, item) => sum + item.count, 0);

    const chartData: ChartData<'pie', number[], string> = {
      labels: data.map(item => item.name),
      datasets: [
        {
          data: data.map(item => item.count),
          backgroundColor: COLORS.slice(0, data.length),
          borderColor: isDark ? 'rgb(31, 41, 55)' : '#fff',
          borderWidth: 2,
          hoverOffset: 8,
        },
      ],
    };

    const options: ChartOptions<'pie'> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right' as const,
          labels: {
            padding: 20,
            usePointStyle: true,
            font: {
              size: 12,
            },
            color: isDark ? 'rgba(156, 163, 175, 0.8)' : 'rgba(0, 0, 0, 0.7)',
            generateLabels: function (chart) {
              const data = chart.data;
              if (data.labels && data.datasets.length) {
                const { labels: pointLabels } = data;
                return pointLabels.map((label, i) => {
                  const value = data.datasets[0].data[i] as number;
                  const percentage = Math.round((value / total) * 100);
                  return {
                    text: `${label} (${percentage}%)`,
                    fillStyle: COLORS[i],
                    strokeStyle: COLORS[i],
                    lineWidth: 2,
                    pointStyle: 'circle',
                    hidden: false,
                    index: i,
                  };
                });
              }
              return [];
            },
          },
        },
        tooltip: {
          backgroundColor: isDark
            ? 'rgba(31, 41, 55, 0.95)'
            : 'rgba(0, 0, 0, 0.8)',
          titleColor: isDark ? '#f9fafb' : '#fff',
          bodyColor: isDark ? '#f9fafb' : '#fff',
          borderColor: isDark ? 'rgba(75, 85, 99, 0.3)' : 'rgba(0, 0, 0, 0.1)',
          borderWidth: 1,
          padding: 12,
          displayColors: true,
          callbacks: {
            label: function (context) {
              const label = context.label || '';
              const value = context.parsed || 0;
              const percentage = Math.round((value / total) * 100);
              return `${label}: ${value} pedidos (${percentage}%)`;
            },
          },
        },
      },
    };

    return (
      <div className="h-80">
        <Pie data={chartData} options={options} />
      </div>
    );
  } catch (error) {
    console.error('Error en OrdersChart:', error);
    return (
      <div className="h-80 flex items-center justify-center bg-white dark:bg-gray-800 rounded-2xl p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-red-600 dark:text-red-400">
            Error al cargar la gráfica
          </p>
        </div>
      </div>
    );
  }
}
