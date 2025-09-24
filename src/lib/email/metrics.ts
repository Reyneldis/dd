// src/lib/email/metrics.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface EmailMetrics {
  type: string;
  recipient: string;
  orderId: string;
  status: 'sent' | 'failed' | 'retry';
  attempt: number;
  error?: string;
  timestamp: Date;
}

export const logEmailMetrics = async (
  metrics: Omit<EmailMetrics, 'timestamp'>,
) => {
  try {
    await prisma.emailMetrics.create({
      data: {
        ...metrics,
        timestamp: new Date(),
      },
    });
    console.log('✅ Métricas de correo registradas:', metrics);
  } catch (error) {
    console.error('Error al registrar métricas de correo:', error);
  }
};
