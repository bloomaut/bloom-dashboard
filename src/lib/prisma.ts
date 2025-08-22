import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: "mongodb+srv://razgrisss41:Abc47599541@cluster0.dkqqwgl.mongodb.net/questionare",
      },
    },
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

//mongodb+srv://razgrisss41:<pass>@cluster0.dkqqwgl.mongodb.net/

//mongodb+srv://notiadmin:qLrJaiPnpjMALFWx@notimation-suit-dev.fdti2uz.mongodb.net/notimation-suit-dev
