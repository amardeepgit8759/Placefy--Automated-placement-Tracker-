"use client";

import { useAppContext } from "@/lib/AppContext";
import { motion } from "framer-motion";
import { Target, Trophy, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";

export default function FinalPage() {
  const { state, resetState } = useAppContext();
  const [showConfetti, setShowConfetti] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
    
    if (state.readinessScore >= 80) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [state.readinessScore]);

  const isReady = state.readinessScore >= 80;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500 py-12 text-center">
      {showConfetti && <Confetti width={dimensions.width} height={dimensions.height} />}
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-card p-12 space-y-6 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />
        
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-indigo-500/20 rounded-full flex items-center justify-center border-4 border-indigo-500 shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)]">
            {isReady ? <Trophy className="w-12 h-12 text-indigo-400" /> : <Target className="w-12 h-12 text-indigo-400" />}
          </div>
        </div>

        <h1 className="text-4xl font-bold tracking-tight">
          {isReady ? "You are Placement Ready!" : "Keep Pushing!"}
        </h1>
        
        <p className="text-zinc-400 text-lg max-w-xl mx-auto">
          {isReady 
            ? "Your readiness score is outstanding. You have successfully identified your skill gaps and consistently improved. You're ready to ace your interviews!" 
            : "You've made great progress, but there's still room for improvement. Keep following your adaptive roadmap to boost your score before the final interviews."}
        </p>

        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto pt-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
            <p className="text-zinc-500 text-sm mb-1">Final Score</p>
            <p className="text-3xl font-bold text-white">{state.readinessScore}%</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
            <p className="text-zinc-500 text-sm mb-1">Target Role</p>
            <p className="text-xl font-bold text-white mt-1">{state.role || "N/A"}</p>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/roadmap" className="bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
            Back to Roadmap
          </Link>
          <button 
            onClick={() => {
              resetState();
              window.location.href = "/";
            }}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            Start New Journey <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
