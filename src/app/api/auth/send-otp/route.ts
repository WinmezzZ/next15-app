import { generateEmailVerificationCode } from "@/actions/auth";
import { sendOTP } from "@/actions/email";
import prisma from "@/lib/prisma";

export const POST = async (req: Request) => {
  const body = await req.json();

  try {
    const user = await prisma.user.upsert({
        where: {
            email: body.email,
          },
        update: {},
        create: {
            email: body.email,
            emailVerified: null,
            password: body.password
        },
    });

    const otp = await generateEmailVerificationCode(user.id, body.email);
    await sendOTP({
      toMail: body.email,
      code: otp,
      userName: user.name?.split(" ")[0] || "",
    });

    return new Response(null, {
      status: 200,
    });
  } catch (error) {
    console.log(error);

    return new Response(null, {
      status: 500,
    });
  }
};