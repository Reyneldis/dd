// src/components/account/AccountClient.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SignOutButton, useAuth, useUser } from '@clerk/nextjs';
import {
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  LogOut,
  Mail,
  MapPin,
  Package,
  Phone,
  ShoppingCart,
  Sparkles,
  Star,
  Truck,
  User,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    productName: string;
    images: Array<{
      id: string;
      url: string;
      alt?: string;
    }>;
  };
}

interface ShippingAddress {
  address: string;
  phone: string;
}

interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: string;
  customerEmail: string;
  customerName: string;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  total: number;
  paymentStatus: string;
  paymentMethod?: string;
  shippingAddress?: ShippingAddress;
  billingAddress?: ShippingAddress;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export function AccountClient() {
  const { user, isLoaded } = useUser();
  const { userId } = useAuth();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Cargar órdenes del usuario
  useEffect(() => {
    if (isLoaded && user && userId) {
      const fetchOrders = async () => {
        try {
          const response = await fetch('/api/orders');
          if (response.ok) {
            const data = await response.json();
            setOrders(data);
          } else {
            toast.error('Error cargando las órdenes');
          }
        } catch (error) {
          console.error('Error fetching orders:', error);
          toast.error('Error cargando las órdenes');
        } finally {
          setLoading(false);
        }
      };
      fetchOrders();
    }
  }, [isLoaded, user, userId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4" />;
      case 'CONFIRMED':
        return <CheckCircle className="w-4 h-4" />;
      case 'PROCESSING':
        return <Package className="w-4 h-4" />;
      case 'SHIPPED':
        return <Truck className="w-4 h-4" />;
      case 'DELIVERED':
        return <CheckCircle className="w-4 h-4" />;
      case 'CANCELLED':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pendiente';
      case 'CONFIRMED':
        return 'Confirmado';
      case 'PROCESSING':
        return 'Procesando';
      case 'SHIPPED':
        return 'Enviado';
      case 'DELIVERED':
        return 'Entregado';
      case 'CANCELLED':
        return 'Cancelado';
      default:
        return 'Pendiente';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'PROCESSING':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'SHIPPED':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Cargando tu perfil...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Acceso Requerido
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
            Necesitas iniciar sesión para ver tu cuenta.
          </p>
          <Link href="/login">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              Iniciar Sesión
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header con gradiente */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-10"></div>
        <div className="relative container mx-auto px-6 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                    Mi Cuenta
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-300">
                    Bienvenido,{' '}
                    {user.firstName || user.emailAddresses[0]?.emailAddress}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <SignOutButton>
                <Button variant="outline" className="rounded-full">
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar Sesión
                </Button>
              </SignOutButton>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 pb-16">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Pedidos
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {orders.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Pedidos Activos
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {
                      orders.filter(
                        o =>
                          o.status === 'PENDING' || o.status === 'PROCESSING',
                      ).length
                    }
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Gastado
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    $
                    {orders
                      .reduce((sum, order) => sum + Number(order.total), 0)
                      .toFixed(2)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Miembro Desde
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user.createdAt
                      ? new Date(user.createdAt).getFullYear()
                      : '2024'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/20 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-pink-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs para navegación */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <Link
                href="/account?tab=profile"
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  tab === 'profile' || !tab
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Perfil
              </Link>
              <Link
                href="/account?tab=orders"
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  tab === 'orders'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Pedidos
              </Link>
            </nav>
          </div>
        </div>

        {/* Contenido según la pestaña seleccionada */}
        {(tab === 'profile' || !tab) && (
          <>
            {/* Información del usuario */}
            <Card className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm border-0 shadow-xl mb-8">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-2xl font-bold">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  Información Personal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        Nombre
                      </label>
                      <Input
                        value={user.firstName || ''}
                        disabled
                        className="bg-gray-50 dark:bg-neutral-700 border-0 rounded-xl h-12 text-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        Apellido
                      </label>
                      <Input
                        value={user.lastName || ''}
                        disabled
                        className="bg-gray-50 dark:bg-neutral-700 border-0 rounded-xl h-12 text-lg"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email
                      </label>
                      <Input
                        value={user.emailAddresses[0]?.emailAddress || ''}
                        disabled
                        className="bg-gray-50 dark:bg-neutral-700 border-0 rounded-xl h-12 text-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Miembro Desde
                      </label>
                      <Input
                        value={
                          user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString(
                                'es-ES',
                              )
                            : '2024'
                        }
                        disabled
                        className="bg-gray-50 dark:bg-neutral-700 border-0 rounded-xl h-12 text-lg"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {tab === 'orders' && (
          <>
            {/* Mis Órdenes */}
            <Card className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl font-bold">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-white" />
                  </div>
                  Mis Pedidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                      Cargando tus pedidos...
                    </p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-neutral-700 dark:to-neutral-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <ShoppingCart className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      No tienes pedidos aún
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
                      Cuando hagas tu primer pedido, aparecerá aquí.
                    </p>
                    <Link href="/products">
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                        <Sparkles className="w-5 h-5 mr-2" />
                        Explorar Productos
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map(order => (
                      <div
                        key={order.id}
                        className="bg-white dark:bg-neutral-700 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-neutral-600"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-4">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                Pedido {order.orderNumber}
                              </h3>
                              <span
                                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadge(
                                  order.status,
                                )}`}
                              >
                                {getStatusIcon(order.status)}
                                <span className="ml-2">
                                  {getStatusText(order.status)}
                                </span>
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-600 dark:text-gray-300">
                                  {formatDate(order.createdAt)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Package className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-600 dark:text-gray-300">
                                  {order.items.length} artículo
                                  {order.items.length !== 1 ? 's' : ''}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-gray-500" />
                                <span className="text-green-600 dark:text-green-400 font-bold text-lg">
                                  ${Number(order.total).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <Button
                              size="lg"
                              variant="outline"
                              onClick={() => handleViewDetails(order)}
                              className="rounded-xl border-2 hover:border-blue-500 hover:text-blue-600 transition-all duration-300"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Ver Detalles
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Modal de detalles */}
      {selectedOrder && (
        <div
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 ${
            showDetails ? 'block' : 'hidden'
          }`}
          onClick={() => setShowDetails(false)}
        >
          <div
            className="bg-white dark:bg-neutral-800 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Detalles del Pedido {selectedOrder.orderNumber}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(false)}
                className="rounded-full"
              >
                <XCircle className="w-5 h-5" />
              </Button>
            </div>
            <div className="space-y-6">
              {/* Información del pedido */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Estado del Pedido
                    </h3>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(selectedOrder.status)}
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(
                          selectedOrder.status,
                        )}`}
                      >
                        {getStatusText(selectedOrder.status)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Fecha de Creación
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {formatDate(selectedOrder.createdAt)}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Total del Pedido
                    </h3>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ${Number(selectedOrder.total).toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Información de Envío
                    </h3>
                    {selectedOrder.shippingAddress ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600 dark:text-gray-300">
                            {selectedOrder.shippingAddress.address}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600 dark:text-gray-300">
                            {selectedOrder.shippingAddress.phone}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">No disponible</p>
                    )}
                  </div>
                </div>
              </div>
              {/* Productos del pedido */}
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">
                  Productos del Pedido
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items.map(item => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-700 rounded-xl"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {item.productName}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Cantidad: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 dark:text-white">
                          ${Number(item.price).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Total: $
                          {(Number(item.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Resumen de costos */}
              <div className="bg-gray-50 dark:bg-neutral-700 rounded-xl p-6">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">
                  Resumen de Costos
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Subtotal:
                    </span>
                    <span className="font-semibold">
                      ${Number(selectedOrder.subtotal).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Envío:
                    </span>
                    <span className="font-semibold">
                      ${Number(selectedOrder.shippingAmount).toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span className="font-bold text-lg">Total:</span>
                      <span className="font-bold text-lg text-green-600 dark:text-green-400">
                        ${Number(selectedOrder.total).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
