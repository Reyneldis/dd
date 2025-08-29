'use client';

import {
  UserAddress,
  UserOrder,
  UserPreferences,
  UserProfile,
} from '@/types/user';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

// Datos de ejemplo para demostración
const defaultPreferences: UserPreferences = {
  language: 'es',
  currency: 'USD',
  theme: 'system',
  emailNotifications: {
    orderUpdates: true,
    promotions: true,
    securityAlerts: true,
  },
  pushNotifications: {
    orderUpdates: true,
    promotions: false,
    securityAlerts: true,
  },
};

const mockAddresses: UserAddress[] = [
  {
    id: '1',
    type: 'home',
    isDefault: true,
    firstName: 'Juan',
    lastName: 'Pérez',
    addressLine1: 'Calle 123 #45-67',
    city: 'Bogotá',
    state: 'Cundinamarca',
    postalCode: '110111',
    country: 'Colombia',
    phone: '+57 300 123 4567',
  },
];

const mockOrders: UserOrder[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    status: 'delivered',
    items: [
      {
        id: '1',
        productId: 'laptop-dell-xps',
        productName: 'Laptop Dell XPS 13',
        productImage: '/img/arrocera-negra.webp',
        price: 1200,
        quantity: 1,
        total: 1200,
      },
    ],
    total: 1200,
    shippingAddress: mockAddresses[0],
    billingAddress: mockAddresses[0],
    paymentMethod: 'Tarjeta de crédito',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-18T14:20:00Z',
    estimatedDelivery: '2024-01-20T10:00:00Z',
    trackingNumber: 'TRK123456789',
  },
];

export function useUserProfile() {
  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      // Simular carga de datos del usuario
      const userProfile: UserProfile = {
        id: user.id,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.emailAddresses[0]?.emailAddress || '',
        phone: user.phoneNumbers[0]?.phoneNumber || '',
        avatar: user.imageUrl,
        preferences: defaultPreferences,
        addresses: mockAddresses,
        createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: user.updatedAt?.toISOString() || new Date().toISOString(),
      };

      setProfile(userProfile);
      setLoading(false);
    }
  }, [isLoaded, user]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return;

    try {
      // Aquí normalmente harías una llamada a tu API
      const updatedProfile = {
        ...profile,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      setProfile(updatedProfile);
      toast.success('Perfil actualizado correctamente');
    } catch {
      toast.error('Error al actualizar el perfil');
    }
  };

  const updatePreferences = async (preferences: Partial<UserPreferences>) => {
    if (!profile) return;

    try {
      const updatedPreferences = { ...profile.preferences, ...preferences };
      await updateProfile({ preferences: updatedPreferences });
    } catch {
      toast.error('Error al actualizar las preferencias');
    }
  };

  const addAddress = async (address: Omit<UserAddress, 'id'>) => {
    if (!profile) return;

    try {
      const newAddress: UserAddress = {
        ...address,
        id: Date.now().toString(),
      };

      // Si es la primera dirección, hacerla por defecto
      if (profile.addresses.length === 0) {
        newAddress.isDefault = true;
      }

      // Si se marca como por defecto, quitar el flag de las demás
      if (newAddress.isDefault) {
        profile.addresses.forEach(addr => (addr.isDefault = false));
      }

      const updatedAddresses = [...profile.addresses, newAddress];
      await updateProfile({ addresses: updatedAddresses });
      toast.success('Dirección agregada correctamente');
    } catch {
      toast.error('Error al agregar la dirección');
    }
  };

  const updateAddress = async (
    addressId: string,
    updates: Partial<UserAddress>,
  ) => {
    if (!profile) return;

    try {
      const updatedAddresses = profile.addresses.map(addr =>
        addr.id === addressId ? { ...addr, ...updates } : addr,
      );
      await updateProfile({ addresses: updatedAddresses });
      toast.success('Dirección actualizada correctamente');
    } catch {
      toast.error('Error al actualizar la dirección');
    }
  };

  const deleteAddress = async (addressId: string) => {
    if (!profile) return;

    try {
      const updatedAddresses = profile.addresses.filter(
        addr => addr.id !== addressId,
      );
      await updateProfile({ addresses: updatedAddresses });
      toast.success('Dirección eliminada correctamente');
    } catch {
      toast.error('Error al eliminar la dirección');
    }
  };

  const setDefaultAddress = async (addressId: string) => {
    if (!profile) return;

    try {
      const updatedAddresses = profile.addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId,
      }));
      await updateProfile({ addresses: updatedAddresses });
      toast.success('Dirección por defecto actualizada');
    } catch {
      toast.error('Error al actualizar la dirección por defecto');
    }
  };

  const getOrders = (): UserOrder[] => {
    return mockOrders;
  };

  return {
    profile,
    loading,
    updateProfile,
    updatePreferences,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    getOrders,
  };
}
