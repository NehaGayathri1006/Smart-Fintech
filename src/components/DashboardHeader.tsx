"use client";

import { useState } from "react";
import { Plus, Download, Calendar } from "lucide-react";
import AddTransactionModal from "@/components/AddTransactionModal";

interface Props {
  userName: string;
}

export default function DashboardHeader({ userName }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Financial Dashboard</h1>
          <p className="text-slate-400 mt-1">Welcome back, {userName}, here's your financial overview.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-xl bg-slate-800 border border-white/5 text-slate-400 hover:text-white transition-colors">
            <Calendar className="w-5 h-5" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-white/5 text-slate-200 hover:bg-slate-700 transition-colors">
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Export</span>
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary-dark transition-all hover:scale-105 shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Add Transaction</span>
          </button>
        </div>
      </div>

      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
