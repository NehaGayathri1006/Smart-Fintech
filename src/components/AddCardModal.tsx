"use client";

import { useState } from "react";
import { X, CreditCard, ShieldCheck, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (card: { number: string; expiry: string; brand: "Visa" | "Mastercard" | "RuPay"; color: string }) => void;
}

export default function AddCardModal({ isOpen, onClose, onAdd }: AddCardModalProps) {
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatCardNumber = (val: string) => {
    const v = val.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (number.replace(/\s/g, "").length < 16) newErrors.number = "Invalid card number";
    if (!/^\d{2}\/\d{2}$/.test(expiry)) newErrors.expiry = "Use MM/YY format";
    if (cvv.length < 3) newErrors.cvv = "Invalid CVV";
    if (name.length < 3) newErrors.name = "Full name required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Determine brand based on first digit
    const firstDigit = number[0];
    let brand: "Visa" | "Mastercard" | "RuPay" = "Visa";
    if (firstDigit === "5") brand = "Mastercard";
    if (firstDigit === "6") brand = "RuPay";

    const colors = [
      "from-blue-600 to-indigo-800",
      "from-rose-600 to-orange-700",
      "from-emerald-600 to-teal-800",
      "from-violet-600 to-purple-800",
      "from-slate-700 to-slate-900"
    ];

    onAdd({
      number: "**** " + number.slice(-4),
      expiry,
      brand,
      color: colors[Math.floor(Math.random() * colors.length)]
    });

    // Reset and close
    setNumber("");
    setExpiry("");
    setCvv("");
    setName("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-[40px] shadow-2xl overflow-hidden"
          >
            <div className="p-8 space-y-8">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-white">Add New Card</h2>
                  <p className="text-slate-500 text-sm font-medium">Link your bank card securely</p>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 rounded-full bg-white/5 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Preview Card */}
              <div className="relative p-6 rounded-3xl bg-gradient-to-br from-primary to-primary-dark aspect-[1.58/1] overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-white/5 opacity-20 pointer-events-none" />
                <div className="flex justify-between items-start">
                  <CreditCard className="w-8 h-8 text-white/80" />
                  <div className="w-10 h-10 bg-amber-400/20 rounded-lg flex items-center justify-center">
                    <div className="w-6 h-4 bg-amber-400/40 rounded-sm" />
                  </div>
                </div>
                <div className="mt-8">
                  <p className="text-xl font-bold text-white tracking-[0.2em]">
                    {number || "•••• •••• •••• ••••"}
                  </p>
                </div>
                <div className="mt-auto flex justify-between items-end">
                  <div>
                    <p className="text-[8px] uppercase text-white/50 tracking-widest">Card Holder</p>
                    <p className="text-xs font-bold text-white truncate w-32">{name || "YOUR NAME"}</p>
                  </div>
                  <div>
                    <p className="text-[8px] uppercase text-white/50 tracking-widest">Expires</p>
                    <p className="text-xs font-bold text-white">{expiry || "MM/YY"}</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Card Number</label>
                  <input 
                    type="text"
                    value={number}
                    onChange={(e) => setNumber(formatCardNumber(e.target.value))}
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    className={cn(
                      "w-full bg-slate-950 border border-white/5 rounded-2xl py-4 px-6 text-white font-bold focus:outline-none focus:border-primary transition-all",
                      errors.number && "border-rose-500/50 focus:border-rose-500"
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Expiry Date</label>
                    <input 
                      type="text"
                      value={expiry}
                      onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, "");
                        if (val.length > 2) val = val.slice(0, 2) + "/" + val.slice(2, 4);
                        setExpiry(val);
                      }}
                      placeholder="MM/YY"
                      maxLength={5}
                      className={cn(
                        "w-full bg-slate-950 border border-white/5 rounded-2xl py-4 px-6 text-white font-bold focus:outline-none focus:border-primary transition-all",
                        errors.expiry && "border-rose-500/50 focus:border-rose-500"
                      )}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">CVV</label>
                    <input 
                      type="password"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                      placeholder="•••"
                      maxLength={3}
                      className={cn(
                        "w-full bg-slate-950 border border-white/5 rounded-2xl py-4 px-6 text-white font-bold focus:outline-none focus:border-primary transition-all",
                        errors.cvv && "border-rose-500/50 focus:border-rose-500"
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Card Holder Name</label>
                  <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value.toUpperCase())}
                    placeholder="JANE DOE"
                    className={cn(
                      "w-full bg-slate-950 border border-white/5 rounded-2xl py-4 px-6 text-white font-bold focus:outline-none focus:border-primary transition-all",
                      errors.name && "border-rose-500/50 focus:border-rose-500"
                    )}
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
                >
                  <ShieldCheck className="w-5 h-5" />
                  Save Card Securely
                </button>
              </form>

              <div className="flex items-center justify-center gap-4 text-slate-500">
                <div className="flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">PCI-DSS Compliant</span>
                </div>
                <div className="w-1 h-1 bg-slate-800 rounded-full" />
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">SSL Encrypted</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
