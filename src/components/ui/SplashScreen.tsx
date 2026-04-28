"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { storage } from "@/lib/storage";
import { Activity } from "lucide-react";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const session = storage.getSession();
      // Redirect logic based on session existence
      if (session) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }, 1500); // 2 seconds

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0C0F02]">
      {/* Background Ambient Glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute w-[400px] h-[400px] bg-[#D3FB52]/5 rounded-full blur-[100px]"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center gap-8 relative z-10"
      >
        {/* Logo Icon Container */}
        <div className="relative">
          {/* Pulsing Ring */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0, 0.2] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 bg-[#D3FB52] rounded-[2rem] blur-xl"
          />

          <div className="relative flex h-24 w-24 items-center justify-center rounded-[2rem] border border-[#D3FB52]/20 bg-[#D3FB52] shadow-2xl">
            <motion.div
              initial={{ rotate: -180, scale: 0.5 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.2,
              }}
            >
              <Activity size={48} className="text-black stroke-[3px]" />
            </motion.div>
          </div>
        </div>

        {/* App Name & Branding */}
        <div className="flex flex-col items-center gap-2">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-4xl font-black tracking-tighter text-white uppercase italic"
          >
            Track<span className="text-[#D3FB52]">-It</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-[9px] uppercase tracking-[0.6em] text-[#D3FB52]/60 mt-3 font-black"
          >
           Own Your Routine
          </motion.p>
        </div>

        {/* Minimalist Loader */}
        <div className="mt-4 w-12 h-[2px] bg-zinc-900 rounded-full overflow-hidden">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-full h-full bg-[#D3FB52]"
          />
        </div>
      </motion.div>
    </div>
  );
}
