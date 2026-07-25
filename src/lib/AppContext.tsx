"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

// Add types for our State
export type RoleOptions = "Frontend" | "Backend" | "Fullstack" | "DSA" | "Data Science" | "Mobile";
export type LevelOptions = "Beginner" | "Intermediate" | "Advanced";

export interface SyllabusItem {
  title: string;
  description: string;
  subtopics: string[];
}

export interface AnalysisData {
  score: number;
  level: string;
  feedback: string;
  domainScores: Record<string, number>;
  strengths: string[];
  weaknesses: string[];
  insights: string[];
  actionableSteps: string[];
  companyMatch: {
    percentage: number;
    expectedLevel: string;
    gaps: string[];
  };
}

export interface AppState {
  role: RoleOptions | null;
  level: LevelOptions | null;
  targetCompany: string | null;
  timelineWeeks: number | null;
  leetcodeUsername: string | null;
  readinessScore: number;
  mentorAnalysis: {
    difficulty: string;
    focusAreas: string[];
    readinessEvaluation: string;
    gaps: string[];
    strategy: string;
  } | null;
  latestAnalysis: AnalysisData | null;
  selfRatings: Record<string, number> | null;
  assessmentMethod: "test" | "self_rating" | null;
  syllabus: SyllabusItem[];
  completedTopics: string[];
  roadmap: any[];
  completedRoadmapTasks: string[];
  revisionPlan: any[];
  lastAssessmentDate: string | null;
  testFrequency: "weekly" | "monthly" | null;
  nextTestDueDate: string | null;
  weakAreas: string[];
  theme: "light" | "dark" | "midnight";
}

const defaultState: AppState = {
  role: null,
  level: null,
  targetCompany: null,
  timelineWeeks: 4,
  leetcodeUsername: null,
  readinessScore: 0,
  mentorAnalysis: null,
  latestAnalysis: null,
  selfRatings: null,
  assessmentMethod: null,
  syllabus: [],
  completedTopics: [],
  roadmap: [],
  completedRoadmapTasks: [],
  revisionPlan: [],
  lastAssessmentDate: null,
  testFrequency: null,
  nextTestDueDate: null,
  weakAreas: [],
  theme: "dark",
};

interface AppContextProps {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
  resetState: () => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load from LocalStorage
    const saved = localStorage.getItem("placefy_state");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState({ ...defaultState, ...parsed });
      } catch (e) {
        console.error("Failed to parse local storage state");
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("placefy_state", JSON.stringify(state));
      
      // Apply theme to document
      const root = window.document.documentElement;
      root.classList.remove("light", "dark", "midnight");
      root.classList.add(state.theme);
    }
  }, [state, isLoaded]);

  const updateState = (updates: Partial<AppState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const resetState = () => {
    setState(defaultState);
    localStorage.removeItem("placefy_state");
  };

  return (
    <AppContext.Provider value={{ state, updateState, resetState }}>
      {isLoaded ? children : null}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
