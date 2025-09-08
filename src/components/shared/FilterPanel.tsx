// components/shared/FilterPanel.tsx
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useFilterStore } from '@/store/filters';
import { Category } from '@prisma/client';
import { Filter, X } from 'lucide-react';
import { useState } from 'react';

// Definir los tipos válidos para sortBy
type SortByOption =
  | 'price-asc'
  | 'price-desc'
  | 'name-asc'
  | 'name-desc'
  | 'newest';

interface FilterPanelProps {
  categories: Category[] | undefined; // Permitir undefined como valor posible
  isOpen: boolean;
  onClose: () => void;
}

export function FilterPanel({ categories, isOpen, onClose }: FilterPanelProps) {
  const {
    category,
    minPrice,
    maxPrice,
    sortBy,
    inStock,
    onSale,
    setCategory,
    setPriceRange,
    setSortBy,
    toggleInStock,
    toggleOnSale,
    resetFilters,
  } = useFilterStore();

  const [priceRange, setPriceRangeValues] = useState<[number, number]>([
    minPrice || 0,
    maxPrice || 1000,
  ]);

  const handlePriceChange = (values: number[]) => {
    setPriceRangeValues([values[0], values[1]]);
    setPriceRange(values[0], values[1]);
  };

  // Función para manejar el cambio de sortBy con tipo seguro
  const handleSortByChange = (value: string) => {
    // Verificar que el valor sea uno de los permitidos
    if (
      ['price-asc', 'price-desc', 'name-asc', 'name-desc', 'newest'].includes(
        value,
      )
    ) {
      setSortBy(value as SortByOption);
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-lg p-6 ${
        isOpen ? 'block' : 'hidden'
      } md:block`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtros
        </h2>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Limpiar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="md:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {/* Filtro por categoría */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">Categoría</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          <button
            onClick={() => setCategory(null)}
            className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
              category === null
                ? 'bg-blue-50 text-blue-700'
                : 'hover:bg-gray-50'
            }`}
          >
            Todas las categorías
          </button>
          {/* Verificación de seguridad antes de mapear */}
          {categories && categories.length > 0 ? (
            categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.slug)}
                className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                  category === cat.slug
                    ? 'bg-blue-50 text-blue-700'
                    : 'hover:bg-gray-50'
                }`}
              >
                {cat.categoryName}
              </button>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              No hay categorías disponibles
            </div>
          )}
        </div>
      </div>
      {/* Filtro por precio */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">Rango de precios</h3>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={handlePriceChange}
            max={1000}
            step={10}
            className="mb-4"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>
      {/* Filtros adicionales */}
      <div className="mb-6 space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="inStock"
            checked={inStock}
            onCheckedChange={toggleInStock}
          />
          <Label htmlFor="inStock" className="cursor-pointer">
            Solo productos en stock
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="onSale"
            checked={onSale}
            onCheckedChange={toggleOnSale}
          />
          <Label htmlFor="onSale" className="cursor-pointer">
            Solo ofertas
          </Label>
        </div>
      </div>
      {/* Ordenamiento */}
      <div>
        <h3 className="font-medium mb-3">Ordenar por</h3>
        <Select value={sortBy} onValueChange={handleSortByChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Más nuevos</SelectItem>
            <SelectItem value="price-asc">Precio: menor a mayor</SelectItem>
            <SelectItem value="price-desc">Precio: mayor a menor</SelectItem>
            <SelectItem value="name-asc">Nombre: A-Z</SelectItem>
            <SelectItem value="name-desc">Nombre: Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
