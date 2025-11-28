// src/app/(routes)/dashboard/users/[id]/page.tsx
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { User } from '@/types';
import {
  ArrowLeft,
  Calendar,
  Edit,
  Shield,
  User as UserIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UserDetailPage() {
  const params = useParams();
  const userId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Cargar usuario
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setNotFound(false);
        const response = await fetch(`/api/dashboard/users/${userId}`);

        // Verificar si la respuesta es exitosa antes de intentar parsear JSON
        if (!response.ok) {
          throw new Error('Error al cargar el usuario');
        }

        const result = await response.json();

        // <-- CAMBIO CLAVE: Verificar `result.success` antes de acceder a `result.data`
        if (result.success) {
          setUser(result.data); // <-- Acceder al usuario solo si la API fue exitosa
        } else {
          // Si la API devuelve success: false, es un error (ej. "no encontrado")
          setNotFound(true);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (notFound || !user) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold">Usuario no encontrado</h1>
        <p className="text-gray-500 mb-4">
          El usuario que buscas no existe o ha sido eliminado.
        </p>
        <Button asChild>
          <Link href="/dashboard/users">Volver a usuarios</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/users">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a usuarios
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            Detalles del Usuario
          </h1>
        </div>
        <Button asChild>
          <Link href={`/dashboard/users/${userId}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Información principal */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              {user.firstName} {user.lastName}
            </CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-gray-500">ID</h3>
                <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                  {user.id}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Clerk ID</h3>
                <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                  {user.clerkId}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Rol</h3>
              <div className="flex items-center space-x-1">
                <Shield className="h-4 w-4 text-gray-500" />
                <span>{user.role}</span>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Fecha de registro
                </h3>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Última actualización
                </h3>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{new Date(user.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Avatar */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Avatar</CardTitle>
          </CardHeader>
          <CardContent>
            {user.avatar ? (
              <div className="rounded-md overflow-hidden">
                <Image
                  src={user.avatar}
                  alt={`${user.firstName} ${user.lastName}`}
                  width={300}
                  height={300}
                  className="w-full h-48 object-cover"
                  onError={e => {
                    // Si la imagen falla al cargar, ocultarla
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2">No hay avatar disponible</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
