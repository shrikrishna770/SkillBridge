
"use server";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export async function findMatchesForRequest(requestId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  try {
    const request = await prisma.helpRequest.findUnique({
      where: { id: requestId },
      include: { user: true },
    });

    if (!request) return { success: false, error: "Request not found" };

    // 1. Find potential mentors (users who can teach the topic and are not the requester)
    const potentialMentors = await prisma.user.findMany({
      where: {
        id: { not: request.userId },
        canTeach: { has: request.topic },
        isOnboarded: true,
      },
    });

    if (potentialMentors.length === 0) {
      return { success: true, matches: [] };
    }

    // 2. Initial scoring
    const scoredMentors = await Promise.all(
      potentialMentors.map(async (mentor) => {
        let score = 0;

        // A. Tag Overlap (40%)
        const requesterNeeds = request.user.needHelp || [];
        const mentorSkills = mentor.canTeach || [];
        const overlap = requesterNeeds.filter(tag => mentorSkills.includes(tag));
        const tagScore = requesterNeeds.length > 0 ? (overlap.length / requesterNeeds.length) : 1;
        score += tagScore * 40;

        // B. Availability Overlap (25%)
        const requesterAvail = (request.user.availability as any) || {};
        const mentorAvail = (mentor.availability as any) || {};
        let sharedSlots = 0;
        let totalRequesterSlots = 0;
        
        Object.keys(requesterAvail).forEach(day => {
          const reqSlots = requesterAvail[day] || [];
          const mentSlots = mentorAvail[day] || [];
          totalRequesterSlots += reqSlots.length;
          sharedSlots += reqSlots.filter((s: string) => mentSlots.includes(s)).length;
        });
        
        const availabilityScore = totalRequesterSlots > 0 ? (sharedSlots / totalRequesterSlots) : 0;
        score += availabilityScore * 25;

        // C. Mentor Rating (20%) - Using reputation as proxy for now
        // Normalized to 1.0 (assuming 100 reputation is 'max' for scoring purposes, or just relative)
        const ratingScore = Math.min(mentor.reputation / 100, 1);
        score += ratingScore * 20;

        // D. Session Load Balance (10%)
        const activeSessions = await prisma.session.count({
          where: { mentorId: mentor.id, status: "ACTIVE" }
        });
        const loadScore = 1 / (1 + activeSessions);
        score += loadScore * 10;

        // E. College Proximity (5%)
        const collegeScore = mentor.college === request.user.college ? 1 : 0;
        score += collegeScore * 5;

        return { mentor, score };
      })
    );

    // 3. Sort by score and take top 5
    const top5 = scoredMentors
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    // 4. Claude Re-ranking (if API key is present)
    if (process.env.ANTHROPIC_API_KEY) {
      try {
        const prompt = `
          As an AI matchmaking engine for a peer mentoring platform called SkillBridge, your task is to re-rank the top 5 mentor candidates for a specific help request.
          
          REQEST CONTEXT:
          Topic: ${request.topic}
          Context Note: "${request.context}"
          Requester Year: ${request.user.year}
          Requester College: ${request.user.college}
          
          CANDIDATES:
          ${top5.map((m, i) => `
            ID: ${m.mentor.id}
            Name: ${m.mentor.name}
            Bio/Skills: ${m.mentor.canTeach.join(", ")}
            Reputation: ${m.mentor.reputation}
            College: ${m.mentor.college}
            Calculated Score: ${m.score.toFixed(2)}
          `).join("\n")}
          
          Analyze the natural language context of the request and the candidates' backgrounds. Who is best placed to help?
          Return a JSON array of mentor IDs in order of suitability, with a brief "reasoning" for the top choice.
          Format: { "rankedIds": ["id1", "id2", ...], "reasoning": "..." }
        `;

        const response = await anthropic.messages.create({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 500,
          messages: [{ role: "user", content: prompt }],
        });

        // Parse result
        const content = response.content[0].type === 'text' ? response.content[0].text : '';
        const result = JSON.parse(content.match(/\{[\s\S]*\}/)?.[0] || "{}");
        
        if (result.rankedIds) {
          top5.sort((a, b) => result.rankedIds.indexOf(a.mentor.id) - result.rankedIds.indexOf(b.mentor.id));
        }
      } catch (e) {
        console.error("Claude re-ranking failed:", e);
      }
    }

    // 5. Store Match Suggestions
    const suggestions = await Promise.all(
      top5.map(m => 
        prisma.matchSuggestion.create({
          data: {
            requestId: request.id,
            mentorId: m.mentor.id,
            score: m.score,
            status: "PENDING",
            // reasoning: ... (optional)
          }
        })
      )
    );

    return { success: true, suggestions };
  } catch (error) {
    console.error("Matchmaking error:", error);
    return { success: false, error: "Matchmaking failed" };
  }
}

export async function getMatchesForRequest(requestId: string) {
  return await prisma.matchSuggestion.findMany({
    where: { requestId },
    include: { mentor: true },
    orderBy: { score: "desc" }
  });
}

export async function getIncomingMatches() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return [];

  return await prisma.matchSuggestion.findMany({
    where: { 
      mentorId: session.user.id,
      status: "PENDING"
    },
    include: { 
      request: {
        include: { user: true }
      }
    },
    orderBy: { score: "desc" }
  });
}

export async function respondToMatch(suggestionId: string, status: "ACCEPTED" | "DECLINED") {
  try {
    const suggestion = await prisma.matchSuggestion.findUnique({
      where: { id: suggestionId },
      include: { request: true }
    });

    if (!suggestion) return { success: false, error: "Match not found" };

    const update = await prisma.matchSuggestion.update({
      where: { id: suggestionId },
      data: { status }
    });

    if (status === "ACCEPTED") {
      // Create session and mark request as matched
      await prisma.helpRequest.update({
        where: { id: suggestion.requestId },
        data: { status: "MATCHED" }
      });

      // Calculate End Time
      const durationMs = suggestion.request.duration * 60 * 1000;
      const endTime = new Date(Date.now() + durationMs);

      // Create the Actual Session
      await prisma.session.create({
        data: {
          requestId: suggestion.requestId,
          mentorId: suggestion.mentorId,
          learnerId: suggestion.request.userId,
          status: "ACTIVE",
          endTime: endTime
        }
      });
      
      // Decline all other suggestions for this request
      await prisma.matchSuggestion.updateMany({
        where: { 
          requestId: suggestion.requestId,
          id: { not: suggestionId }
        },
        data: { status: "DECLINED" }
      });
    }

    return { success: true };
  } catch (e) {
    return { success: false, error: "Failed to respond to match" };
  }
}

export async function getActiveSessions() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return [];

  return await prisma.session.findMany({
    where: {
      OR: [
        { mentorId: session.user.id },
        { learnerId: session.user.id }
      ],
      status: "ACTIVE"
    },
    include: {
      request: true,
      mentor: true,
      learner: true
    },
    orderBy: {
      startTime: "desc"
    }
  });
}

export async function getSessionDetails(sessionId: string) {
  return await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      request: true,
      mentor: true,
      learner: true
    }
  });
}
