"use client";

import { useMemo } from "react";
import { clsx } from "clsx";
import { Flame } from "lucide-react";

interface ActivityHeatmapProps {
  completionDates: Record<string, string>;
}

export default function ActivityHeatmap({ completionDates }: ActivityHeatmapProps) {
  // Aggregate task counts per date (YYYY-MM-DD)
  const countsByDate = useMemo(() => {
    const counts: Record<string, number> = {};
    if (completionDates) {
      Object.values(completionDates).forEach((dateStr) => {
        if (dateStr) {
          counts[dateStr] = (counts[dateStr] || 0) + 1;
        }
      });
    }
    return counts;
  }, [completionDates]);

  const totalCompletions = useMemo(() => {
    return Object.values(countsByDate).reduce((acc, curr) => acc + curr, 0);
  }, [countsByDate]);

  // Construct 13 weeks of days ending on today (91 days matrix)
  const { weeks, dayLabels } = useMemo(() => {
    const daysArr: { dateStr: string; count: number; date: Date }[] = [];
    const today = new Date();
    
    // Total 13 weeks = 91 days
    for (let i = 90; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      daysArr.push({
        dateStr,
        count: countsByDate[dateStr] || 0,
        date: d,
      });
    }

    // Group into columns of 7 days (weeks)
    const weeksArr: typeof daysArr[] = [];
    for (let i = 0; i < daysArr.length; i += 7) {
      weeksArr.push(daysArr.slice(i, i + 7));
    }

    return {
      weeks: weeksArr,
      dayLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    };
  }, [countsByDate]);

  // Helper for cell color intensity
  const getCellColor = (count: number) => {
    if (count === 0) return "bg-zinc-800/50 border border-zinc-800/80";
    if (count === 1) return "bg-indigo-900/90 border border-indigo-700/50";
    if (count === 2) return "bg-indigo-700 border border-indigo-500/50 shadow-sm shadow-indigo-500/20";
    return "bg-indigo-500 border border-indigo-400 shadow-md shadow-indigo-500/30";
  };

  return (
    <div className="glass-card p-6 md:col-span-3 rounded-2xl border border-zinc-800/50 bg-zinc-900/50 space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-zinc-800/50">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-indigo-400" />
          <h3 className="font-semibold text-white text-base">Study Activity</h3>
        </div>
        <span className="text-xs font-medium text-zinc-400">
          {totalCompletions} {totalCompletions === 1 ? "task" : "tasks"} completed in last 90 days
        </span>
      </div>

      {totalCompletions === 0 ? (
        /* Empty State */
        <div className="py-8 flex flex-col items-center justify-center text-center space-y-2">
          <div className="p-3 bg-zinc-800/40 rounded-full border border-zinc-800 text-zinc-500">
            <Flame className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-zinc-300">
            Complete roadmap tasks to build your activity streak.
          </p>
          <p className="text-xs text-zinc-500 max-w-sm">
            As you check off daily tasks on your roadmap, your activity heatmap will update automatically.
          </p>
        </div>
      ) : (
        /* Heatmap Grid */
        <div className="space-y-3 pt-2">
          <div className="overflow-x-auto pb-1">
            <div className="flex items-start gap-3 min-w-max">
              {/* Day Labels Column */}
              <div className="grid grid-rows-7 gap-1 pt-0.5 text-[10px] font-semibold text-zinc-500 select-none">
                <span className="h-3.5 leading-3">Mon</span>
                <span className="h-3.5 leading-3"></span>
                <span className="h-3.5 leading-3">Wed</span>
                <span className="h-3.5 leading-3"></span>
                <span className="h-3.5 leading-3">Fri</span>
                <span className="h-3.5 leading-3"></span>
                <span className="h-3.5 leading-3">Sun</span>
              </div>

              {/* Grid Columns (Weeks) */}
              <div className="flex gap-1">
                {weeks.map((week, wIdx) => (
                  <div key={wIdx} className="grid grid-rows-7 gap-1">
                    {week.map((day, dIdx) => (
                      <div
                        key={dIdx}
                        title={`${day.count} tasks on ${day.dateStr}`}
                        className={clsx(
                          "w-3.5 h-3.5 rounded-[3px] transition-transform hover:scale-125 cursor-pointer",
                          getCellColor(day.count)
                        )}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Legend */}
          <div className="flex items-center justify-end gap-2 text-xs text-zinc-500 pt-1">
            <span>Less</span>
            <div className="flex gap-1 items-center">
              <div className="w-3 h-3 rounded-[2px] bg-zinc-800/50 border border-zinc-800" />
              <div className="w-3 h-3 rounded-[2px] bg-indigo-900/90 border border-indigo-700/50" />
              <div className="w-3 h-3 rounded-[2px] bg-indigo-700 border border-indigo-500/50" />
              <div className="w-3 h-3 rounded-[2px] bg-indigo-500 border border-indigo-400" />
            </div>
            <span>More</span>
          </div>
        </div>
      )}
    </div>
  );
}
