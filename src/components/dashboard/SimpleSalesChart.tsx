'use client';

interface SimpleSalesChartProps {
  data: { name: string; sales: number }[];
}

export function SimpleSalesChart({ data }: SimpleSalesChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">No hay datos de ventas disponibles</p>
      </div>
    );
  }

  return (
    <div className="h-64 bg-gray-50 rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-600 mb-4">Ventas por Categoría</h3>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{item.name}</span>
            <span className="text-sm font-medium text-gray-900">
              ${item.sales.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
