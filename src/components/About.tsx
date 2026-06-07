"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { GraduationCap, Code, FolderGit2, BookOpen } from "lucide-react";

interface CounterProps {
  value: number;
  suffix?: string;
  duration?: number;
}

function Counter({ value, suffix = "", duration = 1.5 }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = value;
    const totalSteps = 60;
    const stepTime = (duration * 1000) / totalSteps;
    
    const timer = setInterval(() => {
      start += 1;
      const progress = start / totalSteps;
      const currentValue = Math.floor(progress * end);
      
      if (start >= totalSteps) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(currentValue);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value, duration, isInView]);

  return (
    <span ref={ref} className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary font-mono">
      {count}
      {suffix}
    </span>
  );
}

export default function About() {
  return (
    <section id="about" className="py-24 relative overflow-hidden bg-[#0a0f1d]/40">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Title */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] uppercase tracking-widest font-mono mb-3"
          >
            Introduction
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-gradient"
          >
            About Me
          </motion.h2>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Bio Info Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex"
          >
            <SpotlightCard className="p-8 flex flex-col justify-between w-full">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-primary">Education Journey</h3>
                    <p className="text-xs text-text-muted">Graphic Era Hill University, Dehradun</p>
                  </div>
                </div>

                <div className="space-y-4 text-sm text-text-secondary leading-relaxed font-light">
                  <p>
                    I am a highly motivated B.Tech Computer Science Engineering student specializing in **AI Full Stack**. My academic tenure (Expected Graduation: **2028**) is focused on bridging the gap between core software engineering principles and intelligent cloud-based architectures.
                  </p>
                  <p>
                    I enjoy designing optimal database structures, writing robust APIs, and assembling clean frontend interfaces. Beyond development, my curiosity drives me towards understanding Machine Learning algorithms, NLP processing layers, and Large Language Models.
                  </p>
                </div>
              </div>

              {/* Quick details tags */}
              <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/5 text-xs">
                <div className="flex items-center gap-2 text-text-secondary">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span>AI Full Stack Branch</span>
                </div>
                <div className="flex items-center gap-2 text-text-secondary">
                  <Code className="w-4 h-4 text-secondary" />
                  <span>OOP & DSA Specialist</span>
                </div>
              </div>
            </SpotlightCard>
          </motion.div>

          {/* Right: Statistics Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            {/* Stat Card 1: Projects */}
            <SpotlightCard className="p-6 flex flex-row items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-text-muted uppercase tracking-wider font-mono">Projects Completed</span>
                <Counter value={4} suffix="+" />
                <span className="text-[10px] text-text-secondary mt-1">Production-ready apps</span>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                <FolderGit2 className="w-7 h-7" />
              </div>
            </SpotlightCard>

            {/* Stat Card 2: DSA */}
            <SpotlightCard className="p-6 flex flex-row items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-text-muted uppercase tracking-wider font-mono">DSA Solved</span>
                <Counter value={200} suffix="+" />
                <span className="text-[10px] text-text-secondary mt-1">Leetcode & local platforms</span>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-secondary">
                <Code className="w-7 h-7" />
              </div>
            </SpotlightCard>

            {/* Stat Card 3: Technologies */}
            <SpotlightCard className="p-6 flex flex-row items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-text-muted uppercase tracking-wider font-mono">Technologies Mastered</span>
                <Counter value={20} suffix="+" />
                <span className="text-[10px] text-text-secondary mt-1">Languages, Frameworks, DBs</span>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                <GraduationCap className="w-7 h-7" />
              </div>
            </SpotlightCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
