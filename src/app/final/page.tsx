"use client";

import { useAppContext } from "@/lib/AppContext";
import { motion } from "framer-motion";
import { Target, Trophy, ArrowRight, CheckCircle, AlertCircle, Sparkles, Loader2, BookOpen, Calendar, Zap } from "lucide-react";
import Link from "next/link";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";

export default function FinalPage() {
  const { state, updateState, resetState } = useAppContext();
  const [showConfetti, setShowConfetti] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
    
    if (state.readinessScore >= 80) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [state.readinessScore]);

  const isReady = state.readinessScore >= 80;
  const strengths = state.latestAnalysis?.strengths || [];
  const weaknesses = state.latestAnalysis?.weaknesses || state.weakAreas || [];
  const revisionPlan = state.revisionPlan || [];

  const handleGenerateRevisionPlan = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          syllabus: state.syllabus,
          analysis: state.latestAnalysis || { score: state.readinessScore, weakAreas: state.weakAreas },
          days: 7,
          mode: "revision",
        }),
      });

      if (!res.ok) throw new Error("Failed to generate revision plan");
      const data = await res.json();
      updateState({ revisionPlan: data.roadmap });
    } catch (err) {
      console.error(err);
      alert("Failed to generate 7-day rapid revision plan. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500 py-10 pb-20">
      {showConfetti && <Confetti width={dimensions.width} height={dimensions.height} />}
      
      {/* Header & Score Summary Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-card p-10 md:p-12 space-y-6 relative overflow-hidden text-center"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />
        
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 bg-indigo-500/20 rounded-full flex items-center justify-center border-4 border-indigo-500 shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)]">
            {isReady ? <Trophy className="w-12 h-12 text-indigo-400" /> : <Target className="w-12 h-12 text-indigo-400" />}
          </div>
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-white">
          {isReady ? "You are Placement Ready!" : "Keep Pushing!"}
        </h1>
        
        <p className="text-zinc-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
          {isReady 
            ? "Your readiness score is outstanding. You have successfully identified your skill gaps and consistently improved. You're ready to ace your interviews!" 
            : "You've made great progress, but there's still room for improvement. Follow your rapid revision plan to boost your score before final interviews."}
        </p>

        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto pt-4">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4">
            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1">Final Score</p>
            <p className="text-3xl font-black text-indigo-400">{state.readinessScore}%</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4">
            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1">Target Role</p>
            <p className="text-lg font-bold text-white mt-1">{state.role || "N/A"}</p>
          </div>
        </div>

        {/* Strengths & Weaknesses Section */}
        {(strengths.length > 0 || weaknesses.length > 0) && (
          <div className="pt-6 border-t border-zinc-800/50 space-y-6 text-left">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest text-center">
              Strengths & Weaknesses Breakdown
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Strengths */}
              <div className="glass-card p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  <CheckCircle className="w-4 h-4" /> Demonstrated Strengths
                </div>
                <div className="flex flex-wrap gap-2">
                  {strengths.length > 0 ? (
                    strengths.map((str, i) => (
                      <span key={i} className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-200">
                        {str}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-zinc-500 italic">No specific strengths recorded</span>
                  )}
                </div>
              </div>

              {/* Weaknesses */}
              <div className="glass-card p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <AlertCircle className="w-4 h-4" /> Focus Areas & Skill Gaps
                </div>
                <div className="flex flex-wrap gap-2">
                  {weaknesses.length > 0 ? (
                    weaknesses.map((wk, i) => (
                      <span key={i} className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-200">
                        {wk}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-zinc-500 italic">No weak areas identified</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA Actions Bar */}
        <div className="pt-6 border-t border-zinc-800/50 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link href="/assessment" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" /> Take Full Mock Test
            </button>
          </Link>
          <button 
            onClick={handleGenerateRevisionPlan}
            disabled={isGenerating}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)] flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Generating Plan...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-amber-300" /> Generate 7-Day Rapid Revision Plan
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Render 7-Day Revision Plan Cards */}
      {revisionPlan.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                7-Day Rapid Revision Plan <Zap className="w-5 h-5 text-amber-400" />
              </h2>
              <p className="text-zinc-400 text-xs">High-yield revision targeted specifically at your weak areas for final preparation.</p>
            </div>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20">
              7 Days Remaining
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {revisionPlan.map((dayPlan: any, i: number) => (
              <motion.div
                key={dayPlan.day || i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="glass-card p-6 rounded-2xl border border-zinc-800/50 bg-zinc-900/50 space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800/50">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-400">
                      D{dayPlan.day}
                    </span>
                    <h3 className="font-bold text-zinc-100 text-base">{dayPlan.topic}</h3>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 bg-zinc-800 px-2.5 py-1 rounded-md">
                    Rapid Recall
                  </span>
                </div>

                {/* Task List */}
                <div className="space-y-2">
                  {dayPlan.tasks?.map((task: string, taskIdx: number) => (
                    <div key={taskIdx} className="flex items-center gap-3 p-3 rounded-xl bg-black/30 border border-zinc-800/80 text-xs text-zinc-300">
                      <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span>{task}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
        <Link href="/roadmap" className="bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-3 rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2">
          Back to Roadmap
        </Link>
        <button 
          onClick={() => {
            resetState();
            window.location.href = "/";
          }}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2"
        >
          Start New Journey <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
