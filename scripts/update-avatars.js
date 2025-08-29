const { PrismaClient } = require('@prisma/client');
const fetch = require('node-fetch');
require('dotenv').config();

const prisma = new PrismaClient();
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

async function updateAvatars() {
  const users = await prisma.user.findMany();

  for (const user of users) {
    if (!user.clerkId) continue;
    const res = await fetch(`https://api.clerk.dev/v1/users/${user.clerkId}`, {
      headers: {
        Authorization: `Bearer ${CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      console.log(`No se pudo obtener usuario Clerk para ${user.clerkId}`);
      continue;
    }
    const clerkUser = await res.json();
    const avatar = clerkUser.image_url || '';
    await prisma.user.update({
      where: { id: user.id },
      data: { avatar },
    });
    console.log(`Actualizado avatar para ${user.email}`);
  }
  console.log('¡Avatares actualizados!');
}

updateAvatars().finally(() => prisma.$disconnect());
