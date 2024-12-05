import prisma from '@/lib/prisma';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { signInSchema } from './app/(auth)/schema';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  providers: [
    GithubProvider,
    GoogleProvider,
    CredentialsProvider({
      authorize: async credentials => {
        const validatedFields = signInSchema.safeParse(credentials);

        if (!validatedFields.success) {
          // const fieldErrors = validatedFields.error.flatten().fieldErrors;

          // throw new AuthError(Object.values(fieldErrors)[0][0]);
          return null;
        }

        const { email, password } = validatedFields.data;
        const user = await prisma.user.findUnique({
          where: {
            email: email,
            password: password,
          },
        });
        if (!user) {
          // throw new AuthError('请检查用户名或密码');
          return null;
        }
        return user;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      console.log('jwt', token);
      console.log('user', user);
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: {
            email: user.email || '',
          },
        });

        if (!dbUser) {
          const res = await prisma.user.create({
            data: { name: user.name!, email: user.email!, image: user.image! },
          });
          token.id = res.id;
          return token;
        }

        token.id = dbUser.id;
        token.name = dbUser.name;
        token.email = dbUser.email;
        token.picture = dbUser.image;
      }

      return token;
    },

    // session is the session object that we get from the jwt callback, we can get session data client side using useSession hook
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        // session.user.role = token.role;
      }
      return session;
    },

    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
  },

  // this is the secret that we use to encrypt the jwt token
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: 'jwt',
  },
  trustHost: true,

  pages: {
    signIn: '/signin',
    signOut: '/signout',
  },
});

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
  }
}
