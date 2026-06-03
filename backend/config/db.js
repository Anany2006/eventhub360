const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

// Reusable instantiated Prisma Engine client instance
const prisma = new PrismaClient({
	adapter: new PrismaPg(process.env.DATABASE_URL)
});

module.exports = prisma;