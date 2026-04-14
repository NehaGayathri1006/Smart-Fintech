"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, PieChart, DollarSign, Tag, Loader2, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateBudgetModal({ isOpen, onClose }: Props) {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    categoryId: "",
    limit: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  useEffect(() => {
    if (isOpen) {
      // Typically we'd have an API to list categories, using standardized ones for now
      setCategories([
        { id: "food", name: "Food" },
        { id: "transport", name: "Transport" },
        { id: "travel", name: "Traveling" },
        { id: "medical", name: "Medical" },
        { id: "grocery", name: "Grocery" },
        { id: "other", name: "Other" }
      ]);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    const limitValue = parseFloat(formData.limit);
    if (isNaN(limitValue) || limitValue <= 0) {
      alert("Please enter a valid positive monthly limit.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryName: formData.categoryId, // Maps to the name selected
          limit: limitValue,
          month: formData.month,
          year: formData.year
        })
      });

      if (!res.ok) throw new Error("Failed to create budget");
      
      onClose();
      window.location.reload();
    } catch (error) {
      alert("Error creating budget");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
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
            className="w-full max-w-md glass-dark rounded-[40px] border border-white/10 shadow-2xl relative overflow-hidden"
          >
            <div className="p-8 space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-white">New Budget</h2>
                  <p className="text-sm text-slate-400">Set a monthly spending limit.</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Category</label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setFormData({...formData, categoryId: cat.name})}
                        className={cn(
                          "py-3 px-4 rounded-2xl text-xs font-bold border transition-all text-left",
                          formData.categoryId === cat.name
                            ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                            : "bg-slate-900 border-white/5 text-slate-500 hover:border-white/20"
                        )}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Monthly Limit</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input 
                      type="number" 
                      value={formData.limit}
                      onChange={(e) => setFormData({...formData, limit: e.target.value})}
                      placeholder="0.00"
                      className="w-full bg-slate-900 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white font-bold focus:outline-none focus:border-primary/50"
                    />
                  </div>
                </div>

                <button 
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <PieChart className="w-5 h-5" />}
                  Create Budget
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
