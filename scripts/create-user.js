const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      clerkId: 'user_2zs7eVMG31XxaBxAu3cNG8FzsNQ',
      email: 'reyneldis@gamil.com',
      firstName: 'reyneldis',
      lastName: 'umpierre',
      role: 'USER',
      avatar: null,
    },
  });
  console.log('Usuario creado:', user);
  process.exit(0);
}

main();
