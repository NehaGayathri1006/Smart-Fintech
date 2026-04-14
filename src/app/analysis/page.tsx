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
  Pie
} from "recharts";
import { 
  PieChart as PieChartIcon, 
  TrendingUp, 
  ArrowDownCircle, 
  Calendar,
  Filter,
  Download
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AnalysisPage() {
  const [timeRange, setTimeRange] = useState("6 Months");
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analysis")
      .then(res => res.json())
      .then(data => {
        setAnalysisData(data);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <div className="h-[60vh] flex items-center justify-center text-slate-500">Loading analysis...</div>;
  if (!analysisData) return <div className="h-[60vh] flex items-center justify-center text-slate-500">No analysis data available.</div>;

  const { categoryData, monthlyTrends, totalMonthlySpend } = analysisData;


  return (
    <div className="space-y-10 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white">Budget Analysis</h1>
          <p className="text-slate-400 mt-2">In-depth breakdown of your spending behavior.</p>
        </div>
        
        <div className="flex flex-wrap gap-2 p-1 bg-slate-900 border border-white/5 rounded-2xl">
          {["1 Month", "3 Months", "6 Months", "1 Year"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                timeRange === range ? "bg-primary text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
              )}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Top Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-8 rounded-[40px] border border-white/5 glass-dark bg-gradient-to-br from-emerald-500/10 to-transparent">
          <h3 className="text-slate-400 text-sm font-bold uppercase tracking-widest">Top Spending Category</h3>
          <p className="text-3xl font-black text-white mt-2">{categoryData[0]?.name || "None"}</p>
          <p className="text-xs text-emerald-500 font-bold mt-2">Based on current month data</p>
        </div>
        <div className="p-8 rounded-[40px] border border-white/5 glass-dark bg-gradient-to-br from-blue-500/10 to-transparent">
          <ArrowDownCircle className="w-8 h-8 text-blue-500 mb-4" />
          <h3 className="text-slate-400 text-sm font-bold uppercase tracking-widest">Monthly spend</h3>
          <p className="text-3xl font-black text-white mt-2">${totalMonthlySpend.toLocaleString()}</p>
          <p className="text-xs text-blue-500 font-bold mt-2">Current billing cycle</p>
        </div>
        <div className="p-8 rounded-[40px] border border-white/5 glass-dark bg-gradient-to-br from-amber-500/10 to-transparent">
          <Calendar className="w-8 h-8 text-amber-500 mb-4" />
          <h3 className="text-slate-400 text-sm font-bold uppercase tracking-widest">Categories Count</h3>
          <p className="text-3xl font-black text-white mt-2">{categoryData.length}</p>
          <p className="text-xs text-amber-500 font-bold mt-2">Active spend categories</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Spending Breakdown */}
        <div className="p-10 rounded-[50px] border border-white/5 glass-dark">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-bold text-white">Spending Trends</h3>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg bg-white/5 text-slate-400"><Download className="w-4 h-4" /></button>
              <button className="p-2 rounded-lg bg-white/5 text-slate-400"><Filter className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "20px" }}
                />
                <Bar dataKey="amount" fill="#7c3aed" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Percentages */}
        <div className="p-10 rounded-[50px] border border-white/5 glass-dark">
          <h3 className="text-xl font-bold text-white mb-10">Category Mix</h3>
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="h-[300px] w-full md:w-1/2">
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
                  >
                    {categoryData.map((entry: { color: string }, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                     contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "20px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-4 w-full">
              {categoryData.length === 0 ? (
                <p className="text-slate-500 text-sm">No category data yet.</p>
              ) : (
                categoryData.map((cat: any, i: number) => (
                  <div key={i} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-sm font-bold text-white">{cat.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-slate-300 font-bold">${cat.value.toLocaleString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
