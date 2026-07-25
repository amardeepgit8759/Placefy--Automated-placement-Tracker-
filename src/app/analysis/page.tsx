"use client";

import { useAppContext } from "@/lib/AppContext";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  Loader2, 
  ArrowRight, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Zap, 
  Activity,
  Award,
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  MousePointerClick,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";

interface AnalysisData {
  score: number;
  level: string;
  feedback: string;
  domainScores: {
    [key: string]: number;
  };
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

// Mock data for fallback/demo
const MOCK_DATA: AnalysisData = {
  score: 72,
  level: "Intermediate",
  feedback: "You have a strong grasp of core React concepts and JavaScript fundamentals. However, your performance in complex data structures and system design needs more focus to reach the 'Advanced' level expected for top-tier roles.",
  domainScores: {
    "DSA": 65,
    "Core Subjects": 82,
    "Aptitude": 78,
    "Development": 88
  },
  strengths: ["Clean Code Practices", "React State Management", "Logical Reasoning"],
  weaknesses: ["Dynamic Programming", "Operating Systems", "Low-level System Design"],
  insights: ["Development skills are exceptional", "Core subjects score is trending up", "Aptitude is consistent but has room for growth"],
  actionableSteps: [
    "Focus on Hard-level DP problems on LeetCode",
    "Review SQL optimization techniques",
    "Build a project focusing on WebSockets for real-time skills"
  ],
  companyMatch: {
    percentage: 65,
    expectedLevel: "SDE-1",
    gaps: ["Advanced DSA", "System Design Patterns"]
  }
};

const HISTORY_DATA = [
  { name: 'Test 1', score: 45 },
  { name: 'Test 2', score: 52 },
  { name: 'Test 3', score: 61 },
  { name: 'Test 4', score: 58 },
  { name: 'Test 5', score: 72 },
];

export default function AnalysisPage() {
  const { state, updateState } = useAppContext();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    analyzeResults();
  }, []);

  const analyzeResults = async () => {
    setLoading(true);
    try {
      // 1. Check if global AppContext already has real analysis data
      if (state.latestAnalysis) {
        setAnalysis(state.latestAnalysis);
        setIsDemo(false);
        setLoading(false);
        return;
      }

      // 2. Check if temp results exist in localStorage from an assessment run
      const dataStr = localStorage.getItem("temp_assessment_results");
      if (dataStr) {
        const { questions, answers } = JSON.parse(dataStr);
        const res = await fetch("/api/analyze-performance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            questions,
            answers,
            role: state.role || "Software Engineer",
            level: state.level || "Intermediate",
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setAnalysis(data);
          updateState({ readinessScore: data.score, latestAnalysis: data });
          setIsDemo(false);
          setLoading(false);
          return;
        }
      }

      // 3. Fallback to demo preview data if no assessment exists yet
      setAnalysis(MOCK_DATA);
      setIsDemo(true);
    } catch (err) {
      console.error(err);
      setAnalysis(MOCK_DATA);
      setIsDemo(true);
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
      alert("Error generating roadmap. Using default configuration.");
      setLoading(false);
    }
  };

  const domainData = useMemo(() => {
    if (!analysis) return [];
    return Object.entries(analysis.domainScores).map(([name, value]) => ({
      name,
      value,
      fullMark: 100
    }));
  }, [analysis]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6">
        <div className="relative">
          <Loader2 className="w-16 h-16 animate-spin text-indigo-500 opacity-20" />
          <Loader2 className="w-16 h-16 animate-spin text-indigo-400 absolute inset-0 [animation-delay:-0.5s]" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-medium text-indigo-100/80">AI Analysis in Progress</h2>
          <p className="text-zinc-500 animate-pulse">Calculating readiness patterns and skill gaps...</p>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 pb-20">
      {/* Header Section */}
      <AnimatePresence mode="wait">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-400 text-sm font-medium tracking-wider uppercase">
              <Activity className="w-4 h-4" />
              Performance Analytics
            </div>
            <h1 className="text-4xl font-bold text-zinc-100">Intelligent Insights</h1>
            {isDemo && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium mt-1">
                <AlertCircle className="w-3.5 h-3.5" /> Sample Preview Data (No Assessment Taken Yet)
              </span>
            )}
          </div>
          <p className="text-zinc-400 max-w-xl md:text-right text-sm leading-relaxed">
            {analysis.feedback}
          </p>
        </motion.div>
      </AnimatePresence>

      {isDemo && (
        <div className="glass-card p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <p className="text-xs text-amber-200/90">
              You are currently viewing <strong>Sample Benchmark Data</strong>. Take a mock test to calculate your real readiness score and personalized insights.
            </p>
          </div>
          <button
            onClick={() => router.push("/assessment")}
            className="flex-shrink-0 text-xs font-bold bg-amber-500 text-black px-4 py-2 rounded-lg hover:bg-amber-400 transition-colors"
          >
            Take Assessment Now
          </button>
        </div>
      )}

      {/* Top Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Readiness Score", value: `${analysis.score}%`, sub: "Overall Fit", icon: Target, color: "text-indigo-400", bg: "bg-indigo-400/10" },
          { label: "Current Level", value: analysis.level, sub: "Based on answers", icon: Award, color: "text-emerald-400", bg: "bg-emerald-400/10" },
          { label: "Target Match", value: `${analysis.companyMatch.percentage}%`, sub: "Vs Requirements", icon: Zap, color: "text-amber-400", bg: "bg-amber-400/10" },
          { label: "Consistency Score", value: "84%", sub: "Last 7 days", icon: Activity, color: "text-rose-400", bg: "bg-rose-400/10" },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-5 relative overflow-hidden group hover:border-zinc-700 transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg ${card.bg}`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <div className="flex items-center gap-1 text-emerald-500 text-xs font-medium">
                <TrendingUp className="w-3 h-3" /> +2.4%
              </div>
            </div>
            <div className="space-y-0.5">
              <div className="text-2xl font-bold text-zinc-100 tracking-tight tracking-tight">{card.value}</div>
              <div className="text-xs text-zinc-500 font-medium uppercase tracking-wider">{card.label}</div>
            </div>
            <div className="absolute -right-2 -bottom-2 opacity-5 scale-150 rotate-12 group-hover:scale-125 transition-transform duration-500">
              <card.icon className={`w-24 h-24 ${card.color}`} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Breakdown - Radar Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 lg:col-span-1 min-h-[400px] flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-zinc-200 flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-400" />
              Domain Proficiency
            </h3>
          </div>
          <div className="flex-1 w-full h-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={domainData}>
                <PolarGrid stroke="#27272A" />
                <PolarAngleAxis dataKey="name" tick={{ fill: '#71717A', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Proficiency"
                  dataKey="value"
                  stroke="#6366F1"
                  fill="#6366F1"
                  fillOpacity={0.3}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181B', border: '1px solid #27272A', borderRadius: '8px' }}
                  itemStyle={{ color: '#FAFAFA' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Progress Tracking - Area Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6 lg:col-span-2 flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-zinc-200 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Learning Curve
              </h3>
              <p className="text-xs text-zinc-500 mt-1">Snapshot of your test performance over time</p>
            </div>
            <div className="flex gap-2">
              <button className="text-[10px] uppercase font-bold tracking-widest px-2 py-1 bg-white/5 rounded border border-white/10 text-zinc-400 hover:bg-white/10 transition-colors">7D</button>
              <button className="text-[10px] uppercase font-bold tracking-widest px-2 py-1 bg-indigo-500/10 rounded border border-indigo-500/20 text-indigo-400">30D</button>
            </div>
          </div>
          <div className="flex-1 w-full h-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HISTORY_DATA}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#18181B" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#52525B', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#52525B', fontSize: 12 }} 
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181B', border: '1px solid #27272A', borderRadius: '8px' }}
                  itemStyle={{ color: '#FAFAFA' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#6366F1" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorScore)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths & Weaknesses */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-6 divide-y divide-zinc-800/50"
        >
          <div className="pb-6">
            <h3 className="text-zinc-200 font-semibold mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Core Strengths
            </h3>
            <div className="flex flex-wrap gap-2">
              {analysis.strengths.map((s, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full bg-emerald-400/5 border border-emerald-400/10 text-emerald-400 text-xs font-medium">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className="pt-6">
            <h3 className="text-zinc-200 font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              Areas of Improvement
            </h3>
            <div className="flex flex-wrap gap-2">
              {analysis.weaknesses.map((w, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full bg-rose-400/5 border border-rose-400/10 text-rose-400 text-xs font-medium">
                  {w}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Company Match Analysis */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-6"
        >
          <h3 className="text-zinc-200 font-semibold mb-6 flex items-center gap-2">
            <Target className="w-4 h-4 text-amber-400" />
            Company Alignment
          </h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs text-zinc-400 uppercase tracking-wider font-bold">Requirement Benchmark</span>
                <span className="text-lg font-bold text-zinc-100">{analysis.companyMatch.percentage}% Match</span>
              </div>
              <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${analysis.companyMatch.percentage}%` }}
                  transition={{ duration: 1, delay: 1 }}
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-300 shadow-[0_0_15px_-3px_rgba(245,158,11,0.5)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Target Grade</div>
                <div className="text-zinc-200 font-semibold">{analysis.companyMatch.expectedLevel}</div>
              </div>
              <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Critical Skill Gaps</div>
                <div className="text-zinc-200 font-semibold">{analysis.companyMatch.gaps.length} Identified</div>
              </div>
            </div>

            <div className="bg-amber-500/5 border border-amber-500/10 rounded-lg p-4">
              <p className="text-xs text-amber-500/90 italic leading-relaxed">
                "To bridge the {analysis.companyMatch.percentage}% to 90% gap, prioritize focus on your {analysis.companyMatch.gaps[0] || 'core areas'}."
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Smart Insights & Actionable Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-card p-6"
        >
          <h3 className="text-zinc-200 font-semibold mb-4 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-indigo-400" />
            AI Smart Insights
          </h3>
          <ul className="space-y-4">
            {analysis.insights.map((insight, i) => (
              <li key={i} className="flex gap-3 text-sm text-zinc-400 leading-relaxed group">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 group-hover:scale-150 transition-transform shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                {insight}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="glass-card p-6 bg-gradient-to-br from-indigo-500/5 to-transparent flex flex-col"
        >
          <h3 className="text-zinc-200 font-semibold mb-4 flex items-center gap-2">
            <MousePointerClick className="w-4 h-4 text-indigo-400" />
            Actionable Next Steps
          </h3>
          <div className="space-y-3 flex-1 mb-6">
            {analysis.actionableSteps.map((step, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-lg text-sm text-zinc-300">
                <div className="flex-shrink-0 w-6 h-6 rounded-md bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400">
                  {i + 1}
                </div>
                {step}
              </div>
            ))}
          </div>
          <button
            onClick={generateRoadmap}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-semibold transition-all shadow-[0_0_30px_-10px_rgba(79,70,229,0.5)] flex items-center justify-center gap-2 group relative overflow-hidden"
          >
            <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            Update My Personalized Roadmap
          </button>
        </motion.div>
      </div>
    </div>
  );
}
