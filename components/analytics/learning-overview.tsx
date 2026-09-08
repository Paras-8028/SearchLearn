"use client";

import { Flame, BookOpen, CheckCircle2, Clock, Award, Calendar } from "lucide-react";
import type { StudentLearningStats } from "@/types/analytics";

interface LearningOverviewProps {
  stats: StudentLearningStats;
}

export function LearningOverview({ stats }: LearningOverviewProps) {
  const {
    coursesEnrolled,
    coursesCompleted,
    lessonsCompleted,
    currentStreak,
    totalLearningTimeMinutes,
    completionRate,
    weeklyActivity,
  } = stats;

  const hours = Math.floor(totalLearningTimeMinutes / 60);
  const minutes = totalLearningTimeMinutes % 60;
  const formattedTime = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 backdrop-blur space-y-6">
      {/* Header & Streak Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/60 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <Award className="h-4 w-4" />
            Learning Telemetry
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white mt-1">
            Learning Overview
          </h2>
        </div>

        {/* Streak Pill */}
        <div className="flex items-center gap-3 bg-zinc-950/70 border border-zinc-800/80 px-4 py-2 rounded-2xl shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30">
            <Flame className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-extrabold text-white">{currentStreak}</span>
              <span className="text-xs font-semibold text-amber-400">
                {currentStreak === 1 ? "Day" : "Days"} Streak
              </span>
            </div>
            <p className="text-[10px] text-zinc-500">
              {currentStreak > 0 ? "Daily study habit active!" : "Study today to start your streak!"}
            </p>
          </div>
        </div>
      </div>

      {/* KPI 4-Card Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-zinc-950/50 border border-zinc-800/60">
          <div className="flex items-center justify-between text-zinc-500 text-xs">
            <span>Enrolled</span>
            <BookOpen className="h-3.5 w-3.5 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-1">{coursesEnrolled}</p>
          <span className="text-[10px] text-zinc-500">Courses joined</span>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-950/50 border border-zinc-800/60">
          <div className="flex items-center justify-between text-zinc-500 text-xs">
            <span>Completed</span>
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{coursesCompleted}</p>
          <span className="text-[10px] text-zinc-500">Courses graduated</span>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-950/50 border border-zinc-800/60">
          <div className="flex items-center justify-between text-zinc-500 text-xs">
            <span>Lessons</span>
            <Award className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-1">{lessonsCompleted}</p>
          <span className="text-[10px] text-zinc-500">Lessons finished</span>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-950/50 border border-zinc-800/60">
          <div className="flex items-center justify-between text-zinc-500 text-xs">
            <span>Learning Time</span>
            <Clock className="h-3.5 w-3.5 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-1">{formattedTime}</p>
          <span className="text-[10px] text-zinc-500">Time invested</span>
        </div>
      </div>

      {/* Completion Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-zinc-400">Course Completion Rate</span>
          <span className="font-semibold text-emerald-400">{completionRate}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-zinc-950 overflow-hidden border border-zinc-800/80">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* Weekly Activity Checklist / Bars */}
      <div className="space-y-3 pt-2 border-t border-zinc-800/60">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 font-semibold text-zinc-300">
            <Calendar className="h-3.5 w-3.5 text-amber-400" />
            7-Day Learning Activity
          </span>
          <span className="text-[11px] text-zinc-500">Consecutive activity builds streaks</span>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weeklyActivity.map((day) => (
            <div
              key={day.date}
              className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-colors ${
                day.active
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                  : "bg-zinc-950/40 border-zinc-800/60 text-zinc-600"
              }`}
            >
              <span className="text-[10px] font-medium uppercase">{day.day}</span>
              <div
                className={`mt-1 h-2 w-2 rounded-full ${
                  day.active ? "bg-amber-400 shadow-sm shadow-amber-400/50" : "bg-zinc-800"
                }`}
              />
              <span className="text-[9px] mt-1 text-zinc-500">
                {day.active ? "✓" : "-"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
