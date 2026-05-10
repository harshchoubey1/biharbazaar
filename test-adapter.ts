import { prisma } from './src/lib/prisma';
prisma.user.count().then(console.log).catch(console.error).finally(() => process.exit(0));
