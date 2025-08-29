'use client';

import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useState } from 'react';

interface WhatsAppButtonProps {
  productName?: string;
  productPrice?: number;
  productUrl?: string;
  phoneNumber?: string;
  className?: string;
  variant?:
    | 'default'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children?: React.ReactNode;
}

export default function WhatsAppButton({
  productName = 'producto',
  productPrice,
  productUrl,
  phoneNumber = '+535358134753', // Tu número principal
  className = '',
  variant = 'default',
  size = 'default',
  children,
}: WhatsAppButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const generateWhatsAppMessage = () => {
    const baseMessage = `¡Hola! 👋 Me interesa el producto:`;
    const productInfo = productName ? `\n\n📦 *${productName}*` : '';
    const priceInfo = productPrice
      ? `\n Precio: $${productPrice.toLocaleString()}`
      : '';
    const urlInfo = productUrl ? `\n🔗 Ver producto: ${productUrl}` : '';
    const footer = `\n\n¿Podrías darme más información sobre disponibilidad y envío? 🚚`;

    return `${baseMessage}${productInfo}${priceInfo}${urlInfo}${footer}`;
  };

  const handleWhatsAppClick = () => {
    setIsLoading(true);

    const message = encodeURIComponent(generateWhatsAppMessage());
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${message}`;

    // Abrir WhatsApp en nueva pestaña
    window.open(whatsappUrl, '_blank');

    // Simular delay para feedback visual
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <Button
      onClick={handleWhatsAppClick}
      disabled={isLoading}
      variant={variant}
      size={size}
      className={`bg-green-600 hover:bg-green-700 text-white ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Enviando...
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          {children || 'Pedir por WhatsApp'}
        </div>
      )}
    </Button>
  );
}
