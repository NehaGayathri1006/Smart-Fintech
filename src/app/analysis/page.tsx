"use client";

import { useState, useEffect } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import { 
  ArrowDownCircle, 
  Calendar,
  Filter,
  Download,
  TrendingUp,
  Activity,
  Zap,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";

// Map display range labels to number-of-months for the API
const rangeToMonths: Record<string, number> = {
  oneMonth: 1,
  threeMonths: 3,
  sixMonths: 6,
  oneYear: 12,
};

export default function AnalysisPage() {
  const { t } = useLanguage();
  const [timeRange, setTimeRange] = useState<keyof typeof rangeToMonths>("sixMonths");
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const months = rangeToMonths[timeRange];
    fetch(`/api/analysis?months=${months}`)
      .then(res => res.json())
      .then(data => {
        setAnalysisData(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [timeRange]); // re-fetch whenever timeRange changes

  const timeRanges: { key: keyof typeof rangeToMonths; label: string }[] = [
    { key: "oneMonth",    label: t.oneMonth },
    { key: "threeMonths", label: t.threeMonths },
    { key: "sixMonths",   label: t.sixMonths },
    { key: "oneYear",     label: t.oneYear },
  ];

  if (isLoading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center text-slate-500 gap-4">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full"
      />
      <span className="font-bold tracking-widest uppercase text-xs">{t.loadingAnalysis}</span>
    </div>
  );
  if (!analysisData) return (
    <div className="h-[60vh] flex items-center justify-center text-slate-500 font-bold uppercase tracking-widest">
      {t.noAnalysisData}
    </div>
  );

  const { categoryData, monthlyTrends, totalMonthlySpend } = analysisData;
  const avgMonthlySpend = totalMonthlySpend / (rangeToMonths[timeRange] || 1);

  return (
    <div className="space-y-12 animate-fade-in pb-24 px-4 max-w-7xl mx-auto">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest mb-1">
            <Activity className="w-4 h-4" />
            Live Insights
          </div>
          <h1 className="text-6xl font-black text-white tracking-tighter">{t.budgetAnalysis}</h1>
          <p className="text-slate-400 text-lg max-w-xl">{t.inDepthBreakdown}</p>
        </div>
        
        <div className="flex items-center gap-2 p-1.5 bg-slate-900/50 border border-white/5 rounded-2xl backdrop-blur-xl">
          {timeRanges.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTimeRange(key)}
              className={cn(
                "px-5 py-2.5 rounded-xl text-xs font-black transition-all uppercase tracking-wider",
                timeRange === key ? "bg-primary text-white shadow-xl shadow-primary/20" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div whileHover={{ y: -5 }} className="p-8 rounded-[40px] border border-white/5 glass-dark bg-gradient-to-br from-emerald-500/10 to-transparent relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp className="w-20 h-20 text-emerald-500" />
          </div>
          <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{t.topSpendingCategory}</h3>
          <p className="text-3xl font-black text-white mt-3 truncate">{categoryData[0]?.name || "None"}</p>
          <div className="flex items-center gap-2 mt-4 text-emerald-500 text-xs font-bold">
            <Zap className="w-3 h-3" />
            {t.basedOnCurrentMonth}
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="p-8 rounded-[40px] border border-white/5 glass-dark bg-gradient-to-br from-blue-500/10 to-transparent relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <ArrowDownCircle className="w-20 h-20 text-blue-500" />
          </div>
          <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{t.monthlySpend}</h3>
          <p className="text-3xl font-black text-white mt-3">₹{totalMonthlySpend.toLocaleString()}</p>
          <div className="flex items-center gap-2 mt-4 text-blue-500 text-xs font-bold">
            <Calendar className="w-3 h-3" />
            {t.currentBillingCycle}
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="p-8 rounded-[40px] border border-white/5 glass-dark bg-gradient-to-br from-amber-500/10 to-transparent relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Target className="w-20 h-20 text-amber-500" />
          </div>
          <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Monthly Average</h3>
          <p className="text-3xl font-black text-white mt-3">₹{Math.round(avgMonthlySpend).toLocaleString()}</p>
          <div className="flex items-center gap-2 mt-4 text-amber-500 text-xs font-bold">
            <Activity className="w-3 h-3" />
            Based on {rangeToMonths[timeRange]} Months
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="p-8 rounded-[40px] border border-white/5 glass-dark bg-gradient-to-br from-violet-500/10 to-transparent relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Filter className="w-20 h-20 text-violet-500" />
          </div>
          <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{t.categoriesCount}</h3>
          <p className="text-3xl font-black text-white mt-3">{categoryData.length}</p>
          <div className="flex items-center gap-2 mt-4 text-violet-500 text-xs font-bold">
            <Zap className="w-3 h-3" />
            {t.activeSpendCategories}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-w-0">
        
        {/* Main Chart Area */}
        <div className="lg:col-span-8 p-10 rounded-[50px] border border-white/5 glass-dark min-w-0">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-2xl font-black text-white tracking-tight">{t.spendingTrends}</h3>
              <p className="text-slate-500 text-xs mt-1 font-bold uppercase tracking-widest">Revenue vs Expenses Flow</p>
            </div>
            <div className="flex gap-3">
              <button className="p-3 rounded-2xl bg-white/5 text-slate-400 hover:text-white transition-colors"><Download className="w-4 h-4" /></button>
              <button className="p-3 rounded-2xl bg-white/5 text-slate-400 hover:text-white transition-colors"><Filter className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="h-[450px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrends}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="#475569" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10}
                  fontFamily="Inter"
                  fontWeight="bold"
                />
                <YAxis 
                  stroke="#475569" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(val) => `₹${val}`}
                  fontFamily="Inter"
                  fontWeight="bold"
                />
                <Tooltip 
                  cursor={{ stroke: '#8b5cf6', strokeWidth: 2, strokeDasharray: '5 5' }}
                  contentStyle={{ 
                    backgroundColor: "rgba(15, 23, 42, 0.9)", 
                    border: "1px solid rgba(255, 255, 255, 0.1)", 
                    borderRadius: "24px",
                    backdropFilter: "blur(12px)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
                  }}
                  itemStyle={{ color: "#fff", fontWeight: "bold" }}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#8b5cf6" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorAmount)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Sidebar */}
        <div className="lg:col-span-4 p-10 rounded-[50px] border border-white/5 glass-dark min-w-0 flex flex-col">
          <div className="mb-10">
            <h3 className="text-2xl font-black text-white tracking-tight">{t.categoryMix}</h3>
            <p className="text-slate-500 text-xs mt-1 font-bold uppercase tracking-widest">Portfolio Distribution</p>
          </div>
          
          <div className="h-[280px] w-full mb-10">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  animationBegin={500}
                  animationDuration={1500}
                >
                  {categoryData.map((entry: { color: string }, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "20px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            {categoryData.length === 0 ? (
              <p className="text-slate-500 text-sm italic">{t.noCategoryData}</p>
            ) : (
              categoryData.map((cat: any, i: number) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={i} 
                  className="flex items-center justify-between group p-3 rounded-2xl hover:bg-white/5 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-2.5 h-2.5 rounded-full shadow-lg shadow-current" style={{ backgroundColor: cat.color }} />
                    <span className="text-sm font-black text-white/90 group-hover:text-white transition-colors">{cat.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-slate-400 font-bold">₹{cat.value.toLocaleString()}</span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
