# Placefy - Automated Placement Tracker
## Complete Project Details

**Placefy** is an adaptive, AI-powered platform designed to guide engineering students from initial skill assessment to full placement readiness. It dynamically generates personalized syllabi, conducts mock assessments, and builds targeted daily learning roadmaps based on the user's performance.

---

## 🛠️ Technology Stack
- **Framework**: Next.js (App Router), React
- **Styling & UI**: Tailwind CSS, Framer Motion (for animations), Lucide React (for icons)
- **AI Engine**: Google Gemini API (`gemini-2.5-flash`)
- **Code Editor**: Monaco Editor (`@monaco-editor/react`)
- **State Management**: React Context API (`AppContext.tsx`) with `localStorage` persistence.

---

## 🚀 Key Features & Architecture

### 1. Onboarding & Target Setup (`/setup`)
- **Goal Configuration**: Users define their target role (Frontend, Backend, Fullstack, DSA, Data Science, etc.), their current skill level, and their preparation timeline (in weeks).
- **AI Syllabus Generation**: Based on the user's configuration, the Gemini AI generates a comprehensive, categorized syllabus containing key topics and subtopics.
- **Single Source of Truth**: The `/setup` page serves as the centralized hub for viewing the syllabus and updating placement goals.

### 2. Comprehensive Dashboard (`/`)
The dashboard is a visually distinctive, information-dense hub tracking the user's progress.
- **Radial Readiness Score**: An animated circular progress ring that visually represents the user's overall placement readiness. The ring dynamically changes color (Amber, Indigo, Emerald) based on the score tier.
- **Study Activity Heatmap**: A GitHub-style 90-day contribution graph that tracks and visualizes the user's consistency in completing daily roadmap tasks.
- **Test Schedule Reminders**: Displays urgent warning banners when a scheduled weekly or monthly mock test is due.
- **Quick Actions**: Polished, interactive cards with sliding hover animations for quick access to Assessments, Roadmaps, and Final Revisions.

### 3. AI-Powered Mock Assessments (`/assessment`)
- **Dynamic Test Generation**: Automatically generates custom mock tests containing a mix of MCQs, Coding problems, and Conceptual explanation questions based on the user's generated syllabus or specifically selected topics.
- **LeetCode-Style Code Editor**: Integrates the Monaco Code Editor for coding questions. Features include:
  - Syntax highlighting for JavaScript, Python, Java, C++, and TypeScript.
  - Automatic language-specific starter boilerplate code.
  - Dark theme (`vs-dark`) and line numbers.
- **Self-Rating Path**: Provides an alternative flow where users can self-evaluate their proficiency across 6 core domains (DSA, Core CS, Aptitude, Communication, Dev Skills, System Design) using 0-100 sliders.
- **Deep Performance Analysis**: Submissions are evaluated by the AI, generating a detailed scorecard containing the user's strengths, weaknesses, actionable insights, and an estimated company-match percentage.

### 4. Adaptive Learning Roadmap (`/roadmap`)
- **Custom 14-Day Plan**: Generates a day-by-day learning schedule tailored specifically to address the weak areas identified in the latest mock assessment.
- **Task Tracking**: Users can check off daily tasks. Checking off tasks records the completion date, which directly feeds into the Dashboard's Activity Heatmap.
- **Test Scheduling Controls**: Allows users to set a "Weekly" or "Monthly" test frequency, which automatically calculates the next due date upon completing an assessment.

### 5. Final Revision Hub (`/final`)
- **Rapid Sprint**: Designed for the last 5–7 days before a placement drive.
- **Targeted Focus**: Pulls the user's historical weaknesses and generates a compressed, high-yield revision roadmap focused on rapid recall and targeted practice rather than learning from scratch.
- **Performance Summary**: Displays visual chips highlighting the user's top strengths and critical weaknesses at a glance.

### 6. External Integrations
- **LeetCode Stats API (`/api/leetcode-stats`)**: Server-side endpoint that queries the LeetCode GraphQL API to fetch and display the user's real-time global problem-solving stats directly within their performance analysis dashboard.

---

## 🔒 State Management & Fallbacks
- **Local Persistence**: All user state (syllabus, completed tasks, readiness score, test dates) is saved in the browser's `localStorage` (`placefy_state`), ensuring no data is lost on refresh.
- **Graceful Fallbacks**: If the AI API fails, rate-limits, or if the user skips generating a syllabus, the application gracefully degrades by serving high-quality, hardcoded fallback placement questions (spanning DSA, OS, and DBMS), ensuring the user experience is never blocked.
