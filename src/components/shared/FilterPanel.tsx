'use client';
import { Button } from '@/components/ui/button';
import { useFilterStore } from '@/store/filters';
import {
  ArrowUpDown,
  Check,
  ChevronDown,
  DollarSign,
  Package,
  Search,
  Tag,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

// Interfaz para el tipo de categoría
interface Category {
  id: string;
  categoryName: string;
  slug: string;
}

// Interfaz para la respuesta del API de categorías
interface CategoriesResponse {
  categories: Category[];
}

export default function FilterPanel() {
  const {
    searchQuery,
    category,
    minPrice,
    maxPrice,
    sortBy,
    inStock,
    onSale,
    setSearchQuery,
    setCategory,
    setMinPrice,
    setMaxPrice,
    setSortBy,
    setInStock,
    setOnSale,
    resetFilters,
  } = useFilterStore();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('🔍 Iniciando búsqueda de categorías...');
        const response = await fetch('/api/categories');
        console.log('📡 Status de respuesta:', response.status);

        if (response.ok) {
          const data: CategoriesResponse = await response.json();
          console.log('📦 Respuesta completa del API:', data);

          // Extraer categorías del formato correcto
          let categoriesData: Category[] = [];
          if (
            data &&
            typeof data === 'object' &&
            'categories' in data &&
            Array.isArray(data.categories)
          ) {
            categoriesData = data.categories.map((cat: Category) => ({
              id: cat.id,
              categoryName: cat.categoryName, // Asegurar el nombre correcto de la propiedad
              slug: cat.slug,
            }));
            console.log(
              '✅ Categorías extraídas correctamente:',
              categoriesData,
            );
          } else {
            console.log('⚠️ Formato de respuesta inesperado:', data);
            // Si el formato es incorrecto, usar categorías de ejemplo
            categoriesData = [
              { id: '1', categoryName: 'Aseo', slug: 'aseo' },
              { id: '2', categoryName: 'Comida', slug: 'comida' },
              {
                id: '3',
                categoryName: 'Electrodomésticos',
                slug: 'electrodomesticos',
              },
            ];
          }
          setCategories(categoriesData);
        } else {
          console.error('❌ Respuesta no OK, status:', response.status);
          // Si la respuesta falla, usar categorías de ejemplo
          setCategories([
            { id: '1', categoryName: 'Aseo', slug: 'aseo' },
            { id: '2', categoryName: 'Comida', slug: 'comida' },
            {
              id: '3',
              categoryName: 'Electrodomésticos',
              slug: 'electrodomesticos',
            },
          ]);
        }
      } catch (error) {
        console.error('❌ Error fetching categories:', error);
        // Si hay error, usar categorías de ejemplo
        setCategories([
          { id: '1', categoryName: 'Aseo', slug: 'aseo' },
          { id: '2', categoryName: 'Comida', slug: 'comida' },
          {
            id: '3',
            categoryName: 'Electrodomésticos',
            slug: 'electrodomesticos',
          },
        ]);
      } finally {
        console.log('🏁 Fetch de categorías finalizado');
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const sortOptions = [
    { value: 'relevance', label: 'Relevancia' },
    { value: 'price-asc', label: 'Precio: Menor a Mayor' },
    { value: 'price-desc', label: 'Precio: Mayor a Menor' },
    { value: 'newest', label: 'Más Nuevos' },
  ];

  const hasActiveFilters =
    searchQuery || category || minPrice || maxPrice || inStock || onSale;

  const handleResetFilters = () => {
    console.log('🔄 Reseteando filtros...');
    resetFilters();
    console.log('✅ Filtros reseteados');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Package className="h-5 w-5 text-blue-500" />
          Filtros
        </h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetFilters}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Limpiar todos los filtros"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* Búsqueda */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Buscar productos
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="¿Qué estás buscando?"
              value={searchQuery}
              onChange={e => {
                console.log('🔍 Búsqueda actualizada:', e.target.value);
                setSearchQuery(e.target.value);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Categorías */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Categorías
          </label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={category}
              onChange={e => {
                console.log('📂 Categoría seleccionada:', e.target.value);
                setCategory(e.target.value);
              }}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
            >
              <option value="">Todas las categorías</option>
              {loading ? (
                <option value="" disabled>
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent border-r-transparent border-b-transparent border-l-transparent animate-spin mr-2" />
                    Cargando...
                  </div>
                </option>
              ) : categories.length > 0 ? (
                categories.map((cat: Category, index: number) => (
                  <option
                    key={`${cat.id}-${index}`}
                    value={cat.slug}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    {cat.categoryName}
                  </option>
                ))
              ) : (
                <>
                  <option value="aseos">Aseo</option>
                  <option value="comida">Comida</option>
                  <option value="electrodomesticos">Electrodomésticos</option>
                </>
              )}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Precio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Rango de precio
          </label>
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="number"
                placeholder="Mínimo"
                value={minPrice || ''}
                onChange={e => {
                  console.log('💰 Precio mínimo actualizado:', e.target.value);
                  setMinPrice(e.target.value ? Number(e.target.value) : null);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <span className="text-gray-500 dark:text-gray-400 font-medium">
              -
            </span>
            <div className="flex-1 relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="number"
                placeholder="Máximo"
                value={maxPrice || ''}
                onChange={e => {
                  console.log('💰 Precio máximo actualizado:', e.target.value);
                  setMaxPrice(e.target.value ? Number(e.target.value) : null);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Ordenar por */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Ordenar por
          </label>
          <div className="relative">
            <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={sortBy}
              onChange={e => {
                console.log('🔄 Ordenamiento actualizado:', e.target.value);
                setSortBy(e.target.value);
              }}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all cursor-pointer"
            >
              {sortOptions.map(option => (
                <option
                  key={option.value}
                  value={option.value}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Filtros adicionales */}
        <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 cursor-pointer group">
            <input
              type="checkbox"
              id="inStock"
              checked={inStock}
              onChange={e => {
                console.log(
                  '✅ Filtro "En stock" cambiado a:',
                  e.target.checked,
                );
                setInStock(e.target.checked);
              }}
              className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-all duration-200"
            />
            <label
              htmlFor="inStock"
              className="ml-3 text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 cursor-pointer"
            >
              En stock
            </label>
            {inStock && (
              <div className="ml-auto">
                <Check className="h-4 w-4 text-green-500 animate-pulse" />
              </div>
            )}
          </div>
          <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 cursor-pointer group">
            <input
              type="checkbox"
              id="onSale"
              checked={onSale}
              onChange={e => {
                console.log(
                  '🏷️ Filtro "En oferta" cambiado a:',
                  e.target.checked,
                );
                setOnSale(e.target.checked);
              }}
              className="h-4 w-4 text-purple-500 border-gray-300 rounded focus:ring-purple-500 focus:ring-2 transition-all duration-200"
            />
            <label
              htmlFor="onSale"
              className="ml-3 text-sm text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200 cursor-pointer"
            >
              En oferta
            </label>
            {onSale && (
              <div className="ml-auto">
                <Check className="h-4 w-4 text-green-500 animate-pulse" />
              </div>
            )}
          </div>
        </div>

        {/* Botón para resetear filtros */}
        <Button
          variant="outline"
          onClick={handleResetFilters}
          className="w-full mt-6 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 font-medium"
        >
          Limpiar filtros
        </Button>
      </div>
    </div>
  );
}
