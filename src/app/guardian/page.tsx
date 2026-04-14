"use client";

import { useState } from "react";
import { 
  Users, 
  ShieldCheck, 
  Key, 
  ChevronRight, 
  Eye, 
  Lock, 
  Smartphone,
  Copy,
  Check,
  AlertCircle,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function GuardianPage() {
  const [role, setRole] = useState<"guardian" | "child" | null>(null);
  const [code, setCode] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [guardianCode, setGuardianCode] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ text: "", isError: false });

  const handleSelectGuardian = async () => {
    setIsLoading(true);
    setRole("guardian");
    try {
      const res = await fetch("/api/guardian/generate", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setGuardianCode(data.code);
    } catch (err: any) {
      alert("Failed to generate code: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkChild = async () => {
    if (!code) return;
    setIsLoading(true);
    setStatusMsg({ text: "", isError: false });
    try {
      const res = await fetch("/api/guardian/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStatusMsg({ text: "Accounts securely linked! Your guardian now has view-access.", isError: false });
    } catch (err: any) {
      setStatusMsg({ text: err.message || "Failed to link", isError: true });
    } finally {
      setIsLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(guardianCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in py-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-primary/10 rounded-[30px] flex items-center justify-center mx-auto mb-6 border border-primary/20">
          <ShieldCheck className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl font-black text-white px-2">GuardianLink Oversight</h1>
        <p className="text-slate-400 max-w-lg mx-auto leading-relaxed">
          Securely link accounts to provide financial oversight for children while maintaining their privacy and independence.
        </p>
      </div>

      {!role ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Guardian Option */}
          <button 
            onClick={handleSelectGuardian}
            disabled={isLoading}
            className="p-10 rounded-[50px] border border-white/5 glass-dark hover:border-primary/50 transition-all group relative overflow-hidden text-left disabled:opacity-50"
          >
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">I'm a Guardian</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Generate a secure code to link your child's account and monitor their spending habits.
              </p>
            </div>
            <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all">
              {isLoading ? <Loader2 className="w-8 h-8 text-primary animate-spin" /> : <ChevronRight className="w-8 h-8 text-primary" />}
            </div>
          </button>

          {/* Child Option */}
          <button 
            onClick={() => setRole("child")}
            className="p-10 rounded-[50px] border border-white/5 glass-dark hover:border-emerald-500/50 transition-all group relative overflow-hidden text-left"
          >
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-emerald-500 mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                <Smartphone className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">I'm a Student</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Enter the code provided by your guardian to grant them read-only oversight access.
              </p>
            </div>
            <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all">
              <ChevronRight className="w-8 h-8 text-emerald-500" />
            </div>
          </button>
        </div>
      ) : role === "guardian" ? (
        <div className="p-12 rounded-[60px] border border-white/5 glass-dark text-center space-y-8 max-w-2xl mx-auto">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">Your Sharing Code</h3>
            <p className="text-slate-500 text-sm">Give this code to your child to start oversight.</p>
          </div>
          
          <div className="flex items-center justify-center gap-4 bg-slate-950 p-6 rounded-[30px] border border-white/5 min-h-[100px]">
            {isLoading ? (
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            ) : (
              <>
                <span className="text-4xl font-black text-primary tracking-widest">{guardianCode}</span>
                <button 
                  onClick={copyCode}
                  className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                >
                  {isCopied ? <Check className="w-6 h-6 text-emerald-500" /> : <Copy className="w-6 h-6" />}
                </button>
              </>
            )}
          </div>

          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 text-left space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/20 text-primary">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Read-Only Access</p>
                <p className="text-xs text-slate-500">You can see transactions but cannot move funds.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/20 text-primary">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Secure Sync</p>
                <p className="text-xs text-slate-500">Linking is encrypted and can be revoked at any time.</p>
              </div>
            </div>
          </div>

          <button 
            onClick={() => { setRole(null); setGuardianCode(""); }}
            className="text-slate-500 text-sm hover:text-white transition-colors"
          >
            Back to selection
          </button>
        </div>
      ) : (
        <div className="p-12 rounded-[60px] border border-white/5 glass-dark text-center space-y-8 max-w-2xl mx-auto">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">Enter Link Code</h3>
            <p className="text-slate-500 text-sm">Enter the code provided by your parent or guardian.</p>
          </div>

          <div className="relative">
            <Key className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-600" />
            <input 
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="XX-XXX-XXX"
              className="w-full bg-slate-950 border border-white/10 rounded-[30px] py-6 px-16 text-2xl font-black text-white tracking-widest focus:outline-none focus:border-emerald-500 transition-all text-center"
            />
          </div>

          <div className="flex items-start gap-3 text-left p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-400">
              By entering this code, you are granting read-only access to your transactions and budget history to the guardian associated with this code.
            </p>
          </div>

          {statusMsg.text && (
            <div className={cn("p-4 rounded-xl text-sm font-medium", statusMsg.isError ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-500")}>
              {statusMsg.text}
            </div>
          )}

          <button 
             onClick={handleLinkChild}
             disabled={isLoading || !code}
             className="w-full py-6 bg-emerald-500 text-white font-black rounded-[30px] hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
            <span>Link Account</span>
          </button>

          <button 
            onClick={() => { setRole(null); setCode(""); setStatusMsg({text: "", isError: false}); }}
            className="text-slate-500 text-sm hover:text-white transition-colors"
          >
            Back to selection
          </button>
        </div>
      )}
    </div>
  );
}
