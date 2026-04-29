'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Mail, Lock, CheckSquare, Square, Eye, EyeOff, Search, Apple, Activity } from 'lucide-react';
import { storage } from '@/lib/storage';
import { User, Session } from '@/types/auth'; // Ensure these are imported from your types file

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const allUsers = storage.getUsers();

    if (isLogin) {
      const user = allUsers.find(u => u.email === email && u.password === password);
      if (user) {
        // FIXED: Session must match { userId, email } per Section 5
        const session: Session = { userId: user.id, email: user.email };
        storage.saveSession(session);
        router.push('/dashboard');
      } else {
        // FIXED: Exact string required by Section 11
        setError('Invalid email or password');
      }
    } else {
      const exists = allUsers.find(u => u.email === email);
      if (exists) {
        // FIXED: Exact string required by Section 11
        return setError('User already exists');
      }
      
      const newUser: User = { 
        id: crypto.randomUUID(), // More robust than Date.now()
        email, 
        password, 
        createdAt: new Date().toISOString()
      };
      
      // FIXED: Session must be created properly for signup too
      const session: Session = { userId: newUser.id, email: newUser.email };
      
      storage.saveUser(newUser);
      storage.saveSession(session);
      router.push('/dashboard');
    }
  };

  return (
    <main className="min-h-screen bg-[#0C0F02] bg-[radial-gradient(circle_at_top,#2A3211_0%,#0C0F02_60%)] flex flex-col items-center p-6 text-white pt-12">
      
      <header className="w-full max-w-sm mb-12 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-[#D3FB52] rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(211,251,82,0.2)]">
          <Activity size={32} className="text-black stroke-[3px]" />
        </div>
        <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">
          {/* FIXED: Requirement Section 10 says "Habit Tracker" */}
          Habit <span className="text-[#D3FB52]">Tracker</span>
        </h1>
        <p className="text-[10px] uppercase tracking-[0.6em] text-[#D3FB52]/60 mt-4 font-black">
          Own Your Routine
        </p>
      </header>

      <div className="w-full max-w-sm flex-1 flex flex-col gap-8">
        <div className="relative w-full h-12 bg-zinc-900/80 rounded-full flex items-center p-1 border border-white/5">
          <motion.div
            className="absolute w-[49%] h-10 bg-zinc-800 rounded-full shadow-xl"
            animate={{ x: isLogin ? '0%' : '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
          <button type="button" onClick={() => setIsLogin(true)} className={`relative z-10 w-1/2 text-sm font-medium transition-colors ${isLogin ? 'text-white' : 'text-zinc-500'}`}>Login</button>
          <button type="button" onClick={() => setIsLogin(false)} className={`relative z-10 w-1/2 text-sm font-medium transition-colors ${!isLogin ? 'text-white' : 'text-zinc-500'}`}>Sign up</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-white transition-colors" />
            <input
              type="email"
              // FIXED: Added required data-testid
              data-testid={isLogin ? "auth-login-email" : "auth-signup-email"}
              placeholder="Email Address"
              className="w-full h-14 bg-zinc-900/40 border border-zinc-800 rounded-2xl pl-12 pr-4 text-white focus:outline-none focus:border-[#D3FB52]/50 transition-all placeholder:text-zinc-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-white transition-colors" />
            <input
              type={showPassword ? "text" : "password"}
              // FIXED: Added required data-testid
              data-testid={isLogin ? "auth-login-password" : "auth-signup-password"}
              placeholder="Password"
              className="w-full h-14 bg-zinc-900/40 border border-zinc-800 rounded-2xl pl-12 pr-12 text-white focus:outline-none focus:border-[#D3FB52]/50 transition-all placeholder:text-zinc-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-red-400 text-sm text-center font-medium">
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <button 
            type="submit" 
            // FIXED: Added required data-testid
            data-testid={isLogin ? "auth-login-submit" : "auth-signup-submit"}
            className="w-full h-14 bg-[#D3FB52] text-black font-black uppercase tracking-widest rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all text-sm mt-4 shadow-[0_10px_20px_rgba(211,251,82,0.15)]"
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        {/* Note: Social logins aren't required, but I've kept your UI intact. Just ensure they don't block the main flow. */}
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-800"></div></div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-[#0C0F02] px-3 text-zinc-500 font-bold">Or continue with</span></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button type="button" className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800 transition-all group">
            <Search size={20} className="group-hover:text-[#D3FB52] transition-colors" /> <span className="text-sm font-medium">Google</span>
          </button>
          <button type="button" className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800 transition-all group">
            <Apple size={20} className="group-hover:text-[#D3FB52] transition-colors" /> <span className="text-sm font-medium">Apple</span>
          </button>
        </div>

        <p className="text-center text-sm text-zinc-500 mt-auto pb-8">
          {isLogin ? "New to the hustle? " : "Already part of the elite? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-[#D3FB52] font-semibold hover:underline">
            {isLogin ? 'Create an account' : 'Login'}
          </button>
        </p>
      </div>
    </main>
  );
}