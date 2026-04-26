import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          return null;
        }

        const isValid = await compare(credentials.password, user.password);

        if (!isValid) {
          return null;
        }

        return user;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.isOnboarded = user.isOnboarded;
        token.college = user.college;
        token.year = user.year;
        token.canTeach = user.canTeach;
        token.needHelp = user.needHelp;
        token.availability = user.availability;
        token.language = user.language;
      }
      if (trigger === "update" && session) {
        // Handle partial or full updates
        if (session.isOnboarded !== undefined) token.isOnboarded = session.isOnboarded;
        if (session.college !== undefined) token.college = session.college;
        if (session.year !== undefined) token.year = session.year;
        if (session.canTeach !== undefined) token.canTeach = session.canTeach;
        if (session.needHelp !== undefined) token.needHelp = session.needHelp;
        if (session.availability !== undefined) token.availability = session.availability;
        if (session.language !== undefined) token.language = session.language;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.isOnboarded = token.isOnboarded;
        session.user.college = token.college;
        session.user.year = token.year;
        session.user.canTeach = token.canTeach;
        session.user.needHelp = token.needHelp;
        session.user.availability = token.availability;
        session.user.language = token.language;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
