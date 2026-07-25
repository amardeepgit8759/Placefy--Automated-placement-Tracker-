"use client";

import { useAppContext } from "@/lib/AppContext";
import { motion } from "framer-motion";
import { 
  GraduationCap, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Target, 
  Zap, 
  ExternalLink,
  Code,
  Layers,
  Brain
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { clsx } from "clsx";

export default function StudyPage() {
  const { state, updateState } = useAppContext();
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "DSA", "System Design", "Core Subjects", "Aptitude"];

  const defaultStudyModules = [
    {
      id: "m1",
      category: "DSA",
      title: "Data Structures & Algorithms Foundations",
      description: "Master essential algorithms, arrays, strings, pointers, and Big-O notation.",
      duration: "4 hours",
      level: "Core",
      topics: ["Array Manipulation", "Two Pointers", "Sliding Window", "Sorting & Searching"]
    },
    {
      id: "m2",
      category: "DSA",
      title: "Advanced Data Structures & Dynamic Programming",
      description: "Deep dive into trees, graphs, heaps, memoization, and optimization patterns.",
      duration: "6 hours",
      level: "Advanced",
      topics: ["Binary Search Trees", "Graph Traversal (BFS/DFS)", "DP Patterns", "Tries"]
    },
    {
      id: "m3",
      category: "System Design",
      title: "Low-Level & High-Level System Design",
      description: "Understand scalable web architectures, microservices, databases, and caching.",
      duration: "5 hours",
      level: "Intermediate",
      topics: ["Database Indexing", "Caching Strategies (Redis)", "Load Balancing", "REST vs GraphQL"]
    },
    {
      id: "m4",
      category: "Core Subjects",
      title: "Computer Networks & Operating Systems",
      description: "Essential OS concepts (Concurrency, Memory Management) & TCP/IP protocols.",
      duration: "4 hours",
      level: "Core",
      topics: ["Process vs Thread", "Deadlocks & Mutex", "OSI Model", "HTTP/HTTPS & WebSockets"]
    },
    {
      id: "m5",
      category: "Aptitude",
      title: "Quantitative & Logical Reasoning",
      description: "Sharpen problem-solving speed for preliminary placement online assessments.",
      duration: "3 hours",
      level: "Foundation",
      topics: ["Probability & Permutations", "Speed & Distance", "Pattern Recognition", "Data Interpretation"]
    }
  ];

  const filteredModules = activeCategory === "All"
    ? defaultStudyModules
    : defaultStudyModules.filter(m => m.category === activeCategory);

  const toggleCompleted = (topicTitle: string) => {
    const isDone = state.completedTopics.includes(topicTitle);
    const updated = isDone
      ? state.completedTopics.filter(t => t !== topicTitle)
      : [...state.completedTopics, topicTitle];

    updateState({ completedTopics: updated });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            Study Center <GraduationCap className="w-7 h-7 text-indigo-400" />
          </h1>
          <p className="text-zinc-400 text-sm">
            Interactive learning modules and structured revision resources for {state.role || "Placement Candidates"}.
          </p>
        </div>

        <Link href="/assessment">
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_-5px_rgba(79,70,229,0.4)] flex items-center gap-2 text-sm">
            <Zap className="w-4 h-4 text-amber-300" /> Practice Assessment
          </button>
        </Link>
      </div>

      {/* Target Focus Banner */}
      {state.role && (
        <div className="glass-card p-6 rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-500/10 via-zinc-900/40 to-zinc-900/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600/20 rounded-xl border border-indigo-500/30">
              <Target className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Current Preparation Goal</h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Targeting <span className="text-indigo-300 font-semibold">{state.role}</span> at <span className="text-indigo-300 font-semibold">{state.targetCompany || "Top Tech Firms"}</span> ({state.level || "Intermediate"} Level)
              </p>
            </div>
          </div>
          <Link href="/syllabus">
            <button className="text-xs font-semibold text-indigo-300 hover:text-white px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg border border-indigo-500/20 transition-all flex items-center gap-1.5">
              View Syllabus <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-zinc-800/50">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={clsx(
              "px-4 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0",
              activeCategory === cat
                ? "bg-white text-black shadow-md"
                : "bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Study Modules Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" /> Curated Learning Modules ({filteredModules.length})
          </h2>
          <span className="text-xs text-zinc-500">
            {state.completedTopics.length} topics completed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredModules.map((module, i) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-6 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 hover:border-zinc-700/60 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-300 uppercase tracking-wider">
                    {module.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
                    <Clock className="w-3.5 h-3.5" /> {module.duration}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {module.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {module.description}
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Key Concepts</span>
                  <div className="flex flex-wrap gap-1.5">
                    {module.topics.map((t) => {
                      const isDone = state.completedTopics.includes(t);
                      return (
                        <button
                          key={t}
                          onClick={() => toggleCompleted(t)}
                          className={clsx(
                            "px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1.5 border",
                            isDone
                              ? "bg-indigo-900/30 border-indigo-500/40 text-indigo-200"
                              : "bg-zinc-800/50 border-zinc-700/40 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
                          )}
                        >
                          <CheckCircle2 className={clsx("w-3 h-3", isDone ? "text-indigo-400" : "text-zinc-600")} />
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-zinc-800/40 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                  Level: {module.level}
                </span>
                <Link href="/assessment">
                  <button className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                    Practice Module <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
