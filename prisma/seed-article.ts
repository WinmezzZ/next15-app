import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function main() {
  try {
    await prisma.article.create({
      data: {
        spaceId: 'cm5ma83zh0001xmfqgt4aqj1k',
        title: 'My First Article',
        content: 'This is my first article',
        authorId: 'cm410aajv0000cpksdvmeicqw',
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
