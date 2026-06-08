import React from "react";
import Link from "next/link";
import { ArrowLeft, HelpCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#070b13] flex flex-col items-center justify-center relative overflow-hidden px-6">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full text-center space-y-6 relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-sky-400 shadow-xl mb-2 animate-bounce">
          <HelpCircle className="w-8 h-8" />
        </div>

        <div className="space-y-3">
          <span className="font-mono text-xs uppercase tracking-widest text-sky-400 font-semibold">
            Status Code 404
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F8FAFC]">
            Resource Not Found
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] font-light leading-relaxed max-w-sm mx-auto">
            The path you are seeking is either restricted, missing, or has been relocated to another address.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center max-w-xs mx-auto">
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-violet-500 hover:from-sky-500 hover:to-violet-600 text-white font-semibold text-xs transition-all shadow-lg shadow-sky-500/10 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          
          <Link
            href="/blog"
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-[#F8FAFC] font-semibold text-xs transition-all cursor-pointer"
          >
            Read Blog
          </Link>
        </div>
      </div>
    </div>
  );
}
