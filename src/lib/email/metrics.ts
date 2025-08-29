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

export const logEmailMetrics = async (metrics: Omit<EmailMetrics, 'timestamp'>) => {
  try {
    await prisma.emailMetrics.create({
      data: {
        ...metrics,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error('Error al registrar métricas de correo:', error);
  }
};

export const getEmailMetrics = async (orderId: string) => {
  return prisma.emailMetrics.findMany({
    where: { orderId },
    orderBy: { timestamp: 'desc' },
  });
};
