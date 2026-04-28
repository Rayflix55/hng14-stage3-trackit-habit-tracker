"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { storage, User, Habit } from "@/lib/storage";
import { getWeekDates } from "@/lib/dateUtils";
import { useRouter } from "next/navigation";
import { calculateCurrentStreak } from "@/lib/streaks";
import {
  UserCircle,
  PlusCircle,
  CheckCircle2,
  Circle,
  LogOut,
  Sparkles,
  X,
  Trash2,
  ChevronDown,
  Zap,
} from "lucide-react";

const containerVars = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
} as const;

const itemVars = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 20 },
  },
} as const;

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [weekDates] = useState(getWeekDates());
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: "",
    category: "Health",
    frequency: "Morning",
  });

  useEffect(() => {
    const session = storage.getSession();
    if (!session) {
      router.push("/login");
    } else {
      setUser(session);
      setHabits(session.habits || []);
    }
  }, [router]);

  if (!user) return null;

  const todayStr = new Date().toISOString().split("T")[0];
  const completedToday = habits.filter((h: Habit) =>
    h.completedDates.includes(todayStr),
  ).length;
  const totalHabits = habits.length;
  const completionPercentage =
    totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabit.name || !user) return;

    const habit: Habit = {
      id: Date.now().toString(),
      name: newHabit.name,
      category: newHabit.category,
      frequency: newHabit.frequency,
      completedDates: [],
      createdAt: new Date().toISOString(),
    };

    const updatedHabits = [...habits, habit];
    const updatedUser = { ...user, habits: updatedHabits };

    setHabits(updatedHabits);
    setUser(updatedUser);
    storage.saveSession(updatedUser);

    setIsHabitModalOpen(false);
    setNewHabit({ name: "", category: "Health", frequency: "Morning" });
  };

  const deleteHabit = (id: string) => {
    if (!user) return;
    const updatedHabits = habits.filter((habit) => habit.id !== id);
    const updatedUser = { ...user, habits: updatedHabits };
    setHabits(updatedHabits);
    setUser(updatedUser);
    storage.saveSession(updatedUser);
  };

  const toggleHabitCompletion = (habitId: string) => {
    if (!user) return;

    const updatedHabits = habits.map((habit: Habit) => {
      if (habit.id === habitId) {
        const isCompleted = habit.completedDates.includes(todayStr);
        const newDates = isCompleted
          ? habit.completedDates.filter((d: string) => d !== todayStr)
          : [...habit.completedDates, todayStr];
        return { ...habit, completedDates: newDates };
      }
      return habit;
    });

    const updatedUser = { ...user, habits: updatedHabits };
    setHabits(updatedHabits);
    setUser(updatedUser);
    storage.saveSession(updatedUser);
  };

  return (
    <motion.main
      initial="hidden"
      animate="visible"
      variants={containerVars}
      className="min-h-screen bg-[#0C0F02] bg-[radial-gradient(circle_at_top,#2A3211_0%,#0C0F02_60%)] p-6 text-white pt-10 font-sans"
    >
      {/* 1. Header */}
      <motion.header
        variants={itemVars}
        className="flex items-center justify-between mb-10 border border-zinc-700/50 bg-zinc-900/40 backdrop-blur-md rounded-full p-2 px-4 shadow-2xl"
      >
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.15, rotate: 8 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <UserCircle className="w-10 h-10 text-[#D3FB52]" strokeWidth={1.5} />
          </motion.div>
          <div>
            <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">
              Track-It App
            </p>
            <h1 className="text-xl font-medium tracking-tight">
              Hi, {user.email.split("@")[0]}
            </h1>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsLogoutModalOpen(true)}
          className="p-3 text-zinc-400 hover:text-red-400 transition-colors"
        >
          <LogOut size={18} />
        </motion.button>
      </motion.header>

      {/* 2. Weekly Strip */}
      <motion.section variants={itemVars} className="mb-10 grid grid-cols-7 gap-2">
        {weekDates.map((day) => (
          <motion.div
            key={day.fullDate}
            whileHover={{ scale: 1.08, y: -5 }}
            className={`flex flex-col items-center justify-center gap-1 h-24 rounded-2xl border transition-all ${
              day.isToday
                ? "bg-[#D3FB52] border-[#D3FB52] text-black shadow-[0_0_30px_rgba(211,251,82,0.4)]"
                : "bg-zinc-800/40 border-zinc-700/50 text-zinc-400"
            }`}
          >
            <span className="text-[10px] uppercase font-bold tracking-widest">
              {day.dayName}
            </span>
            <span className="text-3xl font-bold tracking-tighter">{day.date}</span>
          </motion.div>
        ))}
      </motion.section>

      {/* 3. Stats Card */}
      <motion.section
        variants={itemVars}
        whileHover={{ scale: 1.01 }}
        className="mb-10 p-6 rounded-[2.5rem] border border-zinc-700/50 bg-zinc-900/40 backdrop-blur-sm shadow-xl relative overflow-hidden"
      >
        <div className="flex items-center justify-between gap-6 relative z-10">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="absolute w-full h-full rotate-[-90deg]" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" stroke="#2A3211" strokeWidth="3" />
              <motion.circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="#D3FB52"
                strokeWidth="3.2"
                strokeLinecap="round"
                initial={{ strokeDasharray: "0, 100" }}
                animate={{ strokeDasharray: `${completionPercentage}, 100` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
              className="text-4xl font-black text-[#D3FB52]"
            >
              {completionPercentage}%
            </motion.div>
          </div>
          <div className="flex-1">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="flex items-center gap-2 text-[#D3FB52] mb-1"
            >
              <Sparkles size={16} />
              <span className="text-[10px] uppercase font-bold tracking-widest">
                Growth Phase
              </span>
            </motion.div>
            <h2 className="text-2xl font-semibold italic">Daily Pulse</h2>
          </div>
        </div>
      </motion.section>

      {/* 4. Habit List */}
      <motion.section
        variants={itemVars}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-24"
      >
        <AnimatePresence mode="popLayout">
          {habits.length > 0 ? (
            habits.map((habit) => {
              const isDone = habit.completedDates.includes(todayStr);
              const streak = calculateCurrentStreak(habit.completedDates);

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ y: -5 }}
                  key={habit.id}
                  className="group relative p-6 rounded-[2rem] border border-zinc-700/50 bg-zinc-900/60 overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      {/* Streak implementation inserted here */}
                      {streak >= 1 && (
                        <motion.div
                          initial={{ scale: 0, x: -10 }}
                          animate={{ scale: 1, x: 0 }}
                          className="flex items-center gap-1 text-orange-500 mb-1"
                        >
                          <Zap size={14} fill="currentColor" />
                          <span className="text-[10px] font-black uppercase tracking-tighter">
                            {streak} DAY STREAK
                          </span>
                        </motion.div>
                      )}
                      <span className="text-[10px] uppercase font-bold text-[#D3FB52]/60 tracking-widest">
                        {habit.category}
                      </span>
                      <h3 className="text-xl font-medium text-white italic tracking-tight">
                        {habit.name}
                      </h3>
                    </div>

                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-zinc-600 hover:text-red-500 transition-all transform hover:rotate-12"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <motion.div
                      key={habit.completedDates.length}
                      initial={{ y: 5 }}
                      animate={{ y: 0 }}
                      className="flex items-baseline"
                    >
                      <span className="text-[#D3FB52] font-black text-3xl">
                        {habit.completedDates.length}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-bold ml-1 tracking-widest uppercase">
                        Days
                      </span>
                    </motion.div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleHabitCompletion(habit.id)}
                      className={`w-14 h-14 flex items-center justify-center rounded-2xl transition-all ${
                        isDone
                          ? "bg-[#D3FB52] text-black shadow-[0_0_20px_rgba(211,251,82,0.3)]"
                          : "bg-zinc-800 text-zinc-500"
                      }`}
                    >
                      {isDone ? <CheckCircle2 size={28} /> : <Circle size={28} />}
                    </motion.button>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div
              layout
              whileHover={{ scale: 0.98 }}
              onClick={() => setIsHabitModalOpen(true)}
              className="col-span-full py-16 flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-[2.5rem] cursor-pointer group"
            >
              <Zap
                className="text-zinc-700 mb-4 group-hover:text-[#D3FB52] transition-colors"
                size={32}
              />
              <h3 className="text-zinc-500 font-medium tracking-tight">
                Your routine is empty. Start here.
              </h3>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* FAB and Modals remain same... */}
      <motion.button
        variants={itemVars}
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsHabitModalOpen(true)}
        className="fixed bottom-10 right-6 z-[100] h-16 w-16 bg-[#D3FB52] text-black rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(211,251,82,0.3)]"
      >
        <PlusCircle size={32} />
      </motion.button>

      {/* Logout Modal */}
      <AnimatePresence>
        {isLogoutModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLogoutModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-[#0C0F02] border border-zinc-800 rounded-[3rem] p-10 text-center max-w-sm shadow-[0_0_50px_rgba(0,0,0,1)]"
            >
              <div className="w-20 h-20 bg-[#D3FB52]/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-[#D3FB52]/20">
                <LogOut className="text-[#D3FB52]" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3 tracking-tight italic uppercase">
                Pause <span className="text-[#D3FB52]">Tracking?</span>
              </h2>
              <p className="text-zinc-500 text-sm mb-10 leading-relaxed font-medium">
                Your progress is saved, but we'll miss the hustle. Ready to call it a day?
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    storage.clearSession();
                    router.push("/login");
                  }}
                  className="w-full bg-[#D3FB52] text-black py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-transform"
                >
                  Confirm Logout
                </button>
                <button
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="w-full bg-zinc-900 text-zinc-400 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:text-white transition-colors"
                >
                  Keep Grinding
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Habit Modal */}
      <AnimatePresence>
        {isHabitModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsHabitModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl bg-zinc-900/90 border border-zinc-700/50 backdrop-blur-2xl rounded-[3rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-sm uppercase tracking-[0.3em] text-[#D3FB52] font-bold mb-1">
                    New Routine
                  </h2>
                  <p className="text-2xl font-light tracking-tight text-white italic">
                    What are we building today?
                  </p>
                </div>
                <button
                  onClick={() => setIsHabitModalOpen(false)}
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddHabit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-500 ml-4 font-bold">
                    Habit Name
                  </label>
                  <input
                    autoFocus
                    className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-5 text-lg text-white outline-none focus:border-[#D3FB52] focus:bg-zinc-800 transition-all placeholder:text-zinc-700"
                    placeholder="e.g. Morning Meditation"
                    value={newHabit.name}
                    onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 ml-4 font-bold">
                      Category
                    </label>
                    <div className="relative group">
                      <select
                        className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-4 pr-10 text-zinc-300 outline-none appearance-none hover:bg-zinc-800 focus:border-[#D3FB52]/50 transition-all cursor-pointer"
                        value={newHabit.category}
                        onChange={(e) => setNewHabit({ ...newHabit, category: e.target.value })}
                      >
                        <option>Health</option>
                        <option>Work</option>
                        <option>Finance</option>
                        <option>Learning</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 group-hover:text-[#D3FB52] transition-colors">
                        <ChevronDown size={16} strokeWidth={3} />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 ml-4 font-bold">
                      Time
                    </label>
                    <div className="relative group">
                      <select
                        className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-4 pr-10 text-zinc-300 outline-none appearance-none hover:bg-zinc-800 focus:border-[#D3FB52]/50 transition-all cursor-pointer"
                        value={newHabit.frequency}
                        onChange={(e) =>
                          setNewHabit({
                            ...newHabit,
                            frequency: e.target.value,
                          })
                        }
                      >
                        <option>Morning</option>
                        <option>Afternoon</option>
                        <option>Evening</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 group-hover:text-[#D3FB52] transition-colors">
                        <ChevronDown size={16} strokeWidth={3} />
                      </div>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: "#E4FF80" }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-[#D3FB52] text-black font-black uppercase tracking-widest text-xs py-5 rounded-2xl mt-4 shadow-[0_10px_20px_rgba(211,251,82,0.15)]"
                >
                  Save Habit
                </motion.button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}