"use client";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  Cell,
  PieChart,
  Pie
} from "recharts";

import { useLanguage } from "@/context/LanguageContext";

interface ChartProps {
  areaData: any[];
  pieData: any[];
}

export default function DashboardCharts({ areaData, pieData }: ChartProps) {
  const { lang, t } = useLanguage();
  const defaultPieData = [
    { name: t.notEnoughData, value: 100, color: "#334155" },
  ];

  const activePieData = pieData && pieData.length > 0 ? pieData : defaultPieData;
  const activeAreaData = areaData && areaData.length > 0 ? areaData : [
    { name: "Mon", income: 0, expenses: 0 },
    { name: "Tue", income: 0, expenses: 0 },
    { name: "Wed", income: 0, expenses: 0 },
    { name: "Thu", income: 0, expenses: 0 },
    { name: "Fri", income: 0, expenses: 0 },
    { name: "Sat", income: 0, expenses: 0 },
    { name: "Sun", income: 0, expenses: 0 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8 min-w-0">
      {/* Spending Trends */}
      <div className="lg:col-span-2 p-6 rounded-3xl border border-white/5 glass-dark min-h-[400px] min-w-0">
        <h3 className="text-lg font-bold mb-6 text-white">
          {t.expenseVsIncome}
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activeAreaData}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "12px" }}
                itemStyle={{ fontSize: "12px" }}
              />
              <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2} />
              <Area type="monotone" dataKey="expenses" stroke="#f43f5e" fillOpacity={1} fill="url(#colorExpense)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="p-6 rounded-3xl border border-white/5 glass-dark min-h-[400px] min-w-0">
        <h3 className="text-lg font-bold mb-6 text-white">
          {t.categoryBreakdown}
        </h3>
        <div className="h-[300px] w-full flex flex-col items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={activePieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {activePieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "12px" }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-4 w-full px-4">
            {activePieData.map((cat, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                <span className="text-xs text-slate-400">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
