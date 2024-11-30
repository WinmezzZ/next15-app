import prisma from '@/lib/prisma';
import NextAuth, { AuthError } from 'next-auth';
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
          const fieldErrors = validatedFields.error.flatten().fieldErrors;

          throw new AuthError(Object.values(fieldErrors)[0][0]);
        }

        const { username, password } = validatedFields.data;
        const user = await prisma.user.findFirstOrThrow({
          where: {
            name: username as string,
            password: password as string,
          },
        });
        if (!user) {
          throw new AuthError('请检查用户名或密码');
        }
        return user;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (!token.email) return token;
      const dbUser = await prisma.user.findFirst({
        where: {
          email: token.email,
        },
      });

      if (!dbUser) {
        token.id = user!.id;
        return token;
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        role: dbUser.roleId,
        email: dbUser.email,
        picture: dbUser.image,
      };
    },

    // session is the session object that we get from the jwt callback, we can get session data client side using useSession hook
    async session({ session, user }) {
      // if (token) {
      //   session.user.id = token.id;
      //   session.user.name = token.name;
      //   session.user.email = token.email;
      //   session.user.picture = token.picture;
      //   session.user.role = token.role;
      // }
      session.user = user;
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
