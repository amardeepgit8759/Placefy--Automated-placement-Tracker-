import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const FALLBACK_QUESTIONS = [
  {
    id: "q1",
    question: "Given an integer array `nums`, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
    type: "coding",
    category: "DSA (Arrays)"
  },
  {
    id: "q2",
    question: "What is the time complexity of searching an element in a balanced Binary Search Tree (BST)?",
    type: "mcq",
    options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
    category: "DSA"
  },
  {
    id: "q3",
    question: "Explain the difference between Process and Thread in Operating Systems, including memory sharing.",
    type: "conceptual",
    category: "Operating Systems"
  },
  {
    id: "q4",
    question: "Which of the following normalization forms removes partial functional dependency in DBMS?",
    type: "mcq",
    options: ["1NF", "2NF", "3NF", "BCNF"],
    category: "DBMS"
  },
  {
    id: "q5",
    question: "Write a function to reverse a linked list iteratively or recursively.",
    type: "coding",
    category: "DSA (LinkedList)"
  }
];

export async function POST(req: Request) {
  try {
    const { 
      syllabus: rawSyllabus, 
      type = "quick", 
      difficulty = "Medium", 
      duration = 15, 
      topics = [] 
    } = await req.json();

    const syllabus = rawSyllabus || "General Placement Preparation: Data Structures & Algorithms, DBMS, Operating Systems, Computer Networks, OOPS, Quantitative Aptitude";

    // Determine question count and logic based on type
    let questionCount = 5;
    let focusText = "";

    if (type === "quick") {
      questionCount = 5;
      focusText = "a quick mixed-topic readiness check";
    } else if (type === "topic") {
      questionCount = duration >= 60 ? 20 : duration >= 30 ? 12 : 8;
      focusText = `a specialized deep-dive into ${topics.length > 0 ? topics.join(", ") : "core engineering topics"} at ${difficulty} difficulty`;
    } else if (type === "full") {
      questionCount = 20;
      focusText = "a comprehensive full mock placement simulation covering DSA, Core Subjects, and Aptitude";
    }

    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY missing, serving fallback assessment questions.");
      return NextResponse.json(FALLBACK_QUESTIONS);
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
      if (Array.isArray(data) && data.length > 0) {
        return NextResponse.json(data);
      }
      return NextResponse.json(FALLBACK_QUESTIONS);
    } catch (e) {
      console.error("Failed to parse JSON:", text);
      return NextResponse.json(FALLBACK_QUESTIONS);
    }
  } catch (error) {
    console.error("AI Gen Error:", error);
    return NextResponse.json(FALLBACK_QUESTIONS);
  }
}
