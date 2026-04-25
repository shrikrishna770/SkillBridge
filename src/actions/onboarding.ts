"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function saveOnboardingData(data: {
  college: string;
  year: number;
  canTeach: string[];
  needHelp: string[];
  availability: any;
  language: string;
}) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return { error: "Not authenticated" };
  }

  try {
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        college: data.college,
        year: data.year,
        canTeach: data.canTeach,
        needHelp: data.needHelp,
        availability: data.availability,
        language: data.language,
        isOnboarded: true,
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Onboarding Error:", error);
    return { error: "Failed to save profile" };
  }
}
