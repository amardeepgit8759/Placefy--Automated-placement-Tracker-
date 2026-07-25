import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { questions, answers, role, level } = await req.json();

    if (!questions || !answers) {
      return NextResponse.json({ error: "Missing test data" }, { status: 400 });
    }

    const prompt = `You are an expert ${role} interviewer. Evaluate the performance of a ${level} candidate based on the following questions and their answers.

Questions:
${JSON.stringify(questions)}

Candidate's Answers:
${JSON.stringify(answers)}

Return ONLY a valid JSON object with the exact following structure (no markdown formatting or wrappers):
{
  "score": 85, // percentage integer 0-100 indicating readiness based on answers
  "level": "Intermediate", // Beginner, Intermediate, or Advanced
  "feedback": "Overall constructive feedback (2-3 sentences max)",
  "domainScores": {
    "DSA": 90,
    "Core Subjects": 75,
    "Aptitude": 80,
    "Development": 85
  },
  "strengths": ["Strength 1", "Strength 2"],
  "weaknesses": ["Weakness 1", "Weakness 2"],
  "insights": ["Insight 1", "Insight 2"],
  "actionableSteps": ["Step 1", "Step 2"],
  "companyMatch": {
    "percentage": 78,
    "expectedLevel": "Senior",
    "gaps": ["Gap 1", "Gap 2"]
  }
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let text = response.text || "";
    // Remove potential markdown wrappers
    if (text.startsWith("```json")) {
      text = text.substring(7);
    }
    if (text.endsWith("```")) {
      text = text.slice(0, -3);
    }
    
    text = text.trim();

    try {
      const data = JSON.parse(text);
      return NextResponse.json(data);
    } catch (e) {
      console.error("Failed to parse JSON:", text);
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }
  } catch (error) {
    console.error("AI Gen Error:", error);
    return NextResponse.json({ error: "Failed to analyze performance" }, { status: 500 });
  }
}
