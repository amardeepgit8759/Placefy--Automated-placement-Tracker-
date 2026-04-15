"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap } from "lucide-react";
import { clsx } from "clsx";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="w-full border-b border-zinc-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-indigo-600 rounded-lg group-hover:bg-indigo-500 transition-colors">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">Placefy</span>
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link
            href="/"
            className={clsx(
              "transition-colors",
              pathname === "/" ? "text-white" : "text-zinc-400 hover:text-white"
            )}
          >
            Dashboard
          </Link>
          <Link
            href="/setup"
            className={clsx(
              "transition-colors",
              pathname === "/setup" ? "text-white" : "text-zinc-400 hover:text-white"
            )}
          >
            New Journey
          </Link>
        </div>
      </div>
    </nav>
  );
}
