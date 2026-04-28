'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Mail, Lock, CheckSquare, Square, Eye, EyeOff, Search, Apple } from 'lucide-react';
import { validateEmail, validatePassword } from '@/lib/validators';
import { storage, User } from '@/lib/storage'; // Import User from storage

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

    if (!validateEmail(email)) return setError('Invalid email address');
    if (!validatePassword(password)) return setError('Password must be 6+ characters');

    const allUsers = storage.getUsers();

    if (isLogin) {
      const user = allUsers.find(u => u.email === email && u.password === password);
      if (user) {
        storage.saveSession(user);
        router.push('/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } else {
      const exists = allUsers.find(u => u.email === email);
      if (exists) return setError('Email already registered');
      
      const newUser: User = { 
        id: Date.now().toString(), 
        email, 
        password, 
        createdAt: new Date().toISOString(),
        habits: [] 
      };
      
      storage.saveUser(newUser);
      storage.saveSession(newUser);
      router.push('/dashboard');
    }
  };

  return (
    <main className="min-h-screen bg-[#0C0F02] bg-[radial-gradient(circle_at_top,#2A3211_0%,#0C0F02_60%)] flex flex-col items-center p-6 text-white  pt-16">
      <header className="w-full max-w-sm mb-10 text-center">
        <h1 className="text-3xl font-semibold leading-tight tracking-tight px-4">
          {isLogin ? 'Sign Up or Log In to Build Habits' : 'Sign Up, Track Your Progress Daily!'}
        </h1>
      </header>

      <div className="w-full max-w-sm flex-1 flex flex-col gap-8">
        {/* Sliding Toggle */}
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
              placeholder="Email Address"
              className="w-full h-14 bg-zinc-900/40 border border-zinc-800 rounded-2xl pl-12 pr-4 text-white focus:outline-none focus:border-zinc-600 transition-all placeholder:text-zinc-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-white transition-colors" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full h-14 bg-zinc-900/40 border border-zinc-800 rounded-2xl pl-12 pr-12 text-white focus:outline-none focus:border-zinc-600 transition-all placeholder:text-zinc-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          <div className="flex items-center justify-between text-sm px-1">
            <button type="button" onClick={() => setRememberMe(!rememberMe)} className="flex items-center gap-2 text-zinc-400 transition-colors hover:text-zinc-200">
              {rememberMe ? <CheckSquare size={18} className="text-[#D3FB52]" /> : <Square size={18} />}
              Remember me
            </button>
            <button type="button" className="text-zinc-400 hover:text-zinc-200">Forgot password</button>
          </div>

          <button type="submit" className="w-full h-14 bg-[#D3FB52] text-black font-bold rounded-full hover:brightness-110 active:scale-[0.98] transition-all text-lg mt-4 shadow-[0_0_20px_rgba(211,251,82,0.2)]">
            {isLogin ? 'Login' : 'Sign up'}
          </button>
        </form>

        {/* Social Section */}
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-800"></div></div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-[#0C0F02] px-3 text-zinc-500 font-bold">Or login with</span></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button type="button" className="flex h-14 items-center justify-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800 transition-all">
            <Search size={20} /> <span className="text-sm font-medium">Google</span>
          </button>
          <button type="button" className="flex h-14 items-center justify-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800 transition-all">
            <Apple size={20} /> <span className="text-sm font-medium">Apple</span>
          </button>
        </div>

        <p className="text-center text-sm text-zinc-500 mt-auto pb-8">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-[#D3FB52] font-semibold hover:underline">
            {isLogin ? 'Create an account' : 'Login'}
          </button>
        </p>
      </div>
    </main>
  );
}