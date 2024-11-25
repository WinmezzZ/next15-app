import { generateEmailVerificationCode } from '@/actions/auth';
import { sendOTP } from '@/actions/email';
import prisma from '@/lib/prisma';

export const POST = async (req: Request) => {
  const body = await req.json();

  const user = await prisma.user.upsert({
    where: {
      email: body.email,
    },
    update: {},
    create: {
      email: body.email,
      emailVerified: null,
      password: body.password,
    },
  });

  console.log('user', user);

  const otp = await generateEmailVerificationCode(user.id, body.email);

  console.log('otp', otp);
  await sendOTP({
    toMail: body.email,
    code: otp,
    userName: user.name?.split(' ')[0] || '',
  });

  return new Response(null, {
    status: 200,
  });
};
