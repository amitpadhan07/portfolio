"use client";

import React, { useEffect } from "react";
import { AlertOctagon, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error details to production tracking systems
    console.error("Application runtime error caught by boundary:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#070b13] flex flex-col items-center justify-center relative overflow-hidden px-6">
      {/* Dynamic backdrop glow orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-rose-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-md w-full text-center space-y-6 relative z-10 bg-white/[0.02] border border-white/5 backdrop-blur-md p-8 rounded-2xl shadow-xl">
        <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-400 mb-2">
          <AlertOctagon className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-[#F8FAFC]">Application Error</h1>
          <p className="text-xs text-[#94A3B8] font-light leading-relaxed">
            An unexpected exception occurred during page execution. The issue has been registered in our diagnostics feed.
          </p>
        </div>

        {error.message && (
          <div className="p-3 bg-slate-900/50 border border-white/5 rounded-xl font-mono text-[10px] text-rose-300 break-all select-all text-left">
            Error: {error.message}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-violet-500 hover:from-sky-500 hover:to-violet-600 text-white font-semibold text-xs transition-all shadow-lg shadow-sky-500/10 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Retry Request
          </button>
          
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-[#F8FAFC] font-semibold text-xs transition-all cursor-pointer"
          >
            <Home className="w-3.5 h-3.5 text-[#94A3B8]" /> Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
