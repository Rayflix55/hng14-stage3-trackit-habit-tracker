"use client";
import { motion } from "framer-motion";
import { Habit } from "@/lib/storage";

interface PulseMapProps {
  habits: Habit[];
}

export default function PulseMap({ habits }: PulseMapProps) {
  // Generate the last 30 days
  const last30Days = [...Array(30)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i)); // 29 to 0
    return d.toISOString().split("T")[0];
  });

  const getDayIntensity = (dateStr: string) => {
    if (habits.length === 0) return 0;
    const completedThatDay = habits.filter(h => h.completedDates.includes(dateStr)).length;
    return completedThatDay / habits.length;
  };

  return (
    <div className="p-6 rounded-[2.5rem] border border-zinc-700/50 bg-zinc-900/20 backdrop-blur-sm mb-10">
      <h3 className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-4">Consistency Map (Last 30 Days)</h3>
      <div className="flex flex-wrap gap-2">
        {last30Days.map((date) => {
          const intensity = getDayIntensity(date);
          return (
            <motion.div
              key={date}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.2, zIndex: 10 }}
              title={`${date}: ${Math.round(intensity * 100)}%`}
              className="w-4 h-4 rounded-sm transition-colors relative group"
              style={{
                backgroundColor: intensity === 1 
                  ? "#D3FB52" // 100% Perfect
                  : intensity > 0.5 
                  ? "#A3C33A" // High
                  : intensity > 0 
                  ? "#2A3211" // Low
                  : "#18181b"  // Zero (Zinc-900)
              }}
            >
               {/* Minimal tooltip */}
               <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-black text-[8px] px-2 py-1 rounded border border-zinc-700 whitespace-nowrap z-50">
                {date}
               </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}