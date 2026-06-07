"use client";

import { motion } from "framer-motion";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { ExternalLink, Layers, BrainCircuit, ShieldCheck, Ticket, Database, Heart, Award, Sparkles, Code2 } from "lucide-react";
import { GithubIcon } from "@/components/ui/BrandIcons";

interface ProjectItem {
  _id: string;
  name: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  image?: string;
  category: string;
  featured: boolean;
  status: "active" | "draft";
  order: number;
}

interface ProjectsProps {
  projects?: ProjectItem[];
}

const defaultProjects: ProjectItem[] = [
  {
    _id: "gehu-portal",
    name: "GEHU Event Management Portal",
    category: "Full Stack App",
    technologies: ["Next.js", "TypeScript", "MongoDB", "React"],
    description: "A production-grade, serverless portal built to automate event registrations and check-ins. Decreased check-in queue times by 50% for 500+ student attendees.",
    githubUrl: "https://github.com/amitpadhan07",
    liveUrl: "https://github.com/amitpadhan07",
    featured: true,
    status: "active",
    order: 0,
  },
  {
    _id: "period-tracker",
    name: "PeriodTracker",
    category: "Health Analytics",
    technologies: ["Next.js", "MongoDB", "Recharts", "Next-Auth"],
    description: "A secure, privacy-first healthcare tracking application that provides users with cycle tracking insights and dynamic trends charts.",
    githubUrl: "https://github.com/amitpadhan07",
    liveUrl: "https://github.com/amitpadhan07",
    featured: true,
    status: "active",
    order: 1,
  },
];

export default function Projects({ projects = [] }: ProjectsProps) {
  const displayProjects = projects && projects.length > 0 ? projects : defaultProjects;

  // Render a beautiful dynamic visual mockup card as a fallback
  const renderFallbackVisual = (project: ProjectItem) => {
    const category = project.category.toLowerCase();
    
    if (category.includes("stack") || category.includes("web") || category.includes("app")) {
      return (
        <div className="absolute inset-0 bg-gradient-to-tr from-sky-950/40 to-slate-900 flex flex-col justify-end p-6 border-b border-white/5">
          <div className="flex flex-col gap-2.5 opacity-80 scale-95 origin-bottom-left transition-transform group-hover/project:scale-[0.98]">
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 px-2 py-1 bg-primary/10 border border-primary/20 text-primary text-[9px] rounded font-mono uppercase">
                <ShieldCheck className="w-2.5 h-2.5" /> Security Configured
              </span>
              <span className="flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/10 text-text-secondary text-[9px] rounded font-mono uppercase">
                <Ticket className="w-2.5 h-2.5" /> Serverless API
              </span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-[#0c1222]/80 border border-white/10 max-w-[260px]">
              <div className="w-7 h-7 rounded bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">AP</div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-semibold text-text-primary">System Monitoring</span>
                <span className="text-[8px] text-text-muted">Query response: 3.5ms</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (category.includes("health") || category.includes("analytics") || category.includes("chart")) {
      return (
        <div className="absolute inset-0 bg-gradient-to-tr from-violet-950/40 to-slate-900 flex flex-col justify-end p-6 border-b border-white/5">
          <div className="flex flex-col gap-3 opacity-80 scale-95 origin-bottom-left transition-transform group-hover/project:scale-[0.98]">
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 px-2 py-1 bg-secondary/10 border border-secondary/20 text-secondary text-[9px] rounded font-mono uppercase">
                <Heart className="w-2.5 h-2.5" /> Pulse Monitor
              </span>
            </div>
            <div className="p-3.5 rounded-lg bg-[#0c1222]/80 border border-white/10 max-w-[260px]">
              <div className="flex justify-between text-[8px] text-text-muted mb-2 font-mono">
                <span>INDEX METRICS</span>
                <span className="text-secondary font-bold">94% ACCURACY</span>
              </div>
              <div className="flex items-end gap-1.5 h-10">
                <div className="w-4 bg-slate-800 rounded-t h-4" />
                <div className="w-4 bg-slate-800 rounded-t h-6" />
                <div className="w-4 bg-secondary/30 rounded-t h-7" />
                <div className="w-4 bg-secondary rounded-t h-10" />
                <div className="w-4 bg-slate-800 rounded-t h-5" />
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (category.includes("ai") || category.includes("learning") || category.includes("ml")) {
      return (
        <div className="absolute inset-0 bg-gradient-to-tr from-rose-950/40 to-slate-900 flex flex-col justify-end p-6 border-b border-white/5">
          <div className="flex flex-col gap-2.5 opacity-80 scale-95 origin-bottom-left transition-transform group-hover/project:scale-[0.98]">
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 px-2 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[9px] rounded font-mono uppercase">
                <BrainCircuit className="w-2.5 h-2.5" /> Model Weights
              </span>
            </div>
            <div className="p-3 rounded-lg bg-[#0c1222]/80 border border-white/10 max-w-[260px] flex gap-3 items-center">
              <div className="w-9 h-9 rounded-md bg-rose-500/10 flex items-center justify-center text-rose-400">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-semibold text-text-primary">Epoch Processing</span>
                <span className="text-[8px] text-text-muted font-mono">Loss rate: 0.021</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Default Fallback
    return (
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 to-slate-900 flex flex-col justify-end p-6 border-b border-white/5">
        <div className="flex flex-col gap-2.5 opacity-80 scale-95 origin-bottom-left transition-transform group-hover/project:scale-[0.98]">
          <div className="flex gap-2">
            <span className="flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/10 text-text-secondary text-[9px] rounded font-mono uppercase">
              <Code2 className="w-2.5 h-2.5 text-primary" /> Active Module
            </span>
          </div>
          <div className="p-3 rounded-lg bg-[#0c1222]/80 border border-white/10 max-w-[260px] flex gap-3 items-center">
            <div className="w-9 h-9 rounded-md bg-white/5 flex items-center justify-center text-[#94A3B8]">
              <Layers className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-semibold text-text-primary">{project.name}</span>
              <span className="text-[8px] text-text-muted font-mono">/{project.category}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="projects" className="py-24 relative overflow-hidden bg-[#0a0f1d]/20">
      {/* Decorative radial blur */}
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[130px] pointer-events-none" />

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
            Showcase
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-gradient"
          >
            Technical Projects
          </motion.h2>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayProjects.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="flex"
            >
              <SpotlightCard className="w-full flex flex-col group/project cursor-default">
                {/* Image / Graphic Visual Mockup Area */}
                <div className="relative w-full h-48 border-b border-white/5 bg-slate-950 overflow-hidden">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.name}
                      className="w-full h-full object-cover object-center group-hover/project:scale-105 transition-all duration-500"
                    />
                  ) : (
                    renderFallbackVisual(project)
                  )}
                </div>

                {/* Card Text Content */}
                <div className="p-6 sm:p-8 flex flex-col justify-between flex-grow">
                  <div className="flex flex-col gap-4">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-semibold text-primary uppercase tracking-widest font-mono">
                        {project.category}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-text-primary group-hover/project:text-primary transition-colors">
                      {project.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-light line-clamp-3">
                      {project.description}
                    </p>

                    {/* Technology badging */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {project.technologies.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-text-secondary text-[10px] font-mono"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-4 mt-8 pt-6 border-t border-white/5">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider bg-white/5 border border-white/10 text-text-secondary hover:text-text-primary hover:border-white/20 transition-all cursor-pointer"
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                        Codebase
                      </a>
                    )}
                    
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 hover:border-primary/40 transition-all cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Live Demo
                      </a>
                    )}
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
