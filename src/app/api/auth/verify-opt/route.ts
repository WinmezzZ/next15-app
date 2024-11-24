import { revalidatePath } from "next/cache";
import { verifyVerificationCode } from "@/actions/auth";
import prisma from "@/lib/prisma";
import { signIn, signOut } from '@/auth'


export const POST = async (req: Request, response: Response) => {
  const body = await req.json();

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
      select: {
        id: true,
        email: true,
        emailVerified: true,
      },
    });

    if (!user) {
      return new Response("User not found", {
        status: 400,
      });
    }

    const isValid = await verifyVerificationCode(
      { id: user.id, email: body.email },
      body.code
    );

    if (!isValid) {
      return new Response("Invalid OTP", {
        status: 400,
      });
    }

    if (!user.emailVerified) {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          emailVerified: new Date(),
        },
      });
    }
    signIn('credentials', {
        email: user.email,
        redirect: false
    })
    revalidatePath("/", "layout");
    return new Response(null, {
      status: 200,
    });
  } catch (error) {
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
};