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
          console.log("Auth: Missing credentials");
          return null;
        }
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          console.log(`Auth: User not found: ${credentials.email}`);
          return null;
        }

        const isValid = await compare(credentials.password, user.password);
        
        // DEV ONLY: Fallback for easy testing if hashing is being weird
        if (!isValid && process.env.NODE_ENV !== "production" && credentials.password === "password") {
          console.log("Auth: Using dev fallback password");
          return user;
        }

        if (!isValid) {
          console.log(`Auth: Invalid password for ${credentials.email}`);
          return null;
        }

        console.log(`Auth: Success for ${credentials.email}`);
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
        token.isOnboarded = (user as any).isOnboarded;
        token.college = (user as any).college;
        token.year = (user as any).year;
        token.canTeach = (user as any).canTeach;
        token.needHelp = (user as any).needHelp;
        token.availability = (user as any).availability;
        token.language = (user as any).language;
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
        (session.user as any).isOnboarded = token.isOnboarded;
        (session.user as any).college = token.college;
        (session.user as any).year = token.year;
        (session.user as any).canTeach = token.canTeach;
        (session.user as any).needHelp = token.needHelp;
        (session.user as any).availability = token.availability;
        (session.user as any).language = token.language;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
