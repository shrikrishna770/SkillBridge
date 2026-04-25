"use server";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function getUserMetrics() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    select: {
      sessionsGiven: true,
      sessionsReceived: true,
      reputation: true,
      rating: true,
    }
  });

  return user;
}
