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
import { DollarSign, Filter, Sparkles, X } from 'lucide-react';
import { useState } from 'react';

// Definir los tipos válidos para sortBy
type SortByOption =
  | 'price-asc'
  | 'price-desc'
  | 'name-asc'
  | 'name-desc'
  | 'newest';

interface FilterPanelProps {
  categories: Category[] | undefined;
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
      className={`
        relative overflow-hidden
        bg-gradient-to-br from-slate-800 via-slate-800/95 to-slate-900
        dark:from-slate-800 dark:via-slate-800/95 dark:to-slate-900
        rounded-2xl shadow-2xl border border-slate-700/50 
        p-6 backdrop-blur-sm
        ${isOpen ? 'block' : 'hidden'} md:block
      `}
    >
      {/* Efecto de brillo decorativo */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 opacity-70"></div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2 text-white">
          <div className="p-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg">
            <Filter className="h-5 w-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-purple-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent">
            Filtros
          </span>
        </h2>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg"
          >
            Limpiar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg md:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filtro por categoría */}
      <div className="mb-8">
        <h3 className="font-medium mb-4 flex items-center gap-2 text-slate-200">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 shadow-sm shadow-purple-500/30"></div>
          Categoría
        </h3>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
          <button
            onClick={() => setCategory(null)}
            className={`
              block w-full text-left px-4 py-3 rounded-xl transition-all duration-300
              ${
                category === null
                  ? 'bg-gradient-to-r from-purple-900/50 to-blue-900/50 text-white border border-purple-500/30 shadow-lg shadow-purple-500/10'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }
            `}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  category === null
                    ? 'bg-gradient-to-r from-purple-400 to-blue-400 shadow-sm'
                    : 'bg-slate-600'
                }`}
              ></div>
              <span>Todas las categorías</span>
              {category === null && (
                <Sparkles className="h-4 w-4 text-yellow-300 ml-auto" />
              )}
            </div>
          </button>

          {/* Verificación de seguridad antes de mapear */}
          {categories && categories.length > 0 ? (
            categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.slug)}
                className={`
                  block w-full text-left px-4 py-3 rounded-xl transition-all duration-300
                  ${
                    category === cat.slug
                      ? 'bg-gradient-to-r from-purple-900/50 to-blue-900/50 text-white border border-purple-500/30 shadow-lg shadow-purple-500/10'
                      : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      category === cat.slug
                        ? 'bg-gradient-to-r from-purple-400 to-blue-400 shadow-sm'
                        : 'bg-slate-600'
                    }`}
                  ></div>
                  <span>{cat.categoryName}</span>
                  {category === cat.slug && (
                    <Sparkles className="h-4 w-4 text-yellow-300 ml-auto" />
                  )}
                </div>
              </button>
            ))
          ) : (
            <div className="text-center py-4 text-slate-400">
              No hay categorías disponibles
            </div>
          )}
        </div>
      </div>

      {/* Filtro por precio */}
      <div className="mb-8">
        <h3 className="font-medium mb-4 flex items-center gap-2 text-slate-200">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 shadow-sm shadow-purple-500/30"></div>
          Rango de precios
        </h3>
        <div className="px-2">
          <div className="mb-6 bg-gradient-to-br from-slate-700/30 to-slate-800/50 rounded-xl p-4 border border-slate-700/50 shadow-inner">
            <div className="flex items-center gap-2 mb-3 text-slate-300">
              <DollarSign className="h-4 w-4 text-green-400" />
              <span className="text-sm">Selecciona tu rango de precio</span>
            </div>
            <Slider
              value={priceRange}
              onValueChange={handlePriceChange}
              max={1000}
              step={10}
              className="mb-4"
            />
            <div className="flex justify-between text-sm">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-700/50 text-slate-300 border border-slate-600/50">
                ${priceRange[0]}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-purple-600/30 to-blue-600/30 text-white border border-purple-500/30 shadow-sm">
                ${priceRange[1]}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros adicionales */}
      <div className="mb-8 space-y-4">
        <h3 className="font-medium mb-4 flex items-center gap-2 text-slate-200">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 shadow-sm shadow-purple-500/30"></div>
          Filtros adicionales
        </h3>
        <div className="space-y-4">
          <div className="flex items-center p-3 rounded-xl bg-gradient-to-br from-slate-700/30 to-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 transition-all duration-300">
            <Checkbox
              id="inStock"
              checked={inStock}
              onCheckedChange={toggleInStock}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-600 data-[state=checked]:to-blue-600 data-[state=checked]:border-0 data-[state=checked]:shadow-lg data-[state=checked]:shadow-purple-500/20"
            />
            <Label
              htmlFor="inStock"
              className="cursor-pointer text-slate-300 ml-3"
            >
              Solo productos en stock
            </Label>
          </div>
          <div className="flex items-center p-3 rounded-xl bg-gradient-to-br from-slate-700/30 to-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 transition-all duration-300">
            <Checkbox
              id="onSale"
              checked={onSale}
              onCheckedChange={toggleOnSale}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-600 data-[state=checked]:to-blue-600 data-[state=checked]:border-0 data-[state=checked]:shadow-lg data-[state=checked]:shadow-purple-500/20"
            />
            <Label
              htmlFor="onSale"
              className="cursor-pointer text-slate-300 ml-3"
            >
              Solo ofertas
            </Label>
          </div>
        </div>
      </div>

      {/* Ordenamiento */}
      <div>
        <h3 className="font-medium mb-4 flex items-center gap-2 text-slate-200">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 shadow-sm shadow-purple-500/30"></div>
          Ordenar por
        </h3>
        <Select value={sortBy} onValueChange={handleSortByChange}>
          <SelectTrigger className="bg-gradient-to-br from-slate-700/30 to-slate-800/50 border-slate-700/50 text-slate-300 focus:ring-purple-500 focus:border-purple-500 rounded-xl">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/50 text-slate-300 rounded-xl shadow-xl">
            <SelectItem
              value="newest"
              className="focus:bg-gradient-to-r focus:from-purple-900/30 focus:to-blue-900/30 focus:text-white rounded-lg"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-400" />
                Más nuevos
              </div>
            </SelectItem>
            <SelectItem
              value="price-asc"
              className="focus:bg-gradient-to-r focus:from-purple-900/30 focus:to-blue-900/30 focus:text-white rounded-lg"
            >
              <div className="flex items-center gap-2">
                <span className="text-green-400">↑</span>
                Precio: menor a mayor
              </div>
            </SelectItem>
            <SelectItem
              value="price-desc"
              className="focus:bg-gradient-to-r focus:from-purple-900/30 focus:to-blue-900/30 focus:text-white rounded-lg"
            >
              <div className="flex items-center gap-2">
                <span className="text-red-400">↓</span>
                Precio: mayor a menor
              </div>
            </SelectItem>
            <SelectItem
              value="name-asc"
              className="focus:bg-gradient-to-r focus:from-purple-900/30 focus:to-blue-900/30 focus:text-white rounded-lg"
            >
              <div className="flex items-center gap-2">
                <span>A-Z</span>
                Nombre: A-Z
              </div>
            </SelectItem>
            <SelectItem
              value="name-desc"
              className="focus:bg-gradient-to-r focus:from-purple-900/30 focus:to-blue-900/30 focus:text-white rounded-lg"
            >
              <div className="flex items-center gap-2">
                <span>Z-A</span>
                Nombre: Z-A
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Decoración inferior */}
      <div className="mt-8 pt-4 border-t border-slate-700/30">
        <div className="flex justify-center">
          <div className="w-16 h-1 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg shadow-purple-500/30"></div>
        </div>
      </div>

      {/* Efecto de brillo sutil en las esquinas */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-tr-full"></div>
    </div>
  );
}
