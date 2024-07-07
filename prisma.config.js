module.exports = {
  prismaClient: {
    datasources: [
      {
        url: process.env.DATABASE_URL,
        driver: "@prisma/mysql",
      },
    ],
  },
};
