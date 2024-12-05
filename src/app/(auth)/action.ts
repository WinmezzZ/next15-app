'use server';

import { signIn } from '@/auth';

export async function oauthSignIn(provider: string) {
  const res = await signIn(provider, { redirect: false });
  return res;
}
