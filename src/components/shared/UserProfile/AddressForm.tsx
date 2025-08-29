'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Save, X, Home, Building2, MapPin } from 'lucide-react';
import { UserAddress } from '@/types/user';

interface AddressFormProps {
  address?: UserAddress;
  onSave: (address: Omit<UserAddress, 'id'>) => void;
  onClose: () => void;
}

const addressTypes = [
  { value: 'home', label: 'Casa', icon: Home },
  { value: 'work', label: 'Trabajo', icon: Building2 },
  { value: 'other', label: 'Otro', icon: MapPin },
];

const countries = [
  { value: 'Colombia', label: 'Colombia' },
  { value: 'México', label: 'México' },
  { value: 'Argentina', label: 'Argentina' },
  { value: 'Chile', label: 'Chile' },
  { value: 'Perú', label: 'Perú' },
  { value: 'España', label: 'España' },
  { value: 'Estados Unidos', label: 'Estados Unidos' },
];

export default function AddressForm({
  address,
  onSave,
  onClose,
}: AddressFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Omit<UserAddress, 'id'>>({
    type: 'home',
    isDefault: false,
    firstName: '',
    lastName: '',
    company: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Colombia',
    phone: '',
    instructions: '',
  });

  useEffect(() => {
    if (address) {
      setFormData({
        type: address.type,
        isDefault: address.isDefault,
        firstName: address.firstName,
        lastName: address.lastName,
        company: address.company || '',
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2 || '',
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country,
        phone: address.phone,
        instructions: address.instructions || '',
      });
    }
  }, [address]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave(formData);
      onClose();
    } catch {
      // Error handling is done in the parent component
    } finally {
      setLoading(false);
    }
  };

  const isEditing = !!address;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          {isEditing ? 'Editar Dirección' : 'Agregar Nueva Dirección'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de dirección */}
          <div className="space-y-2">
            <Label>Tipo de Dirección</Label>
            <div className="grid grid-cols-3 gap-2">
              {addressTypes.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleInputChange('type', value)}
                  className={`flex items-center gap-2 p-3 rounded-lg border transition-colors ${
                    formData.type === value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Información personal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nombre *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={e => handleInputChange('firstName', e.target.value)}
                placeholder="Tu nombre"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Apellido *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={e => handleInputChange('lastName', e.target.value)}
                placeholder="Tu apellido"
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="company">Empresa (opcional)</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={e => handleInputChange('company', e.target.value)}
                placeholder="Nombre de la empresa"
              />
            </div>
          </div>

          {/* Dirección */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="addressLine1">Dirección *</Label>
              <Input
                id="addressLine1"
                value={formData.addressLine1}
                onChange={e =>
                  handleInputChange('addressLine1', e.target.value)
                }
                placeholder="Calle, número, apartamento"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="addressLine2">
                Dirección adicional (opcional)
              </Label>
              <Input
                id="addressLine2"
                value={formData.addressLine2}
                onChange={e =>
                  handleInputChange('addressLine2', e.target.value)
                }
                placeholder="Información adicional"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Ciudad *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={e => handleInputChange('city', e.target.value)}
                  placeholder="Ciudad"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">Estado/Departamento *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={e => handleInputChange('state', e.target.value)}
                  placeholder="Estado"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">Código Postal *</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={e =>
                    handleInputChange('postalCode', e.target.value)
                  }
                  placeholder="Código postal"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">País *</Label>
                <Select
                  value={formData.country}
                  onValueChange={value => handleInputChange('country', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un país" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map(country => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={e => handleInputChange('phone', e.target.value)}
                  placeholder="+57 300 123 4567"
                  required
                />
              </div>
            </div>
          </div>

          {/* Instrucciones de entrega */}
          <div className="space-y-2">
            <Label htmlFor="instructions">
              Instrucciones de entrega (opcional)
            </Label>
            <Textarea
              id="instructions"
              value={formData.instructions}
              onChange={e => handleInputChange('instructions', e.target.value)}
              placeholder="Instrucciones especiales para la entrega..."
              rows={3}
            />
          </div>

          {/* Dirección por defecto */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isDefault"
              checked={formData.isDefault}
              onCheckedChange={checked =>
                handleInputChange('isDefault', checked as boolean)
              }
            />
            <Label htmlFor="isDefault" className="text-sm">
              Usar como dirección por defecto
            </Label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Agregar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
 