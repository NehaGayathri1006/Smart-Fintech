"use client";

import { useState, useEffect, Suspense } from "react";
import { 
  Mail, 
  Lock, 
  ChevronRight, 
  ArrowRight, 
  Fingerprint, 
  ShieldCheck,
  Globe
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

function LoginContent() {
  const searchParams = useSearchParams();
  const [isLogin, setIsLogin] = useState(searchParams.get("signup") !== "true");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(searchParams.get("error") === "OAuthSignin" ? "Error: Your Google API credentials (Client ID/Secret) are missing or invalid in the .env file." : "");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isLogin) {
        // Handle Login
        const res = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (res?.error) {
          setError("Invalid email or password");
        } else {
          router.push("/dashboard");
        }
      } else {
        // Handle Registration
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password })
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Registration failed");
          return;
        }

        // Auto login after registration
        await signIn("credentials", {
          redirect: false,
          email,
          password,
        });
        
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#020817] flex flex-col items-center justify-center p-4">
      {/* Background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[140px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10 glass-dark rounded-[40px] border border-white/10 overflow-hidden shadow-[0_0_100px_rgba(16,185,129,0.05)]"
      >
        {/* Toggle Header */}
        <div className="flex p-2 bg-white/5 border-b border-white/5">
          <button 
            type="button"
            onClick={() => setIsLogin(true)}
            className={cn(
              "flex-1 py-3 rounded-[30px] text-sm font-bold transition-all duration-300",
              isLogin ? "bg-primary text-white shadow-lg shadow-primary/20 scale-100" : "text-slate-400 hover:text-white"
            )}
          >
            Sign In
          </button>
          <button 
            type="button"
            onClick={() => setIsLogin(false)}
            className={cn(
              "flex-1 py-3 rounded-[30px] text-sm font-bold transition-all duration-300",
              !isLogin ? "bg-primary text-white shadow-lg shadow-primary/20 scale-100" : "text-slate-400 hover:text-white"
            )}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-6">
          <div className="text-center space-y-2 mb-4">
            <h2 className="text-3xl font-black text-white tracking-tight">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-slate-400 text-sm">
              {isLogin ? "Manage your finances with AI insights." : "Start your journey to financial freedom."}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                animate={{ opacity: 1, height: "auto", scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                className="p-3 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-sm font-semibold text-center mt-2"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            <AnimatePresence>
              {!isLogin && (
                <motion.div 
                   initial={{ opacity: 0, height: 0 }}
                   animate={{ opacity: 1, height: "auto" }}
                   exit={{ opacity: 0, height: 0 }}
                   className="relative group overflow-hidden"
                >
                  <div className="py-1">
                    <input 
                      type="text" 
                      placeholder="Full Name"
                      required={!isLogin}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#040C1A] border border-white/10 rounded-2xl py-4 px-12 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-slate-500 shadow-inner"
                    />
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Email Address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#040C1A] border border-white/10 rounded-2xl py-4 px-12 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-slate-500 shadow-inner"
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
            </div>

            <div className="relative group">
              <input 
                type="password" 
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#040C1A] border border-white/10 rounded-2xl py-4 px-12 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-slate-500 shadow-inner"
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 py-4 bg-primary text-white font-black rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:pointer-events-none"
          >
            <span>{isLoading ? "Processing..." : isLogin ? "Unlock Workspace" : "Get Started"}</span>
            {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
          </button>
          
          <div className="flex items-center justify-between text-xs text-slate-400 px-2 mt-6">
            <button type="button" className="hover:text-primary transition-colors font-medium">Forgot password?</button>
            <div className="flex items-center gap-2 font-medium">
              <Globe className="w-4 h-4 text-slate-500" />
              <span>English (US)</span>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 mt-6">
            <button 
              type="button" 
              onClick={() => signIn("google")}
              className="w-full py-4 bg-white/[0.03] border border-white/5 text-slate-300 rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-sm font-bold tracking-wide">Continue with Google</span>
            </button>
          </div>
        </form>
      </motion.div>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-8 text-slate-500 text-xs text-center max-w-xs uppercase tracking-[0.2em] font-bold"
      >
        Securely Encrypted <span className="text-primary mx-1">•</span> GDRP Compliant <span className="text-primary mx-1">•</span> AI Verified
      </motion.p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="fixed inset-0 z-50 bg-[#020817] flex items-center justify-center p-4"></div>}>
      <LoginContent />
    </Suspense>
  );
}
