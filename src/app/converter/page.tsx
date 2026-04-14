import CurrencyConverter from "@/components/CurrencyConverter";

export default function ConverterPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in pt-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Currency Converter</h1>
        <p className="text-slate-400">Convert your transactions into different global currencies accurately.</p>
      </div>
      <CurrencyConverter />
    </div>
  );
}
