"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { GraduationCap, Code, FolderGit2, BookOpen, Sparkles } from "lucide-react";

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

interface StatItem {
  label: string;
  value: number;
  suffix: string;
  subtext: string;
}

interface AboutProps {
  profile?: {
    aboutMe: string;
    stats: StatItem[];
  } | null;
}

const defaultStats: StatItem[] = [
  {
    label: "Projects Completed",
    value: 4,
    suffix: "+",
    subtext: "Production-ready apps",
  },
  {
    label: "DSA Solved",
    value: 200,
    suffix: "+",
    subtext: "Leetcode & local platforms",
  },
  {
    label: "Technologies Mastered",
    value: 20,
    suffix: "+",
    subtext: "Languages, Frameworks, DBs",
  },
];

export default function About({ profile }: AboutProps) {
  const stats = profile?.stats && profile.stats.length > 0 ? profile.stats : defaultStats;
  const bio = profile?.aboutMe || "I am a highly motivated Computer Science Engineering student specializing in AI Full Stack. My academic focus is on bridging the gap between core software engineering principles and intelligent cloud-based architectures. I enjoy designing optimal database structures, writing robust APIs, and assembling clean frontend interfaces.";

  // Utility to map statistics labels to corresponding Lucide icons
  const getStatIcon = (label: string) => {
    const lower = label.toLowerCase();
    if (lower.includes("project")) return <FolderGit2 className="w-7 h-7" />;
    if (lower.includes("code") || lower.includes("dsa") || lower.includes("solve")) return <Code className="w-7 h-7" />;
    if (lower.includes("tech") || lower.includes("skill") || lower.includes("graduation")) return <GraduationCap className="w-7 h-7" />;
    return <Sparkles className="w-7 h-7" />;
  };

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
                    <h3 className="text-lg font-bold text-text-primary">Professional Journey</h3>
                    <p className="text-xs text-text-muted">AI Full Stack Developer & Systems Designer</p>
                  </div>
                </div>

                <div className="space-y-4 text-sm text-text-secondary leading-relaxed font-light whitespace-pre-line">
                  {bio}
                </div>
              </div>

              {/* Quick details tags */}
              <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/5 text-xs">
                <div className="flex items-center gap-2 text-text-secondary">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span>Continuous Learner</span>
                </div>
                <div className="flex items-center gap-2 text-text-secondary">
                  <Code className="w-4 h-4 text-secondary" />
                  <span>Algorithms & Design Patterns</span>
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
            {stats.map((stat, index) => (
              <SpotlightCard key={index} className="p-6 flex flex-row items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-text-muted uppercase tracking-wider font-mono">{stat.label}</span>
                  <Counter value={stat.value} suffix={stat.suffix} />
                  <span className="text-[10px] text-text-secondary mt-1">{stat.subtext}</span>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                  {getStatIcon(stat.label)}
                </div>
              </SpotlightCard>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
