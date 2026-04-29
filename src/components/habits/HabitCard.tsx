"use client";

import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Trash2, Zap } from "lucide-react";
import { Habit } from "@/lib/storage";
import { calculateCurrentStreak } from "@/lib/streaks";
import { getHabitSlug } from "@/lib/slug";

interface HabitCardProps {
  habit: Habit;
  todayStr: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}


export const HabitCard = forwardRef<HTMLDivElement, HabitCardProps>(
  ({ habit, todayStr, onToggle, onDelete }, ref) => {
    const isDone = habit.completedDates.includes(todayStr);
    const streak = calculateCurrentStreak(habit.completedDates);

    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        whileHover={{ y: -5 }}
        key={habit.id}
        data-testid={`habit-card-${getHabitSlug(habit.name)}`}
        className="group relative p-6 rounded-[2rem] border border-zinc-700/50 bg-zinc-900/60 overflow-hidden"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#D3FB52]/60 tracking-widest">
              {habit.category}
            </span>
            <h3 className="text-xl font-medium text-white italic tracking-tight">
              {habit.name}
            </h3>

            {/* Integrated Streak Badge */}
            {streak > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-1 mt-1 text-orange-500"
              >
                <Zap size={12} fill="currentColor" />
                <span className="text-[10px] font-black uppercase tracking-tighter">
                  {streak} Day Streak
                </span>
              </motion.div>
            )}
          </div>

          <button
            onClick={() => onDelete(habit.id)}
            className="opacity-0 group-hover:opacity-100 p-2 text-zinc-600 hover:text-red-500 transition-all transform hover:rotate-12"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <motion.p
            key={habit.completedDates.length}
            initial={{ y: 5 }}
            animate={{ y: 0 }}
            className="text-[#D3FB52] font-black text-3xl"
          >
            {habit.completedDates.length}{" "}
            <span className="text-[10px] text-zinc-500 font-bold ml-1 tracking-widest">
              DAYS
            </span>
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            data-testid="habit-complete-btn"
            onClick={() => onToggle(habit.id)}
            className={`w-14 h-14 flex items-center justify-center rounded-2xl transition-all ${
              isDone
                ? "bg-[#D3FB52] text-black shadow-[0_0_20px_rgba(211,251,82,0.3)]"
                : "bg-zinc-800 text-zinc-500"
            }`}
          >
            {isDone ? (
              <CheckCircle2 data-testid="status-done" size={28} />
            ) : (
              <Circle data-testid="status-pending" size={28} />
            )}
          </motion.button>
        </div>
      </motion.div>
    );
  }
);

HabitCard.displayName = "HabitCard";