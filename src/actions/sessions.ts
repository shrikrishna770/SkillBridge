"use server";
 
 import { prisma } from "@/lib/prisma";
 import { authOptions } from "@/lib/auth";
 import { getServerSession } from "next-auth";
 
 const CLOUDFLARE_URL = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/`;
 const MODEL = "@cf/meta/llama-3-8b-instruct";
 
 async function runAI(prompt: string, systemMessage: string = "You are an expert educational assistant.") {
   const response = await fetch(`${CLOUDFLARE_URL}${MODEL}`, {
     method: "POST",
     headers: {
       "Authorization": `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
       "Content-Type": "application/json",
     },
     body: JSON.stringify({
       messages: [
         { role: "system", content: systemMessage },
         { role: "user", content: prompt }
       ],
     }),
   });
 
   const result = await response.json();
   return result?.result?.response || "";
 }
 
 export async function generateSessionBrief(sessionId: string) {
   try {
     const sessionDetail = await prisma.session.findUnique({
       where: { id: sessionId },
       include: {
         request: true,
         mentor: {
            include: { mentorSessions: { take: 3, where: { status: 'COMPLETED' } } }
         },
         learner: true,
       },
     });
 
     if (!sessionDetail) return { success: false };
     if (sessionDetail.aiBrief) return { success: true, brief: JSON.parse(sessionDetail.aiBrief) };
 
     // Collect mentor's past work
     const pastSummaries = (sessionDetail.mentor.mentorSessions as any[]).map(s => s.summary || "").join("\n---\n");
 
     const prompt = `
       As an AI coaching assistant for SkillBridge, generate a personalized session brief.
       
       CONTEXT:
       Topic: ${(sessionDetail.request as any).topic}
       Learner Note: "${(sessionDetail.request as any).context}"
       Mentor: ${sessionDetail.mentor.name}
       Learner: ${sessionDetail.learner.name}
       Mentor's Past Feedback Style: ${pastSummaries || "No previous history."}
       
       TASK:
       Generate a 3-point brief for BOTH parties.
       
       FOR THE MENTOR:
       1. Specific Gaps: Based on the topic and learner's note, what are they likely missing?
       2. Best Analogies: What analogies work best for explaining "${sessionDetail.request.topic}"?
       3. Discussion Prompts: 2 open-ended questions to check for understanding.
       
       FOR THE LEARNER:
       1. Ready Items: What tools, docs, or mindsets should they have ready?
       2. First Question: What specific question should they ask to break the ice?
       3. Success Criteria: What does a successful 30-minute session look like for this topic?
       
       Return ONLY valid JSON in this format:
       {
         "mentorBrief": { "gaps": "...", "analogies": "...", "prompts": ["...", "..."] },
         "learnerBrief": { "readyItems": "...", "firstQuestion": "...", "successCriteria": "..." }
       }
     `;
 
     const content = await runAI(prompt, "Respond ONLY with valid JSON.");
     const briefJson = content.match(/\{[\s\S]*\}/)?.[0] || "";
     
     await prisma.session.update({
       where: { id: sessionId },
       data: { aiBrief: briefJson } as any
     });
 
     return { success: true, brief: JSON.parse(briefJson) };
   } catch (error) {
     return { success: false };
   }
 }
 
 export async function requestMidSessionHelp(sessionId: string, query: string) {
   try {
     const sessionDetail = await prisma.session.findUnique({
       where: { id: sessionId },
       include: { request: true }
     });
 
     const prompt = `
       The mentor is stuck explaining "${sessionDetail?.request.topic}".
       USER QUERY: "${query}"
       Provide a concise, helpful analogy or alternative explanation (max 80 words).
     `;
 
     const suggestion = await runAI(prompt, "You are a senior educator helping a junior mentor.");
     return { success: true, suggestion };
   } catch (error) {
     return { success: false };
   }
 }
 
 export async function saveChatMessage(sessionId: string, senderId: string, text: string) {
   try {
     await prisma.message.create({
       data: {
         sessionId,
         senderId,
         content: text,
         createdAt: new Date(),
       }
     });
     return { success: true };
   } catch (error) {
     return { success: false };
   }
 }
 
 export async function generateSessionSummary(sessionId: string) {
   try {
     const sessionDetail = await prisma.session.findUnique({
       where: { id: sessionId },
       include: {
         request: true,
         messages: {
           orderBy: { createdAt: "asc" }
         }
       },
     });
 
     if (!sessionDetail || ((sessionDetail as any).summary && sessionDetail.status === "COMPLETED")) return { success: true };
 
     const chatTranscript = sessionDetail.messages
       .map(m => `${m.senderId === sessionDetail.mentorId ? "Mentor" : "Learner"}: ${m.content}`)
       .join("\n");
 
     const prompt = `
       Detailed Mentoring Report for: ${sessionDetail.request.topic}
       
       NOTEPAD: ${sessionDetail.notepad || "No notes."}
       CHAT: ${chatTranscript || "No messages."}
       
       FORMAT:
       1. **Concepts Explored**: Bulleted list.
       2. **Key Takeaways**: 3 specific resolutions.
       3. **Next Steps**: Advice for further learning.
       4. **Final Summary**: Professional conclusion.
     `;
 
     const summary = await runAI(prompt, "Professional educational analyst.");
 
     await prisma.session.update({
       where: { id: sessionId },
       data: { 
         summary: summary.trim(),
         status: "COMPLETED"
       } as any
     });
 
     return { success: true, summary: summary.trim() };
   } catch (error) {
     return { success: false };
   }
 }
 
 export async function updateNotepad(sessionId: string, content: string) {
   try {
     await prisma.session.update({
       where: { id: sessionId },
       data: { notepad: content }
     });
     return { success: true };
   } catch (error) {
     return { success: false };
   }
 }
