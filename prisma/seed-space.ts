import prisma from '@/lib/prisma';

export async function main() {
  try {
    await prisma.space.create({
      data: {
        name: 'My Space',
        ownerId: 'cm410aajv0000cpksdvmeicqw',
        users: {
          connect: {
            id: 'cm410aajv0000cpksdvmeicqw',
          },
        },
      },
    });
    console.log(`Seeding finished.`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
