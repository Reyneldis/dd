// src/app/(routes)/categories/page.tsx

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { prisma } from '@/lib/prisma';
import {
  Car,
  Heart,
  Home,
  Package,
  ShoppingBag,
  Star,
  Utensils,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

// --- LÍNEA AÑADIDA: Fuerza el renderizado dinámico ---
// Esto evita que Next.js intente obtener los datos durante el build.
export const dynamic = 'force-dynamic';
// ----------------------------------------------------

// Revalidate this page every hour (será ignorado por 'force-dynamic', pero está bien dejarlo)
export const revalidate = 3600;

interface Category {
  id: string;
  categoryName: string;
  slug: string;
  description?: string | null;
  mainImage?: string | null;
  _count: {
    products: number;
  };
}

async function getCategories(): Promise<Category[]> {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });
  console.log('Datos recuperados de la base de datos:', categories);
  return categories;
}

const getCategoryIcon = (slug: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    comida: <Utensils className="h-8 w-8" />,
    aseos: <Home className="h-8 w-8" />,
    electrodomesticos: <Zap className="h-8 w-8" />,
    ropa: <ShoppingBag className="h-8 w-8" />,
    tecnologia: <Car className="h-8 w-8" />,
    salud: <Heart className="h-8 w-8" />,
    belleza: <Star className="h-8 w-8" />,
    deportes: <Package className="h-8 w-8" />,
    default: <ShoppingBag className="h-8 w-8" />,
  };
  return iconMap[slug] || iconMap.default;
};

const getCategoryColor = (index: number) => {
  const colors = [
    'from-blue-500 to-purple-600',
    'from-green-500 to-emerald-600',
    'from-orange-500 to-red-600',
    'from-purple-500 to-pink-600',
    'from-indigo-500 to-blue-600',
    'from-teal-500 to-cyan-600',
    'from-rose-500 to-pink-600',
    'from-violet-500 to-purple-600',
  ];
  return colors[index % colors.length];
};

export default async function CategoriesPage() {
  const categories = await getCategories();
  console.log('Categorías obtenidas para renderizar:', categories);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Nuestras Categorías
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Explora nuestra amplia gama de productos organizados por
              categorías. Encuentra exactamente lo que necesitas de manera fácil
              y rápida.
            </p>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((category, index) => {
            // Asegurarse de que el slug no sea nulo o undefined
            const slug = category.slug || category.id;
            const href = `/categories/${slug}`;
            console.log(
              `Generando enlace para la categoría ${category.categoryName}:`,
              href,
            );
            return (
              <Link key={category.id} href={href}>
                <Card className="group bg-white dark:bg-neutral-800 border-0 shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer overflow-hidden">
                  <div
                    className={`bg-gradient-to-r ${getCategoryColor(
                      index,
                    )} p-6`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-white">
                        {getCategoryIcon(category.slug || 'default')}
                      </div>
                      <Badge className="bg-white text-gray-900 dark:text-gray-800 font-semibold px-2 py-1 rounded-full">
                        {category._count.products} productos
                      </Badge>
                    </div>
                  </div>
                  <CardContent>
                    <CardTitle>{category.categoryName}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
