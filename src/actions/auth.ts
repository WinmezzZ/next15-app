'use server';

import prisma from '@/lib/prisma';
import { generateRandomString, RandomReader } from '@oslojs/crypto/random';

const digits = '0123456789';

export async function generateEmailVerificationCode(userId: string, email: string): Promise<string> {
  await prisma.emailVerificationCode.deleteMany({
    where: {
      userId,
    },
  });
  const random: RandomReader = {
    read(bytes) {
      crypto.getRandomValues(bytes);
    },
  };
  const code = generateRandomString(random, digits, 6);
  await prisma.emailVerificationCode.create({
    data: {
      userId,
      email,
      code,
      expiresAt: new Date(Date.now() + 1000 * 60 * 3),
    },
  });
  return code;
}

export async function verifyVerificationCode(user: { id: string; email: string }, code: string): Promise<boolean> {
  return await prisma.$transaction(async tx => {
    const databaseCode = await tx.emailVerificationCode.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (!databaseCode || databaseCode.code !== code) {
      return false;
    }

    await tx.emailVerificationCode.delete({
      where: {
        id: databaseCode.id,
      },
    });

    if (Date.now() > databaseCode.expiresAt.getTime()) {
      return false;
    }

    if (databaseCode.email !== user.email) {
      return false;
    }

    return true;
  });
}
