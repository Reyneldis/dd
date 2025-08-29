import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { OrderStatus } from '@prisma/client';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Función utilitaria para pausar la ejecución del código
 * @param ms Tiempo en milisegundos
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const translateOrderStatus = (status: OrderStatus): string => {
    switch (status) {
        case 'PENDING': return 'Pendiente';
        case 'CONFIRMED': return 'Confirmado';
        case 'PROCESSING': return 'Procesando';
        case 'SHIPPED': return 'Enviado';
        case 'DELIVERED': return 'Entregado';
        case 'CANCELLED': return 'Cancelado';
        case 'REFUNDED': return 'Reembolsado';
        case 'FAILED': return 'Fallido';
        default: return status;
    }
};