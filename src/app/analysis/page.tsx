"use client";

import { useAppContext } from "@/lib/AppContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight, TrendingUp, AlertTriangle, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

interface AnalysisData {
  score: number;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  skillGaps: string[];
}

export default function AnalysisPage() {
  const { state, updateState } = useAppContext();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);

  useEffect(() => {
    analyzeResults();
  }, []);

  const analyzeResults = async () => {
    try {
      const dataStr = localStorage.getItem("temp_assessment_results");
      if (!dataStr) {
        throw new Error("No assessment results found");
      }
      const { questions, answers } = JSON.parse(dataStr);

      const res = await fetch("/api/analyze-performance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questions,
          answers,
          role: state.role,
          level: state.level,
        }),
      });

      if (!res.ok) throw new Error("Failed to analyze");
      
      const data = await res.json();
      setAnalysis(data);
      
      // Update global score
      updateState({ readinessScore: data.score });
      
    } catch (err) {
      console.error(err);
      alert("Failed to analyze results. Redirecting to dashboard.");
      router.push("/");
    } finally {
      setLoading(false);
      localStorage.removeItem("temp_assessment_results");
    }
  };

  const generateRoadmap = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          syllabus: state.syllabus,
          analysis,
        }),
      });
      if (!res.ok) throw new Error("Failed to generate roadmap");
      const data = await res.json();
      
      updateState({ roadmap: data.roadmap });
      router.push("/roadmap");
      
    } catch (err) {
      console.error(err);
      alert("Error generating roadmap");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
        <p className="text-zinc-400">
          {analysis ? "Generating adaptive roadmap..." : "AI is evaluating your performance..."}
        </p>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 py-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Performance Analysis</h1>
        <p className="text-zinc-400 max-w-2xl mx-auto">{analysis.feedback}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 md:col-span-3 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl font-semibold">Your Score</h2>
            <p className="text-zinc-400">Based on accuracy, depth, and logic.</p>
          </div>
          <div className="relative w-32 h-32 flex items-center justify-center rounded-full bg-indigo-500/10 border-4 border-indigo-500 shadow-[0_0_30px_-5px_rgba(79,70,229,0.5)]">
            <span className="text-4xl font-bold text-indigo-100">{analysis.score}%</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 space-y-4"
        >
          <div className="flex items-center gap-2 text-emerald-400 mb-4">
            <TrendingUp className="w-5 h-5" />
            <h3 className="font-semibold text-lg text-emerald-100">Strengths</h3>
          </div>
          <ul className="space-y-2">
            {analysis.strengths.map((str, i) => (
              <li key={i} className="text-sm text-zinc-300 flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">•</span> {str}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 space-y-4"
        >
          <div className="flex items-center gap-2 text-amber-400 mb-4">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-semibold text-lg text-amber-100">Weaknesses</h3>
          </div>
          <ul className="space-y-2">
            {analysis.weaknesses.map((wk, i) => (
              <li key={i} className="text-sm text-zinc-300 flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">•</span> {wk}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 space-y-4"
        >
          <div className="flex items-center gap-2 text-red-400 mb-4">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="font-semibold text-lg text-red-100">Skill Gaps</h3>
          </div>
          <ul className="space-y-2">
            {analysis.skillGaps.map((gap, i) => (
              <li key={i} className="text-sm text-zinc-300 flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span> {gap}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      <div className="flex justify-center pt-8">
        <button
          onClick={generateRoadmap}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-lg font-medium transition-all shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)] flex items-center justify-center gap-2"
        >
          Generate Adaptive Roadmap <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
