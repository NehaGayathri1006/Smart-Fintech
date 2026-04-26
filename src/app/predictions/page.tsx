"use client";

import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  BrainCircuit, 
  Calendar, 
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useLanguage } from "@/context/LanguageContext";

export default function PredictionsPage() {
  const { t } = useLanguage();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/predictions")
      .then(res => res.json())
      .then(resData => {
        setData(resData);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div className="h-[60vh] flex items-center justify-center text-slate-500">{t.loadingAnalysis}</div>;
  if (!data) return <div className="h-[60vh] flex items-center justify-center text-slate-500">{t.noAnalysisData}</div>;

  const insights = data.insights.map((ins: any) => ({
    title: ins.title,
    desc: ins.description,
    type: ins.type,
    icon: ins.type === "success" ? Sparkles : ins.type === "warning" ? AlertCircle : BrainCircuit,
    color: ins.type === "success" ? "text-emerald-500" : ins.type === "warning" ? "text-rose-500" : "text-blue-500",
    bgColor: ins.type === "success" ? "bg-emerald-500/10" : ins.type === "warning" ? "bg-rose-500/10" : "bg-blue-500/10"
  }));

  return (
    <div className="space-y-12 animate-fade-in pb-20">
      {/* Hero Section */}
      <div className="relative p-12 rounded-[60px] border border-white/5 overflow-hidden glass-dark">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full w-fit">
              <BrainCircuit className="w-4 h-4 text-primary" />
              <span className="text-xs font-black text-primary uppercase tracking-[0.2em]">{t.neuralEngineActive}</span>
            </div>
            <h1 className="text-5xl font-black text-white leading-tight">
              {t.aiSpendingPredictions.split(' ').slice(0, 2).join(' ')} <br />
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">{t.aiSpendingPredictions.split(' ').slice(2).join(' ')}</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              {t.inDepthBreakdown}
            </p>
            <div className="flex items-center gap-4">
              <button className="px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center gap-2">
                {t.generateFullReport}
                <ArrowRight className="w-5 h-5" />
              </button>
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] text-white font-bold">
                    AI
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-8 rounded-[40px] bg-slate-950/50 border border-white/10 backdrop-blur-3xl">
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-bold">{t.projectedNetMonthly}</h3>
                <Calendar className="w-5 h-5 text-slate-500" />
              </div>
              <div className="space-y-4">
                <div className="flex items-end justify-between">
                  <span className="text-4xl font-black text-white">₹{data.projectedSpend.toLocaleString()}</span>
                  <span className={cn("font-bold mb-1", parseFloat(data.trendPercent) > 0 ? "text-rose-500" : "text-emerald-500")}>
                    {parseFloat(data.trendPercent) > 0 ? "+" : ""}{data.trendPercent}% {t.vsLastMonth}
                  </span>
                </div>
                <div className="h-4 w-full bg-slate-900 rounded-full overflow-hidden flex">
                  <div className="h-full bg-primary w-[70%]" />
                  <div className="h-full bg-slate-800 w-[30%]" />
                </div>
                <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <span>{t.currentSpending}</span>
                  <span>{t.safetyMargin}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {insights.map((insight: any, i: number) => (
          <div key={i} className="p-8 rounded-[40px] border border-white/5 glass-dark group hover:border-white/10 transition-all relative">
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", insight.bgColor, insight.color)}>
              <insight.icon className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{insight.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              {insight.desc}
            </p>
            <button className={cn("text-sm font-bold flex items-center gap-2 transition-all group-hover:gap-3", insight.color)}>
              {t.takeAction} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Safety Score Section */}
      <div className="p-10 rounded-[50px] border border-white/5 bg-gradient-to-r from-slate-900 to-primary/5 flex flex-col md:flex-row items-center gap-10">
        <div className="w-40 h-40 rounded-full border-[10px] border-slate-800 flex items-center justify-center relative">
          <div className="absolute inset-0 rounded-full border-[10px] border-primary border-t-transparent -rotate-45" />
          <div className="text-center">
            <p className="text-4xl font-black text-white">{data.safetyScore}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t.safetyScore}</p>
          </div>
        </div>
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-2 text-primary font-bold">
            <ShieldCheck className="w-5 h-5" />
            <span>{t.excellentSecurity}</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
            {t.safetyScoreDesc}
          </p>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <AlertCircle className="w-3 h-3" />
              {t.debtRatio} 12%
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <AlertCircle className="w-3 h-3" />
              {t.emergencyFund} 6 {t.monthsNum}
            </div>
          </div>
        </div>
        <button className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all text-sm shrink-0">
          {t.viewDetailedAudit}
        </button>
      </div>
    </div>
  );
}
