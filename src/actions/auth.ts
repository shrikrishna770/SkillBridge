"use server";

import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function registerUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  if (!email || !password || !name) {
    return { error: "All fields are required" };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "User already exists" };
  }

  const hashedPassword = await hash(password, 12);

  await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  });

  return { success: true };
}
