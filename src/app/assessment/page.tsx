"use client";

import { useAppContext } from "@/lib/AppContext";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Loader2, 
  ArrowRight, 
  Target, 
  Clock, 
  Trophy, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  BookOpen, 
  Zap, 
  ListChecks,
  Circle,
  X
} from "lucide-react";
import { clsx } from "clsx";

type PageState = "IDLE" | "LOADING" | "TESTING" | "RESULTS";
type AssessmentType = "quick" | "topic" | "full";

const TOPICS_LIST = [
  "Arrays", "Strings", "Recursion", "DBMS", "OS", "CN", "OOPS", "Aptitude", "System Design"
];

export default function AssessmentPage() {
  const { state, updateState } = useAppContext();
  
  // Page Flow State
  const [pageState, setPageState] = useState<PageState>("IDLE");
  const [activeTab, setActiveTab] = useState<AssessmentType>("quick");
  
  // Test Config State
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState("Medium");
  const [duration, setDuration] = useState(30);
  
  // Actual Test State
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Results State
  const [results, setResults] = useState<any>(null);

  const startAssessment = async (type: AssessmentType) => {
    setPageState("LOADING");
    try {
      const res = await fetch("/api/generate-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          syllabus: state.syllabus,
          type,
          difficulty,
          duration,
          topics: type === "topic" ? selectedTopics : []
        }),
      });
      
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setQuestions(data);
      setCurrentIdx(0);
      setAnswers({});
      setPageState("TESTING");
    } catch (err) {
      console.error(err);
      alert("Failed to generate assessment. Please try again.");
      setPageState("IDLE");
    }
  };

  const handleAnswer = (answer: string) => {
    const q = questions[currentIdx];
    setAnswers({ ...answers, [q.id]: answer });
  };

  const submitTest = async () => {
    setIsSubmitting(true);
    try {
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

      if (!res.ok) throw new Error("Failed");
      const analysisData = await res.json();
      
      setResults(analysisData);
      
      // Update global state
      updateState({ 
        readinessScore: analysisData.score,
        lastAssessmentDate: new Date().toLocaleDateString(),
        weakAreas: analysisData.weaknesses || []
      });
      
      setPageState("RESULTS");
    } catch (err) {
      console.error(err);
      alert("Error analyzing results.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateRoadmap = async () => {
    setPageState("LOADING");
    try {
      const res = await fetch("/api/generate-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          syllabus: state.syllabus,
          analysis: results,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      updateState({ roadmap: data.roadmap });
      window.location.href = "/roadmap";
    } catch (err) {
      console.error(err);
      alert("Failed to update roadmap.");
      setPageState("RESULTS");
    }
  };

  // --- Render Functions ---

  const renderDashboard = () => (
    <div className="space-y-10">
      {/* Dashboard Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-zinc-800/50 bg-zinc-900/50 flex flex-col items-center text-center">
           <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Readiness Score</span>
           <span className="text-3xl font-black text-indigo-400">{state.readinessScore}%</span>
           <div className="w-full bg-zinc-800 h-1 mt-3 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full transition-all" style={{ width: `${state.readinessScore}%` }} />
           </div>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-zinc-800/50 bg-zinc-900/50 flex flex-col items-center text-center justify-center">
           <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Last Test</span>
           <span className="text-sm font-semibold text-zinc-200">{state.lastAssessmentDate || "Not taken yet"}</span>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-zinc-800/50 bg-zinc-900/50 flex flex-col items-center text-center md:col-span-2">
           <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Weak Areas</span>
           <div className="flex flex-wrap justify-center gap-1.5">
              {state.weakAreas?.length > 0 ? (
                state.weakAreas.slice(0, 3).map(area => (
                  <span key={area} className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-200 font-bold">
                    {area}
                  </span>
                ))
              ) : (
                <span className="text-xs text-zinc-600 italic">No data available</span>
              )}
           </div>
        </div>
      </div>

      {/* Tabs Container */}
      <div className="glass-card border border-zinc-800/50 bg-zinc-900/30 rounded-3xl overflow-hidden p-2">
         <div className="flex p-2 bg-black/20 rounded-2xl gap-2">
            {(["quick", "topic", "full"] as AssessmentType[]).map(t => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={clsx(
                  "flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                  activeTab === t ? "bg-white text-black shadow-lg" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                {t === "quick" ? "Quick Check" : t === "topic" ? "Topic Based" : "Full Mock"}
              </button>
            ))}
         </div>

         <div className="p-8">
            <AnimatePresence mode="wait">
              {activeTab === "quick" && (
                <motion.div 
                  key="quick" 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6 flex flex-col items-center text-center"
                >
                  <div className="p-4 rounded-full bg-indigo-500/10 mb-2">
                    <Zap className="w-8 h-8 text-indigo-400" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white">Evaluate your current level quickly</h2>
                    <p className="text-zinc-500 text-sm max-w-sm">A 5-question blitz covering core concepts to track your daily progress.</p>
                  </div>
                  <div className="flex items-center gap-6 text-zinc-400 text-xs font-bold uppercase tracking-widest pt-4">
                     <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-indigo-400" /> 10-15 Mins
                     </span>
                     <span className="flex items-center gap-2">
                        <ListChecks className="w-4 h-4 text-indigo-400" /> 5 Questions
                     </span>
                  </div>
                  <button 
                    onClick={() => startAssessment("quick")}
                    className="mt-6 px-10 py-4 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-all flex items-center gap-2"
                  >
                    Start Quick Check <ArrowRight className="w-5 h-5" />
                  </button>
                </motion.div>
              )}

              {activeTab === "topic" && (
                <motion.div 
                  key="topic" 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {/* Topic Selector */}
                     <div className="space-y-4">
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Select Focus Topics</h3>
                        <div className="grid grid-cols-2 gap-2">
                           {TOPICS_LIST.map(topic => (
                             <button
                                key={topic}
                                onClick={() => setSelectedTopics(prev => 
                                  prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
                                )}
                                className={clsx(
                                  "p-2.5 rounded-lg border text-[10px] font-bold uppercase transition-all",
                                  selectedTopics.includes(topic)
                                    ? "bg-indigo-600 border-indigo-500 text-white"
                                    : "bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                                )}
                             >
                               {topic}
                             </button>
                           ))}
                        </div>
                     </div>

                     {/* Other Config */}
                     <div className="space-y-6">
                        <div className="space-y-3">
                           <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Difficulty</h3>
                           <div className="flex bg-zinc-900/50 p-1 rounded-xl border border-zinc-800">
                              {["Easy", "Medium", "Hard"].map(d => (
                                <button
                                  key={d}
                                  onClick={() => setDifficulty(d)}
                                  className={clsx(
                                    "flex-1 py-2 rounded-lg text-xs font-bold transition-all",
                                    difficulty === d ? "bg-zinc-800 text-white" : "text-zinc-600"
                                  )}
                                >
                                  {d}
                                </button>
                              ))}
                           </div>
                        </div>

                        <div className="space-y-3">
                           <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Duration</h3>
                           <div className="flex bg-zinc-900/50 p-1 rounded-xl border border-zinc-800">
                              {[15, 30, 60].map(m => (
                                <button
                                  key={m}
                                  onClick={() => setDuration(m)}
                                  className={clsx(
                                    "flex-1 py-12 px-2 rounded-lg text-xs font-bold transition-all h-10 flex items-center justify-center",
                                    duration === m ? "bg-zinc-800 text-white" : "text-zinc-600"
                                  )}
                                >
                                  {m}m
                                </button>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="flex justify-center pt-4">
                     <button 
                        disabled={selectedTopics.length === 0}
                        onClick={() => startAssessment("topic")}
                        className="px-12 py-4 rounded-2xl bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold hover:bg-indigo-500 transition-all flex items-center gap-2"
                      >
                        Start Topic Assessment <ArrowRight className="w-5 h-5" />
                      </button>
                  </div>
                </motion.div>
              )}

              {activeTab === "full" && (
                <motion.div 
                  key="full" 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6 flex flex-col items-center text-center"
                >
                  <div className="p-4 rounded-full bg-emerald-500/10 mb-2">
                    <Trophy className="w-8 h-8 text-emerald-400" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white">Full Placement Simulation</h2>
                    <p className="text-zinc-500 text-sm max-w-sm">A rigorous 20-question comprehensive test simulating real hiring patterns of top tech firms.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-lg mt-6">
                     {["DSA", "Core Subjects", "Aptitude"].map(sec => (
                       <div key={sec} className="bg-zinc-800/30 border border-zinc-700/30 py-4 px-3 rounded-2xl text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                          {sec}
                       </div>
                     ))}
                  </div>
                  <button 
                    onClick={() => startAssessment("full")}
                    className="mt-8 px-12 py-4 rounded-2xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-all flex items-center gap-2"
                  >
                    Start Mock Test <ArrowRight className="w-5 h-5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
         </div>
      </div>
    </div>
  );

  const renderTesting = () => {
    const q = questions[currentIdx];
    const isAnswered = !!answers[q.id];

    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
             <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-[0.2em]">Question {currentIdx + 1} of {questions.length}</h2>
             <div className="text-xs font-semibold text-indigo-400 flex items-center gap-2">
                {q.category} <Circle className="w-1 h-1 fill-current" /> {q.type}
             </div>
          </div>
          <div className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 font-mono text-sm tracking-widest">
             00:00:00
          </div>
        </div>

        {/* Progress */}
        <div className="w-full bg-zinc-800/50 rounded-full h-1.5 overflow-hidden">
          <motion.div 
            className="bg-indigo-500 h-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
          />
        </div>

        <motion.div key={currentIdx} className="glass-card p-10 space-y-8 min-h-[400px]">
           <h3 className="text-2xl font-bold text-white leading-relaxed">{q.question}</h3>
           
           {q.type === "mcq" && q.options && (
            <div className="grid grid-cols-1 gap-3 pt-4">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt)}
                  className={clsx(
                    "w-full text-left px-6 py-4 rounded-2xl border transition-all duration-200 font-medium group flex items-center justify-between",
                    answers[q.id] === opt
                      ? "border-indigo-500 bg-indigo-500/10 text-white"
                      : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-800 text-zinc-400"
                  )}
                >
                  <span>{opt}</span>
                  {answers[q.id] === opt ? <CheckCircle2 className="w-5 h-5 text-indigo-400" /> : <div className="w-5 h-5 rounded-full border-2 border-zinc-800 group-hover:border-zinc-700" />}
                </button>
              ))}
            </div>
          )}

          {(q.type === "coding" || q.type === "conceptual") && (
            <div className="pt-4">
              <textarea
                className="w-full h-64 bg-black/40 border border-zinc-800 rounded-2xl p-6 font-mono text-sm text-zinc-300 focus:outline-none focus:border-indigo-500 transition-colors resize-none placeholder:text-zinc-700"
                placeholder={q.type === "coding" ? "// Write your logic here..." : "Type your detailed explanation..."}
                value={answers[q.id] || ""}
                onChange={(e) => handleAnswer(e.target.value)}
              />
            </div>
          )}
        </motion.div>

        <div className="flex justify-between items-center">
           <button 
             disabled={currentIdx === 0}
             onClick={() => setCurrentIdx(prev => prev - 1)}
             className="text-zinc-500 font-bold text-xs uppercase tracking-widest disabled:opacity-20 flex items-center gap-2 hover:text-white transition-colors"
           >
             Previous
           </button>
           
           {currentIdx < questions.length - 1 ? (
             <button
               onClick={() => setCurrentIdx(prev => prev + 1)}
               disabled={!isAnswered}
               className="bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-white px-10 py-3.5 rounded-xl font-bold transition-all flex items-center gap-2 text-sm"
             >
               Next Question <ArrowRight className="w-4 h-4" />
             </button>
           ) : (
             <button
               onClick={submitTest}
               disabled={!isAnswered || isSubmitting}
               className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-12 py-3.5 rounded-xl font-bold transition-all flex items-center gap-2 text-sm shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)]"
             >
               {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Finish Assessment <Target className="w-4 h-4" /></>}
             </button>
           )}
        </div>
      </div>
    );
  };

  const renderResults = () => {
    if (!results) return null;
    return (
      <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500 py-4">
         <div className="text-center space-y-2">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.4em]">Assessment Complete</span>
            <h1 className="text-4xl font-black text-white">Your Results</h1>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 glass-card p-10 rounded-[2.5rem] border border-zinc-800/50 bg-zinc-900/10 space-y-8">
                <div className="flex items-center justify-between gap-8 pb-8 border-b border-zinc-800/50">
                   <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-white">Placement Readiness</h2>
                      <p className="text-zinc-500 text-sm leading-relaxed">{results.feedback}</p>
                   </div>
                   <div className="flex-shrink-0 relative w-32 h-32 flex items-center justify-center rounded-full bg-indigo-500/10 border-4 border-indigo-500/50 shadow-[0_0_50px_-10px_rgba(79,70,229,0.5)]">
                      <span className="text-4xl font-black text-white">{results.score}%</span>
                   </div>
                </div>

                <div className="space-y-6">
                   <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1 flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500" /> Weak Areas Highlighted
                   </h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {(results.weaknesses || []).map((wk: string, i: number) => (
                        <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                           <div className="w-2 h-2 rounded-full bg-amber-500" />
                           <span className="text-sm font-semibold text-amber-200/80">{wk}</span>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="pt-4">
                   <button 
                     onClick={updateRoadmap}
                     className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-widest"
                   >
                     Update Roadmap <ArrowRight className="w-4 h-4" />
                   </button>
                </div>
            </div>

            <div className="space-y-6">
               <div className="glass-card p-8 rounded-3xl border border-zinc-800/50 bg-zinc-900/50 space-y-6">
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest text-center">Score Breakdown</h3>
                  <div className="space-y-4">
                     {[
                       { label: "DSA", value: Math.max(30, results.score - 5) },
                       { label: "Core Subjects", value: Math.max(20, results.score - 15) },
                       { label: "Aptitude", value: Math.max(40, results.score + 5) }
                     ].map(item => (
                       <div key={item.label} className="space-y-2">
                          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                             <span>{item.label}</span>
                             <span>{item.value}%</span>
                          </div>
                          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                             <div className="bg-indigo-500/80 h-full" style={{ width: `${item.value}%` }} />
                          </div>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="glass-card p-8 rounded-3xl border border-zinc-100/5 bg-white/[0.02] space-y-4">
                  <div className="flex items-center gap-3">
                     <Zap className="w-4 h-4 text-amber-400" />
                     <h3 className="text-sm font-bold text-white tracking-tight">Smart Suggestion</h3>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed italic border-l-2 border-indigo-500/50 pl-3">
                    "Focus more on {results.weaknesses?.[0] || 'Core Subject'} concepts today. Your score in {results.strengths?.[0] || 'DSA'} shows strong fundamentals."
                  </p>
               </div>
            </div>
         </div>
      </div>
    );
  };

  return (
    <div className="py-2">
      <AnimatePresence mode="wait">
        {pageState === "IDLE" && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {renderDashboard()}
          </motion.div>
        )}

        {pageState === "LOADING" && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-40 space-y-6">
             <div className="relative">
                <Loader2 className="w-16 h-16 animate-spin text-indigo-500" />
                <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 -z-10 animate-pulse" />
             </div>
             <p className="text-zinc-500 text-sm font-bold uppercase tracking-[0.3em] animate-pulse">Initializing AI Assessment...</p>
          </motion.div>
        )}

        {pageState === "TESTING" && (
          <motion.div key="testing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
             {renderTesting()}
          </motion.div>
        )}

        {pageState === "RESULTS" && (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
             {renderResults()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

