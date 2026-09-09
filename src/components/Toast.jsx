import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const Toast = () => {
  const { toast } = usePortfolio();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-in">
      <div
        className={`flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border text-sm font-semibold ${
          isSuccess
            ? 'bg-[#2b241d] text-[#faf6ee] border-[#bca388]'
            : isError
            ? 'bg-rose-950 text-rose-100 border-rose-700'
            : 'bg-stone-900 text-stone-100 border-stone-700'
        }`}
      >
        {isSuccess && <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />}
        {isError && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
        {!isSuccess && !isError && <Info className="w-5 h-5 text-amber-300 shrink-0" />}
        <span>{toast.message}</span>
      </div>
    </div>
  );
};
