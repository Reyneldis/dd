// src/lib/prisma.ts

import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';

// 1. Creamos una función "fábrica" que crea el cliente extendido
const createPrismaClient = () => {
  return new PrismaClient().$extends(withAccelerate());
};

// 2. Obtenemos el tipo exacto del cliente que devuelve la fábrica
type ExtendedPrismaClient = ReturnType<typeof createPrismaClient>;

// 3. Usamos este tipo para nuestro objeto global
declare global {
  var prismaGlobal: ExtendedPrismaClient | undefined;
}

// 4. Creamos la instancia usando la fábrica y la lógica global
export const prisma = global.prismaGlobal ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prismaGlobal = prisma;
}
