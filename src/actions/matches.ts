"use server";
 
 import { prisma } from "@/lib/prisma";
 import { authOptions } from "@/lib/auth";
 import { getServerSession } from "next-auth";
 
 export async function getIncomingMatches() {
   const session = await getServerSession(authOptions);
   if (!session?.user?.id) return [];
 
   // 1. Get current mentor profile to see their skills
   const mentor = await prisma.user.findUnique({
     where: { id: session.user.id }
   });
   if (!mentor) return [];
 
   // 2. Find IDs of requests this mentor has already interacted with
   const interactions = await prisma.matchSuggestion.findMany({
     where: { mentorId: session.user.id },
     select: { requestId: true }
   });
   const interactedRequestIds = interactions.map(i => i.requestId);
 
   // 3. LIVE SCAN: Find all OPEN help requests that match this mentor's skills
   const allOpenRequests = await prisma.helpRequest.findMany({
     where: { 
       status: "OPEN",
       expiresAt: { gt: new Date() },
       id: { notIn: interactedRequestIds }, // Don't show if already interacted
       userId: { not: session.user.id } // Can't mentor yourself
     },
     include: { user: true }
   });
 
   // 3. Filter and Map into suggestions
   // We convert them into a format the UI understands
   const matchingRequests = allOpenRequests.filter(req => 
     mentor.canTeach.some(skill => skill.toLowerCase() === req.topic.toLowerCase())
   );
 
   return matchingRequests.map(req => ({
     id: `live-${req.id}`, // Virtual ID
     requestId: req.id,
     mentorId: mentor.id,
     score: 95,
     status: "PENDING",
     request: req
   }));
 }
 
 export async function getMatchesForRequest(requestId: string) {
   return await prisma.matchSuggestion.findMany({
     where: { 
       requestId,
       status: { in: ["PENDING", "MENTOR_ACCEPTED"] }
     },
     include: { 
       mentor: true 
     }
   });
 }
 
 export async function respondToMatch(suggestionId: string, status: "ACCEPTED" | "DECLINED") {
   try {
     const session = await getServerSession(authOptions);
     if (!session?.user?.id) return { success: false };
 
     let finalSuggestionId = suggestionId;
 
     // Handle Virtual IDs from Live Scan
     if (suggestionId.startsWith("live-")) {
       const requestId = suggestionId.replace("live-", "");
       
       // Create the actual database record for this match
       const newSuggestion = await prisma.matchSuggestion.create({
         data: {
           requestId: requestId,
           mentorId: session.user.id,
           score: 95,
           status: status === "ACCEPTED" ? "MENTOR_ACCEPTED" : "DECLINED"
         },
         include: { request: true }
       });
       return { success: true };
     }
 
     // Normal Database ID Handling
     const suggestion = await prisma.matchSuggestion.findUnique({
       where: { id: suggestionId },
       include: { request: true }
     });
 
     if (!suggestion) return { success: false };
 
     const finalStatus = status === "ACCEPTED" ? "MENTOR_ACCEPTED" : "DECLINED";
 
     await prisma.matchSuggestion.update({
       where: { id: suggestionId },
       data: { status: finalStatus }
     });
 
     return { success: true };
   } catch (e) {
     console.error("Error responding to match:", e);
     return { success: false };
   }
 }
 
 export async function learnerAcceptMatch(suggestionId: string) {
   try {
     const suggestion = await prisma.matchSuggestion.findUnique({
       where: { id: suggestionId },
       include: { request: true }
     });
 
     if (!suggestion || suggestion.status !== "MENTOR_ACCEPTED") return { success: false };
 
     // 1. Mark request as matched
     await prisma.helpRequest.update({
       where: { id: suggestion.requestId },
       data: { status: "MATCHED" }
     });
 
     // 2. Mark this suggestion as fully ACCEPTED
     await prisma.matchSuggestion.update({
       where: { id: suggestionId },
       data: { status: "ACCEPTED" }
     });
 
     // 3. Create Session
     const durationMs = suggestion.request.duration * 60 * 1000;
     const endTime = new Date(Date.now() + durationMs);
 
     const session = await prisma.session.create({
       data: {
         requestId: suggestion.requestId,
         mentorId: suggestion.mentorId,
         learnerId: suggestion.request.userId,
         status: "ACTIVE",
         endTime: endTime
       }
     });
 
     // 4. Decline all others
     await prisma.matchSuggestion.updateMany({
       where: { 
         requestId: suggestion.requestId,
         id: { not: suggestionId }
       },
       data: { status: "DECLINED" }
     });
 
     return { success: true, sessionId: session.id };
   } catch (e) {
     return { success: false };
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
     },
     take: 10,
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
 
 export async function getMentorPendingOffers() {
   const session = await getServerSession(authOptions);
   if (!session?.user?.id) return [];
 
   return await prisma.matchSuggestion.findMany({
     where: { 
       mentorId: session.user.id,
       status: "MENTOR_ACCEPTED"
     },
     include: { 
       request: {
         include: { user: true }
       }
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
 
 export async function findMatchesForRequest(requestId: string) {
   try {
     const request = await prisma.helpRequest.findUnique({
       where: { id: requestId },
       include: { user: true }
     });
     if (!request) return;
 
     // 1. Fetch mentors who have ANY skills (we will filter for the specific one)
     // In a real production app with millions of users, we'd use a more complex query, 
     // but for this scale, fetching and filtering is highly reliable and correct.
     // RELAXED FOR TESTING: Fetch ALL mentors (even if it's yourself or not onboarded)
     const allMentors = await prisma.user.findMany();
 
     // 2. Filter mentors using case-insensitive check
     const mentors = allMentors.filter(m => 
       m.canTeach.some(skill => skill.toLowerCase() === request.topic.toLowerCase())
     ).slice(0, 5);
 
     await Promise.all(
       mentors.map(m => 
         prisma.matchSuggestion.create({
           data: {
             requestId: request.id,
             mentorId: m.id,
             score: 95.0, // Default high score for now
             status: "PENDING"
           }
         })
       )
     );
   } catch (e) {
     console.error(e);
   }
 }
