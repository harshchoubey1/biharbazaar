const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, role: true }
  });
  console.log('--- Users ---');
  console.table(users);

  const profiles = await prisma.sellerProfile.findMany();
  console.log('--- Seller Profiles ---');
  console.table(profiles);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
