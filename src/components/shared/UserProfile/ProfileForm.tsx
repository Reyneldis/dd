'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Save, X } from 'lucide-react';
 

interface ProfileFormProps {
  onClose: () => void;
}

export default function ProfileForm({ onClose }: ProfileFormProps) {
  const { user } = useUser();
  // Removemos loading ya que no se necesita para solo lectura
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.emailAddresses[0]?.emailAddress || '',
    phone: user?.phoneNumbers[0]?.phoneNumber || '',
    dateOfBirth: '',
  });

  // Actualizar formData cuando el usuario cambie
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.emailAddresses[0]?.emailAddress || '',
        phone: user.phoneNumbers[0]?.phoneNumber || '',
        dateOfBirth: '',
      });
    }
  }, [user]);

  // Modo solo lectura: sin handlers ni subida de avatar

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // No hacer nada, solo cerrar el formulario
    onClose();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Mi Perfil</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user?.imageUrl} alt="Avatar" />
                <AvatarFallback className="text-2xl">
                  {user?.firstName?.charAt(0)}
                  {user?.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                disabled
                className="absolute -bottom-2 -right-2 p-2 bg-muted text-muted-foreground rounded-full opacity-50 cursor-not-allowed"
                title="Cambiar avatar (deshabilitado)"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Información de tu perfil de Clerk (solo lectura)
            </p>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nombre</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                placeholder="Tu nombre"
                disabled
                className="bg-muted/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Apellido</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                placeholder="Tu apellido"
                disabled
                className="bg-muted/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                placeholder="tu@email.com"
                disabled
                className="bg-muted/50"
              />
              <p className="text-xs text-muted-foreground">
                El email no se puede cambiar desde aquí
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone || 'No especificado'}
                placeholder="+57 300 123 4567"
                disabled
                className="bg-muted/50"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="dateOfBirth">Fecha de Nacimiento</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth || ''}
                disabled
                className="bg-muted/50"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Cerrar
            </Button>
            <Button type="submit" disabled>
              <Save className="h-4 w-4 mr-2" />
              Solo Lectura
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
