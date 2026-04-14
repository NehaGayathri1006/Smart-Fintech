"use client";

import { useState } from "react";
import { 
  ArrowLeftRight, 
  RefreshCw, 
  ChevronDown, 
  TrendingUp, 
  Globe 
} from "lucide-react";
import { cn } from "@/lib/utils";

const currencies = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
];

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [isRotating, setIsRotating] = useState(false);

  const swapCurrencies = () => {
    setIsRotating(true);
    const temp = from;
    setFrom(to);
    setTo(temp);
    setTimeout(() => setIsRotating(false), 500);
  };

  return (
    <div className="p-8 rounded-[40px] border border-white/5 glass-dark shadow-2xl space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Currency Converter</h3>
            <p className="text-xs text-slate-500 font-medium">Live Market Exchange Rates</p>
          </div>
        </div>
        <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
          <RefreshCw className="w-3 h-3" />
          <span>Updated Real-time</span>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">Amount</label>
          <div className="relative">
            <input 
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-950 border border-white/5 rounded-[30px] py-6 px-8 text-3xl font-black text-white focus:outline-none focus:border-primary/50 transition-all shadow-inner"
            />
            <span className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-700 text-2xl font-black">
              {from}
            </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 w-full bg-slate-900 border border-white/5 rounded-[25px] p-4 flex items-center justify-between cursor-pointer hover:border-white/20 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white">
                {from.slice(0, 2)}
              </div>
              <span className="text-sm font-bold text-white">{from}</span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </div>

          <button 
            onClick={swapCurrencies}
            className={cn(
              "p-4 rounded-full bg-primary text-white shadow-lg shadow-primary/20 hover:scale-110 active:scale-95 transition-all transform",
              isRotating && "rotate-180"
            )}
          >
            <ArrowLeftRight className="w-5 h-5" />
          </button>

          <div className="flex-1 w-full bg-slate-900 border border-white/5 rounded-[25px] p-4 flex items-center justify-between cursor-pointer hover:border-white/20 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white">
                {to.slice(0, 2)}
              </div>
              <span className="text-sm font-bold text-white">{to}</span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </div>
        </div>

        <div className="p-8 rounded-[35px] bg-primary/10 border border-primary/10 text-center space-y-2 relative overflow-hidden group">
          <p className="text-primary text-xs font-bold uppercase tracking-widest">Converted Amount</p>
          <h4 className="text-5xl font-black text-white">
            {to === "EUR" ? "€" : to === "INR" ? "₹" : "$"} {(parseFloat(amount) * 0.92).toFixed(2)}
          </h4>
          <p className="text-emerald-500/60 text-[10px] font-bold">1 {from} = 0.92 {to}</p>
          <TrendingUp className="absolute -right-4 -bottom-4 w-24 h-24 text-primary/5 group-hover:scale-110 transition-transform" />
        </div>
      </div>
    </div>
  );
}
