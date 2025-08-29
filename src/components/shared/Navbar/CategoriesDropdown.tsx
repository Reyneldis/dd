'use client';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bath,
  ChevronDown,
  ChevronRight,
  Microwave,
  ShoppingBag,
  Utensils,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Category {
  id: string;
  categoryName?: string; // Opcional por si la API usa otro nombre
  name?: string; // Alternativa posible
  title?: string; // Otra alternativa posible
  slug: string;
  productCount?: number;
}

// Mapeo de iconos para las categorías específicas
const categoryIcons: Record<string, React.ElementType> = {
  alimento: Utensils,
  alimentos: Utensils,
  comida: Utensils,
  electrodomestico: Microwave,
  electrodomesticos: Microwave,
  electrodoméstico: Microwave,
  electro: Microwave,
  aseo: Bath,
  aseos: Bath,
  limpieza: Bath,
  higiene: Bath,
};

// Mapeo de colores para cada categoría
const categoryColors: Record<
  string,
  { bg: string; text: string; hover: string }
> = {
  alimento: {
    bg: 'bg-orange-50 dark:bg-orange-950/30',
    text: 'text-orange-700 dark:text-orange-300',
    hover: 'hover:bg-orange-100 dark:hover:bg-orange-900/50',
  },
  alimentos: {
    bg: 'bg-orange-50 dark:bg-orange-950/30',
    text: 'text-orange-700 dark:text-orange-300',
    hover: 'hover:bg-orange-100 dark:hover:bg-orange-900/50',
  },
  comida: {
    bg: 'bg-orange-50 dark:bg-orange-950/30',
    text: 'text-orange-700 dark:text-orange-300',
    hover: 'hover:bg-orange-100 dark:hover:bg-orange-900/50',
  },
  electrodomestico: {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    text: 'text-blue-700 dark:text-blue-300',
    hover: 'hover:bg-blue-100 dark:hover:bg-blue-900/50',
  },
  electrodomesticos: {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    text: 'text-blue-700 dark:text-blue-300',
    hover: 'hover:bg-blue-100 dark:hover:bg-blue-900/50',
  },
  electrodoméstico: {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    text: 'text-blue-700 dark:text-blue-300',
    hover: 'hover:bg-blue-100 dark:hover:bg-blue-900/50',
  },
  electrodomésticos: {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    text: 'text-blue-700 dark:text-blue-300',
    hover: 'hover:bg-blue-100 dark:hover:bg-blue-900/50',
  },
  electro: {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    text: 'text-blue-700 dark:text-blue-300',
    hover: 'hover:bg-blue-100 dark:hover:bg-blue-900/50',
  },
  aseo: {
    bg: 'bg-green-50 dark:bg-green-950/30',
    text: 'text-green-700 dark:text-green-300',
    hover: 'hover:bg-green-100 dark:hover:bg-green-900/50',
  },
  aseos: {
    bg: 'bg-green-50 dark:bg-green-950/30',
    text: 'text-green-700 dark:text-green-300',
    hover: 'hover:bg-green-100 dark:hover:bg-green-900/50',
  },
  limpieza: {
    bg: 'bg-green-50 dark:bg-green-950/30',
    text: 'text-green-700 dark:text-green-300',
    hover: 'hover:bg-green-100 dark:hover:bg-green-900/50',
  },
  higiene: {
    bg: 'bg-green-50 dark:bg-green-950/30',
    text: 'text-green-700 dark:text-green-300',
    hover: 'hover:bg-green-100 dark:hover:bg-green-900/50',
  },
};

export default function CategoriesDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories?limit=5', {
          cache: 'no-store',
        });
        if (response.ok) {
          const data = await response.json();
          console.log('Datos de categorías recibidos:', data); // Para depuración
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Función para obtener el nombre de la categoría de forma segura
  const getCategoryName = (category: Category) => {
    // Intentar diferentes propiedades donde podría estar el nombre
    return (
      category.categoryName ||
      category.name ||
      category.title ||
      `Categoría ${category.id}`
    );
  };

  // Función mejorada para obtener el icono apropiado para una categoría
  const getCategoryIcon = (category: Category) => {
    const categoryName = getCategoryName(category);
    if (!categoryName) return Utensils;

    // Normalizar el nombre: minúsculas, sin tildes y sin espacios extras
    const normalizedName = categoryName
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '');

    console.log(
      'Buscando icono para:',
      categoryName,
      '-> Normalizado:',
      normalizedName,
    );

    // Buscar coincidencia exacta primero
    if (categoryIcons[normalizedName]) {
      return categoryIcons[normalizedName];
    }

    // Buscar coincidencia parcial si no hay exacta
    for (const key in categoryIcons) {
      if (normalizedName.includes(key) || key.includes(normalizedName)) {
        return categoryIcons[key];
      }
    }

    // Si no encuentra ninguna coincidencia, devolver el icono por defecto
    return Utensils;
  };

  // Función mejorada para obtener los colores de una categoría
  const getCategoryColors = (category: Category) => {
    const categoryName = getCategoryName(category);

    if (!categoryName) {
      return {
        bg: 'bg-gray-50 dark:bg-gray-900',
        text: 'text-gray-700 dark:text-gray-300',
        hover: 'hover:bg-gray-100 dark:hover:bg-gray-800',
      };
    }

    // Normalizar el nombre: minúsculas, sin tildes y sin espacios extras
    const normalizedName = categoryName
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '');

    console.log(
      'Buscando color para:',
      categoryName,
      '-> Normalizado:',
      normalizedName,
    );

    // Buscar coincidencia exacta primero
    if (categoryColors[normalizedName]) {
      return categoryColors[normalizedName];
    }

    // Buscar coincidencia parcial si no hay exacta
    for (const key in categoryColors) {
      if (normalizedName.includes(key) || key.includes(normalizedName)) {
        return categoryColors[key];
      }
    }

    // Si no encuentra ninguna coincidencia, devolver el color por defecto
    return {
      bg: 'bg-gray-50 dark:bg-gray-900',
      text: 'text-gray-700 dark:text-gray-300',
      hover: 'hover:bg-gray-100 dark:hover:bg-gray-800',
    };
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-primary transition-colors duration-200 rounded-lg bg-gradient-to-r from-transparent to-transparent hover:from-primary/5 dark:hover:from-primary/10 group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-center w-5 h-5 bg-gradient-to-br from-orange-400 to-orange-600 rounded-md p-0.5">
          <Utensils className="h-3.5 w-3.5 text-white" />
        </div>
        <span>Categorías</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 group-hover:text-primary ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-neutral-900 rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden z-50"
          >
            <div className="p-4">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-neutral-200 dark:border-neutral-700">
                <div className="p-2 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg">
                  <Utensils className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                    Nuestras Categorías
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Explora nuestros productos por categoría
                  </p>
                </div>
              </div>
              {loading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-2">
                      <div className="h-10 w-10 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse" />
                      <div className="flex-1">
                        <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded-md animate-pulse mb-2" />
                        <div className="h-3 w-12 bg-neutral-200 dark:bg-neutral-800 rounded-md animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : categories.length > 0 ? (
                <div className="space-y-2">
                  {categories.map(category => {
                    const categoryName = getCategoryName(category);
                    const IconComponent = getCategoryIcon(category);
                    const colors = getCategoryColors(category);

                    return (
                      <li key={category.id} className="list-none">
                        <Link
                          href={`/products?category=${category.slug}`}
                          className={`flex items-center justify-between p-3 text-sm rounded-lg transition-all duration-200 group ${colors.bg} ${colors.text} ${colors.hover}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white dark:bg-neutral-800 rounded-md shadow-sm group-hover:shadow-md transition-shadow">
                              <IconComponent className="h-4 w-4" />
                            </div>
                            <span className="font-medium">{categoryName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-white dark:bg-neutral-800 px-2 py-1 rounded-full min-w-[2rem] text-center shadow-sm">
                              {category.productCount || 0}
                            </span>
                            <ChevronRight className="h-4 w-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </div>
              ) : (
                <div className="py-6 text-center text-neutral-500 dark:text-neutral-400">
                  No se encontraron categorías
                </div>
              )}
              <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <Link
                  href="/products"
                  className="flex items-center justify-center w-full px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Ver Todos los Productos
                </Link>
              </div>
            </div>
            {/* Efecto de brillo en el borde inferior */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
