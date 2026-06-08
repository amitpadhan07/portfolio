"use client";

import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import "./globals.css";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body className="bg-[#070b13] text-[#F8FAFC] min-h-screen flex flex-col items-center justify-center px-6 antialiased">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-md w-full text-center space-y-6 relative z-10 bg-white/[0.02] border border-white/5 backdrop-blur-md p-8 rounded-2xl shadow-xl">
          <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-400 mb-2">
            <AlertCircle className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#F8FAFC]">Critical Crash</h1>
            <p className="text-xs text-[#94A3B8] font-light leading-relaxed">
              A fatal system exception occurred at the layout layer. The core application context was terminated.
            </p>
          </div>

          {error?.message && (
            <div className="p-3 bg-slate-900/50 border border-white/5 rounded-xl font-mono text-[10px] text-red-300 break-all select-all text-left">
              Details: {error.message}
            </div>
          )}

          <button
            onClick={() => reset()}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold text-xs transition-all shadow-lg shadow-red-500/10 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Force Reset Layout
          </button>
        </div>
      </body>
    </html>
  );
}
