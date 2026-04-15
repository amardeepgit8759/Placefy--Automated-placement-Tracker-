"use client";

import { usePathname } from "next/navigation";
import { useAppContext } from "@/lib/AppContext";
import { Sun, Moon, Sparkles } from "lucide-react";
import { clsx } from "clsx";

export default function Header() {
  const pathname = usePathname();
  const { state, updateState } = useAppContext();

  const getPageTitle = () => {
    switch (pathname) {
      case "/": return "Dashboard";
      case "/setup": return "Setup";
      case "/syllabus": return "Syllabus details";
      case "/assessment": return "Assessment";
      case "/analysis": return "Analysis";
      case "/roadmap": return "Roadmap";
      case "/study": return "Study";
      default: return "Dashboard";
    }
  };

  return (
    <header className="w-full flex items-center justify-between px-8 py-5 border-b border-white/[0.02]">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-zinc-500">Workflow</span>
        <span className="text-zinc-600">&gt;</span>
        <span className="text-zinc-200 font-medium">{getPageTitle()}</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex p-1 bg-zinc-900/50 rounded-xl border border-zinc-800/50 gap-1 overflow-hidden">
           {[
             { id: "light", icon: Sun, label: "Light Theme" },
             { id: "dark", icon: Moon, label: "Dark Theme" },
             { id: "midnight", icon: Sparkles, label: "Midnight Theme" }
           ].map((t) => (
             <button
                key={t.id}
                onClick={() => updateState({ theme: t.id as any })}
                title={t.label}
                className={clsx(
                  "p-2 rounded-lg transition-all",
                  state.theme === t.id
                    ? "bg-white text-black shadow-lg"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                )}
             >
                <t.icon className="w-4 h-4" />
             </button>
           ))}
        </div>
        <div className="w-8 h-8 rounded-full bg-indigo-900 border border-indigo-700 flex items-center justify-center text-xs font-bold text-indigo-300">
          AS
        </div>
      </div>
    </header>
  );
}
