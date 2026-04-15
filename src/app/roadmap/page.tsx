"use client";

import { useAppContext } from "@/lib/AppContext";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Circle, Calendar, Link as LinkIcon, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { clsx } from "clsx";

export default function RoadmapPage() {
  const { state } = useAppContext();
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  if (!state.roadmap || state.roadmap.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center opacity-50">
           <Calendar className="w-8 h-8 text-zinc-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-zinc-200">No roadmap found</h2>
          <p className="text-zinc-500 max-w-xs mx-auto text-sm">Please complete your initial assessment to unlock your personalized roadmap.</p>
        </div>
        <Link href="/assessment">
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-medium transition-colors text-sm">
            Go to Assessment
          </button>
        </Link>
      </div>
    );
  }

  const toggleTask = (taskId: string) => {
    setCompletedTasks(prev => 
      prev.includes(taskId) ? prev.filter(t => t !== taskId) : [...prev, taskId]
    );
  };

  const calculateProgress = () => {
    let total = 0;
    state.roadmap.forEach((day: any) => {
      total += day.tasks.length;
    });
    if (total === 0) return 0;
    return Math.round((completedTasks.length / total) * 100);
  };

  const progress = calculateProgress();

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500 mt-4 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
             Adaptive Roadmap <Sparkles className="w-5 h-5 text-indigo-400" />
          </h1>
          <p className="text-zinc-400 text-sm">Your targeted 14-day plan based on your performance analysis.</p>
        </div>
        <div className="glass-card px-6 py-4 rounded-2xl border border-zinc-800/50 bg-zinc-900/50 flex flex-col items-center min-w-[160px]">
           <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Total Progress</span>
           <span className="text-3xl font-bold text-indigo-400">{progress}%</span>
           <div className="w-full bg-zinc-800 rounded-full h-1 mt-3">
              <div 
                className="bg-indigo-500 h-1 rounded-full transition-all duration-500" 
                style={{ width: `${progress}%` }} 
              />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {state.roadmap.map((dayPlan: any, i: number) => (
          <motion.div
            key={dayPlan.day}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group"
          >
            <div className="glass-card p-6 rounded-2xl border border-zinc-800/50 bg-zinc-900/50 hover:border-zinc-700/50 transition-colors">
              <div className="flex items-center gap-4 mb-6 pt-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <span className="font-bold text-sm">{dayPlan.day}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{dayPlan.topic}</h3>
                  <div className="flex items-center gap-2 text-zinc-500 text-xs">
                    <Calendar className="w-3 h-3" /> Day {dayPlan.day} of 14
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {dayPlan.tasks.map((task: string, taskIdx: number) => {
                  const taskId = `day${dayPlan.day}-task${taskIdx}`;
                  const isDone = completedTasks.includes(taskId);
                  
                  return (
                    <div 
                      key={taskIdx} 
                      onClick={() => toggleTask(taskId)}
                      className={clsx(
                        "flex items-center gap-3 p-3.5 rounded-xl border transition-all cursor-pointer group/item",
                        isDone 
                          ? "bg-indigo-900/20 border-indigo-500/30 ring-1 ring-indigo-500/10" 
                          : "bg-zinc-900/80 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800"
                      )}
                    >
                      <div className="flex-shrink-0">
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-zinc-600 group-hover/item:text-zinc-500" />
                        )}
                      </div>
                      <span className={clsx(
                        "text-sm font-medium transition-all flex-1",
                        isDone ? "text-indigo-200/50 line-through" : "text-zinc-300"
                      )}>
                        {task}
                      </span>
                    </div>
                  );
                })}
              </div>

              {dayPlan.resources && dayPlan.resources.length > 0 && (
                <div className="mt-8 pt-6 border-t border-zinc-800/50 space-y-4">
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">Key Resources</span>
                  <div className="flex flex-wrap gap-2">
                    {dayPlan.resources.map((res: any, resIdx: number) => (
                      <Link 
                        key={resIdx} 
                        href="#" 
                        className="flex items-center gap-2 px-3 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white hover:border-zinc-600 transition-all"
                      >
                        <LinkIcon className="w-3 h-3 text-indigo-400" />
                        {res.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center pt-8">
        <Link href="/final">
          <button className="px-10 py-3.5 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-all flex items-center gap-2 text-sm">
            Complete Phase <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </div>
    </div>
  );
}
