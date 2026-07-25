"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  ClipboardCheck, 
  BarChart2, 
  Map, 
  GraduationCap, 
  Settings,
  Zap
} from "lucide-react";
import { clsx } from "clsx";
import { useAppContext } from "@/lib/AppContext";

export default function Sidebar() {
  const pathname = usePathname();
  const { state } = useAppContext();

  const links = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/setup", label: "Syllabus", icon: BookOpen },
    { href: "/assessment", label: "Assessment", icon: ClipboardCheck },
    { href: "/analysis", label: "Analysis", icon: BarChart2 },
    { href: "/roadmap", label: "Roadmap", icon: Map },
    { href: "/study", label: "Study", icon: GraduationCap },
  ];

  const hasOnboarded = state.role !== null;

  return (
    <div className="w-64 flex-shrink-0 border-r border-border bg-background flex flex-col h-screen sticky top-0 transition-colors">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground">Placefy</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted-foreground/5"
              )}
            >
              <Icon className={clsx("w-4 h-4", isActive ? "text-primary" : "text-muted-foreground")} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 space-y-4 border-t border-border/50">
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Readiness</span>
            <span className="text-primary">{state.readinessScore}%</span>
          </div>
          <div className="w-full bg-border/50 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-1000" 
              style={{ width: `${state.readinessScore}%` }}
            ></div>
          </div>
        </div>

        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted-foreground/5 -mx-3"
        >
          <Settings className="w-4 h-4 text-muted-foreground" />
          Settings
        </Link>
      </div>
    </div>
  );
}
