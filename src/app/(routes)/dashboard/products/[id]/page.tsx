// app/dashboard/products/[id]/page.tsx
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ProductFull } from '@/types';
import {
  ArrowLeft,
  Edit,
  Image as ImageIcon,
  Package,
  Tag,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<ProductFull | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar producto
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/dashboard/products/${productId}/details`,
        );
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold">Producto no encontrado</h1>
        <Button asChild className="mt-4">
          <Link href="/dashboard/products">Volver a productos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a productos
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            Detalles del Producto
          </h1>
        </div>
        <Button asChild>
          <Link href={`/dashboard/products/${productId}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Imágenes */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Imágenes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {product.images && product.images.length > 0 ? (
              <div className="space-y-4">
                {product.images.map(image => (
                  <div key={image.id} className="rounded-md overflow-hidden">
                    <img
                      src={image.url}
                      alt={image.alt || product.productName}
                      className="w-full h-48 object-cover"
                    />
                    {image.isPrimary && (
                      <div className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 mt-1 inline-block">
                        Imagen principal
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2">No hay imágenes disponibles</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Información principal */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                {product.productName}
              </CardTitle>
              <div className="flex space-x-2">
                <Badge
                  className={
                    product.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }
                >
                  {product.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                </Badge>
                {product.featured && (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    Destacado
                  </Badge>
                )}
              </div>
            </div>
            <CardDescription>
              {product.description || 'Sin descripción disponible'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Precio</h3>
                <p className="text-lg font-semibold">
                  ${product.price.toFixed(2)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Stock</h3>
                <p className="text-lg font-semibold">
                  {product.stock} unidades
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Slug</h3>
                <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                  {product.slug}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">ID</h3>
                <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                  {product.id}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Categoría
              </h3>
              <div className="flex items-center space-x-2">
                <Tag className="h-4 w-4 text-gray-500" />
                <span>{product.category.categoryName}</span>
              </div>
            </div>

            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Características
                </h3>
                <ul className="space-y-1">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-indigo-500 mr-2">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Fecha de creación
                </h3>
                <p>{new Date(product.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Última actualización
                </h3>
                <p>{new Date(product.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>

            {product._count && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Ventas</h3>
                <p>{product._count.orderItems || 0} unidades vendidas</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
