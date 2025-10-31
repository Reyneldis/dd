// src/components/dashboard/EmailPreview.tsx - VERSIÓN CORREGIDA
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { FailedEmail } from '@/types';
import { Eye, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';

interface EmailPreviewProps {
  email: FailedEmail;
}

export function EmailPreview({ email }: EmailPreviewProps) {
  const [open, setOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Cargar el contenido cuando se abre el diálogo
  useEffect(() => {
    if (open && !previewContent) {
      loadPreview();
    }
  }, [open]);

  const loadPreview = async () => {
    setLoading(true);
    try {
      // Simular carga del contenido del email
      // En una implementación real, esto vendría de la API
      const mockContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">${
              email.type === 'ORDER_CONFIRMATION'
                ? 'Confirmación de Pedido'
                : 'Actualización de Estado'
            }</h1>
          </div>
          <div style="padding: 20px; background: #f9f9f9;">
            <p>Hola,</p>
            <p>${
              email.type === 'ORDER_CONFIRMATION'
                ? 'Gracias por tu pedido. Tu orden ha sido confirmada y está siendo procesada.'
                : 'El estado de tu pedido ha sido actualizado.'
            }</p>
            <div style="background: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Número de Pedido:</strong> #${
                email.order?.orderNumber || email.orderId.slice(-6)
              }</p>
              <p><strong>Fecha:</strong> ${new Date(
                email.timestamp,
              ).toLocaleDateString()}</p>
            </div>
            <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
            <p>Gracias por tu compra!</p>
          </div>
        </div>
      `;
      setPreviewContent(mockContent);
    } catch (error) {
      console.error('Error loading email preview:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4 mr-2" />
          Previsualizar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Previsualización del Email</span>
          </DialogTitle>
          <DialogDescription>
            Vista previa del email que se envió o intentó enviar
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Información del email */}
          <Card className="p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Para:</span> {email.recipient}
              </div>
              <div>
                <span className="font-medium">Tipo:</span> {email.type}
              </div>
              <div>
                <span className="font-medium">Estado:</span>
                <Badge
                  className="ml-2"
                  variant={email.status === 'sent' ? 'default' : 'destructive'}
                >
                  {email.status}
                </Badge>
              </div>
              <div>
                <span className="font-medium">Intentos:</span> {email.attempts}
              </div>
            </div>
          </Card>

          <Separator />

          {/* Vista previa del contenido */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 border-b">
              <span className="text-sm font-medium">Contenido del Email</span>
            </div>
            <div className="bg-white p-4">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : (
                <div
                  dangerouslySetInnerHTML={{ __html: previewContent }}
                  className="prose max-w-none"
                />
              )}
            </div>
          </div>

          {email.error && (
            <>
              <Separator />
              <Card className="p-4 border-red-200 bg-red-50">
                <div className="flex items-start space-x-3">
                  <div className="text-red-600">
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-red-800">
                      Error de Envío
                    </h4>
                    <p className="text-sm text-red-700 mt-1">{email.error}</p>
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
