"use client";

import { motion, Variants, AnimatePresence } from "framer-motion";
import SpotlightCard from "@/components/ui/SpotlightCard";
import {
  Award,
  Cloud,
  Database,
  BrainCircuit,
  Code,
  GitBranch,
  ExternalLink,
  Eye,
  Download,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  FileText,
} from "lucide-react";
import { useState, useEffect } from "react";

interface CertificationItem {
  _id: string;
  name: string;
  issuer: string;
  date: string;
  certificateUrl?: string;
  image?: string;
  fileType?: "image" | "pdf";
  fileUrl?: string;
  issuerLogo?: string;
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
    fileType: "image",
    fileUrl: "",
    issuerLogo: "",
  },
  {
    _id: "aws-cli",
    name: "AWS Cloud CLI Essentials",
    issuer: "Amazon Web Services Cloud Academy",
    date: "2024",
    certificateUrl: "",
    image: "",
    fileType: "image",
    fileUrl: "",
    issuerLogo: "",
  },
  {
    _id: "google-ai",
    name: "Google AI for Data Analysis",
    issuer: "Google AI Credentials",
    date: "2025",
    certificateUrl: "",
    image: "",
    fileType: "image",
    fileUrl: "",
    issuerLogo: "",
  },
];

export default function Certifications({ certifications = [] }: CertificationsProps) {
  const displayCerts = certifications && certifications.length > 0 ? certifications : defaultCertifications;

  const [activeCert, setActiveCert] = useState<CertificationItem | null>(null);
  const [zoom, setZoom] = useState(1);

  // Close modal helper
  const closeModal = () => {
    setActiveCert(null);
    setZoom(1);
  };

  // Close modal on ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };
    if (activeCert) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeCert]);

  // Handle file downloading
  const handleDownload = async (cert: CertificationItem) => {
    const url = cert.fileUrl || cert.image;
    if (!url) return;

    // Security check: prevent javascript: or malformed URLs
    const lowerUrl = url.trim().toLowerCase();
    if (lowerUrl.startsWith("javascript:") || !lowerUrl.startsWith("http")) {
      alert("Security Block: Invalid download URL.");
      return;
    }

    try {
      // Cloudinary optimized attachment download to bypass CORS & trigger browser download
      if (url.includes("res.cloudinary.com")) {
        const cleanName = cert.name.replace(/[^a-zA-Z0-9]/g, "_");
        const downloadUrl = url.replace("/upload/", `/upload/fl_attachment:${cleanName}/`);
        window.open(downloadUrl, "_blank");
        return;
      }

      // Fallback: Fetch blob download
      const res = await fetch(url, { mode: "cors" });
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      const ext = cert.fileType === "pdf" || lowerUrl.endsWith(".pdf") ? "pdf" : "png";
      a.download = `${cert.name.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase()}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      // Fallback 2: Open in new tab
      window.open(url, "_blank");
    }
  };

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
            const hasFile = !!(cert.fileUrl || cert.image);
            const isPdf = cert.fileType === "pdf" || (cert.fileUrl || "").toLowerCase().endsWith(".pdf");

            return (
              <motion.div key={cert._id} variants={item} className="flex">
                <SpotlightCard
                  spotlightColor={meta.colorClass}
                  borderColor={meta.borderColor}
                  className="p-6 w-full flex flex-col justify-between relative overflow-hidden group"
                >
                  <div className="flex flex-col gap-4 flex-1">
                    {/* Header: Logo OR fallback dynamic icon */}
                    <div className="flex items-center justify-between">
                      {cert.issuerLogo ? (
                        <div className="h-10 flex items-center justify-start max-w-[130px] rounded-md overflow-hidden bg-white/5 border border-white/10 px-2 py-1">
                          <img
                            src={cert.issuerLogo}
                            alt={`${cert.issuer} Logo`}
                            className="h-full w-auto object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                          {meta.icon}
                        </div>
                      )}


                    </div>

                    {/* Body */}
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-text-primary leading-snug line-clamp-2">
                        {cert.name}
                      </h3>
                      <p className="text-[10px] text-text-muted mt-1 leading-snug font-medium">
                        {cert.issuer}
                      </p>
                      <span className="text-[9px] font-mono text-[#64748B] block mt-2">{cert.date}</span>
                    </div>
                  </div>

                  {/* Actions Redesign */}
                  <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-5 text-[11px] font-semibold">
                    {hasFile ? (
                      <button
                        onClick={() => setActiveCert(cert)}
                        className="text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1 cursor-pointer"
                        title="Preview Certificate"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </button>
                    ) : (
                      <span className="text-[#475569] flex items-center gap-1 cursor-not-allowed">
                        <Eye className="w-3.5 h-3.5 opacity-40" />
                        <span>Preview</span>
                      </span>
                    )}

                    {cert.certificateUrl ? (
                      <a
                        href={cert.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1"
                        title="Verify Certificate URL"
                      >
                        <span>Verify</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-[#475569] flex items-center gap-1 cursor-not-allowed" title="No verification link provided">
                        <span>Verify</span>
                      </span>
                    )}

                    {hasFile ? (
                      <button
                        onClick={() => handleDownload(cert)}
                        className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 cursor-pointer"
                        title="Download Certificate File"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    ) : (
                      <span className="text-[#475569] flex items-center gap-1 cursor-not-allowed">
                        <Download className="w-3.5 h-3.5 opacity-40" />
                        <span>Download</span>
                      </span>
                    )}
                  </div>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Certificate Preview Modal */}
      <AnimatePresence>
        {activeCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-6"
            onClick={closeModal}
            role="presentation"
          >
            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-[#0B0F1E] border border-white/10 w-full max-w-[1000px] rounded-2xl shadow-2xl flex flex-col relative overflow-hidden max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={`Certificate preview for ${activeCert.name}`}
            >
              {/* Header */}
              <div className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-[#090D18]">
                <div className="flex items-center gap-3 min-w-0 pr-4">
                  {activeCert.issuerLogo ? (
                    <img
                      src={activeCert.issuerLogo}
                      alt={activeCert.issuer}
                      className="h-8 w-auto object-contain bg-white/5 border border-white/10 px-1.5 py-0.5 rounded"
                    />
                  ) : (
                    <Award className="w-5 h-5 text-sky-400 flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <h2 className="font-bold text-sm text-[#F8FAFC] truncate leading-tight">
                      {activeCert.name}
                    </h2>
                    <p className="text-[10px] text-[#94A3B8] font-light truncate">
                      {activeCert.issuer} &bull; {activeCert.date}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 text-[#94A3B8] hover:text-[#F8FAFC] bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg transition-all cursor-pointer flex-shrink-0"
                  aria-label="Close Preview"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Viewer Area */}
              <div className="flex-1 w-full bg-slate-950/40 overflow-hidden relative flex flex-col items-center justify-center min-h-[40vh] md:min-h-[60vh]">
                {activeCert.fileType === "pdf" || (activeCert.fileUrl || "").toLowerCase().endsWith(".pdf") ? (
                  /* PDF Embedded View */
                  <div className="w-full h-[55vh] md:h-[65vh] p-2 bg-slate-950">
                    <iframe
                      src={activeCert.fileUrl || activeCert.image}
                      className="w-full h-full rounded-lg border border-white/5 bg-slate-950"
                      title={`Credential PDF: ${activeCert.name}`}
                    />
                  </div>
                ) : (
                  /* Image Preview with Zoom Controls */
                  <div className="w-full h-[55vh] md:h-[65vh] overflow-auto flex items-center justify-center p-6 bg-slate-950/30">
                    <div className="max-w-full max-h-full transition-transform duration-200" style={{ transform: `scale(${zoom})` }}>
                      <img
                        src={activeCert.fileUrl || activeCert.image}
                        alt={activeCert.name}
                        className="max-w-full max-h-[50vh] md:max-h-[60vh] object-contain rounded border border-white/5 shadow-2xl"
                      />
                    </div>

                    {/* Image Zoom Controllers */}
                    <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-slate-900/90 border border-white/10 p-1.5 rounded-xl shadow-2xl z-10">
                      <button
                        onClick={() => setZoom((prev) => Math.min(prev + 0.25, 3.0))}
                        className="p-1.5 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5 rounded-lg transition-all cursor-pointer"
                        title="Zoom In"
                        aria-label="Zoom In"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setZoom((prev) => Math.max(prev - 0.25, 1.0))}
                        className="p-1.5 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5 rounded-lg transition-all cursor-pointer"
                        title="Zoom Out"
                        aria-label="Zoom Out"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setZoom(1.0)}
                        className="p-1.5 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5 rounded-lg transition-all cursor-pointer"
                        title="Reset Zoom"
                        aria-label="Reset Zoom"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="h-16 border-t border-white/5 bg-[#090D18] flex items-center justify-between px-6">
                <div className="flex items-center gap-1.5 text-[10px] text-[#64748B] font-mono">
                  {activeCert.fileType === "pdf" || (activeCert.fileUrl || "").toLowerCase().endsWith(".pdf") ? (
                    <>
                      <FileText className="w-3.5 h-3.5 text-rose-400" />
                      <span>PDF Verification Format</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-sky-400" />
                      <span>Image Badge Format</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {activeCert.certificateUrl && (
                    <a
                      href={activeCert.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-white/10 hover:border-white/20 text-[#94A3B8] hover:text-[#F8FAFC] transition-all"
                    >
                      <span>Verify Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  <button
                    onClick={() => handleDownload(activeCert)}
                    className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-sky-400 to-violet-500 hover:from-sky-500 hover:to-violet-600 text-white font-semibold transition-all shadow-lg shadow-sky-500/10 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Certificate</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
