"use client";

import { motion } from "framer-motion";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { GraduationCap, Brain, Database, Award } from "lucide-react";

interface TimelineEvent {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  icon: React.ReactNode;
  description: string;
  highlights: string[];
}

const timelineEvents: TimelineEvent[] = [
  {
    id: "btech-journey",
    title: "B.Tech Computer Science Engineering",
    subtitle: "Graphic Era Hill University | Dehradun, Uttarakhand",
    date: "2024 — Present (Expected 2028)",
    icon: <GraduationCap className="w-5 h-5" />,
    description: "Specializing in the AI Full Stack program. Laying a solid foundation in low-level system design and algorithms.",
    highlights: [
      "GPA Maintained: Technical agilities focus",
      "Core coursework: DSA, OOP, DBMS, OS, Computer Networks, Artificial Intelligence",
      "Solved 200+ algorithmic problems on Leetcode & Codeforces",
    ],
  },
  {
    id: "fullstack-milestones",
    title: "Full-Stack Development Specialist",
    subtitle: "Enterprise Applications & Framework Architecture",
    date: "2024 — 2026",
    icon: <Database className="w-5 h-5" />,
    description: "Built, optimized, and deployed 4 complete full-stack web architectures using standard engineering best practices.",
    highlights: [
      "Designed optimal database schemas (MongoDB, PostgreSQL)",
      "Implemented secure Role-Based Access Control (RBAC) schemas",
      "Constructed REST APIs with Next.js App Router and Express.js",
    ],
  },
  {
    id: "ai-pathway",
    title: "AI & Machine Learning Pathway",
    subtitle: "Applied Neural Networks, NLP & LLM Integrations",
    date: "2025 — 2026",
    icon: <Brain className="w-5 h-5" />,
    description: "Completed workshops and verified credentials specializing in data extraction, predictive modelling, and Generative AI prompt pipelines.",
    highlights: [
      "Google credentials: AI for Data Analysis & Research Insights",
      "AWS Cloud Academy: Cloud CLI Essentials accreditation",
      "Hands-on ML workflows: Regression modeling, basic NLP tokenizers, and LLM integrations",
    ],
  },
  {
    id: "project-milestones",
    title: "Operational Impact & Project Milestones",
    subtitle: "Software Engineering Metrics & Performance Tuning",
    date: "Recent Milestones",
    icon: <Award className="w-5 h-5" />,
    description: "Achieved significant performance metrics and process automation throughout personal and academic software deployments.",
    highlights: [
      "Automated organizational workflows, decreasing administrative errors and manual sheets by 80%",
      "Reduced attendee event check-in timings by 50% for 500+ student attendees",
      "Decreased MongoDB query latencies by 20% using indexes and aggregation pipelines",
    ],
  },
];

export default function Timeline() {
  return (
    <section id="experience" className="py-24 relative overflow-hidden bg-[#0a0f1d]/40">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Title */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] uppercase tracking-widest font-mono mb-3"
          >
            Milestones
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-gradient"
          >
            Academic & Project Timeline
          </motion.h2>
        </div>

        {/* Timeline Path */}
        <div className="relative border-l border-white/5 pl-8 sm:pl-12 ml-4 sm:ml-6 space-y-12">
          {timelineEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              {/* Vertical timeline node indicator dot */}
              <div className="absolute -left-[45px] sm:-left-[61px] top-1.5 w-7 h-7 rounded-full bg-[#0c1222] border-2 border-primary flex items-center justify-center text-primary shadow-lg shadow-primary/20 z-10">
                {event.icon}
              </div>

              {/* Event details card */}
              <SpotlightCard className="p-6 sm:p-8">
                <div className="flex flex-col gap-4">
                  {/* Header info */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-bold text-text-primary">{event.title}</h3>
                      <p className="text-xs text-text-secondary">{event.subtitle}</p>
                    </div>
                    <span className="self-start sm:self-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-text-muted text-[10px] font-mono tracking-wider">
                      {event.date}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-light">
                    {event.description}
                  </p>

                  {/* Highlights list */}
                  <div className="flex flex-col gap-1.5 mt-2">
                    <span className="text-[10px] font-mono uppercase text-text-muted tracking-wider">Core Outcomes</span>
                    <ul className="space-y-1.5">
                      {event.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-text-secondary font-light leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
