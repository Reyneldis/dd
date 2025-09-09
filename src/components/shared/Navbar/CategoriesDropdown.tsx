// src/components/shared/CategoriesDropdown.tsx
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
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Category {
  id: string;
  categoryName?: string;
  name?: string;
  title?: string;
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
  electrodomésticos: Microwave,
  electro: Microwave,
  aseo: Bath,
  aseos: Bath,
  limpieza: Bath,
  higiene: Bath,
};

export default function CategoriesDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories?limit=5', {
          cache: 'no-store',
        });
        if (response.ok) {
          const data = await response.json();
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

  const getCategoryName = (category: Category) => {
    return (
      category.categoryName ||
      category.name ||
      category.title ||
      `Categoría ${category.id}`
    );
  };

  const getCategoryIcon = (category: Category) => {
    const categoryName = getCategoryName(category);
    if (!categoryName) return Utensils;

    const normalizedName = categoryName
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '');

    if (categoryIcons[normalizedName]) {
      return categoryIcons[normalizedName];
    }

    for (const key in categoryIcons) {
      if (normalizedName.includes(key) || key.includes(normalizedName)) {
        return categoryIcons[key];
      }
    }

    return Utensils;
  };

  const handleCategoryClick = (categorySlug: string) => {
    // Construir la URL con el parámetro de categoría
    const params = new URLSearchParams(searchParams.toString());
    params.set('category', categorySlug);

    // Redirigir a la página de productos con el filtro aplicado
    router.push(`/products?${params.toString()}`);

    // Cerrar el dropdown
    setIsOpen(false);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className="flex items-center gap-1 px-3 py-2 text-sm font-normal text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors duration-150 rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Utensils className="h-4 w-4" />
        <span>Categorías</span>
        <ChevronDown
          className={`h-3 w-3 transition-transform duration-150 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-neutral-800 rounded-md shadow-md border border-neutral-200 dark:border-neutral-700 overflow-hidden z-50"
          >
            <div className="p-3">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-neutral-100 dark:border-neutral-700">
                <Utensils className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  Categorías
                </h3>
              </div>
              {loading ? (
                <div className="space-y-1">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2 p-2">
                      <div className="h-8 w-8 bg-neutral-200 dark:bg-neutral-700 rounded-md animate-pulse" />
                      <div className="flex-1">
                        <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded-md animate-pulse mb-1" />
                        <div className="h-2 w-10 bg-neutral-200 dark:bg-neutral-700 rounded-md animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : categories.length > 0 ? (
                <div className="space-y-1">
                  {categories.map(category => {
                    const categoryName = getCategoryName(category);
                    const IconComponent = getCategoryIcon(category);
                    return (
                      <li key={category.id} className="list-none">
                        <button
                          onClick={() => handleCategoryClick(category.slug)}
                          className="flex items-center justify-between p-2 text-sm rounded-md transition-colors duration-150 group w-full text-left hover:bg-neutral-100 dark:hover:bg-neutral-700"
                        >
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-3.5 w-3.5 text-neutral-600 dark:text-neutral-400" />
                            <span className="text-neutral-800 dark:text-neutral-200">
                              {categoryName}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-neutral-500 dark:text-neutral-400 px-1.5 py-0.5 rounded">
                              {category.productCount || 0}
                            </span>
                            <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </div>
              ) : (
                <div className="py-4 text-center text-sm text-neutral-500 dark:text-neutral-400">
                  No se encontraron categorías
                </div>
              )}
              <div className="mt-3 pt-2 border-t border-neutral-100 dark:border-neutral-700">
                <Link
                  href="/products"
                  className="flex items-center justify-center w-full px-3 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors duration-150"
                >
                  <ShoppingBag className="h-3.5 w-3.5 mr-1.5" />
                  Ver todos los productos
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
