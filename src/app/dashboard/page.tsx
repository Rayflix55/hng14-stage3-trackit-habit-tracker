'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { storage, User, Habit } from '@/lib/storage';
import { getWeekDates } from '@/lib/dateUtils';
import { useRouter } from 'next/navigation';
import { 
  UserCircle, 
  CalendarDays, 
  PlusCircle, 
  CheckCircle2, 
  Circle, 
  Settings2, 
  Sparkles,
  LayoutGrid
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [weekDates] = useState(getWeekDates());

  // Initial Session & Data Load
  useEffect(() => {
    const session = storage.getSession();
    if (!session) {
      router.push('/login');
    } else {
      setUser(session);
      setHabits(storage.getHabits());
    }
  }, [router]);

  // Derived State for Progress Tracking
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  
  const stats = useMemo(() => {
    const total = habits.length;
    const completed = habits.filter((h) => h.completedDates.includes(todayStr)).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percentage };
  }, [habits, todayStr]);

  if (!user) return null;

  const toggleHabitCompletion = (habitId: string) => {
    const updatedHabits = habits.map((habit) => {
      if (habit.id === habitId) {
        const isCompleted = habit.completedDates.includes(todayStr);
        const newDates = isCompleted
          ? habit.completedDates.filter((d) => d !== todayStr)
          : [...habit.completedDates, todayStr];
        return { ...habit, completedDates: newDates };
      }
      return habit;
    });
    
    // Sync to Storage and Local State
    storage.saveHabits(updatedHabits);
    setHabits(updatedHabits);
  };

  return (
    <main className="min-h-screen bg-[#0C0F02] bg-[radial-gradient(circle_at_top,#2A3211_0%,#0C0F02_60%)] p-6 text-white pt-10 font-sans selection:bg-[#D3FB52] selection:text-black">
      
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-10 border border-zinc-700/50 bg-zinc-900/40 backdrop-blur-md rounded-full p-2 px-4 shadow-2xl"
      >
        <div className="flex items-center gap-3">
          <motion.div whileHover={{ rotate: 15 }} className="cursor-pointer">
            <UserCircle className="w-10 h-10 text-zinc-600" strokeWidth={1} />
          </motion.div>
          <div>
            <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Main Dashboard</p>
            <h1 className="text-xl font-medium tracking-tight">Hi, {user.email.split('@')[0]}</h1>
          </div>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { storage.clearSession(); router.push('/login'); }}
          className="flex items-center gap-2 text-sm text-zinc-400 p-2 px-4 bg-zinc-800 rounded-full hover:text-white transition-colors"
        >
          <Settings2 size={16}/>
        </motion.button>
      </motion.header>

      {/* Weekly Calendar */}
      <section className="mb-10 grid grid-cols-7 gap-2">
        {weekDates.map((day, i) => (
          <motion.div 
            key={day.fullDate}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05, type: 'spring', stiffness: 200 }}
            whileHover={{ y: -5 }}
            className={`flex flex-col items-center justify-center gap-1 h-24 rounded-2xl border transition-all cursor-default ${day.isToday ? 'bg-[#D3FB52] border-[#D3FB52] text-black shadow-[0_0_20px_rgba(211,251,82,0.3)]' : 'bg-zinc-800/40 border-zinc-700/50 text-zinc-400'}`}
          >
            <span className={`text-[10px] uppercase font-bold tracking-widest ${day.isToday ? 'text-black/60' : 'text-zinc-500'}`}>{day.dayName}</span>
            <span className="text-3xl font-bold tracking-tighter">{day.date}</span>
            {day.isToday && <motion.div layoutId="today-dot" className="w-1.5 h-1.5 bg-black rounded-full" />}
          </motion.div>
        ))}
      </section>

      {/* Progress Ring Card */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-10 p-6 rounded-[2.5rem] border border-zinc-700/50 bg-zinc-900/40 backdrop-blur-sm shadow-xl relative overflow-hidden"
      >
        <div className="flex items-center justify-between gap-6 relative z-10">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="absolute w-full h-full rotate-[-90deg]" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" stroke="#2A3211" strokeWidth="3" />
              <motion.circle 
                cx="18" cy="18" r="16" fill="none" 
                stroke="#D3FB52" strokeWidth="3.2" strokeLinecap="round"
                initial={{ strokeDasharray: "0, 100" }}
                animate={{ strokeDasharray: `${stats.percentage}, 100` }}
                transition={{ duration: 1.5, ease: 'circOut' }}
              />
            </svg>
            <motion.div 
              key={stats.percentage}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute text-4xl font-black tracking-tighter text-[#D3FB52]"
            >
              {stats.percentage}%
            </motion.div>
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 text-[#D3FB52]">
              <Sparkles size={16} className={stats.percentage === 100 ? "animate-bounce" : "animate-pulse"} />
              <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Current Status</span>
            </div>
            <h2 className="text-2xl font-semibold text-white leading-tight tracking-tight">
              {stats.percentage === 100 ? "All Done!" : "Keep Pushing!"}
            </h2>
            <p className="text-zinc-500 text-sm leading-relaxed">
              {stats.total > 0 
                ? `You've completed ${stats.completed} of your ${stats.total} habits today.` 
                : "Your journey starts here. Add your first habit!"}
            </p>
          </div>
        </div>
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#D3FB52]/5 blur-[60px] rounded-full" />
      </motion.section>

      {/* Habit Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-32">
        <AnimatePresence mode="popLayout">
          {habits.length > 0 ? (
            habits.map((habit, i) => {
              const isCompletedToday = habit.completedDates.includes(todayStr);
              return (
                <motion.div
                  layout
                  key={habit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4, borderColor: 'rgba(211, 251, 82, 0.3)' }}
                  className="relative overflow-hidden group p-6 rounded-[2rem] border border-zinc-700/50 bg-zinc-900/60 transition-colors cursor-pointer"
                >
                  <div className="relative z-10 space-y-1 mb-8">
                    <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-600 group-hover:text-[#D3FB52] transition-colors">{habit.category}</span>
                    <h3 className="text-xl font-medium tracking-tight text-white">{habit.name}</h3>
                    <p className="text-zinc-500 text-xs italic">Everyday • {habit.frequency}</p>
                  </div>

                  <div className="relative z-10 flex items-end justify-between">
                      <p className='text-3xl font-black tracking-tighter text-[#D3FB52]'>
                        {habit.completedDates.length}
                        <span className='text-[10px] font-bold text-zinc-500 ml-1 uppercase tracking-widest'>Day Streak</span>
                      </p>
                      
                      <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => { e.stopPropagation(); toggleHabitCompletion(habit.id); }}
                          className={`w-14 h-14 flex items-center justify-center rounded-2xl shadow-xl transition-all ${isCompletedToday ? 'bg-[#D3FB52] text-black shadow-[#D3FB52]/20' : 'bg-zinc-800 text-zinc-500'}`}
                      >
                          {isCompletedToday ? <CheckCircle2 size={28} strokeWidth={2.5}/> : <Circle size={28} />}
                      </motion.button>
                  </div>
                  <CalendarDays className="absolute -right-4 -bottom-4 w-28 h-28 text-white/[0.02] group-hover:text-[#D3FB52]/[0.05] transition-colors duration-500" strokeWidth={1} />
                </motion.div>
              );
            })
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-20 flex flex-col items-center justify-center text-zinc-600 border-2 border-dashed border-zinc-800 rounded-[2rem]"
            >
              <LayoutGrid size={48} strokeWidth={1} className="mb-4 opacity-20" />
              <p className="text-sm tracking-widest uppercase font-bold">No Habits Found</p>
              <p className="text-xs mt-1">Click the + button to create one</p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Floating Action Button */}
      <motion.button 
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-10 right-6 z-50 flex items-center justify-center h-16 w-16 bg-[#D3FB52] text-black rounded-full shadow-[0_10px_30px_rgba(211,251,82,0.4)]"
      >
        <PlusCircle size={32} strokeWidth={2.5} />
      </motion.button>

    </main>
  );
}