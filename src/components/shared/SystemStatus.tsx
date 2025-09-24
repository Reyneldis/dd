'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CheckCircle,
  Mail,
  MessageCircle,
  Package,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface SystemStatusData {
  categories: number;
  products: number;
  orders: number;
  testimonials: number;
  users: number;
  emailConfigured: boolean;
  whatsappConfigured: boolean;
}

export default function SystemStatus() {
  const [status, setStatus] = useState<SystemStatusData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSystemStatus = async () => {
      try {
        // Verificar configuración de email
        const emailConfigured = !!(
          process.env.NEXT_PUBLIC_GMAIL_USER || process.env.GMAIL_USER
        );

        // Verificar configuración de WhatsApp
        const whatsappConfigured = !!(
          process.env.NEXT_PUBLIC_WHATSAPP_ADMINS ||
          process.env.WHATSAPP_ADMIN_NUMBERS
        );

        // Obtener estadísticas básicas
        const [
          categoriesRes,
          productsRes,
          ordersRes,
          testimonialsRes,
          usersRes,
        ] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/products'),
          fetch('/api/orders'),
          fetch('/api/reviews/testimonials'),
          fetch('/api/users'),
        ]);

        const [categories, products, orders, testimonials, users] =
          await Promise.all([
            categoriesRes.json(),
            productsRes.json(),
            ordersRes.json(),
            testimonialsRes.json(),
            usersRes.json(),
          ]);

        setStatus({
          categories: categories.categories?.length || 0,
          products: products.products?.length || 0,
          orders: orders.length || 0,
          testimonials: testimonials.testimonials?.length || 0,
          users: users.length || 0,
          emailConfigured,
          whatsappConfigured,
        });
      } catch (error) {
        console.error('Error checking system status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSystemStatus();
  }, []);

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Estado del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!status) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Estado del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Error al cargar el estado del sistema</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Estado del Sistema
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Estadísticas básicas */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {status.categories}
            </div>
            <div className="text-sm text-gray-600">Categorías</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {status.products}
            </div>
            <div className="text-sm text-gray-600">Productos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {status.orders}
            </div>
            <div className="text-sm text-gray-600">Órdenes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {status.testimonials}
            </div>
            <div className="text-sm text-gray-600">Testimonios</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-600">
              {status.users}
            </div>
            <div className="text-sm text-gray-600">Usuarios</div>
          </div>
        </div>

        {/* Estado de servicios */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-700">Estado de Servicios</h4>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span className="text-sm">Sistema de Email</span>
            </div>
            <Badge variant={status.emailConfigured ? 'default' : 'destructive'}>
              {status.emailConfigured ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Configurado
                </>
              ) : (
                <>
                  <XCircle className="h-3 w-3 mr-1" />
                  No configurado
                </>
              )}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm">WhatsApp</span>
            </div>
            <Badge
              variant={status.whatsappConfigured ? 'default' : 'secondary'}
            >
              {status.whatsappConfigured ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Configurado
                </>
              ) : (
                <>
                  <XCircle className="h-3 w-3 mr-1" />
                  Básico
                </>
              )}
            </Badge>
          </div>
        </div>

        {/* Resumen */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-2">Resumen</h4>
          <p className="text-sm text-gray-600">
            Tu tienda online está funcionando correctamente con{' '}
            <strong>{status.categories}</strong> categorías,{' '}
            <strong>{status.products}</strong> productos activos y{' '}
            <strong>{status.orders}</strong> órdenes procesadas.
            {status.emailConfigured &&
              ' El sistema de emails está configurado.'}
            {status.whatsappConfigured &&
              ' Las notificaciones de WhatsApp están activas.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
