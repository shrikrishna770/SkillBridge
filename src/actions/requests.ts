"use server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { RequestUrgency } from "@prisma/client";
import { findMatchesForRequest } from "./matches";

export async function createHelpRequest(data: {
  topic: string;
  context: string;
  urgency: string;
  duration: number;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { success: false, error: "Authenticated session not found" };
  }

  // Server-side validation
  if (data.context.length > 140) {
    return { success: false, error: "Context note is too long (max 140 chars)" };
  }

  if (!data.topic || !data.context.trim()) {
    return { success: false, error: "Topic and context are required" };
  }

  try {
    // 1. Validation: Max 3 simultaneous open requests
    const openRequestsCount = await prisma.helpRequest.count({
      where: {
        userId: session.user.id,
        status: "OPEN"
      }
    });

    if (openRequestsCount >= 3) {
      return { 
        success: false, 
        error: "You can only have up to 3 active help requests at once. Please complete or cancel an existing request first." 
      };
    }

    // 2. Set Expiration (48 hours from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48);

    // 3. Create Request
    const request = await prisma.helpRequest.create({
      data: {
        userId: session.user.id,
        topic: data.topic,
        context: data.context,
        urgency: data.urgency as RequestUrgency,
        duration: data.duration,
        status: "OPEN",
        expiresAt: expiresAt
      }
    });

    // Trigger Matchmaking
    await findMatchesForRequest(request.id);

    return { success: true, requestId: request.id };
  } catch (error) {
    console.error("Error creating help request:", error);
    return { success: false, error: "Failed to post help request. Please try again." };
  }
}

export async function getMyOpenRequests() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return [];

  return await prisma.helpRequest.findMany({
    where: {
      userId: session.user.id,
      status: "OPEN"
    },
    orderBy: {
      createdAt: "desc"
    }
  });
}
