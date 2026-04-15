import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { role, level, timelineWeeks } = await req.json();

    if (!role || !level) {
      return NextResponse.json({ error: "Missing role or level" }, { status: 400 });
    }

    const prompt = `Act as an expert placement mentor who has deep knowledge of hiring patterns across top tech companies.
A student wants to prepare for placements with the following profile:
Target Role: ${role}
Target Company: ${company}
Current Skill Level: ${level}
Preparation Time: ${timelineWeeks} weeks

Your task:
1. Evaluate the expected difficulty and hiring focus of the target company.
2. Identify what skills are most important for this company.
3. Compare the student’s level with expected requirements.
4. Identify gaps clearly.
5. Generate a structured, time-bound preparation roadmap (Weekly topics).

Return ONLY a valid JSON object with the following structure exactly (no markdown formatting, no \`\`\`json wrappers):
{
  "role": "${role}",
  "level": "${level}",
  "targetCompany": "${company}",
  "timelineWeeks": ${timelineWeeks},
  "mentorAnalysis": {
    "difficulty": "Easy/Medium/Hard",
    "focusAreas": ["area 1", "area 2"],
    "readinessEvaluation": "Evaluation text",
    "gaps": ["gap 1", "gap 2"],
    "strategy": "Company specific strategy text"
  },
  "topics": [
    {
      "title": "Topic Name",
      "description": "Brief description of the topic",
      "subtopics": ["Subtopic 1", "Subtopic 2"]
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let text = response.text || "";
    // Remove potential markdown wrappers
    if (text.startsWith("```json")) {
      text = text.substring(7);
      if (text.endsWith("```")) {
        text = text.slice(0, -3);
      }
    }
    
    try {
      const data = JSON.parse(text);
      return NextResponse.json(data);
    } catch (e) {
      console.error("Failed to parse JSON:", text);
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }
  } catch (error) {
    console.error("AI Gen Error:", error);
    return NextResponse.json({ error: "Failed to generate syllabus" }, { status: 500 });
  }
}
