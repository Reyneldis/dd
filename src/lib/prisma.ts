// src/lib/prisma.ts

import { PrismaClient } from '@prisma/client'; // <-- CAMBIO CLAVE: Usar el cliente estándar

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient(); // <-- CAMBIO CLAVE: Crear una instancia normal, sin extensiones

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
