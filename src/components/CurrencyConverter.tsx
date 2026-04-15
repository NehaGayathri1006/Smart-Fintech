"use client";

import { useState, useEffect } from "react";
import { 
  ArrowLeftRight, 
  RefreshCw, 
  ChevronDown, 
  TrendingUp, 
  Globe,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

const currencies = [
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "INR", name: "Indian Rupee" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "SGD", name: "Singapore Dollar" },
  { code: "CHF", name: "Swiss Franc" },
  { code: "CNY", name: "Chinese Yuan" },
  { code: "AED", name: "UAE Dirham" },
  { code: "SAR", name: "Saudi Riyal" },
];

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("INR");
  const [rate, setRate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [error, setError] = useState("");

  const fetchRate = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
      const data = await res.json();
      if (data.rates && data.rates[to]) {
        setRate(data.rates[to]);
      } else {
        throw new Error("Rate not found");
      }
    } catch (err) {
      console.error("Failed to fetch rates", err);
      setError("Failed to fetch live rates. Using fallback.");
      // Fallback rates if API fails
      const fallbacks: any = { "USD": { "INR": 83.5, "EUR": 0.92, "GBP": 0.79 }, "INR": { "USD": 0.012, "EUR": 0.011 } };
      setRate(fallbacks[from]?.[to] || 1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRate();
  }, [from, to]);

  const swapCurrencies = () => {
    setIsRotating(true);
    const temp = from;
    setFrom(to);
    setTo(temp);
    setTimeout(() => setIsRotating(false), 500);
  };

  const convertedAmount = rate ? (parseFloat(amount) * rate).toFixed(2) : "0.00";

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
          <RefreshCw className={cn("w-3 h-3", isLoading && "animate-spin")} />
          <span>{isLoading ? "Updating..." : "Updated Real-time"}</span>
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
          <div className="flex-1 w-full relative group">
            <select 
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full bg-slate-900 border border-white/5 rounded-[25px] p-4 text-white appearance-none focus:outline-none focus:border-primary/50 transition-all cursor-pointer font-bold text-sm"
            >
              {currencies.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
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

          <div className="flex-1 w-full relative">
            <select 
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full bg-slate-900 border border-white/5 rounded-[25px] p-4 text-white appearance-none focus:outline-none focus:border-primary/50 transition-all cursor-pointer font-bold text-sm"
            >
              {currencies.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>
        </div>

        <div className="p-8 rounded-[35px] bg-primary/10 border border-primary/10 text-center space-y-2 relative overflow-hidden group">
          <p className="text-primary text-xs font-bold uppercase tracking-widest">Converted Amount</p>
          <div className="flex items-center justify-center gap-2">
            {isLoading ? (
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            ) : (
              <h4 className="text-5xl font-black text-white">
                {to === "INR" ? "₹" : to === "EUR" ? "€" : to === "GBP" ? "£" : ""}{convertedAmount}
              </h4>
            )}
          </div>
          <p className="text-emerald-500/60 text-[10px] font-bold">1 {from} = {rate ? rate.toFixed(4) : "..."} {to}</p>
          <TrendingUp className="absolute -right-4 -bottom-4 w-24 h-24 text-primary/5 group-hover:scale-110 transition-transform" />
        </div>
        {error && <p className="text-center text-[10px] text-rose-500/70">{error}</p>}
      </div>
    </div>
  );
}
