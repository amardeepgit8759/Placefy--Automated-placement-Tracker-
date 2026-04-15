"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Target, Trophy, Clock } from "lucide-react";
import { LevelOptions, RoleOptions, useAppContext } from "@/lib/AppContext";
import { clsx } from "clsx";
import CompanySearch from "@/components/CompanySearch";

const ROLES: RoleOptions[] = ["Frontend", "Backend", "Fullstack", "DSA", "Data Science", "Mobile"];
const LEVELS: LevelOptions[] = ["Beginner", "Intermediate", "Advanced"];

export default function SetupPage() {
  const router = useRouter();
  const { updateState } = useAppContext();

  const [role, setRole] = useState<RoleOptions | null>(null);
  const [level, setLevel] = useState<LevelOptions | null>(null);
  const [company, setCompany] = useState<string | null>(null);
  const [timeline, setTimeline] = useState<number>(4);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!role || !level || !company) return;

    setIsGenerating(true);
    
    try {
      const res = await fetch("/api/generate-syllabus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, level, targetCompany: company, timelineWeeks: timeline }),
      });

      if (!res.ok) throw new Error("Failed to generate syllabus");

      const data = await res.json();
      
      updateState({
        role,
        level,
        targetCompany: company,
        timelineWeeks: timeline,
        syllabus: data.topics,
        mentorAnalysis: data.mentorAnalysis,
        readinessScore: 0,
        completedTopics: []
      });

      router.push("/syllabus");
    } catch (err) {
      console.error(err);
      alert("Error generating syllabus. Check console.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500 mt-8">
      <div className="space-y-3 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white">Define Your Path</h1>
        <p className="text-zinc-400 text-sm">Tell us about your goals so AI can craft your personalized syllabus.</p>
      </div>

      <div className="glass-card p-6 md:p-8 space-y-8 rounded-2xl border border-zinc-800/50 bg-zinc-900/50">
        
        {/* Role Selection */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-zinc-400" />
            <h2 className="text-sm font-medium text-zinc-300">Target Role</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {ROLES.map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={clsx(
                  "p-3 rounded-lg border transition-all text-sm font-medium",
                  role === r
                    ? "border-indigo-500 bg-indigo-600 text-white"
                    : "border-zinc-800 bg-zinc-900/80 hover:border-zinc-700 text-zinc-300"
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </section>

        {/* Company Selection */}
        <section className="space-y-4">
          <CompanySearch value={company} onChange={setCompany} />
        </section>

        {/* Level Selection */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-zinc-400" />
            <h2 className="text-sm font-medium text-zinc-300">Skill Level</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {LEVELS.map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={clsx(
                  "p-3 rounded-lg border transition-all text-sm font-medium",
                  level === l
                    ? "border-indigo-500 bg-indigo-600 text-white"
                    : "border-zinc-800 bg-zinc-900/80 hover:border-zinc-700 text-zinc-300"
                )}
              >
                {l}
              </button>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-zinc-400" />
            <h2 className="text-sm font-medium text-zinc-300">Preparation Timeline</h2>
          </div>
          <div className="relative">
             <select
                value={timeline}
                onChange={(e) => setTimeline(Number(e.target.value))}
                className="w-full appearance-none bg-zinc-900 border border-zinc-800 text-white text-sm font-medium rounded-lg p-3 outline-none focus:border-indigo-500 transition-colors"
              >
                <option value={1}>1 week</option>
                <option value={2}>2 weeks</option>
                <option value={3}>3 weeks</option>
                <option value={4}>4 weeks</option>
                <option value={6}>6 weeks</option>
                <option value={8}>8 weeks</option>
                <option value={12}>12 weeks</option>
             </select>
          </div>
        </section>

        <div className="pt-4">
          <button
            onClick={handleGenerate}
            disabled={!role || !level || !company || isGenerating}
            className="w-full bg-white hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed text-black px-8 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 text-sm"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                Generating Syllabus...
              </>
            ) : (
              <>
                 ✨ Generate Syllabus
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
