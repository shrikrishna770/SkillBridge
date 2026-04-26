import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      isOnboarded: boolean;
      college?: string | null;
      year?: number | null;
      canTeach: string[];
      needHelp: string[];
      availability: any;
      language?: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    isOnboarded: boolean;
    college?: string | null;
    year?: number | null;
    canTeach: string[];
    needHelp: string[];
    availability: any;
    language?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    isOnboarded: boolean;
    college?: string | null;
    year?: number | null;
    canTeach: string[];
    needHelp: string[];
    availability: any;
    language?: string | null;
  }
}
