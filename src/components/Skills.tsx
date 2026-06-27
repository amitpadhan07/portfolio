"use client";

import { motion, Variants } from "framer-motion";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { 
  Monitor, 
  Server, 
  Terminal, 
  BrainCircuit, 
  Star, 
  Database, 
  Cloud,
  Code,
  Atom,
  Blocks,
  Layout,
  Sparkles,
  GitBranch,
  Braces,
  Binary,
  MessageSquare,
  Wand2,
  Cpu,
  Layers,
  Network,
  Globe,
  Settings,
  Workflow
} from "lucide-react";

interface SkillItem {
  name: string;
  icon?: string;
  category: "Frontend" | "Backend" | "Database" | "Programming" | "AI/ML" | "Cloud";
  level: "Advanced" | "Intermediate" | "Familiar";
  order?: number;
}

interface SkillsProps {
  skills?: SkillItem[];
}

interface SkillCategory {
  title: string;
  icon: string | React.ReactNode;
  colorClass: string;
  borderColor: string;
  skills: SkillItem[];
}

const categoryMetaMap: Record<string, { title: string; icon: string | React.ReactNode; colorClass: string; borderColor: string }> = {
  Frontend: {
    title: "Frontend Development",
    icon: "https://cdn.simpleicons.org/react/61DAFB",
    colorClass: "rgba(56, 189, 248, 0.08)",
    borderColor: "border-blue-500/30",
  },
  Backend: {
    title: "Backend Services",
    icon: "https://cdn.simpleicons.org/nodedotjs/339933",
    colorClass: "rgba(139, 92, 246, 0.08)",
    borderColor: "border-purple-500/20",
  },
  Database: {
    title: "Databases & Storage",
    icon: "https://cdn.simpleicons.org/mongodb/47A248",
    colorClass: "rgba(52, 211, 153, 0.08)",
    borderColor: "border-emerald-500/20",
  },
  Programming: {
    title: "Languages & OOP Core",
    icon: "https://cdn.simpleicons.org/javascript/F7DF1E",
    colorClass: "rgba(245, 158, 11, 0.08)",
    borderColor: "border-amber-500/20",
  },
  "AI/ML": {
    title: "AI & Machine Learning",
    icon: "https://cdn.simpleicons.org/scikitlearn/F89939",
    colorClass: "rgba(251, 113, 133, 0.08)",
    borderColor: "border-pink-500/20",
  },
  Cloud: {
    title: "Cloud & Devops",
    icon: "https://cdn.simpleicons.org/amazonwebservices/FF9900",
    colorClass: "rgba(96, 165, 250, 0.08)",
    borderColor: "border-blue-500/20",
  },
};

const defaultCategories: SkillCategory[] = [
  {
    title: "Frontend Development",
    icon: "https://cdn.simpleicons.org/react/61DAFB",
    colorClass: "rgba(56, 189, 248, 0.08)",
    borderColor: "border-blue-500/30",
    skills: [
      { name: "React.js", category: "Frontend", level: "Advanced", icon: "https://cdn.simpleicons.org/react/61DAFB" },
      { name: "Next.js", category: "Frontend", level: "Advanced", icon: "https://cdn.simpleicons.org/nextdotjs/ffffff" },
      { name: "HTML5 & CSS3", category: "Frontend", level: "Advanced", icon: "https://cdn.simpleicons.org/html5/E34F26" },
      { name: "Tailwind CSS", category: "Frontend", level: "Advanced", icon: "https://cdn.simpleicons.org/tailwindcss/06B6D4" },
    ],
  },
  {
    title: "Backend Services",
    icon: "https://cdn.simpleicons.org/nodedotjs/339933",
    colorClass: "rgba(139, 92, 246, 0.08)",
    borderColor: "border-purple-500/20",
    skills: [
      { name: "Node.js", category: "Backend", level: "Advanced", icon: "https://cdn.simpleicons.org/nodedotjs/339933" },
      { name: "Express.js", category: "Backend", level: "Advanced", icon: "https://cdn.simpleicons.org/express/ffffff" },
    ],
  },
  {
    title: "Databases & Storage",
    icon: "https://cdn.simpleicons.org/mongodb/47A248",
    colorClass: "rgba(52, 211, 153, 0.08)",
    borderColor: "border-emerald-500/20",
    skills: [
      { name: "MongoDB", category: "Database", level: "Advanced", icon: "https://cdn.simpleicons.org/mongodb/47A248" },
      { name: "PostgreSQL / SQL", category: "Database", level: "Intermediate", icon: "https://cdn.simpleicons.org/postgresql/4169E1" },
    ],
  },
  {
    title: "Languages & OOP Core",
    icon: "https://cdn.simpleicons.org/javascript/F7DF1E",
    colorClass: "rgba(245, 158, 11, 0.08)",
    borderColor: "border-amber-500/20",
    skills: [
      { name: "JavaScript", category: "Programming", level: "Advanced", icon: "https://cdn.simpleicons.org/javascript/F7DF1E" },
      { name: "TypeScript", category: "Programming", level: "Advanced", icon: "https://cdn.simpleicons.org/typescript/3178C6" },
      { name: "Python", category: "Programming", level: "Advanced", icon: "https://cdn.simpleicons.org/python/3776AB" },
      { name: "Java / C++", category: "Programming", level: "Intermediate", icon: "https://cdn.simpleicons.org/openjdk/EA2D2E" },
    ],
  },
  {
    title: "AI & Machine Learning",
    icon: "https://cdn.simpleicons.org/scikitlearn/F89939",
    colorClass: "rgba(251, 113, 133, 0.08)",
    borderColor: "border-pink-500/20",
    skills: [
      { name: "Machine Learning", category: "AI/ML", level: "Intermediate", icon: "https://cdn.simpleicons.org/tensorflow/FF6F00" },
      { name: "NLP Fundamentals", category: "AI/ML", level: "Intermediate", icon: "https://cdn.simpleicons.org/huggingface/FFD21E" },
      { name: "Generative AI", category: "AI/ML", level: "Intermediate", icon: "https://cdn.simpleicons.org/openai/412991" },
      { name: "LLMs / Prompting", category: "AI/ML", level: "Intermediate", icon: "https://cdn.simpleicons.org/anthropic/CC9B7A" },
    ],
  },
];

function getSkillIconUrl(skillName: string, iconFromDb?: string): string {
  // If the DB icon is already a URL, return it directly
  if (iconFromDb && (iconFromDb.startsWith("http://") || iconFromDb.startsWith("https://"))) {
    return iconFromDb;
  }

  const dbIcon = (iconFromDb || "").trim().toLowerCase();
  const name = skillName.trim().toLowerCase();

  const slugMap: Record<string, { slug: string; color: string }> = {
    react: { slug: "react", color: "61DAFB" },
    reactjs: { slug: "react", color: "61DAFB" },
    next: { slug: "nextdotjs", color: "ffffff" },
    nextjs: { slug: "nextdotjs", color: "ffffff" },
    nextdotjs: { slug: "nextdotjs", color: "ffffff" },
    html: { slug: "html5", color: "E34F26" },
    html5: { slug: "html5", color: "E34F26" },
    css: { slug: "css3", color: "1572B6" },
    css3: { slug: "css3", color: "1572B6" },
    tailwind: { slug: "tailwindcss", color: "06B6D4" },
    tailwindcss: { slug: "tailwindcss", color: "06B6D4" },
    node: { slug: "nodedotjs", color: "339933" },
    nodejs: { slug: "nodedotjs", color: "339933" },
    nodedotjs: { slug: "nodedotjs", color: "339933" },
    express: { slug: "express", color: "ffffff" },
    expressjs: { slug: "express", color: "ffffff" },
    mongo: { slug: "mongodb", color: "47A248" },
    mongodb: { slug: "mongodb", color: "47A248" },
    postgres: { slug: "postgresql", color: "4169E1" },
    postgresql: { slug: "postgresql", color: "4169E1" },
    sql: { slug: "postgresql", color: "4169E1" },
    javascript: { slug: "javascript", color: "F7DF1E" },
    js: { slug: "javascript", color: "F7DF1E" },
    typescript: { slug: "typescript", color: "3178C6" },
    ts: { slug: "typescript", color: "3178C6" },
    python: { slug: "python", color: "3776AB" },
    java: { slug: "openjdk", color: "EA2D2E" },
    cplusplus: { slug: "cplusplus", color: "00599C" },
    "c++": { slug: "cplusplus", color: "00599C" },
    tensorflow: { slug: "tensorflow", color: "FF6F00" },
    huggingface: { slug: "huggingface", color: "FFD21E" },
    openai: { slug: "openai", color: "412991" },
    anthropic: { slug: "anthropic", color: "CC9B7A" },
    git: { slug: "git", color: "F05032" },
    github: { slug: "github", color: "ffffff" },
    aws: { slug: "amazonwebservices", color: "FF9900" },
    docker: { slug: "docker", color: "2496ED" }
  };

  // 1. Try to find in slugMap using dbIcon
  if (dbIcon && slugMap[dbIcon]) {
    return `https://cdn.simpleicons.org/${slugMap[dbIcon].slug}/${slugMap[dbIcon].color}`;
  }

  // 2. Try to match name-based lookup
  for (const key of Object.keys(slugMap)) {
    if (name.includes(key)) {
      return `https://cdn.simpleicons.org/${slugMap[key].slug}/${slugMap[key].color}`;
    }
  }

  // 3. Fallback: if dbIcon is a simple slug word, try it directly
  if (dbIcon && /^[a-z0-9]+$/i.test(dbIcon)) {
    return `https://cdn.simpleicons.org/${dbIcon}`;
  }

  return "https://cdn.simpleicons.org/code/38bdf8";
}

export default function Skills({ skills = [] }: SkillsProps) {
  // Dynamically group skills by category if list is not empty
  let categories: SkillCategory[] = [];

  if (skills && skills.length > 0) {
    const grouped: Record<string, SkillItem[]> = {};
    skills.forEach((skill) => {
      if (!grouped[skill.category]) {
        grouped[skill.category] = [];
      }
      grouped[skill.category].push(skill);
    });

    // Sort key lists for stable presentation
    const orderedKeys = ["Frontend", "Backend", "Database", "Programming", "AI/ML", "Cloud"];
    orderedKeys.forEach((key) => {
      if (grouped[key] && grouped[key].length > 0) {
        const meta = categoryMetaMap[key] || {
          title: key,
          icon: "https://cdn.simpleicons.org/code/38bdf8",
          colorClass: "rgba(255,255,255,0.03)",
          borderColor: "rgba(255,255,255,0.1)",
        };
        categories.push({
          title: meta.title,
          icon: meta.icon,
          colorClass: meta.colorClass,
          borderColor: meta.borderColor,
          skills: grouped[key].sort((a, b) => (a.order || 0) - (b.order || 0)),
        });
      }
    });
  } else {
    categories = defaultCategories;
  }

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
  };

  return (
    <section id="skills" className="py-24 relative overflow-hidden bg-[#0a0f1d]/10">
      {/* Background decorations */}
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Title */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] uppercase tracking-widest font-mono mb-3"
          >
            Capabilities
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-gradient"
          >
            Technical Skill Set
          </motion.h2>
        </div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {categories.map((category) => (
            <motion.div key={category.title} variants={cardVariants} className="flex">
              <SpotlightCard
                spotlightColor={category.colorClass}
                borderColor={category.borderColor}
                className={`p-6 w-full flex flex-col justify-between bg-[#0f172a]/60 border rounded-xl backdrop-blur-sm`}
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-[#1e293b] rounded-lg border border-slate-700/50 flex items-center justify-center w-10 h-10 flex-shrink-0">
                      {typeof category.icon === "string" && category.icon.startsWith("http") ? (
                        <img 
                          src={category.icon} 
                          alt={category.title} 
                          className="w-5 h-5 object-contain"
                          loading="lazy"
                        />
                      ) : (
                        category.icon
                      )}
                    </div>
                    <h3 className="text-lg font-semibold tracking-wide text-slate-200">
                      {category.title}
                    </h3>
                  </div>

                  {/* Skills tags and descriptions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {category.skills.map((skill) => {
                      const iconUrl = getSkillIconUrl(skill.name, skill.icon);
                      return (
                        <div
                          key={skill.name}
                          className="flex items-center gap-3 bg-[#131c2e]/80 border border-slate-800/60 rounded-xl p-3 hover:border-slate-700 transition-colors animate-float-slow"
                        >
                          <div className="p-2 bg-[#1e293b]/60 rounded-lg border border-slate-800 flex items-center justify-center w-9 h-9 flex-shrink-0">
                            <img 
                              src={iconUrl} 
                              alt={skill.name} 
                              className="w-5 h-5 object-contain"
                              loading="lazy"
                            />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-200">{skill.name}</div>
                            <div className="flex items-center gap-1 mt-0.5">
                              <Star className="w-3 h-3 fill-blue-400 text-blue-400" />
                              <span className="text-[10px] font-bold tracking-wider text-slate-400">
                                {skill.level}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
