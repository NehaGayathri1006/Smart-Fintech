"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Receipt, 
  Wallet, 
  Target, 
  TrendingUp, 
  Settings, 
  Bell,
  MessageCircle,
  ArrowRightLeft,
  Users,
  PieChart
} from "lucide-react";
import { cn } from "@/lib/utils";



import { useLanguage } from "@/context/LanguageContext";

export default function Sidebar() {
  const pathname = usePathname();
  const { lang, t } = useLanguage();

  const menuItems = [
    { icon: LayoutDashboard, label: t.dashboard, href: "/dashboard" },
    { icon: Receipt, label: t.transactions, href: "/transactions" },
    { icon: ArrowRightLeft, label: t.converter, href: "/converter" },
    { icon: Wallet, label: t.budgets, href: "/budgets" },
    { icon: Target, label: "Savings", href: "/savings" },
    { icon: PieChart, label: "Analysis", href: "/analysis" },
    { icon: Users, label: t.guardian, href: "/guardian" },
    { icon: TrendingUp, label: "Predictions", href: "/predictions" },
  ];

  return (
    <div className="w-64 h-screen glass-dark border-r border-border flex flex-col fixed left-0 top-0 z-40">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          SmartFin
        </h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              pathname === item.href
                ? "bg-primary/20 text-primary border border-primary/20"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5 transition-colors",
              pathname === item.href ? "text-primary" : "group-hover:text-white"
            )} />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20">
          <p className="text-xs text-emerald-400 font-semibold mb-1 uppercase tracking-wider">Pro Plan</p>
          <p className="text-sm text-slate-300 mb-3">
             {lang === "HI" ? "उन्नत भविष्यवाणियां प्राप्त करें" : lang === "TE" ? "అధునాతన అంచనాలను పొందండి" : "Get advanced spending predictions"}
          </p>
          <button className="w-full py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors">
             {lang === "HI" ? "अभी अपग्रेड करें" : lang === "TE" ? "ఇప్పుడే అప్‌గ్రేడ్ చేయండి" : "Upgrade Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
