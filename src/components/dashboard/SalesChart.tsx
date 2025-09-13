// src/components/dashboard/SalesChart.tsx - MEJORADO
'use client';
import {
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

interface SalesChartProps {
  data: { name: string; sales: number }[];
}

export function SalesChart({ data }: SalesChartProps) {
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              No hay datos de ventas disponibles
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Agrega ventas para ver la gráfica
            </p>
          </div>
        </div>
      );
    }

    const chartData: ChartData<'line', number[], string> = {
      labels: data.map(item => item.name),
      datasets: [
        {
          label: 'Ventas ($)',
          data: data.map(item => item.sales),
          borderColor: 'rgb(99, 102, 241)',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: 'rgb(99, 102, 241)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
        },
      ],
    };

    const options: ChartOptions<'line'> = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index',
      },
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: false,
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          padding: 12,
          displayColors: false,
          callbacks: {
            label: function (context) {
              return `Ventas: $${context.parsed.y.toLocaleString()}`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
          },
          border: {
            display: false,
          },
          ticks: {
            callback: function (value) {
              return '$' + value.toLocaleString();
            },
            color: 'rgba(0, 0, 0, 0.5)',
            font: {
              size: 11,
            },
          },
        },
        x: {
          grid: {
            display: false,
          },
          border: {
            display: false,
          },
          ticks: {
            color: 'rgba(0, 0, 0, 0.5)',
            font: {
              size: 11,
            },
          },
        },
      },
    };

    return (
      <div className="h-80">
        <Line data={chartData} options={options} />
      </div>
    );
  } catch (error) {
    console.error('Error en SalesChart:', error);
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
