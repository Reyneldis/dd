// src/components/dashboard/TopProductsChart.tsx - MEJORADO
'use client';
import {
  BarElement,
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { useTheme } from 'next-themes';
import { Bar } from 'react-chartjs-2';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface TopProductsChartProps {
  data: { productName: string; totalSold: number }[];
}

const LIGHT_COLORS = [
  'rgba(99, 102, 241, 0.8)',
  'rgba(16, 185, 129, 0.8)',
  'rgba(251, 146, 60, 0.8)',
  'rgba(139, 92, 246, 0.8)',
  'rgba(236, 72, 153, 0.8)',
];

const DARK_COLORS = [
  'rgba(129, 140, 248, 0.8)',
  'rgba(52, 211, 153, 0.8)',
  'rgba(251, 191, 36, 0.8)',
  'rgba(167, 139, 250, 0.8)',
  'rgba(244, 114, 182, 0.8)',
];

export function TopProductsChart({ data }: TopProductsChartProps) {
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
                  d="M20 7l-8-4-8 4m16 0l-8 4-8-4M4 7h16M4 7v10a2 2 0 002 2h10a2 2 0 002-2V7"
                />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              No hay datos de productos disponibles
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Agrega productos para ver las ventas
            </p>
          </div>
        </div>
      );
    }

    // Ordenar datos para mejor visualización
    const sortedData = [...data].sort((a, b) => b.totalSold - a.totalSold);

    const chartData: ChartData<'bar', number[], string> = {
      labels: sortedData.map(item =>
        item.productName.length > 15
          ? item.productName.substring(0, 15) + '...'
          : item.productName,
      ),
      datasets: [
        {
          label: 'Unidades Vendidas',
          data: sortedData.map(item => item.totalSold),
          backgroundColor: COLORS.slice(0, sortedData.length),
          borderColor: COLORS.slice(0, sortedData.length).map(color =>
            color.replace('0.8', '1'),
          ),
          borderWidth: 1,
          borderRadius: 6,
          barThickness: 30,
        },
      ],
    };

    const options: ChartOptions<'bar'> = {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y' as const,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: false,
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
          displayColors: false,
          callbacks: {
            label: function (context) {
              const index = context.dataIndex;
              const productName = data[index]?.productName || '';
              const value = context.parsed.x || 0;
              return [`${productName}: ${value} unidades`];
            },
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: {
            color: isDark ? 'rgba(75, 85, 99, 0.2)' : 'rgba(0, 0, 0, 0.05)',
          },
          border: {
            display: false,
          },
          ticks: {
            color: isDark ? 'rgba(156, 163, 175, 0.8)' : 'rgba(0, 0, 0, 0.5)',
            font: {
              size: 11,
            },
            callback: function (value) {
              return Math.floor(Number(value));
            },
          },
        },
        y: {
          grid: {
            display: false,
          },
          border: {
            display: false,
          },
          ticks: {
            color: isDark ? 'rgba(156, 163, 175, 0.8)' : 'rgba(0, 0, 0, 0.5)',
            font: {
              size: 11,
            },
          },
        },
      },
    };

    return (
      <div className="h-80">
        <Bar data={chartData} options={options} />
      </div>
    );
  } catch (error) {
    console.error('Error en TopProductsChart:', error);
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
