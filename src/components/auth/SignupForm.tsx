"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { storage } from "@/lib/storage";
import { User, Session } from "@/types/auth"; // Ensure these paths are correct
import { motion } from "framer-motion";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // 1. Check for duplicate email (Requirement: Section 11)
      const users = storage.getUsers();
      if (users.find((u: User) => u.email === email)) {
        setError("User already exists"); // Must be this exact string
        return;
      }

      // 2. Construct User object (Requirement: Section 5 & 8 shape)
      const newUser: User = {
        id: crypto.randomUUID(), // Generates a unique string id
        email: email,
        password: password,
        createdAt: new Date().toISOString(),
      };

      // 3. Construct Session object (Requirement: Section 5 & 8 shape - No Password!)
      const session: Session = {
        userId: newUser.id,
        email: newUser.email,
      };

      // 4. Save to localStorage using your specific method names
      storage.saveUser(newUser);
      storage.saveSession(session);
      
      // 5. Redirect (Requirement: Section 4)
      router.push("/dashboard");
    } catch (err) {
      setError("An error occurred during signup");
    }
  };

  return (
    <div data-testid="signup-container" className="w-full max-w-md p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-6">Create Account</h2>
      
      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Email Address</label>
          <input
            type="email"
            data-testid="signup-email" // Required ID
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#D3FB52]/50 transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Password</label>
          <input
            type="password"
            data-testid="signup-password" // Required ID
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#D3FB52]/50 transition-colors"
            required
          />
        </div>

        {error && <p className="text-red-400 text-sm italic">{error}</p>}

        <button
          type="submit"
          data-testid="signup-submit" // Required ID
          className="w-full py-4 rounded-xl bg-[#D3FB52] text-black font-bold hover:bg-[#c2e942] transition-transform active:scale-95"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}