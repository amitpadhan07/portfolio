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
  icon: React.ReactNode;
  colorClass: string;
  borderColor: string;
  skills: SkillItem[];
}

const categoryMetaMap: Record<string, { title: string; icon: React.ReactNode; colorClass: string; borderColor: string }> = {
  Frontend: {
    title: "Frontend Development",
    icon: <Monitor className="w-5 h-5 text-sky-400" />,
    colorClass: "rgba(56, 189, 248, 0.08)",
    borderColor: "rgba(56, 189, 248, 0.3)",
  },
  Backend: {
    title: "Backend Services",
    icon: <Server className="w-5 h-5 text-violet-400" />,
    colorClass: "rgba(139, 92, 246, 0.08)",
    borderColor: "rgba(139, 92, 246, 0.3)",
  },
  Database: {
    title: "Databases & Storage",
    icon: <Database className="w-5 h-5 text-emerald-400" />,
    colorClass: "rgba(52, 211, 153, 0.08)",
    borderColor: "rgba(52, 211, 153, 0.3)",
  },
  Programming: {
    title: "Languages & OOP Core",
    icon: <Terminal className="w-5 h-5 text-amber-400" />,
    colorClass: "rgba(245, 158, 11, 0.08)",
    borderColor: "rgba(245, 158, 11, 0.3)",
  },
  "AI/ML": {
    title: "AI & Machine Learning",
    icon: <BrainCircuit className="w-5 h-5 text-rose-400" />,
    colorClass: "rgba(251, 113, 133, 0.08)",
    borderColor: "rgba(251, 113, 133, 0.3)",
  },
  Cloud: {
    title: "Cloud & Devops",
    icon: <Cloud className="w-5 h-5 text-blue-400" />,
    colorClass: "rgba(96, 165, 250, 0.08)",
    borderColor: "rgba(96, 165, 250, 0.3)",
  },
};

const defaultCategories: SkillCategory[] = [
  {
    title: "Frontend Development",
    icon: <Monitor className="w-5 h-5 text-sky-400" />,
    colorClass: "rgba(56, 189, 248, 0.08)",
    borderColor: "rgba(56, 189, 248, 0.3)",
    skills: [
      { name: "React.js", category: "Frontend", level: "Advanced" },
      { name: "Next.js", category: "Frontend", level: "Advanced" },
      { name: "HTML5 & CSS3", category: "Frontend", level: "Advanced" },
      { name: "Tailwind CSS", category: "Frontend", level: "Advanced" },
    ],
  },
  {
    title: "Backend Services",
    icon: <Server className="w-5 h-5 text-violet-400" />,
    colorClass: "rgba(139, 92, 246, 0.08)",
    borderColor: "rgba(139, 92, 246, 0.3)",
    skills: [
      { name: "Node.js", category: "Backend", level: "Advanced" },
      { name: "Express.js", category: "Backend", level: "Advanced" },
    ],
  },
  {
    title: "Databases & Storage",
    icon: <Database className="w-5 h-5 text-emerald-400" />,
    colorClass: "rgba(52, 211, 153, 0.08)",
    borderColor: "rgba(52, 211, 153, 0.3)",
    skills: [
      { name: "MongoDB", category: "Database", level: "Advanced" },
      { name: "PostgreSQL / SQL", category: "Database", level: "Intermediate" },
    ],
  },
  {
    title: "Languages & OOP Core",
    icon: <Terminal className="w-5 h-5 text-amber-400" />,
    colorClass: "rgba(245, 158, 11, 0.08)",
    borderColor: "rgba(245, 158, 11, 0.3)",
    skills: [
      { name: "JavaScript", category: "Programming", level: "Advanced" },
      { name: "TypeScript", category: "Programming", level: "Advanced" },
      { name: "Python", category: "Programming", level: "Advanced" },
      { name: "Java / C++", category: "Programming", level: "Intermediate" },
    ],
  },
  {
    title: "AI & Machine Learning",
    icon: <BrainCircuit className="w-5 h-5 text-rose-400" />,
    colorClass: "rgba(251, 113, 133, 0.08)",
    borderColor: "rgba(251, 113, 133, 0.3)",
    skills: [
      { name: "Machine Learning", category: "AI/ML", level: "Intermediate" },
      { name: "NLP Fundamentals", category: "AI/ML", level: "Intermediate" },
      { name: "Generative AI", category: "AI/ML", level: "Intermediate" },
      { name: "LLMs / Prompting", category: "AI/ML", level: "Intermediate" },
    ],
  },
];

const iconMap: Record<string, React.ComponentType<any>> = {
  monitor: Monitor,
  server: Server,
  terminal: Terminal,
  braincircuit: BrainCircuit,
  star: Star,
  database: Database,
  cloud: Cloud,
  code: Code,
  atom: Atom,
  blocks: Blocks,
  layout: Layout,
  sparkles: Sparkles,
  gitbranch: GitBranch,
  braces: Braces,
  binary: Binary,
  messagesquare: MessageSquare,
  wand2: Wand2,
  cpu: Cpu,
  layers: Layers,
  network: Network,
  globe: Globe,
  settings: Settings,
  workflow: Workflow
};

function getSkillIcon(skillName: string, iconName?: string) {
  const normalizedIcon = (iconName || "").trim().toLowerCase();
  if (normalizedIcon && iconMap[normalizedIcon]) {
    return iconMap[normalizedIcon];
  }

  // Fallback to name-based lookup
  const name = skillName.toLowerCase();
  if (name.includes("react")) return Atom;
  if (name.includes("next")) return Blocks;
  if (name.includes("html") || name.includes("css")) return Layout;
  if (name.includes("tailwind")) return Sparkles;
  if (name.includes("node")) return Server;
  if (name.includes("express")) return GitBranch;
  if (name.includes("mongo") || name.includes("sql") || name.includes("db") || name.includes("postgres")) return Database;
  if (name.includes("javascript") || name.includes("typescript") || name.includes("js") || name.includes("ts")) return Braces;
  if (name.includes("python")) return Binary;
  if (name.includes("java") || name.includes("c++") || name.includes("c#")) return Terminal;
  if (name.includes("machine learning") || name.includes("ml")) return BrainCircuit;
  if (name.includes("nlp") || name.includes("natural language")) return MessageSquare;
  if (name.includes("generative") || name.includes("genai") || name.includes("prompt")) return Wand2;
  if (name.includes("cloud") || name.includes("aws") || name.includes("devops")) return Cloud;

  return Code; // default fallback
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
          icon: <Terminal className="w-5 h-5" />,
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
                className="p-8 w-full flex flex-col justify-between"
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                      {category.icon}
                    </div>
                    <h3 className="text-lg font-bold text-text-primary">{category.title}</h3>
                  </div>

                  {/* Skills tags and descriptions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {category.skills.map((skill) => {
                      const IconComponent = getSkillIcon(skill.name, skill.icon);
                      return (
                        <div
                          key={skill.name}
                          className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all"
                        >
                          <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-primary/80 transition-colors group-hover:text-primary">
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-semibold text-text-primary">{skill.name}</span>
                            <div className="flex items-center gap-1 text-[10px] text-text-muted font-mono uppercase">
                              <Star className="w-2.5 h-2.5 fill-primary text-primary" />
                              <span>{skill.level}</span>
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
