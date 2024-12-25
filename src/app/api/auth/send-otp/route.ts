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

  const otp = await generateEmailVerificationCode(user.id, body.email);

  const res = await sendOTP({
    toMail: body.email,
    code: otp,
    userName: user.name?.split(' ')[0] || '',
  });

  console.log('res', res);

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
  });
};
