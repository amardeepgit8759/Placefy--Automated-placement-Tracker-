import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { 
      syllabus, 
      type = "quick", 
      difficulty = "Medium", 
      duration = 15, 
      topics = [] 
    } = await req.json();

    if (!syllabus) {
      return NextResponse.json({ error: "Missing syllabus" }, { status: 400 });
    }

    // Determine question count and logic based on type
    let questionCount = 5;
    let focusText = "";

    if (type === "quick") {
      questionCount = 5;
      focusText = "a quick mixed-topic readiness check";
    } else if (type === "topic") {
      questionCount = duration >= 60 ? 20 : duration >= 30 ? 12 : 8;
      focusText = `a specialized deep-dive into ${topics.join(", ")} at ${difficulty} difficulty`;
    } else if (type === "full") {
      questionCount = 20;
      focusText = "a comprehensive full mock placement simulation covering DSA, Core Subjects, and Aptitude";
    }

    const prompt = `Based on the following syllabus and context, generate exactly ${questionCount} interview questions. 
    Context: This is ${focusText}.
    
    Required Mix:
    - 60% MCQ (Multiple Choice)
    - 20% Coding (Problem solving)
    - 20% Conceptual (Explain theory)

    Return ONLY a valid JSON array of objects with the following structure exactly (no markdown wrappers):
    [
      {
        "id": "q1",
        "question": "Question text",
        "type": "mcq", // mcq, coding, conceptual
        "options": ["Option A", "Option B", "Option C", "Option D"], // Only if type is mcq
        "category": "category name"
      }
    ]

    Syllabus & Details:
    ${JSON.stringify(syllabus)}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let text = response.text || "";
    if (text.startsWith("```json")) {
      text = text.substring(7);
      if (text.endsWith("```")) text = text.slice(0, -3);
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
    return NextResponse.json({ error: "Failed to generate assessment" }, { status: 500 });
  }
}
