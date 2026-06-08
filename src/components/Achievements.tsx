"use client";

import { motion, Variants } from "framer-motion";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { Sparkles } from "lucide-react";
import { getAchievementIcon } from "@/lib/icons";

interface AchievementItem {
  _id: string;
  title: string;
  description: string;
  icon: string;
  date: string;
}

interface AchievementsProps {
  achievements?: AchievementItem[];
}

const defaultAchievements: AchievementItem[] = [
  {
    _id: "prod-deploy",
    title: "Production Deployments",
    date: "4+ Applications",
    description: "Successfully architected, structured, and deployed full-stack operations, gaining end-to-end SDLC validation.",
    icon: "Layers",
  },
  {
    _id: "algo-apt",
    title: "Algorithmic Aptitude",
    date: "200+ DSA Solved",
    description: "Solved coding challenges masterfully on LeetCode, mastering advanced data structures and Object-Oriented paradigms.",
    icon: "Code2",
  },
];

export default function Achievements({ achievements = [] }: AchievementsProps) {
  const displayAchievements = achievements && achievements.length > 0 ? achievements : defaultAchievements;

  const container: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
  };

  return (
    <section id="achievements" className="py-24 relative overflow-hidden bg-[#0a0f1d]/40">
      {/* Background orb decoration */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

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
            Highlights
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-gradient"
          >
            Key Achievements
          </motion.h2>
        </div>

        {/* Achievements Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {displayAchievements.map((ach) => {
            // Dynamically resolve Lucide Icon or fallback to Sparkles
            const IconComponent = getAchievementIcon(ach.icon);

            return (
              <motion.div key={ach._id} variants={item} className="flex">
                <SpotlightCard
                  spotlightColor="rgba(56, 189, 248, 0.05)"
                  borderColor="rgba(56, 189, 248, 0.2)"
                  className="p-6 w-full flex flex-col justify-between"
                >
                  <div className="flex flex-col gap-4">
                    {/* Top Bar: Icon & Count (stored in Date field) */}
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-sky-400" />
                      </div>
                      <span className="text-xs font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary font-mono uppercase tracking-wider">
                        {ach.date}
                      </span>
                    </div>
                    {/* Text Details */}
                    <div>
                      <h3 className="text-base font-bold text-text-primary mb-2">
                        {ach.title}
                      </h3>
                      <p className="text-xs text-text-secondary leading-relaxed font-light">
                        {ach.description}
                      </p>
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
