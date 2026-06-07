"use client";

import { motion, Variants } from "framer-motion";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { Award, Cloud, Database, BrainCircuit, Code, GitBranch, ExternalLink } from "lucide-react";

interface CertificationItem {
  _id: string;
  name: string;
  issuer: string;
  date: string;
  certificateUrl?: string;
  image?: string;
}

interface CertificationsProps {
  certifications?: CertificationItem[];
}

const defaultCertifications: CertificationItem[] = [
  {
    _id: "dbms-nptel",
    name: "NPTEL – Database Management Systems",
    issuer: "National Programme on Technology Enhanced Learning",
    date: "2024",
    certificateUrl: "",
    image: "",
  },
  {
    _id: "aws-cli",
    name: "AWS Cloud CLI Essentials",
    issuer: "Amazon Web Services Cloud Academy",
    date: "2024",
    certificateUrl: "",
    image: "",
  },
  {
    _id: "google-ai",
    name: "Google AI for Data Analysis",
    issuer: "Google AI Credentials",
    date: "2025",
    certificateUrl: "",
    image: "",
  },
];

export default function Certifications({ certifications = [] }: CertificationsProps) {
  const displayCerts = certifications && certifications.length > 0 ? certifications : defaultCertifications;

  const resolveCertMeta = (certName: string, certIssuer: string) => {
    const nameLower = certName.toLowerCase();
    const issuerLower = certIssuer.toLowerCase();

    if (nameLower.includes("database") || nameLower.includes("dbms") || nameLower.includes("sql")) {
      return {
        icon: <Database className="w-5 h-5 text-sky-400" />,
        colorClass: "rgba(56, 189, 248, 0.05)",
        borderColor: "rgba(56, 189, 248, 0.2)",
      };
    }
    if (nameLower.includes("aws") || nameLower.includes("cloud") || issuerLower.includes("amazon")) {
      return {
        icon: <Cloud className="w-5 h-5 text-orange-400" />,
        colorClass: "rgba(251, 146, 60, 0.05)",
        borderColor: "rgba(251, 146, 60, 0.2)",
      };
    }
    if (nameLower.includes("ai") || nameLower.includes("intelligence") || nameLower.includes("machine") || nameLower.includes("learning")) {
      return {
        icon: <BrainCircuit className="w-5 h-5 text-violet-400" />,
        colorClass: "rgba(167, 139, 250, 0.05)",
        borderColor: "rgba(167, 139, 250, 0.2)",
      };
    }
    if (nameLower.includes("git") || nameLower.includes("github") || nameLower.includes("version")) {
      return {
        icon: <GitBranch className="w-5 h-5 text-emerald-400" />,
        colorClass: "rgba(52, 211, 153, 0.05)",
        borderColor: "rgba(52, 211, 153, 0.2)",
      };
    }
    if (nameLower.includes("javascript") || nameLower.includes("python") || nameLower.includes("code") || nameLower.includes("scripting")) {
      return {
        icon: <Code className="w-5 h-5 text-yellow-400" />,
        colorClass: "rgba(250, 204, 21, 0.05)",
        borderColor: "rgba(250, 204, 21, 0.2)",
      };
    }

    return {
      icon: <Award className="w-5 h-5 text-rose-400" />,
      colorClass: "rgba(251, 113, 133, 0.05)",
      borderColor: "rgba(251, 113, 133, 0.2)",
    };
  };

  const container: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } },
  };

  return (
    <section id="certifications" className="py-24 relative overflow-hidden bg-[#0a0f1d]/20">
      {/* Background decoration */}
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

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
            Accreditations
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-gradient"
          >
            Certifications
          </motion.h2>
        </div>

        {/* Certifications Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {displayCerts.map((cert) => {
            const meta = resolveCertMeta(cert.name, cert.issuer);
            return (
              <motion.div key={cert._id} variants={item} className="flex">
                <SpotlightCard
                  spotlightColor={meta.colorClass}
                  borderColor={meta.borderColor}
                  className="p-6 w-full flex flex-col justify-between"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                        {meta.icon}
                      </div>
                      {cert.certificateUrl && (
                        <a
                          href={cert.certificateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#94A3B8] hover:text-sky-400 transition-colors p-1"
                          title="Verify Certificate"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-text-primary leading-snug line-clamp-2">
                        {cert.name}
                      </h3>
                      <p className="text-[10px] text-text-muted mt-1 leading-snug">
                        {cert.issuer}
                      </p>
                      <span className="text-[9px] font-mono text-[#64748B] block mt-2">{cert.date}</span>
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
