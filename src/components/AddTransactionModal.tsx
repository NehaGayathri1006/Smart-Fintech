"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Camera, Sparkles, Loader2, DollarSign, Type, Tag } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}



export default function AddTransactionModal({ isOpen, onClose }: Props) {
  const [step, setStep] = useState(1);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    category: "",
    type: "EXPENSE",
    accountId: "",
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (isOpen) {
      fetch("/api/accounts")
        .then(res => res.json())
        .then(data => {
          setAccounts(Array.isArray(data) ? data : []);
          if (data.length > 0) {
            setFormData(prev => ({ ...prev, accountId: data[0].id }));
          }
        });
    }
  }, [isOpen]);

  const categories = [
    "Salary", "Food", "Transport", "Traveling", "Medical", 
    "Grocery", "Insurance", "Loans", "Investment", "Other"
  ];

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    setIsAIProcessing(true);
    
    try {
      const file = acceptedFiles[0];
      const reader = new FileReader();

      reader.onload = async (e) => {
        const imageBase64 = e.target?.result as string;
        
        try {
          const response = await fetch("/api/ai/scan-receipt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageBase64 }),
          });

          if (!response.ok) throw new Error("Failed to scan receipt");

          const data = await response.json();
          setFormData(prev => ({
            ...prev,
            amount: data.amount?.toString() || "",
            description: data.description || "",
            category: data.category || "",
            date: new Date().toISOString().split('T')[0],
          }));
          setStep(2);
        } catch (error) {
          console.error(error);
          alert("Failed to extract data. Please enter manually.");
        } finally {
          setIsAIProcessing(false);
        }
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
      setIsAIProcessing(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
    multiple: false 
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-xl glass-dark rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Add Transaction</h2>
                <p className="text-sm text-slate-400">Manual entry or AI receipt scan</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8">
              {step === 1 ? (
                <div className="space-y-8">
                  {/* AI Upload Section */}
                  <div 
                    {...getRootProps()} 
                    className={cn(
                      "border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer",
                      isDragActive ? "border-primary bg-primary/10" : "border-white/10 hover:border-primary/50 hover:bg-white/5"
                    )}
                  >
                    <input {...getInputProps()} />
                    {isAIProcessing ? (
                      <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                        <div className="text-center">
                          <p className="text-white font-semibold">AI is scanning your receipt...</p>
                          <p className="text-sm text-slate-400">Extracting amount, date, and category</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
                          <Camera className="w-8 h-8 text-primary" />
                        </div>
                        <div className="text-center">
                          <p className="text-white font-semibold">Scan Receipt</p>
                          <p className="text-sm text-slate-400">Drag & drop or click to upload</p>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                          <Sparkles className="w-4 h-4 text-primary" />
                          <span className="text-xs font-bold text-primary uppercase">AI Powered</span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5" /></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-900 px-2 text-slate-500">Or manual entry</span></div>
                  </div>

                  <button 
                    onClick={() => setStep(2)}
                    className="w-full py-4 bg-slate-800 text-white font-bold rounded-2xl hover:bg-slate-700 transition-colors"
                  >
                    Fill Details Manually
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex gap-2 p-1 bg-slate-800 rounded-2xl w-full border border-white/5">
                      {["EXPENSE", "INCOME"].map((t) => (
                        <button
                          key={t}
                          onClick={() => setFormData({ ...formData, type: t })}
                          className={cn(
                            "flex-1 py-2 rounded-xl text-xs font-bold transition-all",
                            formData.type === t ? "bg-white/10 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
                          )}
                        >
                          {t}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                          <DollarSign className="w-4 h-4" /> Amount
                        </label>
                        <input 
                          type="number" 
                          value={formData.amount}
                          onChange={(e) => setFormData({...formData, amount: e.target.value})}
                          className="w-full bg-slate-800 border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary"
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                          <Type className="w-4 h-4" /> Description
                        </label>
                        <input 
                          type="text" 
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          className="w-full bg-slate-800 border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary"
                          placeholder="e.g. Weekly Coffee"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                        <Tag className="w-4 h-4" /> Destination Account
                      </label>
                      <select
                        value={formData.accountId}
                        onChange={(e) => setFormData({...formData, accountId: e.target.value})}
                        className="w-full bg-slate-800 border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary"
                      >
                        {accounts.map((acc: { id: string; name: string; balance: number }) => (
                           <option key={acc.id} value={acc.id}>{acc.name} (${acc.balance})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                      <Tag className="w-4 h-4" /> Category
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {categories.map((cat: string) => (
                        <button
                          key={cat}
                          onClick={() => setFormData({...formData, category: cat})}
                          className={cn(
                            "py-2 px-3 rounded-lg text-xs font-medium border transition-all",
                            formData.category === cat 
                              ? "bg-primary text-white border-primary" 
                              : "bg-slate-800 text-slate-400 border-white/5 hover:border-white/20"
                          )}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button 
                      onClick={() => setStep(1)}
                      className="flex-1 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors"
                    >
                      Back
                    </button>
                    <button 
                      onClick={async () => {
                        const amount = parseFloat(formData.amount);
                        if (isNaN(amount) || amount <= 0) return alert("Please enter a valid positive amount.");
                        if (!formData.description) return alert("Please enter a description.");
                        if (!formData.category) return alert("Please select a category.");
                        if (!formData.accountId) return alert("Please select an account.");

                        try {
                          const res = await fetch("/api/transactions", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              amount,
                              description: formData.description,
                              categoryName: formData.category,
                              type: formData.type,
                              accountId: formData.accountId,
                              date: formData.date
                            })
                          });
                          if (!res.ok) throw new Error("Failed to save transaction");
                          onClose();
                          // In a full app, we'd invalidate the cache or refresh page here
                          window.location.reload();
                        } catch (e) {
                          alert("Failed to save transaction. Please check your data.");
                        }
                      }}
                      className="flex-[2] py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
                    >
                      Save Transaction
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
