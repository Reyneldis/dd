// prisma.config.js
module.exports = {
  schema: './prisma/schema.prisma',
  datasource: {
    db: {
      provider: 'postgres',
      // Las URLs se obtienen de las variables de entorno automáticamente
    },
  },
};
