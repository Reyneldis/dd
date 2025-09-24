// src/components/dashboard/StatsCard.tsx - DISEÑO 2026
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  color = 'from-indigo-500 to-purple-500',
}: StatsCardProps) {
  return (
    <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl overflow-hidden group">
      {/* Fondo decorativo con gradiente */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 -mr-16 -mt-16 opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>

      {/* Elemento decorativo flotante */}
      <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 -ml-8 -mb-8 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {title}
        </CardTitle>
        {icon && (
          <div
            className={`p-3 rounded-2xl bg-gradient-to-r ${color} text-white shadow-lg`}
          >
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="flex items-baseline">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </div>
          {trend && (
            <div
              className={`ml-2 flex items-center text-sm font-medium ${
                trend.isPositive
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {trend.isPositive ? (
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              ) : (
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              )}
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
