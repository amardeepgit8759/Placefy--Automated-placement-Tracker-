"use client";

import { useAppContext } from "@/lib/AppContext";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Sparkles, 
  Target, 
  AlertTriangle, 
  Zap, 
  TrendingUp,
  Award
} from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";

export default function SyllabusPage() {
  const { state, updateState } = useAppContext();

  const toggleTopic = (title: string) => {
    const isCompleted = state.completedTopics.includes(title);
    const updated = isCompleted
      ? state.completedTopics.filter((t) => t !== title)
      : [...state.completedTopics, title];
    
    const score = Math.round((updated.length / state.syllabus.length) * 100) || 0;
    updateState({ completedTopics: updated, readinessScore: score });
  };

  if (!state.syllabus || state.syllabus.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center opacity-50">
           <Target className="w-8 h-8 text-zinc-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-zinc-200">No syllabus found</h2>
          <p className="text-zinc-500 max-w-xs mx-auto text-sm">Please define your journey first to generate your personalized syllabus.</p>
        </div>
        <Link href="/setup">
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-medium transition-colors text-sm">
            Go to Setup
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
             Custom Syllabus <Sparkles className="w-5 h-5 text-indigo-400" />
          </h1>
          <p className="text-zinc-400 text-sm">Personalized preparation roadmap for {state.targetCompany} · {state.role}</p>
        </div>
        <Link href="/assessment">
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_-5px_rgba(79,70,229,0.4)] flex items-center gap-2 text-sm">
            Start Mock Test <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </div>

      {/* AI Mentor Analysis Section */}
      {state.mentorAnalysis && (
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <div className="lg:col-span-2 glass-card p-8 rounded-2xl border border-indigo-500/20 bg-indigo-500/[0.02] space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Mentor Strategy</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <Target className="w-3 h-3" /> Readiness Analysis
                </h3>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {state.mentorAnalysis.readinessEvaluation}
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <Zap className="w-3 h-3" /> Execution Strategy
                </h3>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {state.mentorAnalysis.strategy}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800/50">
               <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                 <AlertTriangle className="w-3 h-3 text-amber-500" /> Identified Skill Gaps
               </h3>
               <div className="flex flex-wrap gap-2">
                  {state.mentorAnalysis.gaps.map((gap, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-medium text-amber-200">
                      {gap}
                    </span>
                  ))}
               </div>
            </div>
          </div>

          <div className="glass-card p-8 rounded-2xl border border-zinc-800/50 bg-zinc-900/50 space-y-6">
            <div className="space-y-2 text-center pb-4 border-b border-zinc-800/50">
               <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Expected Difficulty</span>
               <div className={clsx(
                 "text-2xl font-black uppercase tracking-tighter",
                 state.mentorAnalysis.difficulty === "Hard" ? "text-red-400" : 
                 state.mentorAnalysis.difficulty === "Medium" ? "text-amber-400" : "text-emerald-400"
               )}>
                 {state.mentorAnalysis.difficulty}
               </div>
            </div>

            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <Award className="w-3 h-3" /> Hiring Focus
              </h3>
              <ul className="space-y-3">
                {state.mentorAnalysis.focusAreas.map((focus, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5" />
                    <span className="text-sm text-zinc-300 leading-tight">{focus}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.section>
      )}

      {/* Syllabus Topics */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.3em] mb-6 pl-1">Curated Syllabus</h2>
        {state.syllabus.map((item, i) => {
          const isCompleted = state.completedTopics.includes(item.title);
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => toggleTopic(item.title)}
              className={clsx(
                "glass-card p-6 flex items-start gap-5 transition-all cursor-pointer group",
                isCompleted 
                  ? "bg-indigo-900/10 border-indigo-500/30 ring-1 ring-indigo-500/10" 
                  : "bg-zinc-900/50 border-zinc-800/50 hover:border-zinc-700 hover:bg-zinc-800/50"
              )}
            >
              <div className="mt-1 flex-shrink-0 transition-transform group-hover:scale-110">
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6 text-indigo-400" />
                ) : (
                  <Circle className="w-6 h-6 text-zinc-700" />
                )}
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className={clsx(
                    "text-lg font-bold transition-colors", 
                    isCompleted ? "text-indigo-200" : "text-white group-hover:text-indigo-300"
                  )}>
                    {item.title}
                  </h3>
                </div>
                <p className="text-sm text-zinc-400 max-w-2xl">{item.description}</p>
                {item.subtopics && item.subtopics.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-3">
                    {item.subtopics.map(sub => (
                      <span key={sub} className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                        {sub}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
