module.exports = {
  prismaClient: {
    datasources: [
      {
        url: "your_db_link",
        driver: "@prisma/mysql",
      },
    ],
  },
};
