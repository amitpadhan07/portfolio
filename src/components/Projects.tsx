"use client";

import { motion } from "framer-motion";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { ExternalLink, ShieldCheck, Ticket, LayoutDashboard, BarChart3, Heart, Award, Database, FileSpreadsheet, Lock } from "lucide-react";
import { GithubIcon } from "@/components/ui/BrandIcons";

interface ProjectItem {
  id: string;
  title: string;
  category: string;
  tech: string[];
  features: string[];
  description: string;
  githubUrl: string;
  liveUrl: string;
  visualMock: React.ReactNode;
}

export default function Projects() {
  const projectsList: ProjectItem[] = [
    {
      id: "gehu-portal",
      title: "GEHU Event Management Portal",
      category: "Full Stack App",
      tech: ["Next.js", "TypeScript", "MongoDB", "React"],
      features: ["RBAC (Admin/Organizer)", "Real-time Attendance", "Admin Analytics", "RESTful APIs"],
      description: "A production-grade, serverless portal built to automate event registrations and check-ins. Decreased check-in queue times by 50% for 500+ student attendees and optimized data schemas to reduce database query latencies.",
      githubUrl: "https://github.com/amitpadhan07",
      liveUrl: "https://github.com/amitpadhan07",
      visualMock: (
        <div className="absolute inset-0 bg-gradient-to-tr from-sky-950/40 to-slate-900 flex flex-col justify-end p-6 border-b border-white/5">
          {/* Mock Dashboard Grid */}
          <div className="flex flex-col gap-2.5 opacity-80 scale-95 origin-bottom-left transition-transform group-hover:scale-[0.98]">
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 px-2 py-1 bg-primary/10 border border-primary/20 text-primary text-[9px] rounded font-mono uppercase">
                <ShieldCheck className="w-2.5 h-2.5" /> Security: RBAC
              </span>
              <span className="flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/10 text-text-secondary text-[9px] rounded font-mono uppercase">
                <Ticket className="w-2.5 h-2.5" /> Check-in Active
              </span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-[#0c1222]/80 border border-white/10 max-w-[260px]">
              <div className="w-7 h-7 rounded bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">A</div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-semibold text-text-primary">Admin Control Center</span>
                <span className="text-[8px] text-text-muted">Register metrics update: 3.5ms</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "period-tracker",
      title: "PeriodTracker",
      category: "Health Analytics",
      tech: ["Next.js", "MongoDB", "Recharts", "Next-Auth"],
      features: ["Cycle Tracking", "Real-time Analytics", "Health Insights", "Secure Auth"],
      description: "A secure, privacy-first healthcare tracking application that provides users with insights and dynamic charts analyzing biological cycles, logging trends, and protecting personal metrics via encrypted storage.",
      githubUrl: "https://github.com/amitpadhan07",
      liveUrl: "https://github.com/amitpadhan07",
      visualMock: (
        <div className="absolute inset-0 bg-gradient-to-tr from-violet-950/40 to-slate-900 flex flex-col justify-end p-6 border-b border-white/5">
          {/* Mock Analytics Chart */}
          <div className="flex flex-col gap-3 opacity-80 scale-95 origin-bottom-left transition-transform group-hover:scale-[0.98]">
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 px-2 py-1 bg-secondary/10 border border-secondary/20 text-secondary text-[9px] rounded font-mono uppercase">
                <Heart className="w-2.5 h-2.5" /> Pulse Monitor
              </span>
            </div>
            <div className="p-3.5 rounded-lg bg-[#0c1222]/80 border border-white/10 max-w-[260px]">
              <div className="flex justify-between text-[8px] text-text-muted mb-2 font-mono">
                <span>CYCLE INDEX</span>
                <span className="text-secondary font-bold">94% EST. ACCURACY</span>
              </div>
              <div className="flex items-end gap-1.5 h-10">
                <div className="w-4 bg-slate-800 rounded-t h-4" />
                <div className="w-4 bg-slate-800 rounded-t h-6" />
                <div className="w-4 bg-secondary/30 rounded-t h-7" />
                <div className="w-4 bg-secondary rounded-t h-10" />
                <div className="w-4 bg-slate-800 rounded-t h-5" />
                <div className="w-4 bg-slate-800 rounded-t h-8" />
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "certiii",
      title: "Certiii – Certificate Download Portal",
      category: "Automation Services",
      tech: ["React.js", "Node.js", "Express.js", "MongoDB"],
      features: ["PDF Automation", "Secure Hash Verification", "Bulk CSV Upload", "Email dispatch"],
      description: "An automated certificate generation and distribution engine that renders unique participant credentials in real-time, verifying document hashes against a distributed database to prevent fraud.",
      githubUrl: "https://github.com/amitpadhan07",
      liveUrl: "https://github.com/amitpadhan07",
      visualMock: (
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/40 to-slate-900 flex flex-col justify-end p-6 border-b border-white/5">
          {/* Mock Certificate PDF Generator */}
          <div className="flex flex-col gap-2.5 opacity-80 scale-95 origin-bottom-left transition-transform group-hover:scale-[0.98]">
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 px-2 py-1 bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-[9px] rounded font-mono uppercase">
                <Award className="w-2.5 h-2.5" /> PDF Generation Active
              </span>
            </div>
            <div className="p-3 rounded-lg bg-[#0c1222]/80 border border-white/10 max-w-[260px] flex gap-3 items-center">
              <div className="w-9 h-9 rounded-md bg-emerald-400/10 flex items-center justify-center text-emerald-400">
                <Award className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-semibold text-text-primary">UID Hash Generated</span>
                <span className="text-[8px] text-text-muted font-mono">SHA-256: 8c3a9f0d...</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "rssb-system",
      title: "RSSB Management System",
      category: "Administrative DBMS",
      tech: ["React.js", "Node.js", "Express.js", "PostgreSQL"],
      features: ["Administrative Automation", "Custom SQL Reporting", "Secure Records", "DB Optimizations"],
      description: "A secure organizational management portal connecting directly to a relational database schema. Automates workflow dispatch, eliminates manual reporting delays, and structures operational statistics.",
      githubUrl: "https://github.com/amitpadhan07",
      liveUrl: "https://github.com/amitpadhan07",
      visualMock: (
        <div className="absolute inset-0 bg-gradient-to-tr from-rose-950/40 to-slate-900 flex flex-col justify-end p-6 border-b border-white/5">
          {/* Mock Datagrid */}
          <div className="flex flex-col gap-2.5 opacity-80 scale-95 origin-bottom-left transition-transform group-hover:scale-[0.98]">
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 px-2 py-1 bg-rose-400/10 border border-rose-400/20 text-rose-400 text-[9px] rounded font-mono uppercase">
                <Database className="w-2.5 h-2.5" /> PostgreSQL Config
              </span>
            </div>
            <div className="p-3 rounded-lg bg-[#0c1222]/80 border border-white/10 max-w-[260px] font-mono text-[8px] text-text-secondary">
              <div className="flex justify-between border-b border-white/5 pb-1 text-text-muted">
                <span>ROW_ID</span>
                <span>JOB_DISPATCH</span>
                <span>STATUS</span>
              </div>
              <div className="flex justify-between py-1">
                <span>#0082</span>
                <span>CSV Upload</span>
                <span className="text-rose-400 font-bold">COMPLETED</span>
              </div>
              <div className="flex justify-between py-0.5 text-text-muted">
                <span>#0083</span>
                <span>Postgres-Sync</span>
                <span>WAITING</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

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
          {projectsList.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="flex"
            >
              <SpotlightCard className="w-full flex flex-col group/project cursor-default">
                {/* Image / Graphic Visual Mockup Area */}
                <div className="relative w-full h-48 border-b border-white/5 bg-slate-950 overflow-hidden">
                  {project.visualMock}
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
                      {project.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-light">
                      {project.description}
                    </p>

                    {/* Features list */}
                    <div className="flex flex-col gap-1.5 my-2">
                      <span className="text-[10px] font-mono uppercase text-text-muted tracking-wider">Core Operations</span>
                      <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                        {project.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-1.5 text-xs text-text-secondary font-light">
                            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Technology badging */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {project.tech.map((tag) => (
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
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider bg-white/5 border border-white/10 text-text-secondary hover:text-text-primary hover:border-white/20 transition-all cursor-pointer"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      Codebase
                    </a>
                    
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 hover:border-primary/40 transition-all cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Live Demo
                    </a>
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
