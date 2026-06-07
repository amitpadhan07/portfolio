"use client";

import { motion } from "framer-motion";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { GitPullRequest, GitFork, Star, Eye } from "lucide-react";

export default function GithubStats() {
  // Generate mock grid representing a premium contribution calendar (53 weeks * 7 days)
  const generateContributionWeeks = () => {
    const weeks = [];
    const colors = ["bg-slate-900 border-white/[0.02]", "bg-primary/20", "bg-primary/40", "bg-primary/60", "bg-primary"];
    
    for (let w = 0; w < 40; w++) { // limit to 40 columns for better responsive layout on desktop
      const days = [];
      for (let d = 0; d < 7; d++) {
        // Randomize contribution level to look realistic, but weighted towards dark/light primary
        const rand = Math.random();
        let colorIdx = 0;
        if (rand > 0.85) colorIdx = 4;
        else if (rand > 0.7) colorIdx = 3;
        else if (rand > 0.5) colorIdx = 2;
        else if (rand > 0.2) colorIdx = 1;
        
        days.push(colors[colorIdx]);
      }
      weeks.push(days);
    }
    return weeks;
  };

  const contributionWeeks = generateContributionWeeks();

  return (
    <section id="github" className="py-24 relative overflow-hidden bg-[#0a0f1d]/10">
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
            Activity
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-gradient"
          >
            GitHub Contributions
          </motion.h2>
        </div>

        {/* Content layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Main Calendar Card (col-span-8) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-8 flex"
          >
            <SpotlightCard className="p-6 sm:p-8 w-full flex flex-col justify-between overflow-hidden">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-base font-bold text-text-primary">Contributions Graph</h3>
                    <p className="text-xs text-text-muted">amitpadhan07 activity in 2026</p>
                  </div>
                  <a
                    href="https://github.com/amitpadhan07"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline font-mono"
                  >
                    @amitpadhan07
                  </a>
                </div>

                {/* Contribution Heatmap Container */}
                <div className="overflow-x-auto pb-4 scrollbar-none">
                  <div className="flex gap-1.5 min-w-[550px]">
                    {contributionWeeks.map((week, wIdx) => (
                      <div key={wIdx} className="flex flex-col gap-1.5">
                        {week.map((dayColor, dIdx) => (
                          <div
                            key={dIdx}
                            className={`w-2.5 h-2.5 rounded-sm border ${dayColor} transition-colors hover:scale-110`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Statistics Summary Bar */}
              <div className="flex justify-between items-center pt-6 border-t border-white/5 text-xs text-text-secondary mt-6 font-mono">
                <span>942 contributions in the last year</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-text-muted">Less</span>
                  <div className="w-2.5 h-2.5 bg-slate-900 border border-white/[0.02] rounded-sm" />
                  <div className="w-2.5 h-2.5 bg-primary/20 rounded-sm" />
                  <div className="w-2.5 h-2.5 bg-primary/40 rounded-sm" />
                  <div className="w-2.5 h-2.5 bg-primary/60 rounded-sm" />
                  <div className="w-2.5 h-2.5 bg-primary rounded-sm" />
                  <span className="text-text-muted">More</span>
                </div>
              </div>
            </SpotlightCard>
          </motion.div>

          {/* Languages Stack Card (col-span-4) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-4 flex"
          >
            <SpotlightCard className="p-6 sm:p-8 w-full flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-text-primary mb-6">Most Used Languages</h3>
                
                {/* Languages breakdown list */}
                <div className="space-y-4">
                  {/* TypeScript */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-text-primary flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary" /> TypeScript
                      </span>
                      <span className="text-text-muted font-mono">45%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: "45%" }} />
                    </div>
                  </div>

                  {/* JavaScript */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-text-primary flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" /> JavaScript
                      </span>
                      <span className="text-text-muted font-mono">25%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400" style={{ width: "25%" }} />
                    </div>
                  </div>

                  {/* Python */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-text-primary flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-secondary" /> Python
                      </span>
                      <span className="text-text-muted font-mono">20%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-secondary" style={{ width: "20%" }} />
                    </div>
                  </div>

                  {/* HTML / CSS */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-text-primary flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> CSS & Other
                      </span>
                      <span className="text-text-muted font-mono">10%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400" style={{ width: "10%" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Repo Quick Metrics */}
              <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-white/5 text-[10px] text-text-muted font-mono">
                <div className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-primary" />
                  <span>56 Stars</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <GitFork className="w-3.5 h-3.5 text-secondary" />
                  <span>14 Forks</span>
                </div>
              </div>
            </SpotlightCard>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
