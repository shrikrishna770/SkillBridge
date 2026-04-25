import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export async function POST(req: Request) {
  try {
    const { topic, learnerSkills, mentorCandidates } = await req.json();

    const prompt = `
      You are the SkillBridge AI Matchmaking Engine.
      A student needs help with: "${topic}".
      Learner's skills: ${JSON.stringify(learnerSkills)}
      Potential Mentors: ${JSON.stringify(mentorCandidates)}

      Analyze the best match based on skill overlap and reputation.
      Return a JSON object with:
      - mentorId: string
      - matchReason: string
      - studyBrief: 3 key points to cover in 20 minutes.
    `;

    // Simulated matching logic if no API key
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({
        mentorId: mentorCandidates[0]?.id || "mock-id",
        matchReason: "Direct skill overlap in Data Structures.",
        studyBrief: "1. Basic concepts\n2. Implementation details\n3. Common interview questions"
      });
    }

    const message = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    });

    // Parse logic would go here
    return NextResponse.json({ result: message.content });
  } catch (error) {
    return NextResponse.json({ error: "Failed to match" }, { status: 500 });
  }
}
