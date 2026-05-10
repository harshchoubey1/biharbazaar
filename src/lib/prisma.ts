import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

let prisma: PrismaClient;

if (globalForPrisma.prisma) {
  prisma = globalForPrisma.prisma;
} else {
  // Use absolute path for Windows compatibility and predictable location
  const dbFilename = "dev.db";
  const absPath = path.resolve(process.cwd(), dbFilename);
  const resolvedUrl = "file:" + absPath.replace(/\\/g, "/");

  const adapter = new PrismaBetterSqlite3({ url: resolvedUrl } as any);
  
  prisma = new PrismaClient({ adapter });
}

export { prisma };

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
