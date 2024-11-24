"use server";

import VerificationTemp from "@/emails/verification";
import { resend } from "@/lib/resend";
import { nanoid } from "nanoid";

export interface SendWelcomeEmailProps {
    toMail: string;
    userName: string;
    code: string
}

export const sendOTP = async ({ toMail, code, userName }: SendWelcomeEmailProps) => {
  const subject = "OTP for ChadNext";
  const temp = VerificationTemp({ userName, code });

  await resend.emails.send({
    from: `ChadNext App <chadnext@moinulmoin.com>`,
    to: toMail,
    subject: subject,
    headers: {
      "X-Entity-Ref-ID": nanoid(),
    },
    react: temp,
    text: "",
  });
};