"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  onComplete: () => void;
}

const loadingTexts = [
  "Initializing Next.js environment...",
  "Loading full-stack architectures...",
  "Integrating AI/ML schemas...",
  "Optimizing neural weights...",
  "Rendering interface layers...",
  "Ready.",
];

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Increment loading progress
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 150);

    // Switch status text
    const textTimer = setInterval(() => {
      setTextIndex((prev) => (prev < loadingTexts.length - 1 ? prev + 1 : prev));
    }, 400);

    return () => {
      clearInterval(progressTimer);
      clearInterval(textTimer);
    };
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const exitTimer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onComplete, 500); // Trigger complete after fade out
      }, 300);
      return () => clearTimeout(exitTimer);
    }
  }, [progress, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 bg-[#070b13] flex flex-col items-center justify-center z-50 pointer-events-auto"
        >
          {/* Glowing particle background */}
          <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "-3s" }} />

          <div className="flex flex-col items-center max-w-xs w-full px-4 relative z-10">
            {/* Spinning/pulsing initial logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-24 h-24 flex items-center justify-center mb-8"
            >
              {/* Outer spinning dash circle */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary animate-spin" style={{ animationDuration: "12s" }} />
              {/* Inner gradient glowing circle */}
              <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-primary to-secondary blur-md opacity-50" />
              <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center">
                <span className="text-2xl font-bold text-text-primary tracking-wider font-mono">AP</span>
              </div>
            </motion.div>

            {/* Typewriter status description */}
            <div className="h-6 flex items-center justify-center mb-4">
              <motion.p
                key={textIndex}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-xs text-text-secondary font-mono tracking-wider text-center"
              >
                {loadingTexts[textIndex]}
              </motion.p>
            </div>

            {/* Progress Bar Container */}
            <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              {/* Active fill */}
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-secondary"
                style={{ width: `${progress}%` }}
                transition={{ ease: "easeInOut" }}
              />
            </div>
            
            {/* Percentage count */}
            <span className="mt-2 text-[10px] text-text-muted font-mono">{Math.min(progress, 100)}%</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
