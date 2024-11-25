import prisma from "@/lib/prisma";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Resend from "next-auth/providers/resend";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  providers: [
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: 'YOUR EMAIL FROM (eg: team@resend.com)',
    }),
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const { email, password } = credentials;
        // const hashedPassword = await agron.hash(password as string);
        const user = await prisma.user.findFirst({ 
          where: { 
            email: email as string,
            password: password as string,
          }
        });
        return user;
      },
    }),
  ],

  callbacks: {
    // jwt is the token that we get from the provider this will run only once when the user logs in
    async jwt({ token, user }) {
      if (!token.email) return token;
      // here we are getting the user from database
      const dbUser = await prisma.user.findFirst({
        where: {
          email: token.email,
        }
      });

      if (!dbUser) {
        token.id = user!.id;
        return token;
      }

      // jwt token returning the user data with the role
      return {
        id: dbUser.id,
        name: dbUser.name,
        role: dbUser.roleId,
        email: dbUser.email,
        picture: dbUser.image,
      };
    },

    // session is the session object that we get from the jwt callback, we can get session data client side using useSession hook
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.picture = token.picture;
        session.user.role = token.role;
      }

      // we returned all the user data
      return session;
    },

    
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth
    },
  },

  // this is the secret that we use to encrypt the jwt token
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },
});


declare module "next-auth" {
  interface Session {
    accessToken?: string
  }
}
