import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { syllabus, analysis, days = 14, mode = "standard" } = await req.json();

    if (!syllabus || !analysis) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const numDays = typeof days === "number" && days > 0 ? days : 14;
    const isRevision = mode === "revision";

    const prompt = isRevision 
      ? `Based on the following syllabus and performance analysis, generate a high-yield, rapid revision roadmap for the final ${numDays} days leading up to placement interviews.

Target Weaknesses & Gaps:
${JSON.stringify(analysis.weaknesses || analysis.weakAreas || [])}

Full Analysis Context:
${JSON.stringify(analysis)}

Instructions for Revision Mode:
- Focus EXCLUSIVELY on the user's identified weaknesses and skill gaps.
- Frame tasks as fast, high-yield rapid revision (e.g., "Quick Review of...", "Targeted Practice on...", "Rapid Recall of...", "Key Formulas & Edge Cases").
- Do NOT frame tasks as long, fresh-learning tutorials—this candidate is in their final placement push.

Return ONLY a valid JSON object exactly in this shape (no markdown wrappers or anything else):
{
  "roadmap": [
    {
      "day": 1,
      "topic": "Rapid Revision: Topic Name",
      "tasks": ["Task 1", "Task 2"],
      "resources": [{"type": "video", "title": "Resource title"}]
    }
  ]
}
Make sure there are exactly ${numDays} objects in the roadmap array representing Day 1 to Day ${numDays}.
`
      : `Based on the following syllabus and performance analysis, generate a personalized ${numDays}-day daily study roadmap (${numDays} days). Focus heavily on the user's weaknesses and skill gaps. 

Syllabus:
${JSON.stringify(syllabus)}

Analysis:
${JSON.stringify(analysis)}

Return ONLY a valid JSON object exactly in this shape (no markdown wrappers or anything else):
{
  "roadmap": [
    {
      "day": 1,
      "topic": "Topic Name",
      "tasks": ["Task 1", "Task 2"],
      "resources": [{"type": "video", "title": "Resource title"}]
    }
  ]
}
Make sure there are exactly ${numDays} objects in the roadmap array representing Day 1 to Day ${numDays}.
`;

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
    return NextResponse.json({ error: "Failed to generate roadmap" }, { status: 500 });
  }
}
