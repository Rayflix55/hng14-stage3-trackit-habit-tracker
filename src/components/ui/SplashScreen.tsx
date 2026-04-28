'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { storage } from '@/lib/storage';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const session = storage.getSession();
      // Redirect logic based on session existence
      if (session) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }, 2000); // 2 seconds (Matches the upper limit of your TRD)

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#121212]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center gap-6"
      >
     {/* Logo Icon */}
<div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-2xl">
  <svg 
    width="40" 
    height="40" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="#FFFFFF" // Hardcoded hex to be safe
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    style={{ display: 'block' }} // Force visibility
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <path d="m9 12 2 2 4-4" />
  </svg>
</div>

        {/* App Name */}
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-2xl font-medium tracking-tight text-[#F5F5F5]"
        >
          track-it.
        </motion.h1>
      </motion.div>
    </div>
  );
}