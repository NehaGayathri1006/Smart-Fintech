"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { 
  Send, 
  DollarSign, 
  User, 
  CreditCard, 
  Smartphone, 
  Banknote, 
  ArrowRight, 
  CheckCircle2, 
  Plus, 
  ShieldCheck,
  Building2,
  Trash2,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import AddCardModal from "@/components/AddCardModal";

interface Card {
  id: string;
  number: string;
  expiry: string;
  brand: "Visa" | "Mastercard" | "RuPay";
  color: string;
}

export default function PaymentsPage() {
  const { t } = useLanguage();
  const [payee, setPayee] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"UPI" | "PAYPAL" | "BANK" | "CARD">("UPI");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string>("");

  const steps = [
    "Verifying Account...",
    "Securing Transaction...",
    "Processing Payment...",
    "Finalizing..."
  ];

  const paymentMethods = [
    { id: "UPI", label: "UPI Transfer", icon: Smartphone, desc: "Instant via UPI App" },
    { id: "CARD", label: "Card Payment", icon: CreditCard, desc: "Direct from saved cards" },
    { id: "PAYPAL", label: "PayPal", icon: CreditCard, desc: "Global PayPal payments" },
    { id: "BANK", label: "Bank Transfer", icon: Banknote, desc: "Direct to bank account" },
  ];

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payee || !amount) return;

    setIsProcessing(true);
    setProcessingStep(0);

    // Simulation sequence
    for (let i = 0; i < steps.length; i++) {
      setProcessingStep(i);
      await new Promise(r => setTimeout(r, 800 + Math.random() * 500));
    }

    setIsProcessing(false);
    
    if (method === "UPI") {
      const upiId = payee.includes("@") ? payee : `${payee}@upi`;
      window.location.href = `upi://pay?pa=${upiId}&pn=Contact&am=${amount}&cu=INR`;
    } else if (method === "PAYPAL") {
      window.open(`https://paypal.me/${payee}/${amount}`, "_blank");
    } else {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const onAddCard = (newCardData: Omit<Card, 'id'>) => {
    const newCard: Card = {
      ...newCardData,
      id: Math.random().toString(),
    };
    setCards([...cards, newCard]);
    setSelectedCardId(newCard.id);
    setMethod("CARD");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-fade-in pt-12 pb-24 px-6">
      <AddCardModal 
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        onAdd={onAddCard}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2 text-left">
          <h1 className="text-5xl font-black text-white tracking-tight">{t.payments}</h1>
          <p className="text-slate-400 text-lg">{t.paymentsDesc}</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-500 text-sm font-bold">
          <ShieldCheck className="w-4 h-4" />
          Bank-Grade Security
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Card Management */}
        <div className="lg:col-span-5 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              My Cards
            </h2>
            <button 
              onClick={() => setIsCardModalOpen(true)}
              className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {cards.length === 0 ? (
              <div 
                onClick={() => setIsCardModalOpen(true)}
                className="h-48 rounded-[32px] border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-3 text-slate-500 hover:border-primary/50 hover:text-primary transition-all cursor-pointer bg-white/5"
              >
                <Plus className="w-8 h-8" />
                <p className="text-sm font-bold uppercase tracking-widest">No Cards Linked</p>
                <p className="text-[10px] text-slate-600">Click to add your first card</p>
              </div>
            ) : (
              cards.map((card) => (
                <motion.div
                  key={card.id}
                  layout
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    setSelectedCardId(card.id);
                    setMethod("CARD");
                  }}
                  className={cn(
                    "relative p-6 rounded-[32px] cursor-pointer transition-all border-2 overflow-hidden h-48 flex flex-col justify-between shadow-2xl shadow-black/40",
                    selectedCardId === card.id 
                      ? "border-primary ring-4 ring-primary/20 scale-[1.02]" 
                      : "border-white/5 opacity-70 grayscale hover:grayscale-0 hover:opacity-100"
                  )}
                >
                  <div className={cn("absolute inset-0 bg-gradient-to-br -z-10", card.color)} />
                  <div className="absolute inset-0 bg-white/5 opacity-20 pointer-events-none" />
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-bold text-white/80">{card.brand}</span>
                    <div className="w-10 h-8 bg-amber-400/20 rounded-md border border-amber-400/30 flex items-center justify-center">
                      <div className="w-6 h-4 bg-amber-400/40 rounded-sm" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white tracking-[0.2em] mb-4">{card.number}</p>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[10px] uppercase text-white/50 tracking-widest">Expiry</p>
                        <p className="text-sm font-bold text-white">{card.expiry}</p>
                      </div>
                      <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full bg-rose-500/80" />
                        <div className="w-6 h-6 rounded-full bg-amber-500/80" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Quick Bank Transfer Card */}
          <div className="p-6 rounded-[32px] glass-dark border border-white/5 space-y-4 group cursor-pointer hover:border-primary/30 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-white font-bold">Main Savings Bank</p>
                <p className="text-xs text-slate-500">**** 9090 • Verified Account</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Payment Form */}
        <div className="lg:col-span-7">
          <div className="glass-dark border border-white/5 rounded-[40px] p-8 md:p-12 relative overflow-hidden shadow-2xl h-full">
            {/* Success Overlay */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 bg-slate-900/95 backdrop-blur-xl flex flex-col items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6"
                  >
                    <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                  </motion.div>
                  <h2 className="text-3xl font-black text-white">Transfer Sent!</h2>
                  <p className="text-slate-400 mt-2">₹{amount} sent successfully to {payee}</p>
                  <button 
                    onClick={() => setShowSuccess(false)}
                    className="mt-10 px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl transition-all"
                  >
                    Done
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handlePayment} className="space-y-10">
              
              {/* Amount Input */}
              <div className="space-y-4 text-center">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">{t.amountToPay}</label>
                <div className="relative flex items-center justify-center">
                  <span className="text-5xl font-black text-primary/40 mr-2">₹</span>
                  <input 
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    required
                    min="1"
                    className="bg-transparent text-7xl font-black text-white text-center w-full max-w-[280px] focus:outline-none placeholder:text-slate-800"
                  />
                </div>
              </div>

              {/* Payee Input */}
              <div className="space-y-4">
                <div className="flex justify-between px-2">
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">{t.payee}</label>
                  <span className="text-xs text-primary font-bold cursor-pointer hover:underline">Select Contact</span>
                </div>
                <div className="relative">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500" />
                  <input 
                    type="text"
                    value={payee}
                    onChange={(e) => setPayee(e.target.value)}
                    placeholder="UPI ID, Account No, or Name"
                    required
                    className="w-full bg-slate-900 border border-white/5 rounded-3xl py-6 pl-16 pr-8 text-white font-bold focus:outline-none focus:border-primary/50 transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-widest pl-2">{t.selectPaymentMethod}</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {paymentMethods.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMethod(m.id as any)}
                      className={cn(
                        "flex flex-col items-center justify-center p-4 rounded-3xl border transition-all text-center gap-3",
                        method === m.id 
                          ? "bg-primary text-white border-primary shadow-lg shadow-primary/30" 
                          : "bg-slate-900 border-white/5 hover:border-white/20 text-slate-500 hover:text-slate-300"
                      )}
                    >
                      <m.icon className="w-6 h-6" />
                      <span className="text-[10px] font-black uppercase tracking-tighter">{m.label.split(" ")[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit"
                disabled={isProcessing || !amount || !payee}
                className="w-full py-6 bg-primary text-white font-black text-xl rounded-3xl hover:bg-primary-dark transition-all shadow-2xl shadow-primary/40 flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed group h-20"
              >
                {isProcessing ? (
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{steps[processingStep]}</span>
                    </div>
                  </div>
                ) : (
                  <>
                    Confirm & Send
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </button>

              <p className="text-center text-[10px] text-slate-500 uppercase tracking-[0.2em]">
                Protected by 256-bit AES Encryption
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

