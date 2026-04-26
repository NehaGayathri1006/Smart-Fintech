"use client";

import CurrencyConverter from "@/components/CurrencyConverter";

import { useLanguage } from "@/context/LanguageContext";

export default function ConverterPage() {
  const { t } = useLanguage();
  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in pt-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">{t.converterHeader}</h1>
        <p className="text-slate-400">{t.converterDesc}</p>
      </div>
      <CurrencyConverter />
    </div>
  );
}
